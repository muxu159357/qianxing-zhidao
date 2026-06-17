package com.qianxing.zhidao.weather.controller;

import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.weather.entity.QxScenicWeather;
import com.qianxing.zhidao.weather.service.WeatherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @Operation(summary = "刷新天气数据")
    @PostMapping("/refresh")
    public ApiResponse<String> refresh() {
        return ApiResponse.ok(weatherService.refreshWeather());
    }
}
