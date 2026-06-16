# 黔行智导 · API 合同

## 统一响应格式

```json
{ "code": 0, "message": "ok", "data": {} }
```

错误码: 0=成功, 400=参数错误, 404=未找到, 500=服务错误

## 公共接口 /api/public

| Method | Path | Description |
|--------|------|-------------|
| GET | /attractions | 景点列表 (?category=&keyword=&page=) |
| GET | /attractions/{id} | 景点详情 |
| GET | /routes | 路线列表 |
| GET | /routes/{id} | 路线详情 |
| GET | /knowledge | 知识库 (?category=&keyword=) |
| GET | /interest-tags | 兴趣标签列表 |

## 游客端 /api/app

| Method | Path | Description |
|--------|------|-------------|
| POST | /profile | 生成游客画像 |
| POST | /recommend | 个性化路线推荐 |
| POST | /guide/chat | AI 伴游问答 |
| GET | /safety/{routeId} | 路线安全提醒 |
| GET | /trips | 行程列表 |
| POST | /trips | 保存行程 |
| GET | /trips/{id} | 行程详情 |
| PUT | /trips/{id} | 更新行程 (字段级patch) |
| DELETE | /trips/{id} | 删除行程 |

## 管理端 /api/admin

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | /attractions | 景点列表/新增 |
| PUT/DELETE | /attractions/{id} | 更新/删除景点 |
| GET/POST | /routes | 路线列表/新增 |
| PUT/DELETE | /routes/{id} | 更新/删除路线 |
| GET/POST | /knowledge | 知识库列表/新增 |
| PUT/DELETE | /knowledge/{id} | 更新/删除知识条目 |
| GET | /dashboard/stats | 数据看板 |

## 版本

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-17 | 1.0 | 24 个端点，三区划分 |
