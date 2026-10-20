package com.hanginout.saved.dto;

import com.hanginout.activity.dto.ActivityCardDTO;
import com.hanginout.saved.entity.SavedActivity;

import java.time.LocalDateTime;

public class SavedActivityDTO {
    private Long id;
    private LocalDateTime savedAt;
    private ActivityCardDTO activity;

    public SavedActivityDTO() {}

    public static SavedActivityDTO fromEntity(SavedActivity saved) {
        SavedActivityDTO dto = new SavedActivityDTO();
        dto.setId(saved.getId());
        dto.setSavedAt(saved.getCreatedAt());
        if (saved.getActivity() != null) {
            dto.setActivity(ActivityCardDTO.fromEntity(saved.getActivity()));
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getSavedAt() {
        return savedAt;
    }

    public void setSavedAt(LocalDateTime savedAt) {
        this.savedAt = savedAt;
    }

    public ActivityCardDTO getActivity() {
        return activity;
    }

    public void setActivity(ActivityCardDTO activity) {
        this.activity = activity;
    }
}
