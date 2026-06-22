// 后台管理 API 请求封装
import { ElMessage } from 'element-plus'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export interface AdminApiResponse<T = any> {
  code: number
  data?: T
  message?: string
}

export async function adminRequest<T = any>(
  path: string,
  options: {
    method?: string
    data?: any
    params?: Record<string, string | number>
    silent?: boolean
  } = {}
): Promise<T> {
  const { method = 'GET', data, params, silent = false } = options
  const token = localStorage.getItem('qianxing_admin_token')

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let url = `${BASE_URL}${path}`
  if (params) {
    const qs = Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&')
    if (qs) url += '?' + qs
  }

  const res = await fetch(url, { method, headers, body: data ? JSON.stringify(data) : undefined })
  const body: AdminApiResponse<T> = await res.json()

  if (res.status === 401) {
    localStorage.removeItem('qianxing_admin_token')
    localStorage.removeItem('qianxing_admin_user')
    if (window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login'
    }
    if (!silent) ElMessage.error(body.message || '登录已过期')
    throw new Error(body.message || '登录已过期')
  }

  if (body.code !== 0) {
    if (!silent) ElMessage.error(body.message || '请求失败')
    throw new Error(body.message || '请求失败')
  }

  return body.data as T
}
