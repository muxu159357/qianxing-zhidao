package com.qianxing.zhidao.ai.controller;

import com.qianxing.zhidao.ai.entity.QxAiPlanRequest;
import com.qianxing.zhidao.ai.service.AiService;
import com.qianxing.zhidao.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Tag(name = "ai", description = "AI规划与问答接口")
@RestController
@RequestMapping("/api/app/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    private Long uid(HttpServletRequest req) { return (Long) req.getAttribute("userId"); }

    @Operation(summary = "创建AI规划")
    @PostMapping("/plans")
    public ApiResponse<QxAiPlanRequest> createPlan(@Valid @RequestBody QxAiPlanRequest request, HttpServletRequest req) {
        return ApiResponse.ok(aiService.createPlan(uid(req), request));
    }

    @Operation(summary = "查询AI规划结果")
    @GetMapping("/plans/{requestId}")
    public ApiResponse<QxAiPlanRequest> getPlan(@PathVariable Long requestId, HttpServletRequest req) {
        return ApiResponse.ok(aiService.getPlan(requestId, uid(req)));
    }

    @Operation(summary = "AI问答")
    @PostMapping("/chat")
    public ApiResponse<Map<String, Object>> chat(
            @Parameter(description = "用户问题") @RequestBody Map<String, String> body,
            HttpServletRequest req) {
        String question = body.getOrDefault("question", "");
        if (question.isBlank()) {
            return ApiResponse.fail(400, "问题不能为空");
        }
        return ApiResponse.ok(aiService.chat(uid(req), question));
    }
}
