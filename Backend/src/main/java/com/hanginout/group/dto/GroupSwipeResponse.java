package com.hanginout.group.dto;

import com.hanginout.activity.dto.ActivityCardDTO;
import com.hanginout.group.entity.GroupSwipe;

import java.time.LocalDateTime;

public class GroupSwipeResponse {
    private Long id;
    private Long groupId;
    private Long activityId;
    private String action;
    private Long userId;
    private String userName;
    private LocalDateTime createdAt;
    private ActivityCardDTO activity;

    public GroupSwipeResponse() {}

    public static GroupSwipeResponse fromEntity(GroupSwipe swipe) {
        GroupSwipeResponse res = new GroupSwipeResponse();
        res.setId(swipe.getId());
        if (swipe.getGroup() != null) {
            res.setGroupId(swipe.getGroup().getId());
        }
        if (swipe.getUser() != null) {
            res.setUserId(swipe.getUser().getId());
            res.setUserName(swipe.getUser().getName());
        }
        if (swipe.getActivity() != null) {
            res.setActivityId(swipe.getActivity().getId());
            res.setActivity(ActivityCardDTO.fromEntity(swipe.getActivity()));
        }
        res.setAction(swipe.getAction());
        res.setCreatedAt(swipe.getCreatedAt());
        return res;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
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
