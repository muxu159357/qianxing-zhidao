<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminGetScenicSpots, type AdminScenicSpot } from '@/api/admin-scenic'

const spots = ref<AdminScenicSpot[]>([])
const total = ref(0)
const loading = ref(false)
const keyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

async function loadSpots() {
  loading.value = true
  try {
    const params: Record<string, string | number> = { page: currentPage.value, size: pageSize.value }
    if (keyword.value.trim()) params.keyword = keyword.value.trim()
    const res = await adminGetScenicSpots(params)
    spots.value = res.records
    total.value = res.total
  } finally { loading.value = false }
}

function onSearch() { currentPage.value = 1; loadSpots() }
function onRefresh() { loadSpots() }
function onPageChange(page: number) { currentPage.value = page; loadSpots() }

onMounted(() => { loadSpots() })

const statusMap: Record<number, { type: '' | 'success' | 'info' | 'warning' | 'danger'; text: string }> = {
  1: { type: 'success', text: '启用' },
  0: { type: 'info', text: '停用' },
}
</script>

<template>
  <div class="admin-scenic-list">
    <div class="page-header">
      <h2 class="page-title">景点管理</h2>
      <div class="header-actions">
        <el-input v-model="keyword" placeholder="搜索景点名称" clearable style="width:240px" @keyup.enter="onSearch" />
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onRefresh">刷新</el-button>
      </div>
    </div>
    <el-card shadow="never">
      <el-table :data="spots" v-loading="loading" stripe style="width:100%">
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" label="名称" min-width="160" />
        <el-table-column prop="city" label="城市" width="100" />
        <el-table-column prop="category" label="类型" width="100" />
        <el-table-column prop="sortOrder" label="排序" width="80" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="statusMap[row.status]?.type || 'info'" size="small">{{ statusMap[row.status]?.text || '未知' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default><el-button text type="primary" disabled>编辑</el-button></template>
        </el-table-column>
      </el-table>
      <div style="margin-top:16px;text-align:right">
        <el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total" layout="total, prev, pager, next" @current-change="onPageChange" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.page-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:12px; }
.page-title { font-size:22px; font-weight:700; color:#303133; }
.header-actions { display:flex; gap:10px; align-items:center; }
</style>
