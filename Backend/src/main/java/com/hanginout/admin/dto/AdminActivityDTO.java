package com.hanginout.admin.dto;

import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.entity.ActivityImage;
import com.hanginout.activity.entity.Spot;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class AdminActivityDTO {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String title;
    private String description;
    private BigDecimal minCost;
    private BigDecimal maxCost;
    private Integer durationMinutes;
    private String bestTime;
    private String locationType;
    private String groupType;
    private String coverImageUrl;
    private String city;
    private Double latitude;
    private Double longitude;
    private Integer minAge;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<Long> spotIds = new ArrayList<>();
    private List<String> imageUrls = new ArrayList<>();

    public AdminActivityDTO() {}

    public static AdminActivityDTO fromEntity(Activity activity) {
        AdminActivityDTO dto = new AdminActivityDTO();
        dto.setId(activity.getId());
        if (activity.getCategory() != null) {
            dto.setCategoryId(activity.getCategory().getId());
            dto.setCategoryName(activity.getCategory().getName());
        }
        dto.setTitle(activity.getTitle());
        dto.setDescription(activity.getDescription());
        dto.setMinCost(activity.getMinCost());
        dto.setMaxCost(activity.getMaxCost());
        dto.setDurationMinutes(activity.getDurationMinutes());
        dto.setBestTime(activity.getBestTime());
        dto.setLocationType(activity.getLocationType());
        dto.setGroupType(activity.getGroupType());
        dto.setCoverImageUrl(activity.getCoverImageUrl());
        dto.setCity(activity.getCity());
        dto.setLatitude(activity.getLatitude());
        dto.setLongitude(activity.getLongitude());
        dto.setMinAge(activity.getMinAge());
        dto.setActive(activity.isActive());
        dto.setCreatedAt(activity.getCreatedAt());
        dto.setUpdatedAt(activity.getUpdatedAt());

        if (activity.getSpots() != null) {
            dto.setSpotIds(activity.getSpots().stream().map(Spot::getId).toList());
        }
        if (activity.getImages() != null && !activity.getImages().isEmpty()) {
            dto.setImageUrls(activity.getImages().stream().map(ActivityImage::getImageUrl).toList());
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
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

    public List<Long> getSpotIds() {
        return spotIds;
    }

    public void setSpotIds(List<Long> spotIds) {
        this.spotIds = spotIds;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}
