# 黔行智导 — 贵州山地旅游 AI 个性化导览平台

## 项目背景

- **赛事：** 2026年贵州省人工智能创业大赛
- **赛道：** 行业应用赛道 · 赛题三：围绕山地旅游游客兴趣建模与个性化导览
- **团队：** Maxwell
- **阶段：** 已有Demo（Vue 3 + Vite + Element Plus 首页）

## 项目定位

面向贵州山地旅游、智慧景区、乡村文旅、旅行社、民宿集群和地方文旅数字化管理场景，
基于大语言模型、RAG知识库、游客兴趣画像、个性化推荐算法和AI导游问答能力，
为游客提供个性化贵州旅游路线推荐、景点导览、智能问答和出行辅助服务。

## 当前技术栈

| 类别 | 选型 |
|------|------|
| 前端框架 | Vue 3 (Composition API + `<script setup>`) |
| 构建工具 | Vite 6 |
| 语言 | TypeScript 5 |
| UI组件库 | Element Plus 2 + @element-plus/icons-vue |
| 路由 | Vue Router 4 |
| 样式 | CSS Variables + 全局样式表 |
| 数据 | 本地 Mock 数据 + 规则推荐算法 |

## Demo阶段目标

**当前阶段只做前端可演示Demo闭环**，用于比赛报名、演示视频录制和PPT答辩。

- 不接入真实后端、数据库、地图API、大模型API
- 使用本地 Mock 数据和规则推荐算法
- 模拟 AI 问答交互
- 用 Element Plus 组件和纯 CSS 实现统计展示
- 统计展示使用 Element Plus 卡片、进度条、列表、Tag、Descriptions 等组件，**禁止引入 ECharts**
- **禁止引入地图 SDK、真实 AI API、后端接口、数据库等任何复杂外部依赖**
- 优先保证演示流程完整可跑通

## 核心模块清单

| # | 页面 | 文件名 | 路由 | 说明 |
|---|------|--------|------|------|
| 1 | 首页 | `HomeView.vue` | `/` | 品牌区、能力展示、CTA入口 |
| 2 | 游客兴趣选择页 | `PlannerView.vue` | `/planner` | 兴趣标签、出行天数、预算、人群 |
| 3 | 游客画像生成页 | `ProfileView.vue` | `/profile` | 画像雷达图/卡片展示 |
| 4 | 个性化路线推荐页 | `RouteRecommendView.vue` | `/recommend` | 路线卡片列表 + 详情 |
| 5 | AI智能导游页 | `AiGuideView.vue` | `/guide` | 模拟对话界面 |
| 6 | 景点知识库页 | `ScenicKnowledgeView.vue` | `/knowledge` | 景点列表 + 搜索/筛选 |
| 7 | 景点详情页 | `ScenicDetailView.vue` | `/scenic/:id` | 单景点详细信息 |
| 8 | 后台管理/数据看板页 | `AdminDashboardView.vue` | `/admin` | 景点CRUD + 数据统计 |
| 9 | Demo演示流程页 | `DemoFlowView.vue` | `/demo-flow` | 一键走完完整流程的引导页 |

## 开发优先级

### 第一阶段：Demo闭环（当前）

按以下顺序执行：

1. 创建类型定义 `src/types/` 和 Mock 数据层 `src/mock/`
2. 提取全局导航组件 `AppNavbar.vue`，改造 `App.vue` 布局
3. 开发 `PlannerView.vue`（游客兴趣选择页）
4. 打通首页"开始智能规划"按钮 → `/planner`
5. 开发 `ProfileView.vue`（画像生成）
6. 开发 `RouteRecommendView.vue`（路线推荐）
7. 开发 `AiGuideView.vue`（AI导游问答）
8. 开发 `ScenicKnowledgeView.vue` + `ScenicDetailView.vue`（知识库 + 详情）
9. 开发 `AdminDashboardView.vue`（后台管理 + 数据看板）
10. 开发 `DemoFlowView.vue`（一键演示流程）
11. 全流程联调 + UI美化

### 第二阶段：后端接入（比赛后）

- 接入后端 API
- 接入大模型 API（通义千问/文心一言）
- 接入 RAG 知识库
- 接入地图组件（高德/百度）

### 第三阶段：商业化（远期）

- 用户系统、支付系统、真实数据、性能优化

## 目录结构规范

```
src/
├── assets/                  # 静态资源
│   └── images/              # 图片（优先使用占位图）
├── components/
│   ├── layout/              # 布局组件
│   │   └── AppNavbar.vue    # 全局导航栏
│   ├── common/              # 通用组件
│   │   ├── FeatureCard.vue
│   │   ├── RouteCard.vue
│   │   ├── ScenicCard.vue
│   │   └── InterestTag.vue
│   └── charts/              # 图表组件（后续阶段）
├── composables/             # 组合式函数
├── mock/                    # Mock数据层
│   ├── attractions.ts       # 贵州景点数据
│   ├── routes.ts            # 推荐路线数据
│   ├── interests.ts         # 兴趣标签数据
│   ├── knowledge.ts         # 知识库问答数据
│   └── index.ts             # 统一导出 + 模拟异步
├── router/
│   └── index.ts             # 路由配置
├── styles/
│   ├── variables.css        # CSS变量
│   └── global.css           # 全局样式
├── types/                   # TypeScript类型
│   ├── attraction.ts
│   ├── route.ts
│   ├── interest.ts
│   └── index.ts
├── views/
│   ├── HomeView.vue
│   ├── PlannerView.vue
│   ├── ProfileView.vue
│   ├── RouteRecommendView.vue
│   ├── AiGuideView.vue
│   ├── ScenicKnowledgeView.vue
│   ├── ScenicDetailView.vue
│   ├── AdminDashboardView.vue
│   └── DemoFlowView.vue
├── App.vue
└── main.ts
```

## 命名规范

- **视图文件：** `XxxView.vue`（PascalCase + View后缀）
- **组件文件：** `XxxYyy.vue`（PascalCase，按功能分组到子目录）
- **类型文件：** `xxx.ts`（camelCase，按领域拆分）
- **Mock文件：** `xxx.ts`（camelCase，按领域拆分）
- **路由路径：** `/xxx` 或 `/xxx/:id`（kebab-case）
- **CSS类名：** `xxx-yyy`（kebab-case，BEM风格）
- **TypeScript接口：** 语义化命名（如 `Attraction`、`TourRoute`、`InterestTag`）
- **组合式函数：** `useXxx`（camelCase）

## 开发原则（禁止事项）

1. **禁止一次性大规模修改** — 每次只完成一个小步骤
2. **禁止破坏已运行的代码** — 每次修改后项目必须仍能 `npm run dev` 正常运行
3. **禁止引入复杂依赖** — 不接入真实后端、数据库、地图API、大模型API、ECharts等
4. **禁止占位符文案** — 所有文案必须正式、适合比赛展示，不允许出现 "Lorem ipsum"、"test"、"TODO" 等
5. **禁止普通旅游网站风格** — 页面要有专业感、科技感、文旅感、贵州地域特色
6. **禁止混用命令语法** — Windows环境优先使用PowerShell，不用bash管道写法
7. **禁止跳过类型定义** — 所有Mock数据和组件Props必须先有类型
8. **未经确认不写代码** — 每次开发必须先输出"本次开发计划、涉及文件、预期效果、验证方式"，经确认后方可修改代码
9. **一次只做一个页面/组件** — 不一次性大规模写多个页面，每步完成后验证再继续
10. **数据统计只用纯组件** — 禁止引入 ECharts，使用 Element Plus 卡片、进度条、Descriptions 列表模拟统计展示

## UI风格规范

### 色彩系统

| 用途 | 色值 | 说明 |
|------|------|------|
| 主色调 | `#1f8f5f`（翠绿） | 贵州山水绿 |
| 辅助色 | `#2f6bff`（科技蓝） | AI/科技感 |
| 背景色 | `#f4f8f5`（浅绿灰） | 全局背景 |
| 卡片背景 | `rgba(255,255,255,0.72)` | 半透明白 |
| 深色文字 | `#10251d` | 主标题 |
| 正文色 | `#4d5f6f` / `#5d6b7a` | 正文/描述 |
| 强调色 | `#e67e22`（暖橙） | 重点标注/苗族元素 |
| 渐变 | `linear-gradient(135deg, #1f8f5f, #2f6bff)` | Logo/品牌渐变 |

### 视觉风格关键词

- 科技感 + 文旅感 + 贵州地域特色
- 大留白、毛玻璃卡片、渐变光影
- 圆角（12-30px）
- 微妙的阴影和边框
- 字体：PingFang SC / Microsoft YaHei / Inter

### UI 设计铁律（Web + 小程序通用）

**以下规则适用于本项目所有前端开发，违反即视为不合格。**

#### 1. 动画强制使用 GSAP

所有页面入场动画、滚动触发动画、过渡动效必须使用 GSAP（GreenSock Animation Platform）：

- Web 端：`import gsap from 'gsap'`，已安装
- 小程序端：使用 `gsap` 的纯 JS 能力（或用小程序原生 `wx.createAnimation` 实现等效效果）
- 禁止使用 CSS `@keyframes` 作为主要动画手段（GSAP 性能更好、更可控）
- 每个页面至少要有入场动画（元素从下往上淡入）
- 卡片列表使用 stagger 依次出现
- 页面切换时有过渡动画

#### 2. 图片和视频优先，禁止 Emoji 图标

**优先级：真实图片/视频 > SVG 图标 > 纯文字**

- 景点展示：必须使用真实景点照片，禁止 Emoji 图标代替
- 品牌/氛围：Hero 区优先使用贵州实景照片或视频背景
- 功能图标：使用 Element Plus Icons（Web）或 SVG（小程序），禁止 Emoji（🧭🏞️🤖❌）
- 图片缺失时：使用 CSS 渐变占位 + 文字标签，**并立即向用户索要图片**
- 用户原话："需要图你找不到就找我要"
- 每个页面的图片需求必须在开发计划中列出
- 找不到的图片：先搜索 Unsplash/Pixabay/Wikimedia，找不到就向用户报告缺失清单

#### 3. 美观度标准

- 大留白、清晰的信息层级
- 卡片与背景有明确的视觉分离
- 字重对比明显（标题 700+ vs 正文 400）
- 色彩克制：主色 `#1f8f5f` + 辅色 `#2f6bff` + 暖橙 `#e67e22`，不引入第四种主题色
- 移动端按钮高度 ≥ 44px（符合 Apple HIG 触摸标准）
- 图片必须高清（≥ 1920px 宽度，小程序可降至 750px）

#### 4. 图片获取流程

```
需要图片 → 先搜索 Unsplash / Pixabay / Pexels
         → 找到了 → 下载到对应 assets 目录
         → 找不到 → 列出缺失清单，向用户索要
         → 用户提供 → 放入 assets 目录
```

### 页面布局规范

- 所有页面使用全局 `AppNavbar` 导航栏（从 `HomeView.vue` 提取，提取后首页视觉效果必须与当前一致）
- 内容区最大宽度 1280px，居中
- 响应式断点：900px（移动端）

## Mock数据规范

1. 景点数据必须基于贵州真实景点（黄果树瀑布、荔波小七孔、西江千户苗寨、梵净山、青岩古镇、镇远古镇、肇兴侗寨、万峰林、织金洞、赤水丹霞等）
2. 路线数据必须包含：路线名称、天数、景点序列、适合人群、体力等级、预算范围、特色标签
3. 兴趣标签覆盖：自然风光、民族文化、古镇历史、户外探险、美食特产、避暑康养、摄影打卡、亲子研学
4. 景点图片字段预留三种格式：`imageUrl?: string`（真实图片URL）、`imageGradient?: string`（CSS渐变占位）、`icon?: string`（Emoji图标），第一阶段用渐变和Emoji做视觉占位，后续可替换
5. 所有Mock数据需导出异步获取函数（`Promise`包装），模拟真实API调用
5. 数据要有足够的丰富度，至少8个景点、5条路线、20个知识库问答对

## 每次开发输出格式

开发前必须说明：
1. **本次目标：** 一句话描述
2. **所属端：** 明确标注"Web 端 / 小程序端 / 双端共享能力"，并说明划分理由
3. **涉及文件：** 新建/修改的文件列表
4. **预期效果：** 完成后的用户可见效果
5. **验证方式：** 如何确认修改成功

## 比赛演示目标

- **演示视频（3-5分钟）：** 从首页开始，走完"兴趣选择 → 画像生成 → 路线推荐 → AI导游问答 → 知识库"完整流程
- **PPT答辩：** 项目背景、技术架构、创新点、商业模式、团队介绍
- **Demo闭环：** 所有页面可交互，数据虽为Mock但逻辑完整

## 环境信息

- **操作系统：** Windows 11 Pro for Workstations
- **Shell：** PowerShell（优先）/ CMD
- **Node.js：** 通过 `node` 命令调用
- **包管理器：** npm

---

## 多端开发总原则

本项目采用"双端协同"策略：

- **小程序端：** 游客端核心产品，优先开发，负责真实用户使用场景。
- **Web 端：** 项目展示官网、后台管理端、数据统计看板、比赛路演展示端。
- 两端不是互相替代关系，而是共同组成完整项目。

## 小程序端定位

小程序端面向游客真实使用，优先完成以下功能：

1. 首页
2. 游客兴趣选择
3. 游客画像生成
4. 个性化路线推荐
5. 路线详情
6. AI 智能导游
7. 景点知识库
8. 景点详情
9. 我的行程

小程序端开发要求：

- 使用微信原生小程序结构
- 优先适配手机端
- 页面交互要简洁、顺手、适合游客边走边用
- 不要做成复杂后台风格
- 不接真实后端前，先使用本地 Mock 数据
- 要适合录制比赛演示视频

## Web 端定位

Web 端不删除，继续保留并逐步完善，主要负责：

1. 项目展示官网
2. 比赛路演展示页
3. 后台管理端
4. 数据统计看板
5. 景点管理
6. 路线管理
7. 用户画像数据展示
8. AI 问答记录展示

Web 端开发要求：

- 不再作为游客端主入口
- 不删除已有 Web 页面
- 已有游客流程页面可保留为 Web 演示版或兜底页面
- 后续重点转向后台管理和路演展示
- 风格继续保持科技感、文旅感、贵州地域特色

## 双端共享原则

虽然 Web 和小程序代码结构不同，但业务逻辑必须保持一致：

1. 景点数据字段尽量一致
2. 路线数据字段尽量一致
3. 兴趣标签字段尽量一致
4. 用户画像字段尽量一致
5. AI 问答数据结构尽量一致
6. 后续后端接口要同时服务 Web 和小程序
7. Mock 数据可以各端单独存放，但字段设计要保持同步
8. 不要在 Web 端和小程序端设计两套完全不同的业务模型

## 目录结构

```
qianxing-zhidao/
├── shared/               # 共享层（类型定义 + Mock 数据 + 工具函数）
│   ├── types/
│   ├── mock/
│   └── utils/
├── src/                  # Web 端（Vue 3 + Vite + Element Plus）
│   ├── views/
│   ├── components/
│   ├── composables/
│   ├── styles/
│   └── router/
├── miniprogram/          # 微信小程序端（原生）
│   ├── pages/
│   └── components/
└── docs/                 # 比赛文档
```

## 后续接口预留原则

每开发一个功能，都要说明未来可能对应哪些后端接口：

| 功能 | 预期接口 |
|------|----------|
| 小程序兴趣选择 | `GET /api/interest-tags` |
| 生成游客画像 | `POST /api/visitor-profile/generate` |
| 个性化路线推荐 | `POST /api/route-recommendations` |
| 景点知识库 | `GET /api/scenic-spots` |
| 景点详情 | `GET /api/scenic-spots/{id}` |
| AI 导游问答 | `POST /api/ai-guide/chat` |
| 我的行程 | `GET /api/user-trips` |
| Web 后台景点管理 | `GET/POST/PUT/DELETE /api/admin/scenic-spots` |
| Web 后台路线管理 | `GET/POST/PUT/DELETE /api/admin/routes` |
| Web 数据看板 | `GET /api/admin/dashboard/stats` |

当前阶段仍然不接真实后端，只做接口结构预留。

## 每次开发前必须判断

以后每次开发前，都必须先判断该功能属于哪一端：

- 游客真实使用功能 → 优先放小程序端
- 后台管理、数据统计、路演展示 → 优先放 Web 端
- 两端都需要的能力 → 先统一数据结构和接口设计，再分别实现

## 禁止事项（补充）

1. 不要把小程序端做成 Web 后台样式
2. 不要把 Web 端完全删除
3. 不要让 Web 和小程序的数据字段各写各的
4. 不要为了复用代码强行把两端工程混在一起
5. 不要一边开发小程序，一边破坏 Web 端已有成果
6. 不要在没有确认的情况下引入 uni-app、Taro、Pinia、后端接口、地图 SDK 或真实 AI API
7. 不要忘记比赛演示目标：小程序展示游客体验，Web 展示项目能力和后台价值

## 当前优先级

| 优先级 | 内容 |
|--------|------|
| 第一 | 微信小程序游客端 Demo 闭环 |
| 第二 | Web 端项目展示和后台管理 |
| 第三 | 后端接口设计和数据库设计 |
| 第四 | 真实 AI / RAG / 地图能力接入

---

## 🧬 自动加载规则（每次会话自动生效，无需手动调用技能）

以下规则已从技能文件中提取并直接熔入此处，你每次写代码自动遵守：

### 不可变性（CRITICAL · 始终生效）
- 永远创建新对象，**绝不原地修改**已有对象
- 使用 spread `{ ...obj, field: newVal }` 做不可变更新
- 函数返回新值，不修改参数

### TypeScript 铁律（始终生效）
- 导出函数**必须**显式标注参数和返回类型，让 TS 推断局部变量
- **禁止 `any`** — 用 `unknown` + 安全 narrowing 替代
- 组件 Props: `defineProps<MyProps>()` + named `interface`
- `interface` → 对象形状，`type` → 联合/交叉/工具类型
- 优先 `string literal union`，不用 `enum`（除非互操作需要）

### 命名规范（始终生效）
| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数/文件名 | `camelCase` | `getUserProfile` |
| Boolean | `is/has/should/can` 前缀 | `isLoading` |
| Interface/Type/Component | `PascalCase` | `UserCard` |
| 常量 | `UPPER_SNAKE_CASE` | `MAX_RETRY` |
| Composables | `use` + `PascalCase` | `useDebounce` |
| 视图文件 | `XxxView.vue` | `HomeView.vue` |
| CSS 类名 | `kebab-case` BEM | `.route-card__title` |

### 函数与文件上限（始终生效）
- 函数 < 50 行 · 文件 < 800 行（典型 200-400）· 嵌套 ≤ 4 层
- 超过 4 层嵌套 → 用 early return 展平

### 安全底线（始终生效）
- 绝不硬编码密钥/Token — 用 `import.meta.env.VITE_xxx`
- 错误消息不泄露内部信息
- 所有外部数据视为不可信，需验证/净化
- 禁止 `console.log` 进入生产代码

### 开发输出规范（始终生效）
写代码前必须先说明：**本次目标 · 所属端 · 涉及文件 · 预期效果 · 验证方式**

---

## 项目技能与规则（Reasonix Skills · 按需调用）

以下技能需要通过 `/name` 或 `run_skill` 手动调用（完整版指令在其中）：

| 技能 | 调用方式 | 用途 | 何时调 |
|------|----------|------|--------|
| preflight | `/preflight` | 🔀 一键调度：分析当前任务，自动调用所有适用技能 | 每次开始写代码前 |
| context-compressor | `/compress` | 上下文压缩：超限前保存+生成恢复摘要 | 对话 >15 轮时 |
| conversation-memory | `/conversation-memory` | 对话记忆：记录/检索/清理 | 阶段性工作结束时 |
| find-skills | `/find-skills` | 发现和安装新的 agent skills | 需要新能力时 |
| ts-coding-standards | `/ts-coding-standards` | TS/Vue 编码规范（完整版 + Code Review 清单） | 复杂重构时 |
| security-guidelines | `/security-guidelines` | 安全编码（密钥管理、XSS/注入预防、安全响应） | 处理敏感数据时 |
| dev-workflow | `/dev-workflow` | 开发工作流（功能实现流程、Commit 格式、TDD） | 新功能开发时 |
| testing-standards | `/testing-standards` | 测试规范（AAA 模式、覆盖率、Vue 组件测试） | 写测试时 |
