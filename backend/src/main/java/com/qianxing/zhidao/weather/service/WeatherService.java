package com.qianxing.zhidao.weather.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.scenic.entity.QxScenicSpot;
import com.qianxing.zhidao.scenic.mapper.QxScenicSpotMapper;
import com.qianxing.zhidao.weather.entity.QxScenicWeather;
import com.qianxing.zhidao.weather.entity.QxWeatherLocation;
import com.qianxing.zhidao.weather.mapper.QxScenicWeatherMapper;
import com.qianxing.zhidao.weather.mapper.QxWeatherLocationMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class WeatherService {
    private static final Logger log = LoggerFactory.getLogger(WeatherService.class);

    private static final Map<String, String> CITY_CODE = Map.ofEntries(
            Map.entry("贵阳", "520100"), Map.entry("安顺", "520400"), Map.entry("遵义", "520300"),
            Map.entry("铜仁", "520600"), Map.entry("毕节", "520500"),
            Map.entry("黔东南", "522600"), Map.entry("黔南", "522700"), Map.entry("黔西南", "522300"));

    private final QxScenicWeatherMapper weatherMapper;
    private final QxWeatherLocationMapper locationMapper;
    private final QxScenicSpotMapper spotMapper;
    private final RestTemplate restTemplate;
    private final boolean configured;
    private final String apiBaseUrl;
    private final String apiKey;

    public WeatherService(QxScenicWeatherMapper weatherMapper, QxWeatherLocationMapper locationMapper,
                          QxScenicSpotMapper spotMapper, RestTemplate restTemplate,
                          @Value("${weather.api-base-url:}") String apiBaseUrl,
                          @Value("${weather.api-key:}") String apiKey) {
        this.weatherMapper = weatherMapper;
        this.locationMapper = locationMapper;
        this.spotMapper = spotMapper;
        this.restTemplate = restTemplate;
        this.apiBaseUrl = apiBaseUrl != null ? apiBaseUrl.trim() : "";
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.configured = !this.apiKey.isBlank() && !this.apiBaseUrl.isBlank();
    }

    public List<QxScenicWeather> getScenicWeather(Long scenicId) {
        return weatherMapper.selectList(new LambdaQueryWrapper<QxScenicWeather>()
                .eq(QxScenicWeather::getScenicSpotId, scenicId).orderByDesc(QxScenicWeather::getWeatherDate).last("LIMIT 7"));
    }

    public List<QxScenicWeather> refreshScenicWeather(Long scenicId) {
        if (!configured) throw new BusinessException(501, "天气服务暂未配置，请设置 WEATHER_API_KEY 等环境变量");
        QxScenicSpot spot = spotMapper.selectById(scenicId);
        if (spot == null) throw new BusinessException(404, "景区不存在");
        String adcode = resolveCityCode(spot.getCity());
        List<Map<String, Object>> forecasts = fetchForecast(adcode);
        if (forecasts.isEmpty()) return List.of();
        weatherMapper.delete(new LambdaQueryWrapper<QxScenicWeather>().eq(QxScenicWeather::getScenicSpotId, scenicId));
        List<QxScenicWeather> saved = new ArrayList<>();
        for (Map<String, Object> f : forecasts) {
            QxScenicWeather w = new QxScenicWeather();
            w.setScenicSpotId(scenicId);
            w.setWeatherDate(parseDate((String) f.get("date")));
            w.setTemperatureHigh(new BigDecimal((String) f.getOrDefault("daytemp", "0")));
            w.setTemperatureLow(new BigDecimal((String) f.getOrDefault("nighttemp", "0")));
            w.setWeatherDesc((String) f.getOrDefault("dayweather", ""));
            w.setWindDirection((String) f.getOrDefault("daywind", ""));
            w.setWindLevel((String) f.getOrDefault("daypower", ""));
            w.setProvider("amap");
            w.setFetchedAt(LocalDateTime.now());
            weatherMapper.insert(w);
            saved.add(w);
        }
        return saved;
    }

    private List<Map<String, Object>> fetchForecast(String adcode) {
        try {
            Map<String, Object> resp = restTemplate.getForObject(
                    apiBaseUrl + "?key=" + apiKey + "&city=" + adcode + "&extensions=all", Map.class);
            if (resp == null || !"1".equals(String.valueOf(resp.get("status")))) return List.of();
            List<Map<String, Object>> forecasts = (List<Map<String, Object>>) resp.getOrDefault("forecasts", List.of());
            if (forecasts.isEmpty()) return List.of();
            return (List<Map<String, Object>>) forecasts.get(0).getOrDefault("casts", List.of());
        } catch (Exception e) {
            log.error("Weather API failed: {}", e.getMessage());
            throw new BusinessException(500, "天气数据获取失败，请稍后再试");
        }
    }

    private String resolveCityCode(String city) {
        if (city == null) return "520100";
        for (var e : CITY_CODE.entrySet()) if (city.contains(e.getKey())) return e.getValue();
        return "520100";
    }

    private LocalDate parseDate(String s) { try { return LocalDate.parse(s); } catch (Exception e) { return LocalDate.now(); } }

    public List<QxWeatherLocation> listLocations() {
        return locationMapper.selectList(new LambdaQueryWrapper<QxWeatherLocation>().eq(QxWeatherLocation::getStatus, 1));
    }
}
