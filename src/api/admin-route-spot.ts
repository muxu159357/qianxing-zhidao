import { adminRequest } from './admin-request'

export interface AdminRouteSpot { id: number; routeId: number; routeDayId?: number; scenicSpotId: number; spotOrder?: number; stayDuration?: string; visitTip?: string }
export function adminGetRouteSpots(routeId: number): Promise<AdminRouteSpot[]> { return adminRequest(`/admin/routes/${routeId}/spots`) }
export function adminAddRouteSpot(routeId: number, p: Omit<AdminRouteSpot,'id'|'routeId'>): Promise<AdminRouteSpot> { return adminRequest(`/admin/routes/${routeId}/spots`,{method:'POST',data:p}) }
export function adminRemoveRouteSpot(routeId: number, spotId: number): Promise<void> { return adminRequest(`/admin/routes/${routeId}/spots/${spotId}`,{method:'DELETE'}) }
