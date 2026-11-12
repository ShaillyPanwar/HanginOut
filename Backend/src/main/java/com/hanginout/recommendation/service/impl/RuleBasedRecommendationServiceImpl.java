package com.hanginout.recommendation.service.impl;

import com.hanginout.activity.dto.ActivityCardDTO;
import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.entity.Category;
import com.hanginout.activity.entity.Spot;
import com.hanginout.activity.repository.ActivityRepository;
import com.hanginout.common.exception.BadRequestException;
import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.preference.entity.UserPreference;
import com.hanginout.preference.repository.UserPreferenceRepository;
import com.hanginout.recommendation.service.RecommendationEngine;
import com.hanginout.swipe.repository.SwipeRepository;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
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
    private final UserRepository userRepository;

    public RuleBasedRecommendationServiceImpl(
            ActivityRepository activityRepository,
            UserPreferenceRepository preferenceRepository,
            SwipeRepository swipeRepository,
            UserRepository userRepository) {
        this.activityRepository = activityRepository;
        this.preferenceRepository = preferenceRepository;
        this.swipeRepository = swipeRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityCardDTO> getRecommendations(Long userId, String targetCity, Pageable pageable) {
        return getRecommendations(userId, targetCity, null, null, null, null, null, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityCardDTO> getRecommendations(
            Long userId, String targetCity, Double latitude, Double longitude, Double maxDistanceKm, Pageable pageable) {
        return getRecommendations(userId, targetCity, null, null, latitude, longitude, maxDistanceKm, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ActivityCardDTO> getRecommendations(
            Long userId, String targetCity, String targetZone, String targetLocality,
            Double latitude, Double longitude, Double maxDistanceKm, Pageable pageable) {

        // 1. Mandatory Date of Birth enforcement & User lookup
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (user.getDateOfBirth() == null) {
            throw new BadRequestException("Please complete your Date of Birth in your profile to access activity recommendations.");
        }

        int userAge = user.getAge() != null ? user.getAge() : 0;

        // 2. Fetch user preferences with interests
        Optional<UserPreference> prefOpt = preferenceRepository.findByUserIdWithInterests(userId);
        UserPreference pref = prefOpt.orElse(null);

        boolean isAllDelhiNcr = (targetZone == null || targetZone.trim().isEmpty() || targetZone.trim().equalsIgnoreCase("All Delhi NCR"));

        // Determine effective target location parameters
        String effectiveCity = null;
        String effectiveZone = null;
        String effectiveLocality = (targetLocality != null && !targetLocality.trim().isEmpty()) ? targetLocality.trim() : null;

        if (!isAllDelhiNcr) {
            effectiveZone = targetZone.trim();
        } else if (targetCity != null && !targetCity.trim().isEmpty() && !targetCity.trim().equalsIgnoreCase("All Delhi NCR")) {
            effectiveCity = targetCity.trim();
        }

        // 3. Fetch list of already swiped activities to exclude from discovery feed
        List<Long> swipedIds = swipeRepository.findSwipedActivityIdsByUserId(userId);
        if (swipedIds.isEmpty()) {
            swipedIds = Collections.singletonList(-1L); // Placeholder to ensure valid SQL IN clause
        }

        // 4. Retrieve candidate activities
        List<Activity> candidates = activityRepository.findActiveForRecommendation(effectiveCity, effectiveZone, effectiveLocality, swipedIds);
        if (candidates.isEmpty() && (effectiveZone != null || effectiveCity != null)) {
            // Fallback: search across all zones if selected zone has no unswiped activities
            candidates = activityRepository.findActiveForRecommendation(null, null, null, swipedIds);
        }

        // Extract interest category IDs
        Set<Long> interestedCategoryIds = new HashSet<>();
        if (pref != null && pref.getInterests() != null) {
            for (Category c : pref.getInterests()) {
                interestedCategoryIds.add(c.getId());
            }
        }

        // 5. Score and filter candidates (by minAge & distance)
        List<ScoredActivity> scoredActivities = new ArrayList<>(candidates.size());
        for (Activity activity : candidates) {
            // Filter out activities that exceed the user's age
            if (activity.getMinAge() != null && activity.getMinAge() > 0 && activity.getMinAge() > userAge) {
                continue;
            }

            // Proximity & coordinate calculations
            Double distance = getEffectiveDistance(activity, latitude, longitude);
            if (maxDistanceKm != null) {
                // When distance filter is active, exclude activities without verified coordinates or beyond threshold
                if (distance == null || distance > maxDistanceKm) {
                    continue;
                }
            }

            Double roundedDistanceKm = null;
            String distanceFormatted = null;
            if (distance != null) {
                roundedDistanceKm = Math.round(distance * 10.0) / 10.0;
                distanceFormatted = String.format(Locale.US, "%.1f km away", roundedDistanceKm);
            }

            int score = calculateScore(activity, pref, interestedCategoryIds, effectiveCity, distance);
            scoredActivities.add(new ScoredActivity(activity, score, roundedDistanceKm, distanceFormatted));
        }

        // 6. Sorting & Diversity Ordering
        List<ScoredActivity> finalSortedList;
        if (isAllDelhiNcr && (latitude == null || longitude == null)) {
            // "All Delhi NCR" mode without GPS: Fair cross-zone balanced distribution
            // Avoid returning only activities from one zone just because they have higher recommendation scores!
            scoredActivities.sort((a, b) -> Integer.compare(b.score, a.score));

            Map<String, List<ScoredActivity>> byZone = new LinkedHashMap<>();
            for (ScoredActivity sa : scoredActivities) {
                String zoneKey = sa.activity.getZone() != null ? sa.activity.getZone() : (sa.activity.getCity() != null ? sa.activity.getCity() : "Other");
                byZone.computeIfAbsent(zoneKey, k -> new ArrayList<>()).add(sa);
            }

            // Interleave round-robin across zones
            finalSortedList = new ArrayList<>(scoredActivities.size());
            boolean hasMore = true;
            int round = 0;
            while (hasMore) {
                hasMore = false;
                for (List<ScoredActivity> zoneList : byZone.values()) {
                    if (round < zoneList.size()) {
                        finalSortedList.add(zoneList.get(round));
                        hasMore = true;
                    }
                }
                round++;
            }
        } else {
            // Specific zone selected OR GPS active: sort primarily by score, secondary by proximity/ID
            scoredActivities.sort((a, b) -> {
                int scoreCompare = Integer.compare(b.score, a.score);
                if (scoreCompare != 0) {
                    return scoreCompare;
                }
                if (a.distanceKm != null && b.distanceKm != null) {
                    return Double.compare(a.distanceKm, b.distanceKm);
                }
                return Long.compare(a.activity.getId(), b.activity.getId());
            });
            finalSortedList = scoredActivities;
        }

        // 7. Apply pagination
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), finalSortedList.size());

        if (start >= finalSortedList.size()) {
            return Collections.emptyList();
        }

        List<ScoredActivity> pagedSublist = finalSortedList.subList(start, end);
        return pagedSublist.stream()
                .map(sa -> {
                    ActivityCardDTO dto = ActivityCardDTO.fromEntity(sa.activity, sa.score);
                    dto.setDistanceKm(sa.distanceKm);
                    dto.setDistanceFormatted(sa.distanceFormatted);
                    return dto;
                })
                .toList();
    }

    private Double getEffectiveDistance(Activity activity, Double userLat, Double userLon) {
        if (userLat == null || userLon == null) {
            return null;
        }

        // 1. Direct activity coordinates
        if (activity.getLatitude() != null && activity.getLongitude() != null) {
            return haversineDistance(userLat, userLon, activity.getLatitude(), activity.getLongitude());
        }

        // 2. Fallback to closest associated spot coordinates
        if (activity.getSpots() != null && !activity.getSpots().isEmpty()) {
            Double minDistance = null;
            for (Spot spot : activity.getSpots()) {
                if (spot.getLatitude() != null && spot.getLongitude() != null) {
                    double d = haversineDistance(userLat, userLon, spot.getLatitude(), spot.getLongitude());
                    if (minDistance == null || d < minDistance) {
                        minDistance = d;
                    }
                }
            }
            return minDistance;
        }

        return null;
    }

    private double haversineDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private int calculateScore(
            Activity activity, UserPreference pref, Set<Long> interestedCategoryIds, String effectiveCity, Double distance) {
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

        // Proximity Bonus based on distance (up to +20)
        if (distance != null) {
            if (distance <= 2.0) {
                totalScore += 20;
            } else if (distance <= 5.0) {
                totalScore += 15;
            } else if (distance <= 10.0) {
                totalScore += 10;
            } else if (distance <= 20.0) {
                totalScore += 5;
            }
        }

        return totalScore;
    }

    private int evaluateBudgetScore(Activity activity, String maxBudget) {
        if (maxBudget == null) {
            return 15; // Neutral score
        }

        BigDecimal maxCost = activity.getMaxCost() != null ? activity.getMaxCost() : BigDecimal.ZERO;
        BigDecimal minCost = activity.getMinCost() != null ? activity.getMinCost() : BigDecimal.ZERO;

        switch (maxBudget) {
            case "Under ₹100":
            case "Free":
                if (maxCost.compareTo(BigDecimal.valueOf(100)) <= 0) return 30;
                if (minCost.compareTo(BigDecimal.valueOf(100)) <= 0) return 15;
                return 0;
            case "Under ₹300":
                if (maxCost.compareTo(BigDecimal.valueOf(300)) <= 0) return 30;
                if (minCost.compareTo(BigDecimal.valueOf(300)) <= 0) return 15;
                return 0;
            case "Under ₹500":
                if (maxCost.compareTo(BigDecimal.valueOf(500)) <= 0) return 30;
                if (minCost.compareTo(BigDecimal.valueOf(500)) <= 0) return 15;
                return 0;
            case "Above ₹500":
            case "₹500+":
                if (maxCost.compareTo(BigDecimal.valueOf(500)) >= 0 || minCost.compareTo(BigDecimal.valueOf(300)) >= 0) return 30;
                return 20;
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
        final Double distanceKm;
        final String distanceFormatted;

        ScoredActivity(Activity activity, int score, Double distanceKm, String distanceFormatted) {
            this.activity = activity;
            this.score = score;
            this.distanceKm = distanceKm;
            this.distanceFormatted = distanceFormatted;
        }
    }
}
