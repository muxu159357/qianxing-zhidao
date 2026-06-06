# 黔行智导 — 数据库设计

> Version: 1.0 | DB: PostgreSQL 15+

---

## 设计原则

- **从简设计**：表不超过 10 张，每张表只存核心字段
- **查询效率优先**：常用查询字段建索引，JSONB 存灵活数据
- **读写分离**：景点/路线为读多写少，用户画像/行程为读写均衡
- **扩展预留**：关键字段用 JSONB 存扩展属性

---

## ER 图（逻辑）

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  users   │────<│  trips   │>────│  routes  │
└──────────┘     └──────────┘     └──────────┘
     │                                │
     │                           ┌────▼────┐
     └──────────────────────────>│ profiles │
                                 └──────────┘
┌──────────────┐             ┌──────────────┐
│ scenic_spots │<────────────│  route_spots  │
└──────────────┘    (关联)   └──────────────┘
     │
┌────▼─────────┐
│ knowledge_base│
└──────────────┘
```

---

## 表结构

### 1. `scenic_spots` — 景点表（核心）

```sql
CREATE TABLE scenic_spots (
  id          VARCHAR(32) PRIMARY KEY,           -- huangguoshu, xiaoxikong
  name        VARCHAR(100) NOT NULL,             -- 黄果树瀑布
  city        VARCHAR(50) NOT NULL,              -- 安顺市
  category    VARCHAR(20) NOT NULL,              -- 自然风光|民族文化|古镇历史|户外探险|美食特产|避暑康养
  rating      DECIMAL(2,1) DEFAULT 0,            -- 4.9
  price       INTEGER DEFAULT 0,                 -- 160（分，0=免费）
  duration    VARCHAR(20),                       -- 1天 / 半天-1天
  description TEXT,                              -- 详细描述
  highlights  JSONB DEFAULT '[]',                -- ["亚洲最大瀑布群","水帘洞穿行体验"]
  tips        TEXT,                              -- 游玩贴士
  tags        JSONB DEFAULT '[]',                -- ["自然风光","摄影打卡"]
  image_url   VARCHAR(500),                      -- 图片CDN URL
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_scenic_category ON scenic_spots(category);
CREATE INDEX idx_scenic_city ON scenic_spots(city);
CREATE INDEX idx_scenic_rating ON scenic_spots(rating DESC);
```

**行数预估:** 100-500（贵州全省景点）

---

### 2. `routes` — 路线表

```sql
CREATE TABLE routes (
  id             VARCHAR(32) PRIMARY KEY,        -- route-1
  name           VARCHAR(200) NOT NULL,          -- 黔中精华·黄荔西三日游
  days           INTEGER NOT NULL,               -- 3
  physical_level VARCHAR(10) DEFAULT '适中',     -- 轻松|适中|挑战
  budget_range   VARCHAR(20) DEFAULT '舒适型',   -- 经济型|舒适型|品质型
  suitable_for   JSONB DEFAULT '[]',             -- ["情侣/朋友","独自出行"]
  tags           JSONB DEFAULT '[]',             -- ["自然风光","民族文化"]
  description    TEXT,
  daily_plan     JSONB DEFAULT '[]',             -- 每日行程，见下方结构
  created_at     TIMESTAMP DEFAULT NOW(),
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- daily_plan JSONB 结构:
-- [
--   {
--     "day": 1,
--     "title": "黄果树瀑布",
--     "attractionIds": ["huangguoshu"],
--     "description": "上午游览陡坡塘...",
--     "meals": "早:自理 午:景区餐厅 晚:安顺酸汤鱼",
--     "accommodation": "安顺市区四星级酒店"
--   }
-- ]

-- 索引
CREATE INDEX idx_routes_days ON routes(days);
CREATE INDEX idx_routes_physical ON routes(physical_level);
```

**行数预估:** 20-200

---

### 3. `route_spots` — 路线-景点关联表

```sql
CREATE TABLE route_spots (
  id        SERIAL PRIMARY KEY,
  route_id  VARCHAR(32) NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  spot_id   VARCHAR(32) NOT NULL REFERENCES scenic_spots(id) ON DELETE CASCADE,
  day_order INTEGER DEFAULT 1,                   -- 在第几天，方便排序
  UNIQUE(route_id, spot_id)
);

CREATE INDEX idx_route_spots_route ON route_spots(route_id);
CREATE INDEX idx_route_spots_spot ON route_spots(spot_id);
```

> 注：也可不用此表，直接用 routes.daily_plan JSONB 中的 attractionIds 做关联查询。此表为可选优化，适合需要频繁"根据景点查路线"的场景。

---

### 4. `interest_tags` — 兴趣标签表

```sql
CREATE TABLE interest_tags (
  id       VARCHAR(32) PRIMARY KEY,              -- nature, culture
  name     VARCHAR(50) NOT NULL,                 -- 自然风光
  icon     VARCHAR(50),                          -- mountain
  category VARCHAR(20),                          -- 风景|文化|运动|生活|人群
  sort_order INTEGER DEFAULT 0
);
```

**预置数据（8条）：** 自然风光、民族文化、古镇历史、户外探险、美食特产、避暑康养、摄影打卡、亲子研学

---

### 5. `knowledge_base` — 知识库表

```sql
CREATE TABLE knowledge_base (
  id                    VARCHAR(32) PRIMARY KEY,  -- k1
  question              TEXT NOT NULL,            -- 黄果树瀑布最佳游览季节是什么时候？
  answer                TEXT NOT NULL,            -- 最佳季节是6月至10月...
  category              VARCHAR(20) NOT NULL,     -- 旅行贴士|美食推荐|交通出行|民族文化|景点介绍
  related_spot_ids      JSONB DEFAULT '[]',       -- ["huangguoshu"]
  created_at            TIMESTAMP DEFAULT NOW()
);

-- 全文搜索索引
CREATE INDEX idx_kb_category ON knowledge_base(category);
CREATE INDEX idx_kb_search ON knowledge_base USING gin(to_tsvector('chinese', question || ' ' || answer));
```

**行数预估:** 100-1000

---

### 6. `users` — 用户表

```sql
CREATE TABLE users (
  id            VARCHAR(64) PRIMARY KEY,         -- 微信 openid
  nickname      VARCHAR(100),
  avatar_url    VARCHAR(500),
  created_at    TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);
```

---

### 7. `visitor_profiles` — 游客画像表

```sql
CREATE TABLE visitor_profiles (
  id            SERIAL PRIMARY KEY,
  user_id       VARCHAR(64) NOT NULL REFERENCES users(id),
  selected_tags JSONB NOT NULL,                   -- ["nature","culture"]
  days          INTEGER NOT NULL,
  budget        VARCHAR(20),
  companion     VARCHAR(20),
  physical_level VARCHAR(10),
  pace          VARCHAR(10),
  profile_name  VARCHAR(200),                     -- AI生成的画像名称
  profile_data  JSONB,                            -- 完整画像JSON
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_profiles_user ON visitor_profiles(user_id);
CREATE INDEX idx_profiles_created ON visitor_profiles(created_at DESC);
```

---

### 8. `trips` — 用户行程表

```sql
CREATE TABLE trips (
  id          SERIAL PRIMARY KEY,
  user_id     VARCHAR(64) NOT NULL REFERENCES users(id),
  route_id    VARCHAR(32) NOT NULL REFERENCES routes(id),
  route_name  VARCHAR(200),                      -- 冗余字段加速查询
  status      VARCHAR(20) DEFAULT 'planned',     -- planned|active|completed
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_trips_created ON trips(created_at DESC);
```

---

### 9. `admin_users` — 管理员表

```sql
CREATE TABLE admin_users (
  id           SERIAL PRIMARY KEY,
  username     VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role         VARCHAR(20) DEFAULT 'editor',     -- admin|editor
  created_at   TIMESTAMP DEFAULT NOW()
);
```

---

## 关键查询性能分析

| 查询场景 | SQL | 索引 | 预期时间 |
|----------|-----|------|----------|
| 景点按分类筛选 | `WHERE category = '自然风光'` | `idx_scenic_category` | <1ms |
| 景点搜索 | `WHERE name ILIKE '%黄果%'` | 全表扫描（500行） | <5ms |
| 路线匹配（推荐引擎）| 内存计算路线标签匹配 | 无 | <10ms |
| 知识库全文搜索 | `to_tsvector` + `@@` | `idx_kb_search` GIN | <5ms |
| 用户行程列表 | `WHERE user_id = ? ORDER BY created_at` | `idx_trips_user` + `idx_trips_created` | <1ms |
| 数据看板统计 | `SELECT COUNT(*), category FROM scenic_spots GROUP BY category` | 全表 | <5ms |

---

## 数据库创建脚本（一键部署）

```sql
-- 初始化数据库
CREATE DATABASE qianxing_zhidao WITH ENCODING 'UTF8';

-- 预置数据
INSERT INTO interest_tags (id, name, icon, category, sort_order) VALUES
  ('nature', '自然风光', 'mountain', '风景', 1),
  ('culture', '民族文化', 'users', '文化', 2),
  ('history', '古镇历史', 'home', '文化', 3),
  ('adventure', '户外探险', 'compass', '运动', 4),
  ('food', '美食特产', 'food', '生活', 5),
  ('wellness', '避暑康养', 'cloud', '生活', 6),
  ('photo', '摄影打卡', 'camera', '兴趣', 7),
  ('family', '亲子研学', 'baby', '人群', 8);
```

---

## 设计总结

| 指标 | 数值 |
|------|------|
| 表数量 | 8 张 |
| 索引数量 | 12 个 |
| 核心表 | scenic_spots, routes, knowledge_base |
| 用户表 | users, visitor_profiles, trips |
| 管理表 | admin_users |
| 是否使用 JSONB | 是（highlights, tags, daily_plan, profile_data 灵活字段）|
| 全文搜索 | GIN 索引 + `to_tsvector('chinese', ...)` |
