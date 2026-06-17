package com.qianxing.zhidao.user.dto;

public class UserProfileVO {
    private Long id;
    private String nickname;
    private String avatarUrl;
    private String phone;

    public UserProfileVO() {}

    public UserProfileVO(Long id, String nickname, String avatarUrl, String phone) {
        this.id = id;
        this.nickname = nickname;
        this.avatarUrl = avatarUrl;
        this.phone = phone;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
}
