package com.hanginout.group.repository;

import com.hanginout.group.entity.HangoutGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HangoutGroupRepository extends JpaRepository<HangoutGroup, Long> {

    Optional<HangoutGroup> findByInviteCode(String inviteCode);

    boolean existsByInviteCode(String inviteCode);

    @Query("SELECT DISTINCT g FROM HangoutGroup g " +
            "JOIN g.members m " +
            "WHERE m.user.id = :userId " +
            "ORDER BY g.createdAt DESC")
    List<HangoutGroup> findGroupsByMemberUserId(@Param("userId") Long userId);
}
