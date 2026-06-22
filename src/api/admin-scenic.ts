// 后台管理 景点 API
import { adminRequest } from './admin-request'

export interface AdminScenicSpot {
  id: number
  spotCode: string
  name: string
  city: string
  category: string
  status: number
  sortOrder: number
  updatedAt: string
}

export async function adminGetScenicSpots(params: Record<string, string | number>): Promise<{
  records: AdminScenicSpot[]
  total: number
  size: number
  current: number
}> {
  return adminRequest('/admin/scenic/spots', { params })
}
