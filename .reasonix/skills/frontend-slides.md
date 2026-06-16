---
name: frontend-slides
description: HTML演示文稿生成器 — 零依赖单文件Slides，GSAP动画，键盘导航，适配比赛路演答辩
---

# API Design Patterns — 后端 API 设计规范

> 适配自 ECC api-design，面向 Node.js/Go REST API

## 触发方式

- 设计后端接口时
- 写 API 文档时
- 对接前后端时

---

## 核心原则

### 黄金法则

> 一次只做一件事，做好它。

- 单一职责端点
- 输入验证在边界
- 错误响应统一格式
- 认证/授权显式声明

---

## 端点命名规范

```
GET    /api/resource          # 列表（支持 ?page=&limit=&sort=）
GET    /api/resource/:id      # 详情
POST   /api/resource          # 创建
PUT    /api/resource/:id      # 全量更新
PATCH  /api/resource/:id      # 部分更新
DELETE /api/resource/:id      # 删除
```

**子资源：**
```
GET    /api/resource/:id/sub-resource
POST   /api/resource/:id/sub-resource
```

**动作端点（非 CRUD）：**
```
POST   /api/resource/:id/publish
POST   /api/resource/:id/archive
POST   /api/visitor-profile/generate   # AI 生成类
```

---

## 统一响应格式

```typescript
interface ApiResponse<T> {
  success: boolean          // 始终存在
  data?: T                  // 成功时
  error?: string            // 失败时（不泄露内部细节）
  meta?: {                  // 列表接口
    total: number
    page: number
    limit: number
  }
}
```

---

## 分页规范

```typescript
interface PaginationParams {
  page?: number    // 默认 1
  limit?: number   // 默认 20，最大 100
}

interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}
```

---

## 输入验证

所有输入在边界验证：

```typescript
import { z } from 'zod'

const createRouteSchema = z.object({
  name: z.string().min(2).max(200),
  days: z.number().int().min(1).max(30),
  attractionIds: z.array(z.string()).min(1),
  physicalLevel: z.enum(['轻松', '适中', '挑战']),
  budgetRange: z.enum(['经济型', '舒适型', '品质型']),
  suitableFor: z.array(z.string()).min(1)
})

type CreateRouteInput = z.infer<typeof createRouteSchema>

// 在 handler 中
const validated = createRouteSchema.parse(req.body)
```

---

## 错误处理

```typescript
class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message)
  }
}

// 错误 → 响应映射
function handleError(error: unknown): ApiResponse<never> {
  if (error instanceof ApiError) {
    return { success: false, error: error.message }
  }
  if (error instanceof z.ZodError) {
    return { success: false, error: 'Validation failed', /* details */ }
  }
  // 不泄露内部错误
  console.error('[API]', error)
  return { success: false, error: 'Internal server error' }
}
```

---

## 认证模式

```
Header: Authorization: Bearer <JWT_TOKEN>

中间件验证：
1. 提取 token
2. 验证 JWT
3. 注入 user context
4. 权限检查
```

---

## 速率限制

```
每个 IP: 100 请求/分钟（通用）
AI 接口: 20 请求/分钟（成本控制）
管理接口: 200 请求/分钟
```

---

## 性能优化

### 列表接口必备
- 分页（永远不要无限制返回）
- 字段筛选（`?fields=id,name,rating`）
- 排序（`?sort=-rating` 降序）

### 关联数据
- 默认不 include
- 按需 `?include=attractions`

---

## 版本管理

```
URL 版本: /api/v1/resource
Header 版本: Accept: application/vnd.api.v1+json
```

Demo 阶段可以不版本化，但接口路径预留 `/api/v1/`。<｜end▁of▁thinking｜>

<｜｜DSML｜｜tool_calls>
<｜｜DSML｜｜invoke name="install_skill">
<｜｜DSML｜｜parameter name="body" string="true"># Frontend Patterns — Vue 3 前端设计模式

> 适配自 ECC frontend-patterns，React→Vue 3, Framer Motion→GSAP, Next.js→Vite

## 触发方式

- 新建组件/页面时
- 设计组件复用方案时
- 性能优化时
- 需要设计模式参考时

---

## 组件模式

### Composables 模式（本项目的核心复用单元）

```typescript
// composables/useDebounce.ts
export function useDebounce<T>(value: Ref<T>, delay: number): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>

  let timer: ReturnType<typeof setTimeout>
  watch(value, (newVal) => {
    clearTimeout(timer)
    timer = setTimeout(() => { debouncedValue.value = newVal }, delay)
  })

  return debouncedValue
}
```

### Props 透传模式

```typescript
// 卡片组件：核心+扩展
interface ScenicCardProps {
  attraction: Attraction
  variant?: 'compact' | 'full'
  onSelect?: (id: string) => void
}

const props = withDefaults(defineProps<ScenicCardProps>(), {
  variant: 'full'
})
```

### Slot 组合模式

```vue
<!-- RouteCard.vue -->
<template>
  <div class="route-card">
    <slot name="header" :route="route">
      <h3>{{ route.name }}</h3>
    </slot>
    <slot :attractions="attractions" />
    <slot name="footer">
      <el-button @click="$emit('select', route.id)">选择</el-button>
    </slot>
  </div>
</template>
```

---

## 状态管理模式

### 简单状态：ref + localStorage

```typescript
// 游客选择（跨页面共享）
export function useVisitorSelection() {
  const selection = ref<VisitorSelection | null>(null)

  function load(): VisitorSelection | null {
    const raw = localStorage.getItem('qianxing_visitor_selection')
    if (raw) { selection.value = JSON.parse(raw); return selection.value }
    return null
  }

  function save(data: VisitorSelection): void {
    selection.value = { ...data }
    localStorage.setItem('qianxing_visitor_selection', JSON.stringify(data))
  }

  return { selection, load, save }
}
```

### Provider/Inject 模式

```typescript
// 跨层级共享 ScenicSpot 数据
const ScenicContextKey = Symbol('scenic-context')

export function provideScenicContext(data: Ref<Attraction[]>) {
  provide(ScenicContextKey, data)
}

export function useScenicContext(): Ref<Attraction[]> {
  const ctx = inject<Ref<Attraction[]>>(ScenicContextKey)
  if (!ctx) throw new Error('useScenicContext must be used within a provider')
  return ctx
}
```

---

## 数据获取模式

### Async composable（本项目 Mock 层封装）

```typescript
export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const data = ref<T | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function execute() {
    loading.value = true
    error.value = null
    try {
      data.value = await fetcher()
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '加载失败'
    } finally {
      loading.value = false
    }
  }

  onMounted(execute)
  return { data, loading, error, refetch: execute }
}

// 使用
const { data: routes, loading } = useAsyncData(() => getRoutes())
```

---

## 性能优化

### 懒加载路由（已应用）

```typescript
{ path: '/planner', component: () => import('@/views/PlannerView.vue') }
```

### v-memo 优化列表

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.rating]">
  <ScenicCard :attraction="item" />
</div>
```

### shallowRef 优化大对象

```typescript
// 大量数据用 shallowRef（只追踪顶层引用变化）
const attractions = shallowRef<Attraction[]>([])
attractions.value = newData  // 整体替换触发更新
```

---

## 动画模式（GSAP）

### 入场动画

```typescript
// 页面级
onMounted(async () => {
  await nextTick()
  gsap.from('.card', { y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
})
```

### 列表交错动画

```typescript
const tl = gsap.timeline()
tl.from(headerRef.value, { y: 20, opacity: 0, duration: 0.5 })
if (gridRef.value) {
  const cards = gridRef.value.querySelectorAll('.card')
  tl.from(cards, { y: 30, opacity: 0, duration: 0.4, stagger: 0.08 }, '-=0.2')
}
```

### 路由过渡（已内置）

```css
.page-fade-enter-active { transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.page-fade-enter-from { opacity: 0; transform: translateY(18px); }
```

---

## 错误处理模式

### 统一错误展示

```vue
<template>
  <div v-if="loading" class="loading-state"><el-skeleton /></div>
  <div v-else-if="error" class="error-state">
    <el-result icon="warning" :title="error">
      <template #extra><el-button @click="refetch">重试</el-button></template>
    </el-result>
  </div>
  <div v-else-if="!data" class="empty-state">
    <el-empty description="暂无数据" />
  </div>
  <div v-else><!-- 正常内容 --></div>
</template>
```

---

## 可访问性模式

### 键盘导航（Element Plus 组件内置）

```vue
<el-dropdown>  <!-- 已内置 Arrow keys + Enter + Escape -->
<el-dialog>    <!-- 已内置 Escape 关闭 + focus trap -->
```

### 图片 alt 文本

```vue
<img :src="attraction.imageUrl" :alt="`${attraction.name}实景照片`" />
```

> Element Plus 组件自带 ARIA 支持，无需额外处理。自定义组件需要用 `role` + `aria-*` 属性。<｜end▁of▁thinking｜>

<｜｜DSML｜｜tool_calls>
<｜｜DSML｜｜invoke name="install_skill">
<｜｜DSML｜｜parameter name="body" string="true"># Frontend Slides — HTML 演示文稿生成

> 适配自 ECC frontend-slides，面向比赛路演/答辩场景

## 触发方式

- "生成比赛 PPT"、"做演示文稿"、"生成答辩 slides"
- 需要单文件 HTML 演示文稿时

---

## 设计哲学

**Visual exploration over abstract choices.** 用具体视觉选项引导非设计者发现审美偏好，而非让他们从抽象概念中选择。

---

## PPT 生成流程

### Step 1: 收集内容
- 用户提供大纲或逐页内容
- 如果是 .pptx 文件，尝试提取文本内容

### Step 2: 视觉风格探索

给用户 3-4 个具体的视觉方向（不抽象描述）：

```
1. "深色极简" — 黑底白字 + 一条翠绿渐变线 + 大号无衬线字体
2. "贵州山水" — 白底 + 山水绿渐变背景 + 毛玻璃卡片 + 圆角
3. "科技蓝" — 深蓝渐变底 + 几何线条 + 数据可视化风格
```

### Step 3: 生成单文件 HTML

零外部依赖，全部内联 CSS + Vanilla JS + GSAP CDN。

---

## 技术规范

### 必须
- 单文件 HTML（CSS 内联在 `<style>`，JS 内联在 `<script>`）
- 通过 `file://` 直接打开可用
- 支持键盘导航（← → 翻页，F 全屏）
- 每页屏幕适配（100vh × 100vw）
- GSAP 动画（页面切换 + 元素入场）

### 禁止
- 不依赖 Webpack/Vite/Node.js
- 不引入外部字体（用系统字体栈）
- 不引入图片（用 CSS 渐变 + SVG 内联替代）

---

## 模板骨架

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>演示文稿</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family: "PingFang SC","Microsoft YaHei","Helvetica Neue",sans-serif; overflow:hidden; }
.slide { width:100vw; height:100vh; display:flex; align-items:center; justify-content:center; position:absolute; top:0; left:0; opacity:0; pointer-events:none; }
.slide.active { opacity:1; pointer-events:auto; }
.nav { position:fixed; bottom:24px; right:24px; z-index:100; display:flex; gap:8px; }
.nav button { width:40px; height:40px; border-radius:50%; border:1px solid rgba(255,255,255,0.3); background:rgba(0,0,0,0.4); color:#fff; cursor:pointer; font-size:18px; }
.progress { position:fixed; bottom:0; left:0; height:3px; background:#1f8f5f; transition:width 0.3s; z-index:101; }
</style>
</head>
<body>
<div id="app"></div>
<div class="nav"><button onclick="prev()">←</button><button onclick="next()">→</button></div>
<div class="progress" id="progress"></div>
<script>
let current = 0
const slides = []
function prev() { if(current>0) goTo(current-1) }
function next() { if(current<slides.length-1) goTo(current+1) }
function goTo(i) {
  slides[current].classList.remove('active')
  slides[i].classList.add('active')
  gsap.from(slides[i], { opacity:0, x: i>current?60:-60, duration:0.5, ease:'power2.out' })
  current = i
  document.getElementById('progress').style.width = ((i+1)/slides.length*100)+'%'
}
document.addEventListener('keydown', e => {
  if(e.key==='ArrowRight') next()
  if(e.key==='ArrowLeft') prev()
  if(e.key==='f') document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()
})
</script>
</body>
</html>
```

---

## 为黔行智导预设的模板页

### 封面页 — 品牌绿渐变
```html
<div class="slide active" style="background:linear-gradient(135deg,#1f8f5f,#2f6bff);color:#fff;text-align:center;flex-direction:column;">
  <div style="font-size:14px;letter-spacing:0.2em;opacity:0.7;margin-bottom:24px;">2026年贵州省人工智能创业大赛</div>
  <h1 style="font-size:clamp(36px,6vw,72px);margin-bottom:12px;">黔行智导</h1>
  <p style="font-size:20px;opacity:0.85;">基于游客兴趣画像的贵州山地旅游 AI 智能导览平台</p>
  <div style="margin-top:48px;font-size:16px;opacity:0.6;">Maxwell 团队</div>
</div>
```

### 技术架构页 — 三列卡片
```html
<div class="slide" style="background:#f4f8f5;padding:64px;">
  <h2 style="color:#10251d;margin-bottom:48px;">技术架构</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;width:100%;max-width:960px;">
    <div class="tech-card" style="background:white;border-radius:16px;padding:28px;box-shadow:0 8px 32px rgba(0,0,0,0.06);">
      <div style="font-size:32px;margin-bottom:12px;">🧠</div>
      <h3 style="color:#1f8f5f;">大语言模型</h3>
      <p style="color:#5d6b7a;font-size:14px;">AI导游问答 + 画像生成</p>
    </div>
    <!-- 重复 -->
  </div>
</div>
```

### 数据展示页 — 进度条/卡片
```html
<div class="slide" style="background:white;padding:64px;flex-direction:column;">
  <h2 style="color:#10251d;margin-bottom:48px;">平台数据</h2>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:20px;width:100%;max-width:900px;">
    <div style="text-align:center;padding:24px;border-radius:16px;background:rgba(31,143,95,0.06);">
      <div style="font-size:40px;font-weight:800;color:#1f8f5f;">10</div><div style="color:#909399;">收录景点</div>
    </div>
    <!-- 重复 -->
  </div>
</div>
```

---

## 比赛答辩推荐结构（6-8页）

| 页 | 内容 |
|----|------|
| 1 | 封面（品牌 + 赛事 + 团队） |
| 2 | 项目定位与背景 |
| 3 | 核心技术架构（3列） |
| 4 | 产品演示截图 / 流程 |
| 5 | 数据与统计 |
| 6 | 商业模式 / 市场价值 |
| 7 | 团队介绍 |
| 8 | 致谢 + 联系方式 |
