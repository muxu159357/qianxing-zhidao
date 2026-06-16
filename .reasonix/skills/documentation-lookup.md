---
name: documentation-lookup
description: 实时文档查询 — 用 web_fetch 替代 Context7 MCP，适配 Vue3/ElementPlus/GSAP/小程序 技术栈
---

# Documentation Lookup — 实时文档查询

> 适配自 ECC documentation-lookup，使用 web_fetch 代替 Context7 MCP

## 触发方式

- `/docs <库名> <问题>` 或 `/查文档`
- "React 19 的 use() 怎么用？"
- "Element Plus 的 table 组件支持虚拟滚动吗？"
- 需要最新 API 信息而非训练数据时

---

## 查询流程

### Step 1: 确定文档源

| 库/框架 | 文档 URL | 优先级 |
|---------|----------|--------|
| Vue 3 | `https://cn.vuejs.org/api/` | 本栈最高 |
| Element Plus | `https://element-plus.org/zh-CN/component/` | 本栈最高 |
| GSAP | `https://gsap.com/docs/v3/` | 常用 |
| Vite | `https://cn.vitejs.dev/config/` | 常用 |
| TypeScript | `https://www.typescriptlang.org/docs/` | 常用 |
| 微信小程序 | `https://developers.weixin.qq.com/miniprogram/dev/api/` | 小程序端 |
| PostgreSQL | `https://www.postgresql.org/docs/current/` | 后端 |
| 通用搜索 | `https://developer.mozilla.org/zh-CN/` | 兜底 |

### Step 2: 精确查询

```bash
# 用 web_fetch 直接抓文档页面
web_fetch https://cn.vuejs.org/api/composition-api-setup.html
web_fetch https://element-plus.org/zh-CN/component/table.html
```

### Step 3: 返回最佳答案

从文档中提取：
- 最新 API 签名
- 正确的代码示例
- 版本注意事项

---

## 使用示例

### 用户问 "Vue 3 的 defineModel 怎么用？"

```
1. web_fetch https://cn.vuejs.org/api/sfc-script-setup.html#definemodel
2. 提取 API 签名和使用示例
3. 给出答案（带版本标注：Vue 3.4+）
```

### 用户问 "Element Plus table 怎么排序？"

```
1. web_fetch https://element-plus.org/zh-CN/component/table.html
2. 找到 sortable prop 和 sort-change 事件
3. 给出最小可运行示例
```

---

## 最佳实践

- **先查中文文档** — Vue/Element Plus 中文文档质量高
- **版本标注** — 返回时注明适用的版本范围
- **最小示例** — 给出可直接使用的代码片段
- **不超过3次查询** — 3次查不到就承认不确定，不做无谓的猜测

---

## 与本项目的集成

本项目技术栈查询优先级：
1. Vue 3.5 + `<script setup>` + Composition API
2. Element Plus 2.9
3. GSAP 3.15
4. Vite 6
5. TypeScript 5.7
