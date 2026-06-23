package com.qianxing.zhidao.ai.draft;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.qianxing.zhidao.ai.client.LlmClient;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.trip.entity.QxUserTrip;
import com.qianxing.zhidao.trip.service.TripService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class AiPlanDraftService {
    private static final Logger log = LoggerFactory.getLogger(AiPlanDraftService.class);
    private static final String PROMPT = """
        你是"黔行智导"贵州山地旅游AI助手。根据需求生成结构化路线草稿。
        输出JSON：{"title":"路线名","summary":"摘要","days":[{"dayIndex":1,"theme":"主题","items":[{"timeRange":"上午","title":"活动","description":"说明"}]}]}
        基于真实贵州景点，不要Markdown。""";

    private final LlmClient llm; private final AiPlanDraftCache cache;
    private final ObjectMapper om; private final TripService tripService;

    public AiPlanDraftService(LlmClient llm, AiPlanDraftCache cache, ObjectMapper om, TripService t) {
        this.llm = llm; this.cache = cache; this.om = om; this.tripService = t;
    }

    public Map<String, Object> generate(Long userId, Map<String, Object> params) {
        if (!llm.isConfigured()) throw new BusinessException(501, "智能规划暂未配置");
        String did = UUID.randomUUID().toString().substring(0, 8);
        String input = "天数=" + params.getOrDefault("days",3) + " 兴趣=" + params.getOrDefault("interests","自然风光") + " 节奏=" + params.getOrDefault("pace","轻松");
        try {
            String raw = llm.chat(PROMPT, input);
            Map<String, Object> draft = om.readValue(raw, new TypeReference<>(){});
            draft.put("draftId", did); draft.put("source", "ai_draft"); draft.put("expiresInSeconds", 3600);
            cache.put(String.valueOf(userId), did, draft);
            return draft;
        } catch (Exception e) { log.error("Draft failed: {}", e.getMessage()); throw new BusinessException(500, "路线生成失败"); }
    }

    public Map<String, Object> get(Long userId, String did) {
        String json = cache.get(String.valueOf(userId), did);
        if (json == null) throw new BusinessException(404, "草稿不存在或已过期");
        try { return om.readValue(json, new TypeReference<>(){}); } catch (Exception e) { throw new BusinessException(500, "草稿读取失败"); }
    }

    public Map<String, Object> confirm(Long userId, String did) {
        Map<String, Object> draft = get(userId, did);
        QxUserTrip t = new QxUserTrip(); t.setUserId(userId);
        t.setRouteName((String) draft.getOrDefault("title", "AI规划行程"));
        t.setDayCount(((List<?>) draft.getOrDefault("days", List.of())).size());
        t.setStatus("upcoming");
        try { t.setPlanSnapshotJson(om.writeValueAsString(draft)); } catch (Exception e) { throw new BusinessException(500, "草稿保存失败"); }
        QxUserTrip saved = tripService.createTrip(t);
        cache.remove(String.valueOf(userId), did);
        return Map.of("tripId", saved.getId(), "title", t.getRouteName());
    }
}
