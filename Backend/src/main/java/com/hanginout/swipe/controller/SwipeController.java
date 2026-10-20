package com.hanginout.swipe.controller;

import com.hanginout.common.response.ApiResponse;
import com.hanginout.common.security.UserPrincipal;
import com.hanginout.swipe.dto.SwipeRequest;
import com.hanginout.swipe.dto.SwipeResponse;
import com.hanginout.swipe.service.SwipeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/swipes")
@Tag(name = "Swipes", description = "Individual card swipe voting and history endpoints")
@SecurityRequirement(name = "bearerAuth")
public class SwipeController {

    private final SwipeService swipeService;

    public SwipeController(SwipeService swipeService) {
        this.swipeService = swipeService;
    }

    @PostMapping
    @Operation(summary = "Submit a card swipe action", description = "Records a LIKE or REJECT swipe action for an activity, updating previous votes idempotently")
    public ResponseEntity<ApiResponse<SwipeResponse>> recordSwipe(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody SwipeRequest request) {
        SwipeResponse response = swipeService.recordSwipe(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Swipe recorded", response));
    }

    @GetMapping
    @Operation(summary = "Get swipe history", description = "Returns all swiped activities for the current user with pagination")
    public ResponseEntity<ApiResponse<Page<SwipeResponse>>> getAllSwipes(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SwipeResponse> swipes = swipeService.getAllSwipes(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(swipes));
    }

    @GetMapping("/liked")
    @Operation(summary = "Get liked activities", description = "Returns activities swiped RIGHT by the current user")
    public ResponseEntity<ApiResponse<Page<SwipeResponse>>> getLikedSwipes(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<SwipeResponse> likedSwipes = swipeService.getLikedSwipes(principal.getId(), pageable);
        return ResponseEntity.ok(ApiResponse.success(likedSwipes));
    }
}
