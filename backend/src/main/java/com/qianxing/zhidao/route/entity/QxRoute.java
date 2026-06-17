package com.qianxing.zhidao.route.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_route")
public class QxRoute {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String routeCode;
    private String name;
    private String description;
    private Integer dayCount;
    private String energyLevel;
    private String budgetRange;
    private String suitableCrowd;
    private String tags;
    private String theme;
    private String coverImage;
    private Integer sortOrder;
    private Integer status;
    @TableLogic
    private Integer deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
