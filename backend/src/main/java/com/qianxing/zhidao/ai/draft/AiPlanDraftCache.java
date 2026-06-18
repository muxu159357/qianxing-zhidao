package com.qianxing.zhidao.ai.draft;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import java.util.Map;
import java.util.concurrent.*;

@Component
public class AiPlanDraftCache {
    private static final Logger log = LoggerFactory.getLogger(AiPlanDraftCache.class);
    private final Map<String, Entry> cache = new ConcurrentHashMap<>();
    private final ObjectMapper om;
    private final long ttl = 3600;

    public AiPlanDraftCache(ObjectMapper om) {
        this.om = om;
        Executors.newSingleThreadScheduledExecutor(r -> { var t = new Thread(r, "draft-cleaner"); t.setDaemon(true); return t; })
                .scheduleAtFixedRate(this::clean, 300, 300, TimeUnit.SECONDS);
    }

    public void put(String userId, String draftId, Object draft) {
        try { cache.put(k(userId, draftId), new Entry(om.writeValueAsString(draft), now() + ttl * 1000)); }
        catch (Exception e) { log.error("Draft serialize failed", e); }
    }

    public String get(String userId, String draftId) {
        var e = cache.get(k(userId, draftId));
        if (e == null || e.exp < now()) { if (e != null) cache.remove(k(userId, draftId)); return null; }
        return e.json;
    }

    public void remove(String userId, String draftId) { cache.remove(k(userId, draftId)); }
    private String k(String uid, String did) { return uid + ":" + did; }
    private long now() { return System.currentTimeMillis(); }
    private void clean() { long n = now(); cache.entrySet().removeIf(e -> e.getValue().exp < n); }
    private record Entry(String json, long exp) {}
}
