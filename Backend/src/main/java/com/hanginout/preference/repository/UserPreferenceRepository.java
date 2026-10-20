package com.hanginout.preference.repository;

import com.hanginout.preference.entity.UserPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {

    @Query("SELECT p FROM UserPreference p LEFT JOIN FETCH p.interests WHERE p.user.id = :userId")
    Optional<UserPreference> findByUserIdWithInterests(@Param("userId") Long userId);

    Optional<UserPreference> findByUserId(Long userId);
}
