package com.hanginout.swipe.dto;

import com.hanginout.activity.dto.ActivityCardDTO;
import com.hanginout.swipe.entity.Swipe;

import java.time.LocalDateTime;

public class SwipeResponse {
    private Long id;
    private Long activityId;
    private String action;
    private LocalDateTime createdAt;
    private ActivityCardDTO activity;

    public SwipeResponse() {}

    public static SwipeResponse fromEntity(Swipe swipe) {
        SwipeResponse response = new SwipeResponse();
        response.setId(swipe.getId());
        if (swipe.getActivity() != null) {
            response.setActivityId(swipe.getActivity().getId());
            response.setActivity(ActivityCardDTO.fromEntity(swipe.getActivity()));
        }
        response.setAction(swipe.getAction());
        response.setCreatedAt(swipe.getCreatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ActivityCardDTO getActivity() {
        return activity;
    }

    public void setActivity(ActivityCardDTO activity) {
        this.activity = activity;
    }
}
