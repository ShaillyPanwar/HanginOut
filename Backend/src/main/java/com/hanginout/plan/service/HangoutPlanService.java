package com.hanginout.plan.service;

import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.entity.Spot;
import com.hanginout.activity.repository.ActivityRepository;
import com.hanginout.activity.repository.SpotRepository;
import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.group.entity.HangoutGroup;
import com.hanginout.group.repository.HangoutGroupRepository;
import com.hanginout.group.service.GroupService;
import com.hanginout.plan.dto.CreatePlanRequest;
import com.hanginout.plan.dto.HangoutPlanDTO;
import com.hanginout.plan.dto.UpdatePlanRequest;
import com.hanginout.plan.entity.HangoutPlan;
import com.hanginout.plan.repository.HangoutPlanRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class HangoutPlanService {

    private final HangoutPlanRepository planRepository;
    private final HangoutGroupRepository groupRepository;
    private final ActivityRepository activityRepository;
    private final SpotRepository spotRepository;
    private final GroupService groupService;

    public HangoutPlanService(
            HangoutPlanRepository planRepository,
            HangoutGroupRepository groupRepository,
            ActivityRepository activityRepository,
            SpotRepository spotRepository,
            GroupService groupService) {
        this.planRepository = planRepository;
        this.groupRepository = groupRepository;
        this.activityRepository = activityRepository;
        this.spotRepository = spotRepository;
        this.groupService = groupService;
    }

    @Transactional
    public HangoutPlanDTO createPlan(Long groupId, Long currentUserId, CreatePlanRequest request) {
        groupService.assertUserIsMember(groupId, currentUserId);

        HangoutGroup group = groupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Group not found with id: " + groupId));

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + request.getActivityId()));

        Spot spot = null;
        if (request.getSpotId() != null) {
            spot = spotRepository.findById(request.getSpotId())
                    .orElseThrow(() -> new ResourceNotFoundException("Spot not found with id: " + request.getSpotId()));
        }

        HangoutPlan plan = new HangoutPlan(group, activity, spot, request.getPlannedDate(), request.getPlannedTime());
        HangoutPlan saved = planRepository.save(plan);

        return HangoutPlanDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<HangoutPlanDTO> getGroupPlans(Long groupId, Long currentUserId) {
        groupService.assertUserIsMember(groupId, currentUserId);
        return planRepository.findByGroupIdWithDetails(groupId).stream()
                .map(HangoutPlanDTO::fromEntity)
                .toList();
    }

    @Transactional
    public HangoutPlanDTO updatePlan(Long planId, Long currentUserId, UpdatePlanRequest request) {
        HangoutPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + planId));

        groupService.assertUserIsMember(plan.getGroup().getId(), currentUserId);

        if (request.getSpotId() != null) {
            Spot spot = spotRepository.findById(request.getSpotId())
                    .orElseThrow(() -> new ResourceNotFoundException("Spot not found with id: " + request.getSpotId()));
            plan.setSpot(spot);
        }

        if (request.getPlannedDate() != null) {
            plan.setPlannedDate(request.getPlannedDate());
        }

        if (request.getPlannedTime() != null) {
            plan.setPlannedTime(request.getPlannedTime());
        }

        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            plan.setStatus(request.getStatus().trim().toUpperCase());
        }

        HangoutPlan updated = planRepository.save(plan);
        return HangoutPlanDTO.fromEntity(updated);
    }

    @Transactional
    public void deletePlan(Long planId, Long currentUserId) {
        HangoutPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found with id: " + planId));

        groupService.assertUserIsMember(plan.getGroup().getId(), currentUserId);
        planRepository.delete(plan);
    }
}
