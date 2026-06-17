package com.qianxing.zhidao.knowledge.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_knowledge_article")
public class QxKnowledgeArticle {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String articleCode;
    private String question;
    private String answer;
    private String category;
    private Integer sortOrder;
    private Integer status;
    @TableLogic
    private Integer deleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
