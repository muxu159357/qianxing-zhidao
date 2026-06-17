package com.qianxing.zhidao.ai.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_ai_plan_result")
public class QxAiPlanResult {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long requestId;
    private String routeName;
    private String routeJson;
    private String rawResultJson;
    private String normalizedResultJson;
    private String errorJson;
    private Long adoptedTripId;
    private Integer isAdopted;
    private String modelName;
    private Integer promptTokens;
    private Integer completionTokens;
    private Integer elapsedMs;
    private LocalDateTime createdAt;
}
