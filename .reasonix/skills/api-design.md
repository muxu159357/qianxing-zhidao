---
name: api-design
description: REST API 设计规范 — 端点命名、分页、验证(Zod)、错误处理、认证、限流、性能优化
---

# API Design Patterns — 后端 API 设计规范

## 触发方式
- 设计后端接口时 · 写 API 文档时 · 对接前后端时

## 核心原则
> 一次只做一件事，做好它。
- 单一职责端点 · 输入验证在边界 · 错误响应统一格式 · 认证/授权显式声明

## 端点命名规范
```
GET    /api/resource          # 列表（?page=&limit=&sort=）
GET    /api/resource/:id      # 详情
POST   /api/resource          # 创建
PUT    /api/resource/:id      # 全量更新
DELETE /api/resource/:id      # 删除
POST   /api/visitor-profile/generate   # AI 生成类动作端点
```

## 统一响应格式
```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: { total: number; page: number; limit: number }
}
```

## 分页规范
```typescript
interface PaginationParams { page?: number; limit?: number }  // 默认 page=1 limit=20 max=100
interface PaginationMeta { total: number; page: number; limit: number; totalPages: number }
```

## 输入验证 (Zod)
```typescript
const createRouteSchema = z.object({
  name: z.string().min(2).max(200),
  days: z.number().int().min(1).max(30),
  physicalLevel: z.enum(['轻松','适中','挑战'])
})
const validated = createRouteSchema.parse(req.body)
```

## 错误处理
```typescript
class ApiError extends Error {
  constructor(public statusCode: number, message: string, public isOperational = true) { super(message) }
}
// 统一 handler: ApiError→statusCode, ZodError→400, unknown→500(不泄露内部细节)
```

## 认证模式
`Header: Authorization: Bearer <JWT_TOKEN>` → 中间件验证 → 注入 user context → 权限检查

## 速率限制
通用 100req/min · AI接口 20req/min · 管理 200req/min

## 性能优化
- 列表接口必备: 分页 + 字段筛选(?fields=) + 排序(?sort=-rating)
- 关联数据: 默认不include, 按需 ?include=attractions

## 版本管理
URL版本: `/api/v1/resource` · Demo阶段可不版本化但路径预留
