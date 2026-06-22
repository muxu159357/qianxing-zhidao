package com.qianxing.zhidao.auth.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Date;

@Component
public class JwtUtil {
    private static final Logger log = LoggerFactory.getLogger(JwtUtil.class);
    private static final int MIN_SECRET_LENGTH = 32;

    private final SecretKey key;
    private final long expirationMs;
    private final boolean configured;

    public JwtUtil(@Value("${jwt.secret:}") String secret,
                   @Value("${jwt.expiration-ms:86400000}") long expirationMs,
                   Environment env) {
        boolean isProd = env != null && env.getActiveProfiles().length > 0
                && (Arrays.asList(env.getActiveProfiles()).contains("prod")
                    || Arrays.asList(env.getActiveProfiles()).contains("production"));

        if (secret == null || secret.isBlank()) {
            if (isProd) {
                throw new IllegalStateException(
                        "JWT_SECRET is required in production. Set JWT_SECRET env var (>=32 chars).");
            }
            this.key = null;
            this.expirationMs = expirationMs;
            this.configured = false;
            log.warn("JWT_SECRET is empty — token generation will fail until configured");
        } else {
            byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
            if (keyBytes.length < MIN_SECRET_LENGTH) {
                if (isProd) {
                    throw new IllegalStateException(
                            "JWT_SECRET too short in production ("
                            + keyBytes.length + " bytes, minimum " + MIN_SECRET_LENGTH
                            + "). Please set a longer JWT_SECRET."
                    );
                }
                log.warn("JWT_SECRET is too short ({} bytes, minimum {}). "
                        + "Please use a longer secret for production. "
                        + "Dev/test env: add {} more chars.",
                        keyBytes.length, MIN_SECRET_LENGTH, MIN_SECRET_LENGTH - keyBytes.length);
            }
            this.key = Keys.hmacShaKeyFor(keyBytes);
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
