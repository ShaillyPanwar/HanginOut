package com.hanginout.plan.repository;

import com.hanginout.plan.entity.HangoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HangoutPlanRepository extends JpaRepository<HangoutPlan, Long> {

    @Query("SELECT p FROM HangoutPlan p " +
            "JOIN FETCH p.activity a " +
            "LEFT JOIN FETCH a.category " +
            "LEFT JOIN FETCH p.spot " +
            "WHERE p.group.id = :groupId " +
            "ORDER BY p.plannedDate ASC, p.plannedTime ASC")
    List<HangoutPlan> findByGroupIdWithDetails(@Param("groupId") Long groupId);
}
