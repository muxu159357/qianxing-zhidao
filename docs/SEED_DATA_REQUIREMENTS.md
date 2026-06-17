# 黔行智导 · Seed 数据需求

> Version: 1.0 | 2026-06-17 | PHASE-5-A

## 一、当前状态

后端 API 返回空数据（数据库表存在但无业务数据）。需要从小程序现有 mock.js 提取数据并导入数据库。

## 二、数据提取策略

通过 Flyway V3 migration 执行 seed SQL，使用 INSERT IGNORE + 唯一 code 防重复。

### 防重复机制
- `qx_scenic_spot`: `spot_code` UNIQUE INDEX → INSERT IGNORE
- `qx_route`: `route_code` UNIQUE INDEX → INSERT IGNORE
- `qx_knowledge_article`: `article_code` UNIQUE INDEX → INSERT IGNORE
- `qx_media_asset`: 按 `biz_type + biz_id + asset_type` 判断

## 三、景点 Seed (10 条)

来源：`miniprogram/utils/mock.js` → `attractions` 数组

| spot_code | name | city | category | rating | price(分) |
|-----------|------|------|----------|--------|-----------|
| huangguoshu | 黄果树瀑布 | 安顺 | 自然风光 | 4.9 | 16000 |
| xiaoqikong | 荔波小七孔 | 黔南 | 自然风光 | 4.8 | 13000 |
| xijiang | 西江千户苗寨 | 黔东南 | 民族文化 | 4.7 | 9000 |
| fanjingshan | 梵净山 | 铜仁 | 自然风光 | 4.8 | 10000 |
| qingyan | 青岩古镇 | 贵阳 | 古镇历史 | 4.3 | 1000 |
| zhenyuan | 镇远古镇 | 黔东南 | 古镇历史 | 4.4 | 0 |
| zhaoxing | 肇兴侗寨 | 黔东南 | 民族文化 | 4.5 | 8000 |
| wanfenglin | 万峰林 | 黔西南 | 自然风光 | 4.6 | 7000 |
| zhijindong | 织金洞 | 毕节 | 户外探险 | 4.5 | 12000 |
| chishui | 赤水丹霞 | 遵义 | 自然风光 | 4.5 | 9000 |

## 四、路线 Seed (5 条)

来源：`miniprogram/utils/mock.js` → `routes` 数组

| route_code | name | day_count | energy_level | theme |
|------------|------|-----------|-------------|-------|
| route-1 | 黔中精华·黄荔西三日游 | 3 | 适中 | waterfall |
| route-2 | 黔东秘境·梵净山镇远三日游 | 3 | 挑战 | mountain |
| route-3 | 黔南风情·苗侗文化四日游 | 4 | 适中 | village |
| route-4 | 黔西探秘·织金赤水三日游 | 3 | 适中 | cave |
| route-5 | 贵阳周边·轻松二日游 | 2 | 轻松 | ancient-town |

## 五、路线每日安排 (25 条)

每条路线按 dailyPlan 数据生成 qx_route_day 记录。

## 六、路线景点关联

每条路线的 dailyPlan[].attractionIds 对应 qx_route_spot 记录。

## 七、知识库 Seed (7+ 条)

来源：`miniprogram/utils/mock.js` → `knowledgeBase` 数组

| article_code | category |
|-------------|----------|
| k1 | 景区介绍 |
| k2 | 美食推荐 |
| k3 | 交通出行 |
| k4 | 民族文化 |
| k5 | 避暑攻略 |
| k6 | 户外安全 |
| k7 | 摄影贴士 |

## 八、媒体资源 Seed

每个景点至少 1 条 cover 类型媒体（当前使用本地图片路径或 CSS 渐变占位）。

## 九、Flyway Migration 计划

```
V3__seed_business_data.sql
```

内容：
1. INSERT IGNORE 10 scenic spots
2. INSERT IGNORE 5 routes
3. INSERT IGNORE 25 route days
4. INSERT IGNORE route-spot associations
5. INSERT IGNORE 7 knowledge articles
6. INSERT IGNORE media assets

## 十、JSON 字段处理

对于 `highlights`, `tips`, `tags`, `suitableCrowd` 等 JSON 字段：
- MySQL 中存为 JSON 类型或 TEXT
- Java Entity 中存为 String（Jackson 序列化）
- Seed SQL 中使用 JSON_ARRAY() 或直接写 JSON 字符串
- 读取时 Java 返回 String，小程序端 JSON.parse
