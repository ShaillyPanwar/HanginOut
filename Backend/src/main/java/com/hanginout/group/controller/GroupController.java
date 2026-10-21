package com.hanginout.group.controller;

import com.hanginout.common.response.ApiResponse;
import com.hanginout.common.security.UserPrincipal;
import com.hanginout.group.dto.*;
import com.hanginout.group.service.GroupMatchingService;
import com.hanginout.group.service.GroupService;
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
@RequestMapping("/api/groups")
@Tag(name = "Groups & Matching", description = "Collaborative group creation, invites, swiping, and consensus matching")
@SecurityRequirement(name = "bearerAuth")
public class GroupController {

    private final GroupService groupService;
    private final GroupMatchingService matchingService;

    public GroupController(GroupService groupService, GroupMatchingService matchingService) {
        this.groupService = groupService;
        this.matchingService = matchingService;
    }

    @PostMapping
    @Operation(summary = "Create a new hangout group", description = "Creates a group with a unique invite code (e.g. HNG4821) and adds creator as first member")
    public ResponseEntity<ApiResponse<GroupDTO>> createGroup(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateGroupRequest request) {
        GroupDTO group = groupService.createGroup(principal.getId(), request);
        return new ResponseEntity<>(ApiResponse.created("Group created successfully", group), HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get user's hangout groups", description = "Returns all active groups the authenticated user belongs to")
    public ResponseEntity<ApiResponse<List<GroupDTO>>> getUserGroups(@AuthenticationPrincipal UserPrincipal principal) {
        List<GroupDTO> groups = groupService.getUserGroups(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(groups));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get group details and members", description = "Retrieves group status, creator, and member roster (members only)")
    public ResponseEntity<ApiResponse<GroupDTO>> getGroupById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        GroupDTO group = groupService.getGroupById(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(group));
    }

    @PostMapping("/join")
    @Operation(summary = "Join group via invite code", description = "Enables friends to join a group using an invite code (e.g. HNG4821)")
    public ResponseEntity<ApiResponse<GroupDTO>> joinGroup(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody JoinGroupRequest request) {
        GroupDTO group = groupService.joinGroupByCode(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Joined group successfully", group));
    }

    @GetMapping("/{id}/members")
    @Operation(summary = "Get members of a group", description = "Lists all members of the specified hangout group")
    public ResponseEntity<ApiResponse<List<GroupMemberDTO>>> getGroupMembers(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        List<GroupMemberDTO> members = groupService.getGroupMembers(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(members));
    }

    @PostMapping("/{id}/swipes")
    @Operation(summary = "Submit a group swipe vote", description = "Records a member's LIKE or REJECT vote for a group activity session (idempotent)")
    public ResponseEntity<ApiResponse<GroupSwipeResponse>> recordGroupSwipe(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody GroupSwipeRequest request) {
        GroupSwipeResponse response = matchingService.recordGroupSwipe(id, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Group swipe recorded", response));
    }

    @GetMapping("/{id}/matches")
    @Operation(summary = "Get group matches and consensus rankings", description = "Calculates unanimous matches (100% agreed) and high-percentage consensus rankings with member breakdowns")
    public ResponseEntity<ApiResponse<GroupMatchSummaryDTO>> getGroupMatches(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        GroupMatchSummaryDTO summary = matchingService.calculateGroupMatches(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(summary));
    }
}
