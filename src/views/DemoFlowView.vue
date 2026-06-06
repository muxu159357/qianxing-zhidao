<template>
  <div class="demo-page">
    <main class="demo-body">
      <section ref="headerRef" class="page-header" style="opacity:0">
        <h2>智能伴游体验</h2>
        <p>从兴趣选择到路线推荐，带你快速体验黔行智导的 AI 山地伴游服务。</p>
      </section>

      <div class="flow-list" ref="flowRef">
        <div v-for="(step, idx) in steps" :key="step.route"
          class="flow-card" :class="{ current: currentStep === idx, done: currentStep > idx }"
          @click="goStep(step.route)">
          <div class="step-indicator">
            <span v-if="currentStep > idx" class="step-check"><el-icon><Check /></el-icon></span>
            <span v-else class="step-num">{{ idx + 1 }}</span>
          </div>
          <div class="step-content">
            <h3>{{ step.title }}</h3>
            <p>{{ step.desc }}</p>
          </div>
          <div class="step-action">
            <span v-if="currentStep > idx" class="done-tag">已完成</span>
            <span v-else-if="currentStep === idx" class="current-tag">当前步骤</span>
            <span v-else class="pending-tag">待进行</span>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <div class="progress-bar" ref="progressRef" style="opacity:0">
        <div class="progress-info">
          <span>体验进度</span>
          <span>{{ Math.round((currentStep / steps.length) * 100) }}%</span>
        </div>
        <el-progress :percentage="Math.round((currentStep / steps.length) * 100)" :stroke-width="10" color="#1f8f5f" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Check } from '@element-plus/icons-vue'
import gsap from 'gsap'

const router = useRouter()
const headerRef = ref<HTMLElement | null>(null)
const flowRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

const steps = [
  { route: '/planner', title: '选择兴趣', desc: '选择你的旅行兴趣、出行天数、预算范围、同行人群和体力偏好。' },
  { route: '/profile', title: '生成画像', desc: 'AI 基于你的偏好自动生成专属游客画像与兴趣匹配分析。' },
  { route: '/recommend', title: '查看路线', desc: 'AI 智能匹配贵州精品旅游路线，按匹配度排序并展示每日行程。' },
  { route: '/guide', title: 'AI 山地伴游', desc: '基于贵州全域知识库，AI 伴游实时解答旅行问题并提供安全提醒。' },
]

const currentStep = ref(0)

onMounted(() => {
  if (localStorage.getItem('qianxing_selected_route')) currentStep.value = 3
  else if (localStorage.getItem('qianxing_visitor_profile')) currentStep.value = 2
  else if (localStorage.getItem('qianxing_visitor_selection')) currentStep.value = 1

  const tl = gsap.timeline()
  tl.from(headerRef.value, { y: 24, opacity: 0, duration: 0.5, ease: 'power3.out' })
  if (flowRef.value) {
    const cards = flowRef.value.querySelectorAll('.flow-card')
    tl.from(cards, { x: -30, opacity: 0, duration: 0.5, stagger: 0.12, ease: 'power3.out' }, '-=0.2')
  }
  tl.from(progressRef.value, { y: 20, opacity: 0, duration: 0.4, ease: 'power3.out' }, '-=0.2')
})

function goStep(route: string) { router.push(route) }
</script>

<style scoped>
.demo-page {
  min-height: calc(100vh - 76px);
  background: radial-gradient(circle at 12% 20%, rgba(82,183,136,0.18), transparent 28%),
    radial-gradient(circle at 82% 10%, rgba(45,108,223,0.14), transparent 30%),
    linear-gradient(135deg, #f7fbf7 0%, #eef7f1 48%, #f8fbff 100%);
}
.demo-body { max-width: 720px; margin: 0 auto; padding: 32px 24px 60px; }
.page-header { margin-bottom: 36px; }
.page-header h2 { margin: 0 0 8px; font-size: 32px; color: #10251d; letter-spacing: -0.03em; }
.page-header p { margin: 0; font-size: 15px; color: #4d5f6f; }

.flow-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px; }
.flow-card {
  display: flex; align-items: center; gap: 20px; padding: 28px 32px;
  border-radius: 22px; cursor: pointer; background: rgba(255,255,255,0.72);
  border: 1px solid rgba(31,143,95,0.08);
  box-shadow: 0 12px 36px rgba(19,61,45,0.04); backdrop-filter: blur(14px);
  transition: all 0.25s;
}
.flow-card:hover { border-color: rgba(31,143,95,0.22); box-shadow: 0 18px 48px rgba(34,73,61,0.09); transform: translateX(4px); }
.flow-card.current { border-color: rgba(31,143,95,0.3); background: rgba(31,143,95,0.04); box-shadow: 0 18px 48px rgba(31,143,95,0.12); }
.flow-card.done { opacity: 0.7; }

.step-indicator {
  width: 48px; height: 48px; border-radius: 50%; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid rgba(31,143,95,0.2); font-weight: 800; font-size: 18px; color: #5d6b7a;
}
.flow-card.current .step-indicator { background: linear-gradient(135deg, #1f8f5f, #2f6bff); border-color: transparent; color: #fff; }
.flow-card.done .step-indicator { background: #1f8f5f; border-color: #1f8f5f; color: #fff; }
.step-check { font-size: 20px; }

.step-content { flex: 1; }
.step-content h3 { margin: 0 0 4px; font-size: 18px; color: #10251d; }
.step-content p { margin: 0; font-size: 14px; color: #5d6b7a; line-height: 1.6; }

.step-action { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.done-tag { font-size: 12px; color: #1f8f5f; font-weight: 600; }
.current-tag { font-size: 12px; color: #2f6bff; font-weight: 600; }
.pending-tag { font-size: 12px; color: #c0c4cc; }
.arrow-icon { color: #909399; font-size: 16px; }

.progress-bar { padding: 24px; border-radius: 18px; background: rgba(255,255,255,0.72); border: 1px solid rgba(31,143,95,0.08); box-shadow: 0 12px 36px rgba(19,61,45,0.04); backdrop-filter: blur(14px); }
.progress-info { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 14px; color: #5d6b7a; }
.progress-info span:last-child { font-weight: 700; color: #1f8f5f; }

@media (max-width: 900px) {
  .demo-body { padding: 24px 16px 40px; }
  .page-header h2 { font-size: 26px; }
  .flow-card { padding: 22px 20px; gap: 14px; }
  .step-content h3 { font-size: 16px; }
}
</style>
