package com.qianxing.zhidao.media.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.common.dto.PageResult;
import com.qianxing.zhidao.media.entity.QxMediaAsset;
import com.qianxing.zhidao.media.mapper.QxMediaAssetMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

@Tag(name = "admin-media", description = "后台媒体管理")
@RestController
@RequestMapping("/api/admin/media")
public class AdminMediaController {
    private final QxMediaAssetMapper mapper;
    public AdminMediaController(QxMediaAssetMapper m) { this.mapper = m; }
    @GetMapping("/assets") public ApiResponse<PageResult<QxMediaAsset>> list(@RequestParam(required = false) String bizType, @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "20") int size) {
        var qw = new LambdaQueryWrapper<QxMediaAsset>(); if (bizType != null && !bizType.isBlank()) qw.eq(QxMediaAsset::getBizType, bizType);
        qw.orderByAsc(QxMediaAsset::getSortOrder); var mp = new Page<QxMediaAsset>(page, size); var r = mapper.selectPage(mp, qw);
        return ApiResponse.ok(PageResult.of(r.getRecords(), r.getTotal(), page, size));
    }
    @PostMapping("/assets") public ApiResponse<QxMediaAsset> create(@RequestBody QxMediaAsset a) { mapper.insert(a); return ApiResponse.ok(a); }
    @PutMapping("/assets/{id}") public ApiResponse<QxMediaAsset> update(@PathVariable Long id, @RequestBody QxMediaAsset p) { var a = mapper.selectById(id); if (a == null) throw new BusinessException(404, "资产不存在"); if (p.getUrl() != null) a.setUrl(p.getUrl()); if (p.getStatus() != null) a.setStatus(p.getStatus()); mapper.updateById(a); return ApiResponse.ok(a); }
    @DeleteMapping("/assets/{id}") public ApiResponse<Void> delete(@PathVariable Long id) { mapper.deleteById(id); return ApiResponse.ok(); }
}
