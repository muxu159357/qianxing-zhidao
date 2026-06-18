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
import com.qianxing.zhidao.ai.action.AiAction;
import com.qianxing.zhidao.trip.entity.QxUserTrip;
import com.qianxing.zhidao.trip.mapper.QxUserTripMapper;
import com.qianxing.zhidao.weather.entity.QxScenicWeather;
import com.qianxing.zhidao.weather.mapper.QxScenicWeatherMapper;
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
            你是"黔行智导"的贵州山地旅游AI助手，面向手机小程序用户。
            你的任务：推荐贵州景点、规划路线、安排每日行程、介绍民族文化美食、提供交通住宿建议。

            回答要求：
            1. 使用自然中文，像朋友聊天一样温和具体；
            2. 面向手机小程序，每段1-3句；
            3. 不使用Markdown符号（禁止 **粗体**、### 标题、``` 代码块、表格管道符 |）；
            4. 列点用中文短句换行，不出现 -、* 等符号；
            5. 普通回答120-300字，行程攻略可稍长但分段清晰；
            6. 不要出现"AI生成""测试""Mock""假数据""Demo""临时""TODO""AI导游""AI向导"等禁用文案；
            7. 可正常使用"AI助手""AI伴游""智能规划""行程攻略""路线建议"。

            已知贵州景点：黄果树瀑布(安顺)、荔波小七孔(黔南)、西江千户苗寨(黔东南)、梵净山(铜仁)、青岩古镇(贵阳)、镇远古镇(黔东南)、肇兴侗寨(黔东南)、万峰林(黔西南)、织金洞(毕节)、赤水丹霞(遵义)。
            已知路线：黔中精华三日游、黔东秘境二日、黔南风情三日、黔西胜境二日、黔中人文二日。
            请基于真实景点推荐，不要编造。不要编造实时天气、票价、开放状态，涉及这些提示以官方平台为准。不要提供危险户外建议。
            """;

    private static final Map<String, String> RULE_ANSWERS = new LinkedHashMap<>();
    static {
        RULE_ANSWERS.put("必去景点", "第一次来贵州推荐这几个地方：黄果树瀑布（亚洲第一大瀑布）、荔波小七孔（碧水青山）、梵净山（世界自然遗产）、西江千户苗寨（苗族文化）、青岩古镇（明清建筑与美食）。\n\n喜欢自然风光可以重点看黄果树、小七孔和梵净山；喜欢民族文化就安排西江苗寨；时间不多的话，贵阳周边的青岩古镇也很方便。");
        RULE_ANSWERS.put("美食", "贵州美食以酸辣为主，很开胃。推荐试试：酸汤鱼（苗家经典）、丝娃娃（清爽小吃）、肠旺面（贵阳早餐标配）、豆腐圆子、花溪牛肉粉、青岩卤猪脚。\n\n各地还有特色：黔东南的苗家酸汤鱼、黔西南的布依族五色饭。到了当地可以多问问当地人推荐的小店，往往比大饭店更好吃。");
        RULE_ANSWERS.put("什么时候去", "贵州比较适合春季（4-6月）和秋季（9-10月）出行。\n\n春天适合看花、感受民族节庆，气温舒服。秋天雨水相对少，天气清爽，特别适合黄果树、荔波小七孔、梵净山这类自然风光路线。\n\n夏天虽然雨水多，但也是避暑的好时候，而且瀑布水量充沛更壮观。冬天人少安静，适合古镇慢游。");
        RULE_ANSWERS.put("交通", "贵州交通以贵阳为中心很方便。贵阳龙洞堡机场连通全国主要城市，高铁可以到安顺（黄果树）、凯里（西江苗寨）、铜仁（梵净山）等。\n\n山地景区之间的路程比较长，建议每天安排1-2个主景点，预留充足的交通和休息时间。如果是第一次来，可以从贵阳出发，先玩周边再往远走。");
        RULE_ANSWERS.put("三天", "三天时间可以玩贵阳加安顺这条线。第一天到贵阳，逛逛青岩古镇适应节奏；第二天去黄果树瀑布，感受大瀑布的震撼；第三天可以安排荔波小七孔或者西江苗寨。\n\n如果喜欢轻松一点，建议贵阳-黄果树-青岩两天就够了，留一天自由探索。具体路线可以根据你的偏好调整。");
        RULE_ANSWERS.put("轻松", "如果喜欢轻松节奏的旅行，建议选择贵阳和安顺这条线。青岩古镇适合悠闲漫步，黄果树瀑布虽然壮观但游览路线不长。\n\n每天最多安排1-2个景点，住宿固定少换酒店。不建议安排梵净山这样的高强度登山路线。贵州的喀斯特风光在路上也能欣赏，不用赶路也是一种享受。");
        RULE_ANSWERS.put("民族文化", "贵州的民族文化非常有特色。西江千户苗寨是体验苗族文化最好的地方，有吊脚楼、长桌宴和苗族歌舞。肇兴侗寨可以听侗族大歌（世界非遗），镇远古镇有千年历史和青龙洞古建筑。\n\n如果时间有限，西江苗寨是最推荐的民族文化体验地点，从贵阳出发高铁到凯里再转车即可。");
    }

    private final QxAiPlanRequestMapper planRequestMapper;
    private final QxAiPlanResultMapper planResultMapper;
    private final QxKnowledgeArticleMapper articleMapper;
    private final QxRouteMapper routeMapper;
    private final QxScenicSpotMapper scenicSpotMapper;
    private final QxScenicWeatherMapper weatherMapper;
    private final QxUserTripMapper tripMapper;
    private final ObjectMapper objectMapper;
    private final LlmClient llmClient;

    public AiService(QxAiPlanRequestMapper planRequestMapper, QxAiPlanResultMapper planResultMapper,
                     QxKnowledgeArticleMapper articleMapper, QxRouteMapper routeMapper,
                     QxScenicSpotMapper scenicSpotMapper, QxScenicWeatherMapper weatherMapper,
                     QxUserTripMapper tripMapper, ObjectMapper objectMapper, LlmClient llmClient) {
        this.planRequestMapper = planRequestMapper;
        this.planResultMapper = planResultMapper;
        this.articleMapper = articleMapper;
        this.routeMapper = routeMapper;
        this.scenicSpotMapper = scenicSpotMapper;
        this.weatherMapper = weatherMapper;
        this.tripMapper = tripMapper;
        this.objectMapper = objectMapper;
        this.llmClient = llmClient;
    }

    public QxAiPlanRequest createPlan(Long userId, QxAiPlanRequest request) {
        request.setUserId(userId);
        request.setStatus("processing");
        planRequestMapper.insert(request);
        try {
            if (llmClient.isConfigured()) {
                String llmResponse = llmClient.chat(SYSTEM_PROMPT, buildDatabaseContext() + "\n\n用户需求：" + buildPlanUserInput(request));
                QxAiPlanResult result = new QxAiPlanResult();
                result.setRequestId(request.getId());
                result.setRouteName("智能规划");
                result.setRawResultJson(llmResponse);
                result.setNormalizedResultJson(llmResponse);
                result.setIsAdopted(0);
                result.setModelName(llmClient.getModelName());
                planResultMapper.insert(result);
                request.setStatus("completed");
            } else { fallbackRulePlan(request); }
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
        if (req == null || !req.getUserId().equals(userId)) throw new BusinessException(404, "规划请求不存在");
        return req;
    }

    public Map<String, Object> chat(Long userId, String question) {
        String q = question != null ? question.trim() : "";
        if (q.isEmpty()) return simpleAnswer("请告诉我你想了解贵州旅游的哪个方面？", false);

        int tier = classifyQuestion(q);

        // Tier 1: travel — call LLM
        if (tier == 1 && llmClient.isConfigured()) {
            try {
                String prompt = SYSTEM_PROMPT + buildTripContext(userId, q) + buildWeatherContext(q) + buildDatabaseContext();
                String rawAnswer = llmClient.chat(prompt, q);
                return buildChatResult(sanitizeAnswer(rawAnswer), false, 0.9, q);
            } catch (Exception e) {
                log.error("LLM failed, fallback to rule: {}", e.getMessage());
                return ruleBasedAnswer(q);
            }
        }
        // Tier 1 without LLM or Tier 2: rule-based
        if (tier <= 2) return ruleBasedAnswer(q);

        // Tier 3: gently redirect
        return buildChatResult(
                "这个问题不属于贵州旅游助手的服务范围，我不能提供这方面的建议。\n\n如果你正在准备出行，我可以继续帮你规划贵州路线、推荐适合的景点，或者整理一份轻松的行程攻略。",
                true, 0.1, null);
    }

    private int classifyQuestion(String q) {
        // Tier 3 keywords: clearly off-topic
        String[] offTopic = {"股票", "投资", "医学", "诊断", "法律", "诉讼", "写代码", "编程", "作弊", "违法", "犯罪", "自杀", "暴力"};
        for (String kw : offTopic) if (q.contains(kw)) return 3;

        // Tier 2: identity, help, chat
        String[] chatWords = {"你是谁", "你能做什么", "怎么用", "你好", "谢谢", "你会什么", "帮助", "功能", "介绍一下自己", "你好吗", "在吗"};
        for (String kw : chatWords) if (q.contains(kw)) return 2;

        // Tier 1: Guizhou travel related
        if (isGuizhouTravelRelated(q)) return 1;

        // Default: tier 3
        return 3;
    }

    public static String sanitizeAnswer(String text) {
        if (text == null || text.isBlank()) return null;
        String t = text
                .replace("**", "")
                .replace("### ", "")
                .replace("## ", "")
                .replace("# ", "")
                .replace("```", "")
                .replaceAll("(?m)^[-*]\\s+", "")
                .replaceAll("\\|", " ")
                .replaceAll("\n{3,}", "\n\n")
                .trim();
        if (t.isBlank()) return null;
        return t;
    }

    private Map<String, Object> buildChatResult(String answer, boolean outOfScope, double confidence, String question) {
        Map<String, Object> r = new LinkedHashMap<>();
        r.put("answer", answer);
        r.put("outOfScope", outOfScope);
        r.put("confidence", confidence);

        List<AiAction> actions = new ArrayList<>();
        if (outOfScope) {
            actions.add(AiAction.navigate("规划贵州行程", "告诉我你的喜好，帮你规划路线", "/pages/guide/guide", Map.of()));
            actions.add(AiAction.navigate("查看推荐路线", "浏览已有的贵州旅游路线", "/pages/index/index", Map.of()));
        } else {
            // 根据问题动态匹配景点/路线的导航按钮
            List<QxScenicSpot> relatedSpots = scenicSpotMapper.selectList(
                    new LambdaQueryWrapper<QxScenicSpot>().eq(QxScenicSpot::getStatus, 1));
            for (QxScenicSpot spot : relatedSpots) {
                if (question != null && question.contains(spot.getName())) {
                    actions.add(AiAction.navigate("查看" + spot.getName(), "了解" + spot.getName() + "的亮点与游玩建议",
                            "/pages/scenic-detail/scenic-detail", Map.of("id", spot.getSpotCode())));
                    if (actions.size() >= 2) break;
                }
            }
            // 默认动作
            if (actions.isEmpty()) {
                actions.add(AiAction.navigate("查看必去景点", "浏览贵州精选景点信息", "/pages/knowledge/knowledge", Map.of()));
            }
            actions.add(AiAction.navigate("查看推荐路线", "浏览精品旅游路线", "/pages/index/index", Map.of()));
            actions.add(AiAction.createPlan("生成行程攻略", "根据你的偏好生成路线方案", Map.of("days", 3, "pace", "轻松")));
        }
        r.put("actions", actions);
        r.put("relatedScenicIds", List.of());
        r.put("relatedRouteIds", List.of());
        r.put("knowledgeRefs", List.of());
        r.put("suggestedActions", List.of());
        r.put("riskTips", List.of());
        return r;
    }

    private Map<String, Object> simpleAnswer(String answer, boolean oos) {
        return buildChatResult(answer, oos, 0.5, null);
    }

    private Map<String, Object> ruleBasedAnswer(String q) {
        // Try keyword match first
        for (var entry : RULE_ANSWERS.entrySet()) {
            if (q.contains(entry.getKey())) return buildChatResult(entry.getValue(), false, 0.85, q);
        }

        List<QxKnowledgeArticle> articles = articleMapper.selectList(
                new LambdaQueryWrapper<QxKnowledgeArticle>().eq(QxKnowledgeArticle::getStatus, 1)
                        .and(w -> w.like(QxKnowledgeArticle::getQuestion, q).or().like(QxKnowledgeArticle::getAnswer, q)).last("LIMIT 3"));

        if (!articles.isEmpty()) {
            return buildChatResult(articles.get(0).getAnswer(), false, 0.85, q);
        }

        if (classifyQuestion(q) == 2) {
            return buildChatResult(
                    "我是黔行智导的贵州旅游AI助手，可以帮你规划贵州路线、推荐景点、美食和行程攻略。\n\n你可以直接告诉我出行天数、出发城市、喜欢自然风光还是民族文化，我会帮你整理一份适合的贵州旅行方案。",
                    false, 0.8, q);
        }

        return buildChatResult(
                "你可以问我贵州有哪些必去景点、什么时候去最好、怎么安排三天行程、有什么特色美食等问题。\n\n告诉我你的出行天数、喜好和节奏，我来帮你规划一条合适的贵州旅行路线。",
                classifyQuestion(q) == 3, 0.5, q);
    }

    /** 当用户有 active 行程且问"今天怎么玩"时，附上行程进度 */
    private String buildTripContext(Long userId, String q) {
        if (userId == null || q == null || !(q.contains("今天") || q.contains("现在") || q.contains("当前"))) return "";
        List<QxUserTrip> active = tripMapper.selectList(
                new LambdaQueryWrapper<QxUserTrip>().eq(QxUserTrip::getUserId, userId).eq(QxUserTrip::getStatus, "active"));
        if (active.isEmpty()) return "";
        QxUserTrip t = active.get(0);
        return "\n用户当前有活跃行程：" + t.getRouteName() + "，" + t.getDayCount() + "天行程。" +
                "行程开始于" + (t.getStartedAt() != null ? t.getStartedAt().toString() : "最近") + "。" +
                "请结合当前行程进度给出具体建议。如果无法判断当前是第几天，提示用户确认。\n";
    }

    /** 当问题涉及特定景区时，附上最近的天气数据 */
    private String buildWeatherContext(String q) {
        if (q == null) return "";
        List<QxScenicSpot> spots = scenicSpotMapper.selectList(
                new LambdaQueryWrapper<QxScenicSpot>().eq(QxScenicSpot::getStatus, 1));
        for (QxScenicSpot s : spots) {
            if (q.contains(s.getName())) {
                List<QxScenicWeather> weather = weatherMapper.selectList(
                        new LambdaQueryWrapper<QxScenicWeather>().eq(QxScenicWeather::getScenicSpotId, s.getId())
                                .orderByDesc(QxScenicWeather::getWeatherDate).last("LIMIT 3"));
                if (weather.isEmpty()) return "";
                StringBuilder sb = new StringBuilder();
                sb.append("\n").append(s.getName()).append("最近天气（参考，以官方公告为准）：");
                for (QxScenicWeather w : weather) {
                    sb.append("\n").append(w.getWeatherDate()).append(" ").append(w.getWeatherDesc())
                            .append(" ").append(w.getTemperatureLow()).append("°C~").append(w.getTemperatureHigh()).append("°C");
                }
                sb.append("\n注意：以上不是实时天气，仅供参考。");
                return sb.toString();
            }
        }
        return "";
    }

    private String buildDatabaseContext() {
        StringBuilder sb = new StringBuilder();
        List<QxScenicSpot> spots = scenicSpotMapper.selectList(new LambdaQueryWrapper<QxScenicSpot>().eq(QxScenicSpot::getStatus, 1));
        sb.append("已知景点：\n");
        for (QxScenicSpot s : spots)
            sb.append(s.getName()).append("（").append(s.getCity()).append("，").append(s.getCategory()).append("）\n");
        List<QxRoute> routes = routeMapper.selectList(new LambdaQueryWrapper<QxRoute>().eq(QxRoute::getStatus, 1));
        sb.append("\n已知路线：\n");
        for (QxRoute r : routes)
            sb.append(r.getName()).append("（").append(r.getDayCount()).append("天，").append(r.getEnergyLevel()).append("）\n");
        return sb.toString();
    }

    private String buildPlanUserInput(QxAiPlanRequest req) {
        return "请帮我规划一条贵州旅游路线：天数=" + (req.getInputDays() != null ? req.getInputDays() : "3") + "天，" +
                "兴趣=" + (req.getInputTags() != null ? req.getInputTags() : "自然风光") + "，" +
                "预算=" + (req.getInputBudget() != null ? req.getInputBudget() : "中等") + "，" +
                "人群=" + (req.getInputCrowd() != null ? req.getInputCrowd() : "情侣/朋友") + "，" +
                "体力=" + (req.getInputEnergy() != null ? req.getInputEnergy() : "适中") + "，" +
                "节奏=" + (req.getInputPace() != null ? req.getInputPace() : "均衡") + "。请给出每日详细安排、推荐景点和注意事项。";
    }

    private void fallbackRulePlan(QxAiPlanRequest request) throws JsonProcessingException {
        List<QxRoute> routes = routeMapper.selectList(new LambdaQueryWrapper<QxRoute>().eq(QxRoute::getStatus, 1).last("LIMIT 5"));
        String routeJson = objectMapper.writeValueAsString(routes);
        QxAiPlanResult result = new QxAiPlanResult();
        result.setRequestId(request.getId()); result.setRouteName("智能推荐路线");
        result.setRouteJson(routeJson); result.setRawResultJson("{\"source\":\"rule-based\"}");
        result.setNormalizedResultJson(routeJson); result.setIsAdopted(0);
        planResultMapper.insert(result);
        request.setStatus("completed");
    }

    private List<String> findRelatedScenicNames(String question) {
        return scenicSpotMapper.selectList(new LambdaQueryWrapper<QxScenicSpot>().eq(QxScenicSpot::getStatus, 1))
                .stream().filter(s -> question.contains(s.getName())).map(QxScenicSpot::getName).collect(Collectors.toList());
    }

    private List<Map<String, Object>> findRelatedKnowledge(String question) {
        return articleMapper.selectList(new LambdaQueryWrapper<QxKnowledgeArticle>().eq(QxKnowledgeArticle::getStatus, 1)
                        .and(w -> w.like(QxKnowledgeArticle::getQuestion, question).or().like(QxKnowledgeArticle::getAnswer, question)).last("LIMIT 3"))
                .stream().map(a -> Map.<String, Object>of("id", a.getId(), "question", a.getQuestion())).collect(Collectors.toList());
    }

    private boolean isGuizhouTravelRelated(String question) {
        if (question == null) return false;
        String[] keywords = {"贵州", "贵阳", "黔", "黄果树", "小七孔", "苗寨", "侗寨", "梵净山", "万峰林", "织金洞",
                "赤水", "镇远", "青岩", "旅游", "景点", "路线", "美食", "酸汤", "米粉", "攻略", "行程", "交通",
                "住宿", "门票", "民族", "苗族", "布依族", "侗族", "瀑布", "溶洞", "梯田", "古镇", "漂流", "黔行",
                "几天", "几日游", "拍照", "轻松", "亲子", "避暑", "山地", "徒步", "观景", "出发", "预算", "安排",
                "规划", "推荐", "好吃", "好玩", "季节", "天气", "穿什么", "准备", "注意"};
        for (String kw : keywords) if (question.contains(kw)) return true;
        return false;
    }
}
