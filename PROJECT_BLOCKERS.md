# 黔行智导 · 项目阻塞记录

> 长期连续开发模式 | 阻塞记录
> 遇到阻塞时记录，跳过该项继续其他开发

---

## 2026-06-18 — Redis 不可用（已降级解决）

- 模块：AI 线路草稿（P2）
- 当前：ConcurrentHashMap 内存缓存，TTL=3600s，commit 4febdd1
- 风险：重启后草稿丢失（开发阶段可接受）
- 后续：安装 Redis 后替换 AiPlanDraftCache
