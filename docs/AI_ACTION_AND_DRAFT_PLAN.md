# 黔行智导 · AI 页面动作协议与 Redis 线路草稿方案

> 版本：1.0 | 2026-06-18 | 方案设计阶段（不实现）

---

## 一、当前 AI 返回结构现状

```json
{
  "answer": "自然语言",
  "outOfScope": false,
  "confidence": 0.9,
  "suggestedActions": ["查看景点详情", "规划我的行程"]
}
```

**问题：** `suggestedActions` 仅为字符串数组，前端无法区分跳转类型，无结构化参数（page/params/id）。pom.xml 无 Redis 依赖。guide.wxml 当前为纯文本气泡，无按钮渲染。

---

## 二、为什么需要 action 协议

| 现状 | 目标 |
|------|------|
| AI 只能返回文字 | AI 返回可点击跳转按钮 |
| 用户需手动找详情 | AI 直接给出"查看景点详情"按钮 |
| 规划结果看完就没了 | 预览草稿 → 确认保存 → 写入行程 |

---

## 三、action 协议字段设计

升级 `suggestedActions: string[]` → `actions: Action[]`。

后端 Java record 定义：

```java
public record AiAction(
    String type,               // "navigate" | "create_ai_plan" | "confirm_save"
    String label,              // "查看景点详情"
    String description,        // 简短介绍
    String page,               // 仅 navigate: 小程序页面路径
    Map<String, Object> params // 仅 navigate: 页面参数
) {}
```

**navigate 示例：**

```json
{
  "type": "navigate",
  "label": "查看景点详情",
  "description": "了解黄果树瀑布的游玩亮点和注意事项",
  "page": "/pages/scenic-detail/scenic-detail",
  "params": { "id": "huangguoshu" }
}
```

**安全约束：** action 不由大模型直接生成，大模型只建议文字内容。所有 action 由后端代码根据数据库查询结果构造和校验。page 走白名单，params 从数据库 ID 填充。

---

## 四、页面跳转白名单

| page | tabBar | 跳转方式 |
|------|--------|---------|
| `/pages/scenic-detail/scenic-detail` | 否 | wx.navigateTo |
| `/pages/route-detail/route-detail` | 否 | wx.navigateTo |
| `/pages/trip-detail/trip-detail` | 否 | wx.navigateTo |
| `/pages/knowledge/knowledge` | 否 | wx.navigateTo |
| `/pages/ai-plan-preview/ai-plan-preview` | 否（新增） | wx.navigateTo |
| `/pages/index/index` | 是 | wx.switchTab |
| `/pages/guide/guide` | 是 | wx.switchTab |
| `/pages/my-trips/my-trips` | 是 | wx.switchTab |

---

## 五、AI 线路草稿结构

```json
{
  "draftId": "draft_20260618_a1b2c3",
  "title": "贵州三日自然风光与民族文化轻松游",
  "summary": "适合节奏轻松、以贵阳为起点，覆盖黄果树、小七孔、西江苗寨。",
  "source": "ai_draft",
  "expiresInSeconds": 3600,
  "days": [
    {
      "dayIndex": 1, "theme": "贵阳抵达与城市文化体验",
      "items": [
        { "timeRange": "上午", "title": "抵达贵阳", "description": "先适应节奏", "scenicId": 5, "scenicName": "青岩古镇", "tips": ["轻装出行"] }
      ]
    }
  ],
  "recommendedScenicIds": [1, 2, 3, 5],
  "recommendedRouteIds": [1],
  "actions": [
    { "type": "confirm_save", "label": "保存到我的行程" },
    { "type": "navigate", "label": "查看相关路线", "page": "/pages/route-detail/route-detail", "params": { "id": "route-1" } }
  ]
}
```

---

## 六、Redis key 设计

| 项 | 值 |
|-----|-----|
| Key 格式 | `qx:ai-plan-draft:{userId}:{draftId}` |
| Value | 完整草稿 JSON（不含 token/openid/key） |
| TTL | 3600 秒（默认，可配置） |

---

## 七、Redis TTL 建议

| 场景 | TTL |
|------|-----|
| MVP 默认 | 3600 秒 |
| 用户预览中 | GET 接口可重置 TTL |
| 环境变量 | `AI_PLAN_DRAFT_TTL_SECONDS=3600` |

---

## 八、后端接口设计

### 1. 生成 AI 草稿

```
POST /api/app/ai/plan-drafts  (Authorization: Bearer)
Body: { days, departureCity, interests, pace, budget, peopleCount, specialNeeds }
→ 大模型生成 → 结构化 → 写 Redis → 返回 { draftId, title, summary, days, actions }
```

### 2. 获取草稿

```
GET /api/app/ai/plan-drafts/{draftId}  (Authorization: Bearer)
→ 从 Redis key qx:ai-plan-draft:{userId}:{draftId} 读取，不存在返回 404
```

### 3. 确认保存

```
POST /api/app/ai/plan-drafts/{draftId}/confirm  (Authorization: Bearer)
→ Redis 读取草稿 → 校验 → 调用 TripService.createTrip → 写正式行程 → 删 Redis → 返回 tripId
```

---

## 九、小程序改动设计

guide.js 新增 `_executeAction(action)`：根据 type 执行 navigate/API调用。guide.wxml 新增 action 按钮区域。

可选新增 `pages/ai-plan-preview/ai-plan-preview` 预览页展示草稿详情。

---

## 十、与现有 trip 的关系

| 路径 | 接口 |
|------|------|
| route-detail 手动保存 | POST /api/app/trips |
| AI 草稿确认保存 | POST /api/app/ai/plan-drafts/{id}/confirm → 内部复用 TripService |

两种路径保存的行程在同一列表、同一详情页。不破坏原有保存能力。

---

## 十一、Redis 依赖

当前 pom.xml 无 Redis。实现时需添加 `spring-boot-starter-data-redis`。

新增环境变量：`REDIS_HOST`、`REDIS_PORT`、`REDIS_PASSWORD`、`REDIS_DATABASE`、`AI_PLAN_DRAFT_TTL_SECONDS`。

---

## 十二、安全

| 风险 | 防护 |
|------|------|
| 跨用户访问草稿 | Redis key 绑定 userId |
| 草稿过期后保存 | Redis 读不到 → 400 "草稿已失效" |
| 大模型输出不可信 | 后端代码构造 action，LLM 不直接参与 |
| 任意页面跳转 | page 白名单校验 |

---

## 十三、推荐实施拆分

| 阶段 | 内容 | 量级 |
|------|------|------|
| 5G-3A | 后端 AiAction record + buildChatResult 升级 | 小 |
| 5G-3B | 小程序 action 按钮渲染 | 小 |
| 5G-3C | Redis 依赖 + 配置 + 草稿读写 | 中 |
| 5G-3D | AI 草稿生成接口 | 中 |
| 5G-3E | 草稿确认保存 → TripService | 小 |
| 5G-3F | ai-plan-preview 页面（可选） | 中 |
