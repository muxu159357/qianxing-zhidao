# 黔行智导项目进度记录

## 当前阶段

小程序游客端主流程完善阶段 — P0 问题修复、文案统一、破图处理已基本完成。

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
