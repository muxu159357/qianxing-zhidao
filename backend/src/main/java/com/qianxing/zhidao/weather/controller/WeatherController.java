package com.qianxing.zhidao.weather.controller;

import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.weather.entity.QxScenicWeather;
import com.qianxing.zhidao.weather.service.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Tag(name = "weather", description = "天气接口")
@RestController
@RequestMapping("/api/app/weather")
public class WeatherController {

    private final WeatherService weatherService;

    public WeatherController(WeatherService weatherService) {
        this.weatherService = weatherService;
    }

    @Operation(summary = "景区天气查询")
    @GetMapping("/scenic/{scenicId}")
    public ApiResponse<List<QxScenicWeather>> getScenicWeather(@PathVariable Long scenicId) {
        return ApiResponse.ok(weatherService.getScenicWeather(scenicId));
    }

    @Operation(summary = "刷新景区天气")
    @PostMapping("/scenic/{scenicId}/refresh") public ApiResponse<List<QxScenicWeather>> refreshScenicWeather(@PathVariable Long scenicId) { return ApiResponse.ok(weatherService.refreshScenicWeather(scenicId)); }

    @GetMapping("/status") public ApiResponse<Map<String, Object>> status() { Map<String, Object> m = new LinkedHashMap<>(); m.put("provider","amap"); m.put("configured",weatherService.isConfigured()); m.put("locations",weatherService.listLocations().size()); return ApiResponse.ok(m); }

    @Operation(summary = "路线天气摘要")
    @GetMapping("/route/{routeId}")
    public ApiResponse<Map<String, Object>> getRouteWeather(@PathVariable Long routeId) {
        return ApiResponse.ok(weatherService.getRouteWeather(routeId));
    }
}
