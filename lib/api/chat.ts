import { apiRequest } from './client'
import type { ApiResponse, ChatMessage } from './types'

export const chatApi = {
  async createSession(): Promise<ApiResponse<{ sessionId: string }>> {
    return apiRequest<{ sessionId: string }>('/api/chat/sessions', {
      method: 'POST'
    })
  },

  async sendMessage(
    message: string,
    sessionId: string
  ): Promise<ApiResponse<{ userMessage: ChatMessage; aiMessage: ChatMessage }>> {
    return apiRequest<{ userMessage: ChatMessage; aiMessage: ChatMessage }>(
      '/api/chat/send',
      {
        method: 'POST',
        body: JSON.stringify({ message, sessionId })
      }
    )
  },

  async getHistory(
    sessionId: string,
    page = 1,
    limit = 50
  ): Promise<ApiResponse<{ messages: ChatMessage[]; total: number }>> {
    return apiRequest<{ messages: ChatMessage[]; total: number }>(
      `/api/chat/history?sessionId=${sessionId}&page=${page}&limit=${limit}`
    )
  },

  async getMessageDetail(messageId: string): Promise<ApiResponse<ChatMessage>> {
    return apiRequest<ChatMessage>(`/api/chat/message/detail?messageId=${messageId}`)
  },

  async getSessionsList(): Promise<ApiResponse<Array<{
    _id: string
    lastMessage: string
    lastMessageTime: string
    lastMessageId: string
    messageCount: number
  }>>> {
    return apiRequest('/api/chat/sessions/list')
  },

  async deleteSession(sessionId: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/chat/session/delete?sessionId=${sessionId}`, {
      method: 'DELETE'
    })
  },

  async deleteMessage(messageId: string): Promise<ApiResponse<void>> {
    return apiRequest<void>(`/api/chat/message/delete?messageId=${messageId}`, {
      method: 'DELETE'
    })
  }
}
