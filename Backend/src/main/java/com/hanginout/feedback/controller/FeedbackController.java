package com.hanginout.feedback.controller;

import com.hanginout.common.response.ApiResponse;
import com.hanginout.common.security.UserPrincipal;
import com.hanginout.feedback.dto.CreateFeedbackRequest;
import com.hanginout.feedback.dto.FeedbackDTO;
import com.hanginout.feedback.dto.FeedbackSummaryDTO;
import com.hanginout.feedback.service.FeedbackService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@Tag(name = "Feedback", description = "Endpoints for submitting and viewing hangout feedback and ratings")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/activities/{activityId}/feedback")
    @Operation(summary = "Submit or update activity feedback", description = "Allows authenticated users to rate (1-5) and review an activity. Updates existing review if present.")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FeedbackDTO>> submitOrUpdateActivityFeedback(
            @PathVariable Long activityId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateFeedbackRequest request) {
        FeedbackDTO feedback = feedbackService.submitOrUpdateFeedback(principal.getId(), activityId, request);
        return new ResponseEntity<>(ApiResponse.success("Feedback saved successfully", feedback), HttpStatus.OK);
    }

    @GetMapping("/activities/{activityId}/feedback/me")
    @Operation(summary = "Get user feedback for activity", description = "Retrieves the authenticated user's submitted feedback for this activity, if any")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FeedbackDTO>> getMyFeedback(
            @PathVariable Long activityId,
            @AuthenticationPrincipal UserPrincipal principal) {
        FeedbackDTO feedback = feedbackService.getUserFeedbackForActivity(principal.getId(), activityId);
        return ResponseEntity.ok(ApiResponse.success(feedback));
    }

    @GetMapping("/activities/{activityId}/feedback/summary")
    @Operation(summary = "Get feedback summary", description = "Returns aggregated average rating and review count for an activity")
    public ResponseEntity<ApiResponse<FeedbackSummaryDTO>> getFeedbackSummary(@PathVariable Long activityId) {
        FeedbackSummaryDTO summary = feedbackService.getFeedbackSummary(activityId);
        return ResponseEntity.ok(ApiResponse.success(summary));
    }

    @GetMapping({"/activities/{activityId}/feedback", "/feedback/activities/{activityId}"})
    @Operation(summary = "Get feedback list for an activity", description = "Returns all reviews and ratings for a specific activity")
    public ResponseEntity<ApiResponse<List<FeedbackDTO>>> getActivityFeedback(@PathVariable Long activityId) {
        List<FeedbackDTO> feedbackList = feedbackService.getActivityFeedback(activityId);
        return ResponseEntity.ok(ApiResponse.success(feedbackList));
    }

    @PutMapping("/feedback/{feedbackId}")
    @Operation(summary = "Update feedback by ID", description = "Allows the author to update their rating and review")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FeedbackDTO>> updateFeedbackById(
            @PathVariable Long feedbackId,
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateFeedbackRequest request) {
        FeedbackDTO updated = feedbackService.updateFeedbackById(principal.getId(), feedbackId, request);
        return ResponseEntity.ok(ApiResponse.success("Feedback updated successfully", updated));
    }

    @PostMapping("/feedback")
    @Operation(summary = "Legacy submit hangout feedback", description = "Allows authenticated users to rate and review an activity")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<ApiResponse<FeedbackDTO>> submitFeedbackLegacy(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateFeedbackRequest request) {
        FeedbackDTO feedback = feedbackService.submitFeedback(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.created("Feedback submitted successfully", feedback), HttpStatus.CREATED);
    }
}
