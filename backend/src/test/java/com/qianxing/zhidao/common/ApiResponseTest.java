package com.qianxing.zhidao.common;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ApiResponseTest {
    @Test void okWithData() { var r = ApiResponse.ok("test"); assertEquals(0, r.getCode()); assertEquals("test", r.getData()); }
    @Test void okNoData() { var r = ApiResponse.ok(); assertNull(r.getData()); }
    @Test void fail() { var r = ApiResponse.fail(404, "not found"); assertEquals(404, r.getCode()); }
}
