package com.hanginout.activity;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanginout.auth.dto.LoginRequest;
import com.hanginout.preference.dto.UpdatePreferenceRequest;
import com.hanginout.swipe.dto.SwipeRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Set;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class DiscoveryAndSwipeTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private static String jwtToken;

    @BeforeEach
    void setupToken() throws Exception {
        if (jwtToken == null) {
            // Log in with user registered in AuthControllerTest or register new test user
            LoginRequest login = new LoginRequest("aarav@student.edu", "secret123");
            MvcResult result = mockMvc.perform(post("/api/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(login)))
                    .andReturn();

            if (result.getResponse().getStatus() == 200) {
                String body = result.getResponse().getContentAsString();
                jwtToken = objectMapper.readTree(body).path("data").path("token").asText();
            } else {
                // Register freshly
                String regPayload = "{\"name\":\"Test Student\",\"email\":\"test.student@univ.edu\",\"password\":\"pass1234\",\"age\":20,\"city\":\"Delhi\"}";
                MvcResult regRes = mockMvc.perform(post("/api/auth/register")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(regPayload))
                        .andExpect(status().isCreated())
                        .andReturn();
                jwtToken = objectMapper.readTree(regRes.getResponse().getContentAsString()).path("data").path("token").asText();
            }
        }
    }

    @Test
    @Order(1)
    void shouldFetchAllCategories() throws Exception {
        mockMvc.perform(get("/api/activities/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data", hasSize(greaterThanOrEqualTo(8))))
                .andExpect(jsonPath("$.data[0].name").exists());
    }

    @Test
    @Order(2)
    void shouldUpdateAndRetrieveUserPreferences() throws Exception {
        UpdatePreferenceRequest request = new UpdatePreferenceRequest(
                "Under ₹300",
                "Friends",
                "1-2 hours",
                "Delhi",
                Set.of(1L, 2L)
        );

        mockMvc.perform(put("/api/preferences")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.maxBudget").value("Under ₹300"))
                .andExpect(jsonPath("$.data.preferredGroupType").value("Friends"))
                .andExpect(jsonPath("$.data.interests", hasSize(2)));

        mockMvc.perform(get("/api/preferences")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.maxBudget").value("Under ₹300"));
    }

    @Test
    @Order(3)
    void shouldFetchRecommendedActivitiesRankedByRelevance() throws Exception {
        mockMvc.perform(get("/api/activities/recommended")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data", hasSize(greaterThan(0))))
                .andExpect(jsonPath("$.data[0].score").isNumber())
                .andExpect(jsonPath("$.data[0].title").exists());
    }

    @Test
    @Order(4)
    void shouldFetchActivityDetailsWithGalleryAndSpots() throws Exception {
        mockMvc.perform(get("/api/activities/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.imageGallery", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.associatedSpots", hasSize(greaterThanOrEqualTo(1))));
    }

    @Test
    @Order(5)
    void shouldRecordSwipeAndExcludeFromFutureRecommendations() throws Exception {
        SwipeRequest swipe = new SwipeRequest(1L, "LIKE");

        mockMvc.perform(post("/api/swipes")
                        .header("Authorization", "Bearer " + jwtToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(swipe)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.action").value("LIKE"))
                .andExpect(jsonPath("$.data.activityId").value(1));

        // Activity 1 should now be excluded from recommendations
        mockMvc.perform(get("/api/activities/recommended")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[*].id", not(hasItem(1))));
    }

    @Test
    @Order(6)
    void shouldSaveAndRetrieveSavedActivities() throws Exception {
        mockMvc.perform(post("/api/saved/2")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.activity.id").value(2));

        mockMvc.perform(get("/api/saved")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.content", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$.data.content[0].activity.id").value(2));

        // Unsave
        mockMvc.perform(delete("/api/saved/2")
                        .header("Authorization", "Bearer " + jwtToken))
                .andExpect(status().isOk());
    }
}
