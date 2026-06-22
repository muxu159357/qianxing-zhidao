<script setup lang="ts">
import { adminAuthState } from '@/stores/admin-auth'
</script>

<template>
  <div class="admin-dashboard">
    <h2 class="page-title">工作台</h2>
    <el-row :gutter="20">
      <el-col :span="8"><el-card shadow="never"><template #header>景区管理</template><el-statistic title="已有景区" value="9" suffix="个" /><el-button type="primary" style="margin-top:16px" @click="$router.push('/admin/scenic')">管理景点</el-button></el-card></el-col>
      <el-col :span="8"><el-card shadow="never"><template #header>路线管理</template><div style="color:#909399;padding:20px 0">功能建设中</div></el-card></el-col>
      <el-col :span="8"><el-card shadow="never"><template #header>欢迎</template><p>{{ adminAuthState.user?.displayName || '管理员' }}，欢迎使用黔行智导后台管理系统。</p></el-card></el-col>
    </el-row>
  </div>
</template>

<style scoped>
.page-title { font-size:22px; font-weight:700; color:#303133; margin-bottom:24px; }
</style>
