// 后台管理 路线 API
import { adminRequest } from './admin-request'

export interface AdminRoute {
  id: number
  routeCode: string
  name: string
  description?: string
  dayCount: number
  energyLevel?: string
  budgetRange?: string
  suitableCrowd?: string
  tags?: string
  theme?: string
  sortOrder: number
  status: number
  updatedAt: string
}

export type AdminRouteForm = Pick<AdminRoute, 'name' | 'description' | 'dayCount' | 'energyLevel' | 'budgetRange' | 'suitableCrowd' | 'tags' | 'theme' | 'sortOrder' | 'status'>

export function adminGetRoutes(params: Record<string, string | number>): Promise<{ records: AdminRoute[]; total: number; size: number; current: number }> {
  return adminRequest('/admin/routes', { params })
}

export function adminGetRoute(id: number): Promise<AdminRoute> { return adminRequest(`/admin/routes/${id}`) }
export function adminCreateRoute(payload: AdminRouteForm): Promise<AdminRoute> { return adminRequest('/admin/routes', { method: 'POST', data: payload }) }
export function adminUpdateRoute(id: number, payload: Partial<AdminRouteForm>): Promise<AdminRoute> { return adminRequest(`/admin/routes/${id}`, { method: 'PUT', data: payload }) }
export function adminUpdateRouteStatus(id: number, status: number): Promise<AdminRoute> { return adminRequest(`/admin/routes/${id}/status`, { method: 'PUT', params: { status } }) }
export function adminDeleteRoute(id: number): Promise<void> { return adminRequest(`/admin/routes/${id}`, { method: 'DELETE' }) }
