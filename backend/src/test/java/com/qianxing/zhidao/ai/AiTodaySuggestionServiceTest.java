package com.qianxing.zhidao.ai;

import com.qianxing.zhidao.ai.service.AiTodaySuggestionService;
import com.qianxing.zhidao.trip.entity.QxUserTrip;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

class AiTodaySuggestionServiceTest {

    private final AiTodaySuggestionService service = new AiTodaySuggestionService(null, null);

    // ========== isTodaySuggestionQuestion ==========

    @Test @DisplayName("今天怎么玩 is today suggestion")
    void detectsJinTianZenMeWan() { assertTrue(service.isTodaySuggestionQuestion("今天怎么玩？")); }

    @Test @DisplayName("现在去哪玩 is today suggestion")
    void detectsXianZaiQuNaWan() { assertTrue(service.isTodaySuggestionQuestion("现在去哪玩")); }

    @Test @DisplayName("普通问题不是 today suggestion")
    void normalQuestionNotDetected() { assertFalse(service.isTodaySuggestionQuestion("贵州有哪些景点")); }

    @Test @DisplayName("空字符串不是 today suggestion")
    void nullNotDetected() {
        assertFalse(service.isTodaySuggestionQuestion(null));
        assertFalse(service.isTodaySuggestionQuestion(""));
    }

    @Test @DisplayName("全部9个关键词均识别")
    void allNineKeywordsDetected() {
        String[] keywords = {"今天怎么玩", "今天怎么安排", "现在去哪玩", "接下来怎么走",
                "今天适合去哪", "今天有什么推荐", "今天去哪", "今日建议", "今日怎么玩"};
        for (String kw : keywords) assertTrue(service.isTodaySuggestionQuestion(kw), "Failed: " + kw);
    }

    // ========== buildLocationContext ==========

    @Test @DisplayName("空 body 返回 hasCoordinates=false")
    void emptyBodyNoCoordinates() {
        Map<String, Object> ctx = service.buildLocationContext(null);
        assertEquals(false, ctx.get("hasCoordinates"));
        assertEquals(false, ctx.get("available"));
    }

    @Test @DisplayName("enabled=false 返回 hasCoordinates=false")
    void disabledLocationNoCoordinates() {
        Map<String, Object> body = Map.of("locationContext", Map.of("enabled", false));
        Map<String, Object> ctx = service.buildLocationContext(body);
        assertEquals(false, ctx.get("hasCoordinates"));
    }

    @Test @DisplayName("enabled=true 且有坐标时 hasCoordinates=true")
    void enabledWithCoords() {
        Map<String, Object> loc = new LinkedHashMap<>();
        loc.put("enabled", true);
        loc.put("latitude", 26.57);
        loc.put("longitude", 106.71);
        Map<String, Object> body = Map.of("locationContext", (Object) loc);
        Map<String, Object> ctx = service.buildLocationContext(body);
        assertEquals(true, ctx.get("hasCoordinates"));
        assertEquals(true, ctx.get("available"));
    }

    @Test @DisplayName("enabled=true 但无坐标时降级")
    void enabledNoCoordinates() {
        Map<String, Object> loc = new LinkedHashMap<>();
        loc.put("enabled", true);
        Map<String, Object> body = Map.of("locationContext", (Object) loc);
        Map<String, Object> ctx = service.buildLocationContext(body);
        assertEquals(false, ctx.get("hasCoordinates"));
    }

    @Test @DisplayName("坐标不作为字符串暴露")
    void coordinatesNotInStringForm() {
        Map<String, Object> loc = new LinkedHashMap<>();
        loc.put("enabled", true);
        loc.put("latitude", 26.57);
        loc.put("longitude", 106.71);
        Map<String, Object> body = Map.of("locationContext", (Object) loc);
        Map<String, Object> ctx = service.buildLocationContext(body);
        // Only boolean flag, no coordinate values in context
        assertNull(ctx.get("latitude"));
        assertNull(ctx.get("longitude"));
    }

    // ========== buildTodayPromptPrefix ==========

    @Test @DisplayName("有行程时 prompt 包含行程标题")
    void promptContainsTripTitle() {
        Map<String, Object> tripCtx = Map.of("available", true, "tripTitle", "贵州三日轻松游",
                "status", "ongoing", "currentDayNumber", 1, "totalDays", 3,
                "todayPlan", Map.of("title", "第1天", "description", "贵阳集合"));
        Map<String, Object> locCtx = Map.of("hasCoordinates", false);
        String prompt = service.buildTodayPromptPrefix(tripCtx, locCtx);
        assertTrue(prompt.contains("贵州三日轻松游"));
    }

    @Test @DisplayName("无行程时 prompt 说明无有效行程")
    void promptNoTrip() {
        Map<String, Object> tripCtx = Map.of("available", false);
        Map<String, Object> locCtx = Map.of("hasCoordinates", false);
        String prompt = service.buildTodayPromptPrefix(tripCtx, locCtx);
        assertTrue(prompt.contains("暂无有效行程"));
    }

    @Test @DisplayName("有坐标时 prompt 包含脱敏说明")
    void promptWithCoords() {
        Map<String, Object> tripCtx = Map.of("available", false);
        Map<String, Object> locCtx = Map.of("hasCoordinates", true);
        String prompt = service.buildTodayPromptPrefix(tripCtx, locCtx);
        assertTrue(prompt.contains("坐标已脱敏"));
    }

    // ========== buildFallbackAnswer ==========

    @Test @DisplayName("有行程时 fallback 包含行程信息")
    void fallbackWithTrip() {
        Map<String, Object> tripCtx = new LinkedHashMap<>();
        tripCtx.put("available", true);
        tripCtx.put("tripTitle", "测试行程");
        tripCtx.put("currentDayNumber", 2);
        tripCtx.put("todayPlan", Map.of("title", "第2天", "description", "测试"));
        String answer = service.buildFallbackAnswer(tripCtx);
        assertTrue(answer.contains("测试行程"));
    }

    @Test @DisplayName("无行程时 fallback 给出通用建议")
    void fallbackNoTrip() {
        Map<String, Object> tripCtx = Map.of("available", false);
        String answer = service.buildFallbackAnswer(tripCtx);
        assertTrue(answer.contains("暂无有效行程"));
    }

    // ========== computeCurrentDayNumber ==========

    @Test @DisplayName("startedAt 是今天时 currentDayNumber = 1")
    void startedTodayReturns1() {
        QxUserTrip trip = new QxUserTrip();
        trip.setStartedAt(LocalDateTime.now());
        assertEquals(1, service.computeCurrentDayNumber(trip));
    }

    @Test @DisplayName("startedAt 是昨天时 currentDayNumber = 2")
    void startedYesterdayReturns2() {
        QxUserTrip trip = new QxUserTrip();
        trip.setStartedAt(LocalDateTime.now().minusDays(1));
        assertEquals(2, service.computeCurrentDayNumber(trip));
    }

    @Test @DisplayName("startedAt 是未来日期时 currentDayNumber = 1")
    void futureStartedAtReturns1() {
        QxUserTrip trip = new QxUserTrip();
        trip.setStartedAt(LocalDateTime.now().plusDays(3));
        assertEquals(1, service.computeCurrentDayNumber(trip));
    }

    @Test @DisplayName("无 startedAt 无 travelStartDate 时 currentDayNumber = 1")
    void noDatesReturns1() {
        QxUserTrip trip = new QxUserTrip();
        assertEquals(1, service.computeCurrentDayNumber(trip));
    }
}
