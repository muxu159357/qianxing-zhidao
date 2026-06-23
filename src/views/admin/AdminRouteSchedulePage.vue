<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminGetRoute } from '@/api/admin-route'
import { adminGetRouteDays, adminCreateRouteDay, adminUpdateRouteDay, adminDeleteRouteDay, type AdminRouteDay } from '@/api/admin-route-day'
import { adminGetRouteSpots, adminAddRouteSpot, adminRemoveRouteSpot, type AdminRouteSpot } from '@/api/admin-route-spot'
import { adminGetScenicSpots, type AdminScenicSpot } from '@/api/admin-scenic'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute(); const router = useRouter()
const routeId = Number(route.params.id)
const routeName = ref(''); const days = ref<AdminRouteDay[]>([]); const spots = ref<AdminRouteSpot[]>([]); const loading = ref(false)
const scenicOpts = ref<AdminScenicSpot[]>([])

async function loadAll() { loading.value = true; try { const [r, d, s] = await Promise.all([adminGetRoute(routeId), adminGetRouteDays(routeId), adminGetRouteSpots(routeId)]); routeName.value = r.name; days.value = d; spots.value = s } finally { loading.value = false } }
async function loadScenic() { try { const r = await adminGetScenicSpots({ page: 1, size: 200 }); scenicOpts.value = r.records.filter(x => x.status === 1) } catch { /* ignore */ } }

// Day
const dayDlg = ref(false); const dayEditId = ref<number | null>(null); const dayLoading = ref(false)
const df = reactive({ dayNumber: 1, title: '', description: '', meals: '', accommodation: '' })
function openDayNew() { dayEditId.value = null; Object.assign(df, { dayNumber: days.value.length + 1, title: '', description: '', meals: '', accommodation: '' }); dayDlg.value = true }
function openDayEdit(d: AdminRouteDay) { dayEditId.value = d.id; df.dayNumber = d.dayNumber; df.title = d.title; df.description = d.description || ''; df.meals = d.meals || ''; df.accommodation = d.accommodation || ''; dayDlg.value = true }
async function onDaySave() { if (!df.title.trim()) { ElMessage.warning('标题不能为空'); return }; dayLoading.value = true; try { dayEditId.value ? await adminUpdateRouteDay(routeId, dayEditId.value, df) : await adminCreateRouteDay(routeId, df); ElMessage.success('保存成功'); dayDlg.value = false; loadAll() } finally { dayLoading.value = false } }
async function onDayDel(d: AdminRouteDay) { try { await ElMessageBox.confirm(`删除第${d.dayNumber}天？`, '确认', { type: 'warning' }) } catch { return }; await adminDeleteRouteDay(routeId, d.id); ElMessage.success('已删除'); loadAll() }

// Spot
const spotDlg = ref(false); const spotLoading = ref(false)
const sf = reactive({ scenicSpotId: 0, routeDayId: 1, spotOrder: 1, stayDuration: '', visitTip: '' })
function openSpotAdd(dayNum: number) { sf.scenicSpotId = 0; sf.routeDayId = dayNum; sf.spotOrder = 1; sf.stayDuration = ''; sf.visitTip = ''; spotDlg.value = true }
async function onSpotSave() { if (!sf.scenicSpotId) { ElMessage.warning('请选择景点'); return }; spotLoading.value = true; try { await adminAddRouteSpot(routeId, sf); ElMessage.success('添加成功'); spotDlg.value = false; loadAll() } finally { spotLoading.value = false } }
async function onSpotRm(s: AdminRouteSpot) { try { await ElMessageBox.confirm('移除该景点？', '确认', { type: 'warning' }) } catch { return }; await adminRemoveRouteSpot(routeId, s.id); ElMessage.success('已移除'); loadAll() }
function sName(id: number) { return scenicOpts.value.find(x => x.id === id)?.name || `#${id}` }

onMounted(async () => { await loadScenic(); loadAll() })
</script>

<template>
  <div v-loading="loading" class="asp">
    <div class="ph"><h2 class="pt">{{ routeName || '路线日程' }} — 日程与景点</h2><div class="aph-r"><el-button @click="router.push('/admin/routes')">返回</el-button><el-button type="primary" @click="openDayNew">新增日程</el-button><el-button @click="loadAll">刷新</el-button></div></div>
    <div v-if="days.length===0" class="aeh">每日安排将在这里维护</div>

    <div v-for="d in days" :key="d.id" class="dc">
      <div class="dh"><span class="dn">第{{ d.dayNumber }}天</span><span class="dt">{{ d.title }}</span><span v-if="d.description" class="dd">{{ d.description }}</span><div style="flex:1"/><el-button text size="small" @click="openSpotAdd(d.dayNumber)">+ 景点</el-button><el-button text type="primary" size="small" @click="openDayEdit(d)">编辑</el-button><el-button text type="danger" size="small" @click="onDayDel(d)">删除</el-button></div>
      <div class="ds">
        <div v-for="s in spots.filter(x=>x.routeDayId===d.dayNumber)" :key="s.id" class="sr"><span class="sn">{{ sName(s.scenicSpotId) }}</span><span v-if="s.stayDuration" class="sd">{{ s.stayDuration }}</span><span v-if="s.visitTip" class="st">{{ s.visitTip }}</span><span class="so">顺序{{ s.spotOrder }}</span><el-button text type="danger" size="small" @click="onSpotRm(s)">移除</el-button></div>
        <div v-if="spots.filter(x=>x.routeDayId===d.dayNumber).length===0" class="se">暂无关联景点</div>
      </div>
    </div>

    <el-dialog v-model="dayDlg" :title="dayEditId?'编辑日程':'新增日程'" width="500px" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="df" label-width="70px">
        <el-row :gutter="16"><el-col :span="8"><el-form-item label="天数"><el-input-number v-model="df.dayNumber" :min="1" :max="15"/></el-form-item></el-col><el-col :span="16"><el-form-item label="标题" required><el-input v-model="df.title" placeholder="如：贵阳出发，抵达安顺"/></el-form-item></el-col></el-row>
        <el-form-item label="安排"><el-input v-model="df.description" type="textarea" :rows="2"/></el-form-item>
        <el-row :gutter="16"><el-col :span="12"><el-form-item label="餐饮"><el-input v-model="df.meals"/></el-form-item></el-col><el-col :span="12"><el-form-item label="住宿"><el-input v-model="df.accommodation"/></el-form-item></el-col></el-row>
      </el-form>
      <template #footer><el-button @click="dayDlg=false">取消</el-button><el-button type="primary" :loading="dayLoading" @click="onDaySave">{{ dayEditId?'保存':'新增' }}</el-button></template>
    </el-dialog>

    <el-dialog v-model="spotDlg" title="添加景点" width="460px" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="sf" label-width="70px">
        <el-form-item label="景点" required><el-select v-model="sf.scenicSpotId" filterable placeholder="搜索景点" style="width:100%"><el-option v-for="s in scenicOpts" :key="s.id" :label="s.name" :value="s.id"/></el-select></el-form-item>
        <el-row :gutter="12"><el-col :span="8"><el-form-item label="天数"><el-input-number v-model="sf.routeDayId" :min="1"/></el-form-item></el-col><el-col :span="8"><el-form-item label="顺序"><el-input-number v-model="sf.spotOrder" :min="1" :max="99"/></el-form-item></el-col><el-col :span="8"><el-form-item label="时长"><el-input v-model="sf.stayDuration"/></el-form-item></el-col></el-row>
        <el-form-item label="提醒"><el-input v-model="sf.visitTip"/></el-form-item>
      </el-form>
      <template #footer><el-button @click="spotDlg=false">取消</el-button><el-button type="primary" :loading="spotLoading" @click="onSpotSave">添加</el-button></template>
    </el-dialog>
  </div>
</template>

<style scoped>
.asp{padding:0}.ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:12px}.pt{font-size:22px;font-weight:700;color:#303133}.ha{display:flex;gap:10px;align-items:center}.eh{text-align:center;color:#909399;padding:40px 0}
.dc{background:#fff;border-radius:12px;padding:16px 20px;margin-bottom:12px;box-shadow:0 2px 8px rgba(0,0,0,0.04)}
.dh{display:flex;align-items:center;gap:12px;flex-wrap:wrap}.dn{font-weight:700;color:#1f8f5f;font-size:15px}.dt{font-weight:600;color:#303133;font-size:15px}.dd{font-size:13px;color:#909399}
.ds{margin-top:10px;padding-top:10px;border-top:1px solid #eee}
.sr{display:flex;align-items:center;gap:10px;padding:6px 0;font-size:13px}.sn{font-weight:500;color:#2f6bff}.sd,.st{color:#909399}.so{color:#c0c4cc;margin-left:auto}.se{color:#c0c4cc;padding:8px 0}
</style>
