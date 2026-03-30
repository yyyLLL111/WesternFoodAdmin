import axios from 'axios'

const http = axios.create({
  baseURL: 'https://western-food.vercel.app/api',
  timeout: 10000
})

http.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

http.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API请求错误:', error)
    return Promise.reject(error)
  }
)

export default http