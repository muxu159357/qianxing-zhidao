# 黔行智导 · API 接口文档

> 版本 2.0 | 2026-06-19 | 78 个端点

## 公开接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/health | 健康检查 |
| GET | /api/app/scenic/spots | 景点列表(分页/筛选) |
| GET | /api/app/scenic/spots/{id} | 景点详情 |
| GET | /api/app/routes | 路线列表(分页) |
| GET | /api/app/routes/{id} | 路线详情 |
| GET | /api/app/routes/{id}/days | 路线每日安排 |
| GET | /api/app/routes/{id}/spots | 路线景点关联 |
| GET | /api/app/routes/recommend | 路线推荐 |
| GET | /api/app/media/assets | 图片资产 |
| GET | /api/app/knowledge/articles | 知识库列表 |
| GET | /api/app/knowledge/articles/{id} | 知识详情 |
| GET | /api/app/knowledge/search | 知识搜索 |
| GET | /api/app/knowledge/relations | 知识关联 |
| GET | /api/app/weather/scenic/{scenicId} | 景区天气 |
| POST | /api/app/weather/scenic/{scenicId}/refresh | 刷新天气 |

## 登录接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/app/auth/wechat-login | 微信登录 |
| GET | /api/app/user/me | 当前用户 |
| POST | /api/app/trips | 保存行程 |
| GET | /api/app/trips | 行程列表 |
| GET | /api/app/trips/{id} | 行程详情 |
| PUT | /api/app/trips/{id} | 更新行程 |
| DELETE | /api/app/trips/{id} | 删除行程 |
| POST | /api/app/ai/chat | AI对话 |
| POST | /api/app/ai/plans | AI规划 |
| GET | /api/app/ai/plans/{id} | AI规划结果 |
| POST | /api/app/ai/plan-drafts | AI草稿生成 |
| GET | /api/app/ai/plan-drafts/{id} | 获取草稿 |
| POST | /api/app/ai/plan-drafts/{id}/confirm | 确认保存草稿 |

## 后台管理接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /api/admin/dashboard/stats | 数据看板 |
| GET/POST/PUT/DELETE | /api/admin/scenic/spots | 景点管理 |
| GET/POST/PUT/DELETE | /api/admin/routes | 路线管理 |
| GET/POST/PUT/DELETE | /api/admin/routes/{id}/days | 日程管理 |
| GET/POST/PUT/DELETE | /api/admin/knowledge/articles | 知识库管理 |
| GET/POST/PUT/DELETE | /api/admin/media/assets | 媒体管理 |
| GET/POST/PUT/DELETE | /api/admin/weather/locations | 天气配置 |
| GET | /api/admin/trips | 行程查看 |
| GET | /api/admin/ai/plans | AI记录 |

## 返回格式
```json
{"code":0,"message":"ok","data":{}}
```
分页：`{"records":[],"total":100,"page":1,"size":20}`
