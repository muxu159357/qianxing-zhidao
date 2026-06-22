package com.qianxing.zhidao.admin.config;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.admin.entity.QxAdminUser;
import com.qianxing.zhidao.admin.mapper.QxAdminUserMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminBootstrapRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrapRunner.class);

    private final QxAdminUserMapper adminUserMapper;
    private final boolean enabled;
    private final String username;
    private final String password;
    private final String displayName;

    public AdminBootstrapRunner(QxAdminUserMapper adminUserMapper,
                                @Value("${admin.bootstrap.enabled:false}") boolean enabled,
                                @Value("${admin.bootstrap.username:}") String username,
                                @Value("${admin.bootstrap.password:}") String password,
                                @Value("${admin.bootstrap.display-name:管理员}") String displayName) {
        this.adminUserMapper = adminUserMapper;
        this.enabled = enabled;
        this.username = username != null ? username.trim() : "";
        this.password = password != null ? password.trim() : "";
        this.displayName = displayName != null ? displayName.trim() : "管理员";
    }

    @Override
    public void run(String... args) {
        if (!enabled) {
            log.info("Admin bootstrap: disabled (set ADMIN_BOOTSTRAP_ENABLED=true to enable)");
            return;
        }
        if (username.isEmpty() || password.isEmpty()) {
            log.warn("Admin bootstrap: username or password empty, skipping");
            return;
        }

        QxAdminUser existing = adminUserMapper.selectOne(
                new LambdaQueryWrapper<QxAdminUser>().eq(QxAdminUser::getUsername, username));
        if (existing != null) {
            log.info("Admin bootstrap: user '{}' already exists, skipping", username);
            return;
        }

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        QxAdminUser user = new QxAdminUser();
        user.setUsername(username);
        user.setPasswordHash(encoder.encode(password));
        user.setDisplayName(displayName);
        user.setRole("admin");
        user.setStatus(1);
        adminUserMapper.insert(user);
        log.info("Admin bootstrap: created admin user '{}'", username);
    }
}
