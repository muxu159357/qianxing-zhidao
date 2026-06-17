package com.qianxing.zhidao.scenic.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.common.dto.PageResult;
import com.qianxing.zhidao.scenic.entity.QxScenicSpot;
import com.qianxing.zhidao.scenic.mapper.QxScenicSpotMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ScenicService {

    private final QxScenicSpotMapper scenicSpotMapper;

    public ScenicService(QxScenicSpotMapper scenicSpotMapper) {
        this.scenicSpotMapper = scenicSpotMapper;
    }

    public PageResult<QxScenicSpot> listSpots(String category, String city, String keyword, int page, int size) {
        LambdaQueryWrapper<QxScenicSpot> qw = new LambdaQueryWrapper<>();
        qw.eq(QxScenicSpot::getStatus, 1);
        if (category != null && !category.isBlank()) qw.eq(QxScenicSpot::getCategory, category);
        if (city != null && !city.isBlank()) qw.eq(QxScenicSpot::getCity, city);
        if (keyword != null && !keyword.isBlank()) qw.like(QxScenicSpot::getName, keyword);
        qw.orderByAsc(QxScenicSpot::getSortOrder);

        Page<QxScenicSpot> mpPage = new Page<>(page, size);
        Page<QxScenicSpot> result = scenicSpotMapper.selectPage(mpPage, qw);
        return PageResult.of(result.getRecords(), result.getTotal(), page, size);
    }

    public QxScenicSpot getSpot(Long id) {
        QxScenicSpot spot = scenicSpotMapper.selectById(id);
        if (spot == null || spot.getStatus() != 1) {
            throw new BusinessException(404, "景点不存在");
        }
        return spot;
    }
}
