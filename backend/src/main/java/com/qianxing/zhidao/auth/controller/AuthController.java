package com.qianxing.zhidao.auth.controller;

import com.qianxing.zhidao.auth.dto.WechatLoginRequest;
import com.qianxing.zhidao.auth.dto.WechatLoginResponse;
import com.qianxing.zhidao.auth.service.WechatAuthService;
import com.qianxing.zhidao.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@Tag(name = "auth", description = "认证接口")
@RestController
@RequestMapping("/api/app/auth")
public class AuthController {

    private final WechatAuthService wechatAuthService;

    public AuthController(WechatAuthService wechatAuthService) {
        this.wechatAuthService = wechatAuthService;
    }

    @Operation(summary = "微信小程序登录")
    @PostMapping("/wechat-login")
    public ApiResponse<WechatLoginResponse> wechatLogin(@Valid @RequestBody WechatLoginRequest request) {
        return ApiResponse.ok(wechatAuthService.login(request));
    }
}
