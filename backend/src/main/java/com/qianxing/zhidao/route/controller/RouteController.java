package com.qianxing.zhidao.route.controller;

import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.common.dto.PageResult;
import com.qianxing.zhidao.route.entity.QxRoute;
import com.qianxing.zhidao.route.entity.QxRouteDay;
import com.qianxing.zhidao.route.entity.QxRouteSpot;
import com.qianxing.zhidao.route.service.RouteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "route", description = "路线接口")
@RestController
@RequestMapping("/api/app")
public class RouteController {

    private final RouteService routeService;

    public RouteController(RouteService routeService) {
        this.routeService = routeService;
    }

    @Operation(summary = "路线列表")
    @GetMapping("/routes")
    public ApiResponse<PageResult<QxRoute>> listRoutes(
            @Parameter(description = "体力等级") @RequestParam(required = false) String energyLevel,
            @Parameter(description = "主题") @RequestParam(required = false) String theme,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页条数") @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(routeService.listRoutes(energyLevel, theme, keyword, page, size));
    }

    @Operation(summary = "路线详情")
    @GetMapping("/routes/{id}")
    public ApiResponse<QxRoute> getRoute(@PathVariable Long id) {
        return ApiResponse.ok(routeService.getRoute(id));
    }

    @Operation(summary = "路线每日安排")
    @GetMapping("/routes/{id}/days")
    public ApiResponse<List<QxRouteDay>> getRouteDays(@PathVariable Long id) {
        return ApiResponse.ok(routeService.getRouteDays(id));
    }

    @Operation(summary = "路线景点关联")
    @GetMapping("/routes/{id}/spots")
    public ApiResponse<List<QxRouteSpot>> getRouteSpots(@PathVariable Long id) {
        return ApiResponse.ok(routeService.getRouteSpots(id));
    }

    @Operation(summary = "路线推荐")
    @GetMapping("/routes/recommend")
    public ApiResponse<List<QxRoute>> recommend(
            @Parameter(description = "天数") @RequestParam(defaultValue = "3") int dayCount,
            @Parameter(description = "体力等级") @RequestParam(required = false) String energyLevel,
            @Parameter(description = "预算") @RequestParam(required = false) String budgetRange,
            @Parameter(description = "返回条数") @RequestParam(defaultValue = "5") int limit) {
        return ApiResponse.ok(routeService.recommend(dayCount, energyLevel, budgetRange, limit));
    }
}
