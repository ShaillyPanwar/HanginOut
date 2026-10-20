package com.hanginout.activity.service;

import com.hanginout.activity.dto.ActivityCardDTO;
import com.hanginout.activity.dto.ActivityDetailDTO;
import com.hanginout.activity.dto.CategoryDTO;
import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.repository.ActivityRepository;
import com.hanginout.activity.repository.CategoryRepository;
import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.recommendation.service.RecommendationEngine;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CategoryRepository categoryRepository;
    private final RecommendationEngine recommendationEngine;

    public ActivityService(
            ActivityRepository activityRepository,
            CategoryRepository categoryRepository,
            RecommendationEngine recommendationEngine) {
        this.activityRepository = activityRepository;
        this.categoryRepository = categoryRepository;
        this.recommendationEngine = recommendationEngine;
    }

    @Transactional(readOnly = true)
    public Page<ActivityCardDTO> getFilteredActivities(
            String city, Long categoryId, BigDecimal maxBudget, String groupType, Pageable pageable) {
        Page<Activity> page = activityRepository.findFilteredActivities(city, categoryId, maxBudget, groupType, pageable);
        return page.map(ActivityCardDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<ActivityCardDTO> getRecommendedActivities(Long userId, String city, Pageable pageable) {
        return recommendationEngine.getRecommendations(userId, city, pageable);
    }

    @Transactional(readOnly = true)
    public ActivityDetailDTO getActivityById(Long id) {
        Activity activity = activityRepository.findActiveByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));
        return ActivityDetailDTO.fromEntity(activity);
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDTO::fromEntity)
                .toList();
    }
}
