package com.qianxing.zhidao.ai.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.qianxing.zhidao.ai.entity.QxAiPlanRequest;
import com.qianxing.zhidao.ai.entity.QxAiPlanResult;
import com.qianxing.zhidao.ai.mapper.QxAiPlanRequestMapper;
import com.qianxing.zhidao.ai.mapper.QxAiPlanResultMapper;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.common.dto.PageResult;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "admin-ai", description = "后台AI记录管理")
@RestController
@RequestMapping("/api/admin/ai")
public class AdminAiController {
    private final QxAiPlanRequestMapper reqMapper;
    private final QxAiPlanResultMapper resMapper;
    public AdminAiController(QxAiPlanRequestMapper r, QxAiPlanResultMapper s) { this.reqMapper = r; this.resMapper = s; }
    @GetMapping("/plans") public ApiResponse<PageResult<QxAiPlanRequest>> list(@RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "20") int size) {
        var qw = new LambdaQueryWrapper<QxAiPlanRequest>().orderByDesc(QxAiPlanRequest::getCreatedAt);
        var mp = new Page<QxAiPlanRequest>(page, size); var r = reqMapper.selectPage(mp, qw);
        return ApiResponse.ok(PageResult.of(r.getRecords(), r.getTotal(), page, size));
    }
    @GetMapping("/plans/{id}/result") public ApiResponse<QxAiPlanResult> getResult(@PathVariable Long id) { return ApiResponse.ok(resMapper.selectOne(new LambdaQueryWrapper<QxAiPlanResult>().eq(QxAiPlanResult::getRequestId, id))); }
}
