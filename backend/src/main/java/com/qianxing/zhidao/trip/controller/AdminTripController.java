package com.qianxing.zhidao.trip.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.common.dto.PageResult;
import com.qianxing.zhidao.trip.entity.QxUserTrip;
import com.qianxing.zhidao.trip.mapper.QxUserTripMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "admin-trip", description = "后台行程管理")
@RestController
@RequestMapping("/api/admin/trips")
public class AdminTripController {
    private final QxUserTripMapper mapper;
    public AdminTripController(QxUserTripMapper m) { this.mapper = m; }
    @GetMapping public ApiResponse<PageResult<QxUserTrip>> list(
            @RequestParam(required = false) Long userId, @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "20") int size) {
        var qw = new LambdaQueryWrapper<QxUserTrip>();
        if (userId != null) qw.eq(QxUserTrip::getUserId, userId);
        if (status != null && !status.isBlank()) qw.eq(QxUserTrip::getStatus, status);
        qw.orderByDesc(QxUserTrip::getCreatedAt);
        var mp = new Page<QxUserTrip>(page, size); var r = mapper.selectPage(mp, qw);
        return ApiResponse.ok(PageResult.of(r.getRecords(), r.getTotal(), page, size));
    }
    @GetMapping("/{id}") public ApiResponse<QxUserTrip> get(@PathVariable Long id) { return ApiResponse.ok(mapper.selectById(id)); }
}
