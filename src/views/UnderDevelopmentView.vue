<template>
  <div class="udev-page">
    <main class="udev-body">
      <div ref="cardRef" class="udev-card" style="opacity:0">
        <div class="udev-icon">{{ pageIcon }}</div>
        <h2>{{ pageTitle }}</h2>
        <p class="udev-subtitle">{{ pageSubtitle }}</p>
        <el-tag type="warning" size="large" effect="plain" round>
          此页面正在开发中，敬请期待
        </el-tag>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'

const route = useRoute()

const configs: Record<string, { icon: string; title: string; subtitle: string }> = {
  guide: {
    icon: '🤖',
    title: 'AI 智能导游',
    subtitle: '基于景点知识库与大语言模型的实时问答系统，为您提供行程咨询、景点讲解和个性化建议。',
  },
  knowledge: {
    icon: '📚',
    title: '景点知识库',
    subtitle: '覆盖贵州全省自然景观、民族文化和历史人文的全域智能知识库，支持搜索与智能匹配。',
  },
  admin: {
    icon: '📊',
    title: '后台管理 · 数据看板',
    subtitle: '景点信息管理、用户行为分析与平台运营数据可视化中心。',
  },
  'demo-flow': {
    icon: '🎬',
    title: 'Demo 演示流程',
    subtitle: '一键走完"兴趣选择 → 画像生成 → 路线推荐 → AI 导游问答"的完整体验流程。',
  },
}

const name = (route.name as string) || 'guide'
const cfg = configs[name] ?? configs.guide

const cardRef = ref<HTMLElement | null>(null)

const pageIcon = computed(() => cfg.icon)
const pageTitle = computed(() => cfg.title)
const pageSubtitle = computed(() => cfg.subtitle)

onMounted(() => {
  if (cardRef.value) {
    gsap.from(cardRef.value, {
      y: 40,
      opacity: 0,
      scale: 0.92,
      duration: 0.8,
      ease: 'power3.out',
    })
  }
})
</script>

<style scoped>
.udev-page {
  min-height: calc(100vh - 76px);
  background:
    radial-gradient(circle at 12% 20%, rgba(82, 183, 136, 0.18), transparent 28%),
    radial-gradient(circle at 82% 10%, rgba(45, 108, 223, 0.14), transparent 30%),
    linear-gradient(135deg, #f7fbf7 0%, #eef7f1 48%, #f8fbff 100%);
}

.udev-body {
  display: flex; justify-content: center; align-items: center;
  min-height: calc(100vh - 76px); padding: 40px 48px;
}

.udev-card {
  width: 100%; max-width: 480px; padding: 52px 44px; text-align: center;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.75);
  box-shadow: 0 30px 80px rgba(34, 73, 61, 0.14);
  backdrop-filter: blur(20px);
}

.udev-icon { font-size: 56px; margin-bottom: 12px; }
.udev-card h2 { margin: 0 0 14px; font-size: 26px; color: #10251d; }
.udev-subtitle { margin: 0 0 28px; font-size: 15px; color: #4d5f6f; line-height: 1.7; }

@media (max-width: 900px) {
  .udev-body { padding: 32px 22px; }
  .udev-card { padding: 40px 28px; }
}
</style>
