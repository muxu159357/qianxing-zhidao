package com.qianxing.zhidao.ai.draft;

import com.qianxing.zhidao.common.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@Tag(name = "ai-draft", description = "AI线路草稿")
@RestController
@RequestMapping("/api/app/ai/plan-drafts")
public class AiDraftController {
    private final AiPlanDraftService service;
    public AiDraftController(AiPlanDraftService s) { this.service = s; }
    private Long uid(HttpServletRequest r) { return (Long) r.getAttribute("userId"); }
    @PostMapping public ApiResponse<Map<String, Object>> generate(@RequestBody Map<String, Object> p, HttpServletRequest r) { return ApiResponse.ok(service.generate(uid(r), p)); }
    @GetMapping("/{did}") public ApiResponse<Map<String, Object>> get(@PathVariable String did, HttpServletRequest r) { return ApiResponse.ok(service.get(uid(r), did)); }
    @PostMapping("/{did}/confirm") public ApiResponse<Map<String, Object>> confirm(@PathVariable String did, HttpServletRequest r) { return ApiResponse.ok(service.confirm(uid(r), did)); }
}
