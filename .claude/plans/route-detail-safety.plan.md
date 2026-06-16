# Plan: 小程序路线详情页 + 安全守护模块

**复杂度**: Medium
**所属端**: 小程序端（游客主产品）

## Summary

新建 `pages/route-detail/route-detail` 独立路线详情页，集成安全守护能力（风险等级、体力提醒、山地路线提醒、错峰提醒、替代路线），修改推荐页和我的行程页的跳转路径，形成「推荐 → 详情 → 保存/伴游」的产品闭环。

## Files to Change

| File | Action | Why |
|---|---|---|
| `miniprogram/pages/route-detail/route-detail.js` | CREATE | 详情页逻辑 + 安全规则算法 |
| `miniprogram/pages/route-detail/route-detail.wxml` | CREATE | 详情页模板 |
| `miniprogram/pages/route-detail/route-detail.wxss` | CREATE | 详情页样式 |
| `miniprogram/pages/route-detail/route-detail.json` | CREATE | 页面配置 |
| `miniprogram/app.json` | UPDATE | 注册新页面 |
| `miniprogram/pages/recommend/recommend.wxml` | UPDATE | 按钮改为"查看路线详情" |
| `miniprogram/pages/recommend/recommend.js` | UPDATE | 跳转 route-detail 而非 guide |
| `miniprogram/pages/my-trips/my-trips.js` | UPDATE | 跳转路径修正为 route-detail |
