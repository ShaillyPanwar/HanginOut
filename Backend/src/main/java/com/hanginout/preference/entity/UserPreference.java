package com.hanginout.preference.entity;

import com.hanginout.activity.entity.Category;
import com.hanginout.user.entity.User;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "user_preferences")
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "max_budget")
    private String maxBudget; // 'Free', 'Under ₹100', 'Under ₹300', 'Under ₹500', '₹500+'

    @Column(name = "preferred_group_type")
    private String preferredGroupType; // 'Friends', 'Solo', 'Any'

    @Column(name = "preferred_duration")
    private String preferredDuration; // '<1 hour', '1-2 hours', '2-4 hours', '4+ hours'

    private String city;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_interests",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private Set<Category> interests = new HashSet<>();

    public UserPreference() {}

    public UserPreference(User user, String maxBudget, String preferredGroupType, String preferredDuration, String city) {
        this.user = user;
        this.maxBudget = maxBudget;
        this.preferredGroupType = preferredGroupType;
        this.preferredDuration = preferredDuration;
        this.city = city;
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onPreUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMaxBudget() {
        return maxBudget;
    }

    public void setMaxBudget(String maxBudget) {
        this.maxBudget = maxBudget;
    }

    public String getPreferredGroupType() {
        return preferredGroupType;
    }

    public void setPreferredGroupType(String preferredGroupType) {
        this.preferredGroupType = preferredGroupType;
    }

    public String getPreferredDuration() {
        return preferredDuration;
    }

    public void setPreferredDuration(String preferredDuration) {
        this.preferredDuration = preferredDuration;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Set<Category> getInterests() {
        return interests;
    }

    public void setInterests(Set<Category> interests) {
        this.interests = interests;
    }
}
