package com.hanginout.preference.controller;

import com.hanginout.common.response.ApiResponse;
import com.hanginout.common.security.UserPrincipal;
import com.hanginout.preference.dto.PreferenceDTO;
import com.hanginout.preference.dto.UpdatePreferenceRequest;
import com.hanginout.preference.service.PreferenceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@Tag(name = "Preferences & Onboarding", description = "User hangout preferences and interest category endpoints")
@SecurityRequirement(name = "bearerAuth")
public class PreferenceController {

    private final PreferenceService preferenceService;

    public PreferenceController(PreferenceService preferenceService) {
        this.preferenceService = preferenceService;
    }

    @GetMapping
    @Operation(summary = "Get user preferences", description = "Retrieves preferences and selected interest categories for the current user")
    public ResponseEntity<ApiResponse<PreferenceDTO>> getPreferences(@AuthenticationPrincipal UserPrincipal principal) {
        PreferenceDTO preferences = preferenceService.getUserPreferences(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(preferences));
    }

    @PutMapping
    @Operation(summary = "Save or update user preferences", description = "Saves budget, duration, group type, and interest categories for recommendation scoring")
    public ResponseEntity<ApiResponse<PreferenceDTO>> updatePreferences(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UpdatePreferenceRequest request) {
        PreferenceDTO updated = preferenceService.updateUserPreferences(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Preferences updated successfully", updated));
    }
}
