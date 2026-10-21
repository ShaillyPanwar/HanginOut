package com.hanginout.group.repository;

import com.hanginout.group.entity.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {

    Optional<GroupMember> findByGroupIdAndUserId(Long groupId, Long userId);

    boolean existsByGroupIdAndUserId(Long groupId, Long userId);

    @Query("SELECT m FROM GroupMember m JOIN FETCH m.user WHERE m.group.id = :groupId ORDER BY m.joinedAt ASC")
    List<GroupMember> findByGroupIdWithUser(@Param("groupId") Long groupId);

    long countByGroupId(Long groupId);
}
