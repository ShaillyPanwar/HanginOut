package com.hanginout.group.repository;

import com.hanginout.group.entity.GroupSwipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupSwipeRepository extends JpaRepository<GroupSwipe, Long> {

    Optional<GroupSwipe> findByGroupIdAndUserIdAndActivityId(Long groupId, Long userId, Long activityId);

    @Query("SELECT s FROM GroupSwipe s " +
            "JOIN FETCH s.activity a " +
            "JOIN FETCH a.category " +
            "JOIN FETCH s.user u " +
            "WHERE s.group.id = :groupId")
    List<GroupSwipe> findByGroupIdWithActivityAndUser(@Param("groupId") Long groupId);

    @Query("SELECT s FROM GroupSwipe s " +
            "JOIN FETCH s.user " +
            "WHERE s.group.id = :groupId AND s.activity.id = :activityId")
    List<GroupSwipe> findByGroupIdAndActivityId(@Param("groupId") Long groupId, @Param("activityId") Long activityId);
}
