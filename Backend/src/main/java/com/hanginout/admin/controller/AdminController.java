package com.hanginout.admin.controller;

import com.hanginout.activity.entity.Category;
import com.hanginout.admin.dto.*;
import com.hanginout.admin.service.AdminService;
import com.hanginout.common.response.ApiResponse;
import com.hanginout.common.security.UserPrincipal;
import com.hanginout.feedback.dto.FeedbackDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Operations", description = "Privileged administrator management and monitoring APIs")
@SecurityRequirement(name = "bearerAuth")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // --- ANALYTICS ---

    @GetMapping("/analytics")
    @Operation(summary = "Get platform analytics", description = "Retrieves high-level platform analytics across all entities")
    public ResponseEntity<ApiResponse<AdminAnalyticsDTO>> getAnalytics() {
        AdminAnalyticsDTO analytics = adminService.getAnalytics();
        return ResponseEntity.ok(ApiResponse.success(analytics));
    }

    // --- USER MANAGEMENT ---

    @GetMapping("/users")
    @Operation(summary = "List all users", description = "Paginated search and list of registered users")
    public ResponseEntity<ApiResponse<Page<AdminUserDTO>>> getAllUsers(
            @RequestParam(required = false) String search,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<AdminUserDTO> users = adminService.getAllUsers(search, pageable);
        return ResponseEntity.ok(ApiResponse.success(users));
    }

    @PatchMapping("/users/{id}/status")
    @Operation(summary = "Update user active status", description = "Activates or deactivates a user account")
    public ResponseEntity<ApiResponse<AdminUserDTO>> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserStatusRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        AdminUserDTO updated = adminService.updateUserStatus(id, request.isActive(), principal.getId());
        return ResponseEntity.ok(ApiResponse.success("User status updated successfully", updated));
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Update user role", description = "Promotes or demotes a user role (ROLE_USER, ROLE_ADMIN)")
    public ResponseEntity<ApiResponse<AdminUserDTO>> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody AdminUpdateUserRoleRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        AdminUserDTO updated = adminService.updateUserRole(id, request.getRole(), principal.getId());
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updated));
    }

    // --- ACTIVITY MANAGEMENT ---

    @GetMapping("/activities")
    @Operation(summary = "List all activities (Admin)", description = "Paginated listing of all activities including active/inactive")
    public ResponseEntity<ApiResponse<Page<AdminActivityDTO>>> getAllActivities(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<AdminActivityDTO> activities = adminService.getAllActivities(pageable);
        return ResponseEntity.ok(ApiResponse.success(activities));
    }

    @GetMapping("/activities/{id}")
    @Operation(summary = "Get activity details (Admin)", description = "Retrieves full activity details for management")
    public ResponseEntity<ApiResponse<AdminActivityDTO>> getActivityById(@PathVariable Long id) {
        AdminActivityDTO activity = adminService.getActivityById(id);
        return ResponseEntity.ok(ApiResponse.success(activity));
    }

    @PostMapping("/activities")
    @Operation(summary = "Create an activity", description = "Creates a new activity with spots and gallery images")
    public ResponseEntity<ApiResponse<AdminActivityDTO>> createActivity(
            @Valid @RequestBody AdminActivityCreateRequest request) {
        AdminActivityDTO created = adminService.createActivity(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Activity created successfully", created));
    }

    @PutMapping("/activities/{id}")
    @Operation(summary = "Update an activity", description = "Updates an existing activity's details, spots, and images")
    public ResponseEntity<ApiResponse<AdminActivityDTO>> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody AdminActivityUpdateRequest request) {
        AdminActivityDTO updated = adminService.updateActivity(id, request);
        return ResponseEntity.ok(ApiResponse.success("Activity updated successfully", updated));
    }

    @DeleteMapping("/activities/{id}")
    @Operation(summary = "Delete an activity", description = "Deletes or soft-deactivates an activity")
    public ResponseEntity<ApiResponse<Void>> deleteActivity(@PathVariable Long id) {
        adminService.deleteActivity(id);
        return ResponseEntity.ok(ApiResponse.success("Activity removed successfully", null));
    }

    // --- SPOT MANAGEMENT ---

    @GetMapping("/spots")
    @Operation(summary = "List all spots", description = "Paginated list of all physical hangout spots")
    public ResponseEntity<ApiResponse<Page<AdminSpotDTO>>> getAllSpots(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<AdminSpotDTO> spots = adminService.getAllSpots(pageable);
        return ResponseEntity.ok(ApiResponse.success(spots));
    }

    @GetMapping("/spots/{id}")
    @Operation(summary = "Get spot details", description = "Retrieves details of a physical spot")
    public ResponseEntity<ApiResponse<AdminSpotDTO>> getSpotById(@PathVariable Long id) {
        AdminSpotDTO spot = adminService.getSpotById(id);
        return ResponseEntity.ok(ApiResponse.success(spot));
    }

    @PostMapping("/spots")
    @Operation(summary = "Create a spot", description = "Creates a new physical hangout spot")
    public ResponseEntity<ApiResponse<AdminSpotDTO>> createSpot(
            @Valid @RequestBody AdminSpotRequest request) {
        AdminSpotDTO created = adminService.createSpot(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Spot created successfully", created));
    }

    @PutMapping("/spots/{id}")
    @Operation(summary = "Update a spot", description = "Updates an existing physical spot")
    public ResponseEntity<ApiResponse<AdminSpotDTO>> updateSpot(
            @PathVariable Long id,
            @Valid @RequestBody AdminSpotRequest request) {
        AdminSpotDTO updated = adminService.updateSpot(id, request);
        return ResponseEntity.ok(ApiResponse.success("Spot updated successfully", updated));
    }

    @DeleteMapping("/spots/{id}")
    @Operation(summary = "Delete a spot", description = "Deletes or soft-deactivates a physical spot")
    public ResponseEntity<ApiResponse<Void>> deleteSpot(@PathVariable Long id) {
        adminService.deleteSpot(id);
        return ResponseEntity.ok(ApiResponse.success("Spot removed successfully", null));
    }

    @PostMapping(value = "/spots/upload-image", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload spot image from PC", description = "Uploads an image file (JPG, PNG, WEBP, max 5MB) and returns the accessible URL")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadSpotImage(
            @RequestParam("file") MultipartFile file) {
        Map<String, String> result = adminService.uploadSpotImage(file);
        return ResponseEntity.ok(ApiResponse.success("Image uploaded successfully", result));
    }

    // --- CATEGORY MANAGEMENT ---

    @GetMapping("/categories")
    @Operation(summary = "List all categories", description = "Retrieves all activity categories")
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = adminService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @PostMapping("/categories")
    @Operation(summary = "Create a category", description = "Creates a new activity category")
    public ResponseEntity<ApiResponse<Category>> createCategory(
            @Valid @RequestBody AdminCategoryRequest request) {
        Category created = adminService.createCategory(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully", created));
    }

    @PutMapping("/categories/{id}")
    @Operation(summary = "Update a category", description = "Updates an existing activity category")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody AdminCategoryRequest request) {
        Category updated = adminService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updated));
    }

    @DeleteMapping("/categories/{id}")
    @Operation(summary = "Delete a category", description = "Deletes a category if not currently referenced by activities")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        adminService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }

    // --- FEEDBACK MANAGEMENT ---

    @GetMapping("/feedback")
    @Operation(summary = "List user feedback", description = "Paginated list of submitted user hangout feedback")
    public ResponseEntity<ApiResponse<Page<FeedbackDTO>>> getAllFeedback(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        Page<FeedbackDTO> feedback = adminService.getAllFeedback(pageable);
        return ResponseEntity.ok(ApiResponse.success(feedback));
    }
}
