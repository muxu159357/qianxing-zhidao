package com.qianxing.zhidao.route.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_route_spot")
public class QxRouteSpot {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long routeDayId;
    private Long routeId;
    private Long scenicSpotId;
    private Integer spotOrder;
    private String stayDuration;
    private String visitTip;
    private LocalDateTime createdAt;
}
