# 黔行智导 — 全项目自动开发总控协议 · 状态追踪

> 当前状态：PHASE-5-A 分析完成，进入 PHASE-5-B seed 数据

---

## 当前状态快照

```yaml
current_phase: PHASE-5
current_stage: PHASE-5-A-COMPLETE
current_status: gap-analysis-done
last_completed_stage: PHASE-5-A
next_action: PHASE-5-B create V3 seed data migration
p0_count: 0
p1_count: 0
```

## PHASE-5-A 分析成果

| 文档 | 内容 |
|------|------|
| docs/API_FRONTEND_FIELD_MAPPING.md | 4 类实体字段映射（景点/路线/行程/知识库） |
| docs/SEED_DATA_REQUIREMENTS.md | 10 景点 + 5 路线 + 25 日程 + 7 知识库 seed 规划 |
| docs/MINIPROGRAM_BACKEND_INTEGRATION_PLAN.md | 8 阶段联调计划 |

## 关键发现

1. 字段命名差异：后端 camelCase vs 小程序简写（price→ticketPrice, days→dayCount, physicalLevel→energyLevel）
2. 路线 dailyPlan 从嵌套改为独立端点
3. 小程序 String id vs 后端 Long id（用 spotCode/routeCode 桥接）
4. JSON 字段（highlights/tips/tags）在 Java 中为 String，小程序需 JSON.parse

## 下一阶段

PHASE-5-B：通过 Flyway V3 migration 导入 10 景点 + 5 路线 + 完整关联数据
