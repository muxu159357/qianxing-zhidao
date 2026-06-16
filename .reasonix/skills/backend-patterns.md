---
name: backend-patterns
description: 后端设计模式 — Repository/Service/Cache/认证/事务，面向 Node.js + PostgreSQL
---

# Backend Patterns — 后端设计模式

> 适配自 ECC backend-patterns，面向 Node.js/PostgreSQL

## 触发方式

- 设计后端架构时
- 实现数据访问层时
- 后端对接阶段开发时

---

## Repository Pattern（数据访问层）

```typescript
// 接口定义
interface ScenicRepository {
  findAll(filters?: ScenicFilters): Promise<Attraction[]>
  findById(id: string): Promise<Attraction | null>
  search(keyword: string): Promise<Attraction[]>
}

// PostgreSQL 实现
class PostgresScenicRepository implements ScenicRepository {
  constructor(private db: Pool) {}

  async findById(id: string): Promise<Attraction | null> {
    const { rows } = await this.db.query(
      'SELECT * FROM scenic_spots WHERE id = $1', [id]
    )
    return rows[0] ?? null
  }

  async findAll(filters?: ScenicFilters): Promise<Attraction[]> {
    let sql = 'SELECT * FROM scenic_spots WHERE 1=1'
    const params: unknown[] = []

    if (filters?.category) {
      params.push(filters.category)
      sql += ` AND category = $${params.length}`
    }

    sql += ' ORDER BY rating DESC LIMIT 50'
    const { rows } = await this.db.query(sql, params)
    return rows
  }
}
```

---

## Service Layer（业务逻辑层）

```typescript
class RouteRecommendationService {
  constructor(
    private routeRepo: RouteRepository,
    private scenicRepo: ScenicRepository,
    private llmClient: LlmClient
  ) {}

  async recommend(selection: VisitorSelection): Promise<RankedRoute[]> {
    // 1. 获取所有路线
    const routes = await this.routeRepo.findAll()

    // 2. 打分排序
    const scored = routes.map(route => ({
      route,
      score: this.calculateScore(route, selection),
      reasons: this.generateReasons(route, selection)
    }))

    // 3. 按分数降序
    return scored.sort((a, b) => b.score - a.score)
  }

  private calculateScore(route: TourRoute, sel: VisitorSelection): number {
    let score = 0
    // 标签匹配 + 体力匹配 + 人群匹配 + 天数匹配
    return score
  }
}
```

---

## Caching 策略

```typescript
class CachedScenicRepository implements ScenicRepository {
  constructor(
    private base: ScenicRepository,
    private cache: Redis
  ) {}

  async findById(id: string): Promise<Attraction | null> {
    const cacheKey = `scenic:${id}`

    // Cache-Aside: 先查缓存
    const cached = await this.cache.get(cacheKey)
    if (cached) return JSON.parse(cached)

    // 缓存未命中 → 查数据库
    const scenic = await this.base.findById(id)
    if (scenic) {
      // 写入缓存（5分钟 TTL）
      await this.cache.setex(cacheKey, 300, JSON.stringify(scenic))
    }

    return scenic
  }
}
```

---

## 错误处理

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message)
  }
}

// 全局错误处理中间件
function errorMiddleware(err: unknown, req: Request, res: Response) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, error: err.message })
  }

  if (err instanceof z.ZodError) {
    return res.status(400).json({ success: false, error: 'Validation failed' })
  }

  console.error('[API] Unexpected:', err)
  return res.status(500).json({ success: false, error: 'Internal server error' })
}
```

---

## 重试与容错

```typescript
async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastErr: unknown

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (err) {
      lastErr = err
      if (i < maxRetries - 1) {
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000))
      }
    }
  }

  throw lastErr
}
```

---

## 认证/授权

```typescript
// JWT 验证中间件
async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ error: 'Missing token' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!)
    req.user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// 角色权限
const PERMISSIONS: Record<string, string[]> = {
  admin: ['read', 'write', 'delete'],
  editor: ['read', 'write'],
  viewer: ['read']
}

function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!PERMISSIONS[req.user.role]?.includes(permission)) {
      return res.status(403).json({ error: 'Permission denied' })
    }
    next()
  }
}
```

---

## 数据库事务

```sql
-- PostgreSQL 函数封装事务
CREATE OR REPLACE FUNCTION create_route_with_spots(
  route_data JSONB,
  spot_ids TEXT[]
) RETURNS JSONB AS $$
DECLARE
  new_route_id TEXT;
BEGIN
  INSERT INTO routes (id, name, days, ...)
  VALUES (route_data->>'id', route_data->>'name', ...)
  RETURNING id INTO new_route_id;

  INSERT INTO route_spots (route_id, spot_id)
  SELECT new_route_id, unnest(spot_ids);

  RETURN jsonb_build_object('success', true, 'routeId', new_route_id);
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql;
```

---

## 与现有 docs/ 的配合

| 本技能提供 | docs/API.md 提供 |
|-----------|-----------------|
| 代码实现模式 | 接口契约与参数定义 |
| Repository/Service层 | 响应格式与错误码 |
| 缓存/认证/事务 | 端点清单与字段说明 |
