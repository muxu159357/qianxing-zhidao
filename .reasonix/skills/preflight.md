---
name: preflight
description: 智能技能调度器 — 分析当前任务类型，自动调用所有适用的 Reasonix 技能，一键展开全部所需规则
---

# Preflight — 智能技能调度器

## 触发方式

- 用户输入 `/preflight` 或 `/调度` 或 `/开始开发`
- 用户说"我要开始写代码了"、"帮我准备好所有规则"
- **最佳实践：每次开始写代码前都说一次 `/preflight`**

---

## 技能职责

一键分析当前任务，自动调用所有适用的 Reasonix 技能，把需要的规则一次性全部展开到你面前。

---

## 执行流程

### Step 1: 判断当前任务类型

扫描用户最近的消息和你的待办清单，归类为以下一种或多种：

| 任务类型 | 判断依据 |
|----------|----------|
| 🆕 新功能开发 | 用户说"开发"、"新建"、"实现"某个页面/组件/模块 |
| 🔧 修改/重构 | 用户说"改"、"修"、"优化"、"重构"已有代码 |
| 🧪 写测试 | 用户说"测试"、"单元测试"、"覆盖率" |
| 🔒 安全审查 | 涉及用户输入、API 调用、密钥管理、敏感数据 |
| 📝 提交代码 | 用户说"提交"、"commit"、"推送" |
| 🗜️ 上下文长了 | 对话超过 15 轮 |
| 🧹 结束工作 | 用户说"今天就到这里"、"差不多了"、"总结一下" |

### Step 2: 匹配技能 → 自动调用

根据任务类型，**依次调用**对应的技能（调用 `run_skill`）。

> 重要：只调用**本次任务类型需要的**技能，不全部无脑加载。

| 任务类型 | 自动调用 | 原因 |
|----------|----------|------|
| 🆕 新功能 | `dev-workflow` + `ts-coding-standards` | 需要完整流程+编码规范 |
| 🔧 修改/重构 | `ts-coding-standards` | 只需编码规范 |
| 🧪 写测试 | `testing-standards` + `ts-coding-standards` | 测试规范+编码规范 |
| 🔒 安全相关 | `security-guidelines` | 安全检查清单 |
| 📝 提交代码 | `dev-workflow` | Commit 格式+PR 流程 |
| 🗜️ 上下文长了 | `context-compressor` | 压缩保存 |
| 🧹 结束工作 | `conversation-memory` + `context-compressor` | 保存记忆+压缩 |

### Step 3: 输出调度摘要

技能全部加载完毕后，输出一句话摘要：

```
✅ Preflight 完成: 已加载 [dev-workflow, ts-coding-standards]
📋 当前任务: 开发 ProfileView.vue
⚠ 提醒: 图片优先真实照片，缺失时找用户要
```

---

## 智能跳过机制

以下技能**不需要每次调**，preflight 会自动跳过：

- `ts-coding-standards` 核心规则已熔入 CLAUDE.md → 只在复杂重构时加载完整版
- `security-guidelines` → 只在涉及输入/API/密钥时加载
- `testing-standards` → 只在写测试时加载
- `find-skills` → 只在用户明确搜索技能时加载

---

## 示例

### 用户说 "/preflight"

```
🔍 分析当前任务...
   - 对话中检测到: "开发 ProfileView.vue"
   - 任务类型: 🆕 新功能开发

📥 自动加载技能:
   1. dev-workflow — 功能实现流程 + Commit 格式
   2. ts-coding-standards — 不可变性、类型规范、命名、Code Review 清单

✅ Preflight 完成。两条技能指令已展开。
   现在可以开始写代码了。需要我先列出 ProfileView 的开发计划吗？
```

### 用户说 "帮我改一下 HomeView 的按钮颜色"

```
🔍 分析...
   - 任务类型: 🔧 小修改

📥 自动跳过: dev-workflow（小修改不需要完整流程）
   📥 自动跳过: ts-coding-standards（核心规则已在 CLAUDE.md 自动生效）

✅ Preflight 完成。核心规则自动生效中，无需额外加载。
   直接改就行了。
```

---

## 设计哲学

- **高频铁律** → 熔入 CLAUDE.md，自动生效，零成本
- **任务专属规则** → preflight 按需加载，不浪费上下文
- **完整版指令** → 仍然可通过 `/name` 单独调用
- 目标：**每一次写代码都自动有规范护航，而不需要每次都手动调技能**
