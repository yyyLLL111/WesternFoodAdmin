<template><div class="login-container"><div class="login-background"></div><div class="login-content"><div class="login-card"><div class="login-header"><h1 class="login-title">西餐边角料创意系统</h1><p class="login-subtitle">Admin Panel</p></div><el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="0"
          class="login-form"
        ><div class="form-group"><el-input
              v-model="form.username"
              placeholder="用户名"
              prefix-icon="User"
              size="large"
              class="form-input"
            ></el-input></div><div class="form-group"><el-input
              v-model="form.password"
              type="password"
              placeholder="密码"
              prefix-icon="Lock"
              show-password
              size="large"
              class="form-input"
            ></el-input></div><el-button
            type="primary"
            class="login-button"
            @click="handleLogin"
            :loading="loading"
            size="large"
          >登录</el-button><div class="login-tips"><p>👋 测试账号：<strong>admin</strong> / <strong>123456</strong></p><p>✨ 或使用任意用户名密码登录</p></div></el-form></div><div class="login-decoration"><div class="floating-shape shape-1"></div><div class="floating-shape shape-2"></div><div class="floating-shape shape-3"></div></div></div></div></template><script setup>import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { ElMessage } from 'element-plus'

const router = useRouter()
const authStore = useAuthStore()

const formRef = ref(null)
const loading = ref(false)

const form = ref({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const result = await authStore.login(form.value.username, form.value.password)
        if (result.success) {
          ElMessage.success('登录成功')
          router.push('/scraps')
        } else {
          ElMessage.error(result.message || '登录失败')
        }
      } catch (error) {
        ElMessage.error('登录失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}</script><style scoped>.login-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  overflow: hidden;
  background: #f8fafc;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  opacity: 0.9;
}

.login-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 80px;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 48px 40px;
  width: 420px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: slideInUp 0.6s ease-out;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-title {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.5px;
  margin-bottom: 8px;
}

.login-subtitle {
  margin: 0;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  position: relative;
}

.form-input {
  border-radius: 12px;
  height: 52px;
  font-size: 16px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-button {
  height: 52px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.login-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
}

.login-button:active:not(:disabled) {
  transform: translateY(0);
}

.login-tips {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.login-tips p {
  margin: 8px 0;
  color: #64748b;
  font-size: 13px;
  text-align: center;
  line-height: 1.5;
}

.login-tips strong {
  color: #667eea;
  font-weight: 600;
}

.login-decoration {
  position: relative;
  width: 300px;
  height: 400px;
}

.floating-shape {
  position: absolute;
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.3), rgba(102, 126, 234, 0.3));
  top: 60%;
  right: 10%;
  animation-delay: -2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, rgba(118, 75, 162, 0.3), rgba(240, 147, 251, 0.3));
  bottom: 20%;
  left: 30%;
  animation-delay: -4s;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@media (max-width: 768px) {
  .login-content {
    flex-direction: column;
    gap: 40px;
  }
  
  .login-card {
    width: 90%;
    max-width: 400px;
    padding: 32px 24px;
  }
  
  .login-decoration {
    display: none;
  }
  
  .login-title {
    font-size: 24px;
  }
}</style>