import http from '../utils/http'

export const ideaApi = {
  getAll: () => http.get('/ideas'),
  getById: (id: string) => http.get(`/ideas/${id}`),
  create: (data: any) => http.post('/ideas', data),
  update: (id: string, data: any) => http.put(`/ideas/${id}`, data),
  delete: (id: string) => http.delete(`/ideas/${id}`)
}