# 黔行智导 · 项目阻塞记录

> 长期连续开发模式 | 阻塞记录
> 遇到阻塞时记录，跳过该项继续其他开发

---

## 2026-06-18 — Redis 不可用

- 所属模块：AI 线路草稿（P2）
- 阻塞原因：本地未安装 Redis，pom.xml 无依赖
- 已尝试：方案文档就绪（docs/AI_ACTION_AND_DRAFT_PLAN.md）
- 跳过方式：先推进 P1/P3 功能，Redis 草稿后续接入
- 风险：AI 草稿无法持久化，不影响当前对话和行程功能
- 恢复条件：安装 Redis + 添加 spring-boot-starter-data-redis
