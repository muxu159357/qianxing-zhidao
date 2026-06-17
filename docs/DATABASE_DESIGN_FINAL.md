# 黔行智导 · 数据库设计定稿

> Version: 2.1 | DB: MySQL 8.0+ | Charset: utf8mb4
> 前身：docs/DATABASE.md (v1.0, PostgreSQL) — 已废弃
> 本文件为 PHASE-4-A-DB-REVISED 定稿

## 数据库环境

| 项目 | 值 |
|------|-----|
| 数据库名 | `qianxing_zhidao` |
| JDBC URL | `jdbc:mysql://localhost:3306/qianxing_zhidao?...` |
| 账号 | `${DB_USERNAME:root}` (环境变量) |
| 密码 | `${DB_PASSWORD:}` (环境变量，不提交 Git) |
| 状态 | **数据库尚未创建，由用户手动执行 SQL** |
| 本阶段 | 禁止自动执行 SQL，禁止连接数据库 |

---

## 设计原则

1. **15 张表覆盖全部小程序业务**，每表只存核心字段
2. **逻辑外键 + 索引**，不使用数据库强制外键约束
3. **用户行程快照策略**：保存时从路线模板复制，后续独立演化
4. **图片资产独立表**，biz_type + biz_id 泛化关联
5. **AI 规划可追溯**，记录请求→响应→采纳全链路
6. **知识库支持多对多关联**

---

## 表清单

| # | 表名 | 用途 |
|---|------|------|
| 1 | qx_user | 用户基础信息 |
| 2 | qx_scenic_spot | 景点主数据 |
| 3 | qx_route | 路线模板 |
| 4 | qx_route_day | 路线每日安排 |
| 5 | qx_route_spot | 路线-景点关联（含顺序） |
| 6 | qx_media_asset | 图片资产统一管理 |
| 7 | qx_user_trip | 用户行程（快照） |
| 8 | qx_user_trip_day | 用户行程每日安排 |
| 9 | qx_user_trip_spot | 用户行程景点 |
| 10 | qx_trip_safety_item | 行程安全清单 |
| 11 | qx_trip_review | 行程复盘评价 |
| 12 | qx_ai_plan_request | AI 规划请求 |
| 13 | qx_ai_plan_result | AI 规划结果 |
| 14 | qx_knowledge_article | 知识库文章 |
| 15 | qx_knowledge_relation | 知识库关联关系 |

---

## 核心关系

```
qx_scenic_spot ──< qx_route_spot >── qx_route ──< qx_route_day
       │                                   │
       │                              (快照复制)
       │                                   ▼
       │                             qx_user_trip ──< qx_user_trip_day
       │                                   │              │
  qx_media_asset                     qx_user_trip_spot  qx_trip_safety_item
  (biz_type+biz_id)                        │
       │                             qx_trip_review
       │
qx_knowledge_article >── qx_knowledge_relation
       │
qx_ai_plan_request ──< qx_ai_plan_result
```

### 路线模板 vs 用户行程

- **qx_route** = 平台路线模板（管理员维护）
- **qx_user_trip** = 用户保存后的副本（独立编辑，不影响模板）
- 保存时从 qx_route + qx_route_day + qx_route_spot 复制快照
- `qx_user_trip.route_id` → `qx_route.id`（逻辑外键，可空）

### 图片资产泛化关联

- `qx_media_asset.(biz_type, biz_id)` 关联任意业务实体
- biz_type: scenic / route / theme / user_trip / knowledge
- asset_type: cover / thumb / gallery / fallback

---

## 表结构

### 1. qx_user

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| openid | VARCHAR(64) UNIQUE NOT NULL | 微信 openid |
| unionid | VARCHAR(64) DEFAULT NULL | 微信unionid(预留) |
| nickname | VARCHAR(64) | 微信昵称 |
| avatar_url | VARCHAR(512) | 头像 |
| phone | VARCHAR(20) | 手机号 |
| status | TINYINT DEFAULT 1 | 1=正常 0=禁用 |
| deleted | TINYINT DEFAULT 0 | |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

索引：openid, unionid, status

### 2. qx_scenic_spot

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| spot_code | VARCHAR(32) UNIQUE NOT NULL | 编码 huangguoshu |
| name | VARCHAR(100) NOT NULL | 景点名称 |
| city | VARCHAR(50) NOT NULL | 城市 |
| region_code | VARCHAR(6) | 行政区划 |
| category | VARCHAR(20) NOT NULL | 分类 |
| rating | DECIMAL(2,1) DEFAULT 0 | 评分 1-5 |
| ticket_price | INT DEFAULT 0 | 门票(分) 0=免费 |
| visit_duration | VARCHAR(20) | 建议时长 |
| best_season | VARCHAR(50) | 最佳季节 |
| description | TEXT | 简介 |
| highlights | JSON | 亮点列表 |
| tips | JSON | 旅行贴士 |
| tags | JSON | 标签 |
| latitude | DECIMAL(10,7) | 纬度 |
| longitude | DECIMAL(10,7) | 经度 |
| sort_order | INT DEFAULT 0 | |
| status | TINYINT DEFAULT 1 | 1=发布 0=下架 |
| deleted | TINYINT DEFAULT 0 | |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

索引：spot_code, city, category, status, region_code

### 3. qx_route

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| route_code | VARCHAR(32) UNIQUE NOT NULL | route-1 |
| name | VARCHAR(128) NOT NULL | |
| description | TEXT | |
| day_count | INT NOT NULL DEFAULT 1 | |
| energy_level | VARCHAR(8) NOT NULL | 轻松/适中/挑战 |
| budget_range | VARCHAR(32) | |
| suitable_crowd | JSON | |
| tags | JSON | |
| theme | VARCHAR(32) | waterfall/mountain/village/cave/ancient-town/forest/culture |
| cover_image | VARCHAR(512) | 封面图 URL |
| sort_order | INT DEFAULT 0 | |
| status | TINYINT DEFAULT 1 | |
| deleted | TINYINT DEFAULT 0 | |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

索引：route_code, energy_level, theme, status

### 4. qx_route_day

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| route_id | BIGINT NOT NULL | → qx_route.id |
| day_number | INT NOT NULL | 第几天 |
| title | VARCHAR(128) NOT NULL | |
| description | TEXT | |
| meals | VARCHAR(256) | |
| accommodation | VARCHAR(256) | |
| sort_order | INT DEFAULT 0 | |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

索引：route_id, (route_id, day_number) UNIQUE

### 5. qx_route_spot

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| route_day_id | BIGINT NOT NULL | → qx_route_day.id |
| route_id | BIGINT NOT NULL | 冗余 |
| scenic_spot_id | BIGINT NOT NULL | → qx_scenic_spot.id |
| spot_order | INT DEFAULT 0 | 游玩顺序 |
| stay_duration | VARCHAR(20) | 建议停留 |
| visit_tip | VARCHAR(256) | 游玩建议 |
| created_at | DATETIME DEFAULT NOW() | |

索引：route_day_id, route_id, scenic_spot_id

### 6. qx_media_asset

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| biz_type | VARCHAR(20) NOT NULL | scenic/route/theme/user_trip/knowledge |
| biz_id | BIGINT NOT NULL | |
| asset_type | VARCHAR(20) NOT NULL | cover/thumb/gallery/fallback |
| url | VARCHAR(512) NOT NULL | |
| thumb_url | VARCHAR(512) | |
| source | VARCHAR(128) | 图片来源 |
| credit | VARCHAR(128) | 署名 |
| license | VARCHAR(128) | 授权 |
| width | INT | 宽(px) |
| height | INT | 高(px) |
| file_size | INT | 字节数 |
| sort_order | INT DEFAULT 0 | |
| status | TINYINT DEFAULT 1 | |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

索引：(biz_type, biz_id), asset_type, (biz_type, biz_id, sort_order)

### 7. qx_user_trip

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| user_id | BIGINT NOT NULL | → qx_user.id |
| route_id | BIGINT | → qx_route.id (可空) |
| route_name | VARCHAR(128) NOT NULL | 快照 |
| custom_name | VARCHAR(64) | 用户自定义 |
| status | VARCHAR(16) NOT NULL DEFAULT 'upcoming' | upcoming/active/completed |
| day_count | INT DEFAULT 1 | |
| energy_level | VARCHAR(8) | |
| travel_start_date | DATE | |
| travel_end_date | DATE | |
| route_snapshot_json | JSON | 保存时路线模板/AI生成路线的完整快照 |
| plan_snapshot_json | JSON | 保存时完整日程计划快照(dayPlans+spots) |
| ai_result_id | BIGINT | → qx_ai_plan_result.id (若来自AI规划) |
| started_at | DATETIME | |
| completed_at | DATETIME | |
| deleted | TINYINT DEFAULT 0 | |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

索引：user_id, route_id, status, ai_result_id, created_at DESC

### 8. qx_user_trip_day

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| trip_id | BIGINT NOT NULL | → qx_user_trip.id |
| day_number | INT NOT NULL | |
| title | VARCHAR(128) NOT NULL | |
| description | TEXT | |
| meals | VARCHAR(256) | |
| accommodation | VARCHAR(256) | |
| is_edited | TINYINT DEFAULT 0 | |
| sort_order | INT DEFAULT 0 | |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

索引：trip_id, (trip_id, day_number) UNIQUE

### 9. qx_user_trip_spot

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| trip_day_id | BIGINT NOT NULL | → qx_user_trip_day.id |
| trip_id | BIGINT NOT NULL | 冗余 |
| scenic_spot_id | BIGINT | → qx_scenic_spot.id |
| spot_name | VARCHAR(100) NOT NULL | 快照 |
| spot_order | INT DEFAULT 0 | |
| created_at | DATETIME DEFAULT NOW() | |

索引：trip_day_id, trip_id

### 10. qx_trip_safety_item

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| trip_id | BIGINT NOT NULL | → qx_user_trip.id |
| item_text | VARCHAR(256) NOT NULL | |
| is_checked | TINYINT DEFAULT 0 | |
| sort_order | INT DEFAULT 0 | |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

索引：trip_id

### 11. qx_trip_review

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| trip_id | BIGINT UNIQUE NOT NULL | → qx_user_trip.id |
| rating | TINYINT DEFAULT 0 | 1-5 |
| highlights | VARCHAR(500) | 亮点 |
| regrets | VARCHAR(500) | 遗憾 |
| next_advice | VARCHAR(500) | 下次建议 |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

索引：trip_id UNIQUE

### 12. qx_ai_plan_request

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| user_id | BIGINT | → qx_user.id |
| session_id | VARCHAR(64) | |
| input_tags | JSON | 兴趣标签 |
| input_days | INT | |
| input_budget | VARCHAR(32) | |
| input_crowd | VARCHAR(32) | |
| input_energy | VARCHAR(8) | |
| input_pace | VARCHAR(8) | |
| input_json | JSON | 完整用户输入JSON |
| profile_json | JSON | 完整画像结果JSON |
| context_json | JSON | 多轮规划上下文(预留) |
| status | VARCHAR(16) DEFAULT 'pending' | pending/processing/completed/failed |
| error_message | TEXT | |
| elapsed_ms | INT | 耗时(毫秒) |
| created_at | DATETIME DEFAULT NOW() | |

索引：user_id, status, session_id

### 13. qx_ai_plan_result

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| request_id | BIGINT NOT NULL | → qx_ai_plan_request.id |
| route_name | VARCHAR(128) | AI 生成名称 |
| route_json | JSON | 小程序可渲染的路线结构 |
| raw_result_json | JSON | 模型原始返回JSON(用于复盘) |
| normalized_result_json | JSON | 后端清洗后的结构化结果 |
| error_json | JSON | 失败时保存完整错误上下文 |
| adopted_trip_id | BIGINT | → qx_user_trip.id (采纳后) |
| is_adopted | TINYINT DEFAULT 0 | |
| model_name | VARCHAR(64) | 预留 |
| prompt_tokens | INT | 预留 |
| completion_tokens | INT | 预留 |
| elapsed_ms | INT | AI调用耗时(毫秒) |
| created_at | DATETIME DEFAULT NOW() | |

索引：request_id, is_adopted, adopted_trip_id

### 14. qx_knowledge_article

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| article_code | VARCHAR(32) UNIQUE NOT NULL | k1 |
| question | VARCHAR(256) NOT NULL | |
| answer | TEXT NOT NULL | |
| category | VARCHAR(20) NOT NULL | |
| sort_order | INT DEFAULT 0 | |
| status | TINYINT DEFAULT 1 | |
| deleted | TINYINT DEFAULT 0 | |
| created_at | DATETIME DEFAULT NOW() | |
| updated_at | DATETIME DEFAULT NOW() ON UPDATE | |

索引：article_code, category, status

### 15. qx_knowledge_relation

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT PK AUTO_INCREMENT | |
| article_id | BIGINT NOT NULL | → qx_knowledge_article.id |
| rel_type | VARCHAR(20) NOT NULL | scenic_spot/route/theme/safety/culture/tip |
| rel_id | BIGINT NOT NULL | |
| created_at | DATETIME DEFAULT NOW() | |

索引：article_id, (rel_type, rel_id)

---

## 版本

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-17 | 2.0 | PHASE-4-A 定稿，MySQL，15 张表 |
