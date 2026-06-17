package com.qianxing.zhidao.trip.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_user_trip_day")
public class QxUserTripDay {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long tripId;
    private Integer dayNumber;
    private String title;
    private String description;
    private String meals;
    private String accommodation;
    private Integer isEdited;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
