package com.hanginout.group.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateGroupRequest {

    @NotBlank(message = "Group name is required")
    @Size(min = 2, max = 150, message = "Group name must be between 2 and 150 characters")
    private String name;

    public CreateGroupRequest() {}

    public CreateGroupRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
