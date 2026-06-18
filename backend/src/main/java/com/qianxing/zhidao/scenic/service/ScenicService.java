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
        if (spot == null || spot.getStatus() != 1) throw new BusinessException(404, "景点不存在");
        return spot;
    }

    public PageResult<QxScenicSpot> adminList(String category, String city, String keyword, int page, int size) {
        LambdaQueryWrapper<QxScenicSpot> qw = new LambdaQueryWrapper<>();
        if (category != null && !category.isBlank()) qw.eq(QxScenicSpot::getCategory, category);
        if (city != null && !city.isBlank()) qw.eq(QxScenicSpot::getCity, city);
        if (keyword != null && !keyword.isBlank()) qw.like(QxScenicSpot::getName, keyword);
        qw.orderByAsc(QxScenicSpot::getSortOrder);
        Page<QxScenicSpot> mpPage = new Page<>(page, size);
        Page<QxScenicSpot> result = scenicSpotMapper.selectPage(mpPage, qw);
        return PageResult.of(result.getRecords(), result.getTotal(), page, size);
    }

    public QxScenicSpot createSpot(QxScenicSpot spot) { scenicSpotMapper.insert(spot); return spot; }

    public QxScenicSpot updateSpot(Long id, QxScenicSpot patch) {
        QxScenicSpot s = scenicSpotMapper.selectById(id);
        if (s == null) throw new BusinessException(404, "景点不存在");
        if (patch.getName() != null) s.setName(patch.getName());
        if (patch.getCity() != null) s.setCity(patch.getCity());
        if (patch.getCategory() != null) s.setCategory(patch.getCategory());
        if (patch.getDescription() != null) s.setDescription(patch.getDescription());
        if (patch.getStatus() != null) s.setStatus(patch.getStatus());
        if (patch.getSortOrder() != null) s.setSortOrder(patch.getSortOrder());
        scenicSpotMapper.updateById(s);
        return s;
    }

    public void deleteSpot(Long id) { scenicSpotMapper.deleteById(id); }
}
