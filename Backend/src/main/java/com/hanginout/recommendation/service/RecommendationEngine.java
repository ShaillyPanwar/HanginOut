package com.hanginout.recommendation.service;

import com.hanginout.activity.dto.ActivityCardDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RecommendationEngine {

    /**
     * Generates a ranked list of activity recommendations for the specified user,
     * supporting zone, locality, and distance filtering, with balanced cross-zone distribution.
     *
     * @param userId        The authenticated user's ID
     * @param city          Target city (optional)
     * @param zone          Target zone (optional, e.g. "South Delhi", "North Delhi", "Gurugram")
     * @param locality      Target locality (optional, e.g. "Hauz Khas", "Cyber Hub")
     * @param latitude      User's latitude (optional)
     * @param longitude     User's longitude (optional)
     * @param maxDistanceKm Maximum distance filter in km (optional)
     * @param pageable      Pagination criteria
     * @return Ranked list of ActivityCardDTOs
     */
    List<ActivityCardDTO> getRecommendations(
            Long userId,
            String city,
            String zone,
            String locality,
            Double latitude,
            Double longitude,
            Double maxDistanceKm,
            Pageable pageable);

    default List<ActivityCardDTO> getRecommendations(Long userId, String city, Pageable pageable) {
        return getRecommendations(userId, city, null, null, null, null, null, pageable);
    }

    default List<ActivityCardDTO> getRecommendations(
            Long userId, String city, Double latitude, Double longitude, Double maxDistanceKm, Pageable pageable) {
        return getRecommendations(userId, city, null, null, latitude, longitude, maxDistanceKm, pageable);
    }
}
