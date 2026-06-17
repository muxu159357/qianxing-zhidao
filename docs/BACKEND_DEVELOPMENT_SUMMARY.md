# 黔行智导 · 后端开发总结

> Version: 1.0 | 2026-06-17 | PHASE-4 完成

## 一、项目概况

- **项目名**：黔行智导 · 贵州山地旅游 AI 伴游与安全守护平台
- **后端形态**：模块化单体 Spring Boot 3.4.4
- **数据库**：MySQL 8.0+ (qianxing_zhidao, 18 tables)
- **Java**：21 LTS
- **构建**：Maven

## 二、代码规模

| 指标 | 数值 |
|------|------|
| Java 源文件 | 67 |
| 模块数 | 11 |
| Entity 类 | 18 |
| Mapper 接口 | 18 |
| Service 类 | 8 |
| Controller 类 | 8 |
| Flyway Migration | 1 (V2) |
| API 端点 | 30 (17 public + 13 auth) |

## 三、模块清单

| 模块 | 包路径 | 文件数 |
|------|--------|--------|
| common | `com.qianxing.zhidao.common` | 4 |
| config | `com.qianxing.zhidao.config` | 4 |
| auth | `com.qianxing.zhidao.auth` | 6 |
| user | `com.qianxing.zhidao.user` | 4 |
| scenic | `com.qianxing.zhidao.scenic` | 4 |
| route | `com.qianxing.zhidao.route` | 8 |
| trip | `com.qianxing.zhidao.trip` | 12 |
| media | `com.qianxing.zhidao.media` | 4 |
| knowledge | `com.qianxing.zhidao.knowledge` | 4 |
| ai | `com.qianxing.zhidao.ai` | 5 |
| weather | `com.qianxing.zhidao.weather` | 4 |
| admin | `com.qianxing.zhidao.admin` | 2 |

## 四、数据库表

| # | 表名 | 说明 | 来源 |
|---|------|------|------|
| 1 | qx_user | 用户表 | PHASE-4-A |
| 2 | qx_scenic_spot | 景点表 | PHASE-4-A |
| 3 | qx_route | 路线模板表 | PHASE-4-A |
| 4 | qx_route_day | 路线每日安排 | PHASE-4-A |
| 5 | qx_route_spot | 路线景点关联 | PHASE-4-A |
| 6 | qx_media_asset | 图片资产 | PHASE-4-A |
| 7 | qx_user_trip | 用户行程 | PHASE-4-A |
| 8 | qx_user_trip_day | 行程每日安排 | PHASE-4-A |
| 9 | qx_user_trip_spot | 行程景点 | PHASE-4-A |
| 10 | qx_trip_safety_item | 安全清单 | PHASE-4-A |
| 11 | qx_trip_review | 行程复盘 | PHASE-4-A |
| 12 | qx_ai_plan_request | AI规划请求 | PHASE-4-A |
| 13 | qx_ai_plan_result | AI规划结果 | PHASE-4-A |
| 14 | qx_knowledge_article | 知识库文章 | PHASE-4-A |
| 15 | qx_knowledge_relation | 知识库关联 | PHASE-4-A |
| 16 | qx_admin_user | 后台管理员 | PHASE-4-C (V2) |
| 17 | qx_weather_location | 天气地点配置 | PHASE-4-C (V2) |
| 18 | qx_scenic_weather | 景区天气数据 | PHASE-4-C (V2) |

## 五、技术选型

| 组件 | 版本 | 状态 |
|------|------|------|
| Spring Boot | 3.4.4 | 已集成 |
| MyBatis-Plus | 3.5.9 | 已集成 |
| Flyway | 10.x | 已集成 (baseline-on-migrate) |
| JWT (jjwt) | 0.12.6 | 已集成 |
| SpringDoc OpenAPI | 2.6.0 | 已集成 |
| Lombok | 1.18.x | 已集成 |
| H2 | 2.3.232 | 测试用 |
| MySQL Connector | 9.1.0 | 运行时 |

## 六、未引入的技术

- Nacos / Spring Cloud / Gateway
- Redis / MQ
- Docker / Kubernetes
- 对象存储 SDK
- Dify SDK
- 真实 LLM / 天气 API 客户端

## 七、安全措施

- JWT 认证 + Bearer token
- 公开/登录接口分离（JwtAuthFilter）
- 密钥全部走环境变量
- application-local.yml 在 .gitignore
- 无硬编码密钥
- 逻辑删除 (@TableLogic)

## 八、启动命令

```bash
cd backend
export DB_PASSWORD=your_password
export JWT_SECRET=your_256_bit_secret
mvn spring-boot:run
```

## 九、验证命令

```bash
# 健康检查
curl http://localhost:8080/api/health

# OpenAPI
curl http://localhost:8080/v3/api-docs
open http://localhost:8080/swagger-ui.html

# 景点列表
curl http://localhost:8080/api/app/scenic/spots
```

## 十、版本历史

| 日期 | commit | 说明 |
|------|--------|------|
| 2026-06-17 | `9421b7a` | PHASE-4-B 工程骨架 |
| 2026-06-17 | `55c2896` | PHASE-4-C/D Entity+Mapper |
| 2026-06-17 | `46c1697` | PHASE-4-E 认证+用户 |
| 2026-06-17 | `631b097` | PHASE-4-F~J 业务API |
| 2026-06-17 | `359029e` | PHASE-4-K 文档 |
