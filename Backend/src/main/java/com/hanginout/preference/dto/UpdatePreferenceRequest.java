package com.hanginout.preference.dto;

import java.util.HashSet;
import java.util.Set;

public class UpdatePreferenceRequest {

    private String maxBudget; // 'Free', 'Under ₹100', 'Under ₹300', 'Under ₹500', '₹500+'
    private String preferredGroupType; // 'Friends', 'Solo', 'Any'
    private String preferredDuration; // '<1 hour', '1-2 hours', '2-4 hours', '4+ hours'
    private String city;
    private Set<Long> categoryIds = new HashSet<>();

    public UpdatePreferenceRequest() {}

    public UpdatePreferenceRequest(String maxBudget, String preferredGroupType, String preferredDuration,
                                   String city, Set<Long> categoryIds) {
        this.maxBudget = maxBudget;
        this.preferredGroupType = preferredGroupType;
        this.preferredDuration = preferredDuration;
        this.city = city;
        this.categoryIds = categoryIds != null ? categoryIds : new HashSet<>();
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

    public Set<Long> getCategoryIds() {
        return categoryIds;
    }

    public void setCategoryIds(Set<Long> categoryIds) {
        this.categoryIds = categoryIds;
    }
}
