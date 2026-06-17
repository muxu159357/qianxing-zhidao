# 黔行智导 · 前端→数据库字段映射表

> PHASE-4-A | 覆盖全部 storage key / mock 数据 / 页面展示字段

## storage → 数据库

| storage key | 来源 | 数据库表 | 数据库字段 | 后端返回 | 用户可改 |
|------------|------|---------|-----------|---------|---------|
| qianxing_selection.selectedTagIds | planner.js | qx_ai_plan_request | input_tags | Y | N |
| qianxing_selection.days | planner.js | qx_ai_plan_request | input_days | Y | N |
| qianxing_selection.budget | planner.js | qx_ai_plan_request | input_budget | Y | N |
| qianxing_selection.companion | planner.js | qx_ai_plan_request | input_crowd | Y | N |
| qianxing_selection.physicalLevel | planner.js | qx_ai_plan_request | input_energy | Y | N |
| qianxing_selection.pace | planner.js | qx_ai_plan_request | input_pace | Y | N |
| qianxing_profile | profile.js | qx_ai_plan_request | profile_json | Y | N |
| qianxing_trips | trip-storage.js | qx_user_trip + 子表 | 多表 | Y | Y |
| qianxing_selected_route | route-detail.js | — | 临时不持久化 | — | — |
| qianxing_pending_context | scenic/trip-detail | — | 临时不持久化 | — | — |
| qianxing_pending_question | knowledge.js | — | 临时不持久化 | — | — |

## 景点 (mock.js → qx_scenic_spot)

| 前端字段 | 数据库字段 | 类型 | 说明 |
|---------|-----------|------|------|
| id | spot_code | VARCHAR(32) | 前端字符串ID |
| name | name | VARCHAR(100) | |
| city | city | VARCHAR(50) | |
| category | category | VARCHAR(20) | |
| tags | tags | JSON | |
| rating | rating | DECIMAL(2,1) | |
| price | ticket_price | INT | 分→元转换 |
| duration | visit_duration | VARCHAR(20) | |
| description | description | TEXT | |
| highlights | highlights | JSON | |
| tips | tips | JSON | |
| imageUrl | qx_media_asset.url | VARCHAR(512) | biz_type=scenic |
| imageGradient | — | — | 仅前端CSS |
| bestSeason | best_season | VARCHAR(50) | |
| latitude/longitude | latitude/longitude | DECIMAL(10,7) | |

## 路线 (mock.js → qx_route + qx_route_day + qx_route_spot)

| 前端字段 | 数据库表 | 数据库字段 |
|---------|---------|-----------|
| route.id | qx_route | route_code |
| route.name | qx_route | name |
| route.description | qx_route | description |
| route.days | qx_route | day_count |
| route.physicalLevel | qx_route | energy_level |
| route.budgetRange | qx_route | budget_range |
| route.suitableFor | qx_route | suitable_crowd |
| route.tags | qx_route | tags |
| route.coverImage | qx_route | cover_image |
| route.dailyPlan[].day | qx_route_day | day_number |
| route.dailyPlan[].title | qx_route_day | title |
| route.dailyPlan[].description | qx_route_day | description |
| route.dailyPlan[].meals | qx_route_day | meals |
| route.dailyPlan[].accommodation | qx_route_day | accommodation |
| route.dailyPlan[].attractionIds | qx_route_spot | scenic_spot_id |

## 用户行程 (storage → qx_user_trip + 子表)

| 前端字段 | 数据库表 | 数据库字段 | 用户可改 |
|---------|---------|-----------|---------|
| trip.id | qx_user_trip | id | N |
| trip.routeId | qx_user_trip | route_id | N |
| trip.routeName | qx_user_trip | route_name | N |
| trip.customName | qx_user_trip | custom_name | Y |
| trip.status | qx_user_trip | status | Y |
| trip.dayCount | qx_user_trip | day_count | N |
| trip.energyLevel | qx_user_trip | energy_level | N |
| trip.spotIds | qx_user_trip_spot | scenic_spot_id | N |
| trip.spotNames | qx_user_trip_spot | spot_name | N |
| trip.travelStartDate | qx_user_trip | travel_start_date | Y |
| trip.travelEndDate | qx_user_trip | travel_end_date | Y |
| trip.startedAt | qx_user_trip | started_at | Y |
| trip.completedAt | qx_user_trip | completed_at | Y |
| dayPlans[].day | qx_user_trip_day | day_number | N |
| dayPlans[].title | qx_user_trip_day | title | Y |
| dayPlans[].description | qx_user_trip_day | description | Y |
| dayPlans[].meals | qx_user_trip_day | meals | Y |
| dayPlans[].accommodation | qx_user_trip_day | accommodation | Y |
| dayPlans[].isEdited | qx_user_trip_day | is_edited | N(系统) |
| safetyChecklist[].text | qx_trip_safety_item | item_text | N |
| safetyChecklist[].checked | qx_trip_safety_item | is_checked | Y |
| review.rating | qx_trip_review | rating | Y |
| review.highlights | qx_trip_review | highlights | Y |
| review.regrets | qx_trip_review | regrets | Y |
| review.nextAdvice | qx_trip_review | next_advice | Y |

## 知识库 (mock.js → qx_knowledge_article + qx_knowledge_relation)

| 前端字段 | 数据库表 | 数据库字段 |
|---------|---------|-----------|
| kb.id | qx_knowledge_article | article_code |
| kb.question | qx_knowledge_article | question |
| kb.answer | qx_knowledge_article | answer |
| kb.category | qx_knowledge_article | category |
| kb.relatedAttractionIds | qx_knowledge_relation | rel_id (rel_type='scenic_spot') |

## 图片资产 → qx_media_asset

| 前端资源 | biz_type | asset_type |
|---------|----------|-----------|
| attraction.imageUrl | scenic | cover |
| route.coverImage | route | cover |
| route-default.png | theme | fallback |
| scenic-default.png | theme | fallback |
| tabBar icons | theme | fallback |

## 版本

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-17 | 1.0 | PHASE-4-A 全套字段映射 |
