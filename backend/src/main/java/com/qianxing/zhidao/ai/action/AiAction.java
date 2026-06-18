package com.qianxing.zhidao.ai.action;

import java.util.Map;

/**
 * AI 返回的结构化动作按钮。
 * navigate: 必须 page + params；create_ai_plan: payload 含规划参数。
 * 所有 action 由后端代码根据 DB 数据构造，大模型不直接生成。
 */
public record AiAction(
    String type,
    String label,
    String description,
    String page,
    Map<String, Object> params
) {
    public static AiAction navigate(String label, String desc, String page, Map<String, Object> params) {
        return new AiAction("navigate", label, desc, page, params);
    }

    public static AiAction createPlan(String label, String desc, Map<String, Object> payload) {
        return new AiAction("create_ai_plan", label, desc, null, payload);
    }
}
