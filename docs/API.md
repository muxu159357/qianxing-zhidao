# 黔行智导 — 后端接口对接文档

> Version: 1.0 | Date: 2026-06 | Team: Maxwell

---

## 1. 系统架构

```
┌──────────────┐  ┌──────────────┐
│ 微信小程序端  │  │  Web 管理端   │
│ (游客使用)    │  │ (后台+路演)   │
└──────┬───────┘  └──────┬───────┘
       │ REST API          │ REST API
       ▼                   ▼
┌──────────────────────────────────┐
│         API Gateway (Nginx)       │
└──────────────┬───────────────────┘
               │
       ┌───────▼───────┐
       │  应用服务层     │
       │  (Node.js/Go)  │
       ├───────────────┤
       │  LLM 服务      │
       │  RAG 知识库    │
       │  推荐引擎      │
       └───────┬───────┘
               │
       ┌───────▼───────┐
       │  PostgreSQL   │
       │  (主数据库)    │
       └───────────────┘
```

---

## 2. 通用规范

### 2.1 Base URL

```
开发环境: http://localhost:8080/api
生产环境: https://api.qianxing-zhidao.com/api
```

### 2.2 通用响应格式

```json
{
  "success": true,
  "data": {},
  "error": null,
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### 2.3 错误码

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 2.4 认证方式

```
Header: Authorization: Bearer <JWT_TOKEN>
```

游客端使用设备标识（小程序 openid），管理端使用 JWT token。

---

## 3. 接口清单

### 3.1 兴趣标签

#### `GET /api/interest-tags`

获取全部兴趣标签。

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "nature",
      "name": "自然风光",
      "icon": "mountain",
      "category": "风景"
    }
  ]
}
```

**对应:**
- 小程序: `planner.js` → `mock.getInterestTags()`
- Web: `PlannerView.vue` → `getInterestTags()`

---

#### `POST /api/visitor-profile/generate`

根据游客选择生成游客画像。

**Request:**
```json
{
  "selectedTagIds": ["nature", "culture", "food"],
  "days": 3,
  "budget": "舒适型",
  "companion": "情侣/朋友",
  "physicalLevel": "适中",
  "pace": "均衡"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profileName": "自然风光民族文化探索型游客",
    "dominantInterests": [
      { "tagId": "nature", "score": 95, "reason": "您对自然风光有浓厚兴趣" }
    ],
    "secondaryInterests": [
      { "tagId": "food", "score": 55, "reason": "补充偏好" }
    ],
    "matchSummary": "基于您在自然风光、民族文化方面的兴趣偏好...",
    "routeStyle": "探索发现型",
    "routeStyleDesc": "行程安排将优先匹配自然风光类景点..."
  }
}
```

**对应:**
- 小程序: `profile.js` → `mock.generateProfile()`
- Web: `ProfileView.vue` → `generateProfile()`

---

#### `POST /api/route-recommendations`

根据游客画像获取排序后的路线推荐。

**Request:** (同 visitor-profile/generate)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "route": {
        "id": "route-1",
        "name": "黔中精华·黄荔西三日游",
        "days": 3,
        "attractionIds": ["huangguoshu","xiaoxikong","xijiang"],
        "tags": ["自然风光","民族文化","摄影打卡"],
        "dailyPlan": [
          { "day": 1, "title": "黄果树瀑布", "description": "...", "meals": "...", "accommodation": "..." }
        ]
      },
      "score": 88,
      "reasons": ["自然风光偏好匹配", "体力等级一致"],
      "attractions": [ { /* Attraction */ } ]
    }
  ]
}
```

**对应:**
- 小程序: `recommend.js` → 内置排序逻辑
- Web: `RouteRecommendView.vue` → `getRankedRoutes()`

---

### 3.2 景点数据

#### `GET /api/scenic-spots`

获取所有景点（支持筛选）。

**Query Parameters:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 分类筛选 |
| city | string | 否 | 城市筛选 |
| keyword | string | 否 | 关键词搜索 |
| page | number | 否 | 页码，默认1 |
| limit | number | 否 | 每页条数，默认20 |

**Response:**
```json
{
  "success": true,
  "data": [ { /* Attraction */ } ],
  "meta": { "total": 10, "page": 1, "limit": 20 }
}
```

**对应:**
- 小程序: `knowledge.js` → `mock.getAttractions()`
- Web: `ScenicKnowledgeView.vue` → `getAttractions()`

---

#### `GET /api/scenic-spots/:id`

获取单个景点详情。

**Response:** `{ "success": true, "data": { /* Attraction */ } }`

**对应:**
- 小程序: `scenic-detail.js` → `mock.getAttractionById()`
- Web: `ScenicDetailView.vue` → `getAttractionById()`

---

### 3.3 知识库

#### `GET /api/knowledge-base`

获取知识库问答。

**Query Parameters:**
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| category | string | 否 | 分类筛选 |
| keyword | string | 否 | 搜索 |

**对应:**
- 小程序: `guide.js` → `mock.knowledgeBase`
- Web: `ScenicKnowledgeView.vue` → `getKnowledgeBase()`

---

### 3.4 AI 导游

#### `POST /api/ai-guide/chat`

AI 导游智能问答（接入 LLM + RAG）。

**Request:**
```json
{
  "message": "黄果树瀑布有什么看点？",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "routeId": "route-1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reply": "黄果树瀑布是亚洲第一大瀑布，核心看点包括...",
    "sources": [
      { "attractionId": "huangguoshu", "relevance": 0.92 }
    ]
  }
}
```

**对应:**
- 小程序: `guide.js` → 内置关键词匹配（Demo阶段）
- Web: `AiGuideView.vue` → 内置关键词匹配（Demo阶段）

> 生产环境接入通义千问/文心一言 + RAG 知识库检索

---

### 3.5 用户行程

#### `GET /api/user-trips`

获取用户保存的行程列表。

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "trip-1",
      "routeId": "route-1",
      "routeName": "黔中精华·黄荔西三日游",
      "selectedAt": "2026-06-15T10:30:00Z",
      "status": "planned"
    }
  ]
}
```

**对应:**
- 小程序: `my-trips.js` → `wx.getStorageSync('qianxing_trips')`

#### `POST /api/user-trips`

保存行程。

#### `DELETE /api/user-trips/:id`

删除行程。

---

### 3.6 后台管理

#### `GET /api/admin/dashboard/stats`

数据看板统计。

**Response:**
```json
{
  "success": true,
  "data": {
    "attractionCount": 10,
    "routeCount": 5,
    "knowledgeCount": 25,
    "dailyActiveUsers": 1280,
    "totalProfilesGenerated": 5620
  }
}
```

**对应:** `AdminDashboardView.vue`

---

#### `GET/POST/PUT/DELETE /api/admin/scenic-spots`

景点 CRUD 管理。

#### `GET/POST/PUT/DELETE /api/admin/routes`

路线 CRUD 管理。

---

## 4. 数据字段参考

### Attraction（景点）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| name | string | 景点名称 |
| city | string | 所在城市 |
| category | string | 分类（自然风光/民族文化/古镇历史/户外探险/美食特产/避暑康养）|
| tags | string[] | 标签 |
| rating | number | 评分（1-5）|
| price | number | 门票价格（0=免费）|
| duration | string | 建议游览时长 |
| description | string | 描述 |
| highlights | string[] | 核心亮点 |
| tips | string | 游玩贴士 |
| imageUrl | string? | 图片URL |
| imageGradient | string? | CSS渐变占位 |

### TourRoute（路线）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 唯一标识 |
| name | string | 路线名称 |
| days | number | 天数 |
| attractionIds | string[] | 包含景点ID列表 |
| suitableFor | string[] | 适合人群 |
| physicalLevel | string | 体力等级（轻松/适中/挑战）|
| budgetRange | string | 预算范围 |
| tags | string[] | 路线标签 |
| description | string | 路线描述 |
| dailyPlan | DailyPlan[] | 每日行程计划 |

### DailyPlan（每日行程）

| 字段 | 类型 | 说明 |
|------|------|------|
| day | number | 第几天 |
| title | string | 当日标题 |
| attractionIds | string[] | 当日景点 |
| description | string | 当日描述 |
| meals | string | 餐饮安排 |
| accommodation | string | 住宿安排 |

### VisitorSelection（游客选择）

| 字段 | 类型 | 说明 |
|------|------|------|
| selectedTagIds | string[] | 选中兴趣标签ID |
| days | number | 出行天数 |
| budget | string | 预算 |
| companion | string | 同行人群 |
| physicalLevel | string | 体力偏好 |
| pace | string | 旅游节奏 |

---

## 5. Demo 阶段 vs 生产环境对照

| 功能 | Demo（当前） | 生产环境 |
|------|-------------|----------|
| 兴趣标签 | Mock 数据 | `GET /api/interest-tags` |
| 游客画像 | 本地规则算法 | `POST /api/visitor-profile/generate`（LLM） |
| 路线推荐 | 本地打分排序 | `POST /api/route-recommendations`（推荐引擎） |
| AI 导游 | 关键词匹配 mock | `POST /api/ai-guide/chat`（LLM + RAG） |
| 知识库 | 本地数组 | `GET /api/knowledge-base`（PostgreSQL） |
| 景点数据 | Mock 10条 | `GET /api/scenic-spots` (DB CRUD) |
| 用户行程 | localStorage | `GET/POST /api/user-trips` |
| 用户认证 | 无 | JWT + 微信登录 |
| 后台管理 | 本地编辑 | `/api/admin/*` CRUD |
