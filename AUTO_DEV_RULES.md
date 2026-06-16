# 黔行智导 — 全项目自动开发总控协议 · 规则文件

> 本文件为自动开发总控协议的核心规则文件。
> 每次自动开发阶段启动时必须先读取本文件。
> 违反本文件中任何硬规则将导致自动开发立即停止。

---

## 一、自动开发原则

以下规则为自动开发硬约束，任何阶段不得违反：

1. **每次只做一个阶段** — 不允许跨阶段开发或并行多个阶段
2. **每个阶段必须有开发、审核、质量门、修复、复验** — 五个环节缺一不可
3. **有 P0/P1 必须先修复** — 不允许带着已知问题进入下一阶段
4. **禁止跳过质量门** — 每个阶段完成后必须执行质量门检查
5. **禁止一次性改全项目** — 每个阶段修改文件数不超过 10 个（除全量回归阶段）
6. **禁止无计划新增功能** — 所有功能必须先出现在 AUTO_DEV_QUEUE.md 中
7. **禁止改 storage key** — 已有 key 名称不可修改，新增 key 需要明确记录
8. **禁止改数据结构** — 除非进入后端数据建模阶段（PHASE-3）并有迁移说明
9. **禁止改 tabBar** — tabBar 配置及页面路径不可修改
10. **禁止改页面路径** — 已有页面路径不可修改
11. **禁止删除页面** — 已有页面不可删除
12. **禁止接入未经确认的外部服务** — 包括但不限于天气API、地图API、支付、短信
13. **禁止写死真实密钥** — 所有密钥必须通过环境变量或配置文件注入
14. **禁止提交敏感信息** — 包括密钥、Token、数据库连接串、服务器IP

---

## 二、每阶段固定流程

每个自动开发阶段必须严格按以下 18 步执行：

```
Step  1: 读取 AUTO_DEV_STATE.md
Step  2: 读取 AUTO_DEV_QUEUE.md
Step  3: 读取 AUTO_DEV_RULES.md（本文件）
Step  4: 读取 PROJECT_PROGRESS.md
Step  5: 确认当前阶段目标
Step  6: 执行当前阶段开发
Step  7: 调用 code-reviewer 代理
Step  8: 执行质量门检查
Step  9: 如果 P0/P1 > 0，执行最小修复（只修问题，不做额外改动）
Step 10: 再次 code-reviewer
Step 11: 再次质量门
Step 12: 通过后更新 AUTO_DEV_STATE.md
Step 13: 更新 AUTO_DEV_REPORT.md
Step 14: 更新 PROJECT_PROGRESS.md
Step 15: git status
Step 16: git add <具体修改文件>
Step 17: git commit -m "<type>(auto): <description>"
Step 18: 标记当前阶段完成，进入下一阶段
```

### 修复循环上限

- 如果 Step 9-11 循环超过 2 轮仍未清零 P0/P1，立即停止并等待用户介入
- 不允许无限修复循环

---

## 三、自动继续条件

只有**全部**满足以下条件时，才能自动进入下一阶段：

- [ ] P0 = 0
- [ ] P1 = 0
- [ ] code-reviewer 结果 APPROVE
- [ ] JS/WXML/WXSS 零编译错误
- [ ] 后端编译或测试通过（如适用）
- [ ] 禁词扫描零命中（pages/ 目录和 utils/ 目录）
- [ ] storage key 未误改（与上阶段对比一致）
- [ ] 页面路径未误改（与上阶段对比一致）
- [ ] tabBar 未误改（与上阶段对比一致）
- [ ] 无敏感信息泄露
- [ ] git status 正常（无意外修改）

---

## 四、必须停止条件

遇到以下**任一**情况，自动开发必须立即停止，等待用户确认：

### 技术阻塞

- P0 无法自动修复（经过 2 轮修复循环仍未解决）
- P1 连续 2 轮修复仍存在
- 编译错误无法定位（错误信息不明确，超过 30 分钟未解决）
- git 冲突（merge conflict 或 rebase conflict）

### 需要用户决策

- 需要用户确认 UI 大方向（整体风格变更、页面重设计）
- 需要用户确认图片素材（新景点图、新品牌素材）
- 需要修改项目技术栈（框架升级、新依赖引入）
- 需要改变主流程（影响 14 步演示流程的改动）
- 需要改变数据结构且影响旧数据（storage 迁移、字段重命名）

### 需要外部资源

- 需要真实接口密钥（AI API Key、天气 API Key 等）
- 需要真实数据库连接信息（数据库URL、账号、密码）
- 需要支付/登录/短信等第三方配置
- 需要部署服务器账号（生产环境、测试环境）

### 危险操作

- 需要删除大量文件（5 个以上文件）
- 需要重置数据库
- 需要 force push 或修改 git 历史

---

## 五、文件修改权限

### 允许修改范围（按阶段）

| 阶段 | 允许修改 |
|------|---------|
| PHASE-1 (V20-x) | `miniprogram/pages/*/` WXML/WXSS 文件，`app.wxss` |
| PHASE-2 (V21-x) | `scripts/` 目录，测试脚本 |
| PHASE-3 (V22-x) | `docs/` 目录，设计文档 |
| PHASE-4 (V23-x) | `backend/` 目录 |
| PHASE-5 (V24-x) | `miniprogram/api/` + `miniprogram/pages/*/` JS 文件 |
| PHASE-6 (V25-x) | 全项目只读检查 |

### 始终禁止修改

- `app.json`（除非 PHASE-1 明确允许的视觉配置）
- `FINAL_DELIVERY_CHECKLIST.md`
- `FINAL_DEMO_SCRIPT.md`
- `CLAUDE.md`（除非更新阶段信息）
- `.codegraph/` 目录

---

## 六、Git 提交规范

### 提交信息格式

```
<type>(auto): <description>
```

Types: `feat` / `fix` / `refactor` / `docs` / `test` / `chore` / `style`

### 提交前检查

1. `git status` 确认修改范围
2. 只 `git add` 明确修改的文件（禁止 `git add -A` 或 `git add .`）
3. 不提交 `.codegraph/daemon.pid`
4. 不提交 node_modules、.env、密钥文件

---

## 七、质量门标准

每个阶段的质量门检查必须覆盖：

| 检查项 | 标准 | 严重级别 |
|--------|------|---------|
| 编译错误 | 0 | P0 |
| WXSS 语法错误 | 0 | P0 |
| JS 运行时错误 | 0 | P0 |
| 禁词命中 | 0（pages/ + utils/） | P0 |
| 页面白屏 | 0 | P0 |
| storage key 误改 | 0 | P0 |
| tabBar 异常 | 0 | P0 |
| 跳转错误 | 0 | P0 |
| CSS 变量/var() | 0 | P1 |
| `>` 子选择器 | 0 | P1 |
| 中文 WXSS class | 0 | P1 |
| Emoji 残留 | 0 | P1 |
| 文件超过 800 行 | 0 | P1 |
| 函数超过 50 行 | 建议拆分 | P2 |

---

## 八、知识库与上下文

自动开发阶段启动时，必须加载以下上下文：

1. `CLAUDE.md` — 产品定位、赛题对齐、文案规则、禁止事项
2. `PROJECT_PROGRESS.md` — 历史进度、已知问题
3. `AUTO_DEV_STATE.md` — 当前状态
4. `wechat-miniprogram` skill — 小程序开发规范
5. `qianxing-zhidao-development` skill — 项目专属规范

---

## 版本历史

| 日期 | 版本 | 说明 |
|------|------|------|
| 2026-06-16 | 1.0 | 初始版本，配合 V20-A 完成建立 |
