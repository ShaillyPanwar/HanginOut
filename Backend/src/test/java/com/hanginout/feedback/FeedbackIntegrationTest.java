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
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class FeedbackIntegrationTest {

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

    private User user1;
    private User user2;
    private Activity testActivity;
    private String token1;
    private String token2;

    @BeforeEach
    void setUp() {
        // Clean feedback
        feedbackRepository.deleteAll();

        // Ensure user 1
        user1 = userRepository.findByEmail("feedback_user1@test.com")
                .orElseGet(() -> {
                    User u = new User("feedback_user1@test.com", "hash123", "User One", LocalDate.of(2000, 1, 1), "Delhi", "ROLE_USER");
                    return userRepository.save(u);
                });
        token1 = jwtTokenProvider.generateToken(user1.getEmail(), user1.getId(), user1.getName(), user1.getRole());

        // Ensure user 2
        user2 = userRepository.findByEmail("feedback_user2@test.com")
                .orElseGet(() -> {
                    User u = new User("feedback_user2@test.com", "hash123", "User Two", LocalDate.of(1999, 5, 5), "Delhi", "ROLE_USER");
                    return userRepository.save(u);
                });
        token2 = jwtTokenProvider.generateToken(user2.getEmail(), user2.getId(), user2.getName(), user2.getRole());

        // Ensure activity
        testActivity = activityRepository.findAll().stream().findFirst()
                .orElseThrow(() -> new IllegalStateException("No activity found for test"));
    }

    @Test
    @DisplayName("User can submit feedback with rating, review, and visit date")
    void shouldSubmitFeedbackSuccessfully() throws Exception {
        CreateFeedbackRequest request = new CreateFeedbackRequest(
                testActivity.getId(),
                null,
                5,
                true,
                "Amazing experience with friends! Great music and vibes.",
                LocalDate.now().minusDays(2)
        );

        mockMvc.perform(post("/api/activities/" + testActivity.getId() + "/feedback")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value(200))
                .andExpect(jsonPath("$.data.rating").value(5))
                .andExpect(jsonPath("$.data.comment").value("Amazing experience with friends! Great music and vibes."))
                .andExpect(jsonPath("$.data.activityId").value(testActivity.getId()))
                .andExpect(jsonPath("$.data.userId").value(user1.getId()));

        assertEquals(1, feedbackRepository.count());
    }

    @Test
    @DisplayName("Validation fails when rating is out of 1-5 range")
    void shouldRejectInvalidRating() throws Exception {
        CreateFeedbackRequest request = new CreateFeedbackRequest(
                testActivity.getId(),
                null,
                6, // invalid > 5
                true,
                "Invalid rating test",
                LocalDate.now()
        );

        mockMvc.perform(post("/api/activities/" + testActivity.getId() + "/feedback")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Submitting feedback twice updates existing record instead of creating duplicates")
    void shouldUpdateFeedbackOnSecondSubmissionWithoutDuplication() throws Exception {
        // First submission
        CreateFeedbackRequest req1 = new CreateFeedbackRequest(
                testActivity.getId(),
                null,
                3,
                true,
                "Initial impression was decent",
                LocalDate.now().minusDays(10)
        );

        mockMvc.perform(post("/api/activities/" + testActivity.getId() + "/feedback")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.rating").value(3));

        assertEquals(1, feedbackRepository.count());

        // Second submission by the same user on the same activity
        CreateFeedbackRequest req2 = new CreateFeedbackRequest(
                testActivity.getId(),
                null,
                5,
                true,
                "Visited again, completely changed my mind! 5 stars!",
                LocalDate.now().minusDays(1)
        );

        mockMvc.perform(post("/api/activities/" + testActivity.getId() + "/feedback")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.rating").value(5))
                .andExpect(jsonPath("$.data.comment").value("Visited again, completely changed my mind! 5 stars!"));

        // MUST still be exactly 1 feedback row
        assertEquals(1, feedbackRepository.count());

        Feedback stored = feedbackRepository.findByUserIdAndActivityId(user1.getId(), testActivity.getId()).orElseThrow();
        assertEquals(5, stored.getRating());
        assertEquals("Visited again, completely changed my mind! 5 stars!", stored.getComment());
    }

    @Test
    @DisplayName("GET /api/activities/{id}/feedback/me returns authenticated user's feedback")
    void shouldGetMyFeedback() throws Exception {
        // No feedback yet
        mockMvc.perform(get("/api/activities/" + testActivity.getId() + "/feedback/me")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data").value(nullValue()));

        // Submit feedback
        CreateFeedbackRequest req = new CreateFeedbackRequest(
                testActivity.getId(), null, 4, true, "Good spot", LocalDate.now());
        mockMvc.perform(post("/api/activities/" + testActivity.getId() + "/feedback")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk());

        // Retrieve my feedback
        mockMvc.perform(get("/api/activities/" + testActivity.getId() + "/feedback/me")
                        .header("Authorization", "Bearer " + token1))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.rating").value(4))
                .andExpect(jsonPath("$.data.comment").value("Good spot"));
    }

    @Test
    @DisplayName("Multiple users have independent feedback and cannot edit other users' feedback")
    void shouldAllowIndependentFeedbackAndPreventUnauthorizedEdit() throws Exception {
        // User 1 submits 4 stars
        CreateFeedbackRequest req1 = new CreateFeedbackRequest(
                testActivity.getId(), null, 4, true, "User 1 review", LocalDate.now());
        mockMvc.perform(post("/api/activities/" + testActivity.getId() + "/feedback")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isOk());

        // User 2 submits 2 stars on same activity
        CreateFeedbackRequest req2 = new CreateFeedbackRequest(
                testActivity.getId(), null, 2, false, "User 2 review", LocalDate.now());
        mockMvc.perform(post("/api/activities/" + testActivity.getId() + "/feedback")
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isOk());

        assertEquals(2, feedbackRepository.count());

        Feedback user1Feedback = feedbackRepository.findByUserIdAndActivityId(user1.getId(), testActivity.getId()).orElseThrow();

        // User 2 tries to edit User 1's feedback via PUT /api/feedback/{id} -> 403 Forbidden
        CreateFeedbackRequest maliciousEdit = new CreateFeedbackRequest(
                testActivity.getId(), null, 1, false, "Hacked review", LocalDate.now());
        mockMvc.perform(put("/api/feedback/" + user1Feedback.getId())
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(maliciousEdit)))
                .andExpect(status().isForbidden());

        // Verify User 1's feedback was untouched
        Feedback untouched = feedbackRepository.findById(user1Feedback.getId()).orElseThrow();
        assertEquals(4, untouched.getRating());
        assertEquals("User 1 review", untouched.getComment());
    }

    @Test
    @DisplayName("GET /api/activities/{id}/feedback/summary returns aggregate rating and review count")
    void shouldReturnAccurateSummary() throws Exception {
        // User 1 rates 4
        CreateFeedbackRequest req1 = new CreateFeedbackRequest(
                testActivity.getId(), null, 4, true, "Nice", LocalDate.now());
        mockMvc.perform(post("/api/activities/" + testActivity.getId() + "/feedback")
                        .header("Authorization", "Bearer " + token1)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isOk());

        // User 2 rates 5
        CreateFeedbackRequest req2 = new CreateFeedbackRequest(
                testActivity.getId(), null, 5, true, "Superb", LocalDate.now());
        mockMvc.perform(post("/api/activities/" + testActivity.getId() + "/feedback")
                        .header("Authorization", "Bearer " + token2)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req2)))
                .andExpect(status().isOk());

        // Summary should be (4 + 5) / 2 = 4.5, count = 2
        mockMvc.perform(get("/api/activities/" + testActivity.getId() + "/feedback/summary"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.averageRating").value(4.5))
                .andExpect(jsonPath("$.data.reviewCount").value(2))
                .andExpect(jsonPath("$.data.hasReviews").value(true));
    }
}
