package com.qianxing.zhidao.user.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_user")
public class QxUser {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String openid;
    private String unionid;
    private String nickname;
    private String avatarUrl;
    private String phone;
    private Integer status;
    @TableLogic
    private Integer deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
