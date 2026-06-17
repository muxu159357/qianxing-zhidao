# 黔行智导 · API 前后端字段映射

> Version: 1.0 | 2026-06-17 | PHASE-5-A

## 一、映射说明

- **小程序字段** = 当前 mock.js 和小程序页面中使用的字段名
- **后端字段** = 后端 API JSON 响应中的字段名（Java camelCase）
- **兼容策略** = 如何处理字段不匹配

兼容策略有三种：
1. **后端适配**：改后端 Entity 或 Controller 适配小程序
2. **前端适配**：小程序加一层字段转换
3. **双端对齐**：两边都改一点，最终统一

本次 PHASE-5 优先采用**前端适配**策略，即在 `api.js` 封装层做字段转换，不改后端接口签名。

---

## 二、景点字段映射

| 小程序字段 | 后端字段 | 类型差异 | 适配方式 |
|-----------|---------|---------|---------|
| `id` | `id` / `spotCode` | String vs Long | 小程序 id 用后端 `spotCode`，后端 `id` 映射为 `_dbId` |
| `name` | `name` | — | 直接映射 |
| `city` | `city` | — | 直接映射 |
| `category` | `category` | — | 直接映射 |
| `rating` | `rating` | Number vs BigDecimal | 直接映射（JSON number） |
| `price` | `ticketPrice` | 改名 | 前端 `price` ← 后端 `ticketPrice` |
| `duration` | `visitDuration` | 改名 | 前端 `duration` ← 后端 `visitDuration` |
| `bestSeason` | — | 新增 | 后端已有字段 |
| `description` | `description` | — | 直接映射 |
| `highlights` | `highlights` | Array vs String | 后端存 JSON string，Java 返回 String，前端需 `JSON.parse` |
| `tips` | `tips` | Array vs String | 同上 |
| `tags` | `tags` | Array vs String | 同上 |
| `imageUrl` | 媒体接口获取 | 分离 | 通过 `/api/app/media/assets?bizType=scenic&bizId={id}` 获取 |
| `imageGradient` | — | 前端生成 | 前端根据图片主色生成 CSS 渐变（保留本地逻辑） |
| `latitude` | `latitude` | — | 后端已有 |
| `longitude` | `longitude` | — | 后端已有 |
| `icon` | — | 前端生成 | 保留本地 icon 映射 |

## 三、路线字段映射

| 小程序字段 | 后端字段 | 类型差异 | 适配方式 |
|-----------|---------|---------|---------|
| `id` | `id` / `routeCode` | String vs Long | 小程序 `id` 用后端 `routeCode` |
| `name` | `name` | — | 直接映射 |
| `description` | `description` | — | 直接映射 |
| `days` / `dayCount` | `dayCount` | 统一名称 | 前端统一用 `days`，从后端 `dayCount` 映射 |
| `physicalLevel` / `energyLevel` | `energyLevel` | 统一名称 | 前端统一用 `physicalLevel`，从后端 `energyLevel` 映射 |
| `budgetRange` | `budgetRange` | — | 直接映射 ✅ |
| `suitableFor` | `suitableCrowd` | Array vs String | 前端 `suitableFor` ← 解析后端 `suitableCrowd` |
| `tags` | `tags` | Array vs String | 前端解析 |
| `theme` | `theme` | — | 后端已有 |
| `coverImage` | `coverImage` | — | 直接映射 |
| `dailyPlan` | `/routes/{id}/days` 端点 | 嵌套 vs 分离 | 前端合并：先取 route，再取 days + spots |

## 四、路线每日安排字段映射

| 小程序字段 | 后端字段 | 适配方式 |
|-----------|---------|---------|
| `day` | `dayNumber` | 前端 `day` ← 后端 `dayNumber` |
| `title` | `title` | 直接映射 |
| `description` | `description` | 直接映射 |
| `meals` | `meals` | 直接映射 |
| `accommodation` | `accommodation` | 直接映射 |
| `attractionIds` | 通过 `routeSpots` 获取 | 结构重组 |

## 五、知识库字段映射

| 小程序字段 | 后端字段 | 适配方式 |
|-----------|---------|---------|
| `id` | `id` / `articleCode` | 小程序 `id` 用后端 `articleCode` |
| `question` | `question` | 直接映射 |
| `answer` | `answer` | 直接映射 |
| `category` | `category` | 直接映射 |
| `relatedAttractionIds` | 通过 `/knowledge/relations` 获取 | 单独查询关联 |

## 六、行程字段映射

| 小程序字段 | 后端字段 | 适配方式 |
|-----------|---------|---------|
| `id` | `id` | 后端 Long id |
| `routeId` | `routeId` | 直接映射 |
| `routeName` | `routeName` | 直接映射 |
| `customName` | `customName` | 直接映射 |
| `status` | `status` | 直接映射 |
| `days` / `dayCount` | `dayCount` | 统一映射 |
| `physicalLevel` / `energyLevel` | `energyLevel` | 统一映射 |
| `spotCount` | — | 前端计算（统计 day spots） |
| `spotNames` | — | 前端从 day spots 提取 |
| `spotIds` | — | 前端从 day spots 提取 |
| `dayPlans` | `/trips/{id}/days` 端点 | 单独查询 |
| `savedAt` | `createdAt` | 前端格式化 |
| `startedAt` | `startedAt` | 直接映射 |
| `completedAt` | `completedAt` | 直接映射 |
| `travelStartDate` | `travelStartDate` | 直接映射 |
| `travelEndDate` | `travelEndDate` | 直接映射 |
| `safetyChecklist` | `/trips/{id}/safety-items` 端点 | 单独查询 |
| `review` | `/trips/{id}/review` (PUT) | 单独端点 |
| `score` | — | 前端计算 |
| `routeSnapshotJson` | `routeSnapshotJson` | 后端 JSON string |
| `planSnapshotJson` | `planSnapshotJson` | 后端 JSON string |

## 七、安全清单字段映射

| 小程序字段 | 后端字段 | 适配方式 |
|-----------|---------|---------|
| `itemText` (content) | `itemText` | 直接映射 |
| `checked` (isChecked) | `isChecked` | 类型转换：int→boolean |
| `sortOrder` | `sortOrder` | 直接映射 |

## 八、复盘字段映射

| 小程序字段 | 后端字段 | 适配方式 |
|-----------|---------|---------|
| `rating` | `rating` | 直接映射 |
| `highlights` | `highlights` | 直接映射 |
| `regrets` | `regrets` | 直接映射 |
| `nextAdvice` | `nextAdvice` | 直接映射 |
| `updatedAt` | `updatedAt` | 直接映射 |
