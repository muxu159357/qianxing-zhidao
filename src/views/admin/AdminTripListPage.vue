<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminGetTrips, type AdminTrip } from '@/api/admin-trip'
const trips = ref<AdminTrip[]>([]); const total = ref(0); const loading = ref(false); const status = ref(''); const currentPage = ref(1); const pageSize = ref(20)
async function load() { loading.value = true; try { const p: Record<string,string|number> = { page: currentPage.value, size: pageSize.value }; if (status.value.trim()) p.status = status.value.trim(); const r = await adminGetTrips(p); trips.value = r.records; total.value = r.total } finally { loading.value = false } }
function onSearch() { currentPage.value = 1; load() }
const sMap: Record<string,string> = { ongoing:'进行中', upcoming:'未开始', completed:'已完成', active:'进行中' }
onMounted(()=>{ load() })
</script>
<template><div><div class="aph"><div class="aph-l"><h2 class="aph-t">行程管理</h2><p class="aph-d">查看用户行程记录与状态（只读）</p></div><div class="aph-r"><el-select v-model="status" placeholder="状态" clearable style="width:120px" @change="onSearch"><el-option label="进行中" value="ongoing"/><el-option label="未开始" value="upcoming"/><el-option label="已完成" value="completed"/></el-select><el-button type="primary" @click="onSearch">搜索</el-button><el-button @click="load">刷新</el-button></div></div>
<div class="atc"><el-table :data="trips" v-loading="loading" stripe><el-table-column prop="id" label="ID" width="60"/><el-table-column prop="routeName" label="路线" min-width="160"/><el-table-column prop="userId" label="用户ID" width="80"/><el-table-column prop="dayCount" label="天数" width="60"/><el-table-column label="状态" width="80"><template #default="{row}"><el-tag :type="row.status==='ongoing'||row.status==='active'?'success':row.status==='completed'?'info':''" size="small">{{ sMap[row.status]||row.status }}</el-tag></template></el-table-column><el-table-column prop="travelStartDate" label="出行日期" width="120"/><el-table-column prop="createdAt" label="创建时间" width="170"/></el-table>
<div v-if="!loading&&trips.length===0" class="aeh">暂无数据</div>
<div class="atc-pager"><el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total" layout="total,prev,pager,next" @current-change="(p:number)=>{currentPage=p;load()}"/></div></div></div></template>
<style scoped></style>
