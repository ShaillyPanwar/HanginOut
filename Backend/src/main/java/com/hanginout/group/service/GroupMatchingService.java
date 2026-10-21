package com.hanginout.group.service;

import com.hanginout.activity.dto.ActivityCardDTO;
import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.repository.ActivityRepository;
import com.hanginout.common.exception.BadRequestException;
import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.group.dto.*;
import com.hanginout.group.entity.GroupSwipe;
import com.hanginout.group.entity.HangoutGroup;
import com.hanginout.group.repository.GroupMemberRepository;
import com.hanginout.group.repository.GroupSwipeRepository;
import com.hanginout.group.repository.HangoutGroupRepository;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class GroupMatchingService {

    private final GroupSwipeRepository groupSwipeRepository;
    private final HangoutGroupRepository groupRepository;
    private final GroupMemberRepository memberRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final GroupService groupService;

    public GroupMatchingService(
            GroupSwipeRepository groupSwipeRepository,
            HangoutGroupRepository groupRepository,
            GroupMemberRepository memberRepository,
            UserRepository userRepository,
            ActivityRepository activityRepository,
            GroupService groupService) {
        this.groupSwipeRepository = groupSwipeRepository;
        this.groupRepository = groupRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
        this.groupService = groupService;
    }

    @Transactional
    public GroupSwipeResponse recordGroupSwipe(Long groupId, Long userId, GroupSwipeRequest request) {
        groupService.assertUserIsMember(groupId, userId);

        HangoutGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        if (!"ACTIVE".equalsIgnoreCase(group.getStatus())) {
            throw new BadRequestException("Group is closed. Cannot submit new votes.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + request.getActivityId()));

        if (!activity.isActive()) {
            throw new BadRequestException("Activity is inactive.");
        }

        String normalizedAction = request.getAction().trim().toUpperCase();

        // Idempotent UPSERT: update vote if member votes again
        GroupSwipe swipe = groupSwipeRepository.findByGroupIdAndUserIdAndActivityId(groupId, userId, activity.getId())
                .orElseGet(() -> new GroupSwipe(group, user, activity, normalizedAction));

        swipe.setAction(normalizedAction);
        GroupSwipe saved = groupSwipeRepository.save(swipe);

        return GroupSwipeResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public GroupMatchSummaryDTO calculateGroupMatches(Long groupId, Long currentUserId) {
        groupService.assertUserIsMember(groupId, currentUserId);

        HangoutGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        int totalMembers = (int) memberRepository.countByGroupId(groupId);
        List<GroupSwipe> allSwipes = groupSwipeRepository.findByGroupIdWithActivityAndUser(groupId);

        // Group swipes by Activity ID
        Map<Long, List<GroupSwipe>> swipesByActivity = allSwipes.stream()
                .collect(Collectors.groupingBy(s -> s.getActivity().getId()));

        List<GroupMatchDTO> matches = new ArrayList<>();

        for (Map.Entry<Long, List<GroupSwipe>> entry : swipesByActivity.entrySet()) {
            List<GroupSwipe> activitySwipes = entry.getValue();
            if (activitySwipes.isEmpty()) continue;

            Activity activity = activitySwipes.get(0).getActivity();

            int likesCount = 0;
            int rejectsCount = 0;
            List<MemberVoteDTO> memberVotes = new ArrayList<>();

            for (GroupSwipe gs : activitySwipes) {
                if ("LIKE".equalsIgnoreCase(gs.getAction())) {
                    likesCount++;
                } else if ("REJECT".equalsIgnoreCase(gs.getAction())) {
                    rejectsCount++;
                }
                memberVotes.add(new MemberVoteDTO(
                        gs.getUser().getId(),
                        gs.getUser().getName(),
                        gs.getAction()
                ));
            }

            double matchPercentage = totalMembers > 0
                    ? Math.round(((likesCount * 100.0) / totalMembers) * 10.0) / 10.0
                    : 0.0;

            boolean isUnanimous = (totalMembers > 0 && likesCount == totalMembers);

            GroupMatchDTO matchDTO = new GroupMatchDTO();
            matchDTO.setActivity(ActivityCardDTO.fromEntity(activity));
            matchDTO.setMatchPercentage(matchPercentage);
            matchDTO.setTotalMembers(totalMembers);
            matchDTO.setLikesCount(likesCount);
            matchDTO.setRejectsCount(rejectsCount);
            matchDTO.setUnanimous(isUnanimous);
            matchDTO.setMemberVotes(memberVotes);

            matches.add(matchDTO);
        }

        // Partition into Unanimous and Consensus
        List<GroupMatchDTO> unanimous = new ArrayList<>();
        List<GroupMatchDTO> consensus = new ArrayList<>();

        for (GroupMatchDTO m : matches) {
            if (m.isUnanimous()) {
                unanimous.add(m);
            } else if (m.getLikesCount() > 0) {
                consensus.add(m);
            }
        }

        // Sort consensus: highest match percentage DESC, then activity ID ASC
        consensus.sort((a, b) -> {
            int comp = Double.compare(b.getMatchPercentage(), a.getMatchPercentage());
            if (comp != 0) return comp;
            return Long.compare(a.getActivity().getId(), b.getActivity().getId());
        });

        unanimous.sort(Comparator.comparingLong(a -> a.getActivity().getId()));

        GroupMatchSummaryDTO summary = new GroupMatchSummaryDTO();
        summary.setGroupId(groupId);
        summary.setGroupName(group.getName());
        summary.setTotalMembers(totalMembers);
        summary.setUnanimousMatches(unanimous);
        summary.setConsensusMatches(consensus);

        return summary;
    }
}
