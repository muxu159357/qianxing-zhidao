package com.qianxing.zhidao.auth.config;

import com.qianxing.zhidao.common.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Order(1)
public class JwtAuthFilter implements Filter {
    private static final Logger log = LoggerFactory.getLogger(JwtAuthFilter.class);

    private final JwtUtil jwtUtil;
    private final ObjectMapper objectMapper;

    private static final String[] PUBLIC_PATHS = {
            "/api/health",
            "/api/app/auth/",
            "/api/app/scenic/",
            "/api/app/route",
            "/api/app/media/",
            "/api/app/knowledge/",
            "/api/app/weather/",
            "/api/admin/auth/",
            "/swagger-ui",
            "/v3/api-docs"
    };

    public JwtAuthFilter(JwtUtil jwtUtil, ObjectMapper objectMapper) {
        this.jwtUtil = jwtUtil;
        this.objectMapper = objectMapper;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpReq = (HttpServletRequest) request;
        HttpServletResponse httpResp = (HttpServletResponse) response;
        String path = httpReq.getRequestURI();

        if (isPublicPath(path)) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = httpReq.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            writeUnauthorized(httpResp, "未登录");
            return;
        }

        String token = authHeader.substring(7);
        try {
            Claims claims = jwtUtil.parseToken(token);
            // Admin path guard: only tokens with role=admin can access /api/admin/**
            if (path.startsWith("/api/admin/")) {
                if (!"admin".equals(claims.get("role", String.class))) {
                    writeForbidden(httpResp, "无权限访问后台接口");
                    return;
                }
            }
            // App path guard: admin tokens cannot access /api/app/**
            if (path.startsWith("/api/app/") && "admin".equals(claims.get("role", String.class))) {
                writeForbidden(httpResp, "管理员账号不能访问用户接口");
                return;
            }
            httpReq.setAttribute("userId", jwtUtil.getUserId(claims));
            httpReq.setAttribute("openid", claims.get("openid", String.class));
            chain.doFilter(request, response);
        } catch (ExpiredJwtException e) {
            writeUnauthorized(httpResp, "登录已过期，请重新登录");
        } catch (JwtException e) {
            writeUnauthorized(httpResp, "登录失效，请重新登录");
        }
    }

    private boolean isPublicPath(String path) {
        for (String p : PUBLIC_PATHS) {
            if (path.startsWith(p)) return true;
        }
        return false;
    }

    private void writeUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(401);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(ApiResponse.fail(401, message)));
    }

    private void writeForbidden(HttpServletResponse response, String message) throws IOException {
        response.setStatus(403);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(ApiResponse.fail(403, message)));
    }
}
