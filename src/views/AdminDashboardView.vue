<template>
  <div class="admin-page">
    <main class="admin-body">
      <section ref="headerRef" class="page-header" style="opacity:0">
        <h2>后台管理 · 数据看板</h2>
        <p>景点信息管理、平台运营数据统计与业务概览</p>
      </section>

      <div ref="statsRef" class="stats-row" style="opacity:0">
        <div class="stat-card">
          <div class="stat-icon scenic">🏔️</div>
          <div class="stat-info">
            <div class="stat-num">{{ attractions.length }}</div>
            <div class="stat-label">收录景点</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon route">🗺️</div>
          <div class="stat-info">
            <div class="stat-num">5</div>
            <div class="stat-label">精品路线</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon knowledge">📚</div>
          <div class="stat-info">
            <div class="stat-num">25</div>
            <div class="stat-label">知识问答</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon active">📈</div>
          <div class="stat-info">
            <div class="stat-num">98.5<span class="stat-unit">%</span></div>
            <div class="stat-label">服务可用率</div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid" ref="gridRef">
        <section class="chart-panel" style="opacity:0">
          <div class="panel-card">
            <h3>景点评分分布</h3>
            <div class="rating-bars">
              <div v-for="r in ratingDistribution" :key="r.label" class="rating-item">
                <span class="rating-label">{{ r.label }}</span>
                <el-progress :percentage="r.percent" :stroke-width="12" :color="r.color" />
                <span class="rating-count">{{ r.count }}</span>
              </div>
            </div>
          </div>

          <div class="panel-card">
            <h3>景点分类统计</h3>
            <div class="category-tags">
              <div v-for="c in categoryStats" :key="c.name" class="cat-row">
                <span class="cat-name">{{ c.name }}</span>
                <el-progress :percentage="c.percent" :stroke-width="10" color="#1f8f5f" />
                <span class="cat-count">{{ c.count }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="table-panel" ref="tableRef" style="opacity:0">
          <div class="panel-card table-card">
            <div class="table-header">
              <h3>景点管理</h3>
              <el-input v-model="searchKeyword" placeholder="搜索景点…" size="small" clearable class="table-search" />
            </div>
            <el-table :data="filteredAttractions" stripe size="default" max-height="400">
              <el-table-column prop="name" label="景点名称" min-width="120" />
              <el-table-column prop="city" label="城市" min-width="100" />
              <el-table-column prop="category" label="分类" width="100">
                <template #default="{ row }">
                  <el-tag size="small" type="success" effect="plain">{{ row.category }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="rating" label="评分" width="70" sortable />
              <el-table-column prop="price" label="门票(¥)" width="90" sortable />
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button text type="primary" size="small" @click="viewDetail(row.id)">查看</el-button>
                  <el-button text type="warning" size="small" @click="toggleEdit(row)">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>

            <div v-if="editingRow" class="edit-panel">
              <h4>编辑：{{ editingRow.name }}</h4>
              <div class="edit-form">
                <el-input v-model="editForm.name" placeholder="景点名称" size="small" />
                <el-input v-model="editForm.city" placeholder="城市" size="small" />
                <el-input v-model.number="editForm.price" placeholder="门票价格" size="small" />
                <el-select v-model="editForm.category" placeholder="分类" size="small">
                  <el-option label="自然风光" value="自然风光" />
                  <el-option label="民族文化" value="民族文化" />
                  <el-option label="古镇历史" value="古镇历史" />
                  <el-option label="户外探险" value="户外探险" />
                </el-select>
                <el-input v-model="editForm.description" placeholder="描述" size="small" type="textarea" :rows="2" />
              </div>
              <div class="edit-actions">
                <el-button type="primary" size="small" @click="saveEdit">保存</el-button>
                <el-button size="small" @click="editingRow = null">取消</el-button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { attractions as mockAttractions } from '@shared/mock/attractions'

interface EditableAttraction {
  id: string
  name: string
  city: string
  category: string
  rating: number
  price: number
  duration: string
  description: string
  highlights: string[]
  tips: string
  tags: string[]
}

const router = useRouter()
const headerRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)

const attractions = ref<EditableAttraction[]>(
  mockAttractions.map((a) => ({ ...a, tags: [...a.tags], highlights: [...a.highlights] }))
)
const searchKeyword = ref('')
const editingRow = ref<EditableAttraction | null>(null)
const editForm = ref({ name: '', city: '', price: 0, category: '', description: '' })

const filteredAttractions = computed(() => {
  const q = searchKeyword.value.trim().toLowerCase()
  if (!q) return attractions.value
  return attractions.value.filter(
    (a) => a.name.toLowerCase().includes(q) || a.city.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
  )
})

const ratingDistribution = computed(() => {
  const ranges = [
    { min: 4.8, max: 5.0, label: '4.8–5.0', color: '#1f8f5f' },
    { min: 4.5, max: 4.8, label: '4.5–4.8', color: '#52b788' },
    { min: 4.0, max: 4.5, label: '4.0–4.5', color: '#95d5b2' },
    { min: 0, max: 4.0, label: '4.0以下', color: '#b7e4c7' },
  ]
  const total = attractions.value.length
  return ranges.map((r) => {
    const count = attractions.value.filter((a) => a.rating >= r.min && a.rating < r.max).length
    return { label: r.label, count, percent: total ? Math.round((count / total) * 100) : 0, color: r.color }
  })
})

const categoryStats = computed(() => {
  const map: Record<string, number> = {}
  for (const a of attractions.value) { map[a.category] = (map[a.category] || 0) + 1 }
  const total = attractions.value.length
  return Object.entries(map).map(([name, count]) => ({ name, count, percent: Math.round((count / total) * 100) }))
})

onMounted(() => {
  const tl = gsap.timeline()
  tl.from(headerRef.value, { y: 24, opacity: 0, duration: 0.5, ease: 'power3.out' })
  const statCards = statsRef.value?.querySelectorAll('.stat-card') ?? []
  tl.from(statCards, { y: 20, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'power3.out' }, '-=0.2')
  if (gridRef.value) {
    tl.from(gridRef.value.querySelectorAll('.panel-card'), { y: 28, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
  }
})

function viewDetail(id: string) { router.push(`/scenic/${id}`) }

function toggleEdit(row: EditableAttraction) {
  if (editingRow.value?.id === row.id) { editingRow.value = null; return }
  editingRow.value = row
  editForm.value = { name: row.name, city: row.city, price: row.price, category: row.category, description: row.description }
}

function saveEdit() {
  if (!editingRow.value) return
  const idx = attractions.value.findIndex((a) => a.id === editingRow.value!.id)
  if (idx >= 0) {
    attractions.value[idx] = { ...attractions.value[idx], ...editForm.value, price: Number(editForm.value.price) }
  }
  editingRow.value = null
}
</script>

<style scoped>
.admin-page {
  min-height: calc(100vh - 76px);
  background: radial-gradient(circle at 12% 20%, rgba(82, 183, 136, 0.18), transparent 28%),
    radial-gradient(circle at 82% 10%, rgba(45, 108, 223, 0.14), transparent 30%),
    linear-gradient(135deg, #f7fbf7 0%, #eef7f1 48%, #f8fbff 100%);
}
.admin-body { max-width: 1100px; margin: 0 auto; padding: 32px 24px 60px; }
.page-header { margin-bottom: 28px; }
.page-header h2 { margin: 0 0 8px; font-size: 32px; color: #10251d; letter-spacing: -0.03em; }
.page-header p { margin: 0; font-size: 15px; color: #4d5f6f; }

.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; margin-bottom: 32px; }
.stat-card {
  display: flex; align-items: center; gap: 16px; padding: 24px; border-radius: 20px;
  background: rgba(255, 255, 255, 0.78); border: 1px solid rgba(31, 143, 95, 0.08);
  box-shadow: 0 12px 36px rgba(19, 61, 45, 0.04); backdrop-filter: blur(14px);
}
.stat-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.stat-icon.scenic { background: rgba(31, 143, 95, 0.12); }
.stat-icon.route { background: rgba(47, 107, 255, 0.1); }
.stat-icon.knowledge { background: rgba(230, 126, 34, 0.1); }
.stat-icon.active { background: rgba(31, 143, 95, 0.08); }
.stat-num { font-size: 28px; font-weight: 800; color: #10251d; line-height: 1.2; }
.stat-unit { font-size: 16px; color: #909399; font-weight: 400; }
.stat-label { font-size: 13px; color: #909399; margin-top: 2px; }

.dashboard-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; align-items: start; }
.chart-panel { display: flex; flex-direction: column; gap: 20px; }

.panel-card {
  padding: 24px; border-radius: 20px;
  background: rgba(255, 255, 255, 0.78); border: 1px solid rgba(31, 143, 95, 0.08);
  box-shadow: 0 12px 36px rgba(19, 61, 45, 0.04); backdrop-filter: blur(14px);
}
.panel-card h3 { margin: 0 0 20px; font-size: 17px; color: #10251d; }

.rating-bars { display: flex; flex-direction: column; gap: 14px; }
.rating-item { display: flex; align-items: center; gap: 12px; }
.rating-label { font-size: 13px; color: #5d6b7a; width: 60px; flex-shrink: 0; }
.rating-item :deep(.el-progress) { flex: 1; }
.rating-count { font-size: 13px; font-weight: 600; color: #10251d; width: 28px; text-align: right; }

.category-tags { display: flex; flex-direction: column; gap: 14px; }
.cat-row { display: flex; align-items: center; gap: 12px; }
.cat-name { font-size: 13px; color: #5d6b7a; width: 68px; flex-shrink: 0; }
.cat-row :deep(.el-progress) { flex: 1; }
.cat-count { font-size: 14px; font-weight: 700; color: #10251d; width: 24px; text-align: right; }

.table-panel { position: sticky; top: 24px; }
.table-card { padding: 20px 24px; }
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.table-header h3 { margin: 0; font-size: 17px; color: #10251d; }
.table-search { width: 220px; }

.edit-panel { margin-top: 20px; padding: 20px; border-radius: 16px; background: rgba(47, 107, 255, 0.03); border: 1px solid rgba(47, 107, 255, 0.1); }
.edit-panel h4 { margin: 0 0 14px; font-size: 15px; color: #10251d; }
.edit-form { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
.edit-actions { display: flex; gap: 10px; }

@media (max-width: 900px) {
  .admin-body { padding: 24px 16px 40px; }
  .page-header h2 { font-size: 26px; }
  .stats-row { grid-template-columns: 1fr 1fr; }
  .dashboard-grid { grid-template-columns: 1fr; }
  .table-panel { position: static; }
  .edit-form { grid-template-columns: 1fr; }
}
</style>
