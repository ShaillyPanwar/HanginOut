package com.hanginout.group.dto;

public class MemberVoteDTO {
    private Long userId;
    private String userName;
    private String action; // 'LIKE' or 'REJECT'

    public MemberVoteDTO() {}

    public MemberVoteDTO(Long userId, String userName, String action) {
        this.userId = userId;
        this.userName = userName;
        this.action = action;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
