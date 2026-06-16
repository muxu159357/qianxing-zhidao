---
name: verification-loop
description: 修改后自动验证 — 6阶段质量门（Build→Type→Lint→Test→Security→Diff），输出验证报告
---

# Verification Loop — 修改后自动验证

> 适配自 ECC verification-loop，面向 Vue 3 + Vite + TypeScript 项目

## 触发方式

- `/verify` 或 `/验证` 或 "验证一下"
- 完成功能或重大修改后自动触发
- PR 前强制运行

---

## 验证流程（6阶段）

### Phase 1: Build 验证
```bash
npm run build 2>&1 | tail -20
```
构建失败 → **STOP**，修复后再继续。

### Phase 2: Type Check
```bash
npx vue-tsc --noEmit 2>&1 | head -40
```
报告所有类型错误。CRITICAL 级别的必须先修复。

### Phase 3: Lint 检查
```bash
npm run lint 2>&1 | head -30
```

### Phase 4: 测试套件
```bash
npm run test -- --coverage 2>&1 | tail -50
```
目标：覆盖率 ≥ 80%

### Phase 5: 安全扫描
```bash
# 检查密钥泄露
grep -rn "sk-" --include="*.ts" --include="*.vue" . 2>/dev/null
grep -rn "api_key\|API_KEY\|secret" --include="*.ts" --include="*.vue" src/ 2>/dev/null

# 检查 console.log
grep -rn "console.log" --include="*.ts" --include="*.vue" src/ 2>/dev/null
```

### Phase 6: Diff 审查
```bash
git diff --stat
```
审查每个变更文件：意外修改、缺失错误处理、边界情况。

---

## 输出格式

```
VERIFICATION REPORT
==================
Build:     [PASS/FAIL]
Types:     [PASS/FAIL] (X errors)
Lint:      [PASS/FAIL] (X warnings)
Tests:     [PASS/FAIL] (X/Y passed, Z% coverage)
Security:  [PASS/FAIL] (X issues)
Diff:      [X files changed]

Overall:   [READY/NOT READY]

Issues to Fix:
1. ...
2. ...
```

---

## 持续模式

长时间开发时每完成一个组件自检一次：

```
检查点：
- 完成每个函数后 → Type Check
- 完成组件后 → Build + Lint
- 完成页面后 → 全部6阶段
- 提交前 → 完整验证
```

---

## 与本项目规则的集成

| 阶段 | 对应规则 |
|------|----------|
| Type Check | `ts-coding-standards`（禁止 any、显式类型） |
| Security | `security-guidelines`（无硬编码密钥） |
| Diff | `dev-workflow`（Commit 格式） |
| Tests | `testing-standards`（80% 覆盖率） |
