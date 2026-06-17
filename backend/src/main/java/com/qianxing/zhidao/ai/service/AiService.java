package com.qianxing.zhidao.ai.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.ai.entity.QxAiPlanRequest;
import com.qianxing.zhidao.ai.entity.QxAiPlanResult;
import com.qianxing.zhidao.ai.mapper.QxAiPlanRequestMapper;
import com.qianxing.zhidao.ai.mapper.QxAiPlanResultMapper;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.knowledge.entity.QxKnowledgeArticle;
import com.qianxing.zhidao.knowledge.mapper.QxKnowledgeArticleMapper;
import com.qianxing.zhidao.route.entity.QxRoute;
import com.qianxing.zhidao.route.mapper.QxRouteMapper;
import com.qianxing.zhidao.scenic.entity.QxScenicSpot;
import com.qianxing.zhidao.scenic.mapper.QxScenicSpotMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AiService {
    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private final QxAiPlanRequestMapper planRequestMapper;
    private final QxAiPlanResultMapper planResultMapper;
    private final QxKnowledgeArticleMapper articleMapper;
    private final QxRouteMapper routeMapper;
    private final QxScenicSpotMapper scenicSpotMapper;
    private final ObjectMapper objectMapper;
    private final boolean llmConfigured;

    public AiService(QxAiPlanRequestMapper planRequestMapper, QxAiPlanResultMapper planResultMapper,
                     QxKnowledgeArticleMapper articleMapper, QxRouteMapper routeMapper,
                     QxScenicSpotMapper scenicSpotMapper, ObjectMapper objectMapper,
                     @Value("${llm.api-key:}") String llmApiKey) {
        this.planRequestMapper = planRequestMapper;
        this.planResultMapper = planResultMapper;
        this.articleMapper = articleMapper;
        this.routeMapper = routeMapper;
        this.scenicSpotMapper = scenicSpotMapper;
        this.objectMapper = objectMapper;
        this.llmConfigured = llmApiKey != null && !llmApiKey.isBlank();
    }

    // === AI 规划 ===
    public QxAiPlanRequest createPlan(Long userId, QxAiPlanRequest request) {
        request.setUserId(userId);
        request.setStatus("processing");
        planRequestMapper.insert(request);

        // Rule-based planning
        try {
            List<QxRoute> routes = routeMapper.selectList(
                    new LambdaQueryWrapper<QxRoute>().eq(QxRoute::getStatus, 1).last("LIMIT 5"));
            String routeJson = objectMapper.writeValueAsString(routes);

            QxAiPlanResult result = new QxAiPlanResult();
            result.setRequestId(request.getId());
            result.setRouteName("智能推荐路线");
            result.setRouteJson(routeJson);
            result.setRawResultJson("{\"source\": \"rule-based\"}");
            result.setNormalizedResultJson(routeJson);
            result.setIsAdopted(0);
            planResultMapper.insert(result);

            request.setStatus("completed");
        } catch (Exception e) {
            log.error("AI plan failed", e);
            request.setStatus("failed");
            request.setErrorMessage(e.getMessage());
        }
        planRequestMapper.updateById(request);
        return request;
    }

    public QxAiPlanRequest getPlan(Long requestId, Long userId) {
        QxAiPlanRequest req = planRequestMapper.selectById(requestId);
        if (req == null || !req.getUserId().equals(userId)) {
            throw new BusinessException(404, "规划请求不存在");
        }
        return req;
    }

    // === AI 问答 ===
    public Map<String, Object> chat(Long userId, String question) {
        if (!llmConfigured) {
            return ruleBasedAnswer(question);
        }
        // Placeholder for real LLM call
        return ruleBasedAnswer(question);
    }

    private Map<String, Object> ruleBasedAnswer(String question) {
        Map<String, Object> result = new LinkedHashMap<>();
        String q = question.toLowerCase();

        // Knowledge base search
        List<QxKnowledgeArticle> articles = articleMapper.selectList(
                new LambdaQueryWrapper<QxKnowledgeArticle>()
                        .eq(QxKnowledgeArticle::getStatus, 1)
                        .and(w -> w.like(QxKnowledgeArticle::getQuestion, question)
                                .or().like(QxKnowledgeArticle::getAnswer, question))
                        .last("LIMIT 3"));

        if (!articles.isEmpty()) {
            QxKnowledgeArticle best = articles.get(0);
            result.put("answer", best.getAnswer());
            result.put("knowledgeRefs", articles.stream().map(a -> Map.of("id", a.getId(), "question", a.getQuestion())).toList());
            result.put("confidence", 0.85);
            result.put("outOfScope", false);
        } else {
            boolean outOfScope = !isGuizhouTravelRelated(question);
            result.put("answer", outOfScope
                    ? "抱歉，我是贵州山地旅游专属AI助手，暂时只能回答贵州旅游相关问题。你可以问我景点、路线、美食、文化等方面的问题。"
                    : "正在为你整理相关信息，你可以先查看景点知识库或联系AI伴游获取更多帮助。");
            result.put("confidence", outOfScope ? 0.1 : 0.5);
            result.put("outOfScope", outOfScope);
            result.put("knowledgeRefs", List.of());
        }

        result.put("relatedScenicIds", List.of());
        result.put("relatedRouteIds", List.of());
        result.put("suggestedActions", List.of("查看景点知识库", "规划我的行程", "查看推荐路线"));
        result.put("riskTips", List.of());
        return result;
    }

    private boolean isGuizhouTravelRelated(String question) {
        String[] keywords = {"贵州", "贵阳", "黔", "黄果树", "小七孔", "苗寨", "侗寨", "梵净山",
                "万峰林", "织金洞", "赤水", "镇远", "青岩", "黔灵山", "旅游", "景点", "路线",
                "美食", "酸汤", "米粉", "天气", "攻略", "行程", "交通", "住宿", "门票", "民族",
                "苗族", "布依族", "侗族", "瀑布", "溶洞", "梯田", "古镇", "漂流"};
        for (String kw : keywords) {
            if (question.contains(kw)) return true;
        }
        return false;
    }
}
