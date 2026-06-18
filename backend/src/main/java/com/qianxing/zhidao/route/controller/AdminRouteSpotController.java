package com.qianxing.zhidao.route.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.route.entity.QxRouteSpot;
import com.qianxing.zhidao.route.mapper.QxRouteSpotMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "admin-route-spot", description = "后台路线景点关联")
@RestController
@RequestMapping("/api/admin/routes/{routeId}/spots")
public class AdminRouteSpotController {
    private final QxRouteSpotMapper m;
    public AdminRouteSpotController(QxRouteSpotMapper m) { this.m = m; }
    @GetMapping public ApiResponse<List<QxRouteSpot>> list(@PathVariable Long routeId) { return ApiResponse.ok(m.selectList(new LambdaQueryWrapper<QxRouteSpot>().eq(QxRouteSpot::getRouteId, routeId).orderByAsc(QxRouteSpot::getSpotOrder))); }
    @PostMapping public ApiResponse<QxRouteSpot> add(@PathVariable Long routeId, @RequestBody QxRouteSpot s) { s.setRouteId(routeId); m.insert(s); return ApiResponse.ok(s); }
    @DeleteMapping("/{id}") public ApiResponse<Void> remove(@PathVariable Long id) { m.deleteById(id); return ApiResponse.ok(); }
}
