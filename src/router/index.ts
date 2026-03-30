import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const routes = [
  {
    path: '/',
    redirect: '/scraps'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/scraps',
    name: 'ScrapManagement',
    component: () => import('../views/ScrapManagement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/ideas',
    name: 'IdeaManagement',
    component: () => import('../views/IdeaManagement.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth !== false) {
    if (!authStore.loggedIn) {
      next('/login')
    } else {
      next()
    }
  } else {
    if (authStore.loggedIn && to.path === '/login') {
      next('/scraps')
    } else {
      next()
    }
  }
})

export default router