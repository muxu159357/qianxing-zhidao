package com.qianxing.zhidao.controller;

import com.qianxing.zhidao.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "health", description = "健康检查")
@RestController
public class HealthController {

    @Operation(summary = "后端健康检查")
    @GetMapping("/api/health")
    public ApiResponse<String> health() {
        return ApiResponse.ok("qianxing-zhidao backend is running");
    }
}
