import { defineStore } from 'pinia'

export interface User {
  id: string
  username: string
  name: string
  role: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    token: localStorage.getItem('token') || '',
    isLoggedIn: false
  }),

  getters: {
    currentUser: (state) => state.user,
    getToken: (state) => state.token,
    loggedIn: (state) => state.isLoggedIn
  },

  actions: {
    async login(username: string, _password: string) {
      try {
        if (username !== 'admin' || _password !== '123456') {
          return { success: false, message: '用户名或密码错误' }
        }
        const mockResponse = {
          token: 'mock-token-' + Date.now(),
          user: {
            id: '1',
            username: username,
            name: username === 'admin' ? '管理员' : username,
            role: 'admin'
          }
        }

        localStorage.setItem('token', mockResponse.token)
        this.token = mockResponse.token
        this.user = mockResponse.user
        this.isLoggedIn = true
        
        return { success: true, data: mockResponse }
      } catch (error) {
        console.error('登录失败:', error)
        return { success: false, message: '登录失败，请检查用户名和密码' }
      }
    },

    logout() {
      localStorage.removeItem('token')
      this.token = ''
      this.user = null
      this.isLoggedIn = false
    },

    checkAuth() {
      if (this.token) {
        this.isLoggedIn = true
      }
    }
  }
})