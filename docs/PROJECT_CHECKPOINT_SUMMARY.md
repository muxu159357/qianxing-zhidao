# 黔行智导 · 项目阶段检查点总览

> 检查日期：2026-06-18
> 当前阶段：PHASE-CHECKPOINT（暂停开发，复盘审查）
> 最后完成阶段：PHASE-5-D（登录与 Token 联调）

---

## 一、项目当前一句话状态

**后端 API 全部就绪（30 个端点 + seed 数据），小程序端已完成 API 封装和登录流程，等待进入公开接口逐批联调（PHASE-5-E）。**

---

## 二、当前总体架构

```
前端：微信原生小程序（10 个页面）+ Vue 3 Web 端（9 个页面）
后端：Java 21 + Spring Boot 3.4.4（模块化单体，68 个 Java 文件）
数据库：MySQL 8.0+（19 张表，3 个 Flyway migration）
ORM：MyBatis-Plus 3.5.9
认证：微信登录 code2session + JWT（jjwt 0.12.6）
API 文档：OpenAPI / Swagger（springdoc 2.8.5）
构建：Maven（后端）+ 微信开发者工具（小程序）
```

---

## 三、小程序端完成情况

### 页面清单（10 个页面，全部完成基础功能）

| 页面 | 路径 | tabBar | 数据来源 | 登录要求 |
|------|------|--------|---------|---------|
| 首页 | pages/index/index | 是 | mock.js / 本地 | 否 |
| AI 伴游 | pages/guide/guide | 是 | 知识库本地匹配 | 后续接 API |
| 我的行程 | pages/my-trips/my-trips | 是 | 本地 storage | 已加登录检查 |
| 兴趣选择 | pages/planner/planner | 否 | mock 标签 | 否 |
| 游客画像 | pages/profile/profile | 否 | 本地规则生成 | 否 |
| 路线推荐 | pages/recommend/recommend | 否 | mock 路线 + 本地打分 | 否 |
| 路线详情 | pages/route-detail/route-detail | 否 | mock 路线 + 本地规则 | 保存时需登录 |
| 行程详情 | pages/trip-detail/trip-detail | 否 | 本地 storage | 状态变更需登录 |
| 景点知识库 | pages/knowledge/knowledge | 否 | mock 知识库 | 否 |
| 景点详情 | pages/scenic-detail/scenic-detail | 否 | mock 景点 | 否 |

### 工具模块（4 个）

| 文件 | 功能 | 状态 |
|------|------|------|
| utils/mock.js | 本地数据（10 景点/5 路线/7 知识库） | 保留作为降级 |
| utils/trip-storage.js | 行程本地存储 CRUD | 已封装 |
| utils/api.js | 后端 API 请求封装（30+ 方法） | PHASE-5-C |
| utils/auth.js | 认证管理（token/登录/401/501） | PHASE-5-D |

### Storage Key 清单（8 个）

| Key | 类型 | 用途 |
|-----|------|------|
| qianxing_profile | 长期 | 游客画像 |
| qianxing_selection | 长期 | 兴趣选择参数 |
| qianxing_trips | 长期 | 我的行程数据 |
| qianxing_pending_context | 临时 | 跨页面上下文 |
| qianxing_pending_question | 临时 | 知识库→AI 问题 |
| qianxing_selected_route | 临时 | 路线→AI 上下文 |
| qianxing_auth_token | 长期 | JWT token（新增） |
| qianxing_auth_user | 长期 | 用户信息缓存（新增） |

---

## 四、后端完成情况

### 模块清单（11 个模块，68 个 Java 文件）

| 模块 | Entity | Mapper | Service | Controller |
|------|--------|--------|---------|------------|
| common | — | — | — | — |
| config | — | — | — | — |
| auth | — | — | 1 | 1 |
| user | 1 | 1 | — | 1 |
| scenic | 1 | 1 | 1 | 1 |
| route | 3 | 3 | 1 | 1 |
| trip | 5 | 5 | 1 | 1 |
| media | 1 | 1 | 1 | 1 |
| knowledge | 2 | 2 | 1 | 1 |
| ai | 2 | 2 | 1 | 1 |
| weather | 2 | 2 | 1 | 1 |
| admin | 1 | 1 | — | — |
| **合计** | **18** | **18** | **8** | **8** |

---

## 五、数据库完成情况

### 表清单（19 张表）

| # | 表名 | 数据量 | 来源 |
|---|------|--------|------|
| 1 | qx_user | 0 | PHASE-4-A |
| 2 | qx_scenic_spot | 10 | PHASE-4-A / V3 seed |
| 3 | qx_route | 5 | PHASE-4-A / V3 seed |
| 4 | qx_route_day | 12 | PHASE-4-A / V3 seed |
| 5 | qx_route_spot | 12 | PHASE-4-A / V3 seed |
| 6 | qx_media_asset | 15 | PHASE-4-A / V3 seed |
| 7-11 | qx_user_trip 系列 | 0 | PHASE-4-A |
| 12-13 | qx_ai_plan 系列 | 0 | PHASE-4-A |
| 14 | qx_knowledge_article | 7 | PHASE-4-A / V3 seed |
| 15 | qx_knowledge_relation | 4 | PHASE-4-A / V3 seed |
| 16 | qx_admin_user | 0 | PHASE-4-C (V2) |
| 17 | qx_weather_location | 0 | PHASE-4-C (V2) |
| 18 | qx_scenic_weather | 0 | PHASE-4-C (V2) |
| 19 | flyway_schema_history | 3 | Flyway 自动 |

### Flyway Migration 记录

| Version | Description | Status |
|---------|-------------|--------|
| 1 | << Flyway Baseline >> | SUCCESS |
| V2 | add admin and weather tables | SUCCESS |
| V3 | seed business data | SUCCESS |

---

## 六、API 完成情况

### 端点统计（30 个）

| 类型 | 数量 | 鉴权 | 数据状态 |
|------|------|------|---------|
| 健康检查 | 1 | 公开 | ✅ |
| 认证 | 1 | 公开 | ⚠️ 需微信配置 |
| 景点 | 2 | 公开 | ✅ seed 数据 |
| 路线 | 4 | 公开 | ✅ seed 数据 |
| 媒体 | 1 | 公开 | ✅ seed 数据 |
| 知识库 | 4 | 公开 | ✅ seed 数据 |
| 天气 | 2 | 公开 | ⚠️ 需天气 API |
| 用户 | 1 | 需登录 | ✅ 401 正确 |
| 行程 | 10 | 需登录 | ✅ 401 正确 |
| AI | 3 | 需登录 | ⚠️ 需 LLM API |

---

## 七、登录与 Token 完成情况

### 已完成
- [x] `utils/auth.js`：token 管理、微信登录、登录检查
- [x] `utils/api.js`：自动携带 Bearer token
- [x] 401 统一处理（清 token + 提示）
- [x] 501 友好处理（Modal "功能暂未配置"）
- [x] `route-detail.js`：保存行程前登录检查
- [x] `trip-detail.js`：开始/完成行程前登录检查

### 待完成
- [ ] 小程序端真实 wx.login 联调（需真实 WX_APPID）
- [ ] my-trips 页面登录状态展示
- [ ] 用户头像/昵称展示

---

## 八、Seed 数据完成情况

| 数据类型 | 数量 | 状态 |
|---------|------|------|
| 景点 | 10 | ✅ 贵州真实景点 |
| 路线 | 5 | ✅ 含每日安排和景点关联 |
| 每日安排 | 12 | ✅ 含餐饮和住宿建议 |
| 路线-景点关联 | 12 | ✅ 含游玩建议 |
| 知识库 | 7 | ✅ 旅行贴士/美食/交通/文化 |
| 知识库关联 | 4 | ✅ 关联对应景点 |
| 媒体资产 | 15 | ✅ 10 景点 + 5 路线封面 |

---

## 九、当前未完成内容

### 小程序端
- [ ] 景点/路线/知识库页面接入后端 API（PHASE-5-E）
- [ ] 我的行程前后端数据同步（PHASE-5-F）
- [ ] AI 助手接入后端问答接口（PHASE-5-G）
- [ ] 天气数据展示（PHASE-5-H）
- [ ] 全流程验收（PHASE-5-I）

### 后端
- [ ] 分页插件依赖（mybatis-plus-jsqlparser）
- [ ] 真实 LLM / 天气 API 接入
- [ ] 后台管理系统

### Web 端
- [ ] 运营管理功能完善

---

## 十、当前主要风险

| 风险 | 影响 | 缓解 |
|------|------|------|
| 无 WX_APPID/WX_SECRET | 登录不可用 | 501 友好提示，公开功能不受影响 |
| 无 LLM_API_KEY | AI 回答功能弱 | 本地规则降级 |
| 无 WEATHER_API_KEY | 天气不可用 | 501 友好提示 |
| 小程序字段映射未验证 | 联调数据不匹配 | docs/API_FRONTEND_FIELD_MAPPING.md 已记录 |

---

## 十一、不建议马上做的事情

1. 不要引入微服务（当前模块化单体足够）
2. 不要接真实 LLM/天气（骨架已就绪，等配置即可）
3. 不要做后台管理系统（等小程序主流程跑通）
4. 不要大规模重构小程序（逐批联调即可）
5. 不要改 tabBar 路径

---

## 十二、后续自动开发优先级

| 优先级 | 阶段 | 内容 |
|--------|------|------|
| 1 | PHASE-5-E | 景点/路线/图片/知识库公开接口联调 |
| 2 | PHASE-5-F | 行程保存/列表/详情联调 |
| 3 | PHASE-5-G | AI 助手/规划接口联调 |
| 4 | PHASE-5-H | 天气接口展示策略 |
| 5 | PHASE-5-I | 小程序全流程验收 |
| 6 | PHASE-6 | Web 后台管理 + 数据看板 |

---

## 十三、当前可继续的阶段

**PHASE-5-E**：景点/路线/图片/知识库公开接口联调（无需登录，风险最低）

---

## 十四、当前必须暂停确认的点

1. 中文提交规则已建立，后续所有 commit 必须使用中文
2. PHASE-5-E 需用户明确确认后才启动
3. 是否需要调整联调顺序（先接景点还是知识库？）
4. 是否需要灰度切换（逐页面从 mock → API？）
