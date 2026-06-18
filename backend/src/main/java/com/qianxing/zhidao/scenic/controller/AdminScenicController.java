package com.qianxing.zhidao.scenic.controller;

import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.common.dto.PageResult;
import com.qianxing.zhidao.scenic.entity.QxScenicSpot;
import com.qianxing.zhidao.scenic.service.ScenicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "admin-scenic", description = "后台景点管理")
@RestController
@RequestMapping("/api/admin/scenic")
public class AdminScenicController {
    private final ScenicService scenicService;
    public AdminScenicController(ScenicService s) { this.scenicService = s; }

    @GetMapping("/spots")
    public ApiResponse<PageResult<QxScenicSpot>> list(
            @RequestParam(required = false) String category, @RequestParam(required = false) String city,
            @RequestParam(required = false) String keyword, @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.ok(scenicService.adminList(category, city, keyword, page, size));
    }

    @PostMapping("/spots")
    public ApiResponse<QxScenicSpot> create(@RequestBody QxScenicSpot spot) {
        return ApiResponse.ok(scenicService.createSpot(spot));
    }

    @PutMapping("/spots/{id}")
    public ApiResponse<QxScenicSpot> update(@PathVariable Long id, @RequestBody QxScenicSpot patch) {
        return ApiResponse.ok(scenicService.updateSpot(id, patch));
    }

    @DeleteMapping("/spots/{id}") public ApiResponse<Void> delete(@PathVariable Long id) { scenicService.deleteSpot(id); return ApiResponse.ok(); }
    @PutMapping("/spots/{id}/status") public ApiResponse<QxScenicSpot> toggleStatus(@PathVariable Long id, @RequestParam int status) { var patch = new QxScenicSpot(); patch.setStatus(status); return ApiResponse.ok(scenicService.updateSpot(id, patch)); }
}
