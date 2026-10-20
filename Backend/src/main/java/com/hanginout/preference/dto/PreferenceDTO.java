package com.hanginout.preference.dto;

import com.hanginout.activity.dto.CategoryDTO;
import com.hanginout.preference.entity.UserPreference;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

public class PreferenceDTO {
    private Long id;
    private Long userId;
    private String maxBudget;
    private String preferredGroupType;
    private String preferredDuration;
    private String city;
    private Set<CategoryDTO> interests = new HashSet<>();
    private LocalDateTime updatedAt;

    public PreferenceDTO() {}

    public static PreferenceDTO fromEntity(UserPreference preference) {
        PreferenceDTO dto = new PreferenceDTO();
        dto.setId(preference.getId());
        if (preference.getUser() != null) {
            dto.setUserId(preference.getUser().getId());
        }
        dto.setMaxBudget(preference.getMaxBudget());
        dto.setPreferredGroupType(preference.getPreferredGroupType());
        dto.setPreferredDuration(preference.getPreferredDuration());
        dto.setCity(preference.getCity());
        dto.setUpdatedAt(preference.getUpdatedAt());

        if (preference.getInterests() != null) {
            dto.setInterests(preference.getInterests().stream()
                    .map(CategoryDTO::fromEntity)
                    .collect(Collectors.toSet()));
        }
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

    public String getMaxBudget() {
        return maxBudget;
    }

    public void setMaxBudget(String maxBudget) {
        this.maxBudget = maxBudget;
    }

    public String getPreferredGroupType() {
        return preferredGroupType;
    }

    public void setPreferredGroupType(String preferredGroupType) {
        this.preferredGroupType = preferredGroupType;
    }

    public String getPreferredDuration() {
        return preferredDuration;
    }

    public void setPreferredDuration(String preferredDuration) {
        this.preferredDuration = preferredDuration;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Set<CategoryDTO> getInterests() {
        return interests;
    }

    public void setInterests(Set<CategoryDTO> interests) {
        this.interests = interests;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
