<template><div class="app-container"><router-view v-if="!isLoggedIn"></router-view><el-container v-else class="main-container"><el-aside :width="isCollapsed ? '80px' : '240px'" :class="['sidebar', { 'mobile-open': showMobileMenu && isMobile }]"><div class="sidebar-header"><div class="logo-container"><div class="logo-icon">🍽️</div><div class="logo-text" v-show="!isCollapsed"><h1 class="logo-title">西餐边角料</h1><p class="logo-subtitle">创意系统</p></div></div><el-button 
            type="text" 
            class="collapse-button" 
            @click="toggleCollapse"
            :icon="isCollapsed ? 'ArrowRight' : 'ArrowLeft'"
          ></el-button></div><el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          @select="handleMenuSelect"
          background-color="transparent"
          text-color="#e2e8f0"
          active-text-color="#667eea"
        ><el-menu-item index="/scraps"><el-icon class="menu-icon"><Document /></el-icon><span class="menu-text" v-show="!isCollapsed">边角料管理</span></el-menu-item><el-menu-item index="/ideas"><el-icon class="menu-icon"><Timer /></el-icon><span class="menu-text" v-show="!isCollapsed">创意管理</span></el-menu-item></el-menu><div class="sidebar-footer"><div class="user-profile" v-show="!isCollapsed"><div class="user-avatar">{{ currentUser?.name?.charAt(0) }}</div><div class="user-details"><div class="user-name">{{ currentUser?.name }}</div><div class="user-role">{{ currentUser?.role }}</div></div></div><div class="user-avatar-small" v-show="isCollapsed">{{ currentUser?.name?.charAt(0) }}</div><el-button 
            type="text" 
            class="logout-button" 
            @click="handleLogout"
            :icon="isCollapsed ? 'SwitchButton' : ''"
          ><span v-show="!isCollapsed">退出登录</span></el-button></div></el-aside><el-main class="main-content"><div class="mobile-menu-button" @click="toggleMobileMenu"><el-icon><Menu /></el-icon></div><div class="page-container"><router-view></router-view></div></el-main></el-container></div></template><script setup>import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Document, Timer, SwitchButton, Menu, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import { useAuthStore } from './stores/authStore'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const activeMenu = computed(() => route.path)
const isLoggedIn = computed(() => authStore.loggedIn)
const currentUser = computed(() => authStore.currentUser)
const isCollapsed = ref(false)
const isMobile = ref(false)
const showMobileMenu = ref(false)

const handleMenuSelect = (index) => {
  router.push(index)
}

const handleLogout = () => {
  authStore.logout()
  ElMessage.success('退出成功')
  router.push('/login')
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const checkMobile = () => {
  const wasMobile = isMobile.value
  isMobile.value = window.innerWidth <= 768
  
  if (isMobile.value) {
    isCollapsed.value = true
    showMobileMenu.value = false
  } else if (wasMobile && !isMobile.value) {
    // 从移动端切换到PC端时重置折叠状态
    isCollapsed.value = false
    showMobileMenu.value = false
  }
}

onMounted(() => {
  authStore.checkAuth()
  checkMobile()
  window.addEventListener('resize', checkMobile)
})</script><style>* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #f8fafc;
}

.app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-container {
  height: 100vh;
  background: #f8fafc;
}

.sidebar {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  display: flex;
  flex-direction: column;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  font-size: 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 8px;
  border-radius: 12px;
}

.logo-text {
  flex: 1;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.logo-subtitle {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
}

.collapse-button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  color: #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.collapse-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #667eea;
}

.sidebar-menu {
  flex: 1;
  border-right: none;
  padding: 20px 0;
}

:deep(.sidebar-menu .el-menu-item) {
  margin: 6px 12px;
  border-radius: 12px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid transparent;
}

:deep(.sidebar-menu .el-menu-item:hover) {
  background: rgba(102, 126, 234, 0.1) !important;
  border-color: rgba(102, 126, 234, 0.3);
}

:deep(.sidebar-menu .el-menu-item.is-active) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2)) !important;
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.menu-icon {
  font-size: 20px;
  margin-right: 12px;
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.user-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 2px;
}

.user-role {
  font-size: 12px;
  color: #94a3b8;
}

.logout-button {
  width: 100%;
  height: 44px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
  background: rgba(239, 68, 68, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.logout-button:hover {
  background: rgba(239, 68, 68, 0.1) !important;
  border-color: rgba(239, 68, 68, 0.5);
  transform: translateY(-1px);
}

.main-content {
  padding: 0;
  background: #f8fafc;
  overflow-y: auto;
  position: relative;
}

.mobile-menu-button {
  display: none;
  position: fixed;
  top: 20px;
  right: 20px;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.page-container {
  min-height: 100%;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

/* 滚动条样式 */
.main-content::-webkit-scrollbar {
  width: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.main-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -240px;
    top: 0;
    bottom: 0;
    z-index: 999;
    width: 240px !important;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .sidebar.mobile-open {
    left: 0;
  }
  
  .mobile-menu-button {
    display: flex;
  }
  
  .logo-title {
    font-size: 16px;
  }
  
  .logo-subtitle {
    font-size: 11px;
  }
  
  .main-content {
    padding: 20px;
  }
  
  .page-container {
    padding-top: 70px;
  }
}

@media (max-width: 480px) {
  .sidebar {
    width: 200px !important;
    left: -200px;
  }
  
  .mobile-menu-button {
    width: 44px;
    height: 44px;
    top: 16px;
    right: 16px;
  }
}</style>