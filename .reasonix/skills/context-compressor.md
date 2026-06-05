---
name: context-compressor
description: 上下文压缩器 — 在上下文超限前自动保存关键信息到对话记忆，生成紧凑恢复摘要，支持在新会话中无缝恢复工作状态
---

# Context Compressor — 上下文压缩与恢复技能

## 触发方式

- 用户输入 `/compress` 或 `/压缩` 或 `/context-compressor`
- 用户说"压缩上下文"、"太长了我怕超"、"总结一下重新开始"
- **主动建议**：当对话超过 15 轮时，主动询问是否需要压缩

---

## 技能职责

在上下文窗口接近上限前，自动完成三件事：
1. **保存** — 将当前对话的关键状态写入 conversation-memory
2. **压缩** — 生成一份紧凑的"上下文恢复摘要"
3. **输出** — 吐出一个`---CONTEXT-RESUME---`块，用户可以复制到新会话中恢复

---

## 一、压缩执行流程

### Step 1: 盘点当前状态

扫描当前对话，提取以下信息：

1. **项目信息**
   - 项目名 + 当前阶段
   - 技术栈（Vue 3 / 小程序 / ...）

2. **当前任务**
   - 正在做什么
   - 完成了哪些步骤（已完成 ✓ / 进行中 ⏳ / 未开始）
   - TodoWrite 中的状态

3. **关键决策**
   - 本次对话中做出的架构/设计决策（每条 ≤ 1 行）

4. **已修改文件清单**
   - 文件路径 + 简要改动说明

5. **待续事项**
   - 下一步要做什么
   - 需要用户确认的事项
   - 已知阻塞项

6. **有效信息**
   - 哪些用户反馈/偏好需要记住
   - 哪些发现/结论仍然有效

### Step 2: 写入 conversation-memory

将以上信息打包成一条对话记忆记录，写入：
```
.reasonix/conversation-memory/conversations/YYYY-MM-DD-NNN-context-compress.md
```

并在 INDEX.md 中标注 `[COMPRESSED]` 标记。

### Step 3: 输出压缩摘要

按以下格式输出完整的上下文恢复块：

```
---CONTEXT-RESUME---
项目: qianxing-zhidao
阶段: [当前阶段]
技术栈: [Vue 3 + ...]

当前任务: [正在做什么]
进度: [✓步骤1] [⏳步骤2] [ 步骤3]

关键决策:
- [决策1]
- [决策2]

已修改文件:
- `path/to/file1` — [改动说明]
- `path/to/file2` — [改动说明]

下一步:
- [下一步1]
- [下一步2]

待确认: [如有]
---END---
```

用户可以将这个块粘贴到新会话中，让我立刻恢复工作状态。

---

## 二、渐进式压缩

### Level 1 — 轻量压缩（对话 15-25 轮）
- 只做 Step 1 盘点 + Step 3 摘要输出
- 不写入 memory 文件
- 用户可随时用摘要恢复

### Level 2 — 深度压缩（对话 >25 轮 或 用户明确要求）
- 完整执行 Step 1-3
- 写入 conversation-memory 文件
- 输出完整 CONTEXT-RESUME 块

### Level 3 — 紧急压缩（感觉快到上限时）
- 完整保存 + 压缩
- 额外建议用户**开启新会话**并粘贴 CONTEXT-RESUME
- 列出哪些信息可能会丢失

---

## 三、压缩时的取舍原则

### 保留（高优先级）
- 当前任务的进度和下一步
- 用户明确的偏好/反馈
- 架构决策和原因
- 修改过的文件列表
- 待确认的阻塞项

### 丢弃（低优先级）
- 中间探索过程的详细对话
- 已解决的问题讨论
- 工具的中间输出
- 调试日志和错误堆栈
- 已完成的步骤细节（保留摘要即可）

---

## 四、压缩摘要格式规范

- 每条信息 ≤ 1 行
- 文件路径使用相对于项目根的路径
- 决策描述包含"为什么"（≤ 20 字）
- 不使用代码块，纯文本优先
- 整个 CONTEXT-RESUME 块目标 < 200 行

---

## 五、恢复流程

当用户在新会话中粘贴 CONTEXT-RESUME 块时：

1. 解析项目名、阶段、技术栈
2. 读取 CLAUDE.md 加载项目规则
3. 恢复 TodoWrite 状态
4. 确认当前步骤继续执行
5. 检查 conversation-memory 确认是否有遗漏

---

## 六、示例

### 压缩后输出示例：

```
---CONTEXT-RESUME---
项目: qianxing-zhidao (黔行智导)
阶段: Web端Demo闭环 - 第2页开发

当前任务: 开发 PlacerView.vue（游客兴趣选择页）
进度: [✓类型定义] [✓Mock数据] [✓AppNavbar提取] [⏳PlannerView] [ ] ProfileView [ ] RouteRecommendView [ ] AiGuideView [ ] ScenicKnowledgeView [ ] AdminDashboardView [ ] DemoFlowView

关键决策:
- AppNavbar已提取为全局组件，HomeView已改造完毕
- 兴趣标签8个：自然风光/民族文化/古镇历史/户外探险/美食特产/避暑康养/摄影打卡/亲子研学
- 景点数据必须基于贵州真实景点，至少8个

已修改文件:
- src/types/index.ts — 新增Attraction、TourRoute、InterestTag类型
- src/mock/attractions.ts — 10个贵州真实景点数据
- src/components/layout/AppNavbar.vue — 全局导航栏组件
- src/App.vue — 集成AppNavbar布局

下一步:
- 完成PlannerView.vue的模板和交互逻辑
- 打通首页"开始智能规划"按钮→/planner

待确认: 用户要求图片优先用真实照片，缺失时找用户要
---END---
```

---

## 七、主动建议机制

在以下情况，**主动**询问用户是否需要压缩：
- 对话轮次超过 15 轮
- 刚刚完成了大批量修改
- 用户说了"继续"、"接下来"等表示还有更多任务
- 连续修改了 5+ 个文件
