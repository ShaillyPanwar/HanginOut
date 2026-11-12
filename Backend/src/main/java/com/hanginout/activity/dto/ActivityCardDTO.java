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
    private String zone;
    private String locality;
    private String areaFormatted;
    private Double latitude;
    private Double longitude;
    private Double distanceKm;
    private String distanceFormatted;
    private Integer minAge;
    private Integer score; // Recommendation relevance score
    private Double averageRating;
    private Long reviewCount;

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
        dto.setZone(activity.getZone());
        dto.setLocality(activity.getLocality());
        if (activity.getLocality() != null && activity.getZone() != null) {
            dto.setAreaFormatted(activity.getLocality() + " · " + activity.getZone());
        } else if (activity.getLocality() != null) {
            dto.setAreaFormatted(activity.getLocality());
        } else if (activity.getZone() != null) {
            dto.setAreaFormatted(activity.getZone());
        } else if (activity.getCity() != null) {
            dto.setAreaFormatted(activity.getCity());
        }
        dto.setLatitude(activity.getLatitude());
        dto.setLongitude(activity.getLongitude());
        dto.setMinAge(activity.getMinAge());
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

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public String getDistanceFormatted() {
        return distanceFormatted;
    }

    public void setDistanceFormatted(String distanceFormatted) {
        this.distanceFormatted = distanceFormatted;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
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

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public String getLocality() {
        return locality;
    }

    public void setLocality(String locality) {
        this.locality = locality;
    }

    public String getAreaFormatted() {
        return areaFormatted;
    }

    public void setAreaFormatted(String areaFormatted) {
        this.areaFormatted = areaFormatted;
    }
}
