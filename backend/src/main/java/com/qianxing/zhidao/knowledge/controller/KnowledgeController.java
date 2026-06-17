package com.qianxing.zhidao.knowledge.controller;

import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.common.dto.PageResult;
import com.qianxing.zhidao.knowledge.entity.QxKnowledgeArticle;
import com.qianxing.zhidao.knowledge.entity.QxKnowledgeRelation;
import com.qianxing.zhidao.knowledge.service.KnowledgeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "knowledge", description = "知识库接口")
@RestController
@RequestMapping("/api/app/knowledge")
public class KnowledgeController {

    private final KnowledgeService knowledgeService;

    public KnowledgeController(KnowledgeService knowledgeService) {
        this.knowledgeService = knowledgeService;
    }

    @Operation(summary = "知识文章列表")
    @GetMapping("/articles")
    public ApiResponse<PageResult<QxKnowledgeArticle>> listArticles(
            @Parameter(description = "分类") @RequestParam(required = false) String category,
            @Parameter(description = "关键词") @RequestParam(required = false) String keyword,
            @Parameter(description = "页码") @RequestParam(defaultValue = "1") int page,
            @Parameter(description = "每页条数") @RequestParam(defaultValue = "10") int size) {
        return ApiResponse.ok(knowledgeService.listArticles(category, keyword, page, size));
    }

    @Operation(summary = "知识文章详情")
    @GetMapping("/articles/{id}")
    public ApiResponse<QxKnowledgeArticle> getArticle(@PathVariable Long id) {
        return ApiResponse.ok(knowledgeService.getArticle(id));
    }

    @Operation(summary = "知识库搜索")
    @GetMapping("/search")
    public ApiResponse<List<QxKnowledgeArticle>> search(
            @Parameter(description = "搜索词") @RequestParam String keyword) {
        return ApiResponse.ok(knowledgeService.search(keyword));
    }

    @Operation(summary = "知识关联查询")
    @GetMapping("/relations")
    public ApiResponse<List<QxKnowledgeRelation>> listRelations(
            @Parameter(description = "文章ID") @RequestParam(required = false) Long articleId,
            @Parameter(description = "关联类型") @RequestParam(required = false) String relType,
            @Parameter(description = "关联ID") @RequestParam(required = false) Long relId) {
        return ApiResponse.ok(knowledgeService.listRelations(articleId, relType, relId));
    }
}
