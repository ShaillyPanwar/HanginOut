package com.hanginout.group.service;

import com.hanginout.common.exception.BadRequestException;
import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.group.dto.CreateGroupRequest;
import com.hanginout.group.dto.GroupDTO;
import com.hanginout.group.dto.GroupMemberDTO;
import com.hanginout.group.dto.JoinGroupRequest;
import com.hanginout.group.entity.GroupMember;
import com.hanginout.group.entity.HangoutGroup;
import com.hanginout.group.repository.GroupMemberRepository;
import com.hanginout.group.repository.HangoutGroupRepository;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
public class GroupService {

    private static final String CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous chars: 0/O, 1/I
    private static final SecureRandom RANDOM = new SecureRandom();

    private final HangoutGroupRepository groupRepository;
    private final GroupMemberRepository memberRepository;
    private final UserRepository userRepository;

    public GroupService(
            HangoutGroupRepository groupRepository,
            GroupMemberRepository memberRepository,
            UserRepository userRepository) {
        this.groupRepository = groupRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public GroupDTO createGroup(Long userId, CreateGroupRequest request) {
        User creator = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String inviteCode = generateUniqueInviteCode();

        HangoutGroup group = new HangoutGroup(request.getName().trim(), inviteCode, creator);
        HangoutGroup savedGroup = groupRepository.save(group);

        // Transactionally add creator as the first group member (DRD Section 5.12 & 18.6)
        GroupMember creatorMembership = new GroupMember(savedGroup, creator);
        memberRepository.save(creatorMembership);

        // Fetch freshly with members
        return GroupDTO.fromEntity(savedGroup, List.of(creatorMembership));
    }

    @Transactional
    public GroupDTO joinGroupByCode(Long userId, JoinGroupRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String normalizedCode = request.getInviteCode().trim().toUpperCase();
        HangoutGroup group = groupRepository.findByInviteCode(normalizedCode)
                .orElseThrow(() -> new ResourceNotFoundException("No active group found with code: " + normalizedCode));

        if (!"ACTIVE".equalsIgnoreCase(group.getStatus())) {
            throw new BadRequestException("This hangout group is closed and no longer accepting members.");
        }

        // Idempotent: if already a member, return current group state without duplicating (DRD Section 18.6)
        boolean alreadyMember = memberRepository.existsByGroupIdAndUserId(group.getId(), userId);
        if (!alreadyMember) {
            GroupMember newMember = new GroupMember(group, user);
            memberRepository.save(newMember);
        }

        return getGroupById(group.getId(), userId);
    }

    @Transactional(readOnly = true)
    public GroupDTO getGroupById(Long groupId, Long currentUserId) {
        assertUserIsMember(groupId, currentUserId);

        HangoutGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        List<GroupMember> members = memberRepository.findByGroupIdWithUser(groupId);
        return GroupDTO.fromEntity(group, members);
    }

    @Transactional(readOnly = true)
    public List<GroupMemberDTO> getGroupMembers(Long groupId, Long currentUserId) {
        assertUserIsMember(groupId, currentUserId);

        HangoutGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        Long creatorId = group.getCreator() != null ? group.getCreator().getId() : null;
        return memberRepository.findByGroupIdWithUser(groupId).stream()
                .map(m -> GroupMemberDTO.fromEntity(m, creatorId))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<GroupDTO> getUserGroups(Long userId) {
        List<HangoutGroup> groups = groupRepository.findGroupsByMemberUserId(userId);
        return groups.stream().map(g -> {
            List<GroupMember> members = memberRepository.findByGroupIdWithUser(g.getId());
            return GroupDTO.fromEntity(g, members);
        }).toList();
    }

    public void assertUserIsMember(Long groupId, Long userId) {
        if (!memberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new AccessDeniedException("You are not a member of this hangout group.");
        }
    }

    private String generateUniqueInviteCode() {
        for (int i = 0; i < 5; i++) {
            StringBuilder sb = new StringBuilder("HNG");
            for (int j = 0; j < 4; j++) {
                sb.append(CODE_ALPHABET.charAt(RANDOM.nextInt(CODE_ALPHABET.length())));
            }
            String candidate = sb.toString();
            if (!groupRepository.existsByInviteCode(candidate)) {
                return candidate;
            }
        }
        // Fallback with timestamp suffix
        return "HNG" + (System.currentTimeMillis() % 10000);
    }
}
