package com.hanginout.activity.controller;

import com.hanginout.activity.dto.ActivityCardDTO;
import com.hanginout.activity.dto.ActivityDetailDTO;
import com.hanginout.activity.dto.CategoryDTO;
import com.hanginout.activity.service.ActivityService;
import com.hanginout.common.response.ApiResponse;
import com.hanginout.common.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/activities")
@Tag(name = "Activities & Discovery", description = "Endpoints for discovering hangout activities and recommendation feeds")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @GetMapping
    @Operation(summary = "Discover activities with filters and pagination", description = "Returns active activities matching city, zone, locality, category, budget, and group filters")
    public ResponseEntity<ApiResponse<Page<ActivityCardDTO>>> getActivities(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String zone,
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal maxBudget,
            @RequestParam(required = false) String groupType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Integer userAge = (principal != null) ? principal.getAge() : null;
        Page<ActivityCardDTO> results = activityService.getFilteredActivities(userAge, city, zone, locality, categoryId, maxBudget, groupType, pageable);
        return ResponseEntity.ok(ApiResponse.success(results));
    }

    @GetMapping("/recommended")
    @Operation(summary = "Get personalized activity recommendations", description = "Uses the rule-based scoring algorithm with zone, locality, and distance filtering")
    public ResponseEntity<ApiResponse<List<ActivityCardDTO>>> getRecommendedActivities(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String zone,
            @RequestParam(required = false) String locality,
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false) Double maxDistanceKm,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        List<ActivityCardDTO> recommendations = activityService.getRecommendedActivities(
                principal.getId(), city, zone, locality, latitude, longitude, maxDistanceKm, pageable);
        return ResponseEntity.ok(ApiResponse.success(recommendations));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get activity details", description = "Retrieves full activity details, multi-image gallery, and associated physical spots for the expanded view")
    public ResponseEntity<ApiResponse<ActivityDetailDTO>> getActivityById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        Integer userAge = (principal != null) ? principal.getAge() : null;
        ActivityDetailDTO activity = activityService.getActivityById(id, userAge);
        return ResponseEntity.ok(ApiResponse.success(activity));
    }

    @GetMapping("/categories")
    @Operation(summary = "Get all activity categories", description = "Returns available hangout categories for onboarding and filtering")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> getCategories() {
        List<CategoryDTO> categories = activityService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }
}
