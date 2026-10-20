package com.hanginout.recommendation.service;

import com.hanginout.activity.dto.ActivityCardDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface RecommendationEngine {

    /**
     * Generates a ranked list of activity recommendations for the specified user,
     * excluding previously swiped activities and sorting by algorithmic relevance.
     *
     * @param userId   The authenticated user's ID
     * @param city     Target city for recommendations (falls back to user's city preference)
     * @param pageable Pagination criteria (page and size)
     * @return Ranked list of ActivityCardDTOs with score metadata
     */
    List<ActivityCardDTO> getRecommendations(Long userId, String city, Pageable pageable);
}
