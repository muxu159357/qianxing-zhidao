package com.qianxing.zhidao.admin.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.admin.entity.QxAdminUser;
import com.qianxing.zhidao.admin.mapper.QxAdminUserMapper;
import com.qianxing.zhidao.auth.config.JwtUtil;
import com.qianxing.zhidao.common.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Tag(name = "admin-auth", description = "后台登录")
@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    private final QxAdminUserMapper adminUserMapper;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminAuthController(QxAdminUserMapper adminUserMapper, JwtUtil jwtUtil) {
        this.adminUserMapper = adminUserMapper;
        this.jwtUtil = jwtUtil;
    }

    @Operation(summary = "后台登录")
    @PostMapping("/login")
    public ApiResponse<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.getOrDefault("username", "").trim();
        String password = body.getOrDefault("password", "");

        if (username.isEmpty() || password.isEmpty()) {
            return ApiResponse.fail(400, "用户名和密码不能为空");
        }

        QxAdminUser user = adminUserMapper.selectOne(
                new LambdaQueryWrapper<QxAdminUser>().eq(QxAdminUser::getUsername, username));
        if (user == null || user.getStatus() == null || user.getStatus() != 1) {
            return ApiResponse.fail(401, "用户名或密码错误");
        }

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return ApiResponse.fail(401, "用户名或密码错误");
        }

        String token = jwtUtil.generateAdminToken(user.getId(), user.getUsername());
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", token);
        result.put("user", Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "displayName", user.getDisplayName() != null ? user.getDisplayName() : user.getUsername(),
                "role", user.getRole() != null ? user.getRole() : "admin"));
        return ApiResponse.ok(result);
    }

    @Operation(summary = "获取当前管理员")
    @GetMapping("/me")
    public ApiResponse<Map<String, Object>> me(HttpServletRequest req) {
        Long uid = (Long) req.getAttribute("userId");
        if (uid == null) return ApiResponse.fail(401, "未登录");
        QxAdminUser user = adminUserMapper.selectById(uid);
        if (user == null) return ApiResponse.fail(404, "用户不存在");
        return ApiResponse.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "displayName", user.getDisplayName() != null ? user.getDisplayName() : user.getUsername(),
                "role", user.getRole() != null ? user.getRole() : "admin"));
    }
}
