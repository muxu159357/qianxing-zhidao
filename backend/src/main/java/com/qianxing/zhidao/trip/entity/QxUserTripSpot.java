package com.qianxing.zhidao.trip.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_user_trip_spot")
public class QxUserTripSpot {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long tripDayId;
    private Long tripId;
    private Long scenicSpotId;
    private String spotName;
    private Integer spotOrder;
    private LocalDateTime createdAt;
}
