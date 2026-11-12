package com.hanginout.feedback.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class CreateFeedbackRequest {

    private Long activityId;

    private Long groupId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be between 1 and 5")
    @Max(value = 5, message = "Rating must be between 1 and 5")
    private Integer rating;

    private boolean enjoyed = true;

    @Size(max = 1000, message = "Comment cannot exceed 1000 characters")
    private String comment;

    private LocalDate visitDate;

    public CreateFeedbackRequest() {}

    public CreateFeedbackRequest(Long activityId, Long groupId, Integer rating, boolean enjoyed, String comment, LocalDate visitDate) {
        this.activityId = activityId;
        this.groupId = groupId;
        this.rating = rating;
        this.enjoyed = enjoyed;
        this.comment = comment;
        this.visitDate = visitDate;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
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
}
