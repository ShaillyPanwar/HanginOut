package com.hanginout.feedback.dto;

import com.hanginout.feedback.entity.Feedback;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class FeedbackDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long activityId;
    private String activityTitle;
    private Long groupId;
    private Integer rating;
    private boolean enjoyed;
    private String comment;
    private LocalDate visitDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public FeedbackDTO() {}

    public static FeedbackDTO fromEntity(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        if (feedback.getUser() != null) {
            dto.setUserId(feedback.getUser().getId());
            dto.setUserName(feedback.getUser().getName());
            dto.setUserEmail(feedback.getUser().getEmail());
        }
        if (feedback.getActivity() != null) {
            dto.setActivityId(feedback.getActivity().getId());
            dto.setActivityTitle(feedback.getActivity().getTitle());
        }
        if (feedback.getGroup() != null) {
            dto.setGroupId(feedback.getGroup().getId());
        }
        dto.setRating(feedback.getRating());
        dto.setEnjoyed(feedback.isEnjoyed());
        dto.setComment(feedback.getComment());
        dto.setVisitDate(feedback.getVisitDate());
        dto.setCreatedAt(feedback.getCreatedAt());
        dto.setUpdatedAt(feedback.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public String getActivityTitle() {
        return activityTitle;
    }

    public void setActivityTitle(String activityTitle) {
        this.activityTitle = activityTitle;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public boolean isEnjoyed() {
        return enjoyed;
    }

    public void setEnjoyed(boolean enjoyed) {
        this.enjoyed = enjoyed;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
