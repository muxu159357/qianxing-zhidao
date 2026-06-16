# 黔行智导 — 全项目自动开发总控协议 · 测试计划

> 本文件定义全项目自动测试策略和检查清单。
> 当前阶段以静态检查和手动验证为主，自动化测试框架在 PHASE-2 建立。

---

## 一、测试策略总览

| 层级 | 范围 | 方式 | 频率 | 负责阶段 |
|------|------|------|------|---------|
| L1 静态检查 | JS/WXML/WXSS/JSON 语法 | 微信开发者工具编译 | 每次改动后 | PHASE-1~6 |
| L2 路径检查 | 页面跳转正确性 | 脚本扫描 | 每阶段完成后 | PHASE-2+ |
| L3 禁词扫描 | 禁用词汇检测 | 脚本扫描 | 每阶段完成后 | PHASE-2+ |
| L4 Storage 审计 | storage key 追踪 | 脚本扫描 | 每阶段完成后 | PHASE-2+ |
| L5 流程冒烟 | 14 步主演示流程 | 手动验证 | 每 Phase 完成后 | PHASE-1~6 |
| L6 后端测试 | 单元测试 + 接口测试 | JUnit/Postman | PHASE-4 起 | PHASE-4+ |
| L7 联调测试 | 前后端数据流 | 手动 + 脚本 | PHASE-5 起 | PHASE-5+ |

---

## 二、L1 静态检查

### 检查项目

| # | 检查项 | 工具 | 严重级别 |
|---|--------|------|---------|
| 1 | WXSS 编译错误 | 微信开发者工具 | P0 |
| 2 | WXML 编译错误 | 微信开发者工具 | P0 |
| 3 | JS 语法错误 | 微信开发者工具 | P0 |
| 4 | JSON 配置文件错误 | 微信开发者工具 | P0 |
| 5 | 页面注册完整性 | app.json 对比 pages/ 目录 | P0 |
| 6 | CSS 变量/var() 使用 | grep 扫描 | P1 |
| 7 | `>` 子选择器使用 | grep 扫描 | P1 |
| 8 | 中文 WXSS class | grep 扫描 | P1 |
| 9 | Emoji 残留 | grep 扫描 | P1 |
| 10 | 文件行数超过 800 | wc 统计 | P1 |

### 检查命令

```bash
# WXSS 语法（微信开发者工具编译时自动检查）
# CSS 变量扫描
grep -r "var(" miniprogram/pages/ miniprogram/app.wxss
# 子选择器扫描
grep -r ">" miniprogram/pages/*/*.wxss miniprogram/app.wxss
# 中文 class 扫描
grep -rP "\.[a-z-]*[一-鿿]" miniprogram/pages/ miniprogram/app.wxss
```

---

## 三、L2 页面路径检查

### 检查项

| # | 检查项 | 说明 |
|---|--------|------|
| 1 | 所有 `wx.navigateTo` 目标页面存在 | 对比 app.json pages 列表 |
| 2 | 所有 `wx.switchTab` 目标页面在 tabBar 中 | 对比 app.json tabBar.list |
| 3 | 零 `wx.reLaunch` 调用 | 项目规范禁止 |
| 4 | 所有 `wx.redirectTo` 调用合理 | 检查是否必要 |

### 跳转方式规范

| 目标页面 | 正确跳转方式 |
|---------|------------|
| 首页 (index) | `wx.switchTab` |
| AI 伴游 (guide) | `wx.switchTab` |
| 我的行程 (my-trips) | `wx.switchTab` |
| 其他所有页面 | `wx.navigateTo` |

---

## 四、L3 禁词扫描

### 禁用词汇清单

扫描范围：`miniprogram/pages/` + `miniprogram/utils/`（用户可见文案）

```
Demo, demo, 测试, 比赛, 参赛, 评委, 路演, 演示流程,
占位页, 开发中, Mock, mock, 假数据, 临时页面, TODO,
test, coming soon, 演示, AI导游, AI向导, ai-guide,
实时预警, 实时监测, 实时定位, 救援, 当前天气, 实时天气, 实时路况
```

### 允许例外

- `shared/mock/` 目录（内部开发用）
- `CLAUDE.md`（规则文件）
- 所有 `AUTO_DEV_*.md`（开发管理文件）
- `FINAL_*` 文件（交付文档）
- 代码注释中的技术说明

---

## 五、L4 Storage Key 审计

### 基线 Key 清单（6 个）

| Key | 类型 | 最大写入点 |
|-----|------|-----------|
| `qianxing_profile` | 长期 | 1（planner.js） |
| `qianxing_selection` | 长期 | 1（planner.js） |
| `qianxing_trips` | 长期 | 1（utils/trip-storage.js） |
| `qianxing_pending_context` | 临时 | 2（scenic-detail.js, trip-detail.js） |
| `qianxing_pending_question` | 临时 | 1（knowledge.js） |
| `qianxing_pending_route` | 临时 | 1（route-detail.js） |

### 审计规则

- 新增 key：必须记录在本文件和 AUTO_DEV_STATE.md
- key 重命名：禁止
- `qianxing_trips` 写入：必须通过 `utils/trip-storage.js`，不允许直接 `setStorageSync('qianxing_trips')`
- 临时 key：读后必须清除（`removeStorageSync`）

---

## 六、L5 14 步主演示流程回归

> 详见 `FINAL_DEMO_SCRIPT.md`

每次 Phase 完成后必须手动验证完整流程：

```
1.  首页 → 浏览品牌区、能力卡片、精选路线
2.  首页 → 点击"开始智能规划" → 兴趣选择页
3.  兴趣选择 → 选择标签 + 参数 → 生成画像
4.  画像页 → 查看匹配度 → 查看推荐路线
5.  路线推荐 → 展开路线 → 查看推荐理由
6.  路线推荐 → 点击路线 → 路线详情
7.  路线详情 → 查看安全守护模块
8.  路线详情 → 保存到我的行程
9.  路线详情 → 询问 AI 伴游
10. AI 伴游 → 行程上下文对话
11. 首页 → 景点知识库 → 搜索/筛选
12. 知识库 → 景点详情 → 相关路线
13. 景点详情 → 询问 AI 伴游
14. 我的行程 → 查看/管理/删除行程
```

---

## 七、L6 后端测试（PHASE-4+）

### 单元测试

- 框架：JUnit 5 + Mockito
- 目标覆盖率：不低于 80%
- 测试范围：Service 层、Repository 层、工具类

### 接口测试

- 框架：Spring Boot Test + MockMvc
- 测试范围：所有 REST 端点
- 覆盖：正常请求、异常请求、边界值、权限

---

## 八、L7 前后端联调测试（PHASE-5+）

### 联调检查清单

- [ ] 路线列表数据来自后端
- [ ] 路线详情数据来自后端
- [ ] 景点数据来自后端
- [ ] 知识库数据来自后端
- [ ] 行程 CRUD 全部通过后端
- [ ] 行程状态更新持久化
- [ ] 行程复盘持久化
- [ ] AI 助手上下文存取正常
- [ ] 降级到 mock 模式功能正常
- [ ] 14 步演示流程全部通过

---

## 版本历史

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-16 | 1.0 | 初始化测试计划 |
