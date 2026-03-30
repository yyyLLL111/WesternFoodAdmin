import { defineStore } from 'pinia'
import { scrapApi } from '../api'

export interface Scrap {
  id: string
  name: string
  type: string
  quantity: number
  unit: string
  freshness: string
  createdAt: string
  updatedAt: string
}

export const useScrapStore = defineStore('scrap', {
  state: () => ({
    scraps: [] as Scrap[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchScraps() {
      this.loading = true
      try {
        const response = await scrapApi.getAll()
        this.scraps = response.data
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createScrap(data: Omit<Scrap, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        const response = await scrapApi.create(data)
        this.scraps.push(response.data)
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async updateScrap(id: string, data: Partial<Scrap>) {
      try {
        const response = await scrapApi.update(id, data)
        const index = this.scraps.findIndex(scrap => scrap.id === id)
        if (index !== -1) {
          this.scraps[index] = response.data
        }
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async deleteScrap(id: string) {
      try {
        await scrapApi.delete(id)
        this.scraps = this.scraps.filter(scrap => scrap.id !== id)
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    }
  }
})