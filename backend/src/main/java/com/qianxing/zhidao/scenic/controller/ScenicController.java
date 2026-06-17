package com.qianxing.zhidao.scenic.controller;

import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.common.dto.PageResult;
import com.qianxing.zhidao.scenic.entity.QxScenicSpot;
import com.qianxing.zhidao.scenic.service.ScenicService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "scenic", description = "景点接口")
@RestController
@RequestMapping("/api/app/scenic")
public class ScenicController {

    private final ScenicService scenicService;

    public ScenicController(ScenicService scenicService) {
        this.scenicService = scenicService;
    }

    @Operation(summary = "景点列表")
    @GetMapping("/spots")
    public ApiResponse<PageResult<QxScenicSpot>> listSpots(
            @Parameter(description = "分类") @RequestParam(required = false) String category,
            @Parameter(description = "城市") @RequestParam(required = false) String city,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页条数") @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(scenicService.listSpots(category, city, keyword, page, size));
    }

    @Operation(summary = "景点详情")
    @GetMapping("/spots/{id}")
    public ApiResponse<QxScenicSpot> getSpot(@PathVariable Long id) {
        return ApiResponse.ok(scenicService.getSpot(id));
    }
}
