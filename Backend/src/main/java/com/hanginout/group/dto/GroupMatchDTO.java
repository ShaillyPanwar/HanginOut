package com.hanginout.group.dto;

import com.hanginout.activity.dto.ActivityCardDTO;

import java.util.ArrayList;
import java.util.List;

public class GroupMatchDTO {
    private ActivityCardDTO activity;
    private double matchPercentage;
    private int totalMembers;
    private int likesCount;
    private int rejectsCount;
    private boolean isUnanimous;
    private List<MemberVoteDTO> memberVotes = new ArrayList<>();

    public GroupMatchDTO() {}

    public ActivityCardDTO getActivity() {
        return activity;
    }

    public void setActivity(ActivityCardDTO activity) {
        this.activity = activity;
    }

    public double getMatchPercentage() {
        return matchPercentage;
    }

    public void setMatchPercentage(double matchPercentage) {
        this.matchPercentage = matchPercentage;
    }

    public int getTotalMembers() {
        return totalMembers;
    }

    public void setTotalMembers(int totalMembers) {
        this.totalMembers = totalMembers;
    }

    public int getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(int likesCount) {
        this.likesCount = likesCount;
    }

    public int getRejectsCount() {
        return rejectsCount;
    }

    public void setRejectsCount(int rejectsCount) {
        this.rejectsCount = rejectsCount;
    }

    public boolean isUnanimous() {
        return isUnanimous;
    }

    public void setUnanimous(boolean unanimous) {
        isUnanimous = unanimous;
    }

    public List<MemberVoteDTO> getMemberVotes() {
        return memberVotes;
    }

    public void setMemberVotes(List<MemberVoteDTO> memberVotes) {
        this.memberVotes = memberVotes;
    }
}
