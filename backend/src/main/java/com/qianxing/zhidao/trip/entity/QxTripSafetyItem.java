package com.qianxing.zhidao.trip.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_trip_safety_item")
public class QxTripSafetyItem {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long tripId;
    private String itemText;
    private Integer isChecked;
    private Integer sortOrder;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
