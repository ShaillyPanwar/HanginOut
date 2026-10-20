package com.hanginout.swipe.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class SwipeRequest {

    @NotNull(message = "Activity ID is required")
    private Long activityId;

    @NotBlank(message = "Swipe action is required")
    @Pattern(regexp = "(?i)^(LIKE|REJECT)$", message = "Action must be either LIKE or REJECT")
    private String action;

    public SwipeRequest() {}

    public SwipeRequest(Long activityId, String action) {
        this.activityId = activityId;
        this.action = action;
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
}
