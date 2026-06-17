# 黔行智导 · API 接口文档

> Version: 1.0 | 2026-06-17 | Phase 4 Complete

## 统一返回格式

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

| code | 说明 |
|------|------|
| 0 | 成功 |
| 400 | 业务错误/参数错误 |
| 401 | 未登录或登录失效 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 系统错误 |
| 501 | 能力未配置或暂未启用 |

## 接口总览

### 公开接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/health` | 健康检查 |
| POST | `/api/app/auth/wechat-login` | 微信登录 |
| GET | `/api/app/scenic/spots` | 景点列表 |
| GET | `/api/app/scenic/spots/{id}` | 景点详情 |
| GET | `/api/app/routes` | 路线列表 |
| GET | `/api/app/routes/{id}` | 路线详情 |
| GET | `/api/app/routes/{id}/days` | 路线每日安排 |
| GET | `/api/app/routes/{id}/spots` | 路线景点关联 |
| GET | `/api/app/routes/recommend` | 路线推荐 |
| GET | `/api/app/media/assets` | 图片资产列表 |
| GET | `/api/app/knowledge/articles` | 知识文章列表 |
| GET | `/api/app/knowledge/articles/{id}` | 知识文章详情 |
| GET | `/api/app/knowledge/search` | 知识库搜索 |
| GET | `/api/app/knowledge/relations` | 知识关联查询 |
| GET | `/api/app/weather/scenic/{scenicId}` | 景区天气 |
| POST | `/api/app/weather/refresh` | 刷新天气 |

### 登录接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/app/user/me` | 当前用户信息 |
| POST | `/api/app/trips` | 保存行程 |
| GET | `/api/app/trips` | 行程列表 |
| GET | `/api/app/trips/{id}` | 行程详情 |
| PUT | `/api/app/trips/{id}` | 更新行程 |
| DELETE | `/api/app/trips/{id}` | 删除行程 |
| GET | `/api/app/trips/{id}/days` | 行程每日安排 |
| PUT | `/api/app/trips/{id}/days/{dayId}` | 编辑每日安排 |
| GET | `/api/app/trips/{id}/safety-items` | 安全清单 |
| PUT | `/api/app/trips/{id}/safety-items/{itemId}` | 勾选安全项 |
| PUT | `/api/app/trips/{id}/review` | 行程复盘 |
| POST | `/api/app/ai/plans` | AI规划 |
| GET | `/api/app/ai/plans/{requestId}` | AI规划结果 |
| POST | `/api/app/ai/chat` | AI问答 |

## 请求鉴权

登录接口在请求头携带 JWT token：

```
Authorization: Bearer {token}
```

## 分页参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | int | 1 | 页码 |
| size | int | 10 | 每页条数 |

分页返回：

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "records": [],
    "total": 100,
    "page": 1,
    "size": 10
  }
}
```
