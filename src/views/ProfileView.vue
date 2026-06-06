<template>
  <div class="profile-page">
    <main class="profile-body">
      <section ref="headerRef" class="page-header" style="opacity:0">
        <h2>AI 游客画像</h2>
        <p>基于您的兴趣偏好与出行需求，AI 已为您生成专属游客画像与行程建议</p>
      </section>

      <div v-if="loading" ref="loadingRef" class="loading-card" style="opacity:0">
        <div class="loading-icon"><el-icon :size="48"><MagicStick /></el-icon></div>
        <p>AI 正在分析您的偏好，生成专属画像…</p>
      </div>

      <template v-else-if="profile">
        <div ref="profileGridRef" class="profile-grid" style="opacity:0">
          <section class="profile-main">
            <div class="hero-card">
              <div class="hero-header">
                <span class="hero-label">游客画像</span>
                <el-tag type="success" size="small" effect="light">AI 生成</el-tag>
              </div>
              <div class="hero-name">{{ profile.profileName }}</div>
              <p class="hero-summary">{{ profile.matchSummary }}</p>
              <div class="hero-meta">
                <el-tag
                  v-for="tid in selection?.selectedTagIds ?? []"
                  :key="tid"
                  size="default"
                  type="success"
                  effect="plain"
                  round
                >{{ getTagName(tid) }}</el-tag>
              </div>
            </div>

            <div class="match-card">
              <h3 class="card-title"><el-icon class="card-icon"><Connection /></el-icon> 兴趣匹配度</h3>
              <div class="match-list">
                <div
                  v-for="item in profile.dominantInterests"
                  :key="item.tagId"
                  class="match-item"
                >
                  <div class="match-header">
                    <span class="match-name">{{ getTagName(item.tagId) }}</span>
                    <span class="match-score">{{ item.score }}%</span>
                  </div>
                  <el-progress
                    :percentage="item.score"
                    :stroke-width="10"
                    :color="progressColor"
                  />
                  <p class="match-reason">{{ item.reason }}</p>
                </div>
              </div>

              <div
                v-if="profile.secondaryInterests.length"
                class="secondary-list"
              >
                <h4 class="sub-title">补充兴趣</h4>
                <div
                  v-for="item in profile.secondaryInterests"
                  :key="item.tagId"
                  class="match-item"
                >
                  <div class="match-header">
                    <span class="match-name">{{ getTagName(item.tagId) }}</span>
                    <span class="match-score secondary">{{ item.score }}%</span>
                  </div>
                  <el-progress
                    :percentage="item.score"
                    :stroke-width="8"
                    color="#909399"
                  />
                </div>
              </div>
            </div>
          </section>

          <section class="profile-side">
            <div class="info-card">
              <h3 class="card-title"><el-icon class="card-icon"><List /></el-icon> 出行偏好摘要</h3>
              <div class="info-list">
                <div class="info-row">
                  <span class="info-label">出行天数</span>
                  <span class="info-value">{{ selection?.days }} 天</span>
                </div>
                <div class="info-row">
                  <span class="info-label">预算范围</span>
                  <span class="info-value">{{ selection?.budget }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">同行人群</span>
                  <span class="info-value">{{ selection?.companion }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">体力偏好</span>
                  <span class="info-value">{{ selection?.physicalLevel }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">旅游节奏</span>
                  <span class="info-value">{{ selection?.pace }}</span>
                </div>
              </div>
            </div>

            <div class="style-card">
              <h3 class="card-title"><el-icon class="card-icon"><Promotion /></el-icon> 行程风格</h3>
              <div class="style-badge">{{ profile.routeStyle }}</div>
              <p class="style-desc">{{ profile.routeStyleDesc }}</p>
            </div>

            <div class="actions-card">
              <el-button
                type="primary"
                size="large"
                class="action-btn"
                @click="goRecommend"
              >
                查看个性化推荐路线
              </el-button>
              <el-button size="large" class="action-btn-secondary" @click="$router.push('/planner')">
                重新选择偏好
              </el-button>
            </div>
          </section>
        </div>
      </template>

      <div v-else ref="emptyRef" class="loading-card" style="opacity:0">
        <div class="loading-icon"><el-icon :size="48"><WarningFilled /></el-icon></div>
        <p>未检测到出行偏好数据</p>
        <el-button type="primary" size="large" @click="$router.push('/planner')">
          前往设置偏好
        </el-button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { MagicStick, Connection, List, Promotion, WarningFilled } from '@element-plus/icons-vue'
import gsap from 'gsap'
import { generateProfile, type GeneratedProfile } from '@shared/mock'
import { interestTags as allTags } from '@shared/mock/interests'
import type { VisitorSelection } from '@shared/types'

interface ProfileResult {
  profileName: string
  dominantInterests: { tagId: string; score: number; reason: string }[]
  secondaryInterests: { tagId: string; score: number; reason: string }[]
  matchSummary: string
  routeStyle: string
  routeStyleDesc: string
}

const router = useRouter()

const loading = ref(true)
const selection = ref<VisitorSelection | null>(null)
const profile = ref<ProfileResult | null>(null)

const headerRef = ref<HTMLElement | null>(null)
const loadingRef = ref<HTMLElement | null>(null)
const profileGridRef = ref<HTMLElement | null>(null)
const emptyRef = ref<HTMLElement | null>(null)

const progressColor = '#1f8f5f'

function getTagName(id: string): string {
  const tag = allTags.find((t) => t.id === id)
  return tag ? `${tag.icon} ${tag.name}` : id
}

function loadSelection(): VisitorSelection | null {
  try {
    const raw = localStorage.getItem('qianxing_visitor_selection')
    if (raw) return JSON.parse(raw) as VisitorSelection
  } catch {
    // ignore
  }
  return null
}

onMounted(async () => {
  gsap.from(headerRef.value, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' })

  const sel = loadSelection()
  if (!sel || sel.selectedTagIds.length < 2) {
    loading.value = false
    await nextTick()
    gsap.from(emptyRef.value, { y: 30, opacity: 0, scale: 0.95, duration: 0.6, ease: 'power3.out' })
    return
  }

  selection.value = sel
  const result = await generateProfile(sel)
  profile.value = result
  loading.value = false
  await nextTick()

  if (profileGridRef.value) {
    const cards = profileGridRef.value.querySelectorAll('.hero-card, .match-card, .info-card, .style-card, .actions-card')
    gsap.from(cards, { y: 36, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
  }
})

function goRecommend() {
  if (profile.value) {
    localStorage.setItem('qianxing_visitor_profile', JSON.stringify(profile.value))
  }
  router.push('/recommend')
}
</script>

<style scoped>
.profile-page {
  min-height: calc(100vh - 76px);
  background:
    radial-gradient(circle at 12% 20%, rgba(82, 183, 136, 0.18), transparent 28%),
    radial-gradient(circle at 82% 10%, rgba(45, 108, 223, 0.14), transparent 30%),
    linear-gradient(135deg, #f7fbf7 0%, #eef7f1 48%, #f8fbff 100%);
}

.profile-body {
  max-width: 1280px;
  margin: 0 auto;
  padding: 40px 48px 80px;
}

.page-header {
  margin-bottom: 36px;
}

.page-header h2 {
  margin: 0 0 10px;
  font-size: 36px;
  color: #10251d;
  letter-spacing: -0.03em;
}

.page-header p {
  margin: 0;
  font-size: 16px;
  color: #4d5f6f;
  line-height: 1.7;
}

.loading-card {
  max-width: 520px;
  margin: 60px auto;
  padding: 60px 40px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 0 30px 80px rgba(34, 73, 61, 0.14);
  backdrop-filter: blur(20px);
  text-align: center;
}

.loading-icon {
  margin-bottom: 16px; color: #1f8f5f;
}

.loading-card p {
  font-size: 16px;
  color: #5d6b7a;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 40px;
  align-items: start;
}

.profile-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero-card {
  padding: 36px;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 0 30px 80px rgba(34, 73, 61, 0.14);
  backdrop-filter: blur(20px);
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.hero-label {
  font-size: 14px;
  font-weight: 700;
  color: #2f6bff;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hero-name {
  font-size: 36px;
  font-weight: 800;
  color: #10251d;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.hero-summary {
  margin: 0 0 20px;
  font-size: 15px;
  color: #4d5f6f;
  line-height: 1.8;
}

.hero-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.match-card {
  padding: 28px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(31, 143, 95, 0.1);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 36px rgba(19, 61, 45, 0.05);
}

.card-title {
  margin: 0 0 20px;
  font-size: 18px;
  color: #10251d;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-icon {
  font-size: 22px; color: #1f8f5f;
}

.match-item {
  margin-bottom: 20px;
}

.match-item:last-child {
  margin-bottom: 0;
}

.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.match-name {
  font-size: 15px;
  font-weight: 600;
  color: #10251d;
}

.match-score {
  font-size: 18px;
  font-weight: 800;
  color: #1f8f5f;
}

.match-score.secondary {
  font-size: 15px;
  color: #909399;
}

.match-reason {
  margin: 8px 0 0;
  font-size: 13px;
  color: #5d6b7a;
  line-height: 1.6;
}

.secondary-list {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #eef2f5;
}

.sub-title {
  margin: 0 0 16px;
  font-size: 15px;
  color: #5d6b7a;
  font-weight: 600;
}

.profile-side {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 40px;
}

.info-card {
  padding: 24px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(31, 143, 95, 0.1);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 36px rgba(19, 61, 45, 0.05);
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #eef2f5;
}

.info-label {
  font-size: 14px;
  color: #5d6b7a;
}

.info-value {
  font-size: 14px;
  color: #10251d;
  font-weight: 600;
}

.style-card {
  padding: 24px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(47, 107, 255, 0.1);
  backdrop-filter: blur(14px);
  box-shadow: 0 12px 36px rgba(19, 61, 45, 0.05);
}

.style-badge {
  display: inline-block;
  padding: 10px 24px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(31, 143, 95, 0.12), rgba(47, 107, 255, 0.1));
  border: 1px solid rgba(31, 143, 95, 0.15);
  font-size: 20px;
  font-weight: 800;
  color: #123524;
  margin-bottom: 12px;
}

.style-desc {
  margin: 0;
  font-size: 14px;
  color: #5d6b7a;
  line-height: 1.7;
}

.actions-card {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.action-btn {
  width: 100%;
  height: 50px;
  font-size: 16px;
  font-weight: 700;
  border-radius: 16px;
  background: linear-gradient(135deg, #1f8f5f, #2f6bff);
  border: none;
}

.action-btn:hover {
  opacity: 0.92;
}

.action-btn-secondary {
  width: 100%;
  height: 46px;
  font-size: 15px;
  border-radius: 14px;
}

@media (max-width: 900px) {
  .profile-body {
    padding: 32px 22px 60px;
  }

  .profile-grid {
    grid-template-columns: 1fr;
  }

  .hero-name {
    font-size: 28px;
  }

  .profile-side {
    position: static;
  }
}
</style>
