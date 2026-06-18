package com.qianxing.zhidao.ai.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.ai.client.LlmClient;
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
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AiService {
    private static final Logger log = LoggerFactory.getLogger(AiService.class);

    private static final String SYSTEM_PROMPT = """
            你是"黔行智导"的贵州山地旅游AI助手。
            你只能回答贵州旅游、山地旅行、景区路线、行程攻略、出行建议、文化体验相关问题。
            不要回答与旅游无关的问题。
            不要编造实时天气、实时路况、实时开放状态、实时票价，涉及实时信息时提示以官方平台为准。
            不要提供危险户外行为建议，不要建议进入未开放区域。
            不要提供医疗、法律、金融等非旅游专业建议。
            已知贵州景点：黄果树瀑布(安顺)、荔波小七孔(黔南)、西江千户苗寨(黔东南)、梵净山(铜仁)、青岩古镇(贵阳)、镇远古镇(黔东南)、肇兴侗寨(黔东南)、万峰林(黔西南)、织金洞(毕节)、赤水丹霞(遵义)。
            请基于真实景点推荐，不要编造不存在的景区。
            """;

    private final QxAiPlanRequestMapper planRequestMapper;
    private final QxAiPlanResultMapper planResultMapper;
    private final QxKnowledgeArticleMapper articleMapper;
    private final QxRouteMapper routeMapper;
    private final QxScenicSpotMapper scenicSpotMapper;
    private final ObjectMapper objectMapper;
    private final LlmClient llmClient;

    public AiService(QxAiPlanRequestMapper planRequestMapper, QxAiPlanResultMapper planResultMapper,
                     QxKnowledgeArticleMapper articleMapper, QxRouteMapper routeMapper,
                     QxScenicSpotMapper scenicSpotMapper, ObjectMapper objectMapper,
                     LlmClient llmClient) {
        this.planRequestMapper = planRequestMapper;
        this.planResultMapper = planResultMapper;
        this.articleMapper = articleMapper;
        this.routeMapper = routeMapper;
        this.scenicSpotMapper = scenicSpotMapper;
        this.objectMapper = objectMapper;
        this.llmClient = llmClient;
    }

    public QxAiPlanRequest createPlan(Long userId, QxAiPlanRequest request) {
        request.setUserId(userId);
        request.setStatus("processing");
        planRequestMapper.insert(request);

        try {
            if (llmClient.isConfigured()) {
                String dbContext = buildDatabaseContext();
                String userInput = buildPlanUserInput(request);
                String llmResponse = llmClient.chat(SYSTEM_PROMPT, dbContext + "\n\n用户需求：" + userInput);

                QxAiPlanResult result = new QxAiPlanResult();
                result.setRequestId(request.getId());
                result.setRouteName("大模型智能规划");
                result.setRawResultJson(llmResponse);
                result.setNormalizedResultJson(llmResponse);
                result.setIsAdopted(0);
                result.setModelName(llmClient.getModelName());
                planResultMapper.insert(result);
                request.setStatus("completed");
            } else {
                fallbackRulePlan(request);
            }
        } catch (Exception e) {
            log.error("AI plan failed", e);
            request.setStatus("failed");
            request.setErrorMessage(e.getMessage());
            try {
                QxAiPlanResult errResult = new QxAiPlanResult();
                errResult.setRequestId(request.getId());
                errResult.setErrorJson("{\"error\":\"" + e.getMessage() + "\"}");
                planResultMapper.insert(errResult);
            } catch (Exception ignored) {}
        }
        planRequestMapper.updateById(request);
        return request;
    }

    public QxAiPlanRequest getPlan(Long requestId, Long userId) {
        QxAiPlanRequest req = planRequestMapper.selectById(requestId);
        if (req == null || !req.getUserId().equals(userId))
            throw new BusinessException(404, "规划请求不存在");
        return req;
    }

    public Map<String, Object> chat(Long userId, String question) {
        if (!llmClient.isConfigured()) return ruleBasedAnswer(question);

        if (!isGuizhouTravelRelated(question)) {
            return Map.of(
                    "answer", "这个问题超出了贵州旅游助手的服务范围。我可以继续帮你规划贵州路线、景点游玩建议或行程攻略。",
                    "outOfScope", true, "relatedScenicIds", List.of(), "relatedRouteIds", List.of(),
                    "knowledgeRefs", List.of(), "suggestedActions", List.of("规划贵州行程", "查看推荐路线"), "confidence", 0.1);
        }

        try {
            String llmAnswer = llmClient.chat(SYSTEM_PROMPT, question);
            Map<String, Object> result = new LinkedHashMap<>();
            result.put("answer", llmAnswer);
            result.put("relatedScenicIds", findRelatedScenicNames(question));
            result.put("relatedRouteIds", List.of());
            result.put("knowledgeRefs", findRelatedKnowledge(question));
            result.put("suggestedActions", List.of("查看景点详情", "规划我的行程"));
            result.put("confidence", 0.9);
            result.put("outOfScope", false);
            return result;
        } catch (Exception e) {
            log.error("LLM chat failed: {}", e.getMessage());
            return ruleBasedAnswer(question);
        }
    }

    private String buildDatabaseContext() {
        StringBuilder sb = new StringBuilder();
        List<QxScenicSpot> spots = scenicSpotMapper.selectList(
                new LambdaQueryWrapper<QxScenicSpot>().eq(QxScenicSpot::getStatus, 1));
        sb.append("已知景点：\n");
        for (QxScenicSpot s : spots)
            sb.append("- ").append(s.getName()).append("（").append(s.getCity()).append("，").append(s.getCategory()).append("，评分").append(s.getRating()).append("）\n");

        List<QxRoute> routes = routeMapper.selectList(
                new LambdaQueryWrapper<QxRoute>().eq(QxRoute::getStatus, 1));
        sb.append("\n已知路线：\n");
        for (QxRoute r : routes)
            sb.append("- ").append(r.getName()).append("（").append(r.getDayCount()).append("天，").append(r.getEnergyLevel()).append("）\n");
        return sb.toString();
    }

    private String buildPlanUserInput(QxAiPlanRequest req) {
        return "请帮我规划一条贵州旅游路线：" +
                "天数=" + (req.getInputDays() != null ? req.getInputDays() : "3") + "天，" +
                "兴趣=" + (req.getInputTags() != null ? req.getInputTags() : "自然风光") + "，" +
                "预算=" + (req.getInputBudget() != null ? req.getInputBudget() : "中等") + "，" +
                "人群=" + (req.getInputCrowd() != null ? req.getInputCrowd() : "情侣/朋友") + "，" +
                "体力=" + (req.getInputEnergy() != null ? req.getInputEnergy() : "适中") + "，" +
                "节奏=" + (req.getInputPace() != null ? req.getInputPace() : "均衡") +
                "。请给出每日详细安排、推荐景点和注意事项。";
    }

    private void fallbackRulePlan(QxAiPlanRequest request) throws JsonProcessingException {
        List<QxRoute> routes = routeMapper.selectList(
                new LambdaQueryWrapper<QxRoute>().eq(QxRoute::getStatus, 1).last("LIMIT 5"));
        String routeJson = objectMapper.writeValueAsString(routes);
        QxAiPlanResult result = new QxAiPlanResult();
        result.setRequestId(request.getId());
        result.setRouteName("智能推荐路线");
        result.setRouteJson(routeJson);
        result.setRawResultJson("{\"source\":\"rule-based\"}");
        result.setNormalizedResultJson(routeJson);
        result.setIsAdopted(0);
        planResultMapper.insert(result);
        request.setStatus("completed");
    }

    private List<String> findRelatedScenicNames(String question) {
        return scenicSpotMapper.selectList(
                        new LambdaQueryWrapper<QxScenicSpot>().eq(QxScenicSpot::getStatus, 1))
                .stream().filter(s -> question.contains(s.getName())).map(QxScenicSpot::getName)
                .collect(Collectors.toList());
    }

    private List<Map<String, Object>> findRelatedKnowledge(String question) {
        return articleMapper.selectList(
                        new LambdaQueryWrapper<QxKnowledgeArticle>().eq(QxKnowledgeArticle::getStatus, 1)
                                .and(w -> w.like(QxKnowledgeArticle::getQuestion, question)
                                        .or().like(QxKnowledgeArticle::getAnswer, question)).last("LIMIT 3"))
                .stream().map(a -> Map.<String, Object>of("id", a.getId(), "question", a.getQuestion()))
                .collect(Collectors.toList());
    }

    private Map<String, Object> ruleBasedAnswer(String question) {
        Map<String, Object> result = new LinkedHashMap<>();
        List<QxKnowledgeArticle> articles = articleMapper.selectList(
                new LambdaQueryWrapper<QxKnowledgeArticle>().eq(QxKnowledgeArticle::getStatus, 1)
                        .and(w -> w.like(QxKnowledgeArticle::getQuestion, question)
                                .or().like(QxKnowledgeArticle::getAnswer, question)).last("LIMIT 3"));

        if (!articles.isEmpty()) {
            result.put("answer", articles.get(0).getAnswer());
            result.put("knowledgeRefs", articles.stream().map(a ->
                    Map.<String, Object>of("id", a.getId(), "question", a.getQuestion())).collect(Collectors.toList()));
            result.put("confidence", 0.85);
            result.put("outOfScope", false);
        } else {
            boolean oos = !isGuizhouTravelRelated(question);
            result.put("answer", oos ? "抱歉，我是贵州山地旅游专属AI助手，暂时只能回答贵州旅游相关问题。"
                    : "正在为你整理相关信息，你可以先查看景点知识库或联系AI伴游获取更多帮助。");
            result.put("confidence", oos ? 0.1 : 0.5);
            result.put("outOfScope", oos);
            result.put("knowledgeRefs", List.of());
        }
        result.put("relatedScenicIds", List.of());
        result.put("relatedRouteIds", List.of());
        result.put("suggestedActions", List.of("查看景点知识库", "规划我的行程"));
        result.put("riskTips", List.of());
        return result;
    }

    private boolean isGuizhouTravelRelated(String question) {
        if (question == null) return false;
        String[] keywords = {"贵州", "贵阳", "黔", "黄果树", "小七孔", "苗寨", "侗寨", "梵净山",
                "万峰林", "织金洞", "赤水", "镇远", "青岩", "旅游", "景点", "路线",
                "美食", "酸汤", "米粉", "攻略", "行程", "交通", "住宿", "门票", "民族",
                "苗族", "布依族", "侗族", "瀑布", "溶洞", "梯田", "古镇", "漂流", "黔行"};
        for (String kw : keywords) if (question.contains(kw)) return true;
        return false;
    }
}
