package com.hanginout.activity.repository;

import com.hanginout.activity.entity.Activity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {

    @Query("SELECT a FROM Activity a " +
            "LEFT JOIN FETCH a.category " +
            "WHERE a.id = :id AND a.isActive = true")
    Optional<Activity> findActiveByIdWithDetails(@Param("id") Long id);

    @Query("SELECT a FROM Activity a " +
            "LEFT JOIN FETCH a.category " +
            "WHERE a.isActive = true " +
            "AND (:city IS NULL OR LOWER(a.city) = LOWER(:city)) " +
            "AND (:categoryId IS NULL OR a.category.id = :categoryId) " +
            "AND (:maxBudget IS NULL OR a.minCost <= :maxBudget) " +
            "AND (:groupType IS NULL OR a.groupType = :groupType OR a.groupType = 'Both')")
    Page<Activity> findFilteredActivities(
            @Param("city") String city,
            @Param("categoryId") Long categoryId,
            @Param("maxBudget") BigDecimal maxBudget,
            @Param("groupType") String groupType,
            Pageable pageable);

    @Query("SELECT a FROM Activity a " +
            "JOIN FETCH a.category " +
            "WHERE a.isActive = true " +
            "AND (:city IS NULL OR LOWER(a.city) = LOWER(:city)) " +
            "AND a.id NOT IN :excludedIds")
    List<Activity> findActiveForRecommendation(
            @Param("city") String city,
            @Param("excludedIds") Collection<Long> excludedIds);
}
