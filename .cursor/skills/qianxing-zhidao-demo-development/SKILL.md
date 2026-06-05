---
name: qianxing-zhidao-demo-development
description: Guides development of the Qianxing Zhidao Guizhou mountain tourism AI guide demo. Use when building project pages, components, mock data, recommendation logic, demo flow, navigation, or Vue/Vite/Element Plus features for this repository.
---

# 黔行智导 Demo 开发

## 使用场景

当用户要求继续开发“黔行智导”、新增页面、完善 Demo 闭环、修改导航、补 Mock 数据、实现推荐逻辑或优化比赛展示 UI 时，使用本 skill。

## 项目定位

- 项目：贵州山地旅游 AI 个性化导览平台。
- 阶段：比赛前端 Demo 闭环，不接真实后端。
- 技术栈：Vue 3、`<script setup>`、TypeScript、Vite、Vue Router、Element Plus、CSS Variables/全局样式。
- 主流程：首页 → 兴趣选择 → 游客画像 → 路线推荐 → AI 导游问答 → 景点知识库。

## 开发前必须输出

```markdown
1. 本次目标：一句话描述
2. 涉及文件：新建/修改文件列表
3. 预期效果：完成后的用户可见效果
4. 验证方式：如何确认修改成功
```

等待用户回复“确认”或“继续”后再写代码。

## 当前代码状态

- 已有页面：`HomeView.vue`、`PlannerView.vue`、`ProfileView.vue`。
- 占位页面：`RouteRecommendView.vue`。
- 待建页面：`AiGuideView.vue`、`ScenicKnowledgeView.vue`、`ScenicDetailView.vue`、`AdminDashboardView.vue`、`DemoFlowView.vue`。
- 已有数据：10 个贵州景点、5 条路线、8 个兴趣标签、25 条知识库问答。
- 待整理：抽离 `components/layout/AppNavbar.vue`，移除 Vite 默认 `HelloWorld.vue`。

## 推荐开发顺序

1. 抽离 `AppNavbar.vue` 并改造 `App.vue` 布局。
2. 完善 `RouteRecommendView.vue`，基于画像和路线标签计算匹配度。
3. 开发 `AiGuideView.vue`，用知识库匹配模拟 AI 问答。
4. 开发 `ScenicKnowledgeView.vue` 与 `ScenicDetailView.vue`。
5. 开发 `AdminDashboardView.vue`，只用 Element Plus 组件模拟统计。
6. 开发 `DemoFlowView.vue`，串起一键演示流程。
7. 全流程联调、响应式和文案打磨。

## 实现约束

- 使用 `src/mock/index.ts` 的异步函数取数据。
- 新数据结构先补 `src/types`，再补 `src/mock`。
- 不新增复杂依赖；禁止地图 SDK、真实 AI API、后端接口、数据库、ECharts。
- 推荐逻辑用可解释规则：标签匹配、天数接近、体力等级、同行人群、预算文案。
- 页面文案必须正式、有比赛展示感，不写 TODO、test、Lorem 或“敬请期待”。

## UI 规范

- 色彩：翠绿 `#1f8f5f`、科技蓝 `#2f6bff`、暖橙 `#e67e22`、浅绿灰背景 `#f4f8f5`。
- 风格：毛玻璃卡片、渐变光影、圆角 12-30px、清晰信息层级。
- 布局：内容最大宽度 1280px，900px 移动端断点。
- 优先复用已有首页、Planner、Profile 的视觉语言。

## 验证清单

- `npm run build` 通过，或至少确认 `npm run dev` 页面可访问。
- 路由可跳转，刷新后不白屏。
- 本次页面与上一页、下一页有明确按钮连接。
- 控制台无明显错误，TypeScript 类型无明显错误。
- 交互数据可从 localStorage 或 Mock 数据闭环传递。
