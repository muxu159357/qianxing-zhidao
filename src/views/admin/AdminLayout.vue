<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { adminAuthState, doAdminLogout } from '@/stores/admin-auth'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)

const menuItems = [
  { path: '/admin/dashboard', title: '工作台', icon: 'Monitor' },
  { path: '/admin/scenic', title: '景点管理', icon: 'Picture' },
  { path: '/admin/routes', title: '路线管理', icon: 'Promotion' },
  { path: '/admin/knowledge', title: '知识库管理', icon: 'Reading' },
  { path: '/admin/media', title: '媒体管理', icon: 'FolderOpened' },
  { path: '/admin/weather', title: '天气管理', icon: 'Sunny' },
  { path: '/admin/trips', title: '行程管理', icon: 'List' },
  { path: '/admin/ai-records', title: 'AI记录', icon: 'ChatDotRound' },
  { path: '/admin/settings', title: '系统设置', icon: 'Setting' },
]

const pageTitle = ref('工作台')
function onMenuSelect(path: string) {
  const item = menuItems.find(m => m.path === path)
  if (item) pageTitle.value = item.title
  router.push(path)
}
function onLogout() { doAdminLogout(); router.replace('/admin/login') }
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar" :class="{ collapsed: isCollapse }">
      <div class="sidebar-brand">
        <div class="sidebar-logo">黔</div>
        <div v-if="!isCollapse" class="sidebar-brand-text">
          <div class="sidebar-brand-name">黔行智导</div>
          <div class="sidebar-brand-ver">管理后台 v2.4</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <div v-for="item in menuItems" :key="item.path" class="sidebar-item" :class="{ active: route.path === item.path || route.path.startsWith(item.path + '/') }" @click="onMenuSelect(item.path)">
          <span class="sidebar-item-icon"><el-icon><component :is="item.icon" /></el-icon></span>
          <span v-if="!isCollapse" class="sidebar-item-text">{{ item.title }}</span>
          <el-tag v-if="!isCollapse && (item.path === '/admin/ai-records' || item.path === '/admin/settings')" size="small" type="info" class="sidebar-tag">建设</el-tag>
        </div>
      </nav>
      <div class="sidebar-footer">
        <div class="sidebar-user" @click="onLogout">
          <div class="sidebar-avatar">{{ (adminAuthState.user?.displayName || '管')[0] }}</div>
          <div v-if="!isCollapse" class="sidebar-user-info">
            <div class="sidebar-user-name">{{ adminAuthState.user?.displayName || '管理员' }}</div>
            <div class="sidebar-user-role">超级管理员</div>
          </div>
        </div>
      </div>
    </aside>
    <div class="admin-main">
      <header class="admin-topbar">
        <div class="topbar-left">
          <el-button :icon="isCollapse ? 'Expand' : 'Fold'" text @click="isCollapse=!isCollapse" style="color:#64748b" />
          <span class="topbar-breadcrumb"><span class="topbar-breadcrumb-dim">控制台</span><span class="topbar-breadcrumb-sep">/</span><span class="topbar-breadcrumb-active">{{ pageTitle }}</span></span>
        </div>
        <div class="topbar-right">
          <el-button text style="color:#64748b"><el-icon><Bell /></el-icon></el-button>
          <el-button text type="danger" @click="onLogout">退出登录</el-button>
        </div>
      </header>
      <main class="admin-content"><router-view /></main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout { display:flex; min-height:100vh; background:#f8fafc; }
.admin-main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
.admin-sidebar { width:220px; background:#ffffff; border-right:1px solid #e2e8f0; display:flex; flex-direction:column; flex-shrink:0; transition:width 0.25s; }
.admin-sidebar.collapsed { width:64px; }
.sidebar-brand { height:56px; display:flex; align-items:center; gap:10px; padding:0 16px; border-bottom:1px solid #f1f5f9; flex-shrink:0; }
.sidebar-logo { width:28px; height:28px; background:#0d9488; border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:700; flex-shrink:0; }
.sidebar-brand-name { font-size:14px; font-weight:700; color:#0f172a; line-height:1.2; }
.sidebar-brand-ver { font-size:10px; color:#94a3b8; }
.sidebar-nav { flex:1; padding:12px 8px; overflow-y:auto; display:flex; flex-direction:column; gap:2px; }
.sidebar-item { display:flex; align-items:center; gap:10px; padding:10px 12px; border-radius:8px; font-size:13px; color:#64748b; cursor:pointer; transition:all 0.15s; white-space:nowrap; }
.sidebar-item:hover { background:#f8fafc; color:#0f172a; }
.sidebar-item.active { background:#0d9488; color:#ffffff; font-weight:600; }
.sidebar-item.active .sidebar-item-icon { color:#ffffff; }
.sidebar-tag { margin-left:auto; }
.sidebar-footer { border-top:1px solid #f1f5f9; padding:12px; flex-shrink:0; }
.sidebar-user { display:flex; align-items:center; gap:10px; padding:8px; border-radius:8px; cursor:pointer; transition:background 0.15s; }
.sidebar-user:hover { background:#f8fafc; }
.sidebar-avatar { width:32px; height:32px; background:#ccfbf1; color:#0f766e; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0; }
.sidebar-user-name { font-size:12px; font-weight:600; color:#0f172a; }
.sidebar-user-role { font-size:11px; color:#94a3b8; }
.admin-topbar { height:56px; background:#ffffff; border-bottom:1px solid #e2e8f0; display:flex; align-items:center; justify-content:space-between; padding:0 24px; flex-shrink:0; }
.topbar-left { display:flex; align-items:center; gap:16px; }
.topbar-breadcrumb { font-size:13px; display:flex; align-items:center; gap:6px; }
.topbar-breadcrumb-dim { color:#94a3b8; }
.topbar-breadcrumb-sep { color:#cbd5e1; }
.topbar-breadcrumb-active { color:#0f172a; font-weight:500; }
.topbar-right { display:flex; align-items:center; gap:12px; }
.admin-content { flex:1; padding:24px; overflow-y:auto; background:#f8fafc; }
</style>
