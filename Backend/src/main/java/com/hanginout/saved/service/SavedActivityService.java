package com.hanginout.saved.service;

import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.repository.ActivityRepository;
import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.saved.dto.SavedActivityDTO;
import com.hanginout.saved.entity.SavedActivity;
import com.hanginout.saved.repository.SavedActivityRepository;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SavedActivityService {

    private final SavedActivityRepository savedActivityRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    public SavedActivityService(
            SavedActivityRepository savedActivityRepository,
            UserRepository userRepository,
            ActivityRepository activityRepository) {
        this.savedActivityRepository = savedActivityRepository;
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
    }

    @Transactional(readOnly = true)
    public Page<SavedActivityDTO> getSavedActivities(Long userId, Pageable pageable) {
        return savedActivityRepository.findByUserIdWithActivity(userId, pageable)
                .map(SavedActivityDTO::fromEntity);
    }

    @Transactional
    public SavedActivityDTO saveActivity(Long userId, Long activityId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + activityId));

        // Idempotent: return existing record if already saved
        SavedActivity saved = savedActivityRepository.findByUserIdAndActivityId(userId, activityId)
                .orElseGet(() -> savedActivityRepository.save(new SavedActivity(user, activity)));

        return SavedActivityDTO.fromEntity(saved);
    }

    @Transactional
    public void unsaveActivity(Long userId, Long activityId) {
        savedActivityRepository.deleteByUserIdAndActivityId(userId, activityId);
    }
}
