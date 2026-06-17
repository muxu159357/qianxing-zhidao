# 黔行智导 · 后端总规划

> Version: 3.0 | 2026-06-17 | PHASE-4-ARCHITECTURE-CONFIRMED
> DB: qianxing_zhidao (MySQL 8.0+, 15 tables created)
> Code: not started (PHASE-4-B pending)

---

## 一、后端目标

正式产品基础版。基础架构规范、接口清晰、方便后续后台管理和网页端联调。

## 二、服务形态

**单体 Spring Boot，内部按模块划分**。高内聚低耦合，后期可拆微服务。

## 三、小程序与网页端

- 共用同一套后端 API
- 网页端等小程序全流程跑通后再做
- 当前只实现小程序接口，API 设计考虑网页端复用

## 四、技术栈

| 组件 | 版本 | 阶段 |
|------|------|------|
| Java | 21 LTS | 4B |
| Spring Boot | 3.4.x | 4B |
| Maven | 3.9+ | 4B |
| MyBatis-Plus | 3.5.9 | 4B |
| MySQL | 8.0+ | 4A done |
| Flyway | 10.x | 4C |
| JWT | jjwt 0.12 | 4D |
| OpenAPI/Swagger | springdoc 2.6 | 4B |
| Lombok | 1.18 | 4B |
| JUnit 5 | — | 4B |

暂不引入：Redis, Docker, OSS SDK, Dify SDK, 后台框架, 文件上传, 天气 API

## 五、数据库版本管理

- **Flyway** migration: `V1__init_schema.sql`
- docs/DATABASE_SCHEMA_FINAL.sql 为设计定稿
- **不使用 Hibernate ddl-auto update**
- 不允许启动时自动改表

## 六、ORM

MyBatis-Plus。简单 CRUD 用 BaseMapper，复杂查询按需补 XML。Entity/Mapper/Service/Controller 分层清晰。

## 七、JSON 策略

核心数据拆表，快照和 AI 结果用 JSON：`route_snapshot_json`, `plan_snapshot_json`, `input_json`, `profile_json`, `context_json`, `raw_result_json`, `normalized_result_json`, `error_json`

## 八、登录

微信 code → openid → 本地用户 → JWT token。unionid 预留。手机号后续。

## 九、AI 接入

- 后端统一请求 AI/Dify，小程序不直接请求
- 当前阶段不接真实 AI
- 必须记录全部 AI 请求/结果/错误
- AI 回答结构化：

```json
{ "answer": "", "relatedScenicIds": [], "relatedRouteIds": [], "knowledgeRefs": [], "suggestedActions": [], "riskTips": [], "confidence": 0 }
```

## 十、知识库与动态信息

- 不可变知识（介绍/文化/建议）→ qx_knowledge_article
- 可变信息（天气/季节/开放状态）→ 后续 qx_scenic_weather / qx_scenic_dynamic_info + 定时任务
- 当前不实现

## 十一、图片资产

qx_media_asset 表。本地 fallback 图用于演示。正式阶段后台上传+CDN。

## 十二、后台管理

后续再做。数据库保留 status/deleted/sort_order/created_at/updated_at。

## 十三、API 规范

| 前缀 | 用途 | 阶段 |
|------|------|------|
| `/api/health` | 健康检查 | 4B |
| `/api/app/**` | 小程序端 | 4E+ |
| `/api/web/**` | 网页端预留 | 6 |
| `/api/admin/**` | 后台预留 | 6 |
| `/api/public/**` | 公共接口 | 4E+ |

返回体：`{ "code": 0, "message": "ok", "data": {} }`

错误码：0=ok, 400=参数, 401=登录, 404=未找到, 500=服务错误

OpenAPI 3.0 文档 (springdoc)

## 十四、模块规划

| 模块 | 包 | 阶段 |
|------|-----|------|
| common | `.common` | 4B |
| auth | `.auth` | 4D |
| user | `.user` | 4D |
| scenic | `.scenic` | 4E |
| route | `.route` | 4E |
| media | `.media` | 4E |
| trip | `.trip` | 4F |
| ai | `.ai` | 4G |
| knowledge | `.knowledge` | 4H |
| weather | `.weather` | 后续 |
| admin | `.admin` | 后续 |

## 十五、PHASE-4 阶段

| 阶段 | 内容 | 状态 |
|------|------|------|
| 4A | 数据库设计定稿 | done |
| ARCH | 架构确认（本文档） | current |
| 4B | 工程骨架 pom.xml+启动类+common+health | pending |
| 4C | Flyway migration | pending |
| 4D | 微信登录 JWT | pending |
| 4E | 景点/路线/媒体只读 API | pending |
| 4F | 用户行程 CRUD API | pending |
| 4G | AI 规划记录+模拟 API | pending |
| 4H | 知识库 API | pending |
| 4I | 质量门+OpenAPI 验收 | pending |
| 5 | 小程序前后端联调 | pending |
| 6 | 网页端/后台管理 | pending |

## 十六、部署

本地 localhost:8080。无服务器。Docker 后续。密钥环境变量注入。

## 版本

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-17 | 3.0 | 用户确认全部架构决策，阶段细化 |
