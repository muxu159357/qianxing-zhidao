package com.qianxing.zhidao.scenic.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("qx_scenic_spot")
public class QxScenicSpot {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String spotCode;
    private String name;
    private String city;
    private String regionCode;
    private String category;
    private BigDecimal rating;
    private Integer ticketPrice;
    private String visitDuration;
    private String bestSeason;
    private String description;
    private String highlights;
    private String tips;
    private String tags;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer sortOrder;
    private Integer status;
    @TableLogic
    private Integer deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
