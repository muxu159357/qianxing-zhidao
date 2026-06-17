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
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class WechatAuthService {
    private static final Logger log = LoggerFactory.getLogger(WechatAuthService.class);

    private final QxUserMapper userMapper;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;
    private final String appid;
    private final String secret;

    public WechatAuthService(QxUserMapper userMapper, JwtUtil jwtUtil, RestTemplate restTemplate,
                             @Value("${wx.appid:}") String appid,
                             @Value("${wx.secret:}") String secret) {
        this.userMapper = userMapper;
        this.jwtUtil = jwtUtil;
        this.restTemplate = restTemplate;
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
        String url = "https://api.weixin.qq.com/sns/jscode2session"
                + "?appid=" + appid + "&secret=" + secret + "&js_code=" + code
                + "&grant_type=authorization_code";
        try {
            Map<String, Object> resp = restTemplate.getForObject(url, Map.class);
            if (resp == null) throw new BusinessException(500, "微信接口返回为空");
            if (resp.get("errcode") != null && (int) resp.get("errcode") != 0) {
                log.error("WeChat code2session error: {}", resp);
                throw new BusinessException(400, "微信登录失败: " + resp.get("errmsg"));
            }
            return (String) resp.get("openid");
        } catch (BusinessException e) {
            throw e;
        } catch (Exception e) {
            log.error("WeChat code2session failed", e);
            throw new BusinessException(500, "微信登录服务异常");
        }
    }
}
