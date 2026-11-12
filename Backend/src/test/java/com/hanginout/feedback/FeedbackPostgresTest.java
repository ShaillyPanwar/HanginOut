package com.hanginout.feedback;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.repository.ActivityRepository;
import com.hanginout.common.security.JwtTokenProvider;
import com.hanginout.feedback.dto.CreateFeedbackRequest;
import com.hanginout.feedback.entity.Feedback;
import com.hanginout.feedback.repository.FeedbackRepository;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("local-postgres")
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:postgresql://localhost:5432/hanginout",
        "spring.datasource.username=postgres",
        "spring.datasource.password=000000"
})
class FeedbackPostgresTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    private User testUser;
    private Activity testActivity;
    private String token;

    @BeforeEach
    void setUp() {
        testUser = userRepository.findByEmail("admin@hanginout.com")
                .orElseGet(() -> {
                    User u = new User("admin@hanginout.com", "hash123", "Admin User", LocalDate.of(1995, 1, 1), "Delhi", "ROLE_ADMIN");
                    return userRepository.save(u);
                });
        if (testUser.getDateOfBirth() == null) {
            testUser.setDateOfBirth(LocalDate.of(1995, 1, 1));
            testUser = userRepository.save(testUser);
        }
        token = jwtTokenProvider.generateToken(testUser.getEmail(), testUser.getId(), testUser.getName(), testUser.getRole());

        testActivity = activityRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No activity found for test"));
    }

    @Test
    @DisplayName("Should submit and upsert feedback on PostgreSQL without duplicates")
    void shouldUpsertFeedbackOnPostgres() throws Exception {
        // Initial submission
        CreateFeedbackRequest req1 = new CreateFeedbackRequest(
                testActivity.getId(),
                null,
                4,
                true,
                "Great spot discovered via HanginOut!",
                LocalDate.now()
        );

        mockMvc.perform(post("/api/activities/" + testActivity.getId() + "/feedback")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.rating").value(4));

        // Retrieve my feedback
        mockMvc.perform(get("/api/activities/" + testActivity.getId() + "/feedback/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.rating").value(4));

        // Submit updated rating (should update existing)
        CreateFeedbackRequest req2 = new CreateFeedbackRequest(
                testActivity.getId(),
                null,
                5,
                true,
                "Updated: Absolutely loved it on second visit!",
                LocalDate.now()
        );

        mockMvc.perform(post("/api/activities/" + testActivity.getId() + "/feedback")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.rating").value(5))
                .andExpect(jsonPath("$.data.comment").value("Updated: Absolutely loved it on second visit!"));

        // Check summary
        mockMvc.perform(get("/api/activities/" + testActivity.getId() + "/feedback/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.hasReviews").value(true))
                .andExpect(jsonPath("$.data.averageRating").isNumber());
    }
}
