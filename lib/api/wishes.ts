import { apiRequest } from './client'
import type { ApiResponse, PaginatedResponse, Wish } from './types'

export const wishesApi = {
  async create(text: string, author: string): Promise<ApiResponse<Wish>> {
    return apiRequest<Wish>('/api/wishes/create', {
      method: 'POST',
      body: JSON.stringify({ text, author })
    })
  },

  async getList(
    page = 1,
    limit = 10,
    sortBy: 'latest' | 'popular' = 'latest'
  ): Promise<ApiResponse<PaginatedResponse<Wish>>> {
    return apiRequest<PaginatedResponse<Wish>>(
      `/api/wishes/list?page=${page}&limit=${limit}&sortBy=${sortBy}`
    )
  },

  async getStats(): Promise<ApiResponse<{ total: number }>> {
    return apiRequest<{ total: number }>('/api/wishes/stats')
  },

  async getDetail(id: string): Promise<ApiResponse<Wish>> {
    return apiRequest<Wish>(`/api/wishes/detail?id=${id}`)
  },

  async like(id: string): Promise<ApiResponse<{ likes: number }>> {
    return apiRequest<{ likes: number }>(`/api/wishes/like?id=${id}`, {
      method: 'POST'
    })
  }
}
