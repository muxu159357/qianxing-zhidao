import { adminRequest } from './admin-request'

export interface AdminRouteDay {
  id: number; routeId: number; dayNumber: number; title: string
  description?: string; meals?: string; accommodation?: string; sortOrder?: number
}
export function adminGetRouteDays(routeId: number): Promise<AdminRouteDay[]> { return adminRequest(`/admin/routes/${routeId}/days`) }
export function adminCreateRouteDay(routeId: number, p: Omit<AdminRouteDay,'id'|'routeId'>): Promise<AdminRouteDay> { return adminRequest(`/admin/routes/${routeId}/days`,{method:'POST',data:p}) }
export function adminUpdateRouteDay(routeId: number, dayId: number, p: Partial<AdminRouteDay>): Promise<AdminRouteDay> { return adminRequest(`/admin/routes/${routeId}/days/${dayId}`,{method:'PUT',data:p}) }
export function adminDeleteRouteDay(routeId: number, dayId: number): Promise<void> { return adminRequest(`/admin/routes/${routeId}/days/${dayId}`,{method:'DELETE'}) }
