package com.hanginout.user.controller;

import com.hanginout.common.response.ApiResponse;
import com.hanginout.common.security.UserPrincipal;
import com.hanginout.user.dto.UpdateProfileRequest;
import com.hanginout.user.dto.UserDTO;
import com.hanginout.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Profile", description = "User profile retrieval and update endpoints")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile", description = "Retrieves profile details for the currently logged-in user")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserDTO userDTO = userService.getCurrentUserProfile(principal.getUsername());
        return ResponseEntity.ok(ApiResponse.success(userDTO));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile", description = "Updates name, age, and city for the authenticated user")
    public ResponseEntity<ApiResponse<UserDTO>> updateCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserDTO updated = userService.updateCurrentUserProfile(principal.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
