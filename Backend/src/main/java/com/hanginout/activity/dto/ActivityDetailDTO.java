package com.hanginout.activity.dto;

import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.entity.ActivityImage;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ActivityDetailDTO {
    private Long id;
    private String title;
    private String description;
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
    private Integer minAge;
    private Double distanceKm;
    private String distanceFormatted;
    private Double averageRating;
    private Long reviewCount;
    private List<String> imageGallery = new ArrayList<>();
    private List<SpotDTO> associatedSpots = new ArrayList<>();

    public ActivityDetailDTO() {}

    public static ActivityDetailDTO fromEntity(Activity activity) {
        ActivityDetailDTO dto = new ActivityDetailDTO();
        dto.setId(activity.getId());
        dto.setTitle(activity.getTitle());
        dto.setDescription(activity.getDescription());
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

        // Multi-image gallery
        if (activity.getImages() != null && !activity.getImages().isEmpty()) {
            dto.setImageGallery(activity.getImages().stream().map(ActivityImage::getImageUrl).toList());
        } else if (activity.getCoverImageUrl() != null) {
            dto.getImageGallery().add(activity.getCoverImageUrl());
        }

        // Associated spots
        if (activity.getSpots() != null && !activity.getSpots().isEmpty()) {
            dto.setAssociatedSpots(activity.getSpots().stream().map(SpotDTO::fromEntity).toList());
        }

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public List<String> getImageGallery() {
        return imageGallery;
    }

    public void setImageGallery(List<String> imageGallery) {
        this.imageGallery = imageGallery;
    }

    public List<SpotDTO> getAssociatedSpots() {
        return associatedSpots;
    }

    public void setAssociatedSpots(List<SpotDTO> associatedSpots) {
        this.associatedSpots = associatedSpots;
    }

    public Integer getMinAge() {
        return minAge;
    }

    public void setMinAge(Integer minAge) {
        this.minAge = minAge;
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
