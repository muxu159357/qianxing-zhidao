import { adminRequest } from './admin-request'
export interface AdminTrip { id: number; userId: number; routeId?: number; routeName: string; customName?: string; status: string; dayCount: number; energyLevel?: string; travelStartDate?: string; createdAt: string }
export function adminGetTrips(params: Record<string,string|number>): Promise<{records:AdminTrip[];total:number;size:number;current:number}> { return adminRequest('/admin/trips',{params}) }
export function adminGetTrip(id: number): Promise<AdminTrip> { return adminRequest(`/admin/trips/${id}`) }
