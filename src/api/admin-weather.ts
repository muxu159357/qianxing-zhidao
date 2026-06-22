import { adminRequest } from './admin-request'
export interface AdminWeatherLocation { id: number; locationCode?: string; locationName: string; locationType?: string; scenicSpotId?: number; providerCode?: string; updateEnabled: number; sortOrder: number; status: number }
export function adminGetWeatherLocations(): Promise<AdminWeatherLocation[]> { return adminRequest('/admin/weather/locations') }
export function adminCreateWeatherLocation(p: Partial<AdminWeatherLocation>): Promise<AdminWeatherLocation> { return adminRequest('/admin/weather/locations',{method:'POST',data:p}) }
export function adminUpdateWeatherLocation(id: number, p: Partial<AdminWeatherLocation>): Promise<AdminWeatherLocation> { return adminRequest(`/admin/weather/locations/${id}`,{method:'PUT',data:p}) }
export function adminDeleteWeatherLocation(id: number): Promise<void> { return adminRequest(`/admin/weather/locations/${id}`,{method:'DELETE'}) }
