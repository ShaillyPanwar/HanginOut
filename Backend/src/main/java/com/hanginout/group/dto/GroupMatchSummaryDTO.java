package com.hanginout.group.dto;

import java.util.ArrayList;
import java.util.List;

public class GroupMatchSummaryDTO {
    private Long groupId;
    private String groupName;
    private int totalMembers;
    private List<GroupMatchDTO> unanimousMatches = new ArrayList<>();
    private List<GroupMatchDTO> consensusMatches = new ArrayList<>();

    public GroupMatchSummaryDTO() {}

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public int getTotalMembers() {
        return totalMembers;
    }

    public void setTotalMembers(int totalMembers) {
        this.totalMembers = totalMembers;
    }

    public List<GroupMatchDTO> getUnanimousMatches() {
        return unanimousMatches;
    }

    public void setUnanimousMatches(List<GroupMatchDTO> unanimousMatches) {
        this.unanimousMatches = unanimousMatches;
    }

    public List<GroupMatchDTO> getConsensusMatches() {
        return consensusMatches;
    }

    public void setConsensusMatches(List<GroupMatchDTO> consensusMatches) {
        this.consensusMatches = consensusMatches;
    }
}
