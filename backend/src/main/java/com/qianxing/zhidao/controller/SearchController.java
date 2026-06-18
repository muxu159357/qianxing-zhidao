package com.qianxing.zhidao.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.knowledge.entity.QxKnowledgeArticle;
import com.qianxing.zhidao.knowledge.mapper.QxKnowledgeArticleMapper;
import com.qianxing.zhidao.route.entity.QxRoute;
import com.qianxing.zhidao.route.mapper.QxRouteMapper;
import com.qianxing.zhidao.scenic.entity.QxScenicSpot;
import com.qianxing.zhidao.scenic.mapper.QxScenicSpotMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@Tag(name = "search", description = "统一搜索")
@RestController
@RequestMapping("/api/app/search")
public class SearchController {
    private final QxScenicSpotMapper sm; private final QxRouteMapper rm; private final QxKnowledgeArticleMapper km;
    public SearchController(QxScenicSpotMapper s, QxRouteMapper r, QxKnowledgeArticleMapper k) { sm=s; rm=r; km=k; }

    @GetMapping public ApiResponse<Map<String, Object>> search(@RequestParam String q, @RequestParam(defaultValue = "5") int limit) {
        String kw = q != null ? q.trim() : "";
        Map<String, Object> r = new LinkedHashMap<>();
        if (kw.isEmpty()) { r.put("scenic",List.of()); r.put("routes",List.of()); r.put("knowledge",List.of()); return ApiResponse.ok(r); }
        r.put("scenic", sm.selectList(new LambdaQueryWrapper<QxScenicSpot>().eq(QxScenicSpot::getStatus,1).like(QxScenicSpot::getName,kw).last("LIMIT "+limit)));
        r.put("routes", rm.selectList(new LambdaQueryWrapper<QxRoute>().eq(QxRoute::getStatus,1).like(QxRoute::getName,kw).last("LIMIT "+limit)));
        r.put("knowledge", km.selectList(new LambdaQueryWrapper<QxKnowledgeArticle>().eq(QxKnowledgeArticle::getStatus,1).and(w->w.like(QxKnowledgeArticle::getQuestion,kw).or().like(QxKnowledgeArticle::getAnswer,kw)).last("LIMIT "+limit)));
        return ApiResponse.ok(r);
    }
}
