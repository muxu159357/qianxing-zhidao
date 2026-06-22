import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { adminAuthState } from '@/stores/admin-auth'

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
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/views/admin/AdminLoginPage.vue'),
      meta: { noAuth: true },
    },
    {
      path: '/admin',
      component: () => import('@/views/admin/AdminLayout.vue'),
      meta: { requiresAdmin: true },
      children: [
        { path: '', redirect: '/admin/dashboard' },
        { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboardPage.vue') },
        { path: 'scenic', name: 'admin-scenic', component: () => import('@/views/admin/AdminScenicListPage.vue') },
        { path: 'routes', name: 'admin-routes', component: () => import('@/views/admin/AdminRouteListPage.vue') },
        { path: 'routes/:id/schedule', name: 'admin-route-schedule', component: () => import('@/views/admin/AdminRouteSchedulePage.vue') },
        { path: 'knowledge', name: 'admin-knowledge', component: () => import('@/views/admin/AdminKnowledgeListPage.vue') },
        { path: 'trips', name: 'admin-trips', component: () => import('@/views/admin/AdminTripListPage.vue') },
        { path: 'media', name: 'admin-media', component: () => import('@/views/admin/AdminMediaListPage.vue') },
        { path: 'weather', name: 'admin-weather', component: () => import('@/views/admin/AdminWeatherPage.vue') },
      ],
    },
    {
      path: '/quick-tour',
      name: 'quick-tour',
      component: () => import('@/views/DemoFlowView.vue'),
    },
  ],
})

router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAdmin) {
    if (!adminAuthState.token) { next('/admin/login'); return }
  }
  if (to.path === '/admin/login' && adminAuthState.token) {
    next('/admin/dashboard'); return
  }
  next()
})

export default router