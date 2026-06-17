package com.qianxing.zhidao.media.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.media.entity.QxMediaAsset;
import com.qianxing.zhidao.media.mapper.QxMediaAssetMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MediaService {

    private final QxMediaAssetMapper mediaAssetMapper;

    public MediaService(QxMediaAssetMapper mediaAssetMapper) {
        this.mediaAssetMapper = mediaAssetMapper;
    }

    public List<QxMediaAsset> listAssets(String bizType, Long bizId, String assetType) {
        LambdaQueryWrapper<QxMediaAsset> qw = new LambdaQueryWrapper<>();
        qw.eq(QxMediaAsset::getStatus, 1);
        if (bizType != null && !bizType.isBlank()) qw.eq(QxMediaAsset::getBizType, bizType);
        if (bizId != null) qw.eq(QxMediaAsset::getBizId, bizId);
        if (assetType != null && !assetType.isBlank()) qw.eq(QxMediaAsset::getAssetType, assetType);
        qw.orderByAsc(QxMediaAsset::getSortOrder);
        return mediaAssetMapper.selectList(qw);
    }
}
