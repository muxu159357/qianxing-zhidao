# 黔行智导 · 后端API总览

> 2026-06-19 | 17 Controllers | 80+ Endpoints

## 公开 (16)
`/api/health` `/api/health/config` `/api/app/home/summary` `/api/app/search`
`/api/app/scenic/spots` `/api/app/scenic/spots/{id}` `/api/app/scenic/cities` `/api/app/scenic/categories`
`/api/app/routes` `/api/app/routes/{id}` `/api/app/routes/recommend` `/api/app/routes/{id}/days` `/api/app/routes/{id}/spots`
`/api/app/media/assets` `/api/app/knowledge/articles` `/api/app/knowledge/search` `/api/app/knowledge/relations`
`/api/app/weather/scenic/{id}`

## 需登录 (18)
`/api/app/auth/wechat-login` `/api/app/user/me`
`/api/app/trips` CRUD + `/days` `/safety-items` `/review`
`/api/app/ai/chat` `/api/app/ai/plans`
`/api/app/ai/plan-drafts` + `/{id}` + `/{id}/confirm`

## 后台管理 (50+)
### 看板 `/api/admin/dashboard/stats`
### 景点 `/api/admin/scenic/spots` CRUD + `/{id}/status`
### 路线 `/api/admin/routes` CRUD + `/{id}/status` + `/{id}/days` + `/{id}/spots`
### 知识库 `/api/admin/knowledge/articles` CRUD + `/{id}/status`
### 媒体 `/api/admin/media/assets` CRUD
### 天气 `/api/admin/weather/locations` CRUD
### 行程 `/api/admin/trips` 查看
### AI记录 `/api/admin/ai/plans` 查看
### 安全清单 `/api/admin/trips/{id}/safety-items` 查看
