// 后台管理 景点 API
import { adminRequest } from './admin-request'

export interface AdminScenicSpot {
  id: number
  spotCode: string
  name: string
  city: string
  regionCode?: string
  category: string
  rating?: number
  ticketPrice?: number
  visitDuration?: string
  bestSeason?: string
  description?: string
  highlights?: string
  tips?: string
  tags?: string
  latitude?: number
  longitude?: number
  sortOrder: number
  status: number
  deleted?: number
  updatedAt: string
  createdAt?: string
}

export type AdminScenicForm = Pick<AdminScenicSpot, 'name' | 'city' | 'category' | 'description' | 'tags' | 'sortOrder' | 'status'> & {
  highlights?: string
  tips?: string
  visitDuration?: string
  ticketPrice?: number
  rating?: number
}

export function adminGetScenicSpots(params: Record<string, string | number>): Promise<{ records: AdminScenicSpot[]; total: number; size: number; current: number }> {
  return adminRequest('/admin/scenic/spots', { params })
}

export function adminGetScenicSpot(id: number): Promise<AdminScenicSpot> {
  return adminRequest(`/admin/scenic/spots/${id}`)
}

export function adminCreateScenicSpot(payload: AdminScenicForm): Promise<AdminScenicSpot> {
  return adminRequest('/admin/scenic/spots', { method: 'POST', data: payload })
}

export function adminUpdateScenicSpot(id: number, payload: Partial<AdminScenicForm>): Promise<AdminScenicSpot> {
  return adminRequest(`/admin/scenic/spots/${id}`, { method: 'PUT', data: payload })
}

export function adminUpdateScenicStatus(id: number, status: number): Promise<AdminScenicSpot> {
  return adminRequest(`/admin/scenic/spots/${id}/status`, { method: 'PUT', params: { status } })
}

export function adminDeleteScenicSpot(id: number): Promise<void> {
  return adminRequest(`/admin/scenic/spots/${id}`, { method: 'DELETE' })
}
