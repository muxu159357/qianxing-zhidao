<template>
  <div class="detail-page">
    <main class="detail-body">
      <div v-if="!attraction" ref="notFoundRef" class="not-found" style="opacity:0">
        <p>未找到该景点信息</p>
        <el-button type="primary" @click="$router.push('/knowledge')">返回知识库</el-button>
      </div>

      <template v-else>
        <div class="hero-section" ref="heroRef" :style="{ background: attraction.imageGradient }" style="opacity:0">
          <div class="hero-content">
            <el-tag size="small" type="success" effect="dark" round>{{ attraction.category }}</el-tag>
            <h1>{{ attraction.name }}</h1>
            <p class="hero-city">{{ attraction.city }}</p>
          </div>
        </div>

        <div class="detail-grid" ref="gridRef">
          <section class="detail-main">
            <div class="info-card">
              <h3>景点简介</h3>
              <p class="desc-text">{{ attraction.description }}</p>
            </div>

            <div class="info-card">
              <h3>核心亮点</h3>
              <ul class="highlight-list">
                <li v-for="h in attraction.highlights" :key="h">
                  <span class="hl-marker"></span>
                  {{ h }}
                </li>
              </ul>
            </div>

            <div class="info-card">
              <h3>游玩贴士</h3>
              <p class="tips-text">{{ attraction.tips }}</p>
            </div>
          </section>

          <section class="detail-side">
            <div class="stat-card">
              <div class="stat-row">
                <span class="stat-label">评分</span>
                <span class="stat-value star">{{ attraction.rating }} 分</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">门票</span>
                <span class="stat-value">{{ attraction.price > 0 ? '¥' + attraction.price : '免费' }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">建议时长</span>
                <span class="stat-value">{{ attraction.duration }}</span>
              </div>
              <div class="stat-row">
                <span class="stat-label">所在城市</span>
                <span class="stat-value">{{ attraction.city }}</span>
              </div>
            </div>

            <div class="tags-card">
              <h4>特色标签</h4>
              <div class="tag-list">
                <el-tag v-for="t in attraction.tags" :key="t" size="default" type="success" effect="plain" round>{{ t }}</el-tag>
              </div>
            </div>

            <div class="actions-card">
              <el-button type="primary" size="large" class="action-btn" @click="goGuide">
                向AI导游咨询此景点
              </el-button>
              <el-button size="large" class="action-btn-secondary" @click="$router.push('/knowledge')">
                返回知识库
              </el-button>
            </div>
          </section>
        </div>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'
import { attractions } from '@shared/mock/attractions'
import type { Attraction } from '@shared/types'

const route = useRoute()
const router = useRouter()

const attraction = ref<Attraction | null>(null)
const heroRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)
const notFoundRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const id = route.params.id as string
  const found = attractions.find((a) => a.id === id)
  attraction.value = found ?? null

  if (!found) {
    gsap.from(notFoundRef.value, { y: 30, opacity: 0, duration: 0.5, ease: 'power3.out' })
    return
  }

  const tl = gsap.timeline()
  tl.from(heroRef.value, { y: -30, opacity: 0, duration: 0.6, ease: 'power3.out' })
  if (gridRef.value) {
    const cards = gridRef.value.querySelectorAll('.info-card, .stat-card, .tags-card, .actions-card')
    tl.from(cards, { y: 32, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'power3.out' }, '-=0.3')
  }
})

function goGuide() {
  router.push('/guide')
}
</script>

<style scoped>
.detail-page {
  min-height: calc(100vh - 76px);
  background: linear-gradient(180deg, #f4f8f5 0%, #eef7f1 48%, #f8fbff 100%);
}

.detail-body { max-width: 960px; margin: 0 auto; padding: 0 24px 60px; }

.not-found { text-align: center; padding: 100px 0; font-size: 16px; color: #909399; }

.hero-section {
  border-radius: 0 0 32px 32px; padding: 64px 48px 48px;
  margin: 0 -24px; color: #fff;
}
.hero-content { max-width: 960px; margin: 0 auto; }
.hero-content h1 { margin: 12px 0 8px; font-size: 40px; font-weight: 800; letter-spacing: -0.03em; }
.hero-city { margin: 0; font-size: 16px; opacity: 0.85; }

.detail-grid {
  display: grid; grid-template-columns: 1.2fr 0.8fr;
  gap: 28px; margin-top: -16px; position: relative; z-index: 1;
}

.detail-main { display: flex; flex-direction: column; gap: 20px; margin-top: 24px; }

.info-card {
  padding: 28px; border-radius: 20px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(31, 143, 95, 0.08);
  box-shadow: 0 12px 36px rgba(19, 61, 45, 0.04);
  backdrop-filter: blur(14px);
}
.info-card h3 { margin: 0 0 14px; font-size: 18px; color: #10251d; }

.desc-text { margin: 0; font-size: 15px; color: #4d5f6f; line-height: 1.8; }

.highlight-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px; }
.highlight-list li { display: flex; align-items: center; gap: 10px; font-size: 15px; color: #4d5f6f; }
.hl-marker {
  width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #1f8f5f, #2f6bff);
}

.tips-text { margin: 0; font-size: 15px; color: #5d6b7a; line-height: 1.8; }

.detail-side {
  display: flex; flex-direction: column; gap: 20px;
  position: sticky; top: 24px; margin-top: 24px;
}

.stat-card {
  padding: 24px; border-radius: 20px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(31, 143, 95, 0.08);
  box-shadow: 0 12px 36px rgba(19, 61, 45, 0.04);
  backdrop-filter: blur(14px);
}
.stat-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 0; border-bottom: 1px solid #eef2f5;
}
.stat-row:last-child { border-bottom: none; }
.stat-label { font-size: 14px; color: #5d6b7a; }
.stat-value { font-size: 15px; font-weight: 700; color: #10251d; }
.stat-value.star { color: #e67e22; }

.tags-card {
  padding: 20px 24px; border-radius: 20px;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(47, 107, 255, 0.08);
  box-shadow: 0 12px 36px rgba(19, 61, 45, 0.04);
  backdrop-filter: blur(14px);
}
.tags-card h4 { margin: 0 0 12px; font-size: 15px; color: #10251d; }
.tag-list { display: flex; flex-wrap: wrap; gap: 8px; }

.actions-card { display: flex; flex-direction: column; gap: 12px; }
.action-btn {
  width: 100%; height: 48px; font-size: 16px; font-weight: 700; border-radius: 16px;
  background: linear-gradient(135deg, #1f8f5f, #2f6bff); border: none;
}
.action-btn-secondary { width: 100%; height: 44px; font-size: 15px; border-radius: 14px; }

@media (max-width: 900px) {
  .detail-body { padding: 0 16px 40px; }
  .hero-section { padding: 40px 24px 36px; margin: 0 -16px; border-radius: 0 0 24px 24px; }
  .hero-content h1 { font-size: 30px; }
  .detail-grid { grid-template-columns: 1fr; }
  .detail-side { position: static; }
}
</style>
