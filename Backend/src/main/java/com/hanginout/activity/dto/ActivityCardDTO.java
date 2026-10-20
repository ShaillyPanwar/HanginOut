package com.hanginout.activity.dto;

import com.hanginout.activity.entity.Activity;

import java.math.BigDecimal;

public class ActivityCardDTO {
    private Long id;
    private String title;
    private Long categoryId;
    private String categoryName;
    private BigDecimal minCost;
    private BigDecimal maxCost;
    private Integer durationMinutes;
    private String bestTime;
    private String locationType;
    private String groupType;
    private String coverImageUrl;
    private String city;
    private Integer score; // Recommendation relevance score

    public ActivityCardDTO() {}

    public static ActivityCardDTO fromEntity(Activity activity) {
        ActivityCardDTO dto = new ActivityCardDTO();
        dto.setId(activity.getId());
        dto.setTitle(activity.getTitle());
        if (activity.getCategory() != null) {
            dto.setCategoryId(activity.getCategory().getId());
            dto.setCategoryName(activity.getCategory().getName());
        }
        dto.setMinCost(activity.getMinCost());
        dto.setMaxCost(activity.getMaxCost());
        dto.setDurationMinutes(activity.getDurationMinutes());
        dto.setBestTime(activity.getBestTime());
        dto.setLocationType(activity.getLocationType());
        dto.setGroupType(activity.getGroupType());
        dto.setCoverImageUrl(activity.getCoverImageUrl());
        dto.setCity(activity.getCity());
        return dto;
    }

    public static ActivityCardDTO fromEntity(Activity activity, Integer score) {
        ActivityCardDTO dto = fromEntity(activity);
        dto.setScore(score);
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public BigDecimal getMinCost() {
        return minCost;
    }

    public void setMinCost(BigDecimal minCost) {
        this.minCost = minCost;
    }

    public BigDecimal getMaxCost() {
        return maxCost;
    }

    public void setMaxCost(BigDecimal maxCost) {
        this.maxCost = maxCost;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public String getBestTime() {
        return bestTime;
    }

    public void setBestTime(String bestTime) {
        this.bestTime = bestTime;
    }

    public String getLocationType() {
        return locationType;
    }

    public void setLocationType(String locationType) {
        this.locationType = locationType;
    }

    public String getGroupType() {
        return groupType;
    }

    public void setGroupType(String groupType) {
        this.groupType = groupType;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }
}
