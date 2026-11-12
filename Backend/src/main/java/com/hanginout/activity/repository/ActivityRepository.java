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

    @Query(value = "SELECT a FROM Activity a LEFT JOIN FETCH a.category ORDER BY a.createdAt DESC",
            countQuery = "SELECT count(a) FROM Activity a")
    Page<Activity> findAllWithCategory(Pageable pageable);

    long countByIsActiveTrue();

    @Query("SELECT a FROM Activity a " +
            "LEFT JOIN FETCH a.category " +
            "WHERE a.id = :id AND a.isActive = true")
    Optional<Activity> findActiveByIdWithDetails(@Param("id") Long id);

    @Query("SELECT a FROM Activity a " +
            "LEFT JOIN FETCH a.category " +
            "WHERE a.isActive = true " +
            "AND (:maxAllowedAge IS NULL OR a.minAge <= :maxAllowedAge) " +
            "AND (:categoryId IS NULL OR a.category.id = :categoryId) " +
            "AND (:maxBudget IS NULL OR a.minCost <= :maxBudget) " +
            "AND (:groupType IS NULL OR a.groupType = :groupType OR a.groupType = 'Both')")
    Page<Activity> findFilteredActivitiesWithoutCity(
            @Param("maxAllowedAge") Integer maxAllowedAge,
            @Param("categoryId") Long categoryId,
            @Param("maxBudget") BigDecimal maxBudget,
            @Param("groupType") String groupType,
            Pageable pageable);

    @Query("SELECT a FROM Activity a " +
            "LEFT JOIN FETCH a.category " +
            "WHERE a.isActive = true " +
            "AND (:maxAllowedAge IS NULL OR a.minAge <= :maxAllowedAge) " +
            "AND (LOWER(a.city) = LOWER(:city) OR LOWER(a.city) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(:city) LIKE LOWER(CONCAT('%', a.city, '%'))) " +
            "AND (:categoryId IS NULL OR a.category.id = :categoryId) " +
            "AND (:maxBudget IS NULL OR a.minCost <= :maxBudget) " +
            "AND (:groupType IS NULL OR a.groupType = :groupType OR a.groupType = 'Both')")
    Page<Activity> findFilteredActivitiesWithCity(
            @Param("maxAllowedAge") Integer maxAllowedAge,
            @Param("city") String city,
            @Param("categoryId") Long categoryId,
            @Param("maxBudget") BigDecimal maxBudget,
            @Param("groupType") String groupType,
            Pageable pageable);

    @Query("SELECT a FROM Activity a " +
            "LEFT JOIN FETCH a.category " +
            "WHERE a.isActive = true " +
            "AND (:maxAllowedAge IS NULL OR a.minAge <= :maxAllowedAge) " +
            "AND (LOWER(a.zone) = LOWER(:zone) OR LOWER(a.zone) LIKE LOWER(CONCAT('%', :zone, '%'))) " +
            "AND (:categoryId IS NULL OR a.category.id = :categoryId) " +
            "AND (:maxBudget IS NULL OR a.minCost <= :maxBudget) " +
            "AND (:groupType IS NULL OR a.groupType = :groupType OR a.groupType = 'Both')")
    Page<Activity> findFilteredActivitiesWithZone(
            @Param("maxAllowedAge") Integer maxAllowedAge,
            @Param("zone") String zone,
            @Param("categoryId") Long categoryId,
            @Param("maxBudget") BigDecimal maxBudget,
            @Param("groupType") String groupType,
            Pageable pageable);

    @Query("SELECT a FROM Activity a " +
            "LEFT JOIN FETCH a.category " +
            "WHERE a.isActive = true " +
            "AND (:maxAllowedAge IS NULL OR a.minAge <= :maxAllowedAge) " +
            "AND (LOWER(a.zone) = LOWER(:zone) OR LOWER(a.zone) LIKE LOWER(CONCAT('%', :zone, '%'))) " +
            "AND (LOWER(a.locality) = LOWER(:locality) OR LOWER(a.locality) LIKE LOWER(CONCAT('%', :locality, '%'))) " +
            "AND (:categoryId IS NULL OR a.category.id = :categoryId) " +
            "AND (:maxBudget IS NULL OR a.minCost <= :maxBudget) " +
            "AND (:groupType IS NULL OR a.groupType = :groupType OR a.groupType = 'Both')")
    Page<Activity> findFilteredActivitiesWithZoneAndLocality(
            @Param("maxAllowedAge") Integer maxAllowedAge,
            @Param("zone") String zone,
            @Param("locality") String locality,
            @Param("categoryId") Long categoryId,
            @Param("maxBudget") BigDecimal maxBudget,
            @Param("groupType") String groupType,
            Pageable pageable);

    @Query("SELECT a FROM Activity a " +
            "JOIN FETCH a.category " +
            "WHERE a.isActive = true " +
            "AND a.id NOT IN :excludedIds")
    List<Activity> findActiveForRecommendationWithoutCity(
            @Param("excludedIds") Collection<Long> excludedIds);

    @Query("SELECT a FROM Activity a " +
            "JOIN FETCH a.category " +
            "WHERE a.isActive = true " +
            "AND (LOWER(a.city) = LOWER(:city) OR LOWER(a.city) LIKE LOWER(CONCAT('%', :city, '%')) OR LOWER(:city) LIKE LOWER(CONCAT('%', a.city, '%'))) " +
            "AND a.id NOT IN :excludedIds")
    List<Activity> findActiveForRecommendationWithCity(
            @Param("city") String city,
            @Param("excludedIds") Collection<Long> excludedIds);

    @Query("SELECT a FROM Activity a " +
            "JOIN FETCH a.category " +
            "WHERE a.isActive = true " +
            "AND (LOWER(a.zone) = LOWER(:zone) OR LOWER(a.zone) LIKE LOWER(CONCAT('%', :zone, '%'))) " +
            "AND a.id NOT IN :excludedIds")
    List<Activity> findActiveForRecommendationWithZone(
            @Param("zone") String zone,
            @Param("excludedIds") Collection<Long> excludedIds);

    @Query("SELECT a FROM Activity a " +
            "JOIN FETCH a.category " +
            "WHERE a.isActive = true " +
            "AND (LOWER(a.zone) = LOWER(:zone) OR LOWER(a.zone) LIKE LOWER(CONCAT('%', :zone, '%'))) " +
            "AND (LOWER(a.locality) = LOWER(:locality) OR LOWER(a.locality) LIKE LOWER(CONCAT('%', :locality, '%'))) " +
            "AND a.id NOT IN :excludedIds")
    List<Activity> findActiveForRecommendationWithZoneAndLocality(
            @Param("zone") String zone,
            @Param("locality") String locality,
            @Param("excludedIds") Collection<Long> excludedIds);

    default Page<Activity> findFilteredActivities(
            Integer maxAllowedAge, String city, String zone, String locality, Long categoryId, BigDecimal maxBudget, String groupType, Pageable pageable) {
        boolean hasZone = (zone != null && !zone.trim().isEmpty() && !zone.trim().equalsIgnoreCase("All Delhi NCR"));
        boolean hasLocality = (locality != null && !locality.trim().isEmpty());

        if (hasZone && hasLocality) {
            return findFilteredActivitiesWithZoneAndLocality(maxAllowedAge, zone.trim(), locality.trim(), categoryId, maxBudget, groupType, pageable);
        } else if (hasZone) {
            return findFilteredActivitiesWithZone(maxAllowedAge, zone.trim(), categoryId, maxBudget, groupType, pageable);
        } else if (city != null && !city.trim().isEmpty() && !city.trim().equalsIgnoreCase("All Delhi NCR")) {
            return findFilteredActivitiesWithCity(maxAllowedAge, city.trim(), categoryId, maxBudget, groupType, pageable);
        } else {
            return findFilteredActivitiesWithoutCity(maxAllowedAge, categoryId, maxBudget, groupType, pageable);
        }
    }

    default Page<Activity> findFilteredActivities(
            Integer maxAllowedAge, String city, Long categoryId, BigDecimal maxBudget, String groupType, Pageable pageable) {
        return findFilteredActivities(maxAllowedAge, city, null, null, categoryId, maxBudget, groupType, pageable);
    }

    default List<Activity> findActiveForRecommendation(String city, String zone, String locality, Collection<Long> excludedIds) {
        boolean hasZone = (zone != null && !zone.trim().isEmpty() && !zone.trim().equalsIgnoreCase("All Delhi NCR"));
        boolean hasLocality = (locality != null && !locality.trim().isEmpty());

        if (hasZone && hasLocality) {
            return findActiveForRecommendationWithZoneAndLocality(zone.trim(), locality.trim(), excludedIds);
        } else if (hasZone) {
            return findActiveForRecommendationWithZone(zone.trim(), excludedIds);
        } else if (city != null && !city.trim().isEmpty() && !city.trim().equalsIgnoreCase("All Delhi NCR")) {
            return findActiveForRecommendationWithCity(city.trim(), excludedIds);
        } else {
            return findActiveForRecommendationWithoutCity(excludedIds);
        }
    }

    default List<Activity> findActiveForRecommendation(String city, Collection<Long> excludedIds) {
        return findActiveForRecommendation(city, null, null, excludedIds);
    }
}
