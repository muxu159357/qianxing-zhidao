# 黔行智导 · PHASE-4-L 后端交付验收报告

> 验收日期：2026-06-17
> 验收阶段：PHASE-4-L
> 验收人：自动验收流程

---

## 一、验收结果总表

| # | 检查项 | 结果 | 说明 |
|---|--------|------|------|
| 1 | mvn clean compile | PASS | 67 文件编译成功，0 错误 |
| 2 | mvn test | PASS | 1 test passed (H2 + @ActiveProfiles("test")) |
| 3 | 后端可启动 | BLOCKED | 需 DB_PASSWORD 环境变量 |
| 4 | Flyway 正常 | BLOCKED | 依赖数据库连接 |
| 5 | 数据库连接 | BLOCKED | Access denied (no password) |
| 6 | /api/health | BLOCKED | 后端未启动 |
| 7 | Swagger/OpenAPI | BLOCKED | 后端未启动 |
| 8 | 公开接口 | BLOCKED | 后端未启动 |
| 9 | 鉴权接口 401 | BLOCKED | 后端未启动 |
| 10 | 微信配置缺失处理 | CODE-OK | 代码返回 501 BusinessException |
| 11 | LLM 配置缺失处理 | CODE-OK | 代码降级为规则回答 |
| 12 | 天气配置缺失处理 | CODE-OK | 代码返回 501 BusinessException |
| 13 | 无真实密钥 | PASS | 0 真实密钥 |
| 14 | 无小程序改动 | PASS | miniprogram/ 零修改 |
| 15 | API 文档 | PASS | docs/API.md 含 30 端点 |

## 二、编译结果

```
mvn clean compile: BUILD SUCCESS
67 source files compiled
Warnings: 1 (unchecked cast in WechatAuthService - harmless)
```

## 三、测试结果

```
mvn test: BUILD SUCCESS
Tests run: 1, Failures: 0, Errors: 0, Skipped: 0
Profile: "test" (H2 in-memory database)
```

## 四、启动阻塞分析

**后端无法启动，根因：**
```
Access denied for user 'root'@'localhost' (using password: NO)
```

**解决方案：**
```bash
# 方法一：环境变量
export DB_PASSWORD=your_mysql_password

# 方法二：application-local.yml
cp backend/src/main/resources/application-local.yml.template backend/src/main/resources/application-local.yml
# 编辑填入真实密码，启动时使用 --spring.profiles.active=local

# 方法三：命令行参数
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.datasource.password=your_password"
```

## 五、代码边界检查

| 检查项 | 结果 |
|--------|------|
| 无 Nacos 引入 | PASS |
| 无 Spring Cloud 引入 | PASS |
| 无 Gateway 引入 | PASS |
| 无 Redis 引入 | PASS |
| 无 MQ 引入 | PASS |
| 无 Dockerfile | PASS |
| 无真实 WX_SECRET | PASS |
| 无真实 LLM_API_KEY | PASS |
| 无真实 WEATHER_API_KEY | PASS |
| 无 miniprogram 修改 | PASS |

## 六、curl 验证（需要后端启动后执行）

数据库密码配置后，执行以下验证：

### 6.1 健康检查
```bash
curl -i http://localhost:8080/api/health
# 期望：{"code":0,"message":"ok","data":"qianxing-zhidao backend is running"}
```

### 6.2 OpenAPI
```bash
curl -i http://localhost:8080/v3/api-docs
# 期望：JSON OpenAPI 文档
# 浏览器访问：http://localhost:8080/swagger-ui.html
```

### 6.3 公开接口
```bash
curl -i http://localhost:8080/api/app/scenic/spots
curl -i http://localhost:8080/api/app/routes
curl -i http://localhost:8080/api/app/knowledge/articles
curl -i "http://localhost:8080/api/app/media/assets?bizType=scenic&bizId=1"
```

### 6.4 鉴权接口
```bash
curl -i http://localhost:8080/api/app/user/me
# 期望：HTTP 401
curl -i http://localhost:8080/api/app/trips
# 期望：HTTP 401
```

### 6.5 微信登录（无配置）
```bash
curl -i -X POST http://localhost:8080/api/app/auth/wechat-login \
  -H "Content-Type: application/json" \
  -d '{"code":"test-code"}'
# 期望：code=501, message含"暂未配置"
```

### 6.6 AI 规划（未登录）
```bash
curl -i -X POST http://localhost:8080/api/app/ai/plans \
  -H "Content-Type: application/json" \
  -d '{"days":2,"interests":["自然风光"],"peopleCount":2}'
# 期望：HTTP 401
```

### 6.7 天气接口
```bash
curl -i http://localhost:8080/api/app/weather/scenic/1
# 无天气数据时返回空数组（不 500）
```

## 七、数据库检查（需要 MySQL 密码后执行）

```sql
USE qianxing_zhidao;
SHOW TABLES;
-- 期望：18 tables (15 original + 3 V2)
SELECT * FROM flyway_schema_history;
-- 期望：至少有 baseline 记录 + V2 migration
```

## 八、待配置清单

| 变量 | 必填 | 用途 |
|------|------|------|
| DB_PASSWORD | **是** | 数据库连接 |
| JWT_SECRET | **是** | JWT 签名（否则登录不可用） |
| WX_APPID | 否 | 微信登录（缺失返回 501） |
| WX_SECRET | 否 | 微信登录（缺失返回 501） |
| LLM_API_KEY | 否 | AI 问答（缺失降级为规则） |
| WEATHER_API_KEY | 否 | 天气（缺失返回 501） |

## 九、P0/P1/P2

| 级别 | 数量 | 内容 |
|------|------|------|
| P0 | 0 | — |
| P1 | 0 | — |
| P2 | 1 | 分页插件需 mybatis-plus-jsqlparser（当前不阻塞） |

## 十、结论

- **代码状态**：编译通过、测试通过、边界检查全部通过
- **启动阻塞**：需要配置 `DB_PASSWORD`
- **API 就绪度**：30 个端点代码完整，待数据库连接后验证
- **安全性**：零真实密钥提交、零小程序改动
- **是否可以进入 PHASE-5**：配置 DB_PASSWORD + JWT_SECRET 后即可
