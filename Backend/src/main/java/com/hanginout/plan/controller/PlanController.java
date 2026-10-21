package com.hanginout.plan.controller;

import com.hanginout.common.response.ApiResponse;
import com.hanginout.common.security.UserPrincipal;
import com.hanginout.plan.dto.CreatePlanRequest;
import com.hanginout.plan.dto.HangoutPlanDTO;
import com.hanginout.plan.dto.UpdatePlanRequest;
import com.hanginout.plan.service.HangoutPlanService;
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
@Tag(name = "Hangout Plans", description = "Endpoints for scheduling, viewing, updating, and cancelling group hangout plans")
@SecurityRequirement(name = "bearerAuth")
public class PlanController {

    private final HangoutPlanService planService;

    public PlanController(HangoutPlanService planService) {
        this.planService = planService;
    }

    @PostMapping("/groups/{groupId}/plans")
    @Operation(summary = "Create a hangout plan for a group", description = "Converts an agreed activity into a scheduled date/time plan for the group")
    public ResponseEntity<ApiResponse<HangoutPlanDTO>> createPlan(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long groupId,
            @Valid @RequestBody CreatePlanRequest request) {
        HangoutPlanDTO plan = planService.createPlan(groupId, principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.created("Hangout plan created", plan), HttpStatus.CREATED);
    }

    @GetMapping("/groups/{groupId}/plans")
    @Operation(summary = "Get all plans for a group", description = "Retrieves upcoming and completed hangout plans for a group")
    public ResponseEntity<ApiResponse<List<HangoutPlanDTO>>> getGroupPlans(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long groupId) {
        List<HangoutPlanDTO> plans = planService.getGroupPlans(groupId, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(plans));
    }

    @PutMapping("/plans/{id}")
    @Operation(summary = "Update a hangout plan", description = "Updates scheduled date, time, spot, or status (PLANNED, COMPLETED, CANCELLED)")
    public ResponseEntity<ApiResponse<HangoutPlanDTO>> updatePlan(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @RequestBody UpdatePlanRequest request) {
        HangoutPlanDTO updated = planService.updatePlan(id, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Plan updated successfully", updated));
    }

    @DeleteMapping("/plans/{id}")
    @Operation(summary = "Delete a hangout plan", description = "Deletes a hangout plan by ID")
    public ResponseEntity<ApiResponse<Void>> deletePlan(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        planService.deletePlan(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Plan deleted successfully", null));
    }
}
