package com.qianxing.zhidao.trip.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_trip_review")
public class QxTripReview {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long tripId;
    private Integer rating;
    private String highlights;
    private String regrets;
    private String nextAdvice;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
