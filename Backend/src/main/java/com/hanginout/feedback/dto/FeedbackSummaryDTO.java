package com.hanginout.feedback.dto;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class FeedbackSummaryDTO {
    private Long activityId;
    private Double averageRating;
    private Long reviewCount;
    private boolean hasReviews;

    public FeedbackSummaryDTO() {}

    public FeedbackSummaryDTO(Long activityId, Double rawAverage, Long reviewCount) {
        this.activityId = activityId;
        this.reviewCount = reviewCount != null ? reviewCount : 0L;
        this.hasReviews = this.reviewCount > 0;
        if (rawAverage != null && this.hasReviews) {
            this.averageRating = BigDecimal.valueOf(rawAverage)
                    .setScale(1, RoundingMode.HALF_UP)
                    .doubleValue();
        } else {
            this.averageRating = 0.0;
        }
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }

    public boolean isHasReviews() {
        return hasReviews;
    }

    public void setHasReviews(boolean hasReviews) {
        this.hasReviews = hasReviews;
    }
}
