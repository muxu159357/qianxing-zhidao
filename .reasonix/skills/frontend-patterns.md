---
name: frontend-patterns
description: Vue 3 前端设计模式 — Composables/Slots/状态管理/GSAP动画/性能优化/错误处理
---

# Frontend Patterns — Vue 3 前端设计模式

## 触发方式
- 新建组件/页面时 · 设计复用方案时 · 性能优化时

## 组件模式

### Composables（核心复用单元）
```typescript
export function useDebounce<T>(value: Ref<T>, delay: number): Ref<T> {
  const debouncedValue = ref(value.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout>
  watch(value, (v) => { clearTimeout(timer); timer = setTimeout(() => debouncedValue.value = v, delay) })
  return debouncedValue
}
```

### Slot 组合模式
```vue
<RouteCard> <slot name="header" :route="route"> <h3>{{ route.name }}</h3> </slot> <slot /> <slot name="footer"> <el-button>选择</el-button> </slot> </RouteCard>
```

### Props 规范
```typescript
interface ScenicCardProps { attraction: Attraction; variant?: 'compact' | 'full'; onSelect?: (id: string) => void }
const props = withDefaults(defineProps<ScenicCardProps>(), { variant: 'full' })
```

## 状态管理

### 简单跨页面共享 (ref + localStorage)
```typescript
export function useVisitorSelection() {
  const selection = ref<VisitorSelection | null>(null)
  function load(): VisitorSelection | null {
    const raw = localStorage.getItem('key'); if(raw) selection.value = JSON.parse(raw); return selection.value
  }
  function save(data: VisitorSelection): void { selection.value = {...data}; localStorage.setItem('key', JSON.stringify(data)) }
  return { selection, load, save }
}
```

### Provider/Inject 模式
```typescript
const Key = Symbol('ctx')
export function provideCtx(data: Ref<T[]>) { provide(Key, data) }
export function useCtx(): Ref<T[]> { const ctx = inject<Ref<T[]>>(Key); if(!ctx) throw new Error('must be within provider'); return ctx }
```

## 数据获取模式
```typescript
export function useAsyncData<T>(fetcher: () => Promise<T>) {
  const data = ref<T|null>(null); const loading=ref(true); const error=ref<string|null>(null)
  async function execute() { loading.value=true; error.value=null; try{data.value=await fetcher()}catch(e){error.value=e instanceof Error?e.message:'加载失败'}finally{loading.value=false} }
  onMounted(execute); return {data,loading,error,refetch:execute}
}
```

## 性能优化
- 懒加载路由: `component: () => import('@/views/XView.vue')`
- v-memo: `<div v-for="item in list" :key="item.id" v-memo="[item.id, item.rating]">`
- shallowRef 大对象: `const attractions = shallowRef<Attraction[]>([]); attractions.value = newData`

## GSAP 动画模式
- 页面入场: `gsap.from('.card', {y:40, opacity:0, duration:0.6, stagger:0.1, ease:'power3.out'})`
- Timeline: `const tl=gsap.timeline(); tl.from(header,{y:20,opacity:0,0.5}); tl.from(cards,{y:30,opacity:0,0.4,stagger:0.08},'-=0.2')`
- 路由过渡: CSS `.page-fade-enter-active{transition:all .35s}` + `.page-fade-enter-from{opacity:0;transform:translateY(18px)}`

## 错误展示模式
```vue
<div v-if="loading"><el-skeleton /></div>
<div v-else-if="error"><el-result icon="warning" :title="error"><el-button @click="refetch">重试</el-button></el-result></div>
<div v-else-if="!data"><el-empty description="暂无数据" /></div>
<div v-else><!-- content --></div>
```

## 无障碍
Element Plus 组件自带 ARIA。自定义组件用 `role` + `aria-*` 属性。图片必须写 `alt`。
