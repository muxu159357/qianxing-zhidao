# 黔行智导 · 小程序前后端联调计划

> Version: 1.0 | 2026-06-17 | PHASE-5-A

## 一、差距分析总结

### 1.1 核心差距

| 差距类型 | 描述 | 影响范围 |
|---------|------|---------|
| 数据为空 | 后端 API 可访问但无业务数据 | 全部页面 |
| 字段命名 | 后端 camelCase vs 小程序 snake_case/简写 | 景点/路线/行程 |
| 数据分离 | 路线 dailyPlan 从嵌套改为独立端点 | 路线详情/推荐 |
| JSON 字段 | 后端 String 返回 vs 小程序 Array | 景点/路线 |
| ID 类型 | 后端 Long id vs 小程序 String code | 景点/路线/知识库 |
| 认证 | 小程序无 token 机制 | 行程/AI接口 |

### 1.2 数据流变化

```
当前： 页面 → mock.js (本地数据) → storage
目标： 页面 → api.js (请求封装) → 后端 API → 数据库
```

### 1.3 无需改变的功能

以下功能保持纯前端实现，不接后端：
- 游客画像生成（评分逻辑，后续阶段接入AI规划）
- 安全提醒规则（本地规则引擎）
- 体力等级/风险评分计算
- CSS 渐变生成
- 行程 score 打分（本地计算）

## 二、联调阶段

### PHASE-5-B：基础 Seed 数据
- 创建 V3 Flyway migration
- 插入景点、路线、每日安排、路线-景点关联、知识库、媒体资产
- 验证所有公开 API 返回非空数据
- 不改小程序代码

### PHASE-5-C：小程序 API 请求封装
- 创建 `miniprogram/utils/api.js`
- 封装 wx.request → 后端 API 调用
- 处理统一返回体 {code, message, data}
- 字段映射层（camelCase → 小程序字段名）
- 错误处理和 loading 状态
- 不改页面代码

### PHASE-5-D：登录与 Token 联调
- 小程序增加 token 存储机制
- 创建 auth.js 工具（login/getToken/isLoggedIn）
- 自动在请求头携带 Bearer token
- 处理 401 → 引导重新登录
- 不改页面展示逻辑

### PHASE-5-E：景点/路线/知识库/媒体联调
- 逐个页面切换数据源
- index → GET /api/app/routes + media
- scenic-detail → GET /api/app/scenic/spots/{id} + media
- knowledge → GET /api/app/knowledge/articles
- recommend → GET /api/app/routes/recommend
- route-detail → GET /api/app/routes/{id} + days + spots
- 每切换一个页面验证一次

### PHASE-5-F：行程保存/列表/详情联调
- route-detail 保存 → POST /api/app/trips
- my-trips 列表 → GET /api/app/trips
- trip-detail 详情 → GET /api/app/trips/{id}
- 行程更新/删除/每日安排/安全清单/复盘
- 全部需要登录态

### PHASE-5-G：AI 助手/规划联调
- guide 页面切换数据源（从 mock.knowledgeBase → API）
- AI 问答 → POST /api/app/ai/chat
- AI 规划 → POST /api/app/ai/plans
- 保留本地规则回答兼容性

### PHASE-5-H：天气接口联调
- 在 route-detail 安全区展示天气
- 天气 API 无数据时显示占位提示
- 天气刷新按钮（管理端预留）

### PHASE-5-I：全流程验收
- 14 步主流程走通
- 所有页面验证
- 错误场景覆盖
- 性能验证

## 三、API 封装设计（api.js）

```javascript
const BASE_URL = 'http://localhost:8080'

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('auth_token')
    wx.request({
      url: BASE_URL + path,
      header: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      ...options,
      success(res) {
        const body = res.data
        if (body.code === 0) resolve(body.data)
        else if (body.code === 401) { /* trigger re-login */ reject(body) }
        else reject(body)
      },
      fail(err) { reject(err) }
    })
  })
}

module.exports = { request, BASE_URL }
```

## 四、字段转换层设计

```javascript
// scenic-spot.js - 景点字段转换
function toScenicSpot(apiSpot) {
  return {
    id: apiSpot.spotCode || String(apiSpot.id),
    _dbId: apiSpot.id,
    name: apiSpot.name,
    city: apiSpot.city,
    category: apiSpot.category,
    rating: apiSpot.rating,
    price: apiSpot.ticketPrice,
    duration: apiSpot.visitDuration,
    description: apiSpot.description,
    highlights: parseJsonArray(apiSpot.highlights),
    tips: parseJsonArray(apiSpot.tips),
    tags: parseJsonArray(apiSpot.tags),
    imageUrl: apiSpot.imageUrl,
    latitude: apiSpot.latitude,
    longitude: apiSpot.longitude
  }
}
```

## 五、风险与回滚

- 每个联调阶段只改少量文件
- api.js 封装层统一处理字段映射
- 页面逐步切换数据源，保留 mock 回退能力
- 每阶段 commit，可逐阶段回滚
