package com.hanginout.admin.service;

import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.entity.ActivityImage;
import com.hanginout.activity.entity.Category;
import com.hanginout.activity.entity.Spot;
import com.hanginout.activity.repository.ActivityRepository;
import com.hanginout.activity.repository.CategoryRepository;
import com.hanginout.activity.repository.SpotRepository;
import com.hanginout.admin.dto.*;
import com.hanginout.common.exception.BadRequestException;
import com.hanginout.common.exception.DuplicateResourceException;
import com.hanginout.common.exception.ResourceNotFoundException;
import com.hanginout.feedback.dto.FeedbackDTO;
import com.hanginout.feedback.repository.FeedbackRepository;
import com.hanginout.group.repository.HangoutGroupRepository;
import com.hanginout.plan.repository.HangoutPlanRepository;
import com.hanginout.swipe.repository.SwipeRepository;
import com.hanginout.user.entity.User;
import com.hanginout.user.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class AdminService {

    private final UserRepository userRepository;
    private final ActivityRepository activityRepository;
    private final SpotRepository spotRepository;
    private final CategoryRepository categoryRepository;
    private final HangoutGroupRepository hangoutGroupRepository;
    private final SwipeRepository swipeRepository;
    private final HangoutPlanRepository hangoutPlanRepository;
    private final FeedbackRepository feedbackRepository;

    public AdminService(UserRepository userRepository,
                        ActivityRepository activityRepository,
                        SpotRepository spotRepository,
                        CategoryRepository categoryRepository,
                        HangoutGroupRepository hangoutGroupRepository,
                        SwipeRepository swipeRepository,
                        HangoutPlanRepository hangoutPlanRepository,
                        FeedbackRepository feedbackRepository) {
        this.userRepository = userRepository;
        this.activityRepository = activityRepository;
        this.spotRepository = spotRepository;
        this.categoryRepository = categoryRepository;
        this.hangoutGroupRepository = hangoutGroupRepository;
        this.swipeRepository = swipeRepository;
        this.hangoutPlanRepository = hangoutPlanRepository;
        this.feedbackRepository = feedbackRepository;
    }

    // --- ANALYTICS ---

    @Transactional(readOnly = true)
    public AdminAnalyticsDTO getAnalytics() {
        AdminAnalyticsDTO analytics = new AdminAnalyticsDTO();
        analytics.setTotalUsers(userRepository.count());
        analytics.setActiveUsers(userRepository.countByIsActiveTrue());
        analytics.setTotalActivities(activityRepository.count());
        analytics.setActiveActivities(activityRepository.countByIsActiveTrue());
        analytics.setTotalSpots(spotRepository.count());
        analytics.setTotalCategories(categoryRepository.count());
        analytics.setTotalGroups(hangoutGroupRepository.count());
        analytics.setTotalSwipes(swipeRepository.count());
        analytics.setTotalPlans(hangoutPlanRepository.count());
        analytics.setTotalFeedback(feedbackRepository.count());

        Double avgRating = feedbackRepository.getAverageRating();
        analytics.setAverageRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 0.0);

        return analytics;
    }

    // --- USER MANAGEMENT ---

    @Transactional(readOnly = true)
    public Page<AdminUserDTO> getAllUsers(String search, Pageable pageable) {
        Page<User> users;
        if (search != null && !search.trim().isEmpty()) {
            String trimmed = search.trim();
            users = userRepository.findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(trimmed, trimmed, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(AdminUserDTO::fromEntity);
    }

    public AdminUserDTO updateUserStatus(Long targetUserId, boolean isActive, Long currentAdminId) {
        if (targetUserId.equals(currentAdminId) && !isActive) {
            throw new BadRequestException("Administrators cannot deactivate their own account");
        }
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));
        user.setActive(isActive);
        return AdminUserDTO.fromEntity(userRepository.save(user));
    }

    public AdminUserDTO updateUserRole(Long targetUserId, String role, Long currentAdminId) {
        if (!"ROLE_USER".equalsIgnoreCase(role) && !"ROLE_ADMIN".equalsIgnoreCase(role)) {
            throw new BadRequestException("Invalid role. Must be ROLE_USER or ROLE_ADMIN");
        }
        String normalizedRole = role.toUpperCase();
        if (targetUserId.equals(currentAdminId) && !"ROLE_ADMIN".equals(normalizedRole)) {
            throw new BadRequestException("Administrators cannot demote their own account");
        }
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));
        user.setRole(normalizedRole);
        return AdminUserDTO.fromEntity(userRepository.save(user));
    }

    // --- ACTIVITY MANAGEMENT ---

    @Transactional(readOnly = true)
    public Page<AdminActivityDTO> getAllActivities(Pageable pageable) {
        return activityRepository.findAllWithCategory(pageable).map(AdminActivityDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public AdminActivityDTO getActivityById(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));
        return AdminActivityDTO.fromEntity(activity);
    }

    public AdminActivityDTO createActivity(AdminActivityCreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        Activity activity = new Activity(
                category,
                request.getTitle(),
                request.getDescription(),
                request.getMinCost(),
                request.getMaxCost(),
                request.getDurationMinutes(),
                request.getBestTime(),
                request.getLocationType(),
                request.getGroupType(),
                request.getCoverImageUrl(),
                request.getCity(),
                request.getLatitude(),
                request.getLongitude()
        );

        if (request.getMinAge() != null) {
            activity.setMinAge(request.getMinAge());
        }

        if (request.getSpotIds() != null && !request.getSpotIds().isEmpty()) {
            List<Spot> spots = spotRepository.findAllById(request.getSpotIds());
            activity.setSpots(spots);
        }

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<ActivityImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                images.add(new ActivityImage(activity, request.getImageUrls().get(i), i, null));
            }
            activity.setImages(images);
        }

        Activity saved = activityRepository.save(activity);
        return AdminActivityDTO.fromEntity(saved);
    }

    public AdminActivityDTO updateActivity(Long id, AdminActivityUpdateRequest request) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));

        activity.setCategory(category);
        activity.setTitle(request.getTitle());
        activity.setDescription(request.getDescription());
        activity.setMinCost(request.getMinCost());
        activity.setMaxCost(request.getMaxCost());
        activity.setDurationMinutes(request.getDurationMinutes());
        activity.setBestTime(request.getBestTime());
        activity.setLocationType(request.getLocationType());
        activity.setGroupType(request.getGroupType());
        activity.setCoverImageUrl(request.getCoverImageUrl());
        activity.setCity(request.getCity());
        activity.setLatitude(request.getLatitude());
        activity.setLongitude(request.getLongitude());
        if (request.getMinAge() != null) {
            activity.setMinAge(request.getMinAge());
        }
        activity.setActive(request.isActive());

        if (request.getSpotIds() != null) {
            List<Spot> spots = spotRepository.findAllById(request.getSpotIds());
            activity.setSpots(spots);
        }

        if (request.getImageUrls() != null) {
            activity.getImages().clear();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                activity.getImages().add(new ActivityImage(activity, request.getImageUrls().get(i), i, null));
            }
        }

        Activity saved = activityRepository.save(activity);
        return AdminActivityDTO.fromEntity(saved);
    }

    public void deleteActivity(Long id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Activity not found with id: " + id));

        try {
            activityRepository.delete(activity);
            activityRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            // Activity is referenced by historical swipes/plans/feedback, soft delete instead
            activity.setActive(false);
            activityRepository.save(activity);
        }
    }

    // --- SPOT MANAGEMENT ---

    @Transactional(readOnly = true)
    public Page<AdminSpotDTO> getAllSpots(Pageable pageable) {
        return spotRepository.findAll(pageable).map(AdminSpotDTO::fromEntity);
    }

    @Transactional(readOnly = true)
    public AdminSpotDTO getSpotById(Long id) {
        Spot spot = spotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spot not found with id: " + id));
        return AdminSpotDTO.fromEntity(spot);
    }

    public AdminSpotDTO createSpot(AdminSpotRequest request) {
        Spot spot = new Spot(
                request.getName(),
                request.getDescription(),
                request.getAddress(),
                request.getCity(),
                request.getLatitude(),
                request.getLongitude(),
                request.getMinCost(),
                request.getMaxCost(),
                request.getOpeningHours(),
                request.getCoverImageUrl()
        );
        spot.setActive(request.isActive());
        return AdminSpotDTO.fromEntity(spotRepository.save(spot));
    }

    public AdminSpotDTO updateSpot(Long id, AdminSpotRequest request) {
        Spot spot = spotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spot not found with id: " + id));

        spot.setName(request.getName());
        spot.setDescription(request.getDescription());
        spot.setAddress(request.getAddress());
        spot.setCity(request.getCity());
        spot.setLatitude(request.getLatitude());
        spot.setLongitude(request.getLongitude());
        spot.setMinCost(request.getMinCost());
        spot.setMaxCost(request.getMaxCost());
        spot.setOpeningHours(request.getOpeningHours());
        spot.setCoverImageUrl(request.getCoverImageUrl());
        spot.setActive(request.isActive());

        return AdminSpotDTO.fromEntity(spotRepository.save(spot));
    }

    public void deleteSpot(Long id) {
        Spot spot = spotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Spot not found with id: " + id));

        try {
            spotRepository.delete(spot);
            spotRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            spot.setActive(false);
            spotRepository.save(spot);
        }
    }

    // --- CATEGORY MANAGEMENT ---

    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(AdminCategoryRequest request) {
        categoryRepository.findByName(request.getName()).ifPresent(c -> {
            throw new DuplicateResourceException("Category already exists with name: " + request.getName());
        });

        Category category = new Category(request.getName(), request.getDescription(), request.getIconName());
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, AdminCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        categoryRepository.findByName(request.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new DuplicateResourceException("Category already exists with name: " + request.getName());
            }
        });

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIconName(request.getIconName());

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        try {
            categoryRepository.delete(category);
            categoryRepository.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new BadRequestException("Cannot delete category because it is currently assigned to activities");
        }
    }

    // --- FEEDBACK MANAGEMENT ---

    @Transactional(readOnly = true)
    public Page<FeedbackDTO> getAllFeedback(Pageable pageable) {
        return feedbackRepository.findAllWithDetails(pageable).map(FeedbackDTO::fromEntity);
    }

    // --- SPOT IMAGE UPLOAD ---

    public Map<String, String> uploadSpotImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        // Validate max size 5 MB
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("Image file size exceeds the 5MB limit");
        }

        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "spot.jpg";
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex > 0) {
            extension = originalFilename.substring(dotIndex).toLowerCase();
        }

        boolean isValidExtension = extension.equals(".jpg") || extension.equals(".jpeg") ||
                extension.equals(".png") || extension.equals(".webp");
        String contentType = file.getContentType();
        boolean isValidContentType = contentType != null && (
                contentType.equalsIgnoreCase("image/jpeg") ||
                contentType.equalsIgnoreCase("image/png") ||
                contentType.equalsIgnoreCase("image/webp"));

        if (!isValidExtension && !isValidContentType) {
            throw new BadRequestException("Only JPG, JPEG, PNG, and WEBP image formats are supported");
        }

        try {
            Path uploadDir = Paths.get("./uploads/spots").toAbsolutePath().normalize();
            Files.createDirectories(uploadDir);

            String safeExt = isValidExtension ? extension : ".jpg";
            String savedFilename = UUID.randomUUID().toString() + safeExt;
            Path destination = uploadDir.resolve(savedFilename);

            Files.copy(file.getInputStream(), destination, StandardCopyOption.REPLACE_EXISTING);

            String accessibleUrl = "/uploads/spots/" + savedFilename;
            return Map.of("url", accessibleUrl, "filename", savedFilename);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store image file on server: " + e.getMessage(), e);
        }
    }
}
