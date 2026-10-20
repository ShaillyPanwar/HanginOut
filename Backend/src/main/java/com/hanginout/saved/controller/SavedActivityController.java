package com.hanginout.saved.controller;

import com.hanginout.common.response.ApiResponse;
import com.hanginout.common.security.UserPrincipal;
import com.hanginout.saved.dto.SavedActivityDTO;
import com.hanginout.saved.service.SavedActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/saved")
@Tag(name = "Saved Activities", description = "Endpoints for bookmarking and retrieving saved hangouts")
@SecurityRequirement(name = "bearerAuth")
public class SavedActivityController {

    private final SavedActivityService savedActivityService;

    public SavedActivityController(SavedActivityService savedActivityService) {
        this.savedActivityService = savedActivityService;
    }

    @GetMapping
    @Operation(summary = "Get user's saved activities", description = "Returns bookmarked hangout activities for the current user with pagination")
    public ResponseEntity<ApiResponse<Page<SavedActivityDTO>>> getSavedActivities(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SavedActivityDTO> savedActivities = savedActivityService.getSavedActivities(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(savedActivities));
    }

    @PostMapping("/{activityId}")
    @Operation(summary = "Save an activity", description = "Bookmarks an activity to My Hangouts")
    public ResponseEntity<ApiResponse<SavedActivityDTO>> saveActivity(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long activityId) {
        SavedActivityDTO saved = savedActivityService.saveActivity(principal.getId(), activityId);
        return ResponseEntity.ok(ApiResponse.success("Activity saved", saved));
    }

    @DeleteMapping("/{activityId}")
    @Operation(summary = "Remove an activity from saved", description = "Unbookmarks an activity from My Hangouts")
    public ResponseEntity<ApiResponse<Void>> unsaveActivity(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long activityId) {
        savedActivityService.unsaveActivity(principal.getId(), activityId);
        return ResponseEntity.ok(ApiResponse.success("Activity removed from saved", null));
    }
}
