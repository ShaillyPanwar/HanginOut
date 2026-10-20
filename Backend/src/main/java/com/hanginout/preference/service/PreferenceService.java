package com.hanginout.preference.service;

import com.hanginout.activity.entity.Category;
import com.hanginout.activity.repository.CategoryRepository;
import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.preference.dto.PreferenceDTO;
import com.hanginout.preference.dto.UpdatePreferenceRequest;
import com.hanginout.preference.entity.UserPreference;
import com.hanginout.preference.repository.UserPreferenceRepository;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class PreferenceService {

    private final UserPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public PreferenceService(
            UserPreferenceRepository preferenceRepository,
            UserRepository userRepository,
            CategoryRepository categoryRepository) {
        this.preferenceRepository = preferenceRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public PreferenceDTO getUserPreferences(Long userId) {
        return preferenceRepository.findByUserIdWithInterests(userId)
                .map(PreferenceDTO::fromEntity)
                .orElseGet(() -> {
                    PreferenceDTO empty = new PreferenceDTO();
                    empty.setUserId(userId);
                    return empty;
                });
    }

    @Transactional
    public PreferenceDTO updateUserPreferences(Long userId, UpdatePreferenceRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        UserPreference preference = preferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    UserPreference newPref = new UserPreference();
                    newPref.setUser(user);
                    return newPref;
                });

        preference.setMaxBudget(request.getMaxBudget());
        preference.setPreferredGroupType(request.getPreferredGroupType());
        preference.setPreferredDuration(request.getPreferredDuration());
        if (request.getCity() != null) {
            preference.setCity(request.getCity().trim());
        }
        preference.setUpdatedAt(LocalDateTime.now());

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            List<Category> categories = categoryRepository.findAllById(request.getCategoryIds());
            preference.setInterests(new HashSet<>(categories));
        } else {
            preference.setInterests(new HashSet<>());
        }

        UserPreference saved = preferenceRepository.save(preference);
        return PreferenceDTO.fromEntity(saved);
    }
}
