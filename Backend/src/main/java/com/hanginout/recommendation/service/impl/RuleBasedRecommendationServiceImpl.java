package com.hanginout.recommendation.service.impl;

import com.hanginout.activity.dto.ActivityCardDTO;
import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.entity.Category;
import com.hanginout.activity.repository.ActivityRepository;
import com.hanginout.preference.entity.UserPreference;
import com.hanginout.preference.repository.UserPreferenceRepository;
import com.hanginout.recommendation.service.RecommendationEngine;
import com.hanginout.swipe.repository.SwipeRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
public class RuleBasedRecommendationServiceImpl implements RecommendationEngine {

    private final ActivityRepository activityRepository;
    private final UserPreferenceRepository preferenceRepository;
    private final SwipeRepository swipeRepository;

    public RuleBasedRecommendationServiceImpl(
            ActivityRepository activityRepository,
            UserPreferenceRepository preferenceRepository,
            SwipeRepository swipeRepository) {
        this.activityRepository = activityRepository;
        this.preferenceRepository = preferenceRepository;
        this.swipeRepository = swipeRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityCardDTO> getRecommendations(Long userId, String targetCity, Pageable pageable) {
        // 1. Fetch user preferences with interests
        Optional<UserPreference> prefOpt = preferenceRepository.findByUserIdWithInterests(userId);
        UserPreference pref = prefOpt.orElse(null);

        // Determine effective target city
        String effectiveCity = targetCity;
        if (effectiveCity == null && pref != null && pref.getCity() != null && !pref.getCity().isBlank()) {
            effectiveCity = pref.getCity();
        }

        // 2. Fetch list of already swiped activities to exclude from discovery feed (DRD Section 18.3)
        List<Long> swipedIds = swipeRepository.findSwipedActivityIdsByUserId(userId);
        if (swipedIds.isEmpty()) {
            swipedIds = Collections.singletonList(-1L); // Placeholder to ensure valid SQL IN clause
        }

        // 3. Retrieve candidates
        List<Activity> candidates = activityRepository.findActiveForRecommendation(effectiveCity, swipedIds);
        if (candidates.isEmpty() && effectiveCity != null) {
            // Fallback: search without city filter if city has no unswiped activities
            candidates = activityRepository.findActiveForRecommendation(null, swipedIds);
        }

        // Extract interest category IDs
        Set<Long> interestedCategoryIds = new HashSet<>();
        if (pref != null && pref.getInterests() != null) {
            for (Category c : pref.getInterests()) {
                interestedCategoryIds.add(c.getId());
            }
        }

        // 4. Score each candidate
        List<ScoredActivity> scoredActivities = new ArrayList<>(candidates.size());
        for (Activity activity : candidates) {
            int score = calculateScore(activity, pref, interestedCategoryIds, effectiveCity);
            scoredActivities.add(new ScoredActivity(activity, score));
        }

        // 5. Deterministic Sort: Primary = Score DESC, Secondary = Activity ID ASC
        scoredActivities.sort((a, b) -> {
            int scoreCompare = Integer.compare(b.score, a.score);
            if (scoreCompare != 0) {
                return scoreCompare;
            }
            return Long.compare(a.activity.getId(), b.activity.getId());
        });

        // 6. Apply pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), scoredActivities.size());

        if (start >= scoredActivities.size()) {
            return Collections.emptyList();
        }

        List<ScoredActivity> pagedSublist = scoredActivities.subList(start, end);
        return pagedSublist.stream()
                .map(sa -> ActivityCardDTO.fromEntity(sa.activity, sa.score))
                .toList();
    }

    private int calculateScore(Activity activity, UserPreference pref, Set<Long> interestedCategoryIds, String effectiveCity) {
        int totalScore = 0;

        // Weight 1: Budget Match (+30)
        totalScore += evaluateBudgetScore(activity, pref != null ? pref.getMaxBudget() : null);

        // Weight 2: Category / Interests Match (+25)
        if (activity.getCategory() != null && interestedCategoryIds.contains(activity.getCategory().getId())) {
            totalScore += 25;
        } else if (interestedCategoryIds.isEmpty()) {
            totalScore += 10; // Default baseline if user selected no specific interests
        }

        // Weight 3: Group Type Suitability (+20)
        String prefGroup = pref != null ? pref.getPreferredGroupType() : null;
        if (prefGroup == null || "Any".equalsIgnoreCase(prefGroup) || "Both".equalsIgnoreCase(activity.getGroupType())) {
            totalScore += 20;
        } else if (prefGroup.equalsIgnoreCase(activity.getGroupType())) {
            totalScore += 20;
        }

        // Weight 4: Duration Match (+15)
        totalScore += evaluateDurationScore(activity.getDurationMinutes(), pref != null ? pref.getPreferredDuration() : null);

        // Weight 5: Location / City Proximity (+10)
        if (effectiveCity != null && effectiveCity.equalsIgnoreCase(activity.getCity())) {
            totalScore += 10;
        }

        return totalScore;
    }

    private int evaluateBudgetScore(Activity activity, String maxBudget) {
        if (maxBudget == null) {
            return 15; // Neutral score
        }

        BigDecimal maxCost = activity.getMaxCost() != null ? activity.getMaxCost() : BigDecimal.ZERO;

        switch (maxBudget) {
            case "Free":
                return maxCost.compareTo(BigDecimal.ZERO) == 0 ? 30 : 0;
            case "Under ₹100":
                if (maxCost.compareTo(BigDecimal.valueOf(100)) <= 0) return 30;
                if (activity.getMinCost().compareTo(BigDecimal.valueOf(100)) <= 0) return 15;
                return 0;
            case "Under ₹300":
                if (maxCost.compareTo(BigDecimal.valueOf(300)) <= 0) return 30;
                if (activity.getMinCost().compareTo(BigDecimal.valueOf(300)) <= 0) return 15;
                return 0;
            case "Under ₹500":
                if (maxCost.compareTo(BigDecimal.valueOf(500)) <= 0) return 30;
                if (activity.getMinCost().compareTo(BigDecimal.valueOf(500)) <= 0) return 15;
                return 0;
            case "₹500+":
                return 30;
            default:
                return 15;
        }
    }

    private int evaluateDurationScore(Integer durationMinutes, String preferredDuration) {
        if (preferredDuration == null || durationMinutes == null) {
            return 10;
        }

        switch (preferredDuration) {
            case "<1 hour":
            case "Less than 1 hour":
                return durationMinutes <= 60 ? 15 : (durationMinutes <= 90 ? 8 : 0);
            case "1-2 hours":
            case "1–2 hours":
                return (durationMinutes >= 60 && durationMinutes <= 120) ? 15 : (durationMinutes <= 150 ? 8 : 2);
            case "2-4 hours":
            case "2–4 hours":
                return (durationMinutes >= 120 && durationMinutes <= 240) ? 15 : (durationMinutes >= 90 ? 8 : 2);
            case "4+ hours":
                return durationMinutes >= 240 ? 15 : 5;
            default:
                return 10;
        }
    }

    private static class ScoredActivity {
        final Activity activity;
        final int score;

        ScoredActivity(Activity activity, int score) {
            this.activity = activity;
            this.score = score;
        }
    }
}
