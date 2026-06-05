---
name: dev-workflow
description: 开发工作流 — 功能实现流程、Commit 格式、TDD、Code Review、TodoWrite 实践
---

# 开发工作流

> 整合自 common/development-workflow + common/git-workflow

## 功能实现工作流

0. **Research & Reuse**（新实现前必须）
   - 先搜索现有实现（GitHub、npm、现有代码）
   - 优先采用经过验证的方案而非从头写

1. **Plan First**
   - 先制定实现计划
   - 在写代码前产出：PRD、架构、技术文档、任务清单
   - 识别依赖和风险
   - 分阶段拆解

2. **TDD Approach**
   - 先写测试（RED）
   - 实现让测试通过（GREEN）
   - 重构（IMPROVE）
   - 验证 80%+ 覆盖率

3. **Code Review**
   - 写代码后立即自审
   - 处理 CRITICAL 和 HIGH 问题
   - 尽可能修复 MEDIUM 问题

4. **Commit & Push**
   - 详细的提交消息
   - 遵循 conventional commits 格式

## Commit Message 格式

```
<type>: <description>

<optional body>
```

**Types:** feat, fix, refactor, docs, test, chore, perf, ci

## Pull Request 流程

1. 分析完整提交历史（不只是最新提交）
2. 使用 `git diff [base-branch]...HEAD` 查看所有变更
3. 起草完整的 PR 摘要
4. 包含测试计划和 TODO
5. 新分支用 `-u` 标志推送

## TodoWrite 最佳实践

- 多步骤任务用 TodoWrite 追踪进度
- 验证对指令的理解
- 展示细粒度的实现步骤

Todo list 暴露的问题：
- 顺序错误
- 缺项
- 多余项
- 粒度不对
- 需求理解偏差

## 每次开发前必须输出

1. **本次目标：** 一句话描述
2. **所属端：** Web 端 / 小程序端 / 双端共享
3. **涉及文件：** 新建/修改的文件列表
4. **预期效果：** 用户可见效果
5. **验证方式：** 如何确认成功
