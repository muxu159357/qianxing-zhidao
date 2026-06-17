# 黔行智导 · 图片资产需求分析报告

> 生成日期：2026-06-17
> 最后更新：2026-06-17 (V22-K 收口)
> 当前状态：**PHASE-3.5 完成 · P0=0 · P1=0**

## 执行摘要

| 阶段 | 状态 | commit |
|------|------|--------|
| IMG-REQUIREMENTS 需求分析 | ✅ | `a1f774b` |
| V22-H tabBar 图标生成 | ✅ | `5285aac` |
| V22-I 路线主题图生成 | ✅ | `5285aac` |
| V22-J scenic-detail 接入 | ✅ | `b826958` |
| V22-K 总质量门收口 | ✅ | 待提交 |

**已生成图片：15 个 PNG（6 tabBar + 8 route + 1 scenic fallback）**
**asset-resolver.js：70 行，6 个导出函数**
**P0=0, P1=0, code-reviewer APPROVE**

## 未解决问题（P2）

- 梵净山照片 28KB 偏低 — 建议用户后续替换
- 青岩古镇照片 28KB 偏低 — 建议用户后续替换
- 后端阶段需补充 imageSource / imageCredit / license 字段

---
## 原始分析（保留备份）

---

## 一、当前已有图片资产清单

### 1.1 景区图片 (miniprogram/assets/images/scenic/)

| 文件 | 景点 | 引用位置 | 状态 |
|------|------|---------|------|
| scenic-huangguoshu.jpg (~179KB) | 黄果树瀑布 | scenic-detail.wxml, route-detail.wxml | ✅ 已有 |
| scenic-xiaoqikong.jpg (~286KB) | 荔波小七孔 | scenic-detail.wxml, route-detail.wxml | ✅ 已有 |
| scenic-xijiang-miao.jpg | 西江千户苗寨 | scenic-detail.wxml, route-detail.wxml | ✅ 已有 |
| scenic-fanjingshan.jpg (~28KB) | 梵净山 | scenic-detail.wxml, route-detail.wxml | ⚠️ 偏小 |
| scenic-qingyan.jpg (~28KB) | 青岩古镇 | scenic-detail.wxml, route-detail.wxml | ⚠️ 偏小 |
| scenic-zhenyuan.jpg | 镇远古镇 | scenic-detail.wxml, route-detail.wxml | ✅ 已有 |
| scenic-zhaoxing.jpg | 肇兴侗寨 | scenic-detail.wxml, route-detail.wxml | ✅ 已有 |
| scenic-wanfenglin.jpg | 万峰林 | scenic-detail.wxml, route-detail.wxml | ✅ 已有 |
| scenic-zhijindong.jpg | 织金洞 | scenic-detail.wxml, route-detail.wxml | ✅ 已有 |
| scenic-chishui-danxia.jpg (~169KB) | 赤水丹霞 | scenic-detail.wxml, route-detail.wxml | ✅ 已有 |

**10/10 景点有图片，2 张（梵净山、青岩古镇）仅 28KB 偏低质量。**

### 1.2 功能图标 (miniprogram/assets/images/icons/)

| 文件 | 用途 | 引用位置 | 状态 |
|------|------|---------|------|
| icon-profile.png (53KB) | 兴趣画像卡片 | index.js features[0] | ✅ |
| icon-route.png (109KB) | 专属路线卡片 | index.js features[1] | ✅ |
| icon-guide.png (106KB) | AI 伴游卡片 | index.js features[2] | ✅ |
| icon-safety.png (72KB) | 安全守护卡片 | index.js features[3] | ✅ |

### 1.3 品牌 / 头像 / 空态 / 首页

| 文件 | 用途 | 引用位置 | 状态 |
|------|------|---------|------|
| brand/logo.png | 首页 Hero Logo | index.wxml | ✅ |
| ai/aibanyou.png | AI 伴游头像 | guide.wxml (×2) | ✅ |
| empty/empty-trips.png | 我的行程空态 | my-trips.wxml | ✅ |
| home-hero.jpg (178KB) | 首页 Hero 背景 | index.wxml | ✅ |
| videos/home-huangguoshu.mp4 | — | **未被引用** | ⚠️ 闲置 |

### 1.4 页面级图片引用完整 map

```
index.wxml         → home-hero.jpg, logo.png, 4× icon-*.png
guide.wxml         → aibanyou.png (2处)
my-trips.wxml      → empty-trips.png
scenic-detail.wxml → 10× scenic-*.jpg (attraction.imageUrl)
route-detail.wxml  → 10× scenic-*.jpg (item.imageUrl)
planner/profile/recommend/knowledge/trip-detail → 无图片引用（全CSS）
```

---

## 二、tabBar 图标需求

当前 `app.json` tabBar **没有 iconPath / selectedIconPath**，以纯文字模式运行。

| 图标 | 建议路径 | 尺寸 | normal色 | active色 | 提供方式 |
|------|---------|------|---------|---------|---------|
| home.png | assets/icons/tabbar/ | 81×81 | #667085 | — | Claude 可生成 |
| home-active.png | assets/icons/tabbar/ | 81×81 | — | #1f8f5f | Claude 可生成 |
| ai.png | assets/icons/tabbar/ | 81×81 | #667085 | — | Claude 可生成 |
| ai-active.png | assets/icons/tabbar/ | 81×81 | — | #1f8f5f | Claude 可生成 |
| trips.png | assets/icons/tabbar/ | 81×81 | #667085 | — | Claude 可生成 |
| trips-active.png | assets/icons/tabbar/ | 81×81 | — | #1f8f5f | Claude 可生成 |

**全部 6 个图标为简单几何图形（房子/对话气泡/列表），不涉及真实照片，可由 Claude 通过 Node.js 脚本生成纯色 PNG。**

---

## 三、路线图片需求

5 条路线的 mock 数据**无任何图片字段**（无 coverImage/imageUrl/imageGradient）。路线详情仅用景区缩略图。

### 3.1 路线主题 fallback 图

| 文件名 | 主题 | 适用路线 | 提供方式 |
|--------|------|---------|---------|
| route-default.png | 通用 | 任何路线 | Claude 生成 CSS 渐变 |
| route-waterfall.png | 瀑布/水域 | route-1（黄果树+小七孔） | Claude 生成抽象插画 |
| route-mountain.png | 山地/登山 | route-2（梵净山） | Claude 生成抽象插画 |
| route-village.png | 民族村寨 | route-3（侗寨+苗寨） | Claude 生成抽象插画 |
| route-cave.png | 溶洞/喀斯特 | route-4（织金洞+丹霞） | Claude 生成抽象插画 |
| route-ancient-town.png | 古镇/人文 | route-5（青岩+万峰林） | Claude 生成抽象插画 |
| route-forest.png | 森林/生态 | 未来路线 | Claude 生成抽象插画 |
| route-culture.png | 民族文化 | 未来路线 | Claude 生成抽象插画 |

### 3.2 路线图片 fallback 优先级

```
1. route.coverImage              （路线专属封面，当前无）
2. route.attractionIds[0] 对应景区 coverImage
3. route.tags[0] → route-theme.png  （主题匹配）
4. route-default.png              （通用默认）
```

---

## 四、景区图片需求

10/10 已有图片，缺失增强字段：

| 缺失字段 | 说明 | 紧急度 |
|---------|------|--------|
| thumbImage | 缩略图（列表/卡片用小图） | 低 |
| gallery | 多图轮播 | 低 |
| imageSource | 图片来源标注 | 中 |
| imageCredit | 版权/作者标注 | 中 |

### 景区图片质量评估

| 景点 | 当前文件 | 质量 | 建议 |
|------|---------|------|------|
| 黄果树瀑布 | scenic-huangguoshu.jpg (179KB) | 良好 | 可用 |
| 荔波小七孔 | scenic-xiaoqikong.jpg (286KB) | 良好 | 可用 |
| 西江千户苗寨 | scenic-xijiang-miao.jpg | 未知 | 可用 |
| 梵净山 | scenic-fanjingshan.jpg (28KB) | 偏低 | **建议替换** |
| 青岩古镇 | scenic-qingyan.jpg (28KB) | 偏低 | **建议替换** |
| 镇远古镇 | scenic-zhenyuan.jpg | 未知 | 可用 |
| 肇兴侗寨 | scenic-zhaoxing.jpg | 未知 | 可用 |
| 万峰林 | scenic-wanfenglin.jpg | 未知 | 可用 |
| 织金洞 | scenic-zhijindong.jpg | 未知 | 可用 |
| 赤水丹霞 | scenic-chishui-danxia.jpg (169KB) | 良好 | 可用 |

---

## 五、哪些图片需要用户手动提供

### 必须用户手动提供

| 项目 | 数量 | 原因 |
|------|------|------|
| 梵净山高清图 | 1 | 当前 28KB 偏低 |
| 青岩古镇高清图 | 1 | 当前 28KB 偏低 |
| 图片来源/版权标注 | 10 条 | 合规要求 |

### 建议用户手动提供

| 项目 | 数量 | 原因 |
|------|------|------|
| 首页 Hero 更高清背景 | 1 | 当前 178KB 可接受，可升级 |
| 路线专属封面图 | 5 | 可由运营从景区图中选 |

### 可以 Claude 生成

| 项目 | 数量 | 方式 |
|------|------|------|
| tabBar 图标 | 6 个 | Node.js 生成纯色几何 PNG |
| 路线主题 fallback 图 | 8 个 | CSS 渐变/简单矢量→PNG |
| 空态插画 | 按需 | CSS 或简单矢量图 |
| 景区默认 fallback | 1 个 | CSS 渐变 |

### 可以先不用真实图（当前 fallback 足够）

| 场景 | 当前方案 | 效果 |
|------|---------|------|
| 路线卡片 | CSS + 景区缩略图 | 可接受 |
| 知识库卡片 | 纯文字 + 分类色点 | 可接受 |
| 画像加载态 | CSS 脉冲动画 | 可接受 |

---

## 六、推荐目录结构

```
miniprogram/assets/
├── icons/
│   └── tabbar/            # 【新建】tabBar 图标
│       ├── home.png / home-active.png
│       ├── ai.png / ai-active.png
│       └── trips.png / trips-active.png
├── images/
│   ├── scenic/            # 已有 10 张
│   ├── routes/            # 【新建】路线主题 fallback
│   │   ├── route-default.png
│   │   ├── route-waterfall.png
│   │   ├── route-mountain.png
│   │   ├── route-village.png
│   │   ├── route-cave.png
│   │   ├── route-ancient-town.png
│   │   ├── route-forest.png
│   │   └── route-culture.png
│   ├── fallback/          # 【新建】通用 fallback
│   │   └── scenic-default.png
│   ├── brand/             # 已有 logo.png
│   ├── ai/                # 已有 aibanyou.png
│   ├── empty/             # 已有 empty-trips.png
│   └── icons/             # 已有 4 个功能图标
└── videos/                # 已有 mp4
```

---

## 七、后续执行建议

### 推荐：方案 A — 先生成 tabBar 图标 + 路线主题 fallback

**理由：**
1. tabBar 从纯文字→图标模式是当前最明显的产品感提升
2. 路线主题图可让推荐页更完整
3. 全部抽象几何图，零版权风险，脚本可自动生成
4. 景区图已覆盖 10/10，用户可后续从容替换

**下一步动作序列：**
1. 用户确认方案 A
2. Claude 通过 Node.js 脚本生成 6 个 tabBar 图标 PNG
3. Claude 生成 8 个路线主题 fallback 图（CSS 渐变抽象插画）
4. 更新 app.json 添加 iconPath / selectedIconPath
5. 更新 mock 数据 routes[] 增加主题图映射
6. 质量门验证 → git commit

### 方案 B：用户先提供真实景区图
- 替换梵净山、青岩古镇低质量图
- 补充 imageSource/imageCredit

### 方案 C：最稳小步 — 只接 tabBar 图标
- 仅 6 个图标，其他继续 fallback

---

## 八、总结

| 维度 | 已完成 | 缺失 | 下一步 |
|------|--------|------|--------|
| tabBar 图标 | 0 | 6 个 | 方案A：Claude 生成 |
| 路线封面 | 0 | 5 条路线无图 | 方案A：主题 fallback |
| 景区真实图 | 10/10 | 2 张质量低 | 方案B：用户替换 |
| 功能图标 | 4/4 | 0 | ✅ 完成 |
| AI 头像/空态/Logo | 3/3 | 0 | ✅ 完成 |
| 首页背景/视频 | 2 | 视频闲置 | 可选优化 |

**当前自动开发状态：暂停（等待图片需求分析确认）。**

## 版本

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-17 | 1.0 | 初始图片资产需求分析 |
