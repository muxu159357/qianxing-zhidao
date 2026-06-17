package com.qianxing.zhidao.weather.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.weather.entity.QxScenicWeather;
import com.qianxing.zhidao.weather.entity.QxWeatherLocation;
import com.qianxing.zhidao.weather.mapper.QxScenicWeatherMapper;
import com.qianxing.zhidao.weather.mapper.QxWeatherLocationMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WeatherService {
    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    private final QxScenicWeatherMapper scenicWeatherMapper;
    private final QxWeatherLocationMapper weatherLocationMapper;
    private final boolean weatherConfigured;
    private final String weatherProvider;

    public WeatherService(QxScenicWeatherMapper scenicWeatherMapper,
                          QxWeatherLocationMapper weatherLocationMapper,
                          @Value("${weather.api-key:}") String apiKey,
                          @Value("${weather.provider:}") String provider) {
        this.scenicWeatherMapper = scenicWeatherMapper;
        this.weatherLocationMapper = weatherLocationMapper;
        this.weatherConfigured = apiKey != null && !apiKey.isBlank();
        this.weatherProvider = provider;
    }

    public List<QxScenicWeather> getScenicWeather(Long scenicId) {
        return scenicWeatherMapper.selectList(
                new LambdaQueryWrapper<QxScenicWeather>()
                        .eq(QxScenicWeather::getScenicSpotId, scenicId)
                        .orderByDesc(QxScenicWeather::getWeatherDate)
                        .last("LIMIT 7"));
    }

    public String refreshWeather() {
        if (!weatherConfigured) {
            throw new BusinessException(501, "天气服务暂未配置，请设置 WEATHER_API_KEY 等环境变量");
        }
        return "天气刷新请求已提交（当前为骨架实现，provider=" + weatherProvider + "）";
    }

    public List<QxWeatherLocation> listLocations() {
        return weatherLocationMapper.selectList(
                new LambdaQueryWrapper<QxWeatherLocation>()
                        .eq(QxWeatherLocation::getStatus, 1)
                        .eq(QxWeatherLocation::getUpdateEnabled, 1));
    }
}
