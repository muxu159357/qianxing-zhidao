package com.qianxing.zhidao.media.controller;

import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.media.entity.QxMediaAsset;
import com.qianxing.zhidao.media.service.MediaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "media", description = "图片资产接口")
@RestController
@RequestMapping("/api/app/media")
public class MediaController {

    private final MediaService mediaService;

    public MediaController(MediaService mediaService) {
        this.mediaService = mediaService;
    }

    @Operation(summary = "图片资产列表")
    @GetMapping("/assets")
    public ApiResponse<List<QxMediaAsset>> listAssets(
            @Parameter(description = "业务类型") @RequestParam(required = false) String bizType,
            @Parameter(description = "业务ID") @RequestParam(required = false) Long bizId,
            @Parameter(description = "资产类型") @RequestParam(required = false) String assetType) {
        return ApiResponse.ok(mediaService.listAssets(bizType, bizId, assetType));
    }
}
