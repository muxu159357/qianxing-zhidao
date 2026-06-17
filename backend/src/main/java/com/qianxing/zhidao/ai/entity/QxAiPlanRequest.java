package com.qianxing.zhidao.ai.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_ai_plan_request")
public class QxAiPlanRequest {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String sessionId;
    private String inputTags;
    private Integer inputDays;
    private String inputBudget;
    private String inputCrowd;
    private String inputEnergy;
    private String inputPace;
    private String inputJson;
    private String profileJson;
    private String contextJson;
    private String status;
    private String errorMessage;
    private Integer elapsedMs;
    private LocalDateTime createdAt;
}
