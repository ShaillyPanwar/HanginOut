package com.hanginout.group.dto;

import com.hanginout.group.entity.GroupMember;
import com.hanginout.group.entity.HangoutGroup;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class GroupDTO {
    private Long id;
    private String name;
    private String inviteCode;
    private String status;
    private Long creatorId;
    private String creatorName;
    private int membersCount;
    private LocalDateTime createdAt;
    private List<GroupMemberDTO> members = new ArrayList<>();

    public GroupDTO() {}

    public static GroupDTO fromEntity(HangoutGroup group, List<GroupMember> members) {
        GroupDTO dto = new GroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setInviteCode(group.getInviteCode());
        dto.setStatus(group.getStatus());
        if (group.getCreator() != null) {
            dto.setCreatorId(group.getCreator().getId());
            dto.setCreatorName(group.getCreator().getName());
        }
        dto.setCreatedAt(group.getCreatedAt());

        if (members != null) {
            dto.setMembersCount(members.size());
            Long creatorId = group.getCreator() != null ? group.getCreator().getId() : null;
            dto.setMembers(members.stream()
                    .map(m -> GroupMemberDTO.fromEntity(m, creatorId))
                    .toList());
        }
        return dto;
    }

    public static GroupDTO fromEntity(HangoutGroup group) {
        return fromEntity(group, group.getMembers());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getCreatorId() {
        return creatorId;
    }

    public void setCreatorId(Long creatorId) {
        this.creatorId = creatorId;
    }

    public String getCreatorName() {
        return creatorName;
    }

    public void setCreatorName(String creatorName) {
        this.creatorName = creatorName;
    }

    public int getMembersCount() {
        return membersCount;
    }

    public void setMembersCount(int membersCount) {
        this.membersCount = membersCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<GroupMemberDTO> getMembers() {
        return members;
    }

    public void setMembers(List<GroupMemberDTO> members) {
        this.members = members;
    }
}
