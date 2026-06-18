package com.qianxing.zhidao.ai;

import com.qianxing.zhidao.ai.service.AiService;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class AiServiceTest {
    @Test void sanitizeRemovesBold() { String r = AiService.sanitizeAnswer("**推荐**黄果树"); assertFalse(r.contains("**")); assertTrue(r.contains("推荐")); }
    @Test void sanitizeRemovesHeading() { String r = AiService.sanitizeAnswer("### 第一天\n游览"); assertFalse(r.contains("###")); assertTrue(r.contains("第一天")); }
    @Test void sanitizeNullReturnsNull() { assertNull(AiService.sanitizeAnswer(null)); assertNull(AiService.sanitizeAnswer("")); }
    @Test void sanitizeCompressesNewlines() { String r = AiService.sanitizeAnswer("a\n\n\n\nb"); assertFalse(r.contains("\n\n\n\n")); }
}
