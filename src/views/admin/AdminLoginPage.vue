<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { doAdminLogin, adminAuthState } from '@/stores/admin-auth'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMsg = ref('')

async function onSubmit() {
  errorMsg.value = ''
  if (!username.value.trim() || !password.value) {
    errorMsg.value = '请输入用户名和密码'
    return
  }
  try {
    await doAdminLogin(username.value.trim(), password.value)
    router.replace('/admin/dashboard')
  } catch (e: any) {
    errorMsg.value = e.message || '登录失败'
  }
}
</script>

<template>
  <div class="admin-login-page">
    <div class="login-card">
      <h1 class="login-title">黔行智导后台管理</h1>
      <p class="login-subtitle">景区路线运营管理平台</p>
      <el-form @submit.prevent="onSubmit" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="username" placeholder="请输入管理员用户名" size="large" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" placeholder="请输入密码" size="large" show-password />
        </el-form-item>
        <el-alert v-if="errorMsg" :title="errorMsg" type="error" show-icon :closable="false" style="margin-bottom:16px" />
        <el-button type="primary" native-type="submit" size="large" :loading="adminAuthState.loading" style="width:100%">
          {{ adminAuthState.loading ? '登录中...' : '登 录' }}
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a7a52 0%, #1f8f5f 40%, #2f6bff 100%);
}
.login-card {
  width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 48px 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}
.login-title {
  font-size: 28px;
  font-weight: 700;
  color: #10251d;
  text-align: center;
  margin-bottom: 8px;
}
.login-subtitle {
  font-size: 14px;
  color: #909399;
  text-align: center;
  margin-bottom: 32px;
}
</style>
