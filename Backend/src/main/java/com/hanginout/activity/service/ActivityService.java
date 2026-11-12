package com.hanginout.activity.service;

import com.hanginout.activity.dto.ActivityCardDTO;
import com.hanginout.activity.dto.ActivityDetailDTO;
import com.hanginout.activity.dto.CategoryDTO;
import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.repository.ActivityRepository;
import com.hanginout.activity.repository.CategoryRepository;
import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.recommendation.service.RecommendationEngine;
import com.hanginout.feedback.repository.FeedbackRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CategoryRepository categoryRepository;
    private final RecommendationEngine recommendationEngine;
    private final FeedbackRepository feedbackRepository;

    public ActivityService(
            ActivityRepository activityRepository,
            CategoryRepository categoryRepository,
            RecommendationEngine recommendationEngine,
            FeedbackRepository feedbackRepository) {
        this.activityRepository = activityRepository;
        this.categoryRepository = categoryRepository;
        this.recommendationEngine = recommendationEngine;
        this.feedbackRepository = feedbackRepository;
    }

    @Transactional(readOnly = true)
    public Page<ActivityCardDTO> getFilteredActivities(
            Integer userAge, String city, String zone, String locality, Long categoryId, BigDecimal maxBudget, String groupType, Pageable pageable) {
        String trimmedCity = (city != null && !city.trim().isEmpty()) ? city.trim() : null;
        String trimmedZone = (zone != null && !zone.trim().isEmpty()) ? zone.trim() : null;
        String trimmedLocality = (locality != null && !locality.trim().isEmpty()) ? locality.trim() : null;
        String trimmedGroupType = (groupType != null && !groupType.trim().isEmpty()) ? groupType.trim() : null;
        Page<Activity> page = activityRepository.findFilteredActivities(userAge, trimmedCity, trimmedZone, trimmedLocality, categoryId, maxBudget, trimmedGroupType, pageable);
        return page.map(ActivityCardDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<ActivityCardDTO> getFilteredActivities(
            Integer userAge, String city, Long categoryId, BigDecimal maxBudget, String groupType, Pageable pageable) {
        return getFilteredActivities(userAge, city, null, null, categoryId, maxBudget, groupType, pageable);
    }

    @Transactional(readOnly = true)
    public Page<ActivityCardDTO> getFilteredActivities(
            String city, Long categoryId, BigDecimal maxBudget, String groupType, Pageable pageable) {
        return getFilteredActivities(null, city, null, null, categoryId, maxBudget, groupType, pageable);
    }

    @Transactional(readOnly = true)
    public List<ActivityCardDTO> getRecommendedActivities(Long userId, String city, Pageable pageable) {
        return recommendationEngine.getRecommendations(userId, city, null, null, null, null, null, pageable);
    }

    @Transactional(readOnly = true)
    public List<ActivityCardDTO> getRecommendedActivities(
            Long userId, String city, Double latitude, Double longitude, Double maxDistanceKm, Pageable pageable) {
        return recommendationEngine.getRecommendations(userId, city, null, null, latitude, longitude, maxDistanceKm, pageable);
    }

    @Transactional(readOnly = true)
    public List<ActivityCardDTO> getRecommendedActivities(
            Long userId, String city, String zone, String locality, Double latitude, Double longitude, Double maxDistanceKm, Pageable pageable) {
        return recommendationEngine.getRecommendations(userId, city, zone, locality, latitude, longitude, maxDistanceKm, pageable);
    }

    @Transactional(readOnly = true)
    public ActivityDetailDTO getActivityById(Long id, Integer userAge) {
        Activity activity = activityRepository.findActiveByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));
        if (activity.getMinAge() != null && activity.getMinAge() > 0) {
            if (userAge != null && userAge < activity.getMinAge()) {
                throw new com.hanginout.common.exception.BadRequestException(
                        "This activity has a minimum age requirement of " + activity.getMinAge() + " years."
                );
            }
        }
        ActivityDetailDTO dto = ActivityDetailDTO.fromEntity(activity);
        long count = feedbackRepository.countByActivityId(id);
        if (count > 0) {
            Double avg = feedbackRepository.getAverageRatingByActivityId(id);
            if (avg != null) {
                dto.setAverageRating(BigDecimal.valueOf(avg).setScale(1, RoundingMode.HALF_UP).doubleValue());
            }
            dto.setReviewCount(count);
        }
        return dto;
    }

    @Transactional(readOnly = true)
    public ActivityDetailDTO getActivityById(Long id) {
        return getActivityById(id, null);
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(CategoryDTO::fromEntity)
                .toList();
    }
}
