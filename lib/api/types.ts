export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
  details?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface Wish {
  _id: string
  text: string
  author: string
  likes: number
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  messageId: string
  sessionId: string
  difyConversationId?: string
  text: string
  isAI: boolean
  createdAt: string
}

export interface InnerMessage {
  _id: string
  text: string
  author: string
  color: string
  hugs: number
  replies: Reply[]
  createdAt: string
  updatedAt: string
}

export interface Reply {
  replyId: string
  text: string
  author: string
  createdAt: string
}

export type GameScore = {
  _id: string
  playerName: string
  score: number
  duration: number
  rank?: number
  createdAt: string
}

export type GameStats = {
  totalPlayers: number
  totalGames: number
  highestScore: number
  topPlayer: string
  avgScore?: number
  avgDuration?: number
}
