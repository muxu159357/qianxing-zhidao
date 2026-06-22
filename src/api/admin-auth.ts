// 后台管理 鉴权 API
import { adminRequest } from './admin-request'

export interface AdminUser {
  id: number
  username: string
  displayName: string
  role: string
}

export interface AdminLoginResult {
  token: string
  user: AdminUser
}

export async function adminLogin(username: string, password: string): Promise<AdminLoginResult> {
  return adminRequest<AdminLoginResult>('/admin/auth/login', {
    method: 'POST',
    data: { username, password },
  })
}

export async function adminGetMe(): Promise<AdminUser> {
  return adminRequest<AdminUser>('/admin/auth/me')
}
