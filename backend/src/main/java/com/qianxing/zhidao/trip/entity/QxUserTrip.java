package com.qianxing.zhidao.trip.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("qx_user_trip")
public class QxUserTrip {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private Long routeId;
    private String routeName;
    private String customName;
    private String status;
    private Integer dayCount;
    private String energyLevel;
    private LocalDate travelStartDate;
    private LocalDate travelEndDate;
    private String routeSnapshotJson;
    private String planSnapshotJson;
    private Long aiResultId;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    @TableLogic
    private Integer deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
