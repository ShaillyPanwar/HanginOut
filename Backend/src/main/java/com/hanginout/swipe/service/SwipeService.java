package com.hanginout.swipe.service;

import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.repository.ActivityRepository;
import com.hanginout.common.exception.BadRequestException;
import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.swipe.dto.SwipeRequest;
import com.hanginout.swipe.dto.SwipeResponse;
import com.hanginout.swipe.entity.Swipe;
import com.hanginout.swipe.repository.SwipeRepository;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SwipeService {

    private final SwipeRepository swipeRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;

    public SwipeService(
            SwipeRepository swipeRepository,
            UserRepository userRepository,
            ActivityRepository activityRepository) {
        this.swipeRepository = swipeRepository;
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
    }

    @Transactional
    public SwipeResponse recordSwipe(Long userId, SwipeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Activity activity = activityRepository.findById(request.getActivityId())
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + request.getActivityId()));

        if (!activity.isActive()) {
            throw new BadRequestException("This activity is no longer active for discovery");
        }

        String normalizedAction = request.getAction().trim().toUpperCase();

        // Idempotent UPSERT handling: if a swipe already exists for (user, activity), update it
        Swipe swipe = swipeRepository.findByUserIdAndActivityId(userId, activity.getId())
                .orElseGet(() -> new Swipe(user, activity, normalizedAction));

        swipe.setAction(normalizedAction);
        Swipe saved = swipeRepository.save(swipe);

        return SwipeResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public Page<SwipeResponse> getLikedSwipes(Long userId, Pageable pageable) {
        return swipeRepository.findLikedSwipesByUserId(userId, pageable)
                .map(SwipeResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<SwipeResponse> getAllSwipes(Long userId, Pageable pageable) {
        return swipeRepository.findAllSwipesByUserId(userId, pageable)
                .map(SwipeResponse::fromEntity);
    }
}
