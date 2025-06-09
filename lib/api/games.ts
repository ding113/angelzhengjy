import { apiRequest } from './client'
import type { ApiResponse, PaginatedResponse, GameScore, GameStats } from './types'

export const skiingGameApi = {
  async submitScore(
    playerName: string,
    score: number,
    duration: number
  ): Promise<ApiResponse<GameScore>> {
    return apiRequest<GameScore>('/api/games/skiing/scores', {
      method: 'POST',
      body: JSON.stringify({ playerName, score, duration })
    })
  },

  async getLeaderboard(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<{
    leaderboard: GameScore[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>> {
    return apiRequest(`/api/games/skiing/leaderboard?page=${page}&limit=${limit}`)
  },

  async getStats(): Promise<ApiResponse<GameStats>> {
    return apiRequest<GameStats>('/api/games/skiing/stats')
  },

  async getPlayerRecords(
    playerName: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<GameScore>>> {
    return apiRequest<PaginatedResponse<GameScore>>(
      `/api/games/skiing/player/records?playerName=${encodeURIComponent(playerName)}&page=${page}&limit=${limit}`
    )
  }
}

export const sheepGameApi = {
  async submitScore(
    playerName: string,
    score: number,
    duration: number
  ): Promise<ApiResponse<GameScore>> {
    return apiRequest<GameScore>('/api/games/sheep/scores', {
      method: 'POST',
      body: JSON.stringify({ playerName, score, duration })
    })
  },

  async getLeaderboard(
    page = 1,
    limit = 10
  ): Promise<ApiResponse<{
    leaderboard: GameScore[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>> {
    return apiRequest(`/api/games/sheep/leaderboard?page=${page}&limit=${limit}`)
  },

  async getStats(): Promise<ApiResponse<GameStats>> {
    return apiRequest<GameStats>('/api/games/sheep/stats')
  },

  async getPlayerRecords(
    playerName: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<GameScore>>> {
    return apiRequest<PaginatedResponse<GameScore>>(
      `/api/games/sheep/player/records?playerName=${encodeURIComponent(playerName)}&page=${page}&limit=${limit}`
    )
  }
}

export const gamesApi = {
  async getOverallStats(): Promise<ApiResponse<{
    skiing: GameStats
    sheep: GameStats
    overall: {
      totalPlayers: number
      totalGames: number
    }
  }>> {
    return apiRequest('/api/games/stats')
  }
}
