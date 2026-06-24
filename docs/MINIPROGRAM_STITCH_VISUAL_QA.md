# 小程序 Stitch 视觉验收清单

## 当前视觉相关 Commit
- `42c025b`: 基于 Stitch HTML 复刻核心页面视觉
- `a3cbca7`: 回补图标资源并统一 Stitch 视觉细节
- `2175308`: 统一主流程剩余页面 Stitch 视觉

## 检查页面清单（app.json 注册的14页）
| # | 页面 | 路径 | 视觉状态 |
|---|------|------|----------|
| 1 | 登录 | pages/login/login | 已统一(#f8f9fa背景) |
| 2 | 首页 | pages/index/index | Stitch复刻完成 |
| 3 | 兴趣选择 | pages/planner/planner | 已统一 |
| 4 | 画像 | pages/profile/profile | 颜色已统一 |
| 5 | 路线推荐 | pages/recommend/recommend | 颜色已统一 |
| 6 | 路线详情 | pages/route-detail/route-detail | Stitch复刻完成 |
| 7 | AI助手 | pages/guide/guide | Stitch复刻完成 |
| 8 | 知识库 | pages/knowledge/knowledge | 颜色已统一 |
| 9 | 景点详情 | pages/scenic-detail/scenic-detail | Stitch复刻完成 |
| 10 | 我的行程 | pages/my-trips/my-trips | Stitch复刻完成 |
| 11 | AI草稿预览 | pages/ai-plan-preview/ai-plan-preview | 颜色已统一 |
| 12 | 行程详情 | pages/trip-detail/trip-detail | 颜色+子文件已统一 |

## 静态检查结果（2026-06-24）
- [x] WXSS 零 var()
- [x] WXSS 零 :root
- [x] 零外部图片热链
- [x] 零外部字体链接
- [x] 零外部图标链接
- [x] 零禁用文案(AI导游/AI向导/Mock/Demo/测试/TODO)
- [x] 零旧色残留(#1f8f5f/#2f6bff/rgba旧值)
- [x] app.json 页面路径无缺失

## 图片资源检查结果
- [x] assets/stitch/ — 12张Stitch图片全部存在
- [x] assets/icons/tabbar/ — 6张tabBar图标全部存在
- [x] assets/images/ai/aibanyou.png — 存在
- [x] assets/images/empty/empty-trips.png — 存在
- [x] assets/images/icons/ — 4张功能图标存在
- [x] assets/images/routes/ — 8张路线图片存在
- [x] assets/images/scenic/ — 9张景区图片存在

## custom-tab-bar 检查结果
- [x] 4文件完整(index.js/index.wxml/index.wxss/index.json)
- [x] 三项路径正确
- [x] 使用 wx.switchTab
- [x] 高亮: selected数据绑定 + 薄荷绿胶囊
- [x] 使用本地PNG图标

## 遮挡风险检查
- AI助手: padding预留120rpx ✓
- 路线详情: padding预留120rpx ✓
- 景点详情FAB: bottom:160rpx ✓

## 人工验收步骤
1. 编译 → 首页 → Hero/Bento/景区横滚/推荐路线
2. AI助手 → 气泡/快捷问题/输入框/草稿卡
3. 我的行程 → 卡片/状态chip/空状态图
4. 路线详情 → Hero/三格统计/时间线/底部按钮
5. 景点详情 → Hero遮罩/Bento亮点/出行提醒/浮动按钮
6. 首页→智能规划→兴趣选择→画像→路线推荐→保存
7. AI助手→快捷问题→生成草稿→保存
8. 我的行程→点击→行程详情
9. 知识库→搜索→询问AI伴游→跳转AI助手
10. tabBar三项切换+高亮
11. 模拟器切换机型，验证无遮挡
