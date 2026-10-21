package com.hanginout.plan.entity;

import com.hanginout.activity.entity.Activity;
import com.hanginout.activity.entity.Spot;
import com.hanginout.group.entity.HangoutGroup;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "hangout_plans")
public class HangoutPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_id", nullable = false)
    private HangoutGroup group;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "activity_id", nullable = false)
    private Activity activity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spot_id")
    private Spot spot;

    @Column(name = "planned_date", nullable = false)
    private LocalDate plannedDate;

    @Column(name = "planned_time", nullable = false)
    private LocalTime plannedTime;

    @Column(nullable = false, length = 30)
    private String status = "PLANNED"; // 'PLANNED', 'COMPLETED', 'CANCELLED'

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public HangoutPlan() {}

    public HangoutPlan(HangoutGroup group, Activity activity, Spot spot, LocalDate plannedDate, LocalTime plannedTime) {
        this.group = group;
        this.activity = activity;
        this.spot = spot;
        this.plannedDate = plannedDate;
        this.plannedTime = plannedTime;
        this.status = "PLANNED";
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public HangoutGroup getGroup() {
        return group;
    }

    public void setGroup(HangoutGroup group) {
        this.group = group;
    }

    public Activity getActivity() {
        return activity;
    }

    public void setActivity(Activity activity) {
        this.activity = activity;
    }

    public Spot getSpot() {
        return spot;
    }

    public void setSpot(Spot spot) {
        this.spot = spot;
    }

    public LocalDate getPlannedDate() {
        return plannedDate;
    }

    public void setPlannedDate(LocalDate plannedDate) {
        this.plannedDate = plannedDate;
    }

    public LocalTime getPlannedTime() {
        return plannedTime;
    }

    public void setPlannedTime(LocalTime plannedTime) {
        this.plannedTime = plannedTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
