package com.hanginout.admin.dto;

import jakarta.validation.constraints.NotNull;

public class AdminUpdateUserStatusRequest {

    @NotNull(message = "Active status is required")
    private Boolean active;

    public AdminUpdateUserStatusRequest() {}

    public AdminUpdateUserStatusRequest(Boolean active) {
        this.active = active;
    }

    public Boolean getActive() {
        return active;
    }

    public Boolean isActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
