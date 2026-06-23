<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import {
  adminGetScenicSpots, adminCreateScenicSpot, adminUpdateScenicSpot,
  adminUpdateScenicStatus, adminDeleteScenicSpot,
  type AdminScenicSpot, type AdminScenicForm
} from '@/api/admin-scenic'
import { ElMessage, ElMessageBox } from 'element-plus'

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
function onPageChange(page: number) { currentPage.value = page; loadSpots() }

// ========== Dialog state ==========
const dlgVisible = ref(false)
const dlgTitle = ref('新增景点')
const dlgLoading = ref(false)
const dlgEditId = ref<number | null>(null)
const form = reactive<AdminScenicForm>({ name: '', city: '', category: '', description: '', tags: '', sortOrder: 0, status: 1 })

const CATEGORIES = ['自然风光', '民族文化', '古镇历史', '户外探险', '美食特产', '避暑康养', '摄影打卡', '亲子研学']
const CITIES = ['贵阳', '安顺', '遵义', '铜仁', '毕节', '黔东南', '黔南', '黔西南']

function openCreate() {
  dlgEditId.value = null; dlgTitle.value = '新增景点'
  Object.assign(form, { name: '', city: '', category: '', description: '', tags: '', sortOrder: 0, status: 1, highlights: '', tips: '', visitDuration: '', ticketPrice: 0, rating: 0 })
  dlgVisible.value = true
}

function openEdit(row: AdminScenicSpot) {
  dlgEditId.value = row.id; dlgTitle.value = '编辑景点'
  form.name = row.name; form.city = row.city; form.category = row.category || ''
  form.description = row.description || ''; form.tags = row.tags || ''
  form.sortOrder = row.sortOrder ?? 0; form.status = row.status ?? 1
  form.highlights = row.highlights || ''; form.tips = row.tips || ''
  form.visitDuration = row.visitDuration || ''; form.ticketPrice = row.ticketPrice ?? 0; form.rating = row.rating ?? 0
  dlgVisible.value = true
}

async function onSave() {
  if (!form.name.trim()) { ElMessage.warning('景点名称不能为空'); return }
  if (!form.city) { ElMessage.warning('请选择城市'); return }
  if (!form.category) { ElMessage.warning('请选择类型'); return }
  dlgLoading.value = true
  try {
    if (dlgEditId.value) {
      await adminUpdateScenicSpot(dlgEditId.value, form)
      ElMessage.success('保存成功')
    } else {
      await adminCreateScenicSpot(form)
      ElMessage.success('新增成功')
    }
    dlgVisible.value = false; loadSpots()
  } finally { dlgLoading.value = false }
}

// ========== Status toggle ==========
async function onToggleStatus(row: AdminScenicSpot) {
  const newStatus = row.status === 1 ? 0 : 1
  const label = newStatus === 1 ? '上架' : '下架'
  try {
    await ElMessageBox.confirm(`确定要${label}「${row.name}」吗？`, '操作确认', { type: 'warning' })
  } catch { return }
  await adminUpdateScenicStatus(row.id, newStatus)
  row.status = newStatus
  ElMessage.success('操作成功')
}

// ========== Delete ==========
async function onDelete(row: AdminScenicSpot) {
  try {
    await ElMessageBox.confirm(`确定要禁用「${row.name}」吗？\n该操作将把景点状态设为下架。`, '操作确认', { type: 'warning' })
  } catch { return }
  await adminDeleteScenicSpot(row.id)
  ElMessage.success('已禁用')
  loadSpots()
}

const statusMap: Record<number, { type: '' | 'success' | 'info' | 'warning' | 'danger'; text: string }> = {
  1: { type: 'success', text: '上架' },
  0: { type: 'info', text: '下架' },
}

onMounted(() => { loadSpots() })
</script>

<template>
  <div class="admin-scenic-list">
    <div class="aph"><div class="aph-l"><h2 class="aph-t">景点管理</h2><p class="aph-d">维护贵州核心景区信息与展示状态</p></div><div class="aph-r"><el-input v-model="keyword" placeholder="搜索景点名称" clearable style="width:220px" @keyup.enter="onSearch"/><el-button type="primary" @click="onSearch">搜索</el-button><el-button @click="loadSpots">刷新</el-button><el-button type="success" @click="openCreate">新增景点</el-button></div></div>
    <div class="atc">
      <el-table :data="spots" v-loading="loading" style="width:100%">
        <el-table-column prop="id" label="ID" width="60"/><el-table-column prop="name" label="名称" min-width="150"/><el-table-column prop="city" label="城市" width="90"/><el-table-column prop="category" label="类型" width="100"/><el-table-column prop="sortOrder" label="排序" width="70"/>
        <el-table-column label="状态" width="80"><template #default="{row}"><el-tag :class="row.status===1?'ast-1':'ast-0'" size="small" disable-transitions>{{row.status===1?'上架':'下架'}}</el-tag></template></el-table-column>
        <el-table-column prop="updatedAt" label="更新时间" width="170"/>
        <el-table-column label="操作" width="220" fixed="right"><template #default="{row}"><el-button text type="primary" size="small" @click="openEdit(row)">编辑</el-button><el-button text :type="row.status===1?'warning':'success'" size="small" @click="onToggleStatus(row)">{{row.status===1?'下架':'上架'}}</el-button><el-button text type="danger" size="small" @click="onDelete(row)">禁用</el-button></template></el-table-column>
      </el-table>
      <div v-if="!loading&&spots.length===0" class="aeh">暂无数据</div>
      <div class="atc-pager"><el-pagination v-model:current-page="currentPage" :page-size="pageSize" :total="total" layout="total,prev,pager,next" @current-change="onPageChange"/></div>
    </div>
    <el-dialog v-model="dlgVisible" :title="dlgTitle" width="640px" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="form" label-width="90px" @submit.prevent="onSave">
        <el-row :gutter="16">
          <el-col :span="14"><el-form-item label="景点名称" required><el-input v-model="form.name" placeholder="如：黄果树瀑布" /></el-form-item></el-col>
          <el-col :span="10"><el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" :max="999" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="城市" required>
              <el-select v-model="form.city" placeholder="选择城市" style="width:100%"><el-option v-for="c in CITIES" :key="c" :label="c" :value="c" /></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" required>
              <el-select v-model="form.category" placeholder="选择类型" style="width:100%"><el-option v-for="c in CATEGORIES" :key="c" :label="c" :value="c" /></el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="简介">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="景点详细介绍" />
        </el-form-item>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="标签"><el-input v-model="form.tags" placeholder="如：瀑布,自然" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="游玩时长"><el-input v-model="form.visitDuration" placeholder="如：半天" /></el-form-item></el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12"><el-form-item label="门票"><el-input-number v-model="form.ticketPrice" :min="0" /></el-form-item></el-col>
          <el-col :span="12"><el-form-item label="评分"><el-input-number v-model="form.rating" :min="0" :max="5" :precision="1" /></el-form-item></el-col>
        </el-row>
        <el-form-item label="亮点"><el-input v-model="form.highlights" placeholder="景点亮点" /></el-form-item>
        <el-form-item label="提示"><el-input v-model="form.tips" placeholder="游玩提示" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dlgVisible=false">取消</el-button>
        <el-button type="primary" :loading="dlgLoading" @click="onSave">{{ dlgEditId ? '保存' : '新增' }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
