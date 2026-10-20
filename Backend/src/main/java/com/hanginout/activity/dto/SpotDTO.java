package com.hanginout.activity.dto;

import com.hanginout.activity.entity.Spot;
import com.hanginout.activity.entity.SpotImage;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class SpotDTO {
    private Long id;
    private String name;
    private String description;
    private String address;
    private String city;
    private Double latitude;
    private Double longitude;
    private BigDecimal minCost;
    private BigDecimal maxCost;
    private String openingHours;
    private String coverImageUrl;
    private List<String> images = new ArrayList<>();

    public SpotDTO() {}

    public static SpotDTO fromEntity(Spot spot) {
        SpotDTO dto = new SpotDTO();
        dto.setId(spot.getId());
        dto.setName(spot.getName());
        dto.setDescription(spot.getDescription());
        dto.setAddress(spot.getAddress());
        dto.setCity(spot.getCity());
        dto.setLatitude(spot.getLatitude());
        dto.setLongitude(spot.getLongitude());
        dto.setMinCost(spot.getMinCost());
        dto.setMaxCost(spot.getMaxCost());
        dto.setOpeningHours(spot.getOpeningHours());
        dto.setCoverImageUrl(spot.getCoverImageUrl());

        if (spot.getImages() != null && !spot.getImages().isEmpty()) {
            dto.setImages(spot.getImages().stream().map(SpotImage::getImageUrl).toList());
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getOpeningHours() {
        return openingHours;
    }

    public void setOpeningHours(String openingHours) {
        this.openingHours = openingHours;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }
}
