package com.qianxing.zhidao.auth.dto;

public class WechatLoginResponse {
    private String token;
    private Long userId;
    private String nickname;
    private String avatarUrl;
    private boolean isNewUser;

    public WechatLoginResponse() {}

    public WechatLoginResponse(String token, Long userId, String nickname, String avatarUrl, boolean isNewUser) {
        this.token = token;
        this.userId = userId;
        this.nickname = nickname;
        this.avatarUrl = avatarUrl;
        this.isNewUser = isNewUser;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public boolean isNewUser() { return isNewUser; }
    public void setNewUser(boolean newUser) { isNewUser = newUser; }
}
