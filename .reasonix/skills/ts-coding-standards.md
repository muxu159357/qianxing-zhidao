---
name: ts-coding-standards
description: TypeScript/Vue 编码规范 — 不可变性、类型规范、命名、错误处理、Code Review 检查清单
---

# TypeScript/Vue 编码规范

> 整合自 common/coding-style + typescript/coding-style + common/code-review + common/patterns

## 核心原则

### Immutability（不可变性 — CRITICAL）
ALWAYS 创建新对象，NEVER 原地修改：
- 使用 spread operator 做不可变更新
- 函数返回新值而非修改参数
- Vue 3: 使用 `ref` / `reactive` 的正确不可变模式

### KISS（Keep It Simple）
- 优先选择最简单有效的方案
- 避免过早优化
- 清晰优于聪明

### DRY（Don't Repeat Yourself）
- 提取重复逻辑到共享函数/工具
- 当重复真实存在时才引入抽象，不要臆测

### YAGNI（You Aren't Gonna Need It）
- 不建未来才需要的功能和抽象
- 从简开始，压力真实存在时再重构

## 文件组织

MANY SMALL FILES > FEW LARGE FILES:
- 高内聚、低耦合
- 200-400 行典型，800 行上限
- 按功能/领域组织，不按类型

## TypeScript 类型规范

### 类型和接口
- 导出的函数、共享工具、公共类方法必须显式标注参数和返回类型
- 让 TypeScript 推断局部变量类型
- 提取重复的内联对象形状为命名类型/接口

### Interface vs Type
- `interface` → 对象形状，可能需要被扩展或实现
- `type` → 联合、交叉、元组、映射类型、工具类型
- 优先用 string literal union 而非 `enum`（除非需要互操作）

### 禁止 `any`
- 避免在应用代码中使用 `any`
- 对外部/不可信输入使用 `unknown`，然后安全 narrowing
- 类型依赖调用者时使用泛型

### Vue 3 Props 规范
```typescript
// 使用 named interface + <script setup lang="ts">
interface UserCardProps {
  user: User
  onSelect: (id: string) => void
}

const props = defineProps<UserCardProps>()
```

## 错误处理

- 每个层级显式处理错误
- UI 层提供用户友好的错误消息
- 服务端记录详细错误上下文
- 绝不静默吞掉错误

```typescript
// 正确的错误处理模式
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return 'Unexpected error'
}

async function loadData(id: string): Promise<Data> {
  try {
    return await fetchData(id)
  } catch (error: unknown) {
    console.error('[loadData] failed:', getErrorMessage(error))
    throw new Error(getErrorMessage(error))
  }
}
```

## 输入验证

- 在系统边界验证所有输入
- 使用 Zod 做 schema 验证（如果引入了的话）
- Fail fast with clear error messages
- 绝不信任外部数据

## 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 变量/函数 | `camelCase` | `getUserProfile` |
| Boolean | `is/has/should/can` 前缀 | `isLoading`, `hasPermission` |
| Interface/Type/Component | `PascalCase` | `UserCard`, `TourRoute` |
| 常量 | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT` |
| Composables | `use` 前缀 + `camelCase` | `useDebounce` |

## 代码坏味道

### 深层嵌套
用 early return 替代深层嵌套条件。

### 魔法数字
使用命名常量替代有意义的阈值、延迟、限制。

### 过长函数
将大函数拆分为职责单一的小函数（<50 行）。

## API 响应格式

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

## Repository Pattern

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

## Code Review 检查清单

完成代码前自检：
- [ ] 代码可读、命名良好
- [ ] 函数 <50 行
- [ ] 文件 <800 行
- [ ] 无深层嵌套（>4 层）
- [ ] 错误被显式处理
- [ ] 无硬编码密钥
- [ ] 无 console.log（生产代码）
- [ ] 无 `any` 类型
- [ ] 遵循不可变性

## Code Review 严重级别

| 级别 | 含义 | 操作 |
|------|------|------|
| CRITICAL | 安全漏洞或数据丢失风险 | **BLOCK** - 必须修复 |
| HIGH | Bug 或重大质量问题 | **WARN** - 应该修复 |
| MEDIUM | 可维护性问题 | **INFO** - 考虑修复 |
| LOW | 风格或小建议 | **NOTE** - 可选 |
