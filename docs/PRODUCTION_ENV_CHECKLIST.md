# 黔行智导 · 生产环境变量清单
## 必须配置
| 变量 | 要求 |
|------|------|
| SPRING_PROFILES_ACTIVE | prod |
| JWT_SECRET | >=32字节 随机密钥 |
| DB_HOST/PORT/NAME/USERNAME/PASSWORD | 生产数据库 |
| REDIS_HOST/PORT/PASSWORD | 生产Redis |
## 初始化时配置
| 变量 | 说明 |
|------|------|
| ADMIN_BOOTSTRAP_ENABLED | 首次true→创建后false |
| ADMIN_BOOTSTRAP_USERNAME/PASSWORD | 管理员账号 |
## 可选 (缺失时降级)
| 变量 | 缺失影响 |
|------|---------|
| AI_API_KEY/BASE_URL/MODEL | AI规则降级 |
| WEATHER_API_KEY | 返回参考提醒 |
## 安全要求
- JWT_SECRET prod下<32字节启动失败
- 生产不能使用示例密钥
- 不打印密钥到日志
- 不提交密钥到仓库
