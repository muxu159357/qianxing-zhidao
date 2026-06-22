# 黔行智导 · 项目阻塞记录

## Redis 未真实启用
- 模块：AI 线路草稿缓存
- 状态：pom.xml 已有 Redis 依赖，当前 ConcurrentHashMap 内存降级（commit c4ecef9）
- 风险：重启草稿丢失，多实例不共享
- 恢复条件：安装 Redis，配置 REDIS_HOST/PORT/PASSWORD/DATABASE

## 后台真实管理员账号未初始化
- 模块：后台管理登录
- 状态：AdminBootstrapRunner 已就绪，需配置 ADMIN_BOOTSTRAP_* 环境变量
- 风险：未创建账号前无法完成后台真实登录验收
- 恢复条件：在 .local/local-env.ps1 添加:
  - $env:ADMIN_BOOTSTRAP_ENABLED = "true"
  - $env:ADMIN_BOOTSTRAP_USERNAME = "admin"
  - $env:ADMIN_BOOTSTRAP_PASSWORD = "your-secure-password"
- 后续验证：登录 /admin/login → /admin/dashboard → /admin/scenic

## 后台登录速率限制待实现
- 模块：后台管理登录
- 状态：AdminAuthController 登录端点无速率限制
- 风险：暴力破解风险
- 建议：后续增加基于用户名/IP 的失败次数限制或冷却策略
