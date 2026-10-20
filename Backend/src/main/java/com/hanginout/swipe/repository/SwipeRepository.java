package com.hanginout.swipe.repository;

import com.hanginout.swipe.entity.Swipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SwipeRepository extends JpaRepository<Swipe, Long> {

    Optional<Swipe> findByUserIdAndActivityId(Long userId, Long activityId);

    boolean existsByUserIdAndActivityId(Long userId, Long activityId);

    @Query("SELECT s.activity.id FROM Swipe s WHERE s.user.id = :userId")
    List<Long> findSwipedActivityIdsByUserId(@Param("userId") Long userId);

    @Query("SELECT s FROM Swipe s JOIN FETCH s.activity a JOIN FETCH a.category WHERE s.user.id = :userId AND s.action = 'LIKE' ORDER BY s.createdAt DESC")
    Page<Swipe> findLikedSwipesByUserId(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT s FROM Swipe s JOIN FETCH s.activity a JOIN FETCH a.category WHERE s.user.id = :userId ORDER BY s.createdAt DESC")
    Page<Swipe> findAllSwipesByUserId(@Param("userId") Long userId, Pageable pageable);
}
