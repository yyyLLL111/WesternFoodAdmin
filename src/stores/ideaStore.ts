import { defineStore } from 'pinia'
import { ideaApi } from '../api'

export interface Idea {
  id: string
  title: string
  description: string
  ingredients: string[]
  steps: string[]
  difficulty: string
  prepTime: number
  createdAt: string
  updatedAt: string
}

export const useIdeaStore = defineStore('idea', {
  state: () => ({
    ideas: [] as Idea[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchIdeas() {
      this.loading = true
      try {
        const response = await ideaApi.getAll()
        this.ideas = response.data
      } catch (error: any) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    },

    async createIdea(data: Omit<Idea, 'id' | 'createdAt' | 'updatedAt'>) {
      try {
        const response = await ideaApi.create(data)
        this.ideas.push(response.data)
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async updateIdea(id: string, data: Partial<Idea>) {
      try {
        const response = await ideaApi.update(id, data)
        const index = this.ideas.findIndex(idea => idea.id === id)
        if (index !== -1) {
          this.ideas[index] = response.data
        }
        return response.data
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    },

    async deleteIdea(id: string) {
      try {
        await ideaApi.delete(id)
        this.ideas = this.ideas.filter(idea => idea.id !== id)
      } catch (error: any) {
        this.error = error.message
        throw error
      }
    }
  }
})