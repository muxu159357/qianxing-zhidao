// 后台管理 鉴权状态
import { reactive } from 'vue'
import type { AdminUser } from '@/api/admin-auth'
import { adminLogin, adminGetMe } from '@/api/admin-auth'

interface AdminAuthState {
  token: string | null
  user: AdminUser | null
  loading: boolean
}

export const adminAuthState = reactive<AdminAuthState>({
  token: localStorage.getItem('qianxing_admin_token'),
  user: JSON.parse(localStorage.getItem('qianxing_admin_user') || 'null'),
  loading: false,
})

export async function doAdminLogin(username: string, password: string) {
  adminAuthState.loading = true
  try {
    const result = await adminLogin(username, password)
    adminAuthState.token = result.token
    adminAuthState.user = result.user
    localStorage.setItem('qianxing_admin_token', result.token)
    localStorage.setItem('qianxing_admin_user', JSON.stringify(result.user))
    return result
  } finally {
    adminAuthState.loading = false
  }
}

export async function doAdminCheckAuth(): Promise<boolean> {
  if (!adminAuthState.token) return false
  try {
    const user = await adminGetMe()
    adminAuthState.user = user
    localStorage.setItem('qianxing_admin_user', JSON.stringify(user))
    return true
  } catch {
    doAdminLogout()
    return false
  }
}

export function doAdminLogout() {
  adminAuthState.token = null
  adminAuthState.user = null
  localStorage.removeItem('qianxing_admin_token')
  localStorage.removeItem('qianxing_admin_user')
}
