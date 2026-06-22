<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { adminGetRoutes, adminCreateRoute, adminUpdateRoute, adminUpdateRouteStatus, adminDeleteRoute, type AdminRoute, type AdminRouteForm } from '@/api/admin-route'
import { ElMessage, ElMessageBox } from 'element-plus'

const routes = ref<AdminRoute[]>([])
const total = ref(0); const loading = ref(false); const keyword = ref(''); const currentPage = ref(1); const pageSize = ref(10)

async function loadRoutes() {
  loading.value = true
  try { const p: Record<string, string | number> = { page: currentPage.value, size: pageSize.value }; if (keyword.value.trim()) p.keyword = keyword.value.trim(); const r = await adminGetRoutes(p); routes.value = r.records; total.value = r.total } finally { loading.value = false }
}
function onSearch() { currentPage.value = 1; loadRoutes() }
function onPageChange(page: number) { currentPage.value = page; loadRoutes() }

const dlgVisible = ref(false); const dlgTitle = ref('新增路线'); const dlgLoading = ref(false); const dlgEditId = ref<number | null>(null)
const form = reactive<AdminRouteForm>({ name: '', description: '', dayCount: 1, energyLevel: '适中', budgetRange: '', suitableCrowd: '', tags: '', theme: '', sortOrder: 0, status: 1 })
const THEMES = ['自然风光', '民族文化', '古镇历史', '户外探险', '美食特产', '避暑康养', '综合体验']
const ENERGIES = ['轻松', '适中', '挑战']

function openCreate() { dlgEditId.value = null; dlgTitle.value = '新增路线'; Object.assign(form, { name: '', description: '', dayCount: 1, energyLevel: '适中', budgetRange: '', suitableCrowd: '', tags: '', theme: '', sortOrder: 0, status: 1 }); dlgVisible.value = true }
function openEdit(row: AdminRoute) { dlgEditId.value = row.id; dlgTitle.value = '编辑路线'; form.name = row.name; form.description = row.description || ''; form.dayCount = row.dayCount ?? 1; form.energyLevel = row.energyLevel || '适中'; form.budgetRange = row.budgetRange || ''; form.suitableCrowd = row.suitableCrowd || ''; form.tags = row.tags || ''; form.theme = row.theme || ''; form.sortOrder = row.sortOrder ?? 0; form.status = row.status ?? 1; dlgVisible.value = true }

async function onSave() {
  if (!form.name.trim()) { ElMessage.warning('路线名称不能为空'); return }
  if (!form.dayCount || form.dayCount < 1) { ElMessage.warning('天数必须大于0'); return }
  if (!form.theme) { ElMessage.warning('请选择主题'); return }
  dlgLoading.value = true
  try { dlgEditId.value ? await adminUpdateRoute(dlgEditId.value, form) : await adminCreateRoute(form); ElMessage.success(dlgEditId.value ? '保存成功' : '新增成功'); dlgVisible.value = false; loadRoutes() } finally { dlgLoading.value = false }
}

async function onToggleStatus(row: AdminRoute) {
  const s = row.status === 1 ? 0 : 1
  try { await ElMessageBox.confirm(`确定要${s===1?'上架':'下架'}「${row.name}」吗？`, '操作确认', { type: 'warning' }) } catch { return }
  await adminUpdateRouteStatus(row.id, s); row.status = s; ElMessage.success('操作成功')
}
async function onDelete(row: AdminRoute) { try { await ElMessageBox.confirm(`确定要禁用「${row.name}」吗？`, '操作确认', { type: 'warning' }) } catch { return }; await adminDeleteRoute(row.id); ElMessage.success('已禁用'); loadRoutes() }

const sMap: Record<number, { t: '' | 'success' | 'info' | 'warning' | 'danger'; tx: string }> = { 1: { t: 'success', tx: '上架' }, 0: { t: 'info', tx: '下架' } }
onMounted(() => { loadRoutes() })
</script>

<template>
  <div class="ar-page">
    <div class="ph"><h2 class="pt">路线管理</h2><div class="ha"><el-input v-model="keyword" placeholder="搜索路线名称" clearable style="width:240px" @keyup.enter="onSearch"/><el-button type="primary" @click="onSearch">搜索</el-button><el-button @click="loadRoutes">刷新</el-button><el-button type="success" @click="openCreate">新增路线</el-button></div></div>
    <el-card shadow="never">
      <el-table :data="routes" v-loading="loading" stripe>
        <el-table-column prop="id" label="ID" width="60"/><el-table-column prop="name" label="名称" min-width="160"/><el-table-column prop="dayCount" label="天数" width="60"/><el-table-column prop="theme" label="主题" width="100"/><el-table-column prop="energyLevel" label="强度" width="70"/><el-table-column prop="sortOrder" label="排序" width="70"/>
        <el-table-column label="状态" width="80"><template #default="{ row }"><el-tag :type="sMap[row.status]?.t||'info'" size="small">{{ sMap[row.status]?.tx||'未知' }}</el-tag></template></el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="170"/>
        <el-table-column label="操作" width="220" fixed="right"><template #default="{ row }"><el-button text type="primary" size="small" @click="openEdit(row)">编辑</el-button><el-button text size="small" :type="row.status===1?'warning':'success'" @click="onToggleStatus(row)">{{ row.status===1?'下架':'上架' }}</el-button><el-button text type="danger" size="small" @click="onDelete(row)">禁用</el-button></template></el-table-column>
      </el-table>
      <div v-if="!loading && routes.length===0" class="eh">暂无数据</div>
      <div style="margin-top:16px;text-align:right"><el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total" layout="total, prev, pager, next" @current-change="onPageChange"/></div>
    </el-card>
    <el-dialog v-model="dlgVisible" :title="dlgTitle" width="600px" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="90px">
        <el-row :gutter="16"><el-col :span="16"><el-form-item label="路线名称" required><el-input v-model="form.name" placeholder="如：黔中精华三日游"/></el-form-item></el-col><el-col :span="8"><el-form-item label="天数" required><el-input-number v-model="form.dayCount" :min="1" :max="15"/></el-form-item></el-col></el-row>
        <el-row :gutter="16"><el-col :span="12"><el-form-item label="主题" required><el-select v-model="form.theme" style="width:100%"><el-option v-for="t in THEMES" :key="t" :label="t" :value="t"/></el-select></el-form-item></el-col><el-col :span="12"><el-form-item label="强度"><el-select v-model="form.energyLevel" style="width:100%"><el-option v-for="e in ENERGIES" :key="e" :label="e" :value="e"/></el-select></el-form-item></el-col></el-row>
        <el-form-item label="简介"><el-input v-model="form.description" type="textarea" :rows="2" placeholder="路线一句话简介"/></el-form-item>
        <el-row :gutter="16"><el-col :span="12"><el-form-item label="预算"><el-input v-model="form.budgetRange" placeholder="如：中等"/></el-form-item></el-col><el-col :span="12"><el-form-item label="人群"><el-input v-model="form.suitableCrowd" placeholder="如：情侣/家庭"/></el-form-item></el-col></el-row>
        <el-form-item label="标签"><el-input v-model="form.tags" placeholder="如：瀑布,苗寨,古镇"/></el-form-item>
        <el-row :gutter="16"><el-col :span="12"><el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" :max="999"/></el-form-item></el-col><el-col :span="12"><el-form-item label="状态"><el-switch v-model="form.status" :active-value="1" :inactive-value="0" active-text="上架" inactive-text="下架"/></el-form-item></el-col></el-row>
      </el-form>
      <template #footer><el-button @click="dlgVisible=false">取消</el-button><el-button type="primary" :loading="dlgLoading" @click="onSave">{{ dlgEditId?'保存':'新增' }}</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped>.ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px}.pt{font-size:22px;font-weight:700;color:#303133}.ha{display:flex;gap:10px;align-items:center}.eh{text-align:center;color:#909399;padding:40px 0}</style>
