package com.qianxing.zhidao.route.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_route_day")
public class QxRouteDay {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long routeId;
    private Integer dayNumber;
    private String title;
    private String description;
    private String meals;
    private String accommodation;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
