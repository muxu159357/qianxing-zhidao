package com.qianxing.zhidao.auth.service;

import com.qianxing.zhidao.auth.config.JwtUtil;
import com.qianxing.zhidao.auth.dto.WechatLoginRequest;
import com.qianxing.zhidao.auth.dto.WechatLoginResponse;
import com.qianxing.zhidao.common.BusinessException;
import com.qianxing.zhidao.user.entity.QxUser;
import com.qianxing.zhidao.user.mapper.QxUserMapper;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Map;

@Service
public class WechatAuthService {
    private static final Logger log = LoggerFactory.getLogger(WechatAuthService.class);

    private final QxUserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final String appid;
    private final String secret;

    public WechatAuthService(QxUserMapper userMapper, JwtUtil jwtUtil, RestTemplate restTemplate,
                             ObjectMapper objectMapper,
                             @Value("${wx.appid:}") String appid,
                             @Value("${wx.secret:}") String secret) {
        this.userMapper = userMapper;
        this.jwtUtil = jwtUtil;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.appid = appid;
        this.secret = secret;
    }

    public WechatLoginResponse login(WechatLoginRequest request) {
        if (appid == null || appid.isBlank() || secret == null || secret.isBlank()) {
            throw new BusinessException(501, "微信登录暂未配置，请联系管理员");
        }

        String openid = code2session(request.getCode());

        QxUser user = userMapper.selectOne(
                new LambdaQueryWrapper<QxUser>().eq(QxUser::getOpenid, openid));
        boolean isNewUser = (user == null);

        if (isNewUser) {
            user = new QxUser();
            user.setOpenid(openid);
            user.setNickname(request.getNickname() != null ? request.getNickname() : "游客");
            user.setAvatarUrl(request.getAvatarUrl());
            user.setStatus(1);
            userMapper.insert(user);
        } else if (request.getNickname() != null || request.getAvatarUrl() != null) {
            if (request.getNickname() != null) user.setNickname(request.getNickname());
            if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
            userMapper.updateById(user);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getOpenid());
        return new WechatLoginResponse(token, user.getId(), user.getNickname(), user.getAvatarUrl(), isNewUser);
    }

    private String code2session(String code) {
        String url = UriComponentsBuilder
                .fromHttpUrl("https://api.weixin.qq.com/sns/jscode2session")
                .queryParam("appid", appid)
                .queryParam("secret", secret)
                .queryParam("js_code", code)
                .queryParam("grant_type", "authorization_code")
                .toUriString();

        try {
            String body = restTemplate.getForObject(url, String.class);
            if (body == null || body.isBlank()) {
                throw new BusinessException(500, "微信登录响应为空");
            }

            Map<String, Object> resp = objectMapper.readValue(body,
                    new TypeReference<Map<String, Object>>() {});

            if (resp.containsKey("errcode")) {
                int errcode = ((Number) resp.get("errcode")).intValue();
                if (errcode != 0) {
                    String errmsg = (String) resp.getOrDefault("errmsg", "");
                    log.error("WeChat code2session error: errcode={} errmsg={}", errcode, errmsg);
                    String userMsg = mapWechatError(errcode, errmsg);
                    throw new BusinessException(400, userMsg);
                }
            }

            String openid = (String) resp.get("openid");
            if (openid == null || openid.isBlank()) {
                log.error("WeChat code2session response missing openid: errcode={} errmsg={}",
                        resp.get("errcode"), resp.get("errmsg"));
                throw new BusinessException(500, "微信登录响应缺少用户标识");
            }
            return openid;
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("WeChat code2session failed: {}", e.getMessage());
            throw new BusinessException(500, "微信登录服务异常");
        }
    }

    private String mapWechatError(int errcode, String errmsg) {
        switch (errcode) {
            case 40029:
            case 40163:
                return "登录凭证已失效，请重新进入小程序后重试";
            case 40125:
                return "微信登录配置无效，请检查AppID和AppSecret";
            case -1:
                return "微信服务繁忙，请稍后重试";
            default:
                return "微信登录失败: " + (errmsg != null && !errmsg.isBlank() ? errmsg : "errcode=" + errcode);
        }
    }
}
