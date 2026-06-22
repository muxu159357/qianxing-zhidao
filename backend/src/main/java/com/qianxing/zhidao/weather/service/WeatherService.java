package com.qianxing.zhidao.weather.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.route.entity.QxRoute;
import com.qianxing.zhidao.route.entity.QxRouteSpot;
import com.qianxing.zhidao.route.mapper.QxRouteMapper;
import com.qianxing.zhidao.route.mapper.QxRouteSpotMapper;
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
import java.util.stream.Collectors;

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
    private final QxRouteMapper routeMapper;
    private final QxRouteSpotMapper routeSpotMapper;
    private final RestTemplate restTemplate;
    private final boolean configured;
    private final String apiBaseUrl;
    private final String apiKey;

    public WeatherService(QxScenicWeatherMapper weatherMapper, QxWeatherLocationMapper locationMapper,
                          QxScenicSpotMapper spotMapper, QxRouteMapper routeMapper,
                          QxRouteSpotMapper routeSpotMapper, RestTemplate restTemplate,
                          @Value("${weather.api-base-url:}") String apiBaseUrl,
                          @Value("${weather.api-key:}") String apiKey) {
        this.weatherMapper = weatherMapper;
        this.locationMapper = locationMapper;
        this.spotMapper = spotMapper;
        this.routeMapper = routeMapper;
        this.routeSpotMapper = routeSpotMapper;
        this.restTemplate = restTemplate;
        this.apiBaseUrl = apiBaseUrl != null ? apiBaseUrl.trim() : "";
        this.apiKey = apiKey != null ? apiKey.trim() : "";
        this.configured = !this.apiKey.isBlank() && !this.apiBaseUrl.isBlank();
    }
    public boolean isConfigured() { return configured; }
    public List<QxScenicWeather> getScenicWeather(Long scenicId) {
        return weatherMapper.selectList(new LambdaQueryWrapper<QxScenicWeather>()
                .eq(QxScenicWeather::getScenicSpotId, scenicId).orderByDesc(QxScenicWeather::getWeatherDate).last("LIMIT 7"));
    }

    public List<QxScenicWeather> refreshScenicWeather(Long scenicId) {
        if (!configured) throw new BusinessException(501, "天气服务暂未配置，请联系管理员");
        QxScenicSpot spot = spotMapper.selectById(scenicId);
        if (spot == null) throw new BusinessException(404, "景区不存在");
        List<QxScenicWeather> existing = getScenicWeather(scenicId);
        if (!existing.isEmpty()) {
            QxScenicWeather latest = existing.get(0);
            if (latest.getFetchedAt() != null && latest.getFetchedAt().isAfter(LocalDateTime.now().minusMinutes(30)))
                return existing;
        }
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
        String url = apiBaseUrl + "?key=" + apiKey + "&city=" + adcode + "&extensions=all";
        try {
            Map<String, Object> resp = restTemplate.getForObject(url, Map.class);
            if (resp == null || !"1".equals(String.valueOf(resp.get("status")))) return List.of();
            List<Map<String, Object>> forecasts = (List<Map<String, Object>>) resp.getOrDefault("forecasts", List.of());
            if (forecasts.isEmpty()) return List.of();
            return (List<Map<String, Object>>) forecasts.get(0).getOrDefault("casts", List.of());
        } catch (Exception e) {
            String sanitizedUrl = url.replaceAll("key=[^&]+", "key=***");
            log.error("Weather API failed for {}: {}", sanitizedUrl, e.getMessage());
            throw new BusinessException(500, "天气数据获取失败，请稍后再试");
        }
    }

    private String resolveCityCode(String city) {
        if (city == null) return "520100";
        for (var e : CITY_CODE.entrySet()) if (city.contains(e.getKey())) return e.getValue();
        return "520100";
    }

    private LocalDate parseDate(String s) { try { return LocalDate.parse(s); } catch (Exception e) { return LocalDate.now(); } }

    private int safeWindLevel(String level) {
        try { return level != null && !level.isBlank() ? Integer.parseInt(level.trim()) : 0; }
        catch (NumberFormatException e) { return 0; }
    }

    public List<QxWeatherLocation> listLocations() {
        return locationMapper.selectList(new LambdaQueryWrapper<QxWeatherLocation>().eq(QxWeatherLocation::getStatus, 1));
    }

    public Map<String, Object> getRouteWeather(Long routeId) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("routeId", routeId);

        QxRoute route = routeMapper.selectById(routeId);
        if (route == null) throw new BusinessException(404, "路线不存在");

        List<QxRouteSpot> spots = routeSpotMapper.selectList(
                new LambdaQueryWrapper<QxRouteSpot>().eq(QxRouteSpot::getRouteId, routeId));
        if (spots.isEmpty()) {
            result.put("available", false);
            result.put("summary", "当前天气参考暂不可用，出发前建议查看景区官方信息。");
            result.put("items", List.of());
            result.put("tips", List.of("山地景区天气变化较快，建议准备雨具和舒适鞋。"));
            return result;
        }

        List<Map<String, Object>> items = new ArrayList<>();
        boolean anyCached = false;

        for (QxRouteSpot rp : spots) {
            Long scenicId = rp.getScenicSpotId();
            QxScenicSpot scenic = spotMapper.selectById(scenicId);
            if (scenic == null) continue;

            List<QxScenicWeather> weatherList = weatherMapper.selectList(
                    new LambdaQueryWrapper<QxScenicWeather>().eq(QxScenicWeather::getScenicSpotId, scenicId)
                            .orderByDesc(QxScenicWeather::getWeatherDate).last("LIMIT 3"));

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("scenicId", scenicId);
            item.put("scenicName", scenic.getName());

            if (!weatherList.isEmpty()) {
                anyCached = true;
                QxScenicWeather w = weatherList.get(0);
                item.put("weatherText", w.getWeatherDesc());
                item.put("temperature", w.getTemperatureLow() + "°C~" + w.getTemperatureHigh() + "°C");
                item.put("weatherDate", w.getWeatherDate().toString());
                List<String> tips = new ArrayList<>();
                if (scenic.getName().contains("黄果树") || scenic.getName().contains("瀑布"))
                    tips.add("瀑布景区湿度较高，建议穿防滑鞋");
                if (safeWindLevel(w.getWindLevel()) >= 4)
                    tips.add("风力较大，注意安全");
                item.put("tips", tips);
            } else {
                item.put("weatherText", "暂无天气数据");
                item.put("temperature", "暂无");
                item.put("tips", List.of("出行前建议查看景区官方信息"));
            }
            items.add(item);
        }

        result.put("available", anyCached);
        if (anyCached) {
            result.put("summary", "沿线山地天气变化较快，建议准备雨具和舒适鞋。");
        } else {
            result.put("summary", "当前天气参考暂不可用，出发前建议查看景区官方信息。");
        }
        result.put("items", items);
        result.put("tips", List.of(
                "山地景区天气变化较快，建议准备雨具和舒适鞋。",
                "以上为参考数据，以官方平台公告为准。"));
        return result;
    }
}
