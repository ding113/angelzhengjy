import { apiRequest } from './client'
import type { ApiResponse, PaginatedResponse, InnerMessage, Reply } from './types'

export const messagesApi = {
  async create(
    text: string,
    author: string,
    color: string
  ): Promise<ApiResponse<InnerMessage>> {
    return apiRequest<InnerMessage>('/api/messages/create', {
      method: 'POST',
      body: JSON.stringify({ text, author, color })
    })
  },

  async getList(
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<InnerMessage>>> {
    return apiRequest<PaginatedResponse<InnerMessage>>(
      `/api/messages/list?page=${page}&limit=${limit}`
    )
  },

  async getPopular(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<InnerMessage>>> {
    return apiRequest<PaginatedResponse<InnerMessage>>(
      `/api/messages/popular?page=${page}&limit=${limit}`
    )
  },

  async getStats(): Promise<ApiResponse<{
    totalMessages: number
    totalHugs: number
    totalReplies: number
  }>> {
    return apiRequest('/api/messages/stats')
  },

  async getDetail(id: string): Promise<ApiResponse<InnerMessage>> {
    return apiRequest<InnerMessage>(`/api/messages/detail?id=${id}`)
  },

  async sendHug(id: string): Promise<ApiResponse<{ hugs: number }>> {
    return apiRequest<{ hugs: number }>(`/api/messages/hug?id=${id}`, {
      method: 'POST'
    })
  },

  async reply(
    id: string,
    text: string,
    author: string
  ): Promise<ApiResponse<Reply>> {
    return apiRequest<Reply>(`/api/messages/reply?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ text, author })
    })
  },

  async getReplyDetail(replyId: string): Promise<ApiResponse<Reply>> {
    return apiRequest<Reply>(`/api/messages/reply/detail?replyId=${replyId}`)
  },

  async deleteReply(replyId: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/messages/reply/delete?replyId=${replyId}`, {
      method: 'DELETE'
    })
  }
}
