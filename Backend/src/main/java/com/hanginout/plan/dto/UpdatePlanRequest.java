package com.hanginout.plan.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class UpdatePlanRequest {
    private Long spotId;
    private LocalDate plannedDate;
    private LocalTime plannedTime;
    private String status; // 'PLANNED', 'COMPLETED', 'CANCELLED'

    public UpdatePlanRequest() {}

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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
