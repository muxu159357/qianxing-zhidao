package com.qianxing.zhidao.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.route.entity.QxRoute;
import com.qianxing.zhidao.route.mapper.QxRouteMapper;
import com.qianxing.zhidao.scenic.entity.QxScenicSpot;
import com.qianxing.zhidao.scenic.mapper.QxScenicSpotMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@Tag(name = "home", description = "首页数据")
@RestController
@RequestMapping("/api/app/home")
public class HomeController {
    private final QxScenicSpotMapper sm; private final QxRouteMapper rm;
    public HomeController(QxScenicSpotMapper s, QxRouteMapper r) { sm=s; rm=r; }
    @GetMapping("/summary") public ApiResponse<Map<String, Object>> summary() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("scenicCount", sm.selectCount(new LambdaQueryWrapper<QxScenicSpot>().eq(QxScenicSpot::getStatus,1)));
        m.put("routeCount", rm.selectCount(new LambdaQueryWrapper<QxRoute>().eq(QxRoute::getStatus,1)));
        m.put("topRoutes", rm.selectList(new LambdaQueryWrapper<QxRoute>().eq(QxRoute::getStatus,1).orderByAsc(QxRoute::getSortOrder).last("LIMIT 3")));
        return ApiResponse.ok(m);
    }
}
