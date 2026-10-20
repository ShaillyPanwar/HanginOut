package com.hanginout.saved.repository;

import com.hanginout.saved.entity.SavedActivity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedActivityRepository extends JpaRepository<SavedActivity, Long> {

    Optional<SavedActivity> findByUserIdAndActivityId(Long userId, Long activityId);

    boolean existsByUserIdAndActivityId(Long userId, Long activityId);

    @Query("SELECT s FROM SavedActivity s " +
            "JOIN FETCH s.activity a " +
            "JOIN FETCH a.category " +
            "WHERE s.user.id = :userId " +
            "ORDER BY s.createdAt DESC")
    Page<SavedActivity> findByUserIdWithActivity(@Param("userId") Long userId, Pageable pageable);

    void deleteByUserIdAndActivityId(Long userId, Long activityId);
}
