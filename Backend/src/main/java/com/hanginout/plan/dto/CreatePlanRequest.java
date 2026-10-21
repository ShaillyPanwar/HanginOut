package com.hanginout.plan.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class CreatePlanRequest {

    @NotNull(message = "Activity ID is required")
    private Long activityId;

    private Long spotId;

    @NotNull(message = "Planned date is required")
    @FutureOrPresent(message = "Plan date cannot be in the past")
    private LocalDate plannedDate;

    @NotNull(message = "Planned time is required")
    private LocalTime plannedTime;

    public CreatePlanRequest() {}

    public CreatePlanRequest(Long activityId, Long spotId, LocalDate plannedDate, LocalTime plannedTime) {
        this.activityId = activityId;
        this.spotId = spotId;
        this.plannedDate = plannedDate;
        this.plannedTime = plannedTime;
    }

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public Long getSpotId() {
        return spotId;
    }

    public void setSpotId(Long spotId) {
        this.spotId = spotId;
    }

    public LocalDate getPlannedDate() {
        return plannedDate;
    }

    public void setPlannedDate(LocalDate plannedDate) {
        this.plannedDate = plannedDate;
    }

    public LocalTime getPlannedTime() {
        return plannedTime;
    }

    public void setPlannedTime(LocalTime plannedTime) {
        this.plannedTime = plannedTime;
    }
}
