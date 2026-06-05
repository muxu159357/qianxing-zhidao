<template>
  <div class="home-page">
    <div class="hero-bg">
      <video class="hero-video" src="/huangguoshu.mp4" autoplay muted loop playsinline></video>
      <div class="hero-overlay"></div>
    </div>

    <main>
      <section class="hero-section">
        <div class="hero-content" ref="heroContent">
          <el-tag class="hero-tag" type="success" effect="dark" size="large">
            2026年贵州省人工智能创业大赛 · 行业应用赛道
          </el-tag>

          <h1 ref="heroTitle">
            基于游客兴趣画像的<br />
            贵州山地旅游 AI 智能导览平台
          </h1>

          <p class="hero-text" ref="heroText">
            面向贵州山地旅游、民族文化、避暑康养和乡村文旅场景，
            通过大语言模型、景点知识库、游客兴趣画像和个性化推荐算法，
            为游客生成更懂需求、更贴近贵州特色的智能旅游路线。
          </p>

          <div class="hero-buttons" ref="heroBtns">
            <el-button type="primary" size="large" class="btn-primary-lg" @click="goPlanner">
              开始智能规划
            </el-button>
            <el-button size="large" class="btn-outline-lg" @click="scrollToFeatures">
              平台能力介绍
            </el-button>
          </div>
        </div>
      </section>

      <section class="features-section" ref="featuresSection">
        <div class="section-header">
          <h2>核心能力</h2>
          <p>三大 AI 引擎驱动贵州山地旅游个性化体验</p>
        </div>

        <div class="feature-grid">
          <div class="feature-card" ref="featureCards">
            <div class="card-image card-image-profile">
              <div class="card-image-inner"><el-icon :size="44"><UserFilled /></el-icon></div>
            </div>
            <div class="card-body">
              <h3>游客兴趣画像</h3>
              <p>多维度采集游客偏好，基于兴趣标签、出行天数、预算及同行人群建立精准游客画像模型。</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="card-image card-image-route">
              <div class="card-image-inner"><el-icon :size="44"><MapLocation /></el-icon></div>
            </div>
            <div class="card-body">
              <h3>个性化路线推荐</h3>
              <p>智能匹配贵州全域景点标签，结合体力偏好与行程节奏，生成千人千面的定制化旅游路线。</p>
            </div>
          </div>

          <div class="feature-card">
            <div class="card-image card-image-guide">
              <div class="card-image-inner"><el-icon :size="44"><ChatDotRound /></el-icon></div>
            </div>
            <div class="card-body">
              <h3>AI 智能导游</h3>
              <p>基于贵州景点知识图谱，提供实时景点讲解、路线咨询及本地特色推荐等智能问答服务。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="demo-section" ref="demoSection">
        <div class="section-header">
          <h2>AI 推荐预览</h2>
          <p>基于真实贵州景点数据与规则推荐引擎，即时生成个性化路线方案</p>
        </div>

        <div class="demo-panel">
          <div class="panel-card">
            <div class="panel-header">
              <span>智能推荐引擎</span>
              <el-tag size="small" type="success" effect="dark">Demo</el-tag>
            </div>

            <div class="user-query">
              "我想去贵州玩几天，喜欢自然风光和民族文化，有什么推荐？"
            </div>

            <div v-if="demoRoute" class="ai-result">
              <h3>{{ demoRoute.name }}</h3>

              <div
                v-for="plan in demoRoute.dailyPlan"
                :key="plan.day"
                class="route-day"
              >
                <strong>Day {{ plan.day }} {{ plan.title }}</strong>
                <p>{{ plan.description }}</p>
              </div>
            </div>

            <div v-else class="ai-result">
              <p class="loading-hint">AI 正在加载推荐路线…</p>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <p>2026 贵州省人工智能创业大赛 · Maxwell 团队</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { UserFilled, MapLocation, ChatDotRound } from '@element-plus/icons-vue'
import { getRoutes } from '@shared/mock'
import type { TourRoute } from '@shared/types'
import gsap from 'gsap'

const router = useRouter()

const heroContent = ref<HTMLElement | null>(null)
const heroTitle = ref<HTMLElement | null>(null)
const heroText = ref<HTMLElement | null>(null)
const heroBtns = ref<HTMLElement | null>(null)

const goPlanner = () => {
  router.push('/planner')
}

const scrollToFeatures = () => {
  const el = document.querySelector('.features-section')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const demoRoute = ref<TourRoute | null>(null)

onMounted(async () => {
  const allRoutes = await getRoutes()
  demoRoute.value = allRoutes[0] ?? null

  await nextTick()
  gsap.from(heroTitle.value, { y: 60, opacity: 0, duration: 1, ease: 'power3.out' })
  gsap.from(heroText.value, { y: 40, opacity: 0, duration: 0.9, delay: 0.3, ease: 'power3.out' })
  gsap.from(heroBtns.value, { y: 30, opacity: 0, duration: 0.8, delay: 0.6, ease: 'power3.out' })
})
</script>

<style scoped>
/* === 背景层 === */
.hero-bg {
  position: fixed; top: 0; left: 0; width: 100%; height: 100vh; z-index: 0;
  background-color: #1a3c2a;
  overflow: hidden;
}
.hero-video {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  object-fit: cover; pointer-events: none;
}
.hero-overlay {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%;
  background:
    radial-gradient(circle at 20% 30%, rgba(31, 143, 95, 0.2), transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(47, 107, 255, 0.15), transparent 50%);
}

.home-page { position: relative; z-index: 1; }

/* === 导航栏（已由全局 AppNavbar 提供）=== */

/* === Hero === */
.hero-section {
  min-height: 100vh; display: flex; align-items: center;
  padding: 100px 48px 80px;
}

.hero-content { max-width: 720px; }

.hero-tag {
  font-size: 14px; padding: 10px 20px; border-radius: 999px;
  margin-bottom: 28px; display: inline-block;
}

.hero-content h1 {
  margin: 0 0 24px; font-size: clamp(40px, 5.5vw, 68px);
  line-height: 1.14; letter-spacing: -0.03em; color: #fff;
}

.hero-text {
  max-width: 600px; margin: 0 0 40px;
  font-size: 18px; line-height: 1.9; color: rgba(255,255,255,0.82);
}

.hero-buttons { display: flex; gap: 16px; }

.btn-primary-lg {
  height: 54px; padding: 0 36px; font-size: 17px; font-weight: 700;
  border-radius: 16px; border: none;
  background: linear-gradient(135deg, #1f8f5f, #2f6bff);
  box-shadow: 0 8px 32px rgba(31, 143, 95, 0.4);
}
.btn-primary-lg:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(31, 143, 95, 0.5); }

.btn-outline-lg {
  height: 54px; padding: 0 36px; font-size: 17px; font-weight: 600;
  border-radius: 16px; border: 2px solid rgba(255,255,255,0.5);
  color: #fff; background: rgba(255,255,255,0.08);
}
.btn-outline-lg:hover { background: rgba(255,255,255,0.15); border-color: #fff; }

/* === 能力区 === */
.features-section {
  padding: 100px 48px 80px;
  background: linear-gradient(180deg, #f4f8f5 0%, #eef7f1 50%, #f8fbff 100%);
}

.section-header { text-align: center; margin-bottom: 56px; }
.section-header h2 { margin: 0 0 12px; font-size: 36px; color: #10251d; letter-spacing: -0.02em; }
.section-header p { margin: 0; font-size: 17px; color: #5d6b7a; }

.feature-grid {
  max-width: 1080px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px;
}

.feature-card {
  border-radius: 24px; overflow: hidden;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(31, 143, 95, 0.08);
  box-shadow: 0 16px 48px rgba(19, 61, 45, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}
.feature-card:hover { transform: translateY(-6px); box-shadow: 0 24px 64px rgba(19, 61, 45, 0.12); }

.card-image {
  height: 160px; display: flex; align-items: center; justify-content: center;
}
.card-image-inner { color: #1f8f5f; }
.card-image-profile { background: linear-gradient(135deg, rgba(31, 143, 95, 0.12), rgba(47, 107, 255, 0.08)); }
.card-image-route { background: linear-gradient(135deg, rgba(47, 107, 255, 0.1), rgba(31, 143, 95, 0.1)); }
.card-image-guide { background: linear-gradient(135deg, rgba(230, 126, 34, 0.12), rgba(31, 143, 95, 0.08)); }

.card-body { padding: 24px 28px 28px; }
.card-body h3 { margin: 0 0 10px; font-size: 19px; color: #10251d; }
.card-body p { margin: 0; font-size: 14px; color: #5d6b7a; line-height: 1.75; }

/* === AI推荐区 === */
.demo-section {
  padding: 80px 48px 100px;
  background: linear-gradient(180deg, #f8fbff 0%, #f4f8f5 100%);
}

.demo-panel {
  max-width: 640px; margin: 0 auto;
}

.panel-card {
  padding: 36px; border-radius: 28px;
  background: rgba(255, 255, 255, 0.82); border: 1px solid rgba(255,255,255,0.75);
  box-shadow: 0 30px 80px rgba(34, 73, 61, 0.14); backdrop-filter: blur(20px);
}

.panel-header {
  display: flex; justify-content: space-between; align-items: center;
  color: #10251d; font-weight: 700; font-size: 17px; margin-bottom: 20px;
}

.user-query {
  padding: 18px 22px; border-radius: 18px;
  background: #f0f7f4; color: #274438; line-height: 1.7; font-style: italic;
  border: 1px solid rgba(31, 143, 95, 0.12);
}

.ai-result { margin-top: 20px; }
.ai-result h3 {
  margin: 0 0 18px; color: #123524; font-size: 19px;
}

.route-day {
  padding: 16px 0; border-top: 1px solid #eef2f5;
}
.route-day:first-of-type { border-top: none; }
.route-day strong { color: #1f5f45; font-size: 15px; }
.route-day p { margin: 6px 0 0; color: #5d6b7a; line-height: 1.6; font-size: 14px; }

.loading-hint { color: #909399; text-align: center; padding: 20px 0; }

/* === Footer === */
.site-footer {
  text-align: center; padding: 40px; color: #909399; font-size: 13px;
  background: #f4f8f5; border-top: 1px solid rgba(31, 143, 95, 0.06);
}

/* === 响应式 === */
@media (max-width: 900px) {
  .nav-bar { padding: 0 24px; }
  .nav-actions { display: none; }
  .hero-section { padding: 120px 24px 60px; }
  .hero-content h1 { font-size: 32px; }
  .hero-text { font-size: 15px; }
  .hero-buttons { flex-direction: column; }
  .features-section { padding: 60px 24px; }
  .feature-grid { grid-template-columns: 1fr; }
  .demo-section { padding: 60px 24px; }
  .card-image { height: 120px; }
}
</style>
