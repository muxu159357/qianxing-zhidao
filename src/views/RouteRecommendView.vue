<template>
  <div class="recommend-page">
    <main class="recommend-body">
      <section ref="headerRef" class="page-header" style="opacity:0">
        <h2>个性化路线推荐</h2>
        <p v-if="totalCount">
          基于您的游客画像，AI 从 {{ totalCount }} 条贵州精品路线中为您匹配排序
        </p>
      </section>

      <div v-if="loading" ref="loadingRef" class="loading-state" style="opacity:0">
        <p>AI 正在匹配最优路线…</p>
      </div>

      <div v-else-if="ranked.length === 0" ref="emptyRef" class="empty-state" style="opacity:0">
        <div class="empty-icon">🗺️</div>
        <h3>暂无匹配路线</h3>
        <p>请返回重新设置出行偏好</p>
        <el-button type="primary" @click="$router.push('/planner')">返回选择</el-button>
      </div>

      <template v-else>
        <section ref="bestRef" class="best-match-section" style="opacity:0">
          <div class="section-label">
            <span class="label-icon">⭐</span> 最佳匹配
          </div>

          <div class="best-card" @click="toggleExpand(ranked[0].route.id)">
            <div class="best-header">
              <div class="best-left">
                <div class="score-circle">
                  <span class="score-num">{{ ranked[0].score }}</span>
                  <span class="score-unit">分</span>
                </div>
                <div class="best-info">
                  <h3>{{ ranked[0].route.name }}</h3>
                  <p class="best-desc">{{ ranked[0].route.description }}</p>
                  <div class="best-tags">
                    <el-tag size="small" type="success" effect="light">{{ ranked[0].route.days }}天</el-tag>
                    <el-tag size="small" effect="light">{{ ranked[0].route.physicalLevel }}</el-tag>
                    <el-tag size="small" effect="light">{{ ranked[0].route.budgetRange }}</el-tag>
                    <el-tag
                      v-for="t in ranked[0].route.tags.slice(0, 3)"
                      :key="t"
                      size="small"
                      type="info"
                      effect="light"
                    >{{ t }}</el-tag>
                  </div>
                </div>
              </div>
              <div class="best-reasons">
                <div v-for="r in ranked[0].reasons" :key="r" class="reason-item">
                  <span class="reason-check">✓</span> {{ r }}
                </div>
              </div>
            </div>

            <div class="timeline">
              <div
                v-for="plan in ranked[0].route.dailyPlan"
                :key="plan.day"
                class="timeline-day"
              >
                <div class="timeline-marker">
                  <div class="marker-dot"></div>
                  <div v-if="plan.day < ranked[0].route.dailyPlan.length" class="marker-line"></div>
                </div>
                <div class="timeline-content">
                  <div class="day-head">
                    <strong>Day {{ plan.day }}</strong>
                    <span>{{ plan.title }}</span>
                  </div>
                  <p>{{ plan.description }}</p>
                  <div class="day-meta">
                    <span>🍽️ {{ plan.meals }}</span>
                    <span>🏨 {{ plan.accommodation }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="best-actions">
              <el-button type="primary" size="large" @click.stop="goGuide(ranked[0])">
                咨询此路线 AI 导游
              </el-button>
            </div>
          </div>
        </section>

        <section v-if="ranked.length > 1" ref="otherRef" class="other-section" style="opacity:0">
          <div class="section-label">
            <span class="label-icon">📋</span> 其他推荐路线
          </div>

          <div class="other-grid">
            <div
              v-for="(item, idx) in ranked.slice(1)"
              :key="item.route.id"
              class="compact-card"
              :class="{ expanded: expandedId === item.route.id }"
              @click="toggleExpand(item.route.id)"
            >
              <div class="compact-header">
                <div class="compact-score">
                  <span class="compact-num">{{ item.score }}</span>
                  <span class="compact-unit">分</span>
                </div>
                <div class="compact-info">
                  <h4>{{ item.route.name }}</h4>
                  <div class="compact-meta">
                    <el-tag size="small" type="success" effect="plain">{{ item.route.days }}天</el-tag>
                    <el-tag size="small" effect="plain">{{ item.route.physicalLevel }}</el-tag>
                    <el-tag size="small" effect="plain">{{ item.route.budgetRange }}</el-tag>
                  </div>
                </div>
                <div class="compact-rank">#{{ idx + 2 }}</div>
              </div>

              <div v-if="item.reasons.length" class="compact-reasons">
                <span v-for="r in item.reasons" :key="r" class="reason-chip">{{ r }}</span>
              </div>

              <div v-if="expandedId === item.route.id" class="compact-timeline">
                <div
                  v-for="plan in item.route.dailyPlan"
                  :key="plan.day"
                  class="mini-day"
                >
                  <strong>Day {{ plan.day }}</strong>
                  <span>{{ plan.title }}</span>
                  <p>{{ plan.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { getRankedRoutes, type RankedRoute } from '@shared/mock'
import type { VisitorSelection } from '@shared/types'

const router = useRouter()

const loading = ref(true)
const ranked = ref<RankedRoute[]>([])
const expandedId = ref<string | null>(null)
const totalCount = ref(0)

const headerRef = ref<HTMLElement | null>(null)
const loadingRef = ref<HTMLElement | null>(null)
const emptyRef = ref<HTMLElement | null>(null)
const bestRef = ref<HTMLElement | null>(null)
const otherRef = ref<HTMLElement | null>(null)

function loadSelection(): VisitorSelection | null {
  try {
    const raw = localStorage.getItem('qianxing_visitor_selection')
    if (raw) return JSON.parse(raw) as VisitorSelection
  } catch { /* ignore */ }
  return null
}

onMounted(async () => {
  gsap.from(headerRef.value, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })

  const sel = loadSelection()
  if (sel && sel.selectedTagIds.length >= 2) {
    ranked.value = await getRankedRoutes(sel)
    totalCount.value = ranked.value.length
  }
  loading.value = false
  await nextTick()

  if (ranked.value.length === 0) {
    gsap.from(emptyRef.value, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' })
    return
  }

  const tl = gsap.timeline()
  tl.from(bestRef.value, { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out' })
  if (ranked.value.length > 1) {
    const cards = otherRef.value?.querySelectorAll('.compact-card')
    if (cards) {
      tl.from(cards, { y: 24, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.2')
    }
  }
})

function toggleExpand(id: string) {
  expandedId.value = expandedId.value === id ? null : id
}

function goGuide(item: RankedRoute) {
  localStorage.setItem('qianxing_selected_route', JSON.stringify(item.route))
  router.push('/guide')
}
</script>

<style scoped>
.recommend-page {
  min-height: calc(100vh - 76px);
  background:
    radial-gradient(circle at 12% 20%, rgba(82, 183, 136, 0.18), transparent 28%),
    radial-gradient(circle at 82% 10%, rgba(45, 108, 223, 0.14), transparent 30%),
    linear-gradient(135deg, #f7fbf7 0%, #eef7f1 48%, #f8fbff 100%);
}

.recommend-body { max-width: 960px; margin: 0 auto; padding: 40px 48px 80px; }

.page-header { margin-bottom: 32px; }
.page-header h2 { margin: 0 0 10px; font-size: 36px; color: #10251d; letter-spacing: -0.03em; }
.page-header p { margin: 0; font-size: 16px; color: #4d5f6f; }

.loading-state, .empty-state { text-align: center; padding: 80px 0; color: #5d6b7a; font-size: 16px; }
.empty-icon { font-size: 56px; margin-bottom: 12px; }
.empty-state h3 { margin: 0 0 10px; color: #10251d; }

.section-label {
  font-size: 18px; font-weight: 700; color: #10251d;
  margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
}
.label-icon { font-size: 20px; }

/* 最佳匹配卡片 */
.best-card {
  border-radius: 28px; padding: 36px; cursor: pointer;
  background: rgba(255, 255, 255, 0.82); border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 0 30px 80px rgba(34, 73, 61, 0.14); backdrop-filter: blur(20px);
  transition: box-shadow 0.2s;
}
.best-card:hover { box-shadow: 0 36px 96px rgba(34, 73, 61, 0.2); }

.best-header { display: flex; align-items: flex-start; gap: 24px; }
.best-left { display: flex; gap: 24px; align-items: flex-start; flex: 1; }

.score-circle {
  width: 72px; height: 72px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #1f8f5f, #2f6bff);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: #fff; box-shadow: 0 8px 28px rgba(31, 143, 95, 0.3);
}
.score-num { font-size: 26px; font-weight: 800; line-height: 1; }
.score-unit { font-size: 11px; opacity: 0.85; }

.best-info h3 { margin: 0 0 8px; font-size: 22px; color: #10251d; }
.best-desc { margin: 0 0 12px; font-size: 14px; color: #5d6b7a; line-height: 1.7; }
.best-tags { display: flex; flex-wrap: wrap; gap: 6px; }

.best-reasons { flex-shrink: 0; display: flex; flex-direction: column; gap: 6px; }
.reason-item { font-size: 13px; color: #2f6bff; white-space: nowrap; }
.reason-check { color: #1f8f5f; font-weight: 700; }

/* Timeline */
.timeline { margin-top: 32px; padding-left: 8px; }
.timeline-day { display: flex; gap: 20px; }
.timeline-marker { display: flex; flex-direction: column; align-items: center; width: 24px; flex-shrink: 0; }
.marker-dot {
  width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0;
  background: #1f8f5f; border: 3px solid rgba(31, 143, 95, 0.2);
}
.marker-line { width: 2px; flex: 1; min-height: 24px; background: rgba(31, 143, 95, 0.15); }
.timeline-content {
  padding-bottom: 24px; flex: 1;
}
.timeline-day:last-child .timeline-content { padding-bottom: 0; }
.timeline-day:last-child .marker-line { display: none; }

.day-head { margin-bottom: 6px; font-size: 15px; color: #10251d; }
.day-head span { color: #5d6b7a; font-weight: 400; margin-left: 8px; }
.timeline-content p { margin: 0 0 8px; font-size: 14px; color: #4d5f6f; line-height: 1.6; }
.day-meta { display: flex; gap: 20px; font-size: 12px; color: #909399; }

.best-actions { margin-top: 28px; text-align: center; }
.best-actions .el-button { min-width: 240px; height: 50px; font-size: 16px; font-weight: 700; border-radius: 16px; }

/* 其他推荐 */
.other-section { margin-top: 48px; }
.other-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

.compact-card {
  border-radius: 20px; padding: 24px; cursor: pointer;
  background: rgba(255, 255, 255, 0.72); border: 1px solid rgba(31, 143, 95, 0.08);
  backdrop-filter: blur(14px); box-shadow: 0 12px 36px rgba(19, 61, 45, 0.04);
  transition: all 0.2s;
}
.compact-card:hover, .compact-card.expanded {
  border-color: rgba(31, 143, 95, 0.25);
  box-shadow: 0 18px 48px rgba(34, 73, 61, 0.1);
}

.compact-header { display: flex; gap: 16px; align-items: flex-start; }
.compact-score {
  width: 52px; height: 52px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, rgba(31, 143, 95, 0.15), rgba(47, 107, 255, 0.1));
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 1px solid rgba(31, 143, 95, 0.2);
}
.compact-num { font-size: 18px; font-weight: 800; color: #1f8f5f; line-height: 1; }
.compact-unit { font-size: 10px; color: #5d6b7a; }
.compact-info { flex: 1; }
.compact-info h4 { margin: 0 0 8px; font-size: 16px; color: #10251d; }
.compact-meta { display: flex; flex-wrap: wrap; gap: 4px; }
.compact-rank { font-size: 24px; font-weight: 800; color: rgba(31, 143, 95, 0.15); }

.compact-reasons { margin-top: 12px; display: flex; flex-wrap: wrap; gap: 6px; }
.reason-chip {
  font-size: 12px; padding: 3px 10px; border-radius: 8px;
  background: rgba(47, 107, 255, 0.06); color: #2f6bff;
  border: 1px solid rgba(47, 107, 255, 0.1);
}

.compact-timeline { margin-top: 16px; padding-top: 16px; border-top: 1px solid #eef2f5; }
.mini-day { margin-bottom: 14px; }
.mini-day:last-child { margin-bottom: 0; }
.mini-day strong { color: #1f5f45; font-size: 14px; }
.mini-day span { color: #5d6b7a; font-size: 14px; margin-left: 8px; }
.mini-day p { margin: 4px 0 0; font-size: 13px; color: #909399; line-height: 1.5; }

@media (max-width: 900px) {
  .recommend-body { padding: 32px 22px 60px; }
  .best-header { flex-direction: column; }
  .best-left { flex-direction: column; align-items: center; text-align: center; }
  .best-reasons { flex-direction: row; flex-wrap: wrap; justify-content: center; }
  .reason-item { white-space: normal; }
  .other-grid { grid-template-columns: 1fr; }
  .day-meta { flex-direction: column; gap: 4px; }
}
</style>
