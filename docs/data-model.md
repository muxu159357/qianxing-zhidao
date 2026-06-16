# 黔行智导 · 数据模型设计

## 概述

本文档定义全部核心实体及字段、关系和约束。同时服务小程序游客端和 Web 管理端。

## 1. 景点 (Attraction)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string(32) | Y | 主键, e.g. huangguoshu |
| name | string(64) | Y | 景点名称 |
| city | string(32) | Y | 所在城市 |
| category | string(16) | Y | scenic/transport/food/culture/tips |
| description | text | Y | 简介 |
| highlights | jsonb | N | 亮点列表 |
| tips | jsonb | N | 旅行贴士 |
| tags | jsonb | N | 标签 |
| imageUrl | string(512) | N | 图片URL |
| rating | float | N | 评分 1-5 |
| visitDuration | string(16) | N | 建议游览时长 |
| bestSeason | string(32) | N | 最佳季节 |
| ticketPrice | string(32) | N | 门票 |
| latitude | float | N | 纬度 |
| longitude | float | N | 经度 |
| createdAt | datetime | Y | 创建时间 |
| updatedAt | datetime | Y | 更新时间 |

## 2. 路线 (TourRoute)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string(32) | Y | 主键, e.g. route-1 |
| name | string(128) | Y | 路线名称 |
| description | text | Y | 路线描述 |
| dayCount | int | Y | 天数 |
| energyLevel | string(8) | Y | 轻松/适中/挑战 |
| budgetRange | string(16) | N | 预算范围 |
| suitableCrowd | jsonb | N | 适合人群 |
| tags | jsonb | N | 特色标签 |
| attractionIds | jsonb | Y | 景点ID序列 |
| dailyPlan | jsonb | Y | 每日安排 [{day,title,description,meals,accommodation}] |
| createdAt | datetime | Y | 创建时间 |
| updatedAt | datetime | Y | 更新时间 |

## 3. 知识库 (Knowledge)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string(32) | Y | 主键, e.g. k1 |
| question | string(256) | Y | 问题 |
| answer | text | Y | 回答 |
| category | string(16) | Y | scenic/transport/food/culture/tips |
| relatedAttractionIds | jsonb | N | 关联景点 |
| createdAt | datetime | Y | 创建时间 |
| updatedAt | datetime | Y | 更新时间 |

## 4. 行程 (UserTrip)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string(36) | Y | UUID |
| routeId | string(32) | Y | 关联路线ID |
| routeName | string(128) | Y | 路线名称(冗余) |
| customName | string(64) | N | 用户自定义名称 |
| status | string(16) | Y | upcoming/active/completed |
| dayCount | int | Y | 天数 |
| energyLevel | string(8) | Y | 体力等级 |
| spotIds | jsonb | Y | 景点ID列表 |
| spotNames | jsonb | Y | 景点名称列表 |
| dayPlans | jsonb | Y | 每日安排(含isEdited标记) |
| safetyChecklist | jsonb | N | 安全清单 [{id,text,checked}] |
| review | jsonb | N | {rating,highlights,regrets,nextAdvice} |
| travelStartDate | string(16) | N | 出行开始日期 |
| travelEndDate | string(16) | N | 出行结束日期 |
| startedAt | datetime | N | 开始行程时间 |
| completedAt | datetime | N | 完成行程时间 |
| createdAt | datetime | Y | 保存时间 |
| updatedAt | datetime | Y | 更新时间 |

## 5. 游客画像 (VisitorProfile)

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | string(36) | Y | UUID |
| interests | jsonb | Y | 兴趣标签ID列表 |
| days | int | Y | 出行天数 |
| budget | string(16) | Y | 预算 |
| crowd | string(16) | Y | 出行人群 |
| energyLevel | string(8) | Y | 体力偏好 |
| pace | string(8) | Y | 游览节奏 |
| createdAt | datetime | Y | 创建时间 |

## 约束

1. TourRoute.attractionIds 每个 ID 必须存在于 Attraction 表
2. UserTrip.routeId → TourRoute.id (逻辑外键, 路线删除后行程保留)
3. Knowledge.relatedAttractionIds → Attraction.id
4. UserTrip.status 流转: upcoming → active → completed (不可逆)

## 版本

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-17 | 1.0 | 5 个核心实体初始模型 |
