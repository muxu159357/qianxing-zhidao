package com.qianxing.zhidao.knowledge.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.common.dto.PageResult;
import com.qianxing.zhidao.knowledge.entity.QxKnowledgeArticle;
import com.qianxing.zhidao.knowledge.entity.QxKnowledgeRelation;
import com.qianxing.zhidao.knowledge.mapper.QxKnowledgeArticleMapper;
import com.qianxing.zhidao.knowledge.mapper.QxKnowledgeRelationMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KnowledgeService {

    private final QxKnowledgeArticleMapper articleMapper;
    private final QxKnowledgeRelationMapper relationMapper;

    public KnowledgeService(QxKnowledgeArticleMapper articleMapper, QxKnowledgeRelationMapper relationMapper) {
        this.articleMapper = articleMapper;
        this.relationMapper = relationMapper;
    }

    public PageResult<QxKnowledgeArticle> listArticles(String category, String keyword, int page, int size) {
        LambdaQueryWrapper<QxKnowledgeArticle> qw = new LambdaQueryWrapper<>();
        qw.eq(QxKnowledgeArticle::getStatus, 1);
        if (category != null && !category.isBlank()) qw.eq(QxKnowledgeArticle::getCategory, category);
        if (keyword != null && !keyword.isBlank()) {
            qw.and(w -> w.like(QxKnowledgeArticle::getQuestion, keyword)
                    .or().like(QxKnowledgeArticle::getAnswer, keyword));
        }
        qw.orderByAsc(QxKnowledgeArticle::getSortOrder);

        Page<QxKnowledgeArticle> mpPage = new Page<>(page, size);
        Page<QxKnowledgeArticle> result = articleMapper.selectPage(mpPage, qw);
        return PageResult.of(result.getRecords(), result.getTotal(), page, size);
    }

    public QxKnowledgeArticle getArticle(Long id) {
        QxKnowledgeArticle article = articleMapper.selectById(id);
        if (article == null || article.getStatus() != 1) {
            throw new BusinessException(404, "知识文章不存在");
        }
        return article;
    }

    public List<QxKnowledgeArticle> search(String keyword) {
        return articleMapper.selectList(
                new LambdaQueryWrapper<QxKnowledgeArticle>()
                        .eq(QxKnowledgeArticle::getStatus, 1)
                        .and(w -> w.like(QxKnowledgeArticle::getQuestion, keyword)
                                .or().like(QxKnowledgeArticle::getAnswer, keyword))
                        .orderByAsc(QxKnowledgeArticle::getSortOrder)
                        .last("LIMIT 20"));
    }

    public List<QxKnowledgeRelation> listRelations(Long articleId, String relType, Long relId) {
        LambdaQueryWrapper<QxKnowledgeRelation> qw = new LambdaQueryWrapper<>();
        if (articleId != null) qw.eq(QxKnowledgeRelation::getArticleId, articleId);
        if (relType != null && !relType.isBlank()) qw.eq(QxKnowledgeRelation::getRelType, relType);
        if (relId != null) qw.eq(QxKnowledgeRelation::getRelId, relId);
        return relationMapper.selectList(qw);
    }
}
