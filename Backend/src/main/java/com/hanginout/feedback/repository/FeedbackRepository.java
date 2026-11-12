package com.hanginout.feedback.repository;

import com.hanginout.feedback.entity.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    Optional<Feedback> findByUserIdAndActivityId(Long userId, Long activityId);

    boolean existsByUserIdAndActivityId(Long userId, Long activityId);

    @Query("SELECT f FROM Feedback f JOIN FETCH f.user JOIN FETCH f.activity WHERE f.activity.id = :activityId ORDER BY f.createdAt DESC")
    List<Feedback> findByActivityIdWithDetails(@Param("activityId") Long activityId);

    List<Feedback> findByActivityIdOrderByCreatedAtDesc(Long activityId);

    @Query("SELECT f FROM Feedback f JOIN FETCH f.user JOIN FETCH f.activity ORDER BY f.createdAt DESC")
    Page<Feedback> findAllWithDetails(Pageable pageable);

    @Query("SELECT COALESCE(AVG(f.rating), 0.0) FROM Feedback f WHERE f.activity.id = :activityId")
    Double getAverageRatingByActivityId(@Param("activityId") Long activityId);

    long countByActivityId(Long activityId);

    @Query("SELECT COALESCE(AVG(f.rating), 0.0) FROM Feedback f")
    Double getAverageRating();
}
