package com.qianxing.zhidao.ai.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.trip.entity.QxUserTrip;
import com.qianxing.zhidao.trip.entity.QxUserTripDay;
import com.qianxing.zhidao.trip.mapper.QxUserTripMapper;
import com.qianxing.zhidao.trip.mapper.QxUserTripDayMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class AiTodaySuggestionService {

    private static final String[] TODAY_KEYWORDS = {
            "今天怎么玩", "今天怎么安排", "现在去哪玩", "接下来怎么走", "今天适合去哪",
            "今天有什么推荐", "今天去哪", "今日建议", "今日怎么玩"
    };

    private final QxUserTripMapper tripMapper;
    private final QxUserTripDayMapper tripDayMapper;

    public AiTodaySuggestionService(QxUserTripMapper tripMapper, QxUserTripDayMapper tripDayMapper) {
        this.tripMapper = tripMapper;
        this.tripDayMapper = tripDayMapper;
    }

    public boolean isTodaySuggestionQuestion(String q) {
        if (q == null) return false;
        for (String kw : TODAY_KEYWORDS) if (q.contains(kw)) return true;
        return false;
    }

    public Map<String, Object> buildTripProgressContext(Long userId) {
        Map<String, Object> ctx = new LinkedHashMap<>();
        ctx.put("enabled", true);
        if (userId == null) {
            ctx.put("available", false);
            ctx.put("tips", List.of("用户未登录，无法查询行程进度"));
            return ctx;
        }

        // Priority: ongoing > upcoming > active
        List<QxUserTrip> trips = tripMapper.selectList(
                new LambdaQueryWrapper<QxUserTrip>().eq(QxUserTrip::getUserId, userId)
                        .eq(QxUserTrip::getStatus, "ongoing").last("LIMIT 1"));
        if (trips.isEmpty()) {
            trips = tripMapper.selectList(
                    new LambdaQueryWrapper<QxUserTrip>().eq(QxUserTrip::getUserId, userId)
                            .eq(QxUserTrip::getStatus, "upcoming").last("LIMIT 1"));
        }
        if (trips.isEmpty()) {
            trips = tripMapper.selectList(
                    new LambdaQueryWrapper<QxUserTrip>().eq(QxUserTrip::getUserId, userId)
                            .eq(QxUserTrip::getStatus, "active").last("LIMIT 1"));
        }

        if (trips.isEmpty()) {
            ctx.put("available", false);
            ctx.put("tips", List.of("用户当前暂无有效行程，可给出通用贵州当日游建议。"));
            return ctx;
        }

        QxUserTrip trip = trips.get(0);
        ctx.put("available", true);
        ctx.put("tripId", trip.getId());
        ctx.put("tripTitle", trip.getCustomName() != null ? trip.getCustomName() : trip.getRouteName());
        ctx.put("status", trip.getStatus() != null ? trip.getStatus() : "upcoming");
        ctx.put("totalDays", trip.getDayCount() != null ? trip.getDayCount() : 1);

        int dayNumber = computeCurrentDayNumber(trip);
        ctx.put("currentDayNumber", Math.min(dayNumber, trip.getDayCount() != null ? trip.getDayCount() : 1));

        List<QxUserTripDay> days = tripDayMapper.selectList(
                new LambdaQueryWrapper<QxUserTripDay>().eq(QxUserTripDay::getTripId, trip.getId())
                        .eq(QxUserTripDay::getDayNumber, ctx.get("currentDayNumber")).last("LIMIT 1"));
        if (!days.isEmpty()) {
            QxUserTripDay d = days.get(0);
            Map<String, Object> plan = new LinkedHashMap<>();
            plan.put("dayNumber", d.getDayNumber());
            plan.put("title", d.getTitle() != null ? d.getTitle() : "第" + d.getDayNumber() + "天");
            plan.put("description", d.getDescription() != null ? d.getDescription() : "");
            plan.put("meals", d.getMeals() != null ? d.getMeals() : "");
            plan.put("accommodation", d.getAccommodation() != null ? d.getAccommodation() : "");
            ctx.put("todayPlan", plan);
        } else {
            ctx.put("todayPlan", Map.of("title", "第" + ctx.get("currentDayNumber") + "天", "description", "暂无详细安排"));
        }

        return ctx;
    }

    public int computeCurrentDayNumber(QxUserTrip trip) {
        if (trip.getStartedAt() != null) {
            long days = ChronoUnit.DAYS.between(trip.getStartedAt().toLocalDate(), LocalDate.now());
            return Math.max(1, (int) days + 1);
        }
        if (trip.getTravelStartDate() != null) {
            long days = ChronoUnit.DAYS.between(trip.getTravelStartDate(), LocalDate.now());
            return Math.max(1, (int) days + 1);
        }
        return 1;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> buildLocationContext(Map<String, Object> body) {
        Map<String, Object> ctx = new LinkedHashMap<>();
        ctx.put("enabled", true);

        if (body == null || body.isEmpty()) {
            ctx.put("available", false);
            ctx.put("hasCoordinates", false);
            ctx.put("privacyNote", "仅用于本次出行建议");
            return ctx;
        }

        Object locObj = body.get("locationContext");
        if (!(locObj instanceof Map)) {
            ctx.put("available", false);
            ctx.put("hasCoordinates", false);
            ctx.put("privacyNote", "仅用于本次出行建议");
            return ctx;
        }

        Map<String, Object> loc = (Map<String, Object>) locObj;
        Boolean enabled = (Boolean) loc.getOrDefault("enabled", false);

        if (!Boolean.TRUE.equals(enabled)) {
            ctx.put("available", false);
            ctx.put("hasCoordinates", false);
            ctx.put("privacyNote", "仅用于本次出行建议");
            return ctx;
        }

        Object lat = loc.get("latitude");
        Object lng = loc.get("longitude");
        if (lat instanceof Number && lng instanceof Number) {
            ctx.put("available", true);
            ctx.put("hasCoordinates", true);
            ctx.put("privacyNote", "仅用于本次出行建议");
            // Do NOT log coordinates
        } else {
            ctx.put("available", false);
            ctx.put("hasCoordinates", false);
            ctx.put("privacyNote", "仅用于本次出行建议");
        }

        return ctx;
    }

    public String buildTodayPromptPrefix(Map<String, Object> tripCtx, Map<String, Object> locCtx) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("\n\n用户正在询问今日建议，请使用 today-suggestion 模式回答：\n");
        prompt.append("1. 先看用户是否有行程，有行程优先围绕当天安排给建议；\n");
        prompt.append("2. 如果有天气参考，结合天气给出山地提醒；\n");
        prompt.append("3. 如果有位置上下文，可以提及\"结合你当前附近情况\"，但不要暴露经纬度；\n");
        prompt.append("4. 如果没有行程，给出贵州通用当日建议；\n");
        prompt.append("5. 短段落，不使用 Markdown；\n");
        prompt.append("6. 不编造天气、票价、开放状态；\n");
        prompt.append("7. 涉及时效信息，提醒以景区官方公告为准。\n");

        prompt.append("\n行程进度信息：\n");
        if (Boolean.TRUE.equals(tripCtx.get("available"))) {
            prompt.append("用户当前行程：").append(tripCtx.get("tripTitle")).append("，状态：").append(tripCtx.get("status")).append("\n");
            prompt.append("当前是第").append(tripCtx.get("currentDayNumber")).append("天，共").append(tripCtx.get("totalDays")).append("天\n");
            @SuppressWarnings("unchecked")
            Map<String, Object> todayPlan = (Map<String, Object>) tripCtx.get("todayPlan");
            if (todayPlan != null && !todayPlan.isEmpty()) {
                prompt.append("今日安排：").append(todayPlan.get("title")).append(" — ").append(todayPlan.get("description")).append("\n");
            }
        } else {
            prompt.append("用户暂无有效行程\n");
        }

        if (Boolean.TRUE.equals(locCtx.get("hasCoordinates"))) {
            prompt.append("\n用户授权了当前位置（坐标已脱敏），可结合附近景区给建议。\n");
        }

        return prompt.toString();
    }

    public String buildFallbackAnswer(Map<String, Object> tripCtx) {
        StringBuilder answer = new StringBuilder();
        if (Boolean.TRUE.equals(tripCtx.get("available"))) {
            answer.append("根据你当前的行程「").append(tripCtx.get("tripTitle")).append("」，");
            answer.append("今天是第").append(tripCtx.get("currentDayNumber")).append("天。\n\n");
            @SuppressWarnings("unchecked")
            Map<String, Object> todayPlan = (Map<String, Object>) tripCtx.get("todayPlan");
            if (todayPlan != null && !todayPlan.isEmpty()) {
                answer.append("今日建议围绕").append(todayPlan.get("title")).append("展开。\n\n");
            }
        } else {
            answer.append("你当前暂无有效行程。\n\n");
        }
        answer.append("贵州山地天气变化较快，出发前建议查看景区官方信息，准备雨具和舒适鞋。\n\n");
        answer.append("你可以告诉我出行天数、偏好和节奏，我来帮你规划今天的行程安排。");
        return answer.toString();
    }
}
