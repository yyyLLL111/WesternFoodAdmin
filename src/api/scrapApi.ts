import http from '../utils/http'

export const scrapApi = {
  getAll: () => http.get('/scraps'),
  getById: (id: string) => http.get(`/scraps/${id}`),
  create: (data: any) => http.post('/scraps', data),
  update: (id: string, data: any) => http.put(`/scraps/${id}`, data),
  delete: (id: string) => http.delete(`/scraps/${id}`)
}