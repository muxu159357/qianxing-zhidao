package com.qianxing.zhidao.route.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.route.entity.QxRouteDay;
import com.qianxing.zhidao.route.mapper.QxRouteDayMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "admin-route-day", description = "后台路线日程")
@RestController
@RequestMapping("/api/admin/routes/{routeId}/days")
public class AdminRouteDayController {
    private final QxRouteDayMapper m;
    public AdminRouteDayController(QxRouteDayMapper m) { this.m = m; }
    @GetMapping public ApiResponse<List<QxRouteDay>> list(@PathVariable Long routeId) { return ApiResponse.ok(m.selectList(new LambdaQueryWrapper<QxRouteDay>().eq(QxRouteDay::getRouteId, routeId).orderByAsc(QxRouteDay::getDayNumber))); }
    @PostMapping public ApiResponse<QxRouteDay> create(@PathVariable Long routeId, @RequestBody QxRouteDay d) { d.setRouteId(routeId); m.insert(d); return ApiResponse.ok(d); }
    @PutMapping("/{dayId}") public ApiResponse<QxRouteDay> update(@PathVariable Long routeId, @PathVariable Long dayId, @RequestBody QxRouteDay p) { var d = m.selectById(dayId); if (d == null || !d.getRouteId().equals(routeId)) throw new BusinessException(404, "日程不存在"); if (p.getTitle() != null) d.setTitle(p.getTitle()); if (p.getDescription() != null) d.setDescription(p.getDescription()); if (p.getMeals() != null) d.setMeals(p.getMeals()); if (p.getAccommodation() != null) d.setAccommodation(p.getAccommodation()); m.updateById(d); return ApiResponse.ok(d); }
    @DeleteMapping("/{dayId}") public ApiResponse<Void> delete(@PathVariable Long routeId, @PathVariable Long dayId) { var d = m.selectById(dayId); if (d == null || !d.getRouteId().equals(routeId)) throw new BusinessException(404, "日程不存在"); m.deleteById(dayId); return ApiResponse.ok(); }
}
