---
name: testing-standards
description: 测试规范 — TDD 工作流、AAA 模式、覆盖率要求、测试命名、Vue 3 组件测试
---

# Testing Standards

> 整合自 common/testing + typescript/testing

## 最低测试覆盖率: 80%

测试类型（全部需要）：
1. **Unit Tests** - 独立函数、工具、组件
2. **Integration Tests** - API 端点、数据库操作
3. **E2E Tests** - 关键用户流程

## Test-Driven Development

强制工作流：
1. 先写测试（RED）
2. 运行测试 — 应该 FAIL
3. 写最小实现（GREEN）
4. 运行测试 — 应该 PASS
5. 重构（IMPROVE）
6. 验证覆盖率（80%+）

## Test Structure (AAA Pattern)

```typescript
test('calculates similarity correctly', () => {
  // Arrange
  const vector1 = [1, 0, 0]
  const vector2 = [0, 1, 0]

  // Act
  const similarity = calculateCosineSimilarity(vector1, vector2)

  // Assert
  expect(similarity).toBe(0)
})
```

## Test Naming

使用描述行为的名词：

```typescript
test('returns empty array when no markets match query', () => {})
test('throws error when API key is missing', () => {})
test('falls back to substring search when Redis is unavailable', () => {})
```

## 测试故障排查

1. 检查测试隔离
2. 验证 mock 设置正确
3. 修复实现而非测试（除非测试本身有误）

## E2E Testing

使用 **Playwright** 作为 E2E 测试框架。

## Vue 3 组件测试

- 使用 Vitest + @vue/test-utils
- 测试组件渲染、用户交互、props/events
- Mock 外部依赖（API 调用、路由等）
