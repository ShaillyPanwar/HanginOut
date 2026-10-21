package com.hanginout.plan.dto;

import com.hanginout.activity.dto.ActivityCardDTO;
import com.hanginout.activity.dto.SpotDTO;
import com.hanginout.plan.entity.HangoutPlan;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class HangoutPlanDTO {
    private Long id;
    private Long groupId;
    private String groupName;
    private ActivityCardDTO activity;
    private SpotDTO spot;
    private LocalDate plannedDate;
    private LocalTime plannedTime;
    private String status;
    private LocalDateTime createdAt;

    public HangoutPlanDTO() {}

    public static HangoutPlanDTO fromEntity(HangoutPlan plan) {
        HangoutPlanDTO dto = new HangoutPlanDTO();
        dto.setId(plan.getId());
        if (plan.getGroup() != null) {
            dto.setGroupId(plan.getGroup().getId());
            dto.setGroupName(plan.getGroup().getName());
        }
        if (plan.getActivity() != null) {
            dto.setActivity(ActivityCardDTO.fromEntity(plan.getActivity()));
        }
        if (plan.getSpot() != null) {
            dto.setSpot(SpotDTO.fromEntity(plan.getSpot()));
        }
        dto.setPlannedDate(plan.getPlannedDate());
        dto.setPlannedTime(plan.getPlannedTime());
        dto.setStatus(plan.getStatus());
        dto.setCreatedAt(plan.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public ActivityCardDTO getActivity() {
        return activity;
    }

    public void setActivity(ActivityCardDTO activity) {
        this.activity = activity;
    }

    public SpotDTO getSpot() {
        return spot;
    }

    public void setSpot(SpotDTO spot) {
        this.spot = spot;
    }

    public LocalDate getPlannedDate() {
        return plannedDate;
    }

    public void setPlannedDate(LocalDate plannedDate) {
        this.plannedDate = plannedDate;
    }

    public LocalTime getPlannedTime() {
        return plannedTime;
    }

    public void setPlannedTime(LocalTime plannedTime) {
        this.plannedTime = plannedTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
