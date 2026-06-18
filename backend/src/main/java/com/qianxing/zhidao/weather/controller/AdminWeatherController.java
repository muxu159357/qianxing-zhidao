package com.qianxing.zhidao.weather.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.weather.entity.QxWeatherLocation;
import com.qianxing.zhidao.weather.mapper.QxWeatherLocationMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "admin-weather", description = "后台天气配置")
@RestController
@RequestMapping("/api/admin/weather")
public class AdminWeatherController {
    private final QxWeatherLocationMapper mapper;
    public AdminWeatherController(QxWeatherLocationMapper m) { this.mapper = m; }
    @GetMapping("/locations") public ApiResponse<List<QxWeatherLocation>> list() { return ApiResponse.ok(mapper.selectList(new LambdaQueryWrapper<QxWeatherLocation>().orderByAsc(QxWeatherLocation::getSortOrder))); }
    @PostMapping("/locations") public ApiResponse<QxWeatherLocation> create(@RequestBody QxWeatherLocation l) { mapper.insert(l); return ApiResponse.ok(l); }
    @PutMapping("/locations/{id}") public ApiResponse<QxWeatherLocation> update(@PathVariable Long id, @RequestBody QxWeatherLocation p) { var l = mapper.selectById(id); if (l == null) throw new BusinessException(404, "地点不存在"); if (p.getLocationName() != null) l.setLocationName(p.getLocationName()); if (p.getUpdateEnabled() != null) l.setUpdateEnabled(p.getUpdateEnabled()); if (p.getStatus() != null) l.setStatus(p.getStatus()); mapper.updateById(l); return ApiResponse.ok(l); }
    @DeleteMapping("/locations/{id}") public ApiResponse<Void> delete(@PathVariable Long id) { mapper.deleteById(id); return ApiResponse.ok(); }
}
