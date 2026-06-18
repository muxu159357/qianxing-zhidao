package com.qianxing.zhidao.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.qianxing.zhidao.ai.draft.AiPlanDraftCache;
import org.junit.jupiter.api.Test;
import java.util.Map;
import static org.junit.jupiter.api.Assertions.*;

class AiPlanDraftCacheTest {
    ObjectMapper om = new ObjectMapper();
    @Test void putAndGet() { var c = new AiPlanDraftCache(om); c.put("u1", "d1", Map.of("title", "测试")); assertNotNull(c.get("u1", "d1")); }
    @Test void removeThenNull() { var c = new AiPlanDraftCache(om); c.put("u1", "d2", Map.of("t","x")); c.remove("u1","d2"); assertNull(c.get("u1","d2")); }
    @Test void userIsolation() { var c = new AiPlanDraftCache(om); c.put("u1","d3",Map.of()); assertNull(c.get("u2","d3")); }
    @Test void nonExistentNull() { assertNull(new AiPlanDraftCache(om).get("x","y")); }
}
