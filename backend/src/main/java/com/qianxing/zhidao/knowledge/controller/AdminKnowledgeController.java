package com.qianxing.zhidao.knowledge.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.common.dto.PageResult;
import com.qianxing.zhidao.knowledge.entity.QxKnowledgeArticle;
import com.qianxing.zhidao.knowledge.mapper.QxKnowledgeArticleMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "admin-knowledge", description = "后台知识库管理")
@RestController
@RequestMapping("/api/admin/knowledge")
public class AdminKnowledgeController {
    private final QxKnowledgeArticleMapper articleMapper;
    public AdminKnowledgeController(QxKnowledgeArticleMapper m) { this.articleMapper = m; }

    @GetMapping("/articles")
    public ApiResponse<PageResult<QxKnowledgeArticle>> list(@RequestParam(required = false) String keyword, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "20") int size) {
        var qw = new LambdaQueryWrapper<QxKnowledgeArticle>();
        if (keyword != null && !keyword.isBlank()) qw.like(QxKnowledgeArticle::getQuestion, keyword);
        qw.orderByAsc(QxKnowledgeArticle::getSortOrder);
        var mp = new Page<QxKnowledgeArticle>(page, size);
        var r = articleMapper.selectPage(mp, qw);
        return ApiResponse.ok(PageResult.of(r.getRecords(), r.getTotal(), page, size));
    }
    @PostMapping("/articles") public ApiResponse<QxKnowledgeArticle> create(@RequestBody QxKnowledgeArticle a) { articleMapper.insert(a); return ApiResponse.ok(a); }
    @PutMapping("/articles/{id}") public ApiResponse<QxKnowledgeArticle> update(@PathVariable Long id, @RequestBody QxKnowledgeArticle p) {
        var a = articleMapper.selectById(id);
        if (a == null) throw new BusinessException(404, "文章不存在");
        if (p.getQuestion() != null) a.setQuestion(p.getQuestion());
        if (p.getAnswer() != null) a.setAnswer(p.getAnswer());
        if (p.getCategory() != null) a.setCategory(p.getCategory());
        if (p.getStatus() != null) a.setStatus(p.getStatus());
        articleMapper.updateById(a);
        return ApiResponse.ok(a);
    }
    @DeleteMapping("/articles/{id}") public ApiResponse<Void> delete(@PathVariable Long id) { articleMapper.deleteById(id); return ApiResponse.ok(); }
    @PutMapping("/articles/{id}/status") public ApiResponse<QxKnowledgeArticle> toggleStatus(@PathVariable Long id, @RequestParam int status) { var a = articleMapper.selectById(id); if (a==null) throw new BusinessException(404,"文章不存在"); a.setStatus(status); articleMapper.updateById(a); return ApiResponse.ok(a); }
}
