package com.qianxing.zhidao.auth.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtUtil {

    private final SecretKey key;
    private final long expirationMs;
    private final boolean configured;

    public JwtUtil(@Value("${jwt.secret:}") String secret,
                   @Value("${jwt.expiration-ms:86400000}") long expirationMs) {
        if (secret == null || secret.isBlank()) {
            this.key = null;
            this.expirationMs = expirationMs;
            this.configured = false;
        } else {
            this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
            this.expirationMs = expirationMs;
            this.configured = true;
        }
    }

    public String generateToken(Long userId, String openid) {
        if (!configured) throw new IllegalStateException("JWT not configured");
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("openid", openid)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    public Claims parseToken(String token) {
        if (!configured) throw new IllegalStateException("JWT not configured");
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Long getUserId(Claims claims) {
        return Long.valueOf(claims.getSubject());
    }

    public String generateAdminToken(Long adminId, String username) {
        if (!configured) throw new IllegalStateException("JWT not configured");
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(adminId))
                .claim("username", username)
                .claim("role", "admin")
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs))
                .signWith(key)
                .compact();
    }

    public boolean isConfigured() {
        return configured;
    }
}
