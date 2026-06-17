package com.qianxing.zhidao.knowledge.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_knowledge_relation")
public class QxKnowledgeRelation {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long articleId;
    private String relType;
    private Long relId;
    private LocalDateTime createdAt;
}
