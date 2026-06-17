# 黔行智导 — 全项目自动开发总控协议 · 后端规划

> 本文件为后端开发规划文档。
> 当前项目尚未进入后端开发阶段。
> 后端开发启动前必须先完成 PHASE-3 全部任务（V22-A ~ V22-F）。

---

## 一、当前状态

```
后端开发状态：未启动
后端目录状态：不存在（需在 V23-A 创建 backend/ 目录）
技术栈：Spring Boot 3.x + MyBatis-Plus 3.5+ + MySQL 8.0
数据库设计：docs/DATABASE_DESIGN_FINAL.md (v2.1, 15 张表)
SQL DDL：docs/DATABASE_SCHEMA_FINAL.sql

DB连接：jdbc:mysql://localhost:3306/qianxing_zhidao
账号密码：${DB_USERNAME}/${DB_PASSWORD} 环境变量（不提交Git）
数据库尚未创建，由用户手动执行 SQL
```
数据库表结构：未设计
```

---

## 二、后端开发前置条件

**必须全部满足才能进入 PHASE-4（后端服务开发）：**

1. [ ] V22-A：后端范围规划完成 — 技术栈、模块清单、环境要求明确
2. [ ] V22-B：数据模型设计完成 — 全部实体定义完整
3. [ ] V22-C：API 合同设计完成 — 所有端点定义清晰
4. [ ] V22-D：前端 mock 到后端实体映射完成 — 字段对齐
5. [ ] V22-E：数据库表结构设计完成 — 完整 DDL
6. [ ] V22-F：后端开发任务拆分完成 — 可执行任务清单

**铁律**：
- 未完成 API 合同前，不允许前端直接接后端
- 未完成数据库表结构前，不允许写后端实体
- 未确认技术栈前，优先使用 Spring Boot + MyBatis-Plus
- 禁止写真实密钥
- 禁止连接生产数据库
- 禁止删除数据

---

## 三、默认技术栈

| 类别 | 选型 | 说明 |
|------|------|------|
| 语言 | Java 17+ | LTS 版本 |
| 框架 | Spring Boot 3.x | 主框架 |
| ORM | MyBatis-Plus 3.5+ | 增强 MyBatis |
| 数据库 | MySQL 8.0+ 或 PostgreSQL 15+ | 关系型数据库 |
| API 风格 | RESTful | JSON 请求/响应 |
| 响应格式 | 统一响应结构 `{ code, message, data }` | 前后端约定 |
| 异常处理 | 全局异常处理器 | 统一错误码 |
| 构建工具 | Maven 或 Gradle | 视项目情况 |
| 开发环境 | 本地开发 | localhost |

---

## 四、后端模块优先级

按以下优先级逐步开发：

| 优先级 | 模块 | 说明 |
|--------|------|------|
| 1 | 路线数据 | 路线推荐核心数据，前端依赖最重 |
| 2 | 景点数据 | 景点详情、知识库基础数据 |
| 3 | 知识库数据 | AI 伴游 KB 匹配数据源 |
| 4 | 我的行程数据 | 用户行程 CRUD，最高频写入 |
| 5 | 行程详情更新 | 名称/日期/每日安排/状态/清单/复盘 |
| 6 | AI 助手上下文占位 | 预留接口，后续接真实大模型 |

---

## 五、明确当前不做

以下功能在当前阶段明确不开发：

| 功能 | 原因 |
|------|------|
| 支付 | 不需要，非电商场景 |
| 用户登录 | 当前不需要用户系统，可后续扩展 |
| 短信 | 不需要手机验证 |
| 地图定位 | 需要微信小程序原生能力，后端不涉及 |
| 实时天气 | 需要第三方 API，未经确认不接入 |
| 实时路况 | 需要第三方 API，未经确认不接入 |
| 自动报警 | 需要硬件/运营商集成，超出范围 |
| 救援 | 需要对接应急系统，超出范围 |
| 真实 AI 接口 | 需要 API Key 和费用预算，待确认 |
| Dify 接口 | 需要 Dify 部署和配置，待确认 |

---

## 六、双端共用原则

后端必须同时服务：
1. **Web 管理端** — 景点/路线/知识库管理、数据看板
2. **小程序游客端** — 推荐/详情/行程/AI问答/安全提醒

API 路径规划：
- 公共数据接口：`/api/public/...`
- 小程序游客端：`/api/app/...`
- Web 管理端：`/api/admin/...`

同一套业务数据，Web 和小程序共用数据模型。

---

## 七、核心数据模型预览

### 景点 (Attraction)
```
id, name, city, category, description, highlights, tips
imageUrl, rating, visitDuration, bestSeason, ticketPrice
latitude, longitude, createdAt, updatedAt
```

### 路线 (TourRoute)
```
id, name, description, dayCount, energyLevel, budget
suitableCrowd, tags, attractionIds, dailyPlan, createdAt, updatedAt
```

### 知识库 (Knowledge)
```
id, question, answer, category, relatedAttractionIds, createdAt, updatedAt
```

### 行程 (UserTrip)
```
id, routeId, routeName, customName, status
dayCount, energyLevel, spotIds, spotNames, dayPlans
safetyChecklist, review, travelStartDate, travelEndDate
startedAt, completedAt, createdAt, updatedAt
```

---

## 八、API 端点预览

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/public/attractions` | 景点列表 |
| GET | `/api/public/attractions/{id}` | 景点详情 |
| GET | `/api/public/routes` | 路线列表 |
| GET | `/api/public/routes/{id}` | 路线详情 |
| GET | `/api/public/knowledge` | 知识库列表 |
| POST | `/api/app/trips` | 保存行程 |
| GET | `/api/app/trips` | 行程列表 |
| GET | `/api/app/trips/{id}` | 行程详情 |
| PUT | `/api/app/trips/{id}` | 更新行程 |
| DELETE | `/api/app/trips/{id}` | 删除行程 |
| POST | `/api/app/guide/chat` | AI 伴游对话（占位） |
| GET | `/api/admin/attractions` | 管理端景点列表 |
| POST | `/api/admin/attractions` | 新增景点 |
| PUT | `/api/admin/attractions/{id}` | 更新景点 |
| DELETE | `/api/admin/attractions/{id}` | 删除景点 |
| GET | `/api/admin/dashboard/stats` | 数据看板统计 |

---

## 九、安全红线

- **禁止硬编码密钥** — 所有密钥通过 `application.yml` + 环境变量注入
- **禁止连接生产数据库** — 开发阶段只用本地数据库
- **禁止写死真实 API Key** — 使用占位符 `${API_KEY}`
- **禁止提交 `.env` / `application-prod.yml`** — 加入 `.gitignore`
- **SQL 注入防护** — MyBatis-Plus 参数化查询（`#{}` 不用 `${}`）
- **输入验证** — 所有接口参数验证

---

## 版本历史

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-16 | 1.0 | 初始化后端规划占位文档 |
