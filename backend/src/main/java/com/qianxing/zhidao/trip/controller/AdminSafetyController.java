package com.qianxing.zhidao.trip.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.trip.entity.QxTripSafetyItem;
import com.qianxing.zhidao.trip.mapper.QxTripSafetyItemMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "admin-safety", description = "后台安全清单管理")
@RestController
@RequestMapping("/api/admin/trips/{tripId}/safety-items")
public class AdminSafetyController {
    private final QxTripSafetyItemMapper m;
    public AdminSafetyController(QxTripSafetyItemMapper m) { this.m = m; }
    @GetMapping public ApiResponse<List<QxTripSafetyItem>> list(@PathVariable Long tripId) { return ApiResponse.ok(m.selectList(new LambdaQueryWrapper<QxTripSafetyItem>().eq(QxTripSafetyItem::getTripId, tripId).orderByAsc(QxTripSafetyItem::getSortOrder))); }
}
