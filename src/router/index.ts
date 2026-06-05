import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/planner',
      name: 'planner',
      component: () => import('@/views/PlannerView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import('@/views/RouteRecommendView.vue'),
    },
    {
      path: '/guide',
      name: 'guide',
      component: () => import('@/views/AiGuideView.vue'),
    },
    {
      path: '/scenic/:id',
      name: 'scenic-detail',
      component: () => import('@/views/ScenicDetailView.vue'),
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: () => import('@/views/ScenicKnowledgeView.vue'),
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/AdminDashboardView.vue'),
    },
    {
      path: '/demo-flow',
      name: 'demo-flow',
      component: () => import('@/views/DemoFlowView.vue'),
    },
  ],
})

export default router