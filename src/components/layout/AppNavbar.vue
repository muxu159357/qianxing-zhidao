<template>
  <header class="top-bar" :class="{ 'top-bar--home': isHome }">
    <div class="brand" @click="$router.push('/')">
      <div class="logo">黔</div>
      <div>
        <div class="brand-name">黔行智导</div>
        <div class="brand-desc">贵州山地旅游 AI 个性化导览平台</div>
      </div>
    </div>
    <div class="top-actions">
      <el-button text class="nav-link" :class="{ 'nav-link--home': isHome }" @click="$router.push('/knowledge')">
        <el-icon><Collection /></el-icon> 景点知识库
      </el-button>
      <el-button text class="nav-link" :class="{ 'nav-link--home': isHome }" @click="$router.push('/guide')">
        <el-icon><ChatDotRound /></el-icon> AI 导游
      </el-button>
      <el-button text class="nav-link" :class="{ 'nav-link--home': isHome }" @click="$router.push('/admin')">
        <el-icon><Monitor /></el-icon> 后台管理
      </el-button>
      <slot name="actions" />
      <el-button v-if="!isHome" text @click="$router.push('/')">返回首页</el-button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Collection, ChatDotRound, Monitor } from '@element-plus/icons-vue'
import gsap from 'gsap'

const route = useRoute()
const isHome = computed(() => route.path === '/')

onMounted(() => {
  gsap.from('.top-bar', { y: -20, opacity: 0, duration: 0.5, ease: 'power3.out' })
})
</script>

<style scoped>
.top-bar {
  height: 76px;
  padding: 0 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(31, 143, 95, 0.08);
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(12px);
  position: sticky; top: 0; z-index: 100;
}

/* 首页透明导航 */
.top-bar--home {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  background: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  cursor: pointer;
}

.logo {
  width: 46px;
  height: 46px;
  border-radius: 14px;
  background: linear-gradient(135deg, #1f8f5f, #2f6bff);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  box-shadow: 0 12px 30px rgba(31, 143, 95, 0.25);
}

.brand-name {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.04em;
  color: #10251d;
}

.top-bar--home .brand-name { color: #fff; }

.brand-desc {
  margin-top: 3px;
  font-size: 12px;
  color: #5d6b7a;
}

.top-bar--home .brand-desc { color: rgba(255,255,255,0.7); }

.top-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.nav-link {
  color: #5d6b7a !important; font-size: 14px;
}
.nav-link:hover { color: #1f8f5f !important; }

.nav-link--home {
  color: rgba(255,255,255,0.85) !important;
}
.nav-link--home:hover { color: #fff !important; background: rgba(255,255,255,0.1) !important; }

@media (max-width: 900px) {
  .top-bar {
    padding: 0 24px;
  }
}
</style>
