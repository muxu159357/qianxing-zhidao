package com.qianxing.zhidao.media.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@TableName("qx_media_asset")
public class QxMediaAsset {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String bizType;
    private Long bizId;
    private String assetType;
    private String url;
    private String thumbUrl;
    private String source;
    private String credit;
    private String license;
    private Integer width;
    private Integer height;
    private Integer fileSize;
    private Integer sortOrder;
    private Integer status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
