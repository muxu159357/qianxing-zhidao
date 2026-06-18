const BASE = 'http://localhost:8080'

async function req<T>(path: string, opts?: RequestInit): Promise<T> {
  const r = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...opts })
  const b = await r.json()
  if (b.code !== 0) throw new Error(b.message || '请求失败')
  return b.data as T
}

export interface AdminStats { scenicCount: number; routeCount: number; knowledgeCount: number; tripCount: number; activeTripCount: number }
export interface ScenicItem { id: number; spotCode: string; name: string; city: string; category: string; rating: number; ticketPrice: number; status: number }
export interface PageResult<T> { records: T[]; total: number; page: number; size: number }
export interface KnowledgeItem { id: number; articleCode: string; question: string; answer: string; category: string; status: number }
export interface RouteItem { id: number; routeCode: string; name: string; dayCount: number; energyLevel: string; status: number }

export function useAdminApi() {
  return {
    getStats: () => req<AdminStats>('/api/admin/dashboard/stats'),
    listScenic: (p?: Record<string, string>) => { const q = new URLSearchParams(p || {}).toString(); return req<PageResult<ScenicItem>>('/api/admin/scenic/spots' + (q ? '?' + q : '')) },
    createScenic: (d: Partial<ScenicItem>) => req<ScenicItem>('/api/admin/scenic/spots', { method: 'POST', body: JSON.stringify(d) }),
    updateScenic: (id: number, d: Partial<ScenicItem>) => req<ScenicItem>('/api/admin/scenic/spots/' + id, { method: 'PUT', body: JSON.stringify(d) }),
    deleteScenic: (id: number) => req<void>('/api/admin/scenic/spots/' + id, { method: 'DELETE' }),
    listRoutes: (p?: Record<string, string>) => { const q = new URLSearchParams(p || {}).toString(); return req<PageResult<RouteItem>>('/api/admin/routes' + (q ? '?' + q : '')) },
    deleteRoute: (id: number) => req<void>('/api/admin/routes/' + id, { method: 'DELETE' }),
    listKnowledge: (p?: Record<string, string>) => { const q = new URLSearchParams(p || {}).toString(); return req<PageResult<KnowledgeItem>>('/api/admin/knowledge/articles' + (q ? '?' + q : '')) },
  }
}
