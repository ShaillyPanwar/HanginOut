package com.hanginout.feedback.service;

import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.repository.ActivityRepository;
import com.hanginout.common.exception.BadRequestException;
import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.feedback.dto.CreateFeedbackRequest;
import com.hanginout.feedback.dto.FeedbackDTO;
import com.hanginout.feedback.dto.FeedbackSummaryDTO;
import com.hanginout.feedback.entity.Feedback;
import com.hanginout.feedback.repository.FeedbackRepository;
import com.hanginout.group.entity.HangoutGroup;
import com.hanginout.group.repository.HangoutGroupRepository;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final HangoutGroupRepository groupRepository;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            UserRepository userRepository,
            ActivityRepository activityRepository,
            HangoutGroupRepository groupRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
        this.groupRepository = groupRepository;
    }

    @Transactional
    public FeedbackDTO submitOrUpdateFeedback(Long userId, Long activityId, CreateFeedbackRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + activityId));

        HangoutGroup group = null;
        if (request.getGroupId() != null) {
            group = groupRepository.findById(request.getGroupId()).orElse(null);
        }

        // Upsert logic: check if user already gave feedback for this activity
        Optional<Feedback> existingOpt = feedbackRepository.findByUserIdAndActivityId(userId, activityId);

        Feedback feedback;
        if (existingOpt.isPresent()) {
            feedback = existingOpt.get();
            feedback.setRating(request.getRating());
            feedback.setEnjoyed(request.isEnjoyed());
            feedback.setComment(request.getComment() != null ? request.getComment().trim() : null);
            feedback.setVisitDate(request.getVisitDate());
            if (group != null) {
                feedback.setGroup(group);
            }
            feedback.setUpdatedAt(LocalDateTime.now());
        } else {
            feedback = new Feedback(
                    user,
                    activity,
                    group,
                    request.getRating(),
                    request.isEnjoyed(),
                    request.getComment() != null ? request.getComment().trim() : null,
                    request.getVisitDate()
            );
        }

        Feedback saved = feedbackRepository.save(feedback);
        return FeedbackDTO.fromEntity(saved);
    }

    @Transactional
    public FeedbackDTO submitFeedback(Long userId, CreateFeedbackRequest request) {
        if (request.getActivityId() == null) {
            throw new BadRequestException("Activity ID is required");
        }
        return submitOrUpdateFeedback(userId, request.getActivityId(), request);
    }

    @Transactional
    public FeedbackDTO updateFeedbackById(Long userId, Long feedbackId, CreateFeedbackRequest request) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new ResourceNotFoundException("Feedback not found with id: " + feedbackId));

        if (!feedback.getUser().getId().equals(userId)) {
            throw new AccessDeniedException("You are only allowed to edit your own feedback.");
        }

        feedback.setRating(request.getRating());
        feedback.setEnjoyed(request.isEnjoyed());
        feedback.setComment(request.getComment() != null ? request.getComment().trim() : null);
        feedback.setVisitDate(request.getVisitDate());
        feedback.setUpdatedAt(LocalDateTime.now());

        Feedback saved = feedbackRepository.save(feedback);
        return FeedbackDTO.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public FeedbackDTO getUserFeedbackForActivity(Long userId, Long activityId) {
        return feedbackRepository.findByUserIdAndActivityId(userId, activityId)
                .map(FeedbackDTO::fromEntity)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public FeedbackSummaryDTO getFeedbackSummary(Long activityId) {
        if (!activityRepository.existsById(activityId)) {
            throw new ResourceNotFoundException("Activity not found with id: " + activityId);
        }
        Double avgRating = feedbackRepository.getAverageRatingByActivityId(activityId);
        long count = feedbackRepository.countByActivityId(activityId);
        return new FeedbackSummaryDTO(activityId, avgRating, count);
    }

    @Transactional(readOnly = true)
    public List<FeedbackDTO> getActivityFeedback(Long activityId) {
        if (!activityRepository.existsById(activityId)) {
            throw new ResourceNotFoundException("Activity not found with id: " + activityId);
        }
        return feedbackRepository.findByActivityIdWithDetails(activityId).stream()
                .map(FeedbackDTO::fromEntity)
                .toList();
    }
}
