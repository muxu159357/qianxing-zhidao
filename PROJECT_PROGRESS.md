# 黔行智导项目进度记录

## 当前阶段

小程序游客端主流程完善阶段 — P0 问题修复、文案统一、破图处理已基本完成。底部三入口 tabBar 导航已建立。

### 本次进度更新 (2026-06-09)

#### 底部三入口 tabBar 导航

- [x] `app.json` 新增原生 tabBar：首页 / AI助手 / 我的行程
- [x] 6 处 navigateTo → switchTab（index/route-detail/scenic-detail/knowledge）
- [x] 跨页面上下文传递：scenic-detail/knowledge → guide 通过 `qianxing_pending_question` storage
- [x] guide.js 新增 `onShow` + `checkPendingContext()` 处理 tab 切换时的上下文
- [x] route-detail 保存后 "查看我的行程" 仍为 switchTab
- [x] 所有 tabBar 跳转点已更新：首页→AI助手、路线详情→AI助手/我的行程、景点详情→AI助手、知识库→AI助手

**涉及文件（6个）：**
| 文件 | 操作 |
|------|------|
| `miniprogram/app.json` | 新增 tabBar 配置 |
| `miniprogram/pages/index/index.js` | navigateTo → switchTab |
| `miniprogram/pages/route-detail/route-detail.js` | 2处 navigateTo → switchTab |
| `miniprogram/pages/scenic-detail/scenic-detail.js` | setStorageSync + switchTab |
| `miniprogram/pages/knowledge/knowledge.js` | setStorageSync + switchTab |
| `miniprogram/pages/guide/guide.js` | 新增 onShow + checkPendingContext |

#### AI助手页底部布局修复 (2026-06-09)

- [x] 移除 input-bar 内冗余"首页"按钮（tabBar 已有首页入口）
- [x] 优化底部留白：`padding-bottom` 从 `calc(16rpx + env(safe-area-inset-bottom))` → `16rpx`
- [x] 清理 guide.js 中不再使用的 `goHome()` 方法

**涉及文件（3个）：**
| 文件 | 操作 |
|------|------|
| `miniprogram/pages/guide/guide.wxml` | 删除 input-bar 内 `<text>首页</text>` |
| `miniprogram/pages/guide/guide.wxss` | `.input-bar` padding-bottom 从 `calc(16rpx + env(...))` → `16rpx` |
| `miniprogram/pages/guide/guide.js` | 删除 `goHome()` 方法 |

#### 我的行程页底部防御性修复 (2026-06-09)

- [x] `.list-bottom-spacer` 从 `40rpx` → `80rpx`，确保最后一张卡片与 tabBar 有安全间距
- [x] 文案口径修正：项目记录中统一使用"删除"，不写"左滑删除"

| 文件 | 操作 |
|------|------|
| `miniprogram/pages/my-trips/my-trips.wxss` | `.list-bottom-spacer` 40→80rpx |

## 总体目标

构建"贵州山地旅游 AI 伴游与安全守护平台"：
- **小程序端**：游客真实使用的主产品（优先开发）
- **Web 端**：项目展示、运营管理和数据看板

## 当前已完成

### 小程序端（9 个页面）

- [x] 首页 — 品牌区、能力卡片（去 emoji）、精选路线入口
- [x] 兴趣选择 — 8 标签 + 5 项出行参数
- [x] 游客画像 — 加载/就绪态、匹配度进度条、行程风格
- [x] 路线推荐 — 打分排序、展开/收起时间线、wx:key 修复
- [x] 路线详情 — 完整信息卡片 + 安全守护模块（规则模拟）+ 保存/伴游入口
- [x] 安全守护基础模块 — 风险等级/体力/天气/山地/错峰/体力分配提醒 + 服务点 + 紧急求助 + 替代路线
- [x] 景点知识库 — 搜索/分类筛选/手风琴展开，CSS 图标（去破图）
- [x] 景点详情 — Hero 渐变区 + 亮点/贴士 + CSS 图标（去破图）+ "询问 AI 伴游"
- [x] AI 伴游 — 聊天界面 + 快捷提问 + 知识库匹配
- [x] 我的行程 — 增删查 + Storage 同步 + 跳转路线详情

### Web 端（9 个页面）

- [x] 首页 (`HomeView.vue`) — 视频背景 + 能力卡片 + AI 推荐区（Demo→AI 推荐）
- [x] 兴趣选择 (`PlannerView.vue`) — GSAP 动画 + localStorage 持久化
- [x] 游客画像 (`ProfileView.vue`) — 匹配度展示
- [x] 路线推荐 (`RouteRecommendView.vue`) — 分数排序 + 时间线
- [x] AI 伴游 (`AiGuideView.vue`) — 对话界面
- [x] 景点知识库 (`ScenicKnowledgeView.vue`)
- [x] 景点详情 (`ScenicDetailView.vue`)
- [x] 运营管理 (`AdminDashboardView.vue`)
- [x] 智能伴游体验 (`DemoFlowView.vue`) — 内部使用，路由 `/quick-tour`

### 规则与基建

- [x] `CLAUDE.md` — 产品外显原则、赛题对齐、双端定位、文案规则、禁止事项、进度记录规则
- [x] `shared/types/` + `shared/mock/` — 10 景点、5 路线、8 兴趣标签、7 知识问答对
- [x] 微信小程序 9 页全部注册
- [x] 路线推荐→路线详情→保存/伴游 完整链路
- [x] Git 分支统一到 `main`

## 基础版已完成但待优化

- [ ] AI 伴游仍为本地规则模拟，后续需接真实大模型 API
- [ ] 安全守护仍为规则模拟，后续需接天气、位置、服务点真实数据
- [ ] 路线推荐仍为本地算法打分，后续需接后端
- [ ] 图片素材多为 CSS 渐变占位，后续可替换真实景点照片
- [ ] 小程序整体视觉仍需统一（页面头部风格、CSS 类名、背景色）
- [ ] Web 端定位需进一步调整为运营管理端
- [ ] 小程序 mock 数据中景点/兴趣标签仍含 emoji icon 字段（不影响用户端）
- [ ] 小程序知识库仅 7 条，需扩充至 20 条以上

## 尚未实现

- [ ] 后端接口（REST API）
- [ ] 数据库设计
- [ ] 用户系统 / 登录
- [ ] 真实 AI / RAG 接入
- [ ] 天气接口
- [ ] 地图与定位
- [ ] 实时安全预警
- [ ] Web 运营管理完善（路线管理、画像洞察、AI 问答记录、安全预警记录）
- [ ] Web 数据看板完善
- [ ] 测试验证报告
- [ ] 数据来源说明
- [ ] 演示视频脚本
- [ ] 小程序入场动画（wx.createAnimation）
- [ ] 小程序知识库扩充

## 当前已知问题

- 微信开发者工具可能偶发 `Error: timeout`（框架层，非项目代码触发）
- 小程序部分页面视觉不统一（首页 Hero、知识库/我的行程 Header、AI 伴游背景色）
- Web 端可能存在白屏问题，待单独排查
- 安全能力均为规则模拟，未接真实数据
- 还没有真实后端接口

## 最近更新记录

### 2026-06-06

**本次完成**：小程序 P0 视觉修复 + 文案统一 + 破图处理 + WXSS 编译错误修复 + Git 分支合并 + 规则文件更新 + 项目进度记录体系建立

**修改文件**（21+ 个）：
- 规则文件：CLAUDE.md、SKILL.md、.cursor/rules/qianxing-zhidao.mdc、.cursor/rules/qianxing-zhidao-development.mdc
- 小程序：app.json、index.js、index.wxml、index.wxss、recommend.wxml、recommend.js、my-trips.js、my-trips.wxml、my-trips.wxss、knowledge.wxml、knowledge.wxss、scenic-detail.wxml、scenic-detail.wxss
- 新增：route-detail/route-detail.{js,wxml,wxss,json}、PROJECT_PROGRESS.md
- Web 端：HomeView.vue、DemoFlowView.vue、router/index.ts、UnderDevelopmentView.vue（已删除）
- 计划文件：.claude/plans/route-detail-safety.plan.md

**验证结果**：
- 小程序 9 个页面全部正常注册
- 零"桂林"残留、零 `/images/icons/` 破图、零用户可见 emoji（首页）、零违禁词汇
- WXSS 编译通过

**下一步**：
1. 小程序全流程手动联调验证
2. 排查 Web 端白屏问题
3. 进入 P1 视觉统一优化

### 2026-06-06（P1 体验修复 + 阻断问题修复）

**本次完成**：
1. 阻断问题修复：knowledge.js、scenic-detail.js 导航路径从 `/pages/ai-guide/ai-guide` 修正为 `/pages/guide/guide`；guide.js 兼容 Storage 中 route 对象避免 `[object Object]`；"AI向导"→"AI 伴游"
2. planner.wxml 移除 emoji `{{item.icon}}`
3. P1 体验修复：首页按钮排版优化 + 四个能力卡片可点击 + 卡片 2×2 布局优化 + 兴趣标签选中态渐变增强

**修改文件**（8 个）：
| 文件 | 修改内容 |
|------|---------|
| `knowledge.js` | 导航路径修复 |
| `scenic-detail.js` | 导航路径修复 |
| `guide.js` | route 对象兼容 + 品牌词统一 |
| `planner.wxml` | 移除 emoji icon |
| `planner.wxss` | 标签选中态渐变增强 |
| `index.wxml` | 能力卡片增加 bindtap + hover-class |
| `index.js` | features 增加 key 字段 + onFeatureTap 方法 |
| `index.wxss` | 按钮排版 + 卡片 2×2 布局 + 阴影 + 响应反馈 |

**验证结果**：
- 小程序零 `AI导游`/`AI向导`/`ai-guide`/`item.icon` 引用
- 四个能力卡片均可点击，跳转目标页面存在
- 标签选中态渐变 + 白字 + 阴影，一眼可辨
- 按钮 88% 宽度居中纵向排列，适配移动端

### 2026-06-06（P1 体验修复 Round 2：选中态 + 居中 + 首页 Grid + 回首页入口）

**本次完成**：
1. 兴趣标签选中态从 `indexOf` 条件判断改为 `item.selected` 字段驱动，保证真实生效
2. 兴趣选择页所有选项组（标签、天数、预算、人群、体力、节奏）居中布局
3. 首页核心能力卡片从 `flex + calc` 改为 `CSS Grid repeat(2, 1fr)`，真实 2×2
4. profile / recommend / route-detail / guide 4 个主流程页面新增"首页"入口（wx.reLaunch）
5. 兴趣选择页和画像页底部按钮统一 88% 宽度居中

**修改文件**（15 个）：
| 文件 | 修改内容 |
|------|---------|
| `planner.js` | onLoad 初始化 `selected: false`；toggleTag 使用不可变更新 |
| `planner.wxml` | tag class 改用 `item.selected` 判断 |
| `planner.wxss` | 所有选项组 `justify-content: center`；submit-btn 88% 居中 |
| `index.wxss` | feature-grid 切换 CSS Grid；删除 `flex + calc` |
| `app.wxss` | 新增 page-hd-row / home-link / home-link--light / home-link--small 全局样式 |
| `profile.js` | 新增 goHome() |
| `profile.wxml` | 页面头部新增"首页"链接 |
| `profile.wxss` | action 按钮 88% 居中 + flex column |
| `recommend.js` | 新增 goHome() |
| `recommend.wxml` | 页面头部新增"首页"链接 |
| `route-detail.js` | 新增 goHome() |
| `route-detail.wxml` | route-hero 内新增"首页"链接 |
| `route-detail.wxss` | 新增 route-hero-row / route-hero-main |
| `guide.js` | 新增 goHome() |
| `guide.wxml` | 输入栏左侧新增"首页"链接 |

**验证结果**：
- 标签选中：`item.selected` 字段驱动，setData 原子更新，真实生效
- 首页 2×2：CSS Grid 保证两列等宽，不依赖 calc 计算
- 回首页：4 个页面均可一键回到首页，系统返回按钮仍可用
- 按钮居中：88% 宽度，flex 居中，圆角统一

### 2026-06-06（素材接入：10 张景点图 + 视频计划）

**本次完成**：
1. 识别并映射 10 张拼音命名景点图 → 10 个景点 id
2. Web 端 `public/assets/images/scenic/` 复制 10 张高清图（统一命名）
3. 小程序端 `miniprogram/assets/images/scenic/` 复制 10 张图
4. 小程序 `mock.js` 10 个景点全部补充 `imageUrl`
5. 共享 `shared/mock/attractions.ts` 10 个景点全部补充 `imageUrl`
6. `scenic-detail.wxml` Hero 区优先使用真实图，CSS 遮罩确保文字可读
7. `route-detail.wxml` 景点缩略图优先使用真实图
8. 视频 `huangguoshu.mp4` 因无 ffmpeg 暂未压缩，小程序首页未接入

**修改文件**：
| 文件 | 修改内容 |
|------|---------|
| `public/assets/images/scenic/` | 新建目录，10 张 Web 高清图 |
| `miniprogram/assets/images/scenic/` | 新建目录，10 张小程序图 |
| `miniprogram/utils/mock.js` | 10 个景点增加 `imageUrl` |
| `shared/mock/attractions.ts` | 10 个景点增加 `imageUrl` |
| `scenic-detail.wxml` | Hero 背景优先真实图 |
| `scenic-detail.wxss` | 图片上暗色渐变遮罩 |
| `route-detail.wxml` | 景点缩略图优先真实图 |
| `route-detail.wxss` | 缩略图增加圆角 |

**⚠️ 待压缩标记**：
- `scenic-xiaoqikong.jpg` 8.1 MB → 必须压缩
- `scenic-huangguoshu.jpg` 2.2 MB → 建议压缩
- `scenic-chishui-danxia.jpg` 502 KB → 建议压缩
- `scenic-fanjingshan.jpg` 28 KB → Web 端可能偏小
- `scenic-qingyan.jpg` 28 KB → Web 端可能偏小

**待后续**：视频压缩（需 ffmpeg）、小程序首页视频接入、图片压缩优化

### 2026-06-06（图片目录修复：压缩图 ↔ 高清图正确归位）

**问题**：压缩后 3 张图被放到 Web 端目录，小程序端仍是原始大图。
**修复**：交换文件位置——压缩图 → 小程序端，原图 → Web 端恢复。

**结果**：
- 小程序端 1.36 MB，零超过 500KB 图片，全部可流畅加载
- Web 端 11.27 MB，高清图已恢复
- scenic-xiaoqikong: 8MB → 286KB（压缩率 96.5%）
- scenic-huangguoshu: 2.1MB → 179KB（压缩率 91.8%）
- scenic-chishui-danxia: 502KB → 169KB（压缩率 66.3%）

### 2026-06-06（小程序首页 Hero 背景：视频→首帧图）

**问题**：微信小程序 `<video>` 组件不支持本地打包 mp4 文件，视频无法播放。
**方案 B**：从黄果树视频截取首帧图 `home-hero.jpg`（178 KB），改用 `<image>` 组件。

**当前结构**：
```
hero-section (渐变兜底)
  ├── image (aspectFill, z-index:0) → home-hero.jpg
  ├── mask (暗色遮罩, z-index:1)
  └── content (文字+按钮, z-index:2)
```

**改动**：视频 `<video>` 替换为 `<image>`；移除 video 事件 handler；后续部署 CDN 后可随时切回 `<video>` + 网络 URL。

**结构**：video（z-index:0）→ mask（z-index:1, 暗色遮罩）→ content（z-index:2, 文字+按钮）

**兜底**：视频不存在或加载失败时，hero-section 的 CSS 渐变背景自动可见

**修改文件**：
| 文件 | 修改内容 |
|------|---------|
| `index.wxml` | Hero 区新增 `<video>` + `<view class="hero-video-mask">` + `<view class="hero-content">` 三层结构 |
| `index.wxss` | 新增 `.hero-video` `.hero-video-mask` `.hero-content` 定位与层级 |

### 2026-06-09（Logo 品牌标识 + 首页 4 核心能力图标接入）

**本次完成**：
1. Logo 双端接入：小程序首页 Hero "黔"文字方块替换为 Logo 图片，Web favicon 新增 PNG Logo
2. Logo 压缩优化：备份原图 `logo-original.png`，双端压缩 PNG（小程序 ~107 KB，Web ~369 KB）
3. 目录规范：创建 `miniprogram/assets/images/icons/` 和 `public/assets/icons/` 目录
4. 小程序首页 4 核心能力图标接入：画像分析/路线推荐/AI 伴游/安全守护

**修改文件**：
| 文件 | 修改内容 |
|------|---------|
| `miniprogram/assets/images/brand/logo.png` | 新增 Logo（压缩版） |
| `miniprogram/assets/images/brand/logo-original.png` | Logo 原图备份 |
| `public/assets/brand/logo.png` | 新增 Logo（高清版） |
| `public/assets/brand/logo-original.png` | Logo 原图备份 |
| `miniprogram/assets/images/icons/` | 新建目录，4 个能力图标 |
| `public/assets/icons/` | 新建目录，icon-profile.png |
| `index.html` | favicon 新增 PNG Logo 链接 |
| `miniprogram/pages/index/index.wxml` | Hero Logo 文字→图片，feature-icon 条件渲染 |
| `miniprogram/pages/index/index.wxss` | hero-logo 简化，新增 feature-icon-img |
| `miniprogram/pages/index/index.js` | features 数组增加 icon 字段（4 个） |

**验证结果**：
- Logo 双端文件均确认真 PNG（magic bytes `89 50 4E 47`）
- 4 核心能力图标文件均存在（profile 53 KB, route 109 KB, guide 106 KB, safety 72 KB）
- WXML 条件渲染：有 icon 显示图片，无 icon 回退文字
- 2×2 CSS Grid 布局未受影响
- Web favicon 引用路径正确

**下一步**：
1. ~~Web 首页 3 张能力卡片图标接入~~ ✅ 已完成
2. Web 首页补充第 4 张"安全守护"卡片
3. brand 目录旧 `icon-profile.png` 清理

### 2026-06-09（Web 首页 3 能力卡片图标接入）

**本次完成**：
1. Web 首页 3 张能力卡片 Element Plus 图标替换为图片图标
2. 移除未使用的 `UserFilled`/`MapLocation`/`ChatDotRound` import
3. 新增 `.feature-card-icon` 样式（88×88 px, object-fit: contain）

**修改文件**：
| 文件 | 修改内容 |
|------|---------|
| `src/views/HomeView.vue` | 3 张卡片 `<el-icon>` → `<img>`，移除 Element Plus icons import，新增 feature-card-icon CSS |

**验证结果**：
- `npm run build` 编译通过，零错误
- 4 个图标文件均存在 Web icons 目录（profile 175 KB, route 109 KB, guide 106 KB, safety 72 KB）
- 卡片布局、标题、文案、按钮未改动
- Hero 视频背景、路由、favicon 未改动
- 小程序未改动

**下一步**：
1. ~~Web 首页补充第 4 张"安全守护"卡片~~ ✅ 已完成
2. brand 目录旧 `icon-profile.png` 清理

### 2026-06-09（Web 首页新增"安全守护"能力卡片）

**本次完成**：
1. Web 首页核心能力区新增第 4 张"安全守护"卡片
2. 布局从 3 列升级为 4 列（desktop），900px → 2 列，560px → 1 列
3. 副标题"三大"→"四大 AI 引擎"

**修改文件**：
| 文件 | 修改内容 |
|------|---------|
| `src/views/HomeView.vue` | 新增安全守护卡片模板，grid 3→4 列，副标题更新，card-image-safety 渐变背景，响应式 900px 2 列 + 560px 1 列 |

**验证结果**：
- `npm run build` 编译通过
- 4 张卡片布局一致，图标尺寸统一
- 原有 3 张卡片未改动
- Hero 区、按钮、路由未改动
- 小程序未改动

**下一步**：
1. ~~brand 目录旧 `icon-profile.png` 清理~~ ✅ 已完成
2. 确认/恢复 `logo-original.png` 备份文件

### 2026-06-09（资源目录清理）

**本次完成**：
1. 删除 `miniprogram/assets/images/brand/icon-profile.png`（已迁移到 icons 目录）
2. 删除 `public/assets/brand/icon-profile.png`（已迁移到 icons 目录）

**目录状态**：
| 目录 | 内容 |
|------|------|
| 小程序 brand | `logo.png` |
| 小程序 icons | 4 个能力图标 |
| Web brand | `logo.png` |
| Web icons | 4 个能力图标 |

**确认**：`logo-original.png` 不再恢复，当前 `logo.png` 为正式 Logo。brand 目录仅保留品牌资产，icons 目录存放功能图标。

**下一步**：进入 AI 伴游头像素材阶段。

### 2026-06-09（AI 伴游头像资源归位）

**本次完成**：
1. 创建 `miniprogram/assets/images/ai/` 和 `public/assets/ai/` 目录
2. `aibanyou.png` 复制到双端 `ai/` 目录（123.1 KB，真 PNG）

**目录状态**：
| 端 | 路径 | 状态 |
|------|------|------|
| 小程序 | `miniprogram/assets/images/ai/aibanyou.png` | ✅ |
| Web | `public/assets/ai/aibanyou.png` | ✅ |
**下一步**：
1. ~~小程序 guide 页 AI 头像接入~~ ✅ 已完成
2. ~~Web AiGuideView AI 头像接入~~ ✅ 已完成
3. ~~清理根目录旧 `aibanyou.png`~~ ✅ 已完成

### 2026-06-09（双端 AI 伴游头像接入）

**本次完成**：
1. 小程序 guide 页 AI 消息头像 + 打字指示器头像：文字"导" → `<image>` 图片
2. Web AiGuideView AI 消息头像 + 打字指示器头像：文字"AI" → `<img>` 图片
3. 双端用户头像（"我"/"U"）保持不变

**修改文件**：
| 文件 | 修改内容 |
|------|---------|
| `guide.wxml` | AI 头像 `<view>` 文字 → `<image>`（2 处） |
| `guide.wxss` | `.avatar` 简化，`.avatar-ai`/`.avatar-user` 拆分（AI 用 image，用户保留文字） |
| `AiGuideView.vue` | AI 头像 `<span>AI</span>` → `<img>`（2 处），`.avatar-ai` CSS 适配图片 |

**验证结果**：
- `npm run build` 编译通过（1465 modules）
- 小程序用户头像"我"未改
- Web 用户头像"U"未改
- 聊天布局未变
- 文案/逻辑/路由未改

**下一步**：Logo/图标/头像三大素材阶段已完成。

### 2026-06-09（空态插画资源归位）

**本次完成**：
1. 将 `empty-trips.png` 从 `ai/` 目录归位到 `miniprogram/assets/images/empty/`
2. 创建 `miniprogram/assets/images/empty/` 目录
3. 源文件在 `ai/` 目录暂时保留，未删除

**修改文件**：
| 文件 | 操作 |
|------|------|
| `miniprogram/assets/images/empty/empty-trips.png` | 新建（从 ai/ 复制） |

**验证结果**：
- 文件大小：71.7 KB
- 格式：PNG（magic bytes 89 50 4E 47 确认）
- 源文件 `ai/empty-trips.png` 保留未删
- 未修改任何页面代码

**下一步**：接入我的行程空态插画（修改 my-trips.wxml + my-trips.wxss）

### 2026-06-09（接入我的行程空态插画）

**本次完成**：
1. `my-trips.wxml`：CSS 虚线方块 `<view>` → `<image>` 插画
2. `my-trips.wxss`：去掉 border/background/border-radius，140rpx → 280rpx

**修改文件**：
| 文件 | 修改内容 |
|------|---------|
| `my-trips.wxml:40` | `<view class="empty-icon">` → `<image class="empty-icon" src="/assets/images/empty/empty-trips.png" mode="aspectFit" />` |
| `my-trips.wxss:162-166` | 去边框/背景/圆角，尺寸 140→280rpx |

**验证结果**：
- empty-trips.png 正式文件存在（71.7 KB PNG）
- 空态标题/说明/按钮文案未改
- 有行程时列表不受影响
- 页面逻辑/路由/其他页面未改
- ai/ 源文件保留未删

**下一步**：待后续阶段（如 Web 用户头像、其他优化等）

### 2026-06-09（清理 ai/ 目录误放的 empty-trips.png）

**本次完成**：
1. 删除 `miniprogram/assets/images/ai/empty-trips.png`（误放）
2. 删除 `public/assets/ai/empty-trips.png`（误放）
3. 正式文件 `miniprogram/assets/images/empty/empty-trips.png` 保留不变

**目录最终状态**：
| 目录 | 内容 |
|------|------|
| `miniprogram/assets/images/ai/` | `aibanyou.png`（唯一文件） |
| `public/assets/ai/` | `aibanyou.png`（唯一文件） |
| `miniprogram/assets/images/empty/` | `empty-trips.png`（唯一文件） |

**验证结果**：
- ai/ 目录不再包含空态插画
- my-trips.wxml 引用路径正确（`/assets/images/empty/empty-trips.png`）
- aibanyou.png 双端均保留
- 未修改任何页面代码

**下一步**：待后续阶段

### 2026-06-09（修复 P0 视觉问题：emoji + 打字指示器头像）

**本次完成**：
1. **P0-1**: `guide.wxml:20` 打字指示器头像"导" → `<image>` aibanyou.png
2. **P0-2**: `route-detail.wxml` 安全守护区 5 个 emoji（⚡🌤️⛰️👥🕐）→ CSS 图形图标
3. **P0-3**: `route-detail.wxml:7` 空态 🗺️ emoji → CSS 路线图标

**修改文件**：
| 文件 | 修改内容 |
|------|---------|
| `guide.wxml:20` | `<view>导</view>` → `<image>` 图片头像 |
| `route-detail.wxml:7` | `🗺️` emoji → 空 `<view>` + CSS 图标 |
| `route-detail.wxml:124-148` | 5 处 emoji → 5 个语义 class（`safety-icon-*`） |
| `route-detail.wxss:25-48` | `.empty-icon` CSS 路线图标（圆形 + 三角指针 + 定位点） |
| `route-detail.wxss:240-300` | 5 种 CSS 图形：三角警示/圆形太阳/双峰/双点/圆形时钟 |

**验证结果**：
- 页面 emoji：仅剩 P1 `scenic-detail.wxml:67` `✦`（不在本次范围）
- 打字指示器：已用 aibanyou.png
- 用户头像"我"：未改
- 安全守护区：5 个 CSS 图标，无 emoji
- 路线详情布局/底部操作栏/业务逻辑：未改
- 路由/文案/图片资源：未改

**下一步**：P1 问题（景点详情 ✦/文字首字、知识库空态）

### 2026-06-09（修复 P1：景点详情页视觉降级）

**本次完成**：
1. **✦ → CSS 渐变圆点**：`highlight-dot` 从 unicode 字符改为 `12rpx` 品牌色渐变圆
2. **charAt(0) → CSS 山峰图形**：`hero-icon` 从文字首字改为 ::before + ::after 双三角山峰

**修改文件**：
| 文件 | 修改内容 |
|------|---------|
| `scenic-detail.wxml:20` | 移除 `{{attraction.name.charAt(0)}}`，空 `<view>` + CSS 图形 |
| `scenic-detail.wxml:67` | `<text>✦</text>` → `<view class="highlight-dot">` |
| `scenic-detail.wxss:122-148` | `.hero-icon` 去文字属性 + `::before`/`::after` 双峰 |
| `scenic-detail.wxss:230-236` | `.highlight-dot` 去 font → `12rpx` 渐变圆 |

**验证结果**：
- scenic-detail 无 emoji / 特殊符号残留
- Hero 大图、标题、城市、评分、简介、亮点、贴士：未受影响
- 未新增图片资源，路由/逻辑未改

**下一步**：知识库空态插画、P2 箭头等后续优化

### 2026-06-09（修复 P1：知识库搜索无结果空态）

**本次完成**：
1. 知识库空态：CSS 虚线方块（`border: 4rpx solid #d0d5dd`）→ CSS 放大镜图标

**修改文件**：
| 文件 | 修改内容 |
|------|---------|
| `knowledge.wxss:268-290` | `.empty-icon` 去边框/背景 → 140rpx 圆形 + `::before` 镜框 + `::after` 手柄 |

**CSS 放大镜设计**：
- 140rpx 圆形浅绿背景（`rgba(31,143,95,0.06)`）
- `::before`：48rpx 圆形镜框（5rpx 品牌绿边框）
- `::after`：22rpx 手柄（品牌绿，-45° 旋转）

**验证结果**：
- 无 emoji / 特殊符号
- 空态标题"暂无相关知识"、说明未改
- 搜索栏、分类标签、知识卡片、按钮：未受影响
- WXML 未改，路由/逻辑未改

**下一步**：P2 箭头等后续优化