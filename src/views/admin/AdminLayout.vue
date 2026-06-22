<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { adminAuthState, doAdminLogout } from '@/stores/admin-auth'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)

const menuItems = [
  { path: '/admin/dashboard', title: '工作台', icon: 'Monitor' },
  { path: '/admin/scenic', title: '景点管理', icon: 'Picture' },
  { path: '/admin/routes', title: '路线管理', icon: 'Promotion' },
  { path: '/admin/knowledge', title: '知识库管理', icon: 'Reading', disabled: true },
  { path: '/admin/media', title: '媒体管理', icon: 'FolderOpened', disabled: true },
  { path: '/admin/weather', title: '天气管理', icon: 'Sunny', disabled: true },
  { path: '/admin/trips', title: '行程管理', icon: 'List', disabled: true },
  { path: '/admin/ai-records', title: 'AI记录', icon: 'ChatDotRound', disabled: true },
  { path: '/admin/settings', title: '系统设置', icon: 'Setting', disabled: true },
]

function onMenuSelect(path: string) { router.push(path) }

function onLogout() { doAdminLogout(); router.replace('/admin/login') }
</script>

<template>
  <div class="admin-layout">
    <aside class="admin-sidebar" :class="{ collapsed: isCollapse }">
      <div class="sidebar-header"><span v-if="!isCollapse" class="sidebar-title">黔行智导后台</span><span v-else class="sidebar-title-short">黔</span></div>
      <el-menu background-color="#1a1f2e" text-color="#a0aec0" active-text-color="#fff" :default-active="route.path" :collapse="isCollapse" @select="onMenuSelect">
        <el-menu-item v-for="item in menuItems" :key="item.path" :index="item.path" :disabled="item.disabled">
          <el-icon><component :is="item.icon" /></el-icon>
          <template #title>{{ item.title }}<el-tag v-if="item.disabled" size="small" type="info" style="margin-left:8px">建设</el-tag></template>
        </el-menu-item>
      </el-menu>
    </aside>
    <div class="admin-main">
      <header class="admin-header">
        <div class="header-left"><el-button :icon="isCollapse ? 'Expand' : 'Fold'" text @click="isCollapse=!isCollapse"/></div>
        <div class="header-right"><span class="header-user">{{ adminAuthState.user?.displayName || '管理员' }}</span><el-button text type="danger" @click="onLogout">退出登录</el-button></div>
      </header>
      <main class="admin-content"><router-view /></main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout { display:flex; min-height:100vh; }
.admin-sidebar { width:220px; background:#1a1f2e; transition:width 0.3s; display:flex; flex-direction:column; }
.admin-sidebar.collapsed { width:64px; }
.sidebar-header { height:60px; display:flex; align-items:center; justify-content:center; border-bottom:1px solid rgba(255,255,255,0.06); }
.sidebar-title { font-size:16px; font-weight:700; color:#fff; }
.sidebar-title-short { font-size:20px; font-weight:700; color:#1f8f5f; }
.admin-main { flex:1; display:flex; flex-direction:column; background:#f0f2f5; overflow:hidden; }
.admin-header { height:56px; background:#fff; display:flex; align-items:center; justify-content:space-between; padding:0 20px; border-bottom:1px solid #e8eaed; }
.header-right { display:flex; align-items:center; gap:12px; }
.header-user { font-size:14px; color:#606266; }
.admin-content { flex:1; padding:24px; overflow-y:auto; }
</style>
