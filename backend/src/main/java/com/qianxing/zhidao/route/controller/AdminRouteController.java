package com.qianxing.zhidao.route.controller;

import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.common.dto.PageResult;
import com.qianxing.zhidao.route.entity.QxRoute;
import com.qianxing.zhidao.route.service.RouteService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "admin-route", description = "后台路线管理")
@RestController
@RequestMapping("/api/admin/routes")
public class AdminRouteController {
    private final RouteService routeService;
    public AdminRouteController(RouteService s) { this.routeService = s; }
    @GetMapping public ApiResponse<PageResult<QxRoute>> list(@RequestParam(required = false) String keyword, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "20") int size) { return ApiResponse.ok(routeService.adminList(keyword, page, size)); }
    @GetMapping("/{id}") public ApiResponse<QxRoute> get(@PathVariable Long id) { return ApiResponse.ok(routeService.adminGetRoute(id)); }
    @PostMapping public ApiResponse<QxRoute> create(@RequestBody QxRoute r) { return ApiResponse.ok(routeService.createRoute(r)); }
    @PutMapping("/{id}") public ApiResponse<QxRoute> update(@PathVariable Long id, @RequestBody QxRoute p) { return ApiResponse.ok(routeService.updateRoute(id, p)); }
    @DeleteMapping("/{id}") public ApiResponse<Void> delete(@PathVariable Long id) { routeService.deleteRoute(id); return ApiResponse.ok(); }
    @PutMapping("/{id}/status") public ApiResponse<QxRoute> toggleStatus(@PathVariable Long id, @RequestParam int status) { var p = new QxRoute(); p.setStatus(status); return ApiResponse.ok(routeService.updateRoute(id, p)); }
}
