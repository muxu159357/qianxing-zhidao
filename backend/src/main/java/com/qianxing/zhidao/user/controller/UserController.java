package com.qianxing.zhidao.user.controller;

import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.user.dto.UserProfileVO;
import com.qianxing.zhidao.user.entity.QxUser;
import com.qianxing.zhidao.user.mapper.QxUserMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

@Tag(name = "user", description = "用户接口")
@RestController
@RequestMapping("/api/app/user")
public class UserController {

    private final QxUserMapper userMapper;

    public UserController(QxUserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Operation(summary = "获取当前用户信息")
    @GetMapping("/me")
    public ApiResponse<UserProfileVO> me(HttpServletRequest request) {
        Long userId = (Long) request.getAttribute("userId");
        QxUser user = userMapper.selectById(userId);
        if (user == null) {
            return ApiResponse.fail(404, "用户不存在");
        }
        return ApiResponse.ok(new UserProfileVO(user.getId(), user.getNickname(), user.getAvatarUrl(), user.getPhone()));
    }
}
