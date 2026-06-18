package com.qianxing.zhidao.controller;

import com.qianxing.zhidao.ai.client.LlmClient;
import com.qianxing.zhidao.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

@Tag(name = "health", description = "健康检查")
@RestController
public class HealthController {

    private final LlmClient llmClient;
    private final String wxAppid;
    private final boolean wxSecretSet;
    private final String llmModel;

    public HealthController(LlmClient llmClient,
            @Value("${wx.appid:}") String appid,
            @Value("${wx.secret:}") String secret,
            @Value("${llm.model:}") String model) {
        this.llmClient = llmClient;
        this.wxAppid = appid;
        this.wxSecretSet = secret != null && !secret.isBlank();
        this.llmModel = model;
    }

    @GetMapping("/api/health")
    public ApiResponse<String> health() { return ApiResponse.ok("qianxing-zhidao backend is running"); }

    @GetMapping("/api/health/config")
    public ApiResponse<Map<String, Object>> config() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("wxAppidSet", wxAppid != null && !wxAppid.isBlank());
        m.put("wxAppidPrefix", wxAppid != null && wxAppid.length() >= 6 ? wxAppid.substring(0, 6) + "..." : "EMPTY");
        m.put("wxSecretSet", wxSecretSet);
        m.put("llmConfigured", llmClient.isConfigured());
        m.put("llmModel", llmModel != null && !llmModel.isBlank() ? llmModel : "UNSET");
        return ApiResponse.ok(m);
    }
}
