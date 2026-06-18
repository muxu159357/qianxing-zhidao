package com.qianxing.zhidao.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.knowledge.mapper.QxKnowledgeArticleMapper;
import com.qianxing.zhidao.route.mapper.QxRouteMapper;
import com.qianxing.zhidao.scenic.mapper.QxScenicSpotMapper;
import com.qianxing.zhidao.trip.entity.QxUserTrip;
import com.qianxing.zhidao.trip.mapper.QxUserTripMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.*;

@Tag(name = "admin-dashboard", description = "后台数据看板")
@RestController
@RequestMapping("/api/admin")
public class AdminDashboardController {
    private final QxScenicSpotMapper scenicMapper;
    private final QxRouteMapper routeMapper;
    private final QxKnowledgeArticleMapper knowledgeMapper;
    private final QxUserTripMapper tripMapper;
    public AdminDashboardController(QxScenicSpotMapper s, QxRouteMapper r, QxKnowledgeArticleMapper k, QxUserTripMapper t) {
        this.scenicMapper = s; this.routeMapper = r; this.knowledgeMapper = k; this.tripMapper = t;
    }
    @GetMapping("/dashboard/stats")
    public ApiResponse<Map<String, Object>> stats() {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("scenicCount", scenicMapper.selectCount(new LambdaQueryWrapper<>()));
        m.put("routeCount", routeMapper.selectCount(new LambdaQueryWrapper<>()));
        m.put("knowledgeCount", knowledgeMapper.selectCount(new LambdaQueryWrapper<>()));
        m.put("tripCount", tripMapper.selectCount(new LambdaQueryWrapper<>()));
        m.put("activeTripCount", tripMapper.selectCount(new LambdaQueryWrapper<QxUserTrip>().eq(QxUserTrip::getStatus, "active")));
        return ApiResponse.ok(m);
    }
}
