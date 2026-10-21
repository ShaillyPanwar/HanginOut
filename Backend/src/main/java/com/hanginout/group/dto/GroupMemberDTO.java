package com.hanginout.group.dto;

import com.hanginout.group.entity.GroupMember;

import java.time.LocalDateTime;

public class GroupMemberDTO {
    private Long userId;
    private String name;
    private String email;
    private LocalDateTime joinedAt;
    private boolean isCreator;

    public GroupMemberDTO() {}

    public static GroupMemberDTO fromEntity(GroupMember member, Long creatorId) {
        GroupMemberDTO dto = new GroupMemberDTO();
        if (member.getUser() != null) {
            dto.setUserId(member.getUser().getId());
            dto.setName(member.getUser().getName());
            dto.setEmail(member.getUser().getEmail());
            dto.setCreator(member.getUser().getId().equals(creatorId));
        }
        dto.setJoinedAt(member.getJoinedAt());
        return dto;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }

    public boolean isCreator() {
        return isCreator;
    }

    public void setCreator(boolean creator) {
        isCreator = creator;
    }
}
