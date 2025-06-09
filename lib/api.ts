import { config } from './config';

// API基础配置
const API_BASE_URL = config.API_BASE_URL;

// 调试信息
console.log('🔧 API Configuration:', {
  API_BASE_URL,
  environment: process.env.NODE_ENV,
  customApiUrl: process.env.NEXT_PUBLIC_API_BASE_URL
});

// 统一响应格式类型
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  details?: string;
}

// 分页响应类型
interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 数据模型类型定义
export interface Wish {
  _id: string;
  text: string;
  author: string;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  messageId: string;
  sessionId: string;
  difyConversationId?: string;
  text: string;
  isAI: boolean;
  createdAt: string;
}

export interface InnerMessage {
  _id: string;
  text: string;
  author: string;
  color: string;
  hugs: number;
  replies: Reply[];
  createdAt: string;
  updatedAt: string;
}

export interface Reply {
  replyId: string;
  text: string;
  author: string;
  createdAt: string;
}

// 统一的API请求方法
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  console.log('🔗 API Request:', {
    url: fullUrl,
    method: options.method || 'GET',
    headers: options.headers,
    body: options.body
  });

  try {
    const response = await fetch(fullUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('📡 API Response Status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ API Response Data:', data);
    return data;
  } catch (error) {
    console.error('❌ API request failed:', {
      url: fullUrl,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined
    });
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

// 心愿墙 API
export const wishesApi = {
  // 创建心愿
  create: async (text: string, author: string): Promise<ApiResponse<Wish>> => {
    return apiRequest<Wish>('/api/wishes/create', {
      method: 'POST',
      body: JSON.stringify({ text, author }),
    });
  },

  // 获取心愿列表
  getList: async (
    page = 1,
    limit = 10,
    sortBy: 'latest' | 'popular' = 'latest'
  ): Promise<ApiResponse<PaginatedResponse<Wish>>> => {
    return apiRequest<PaginatedResponse<Wish>>(
      `/api/wishes/list?page=${page}&limit=${limit}&sortBy=${sortBy}`
    );
  },

  // 获取心愿统计
  getStats: async (): Promise<ApiResponse<{ total: number }>> => {
    return apiRequest<{ total: number }>('/api/wishes/stats');
  },

  // 获取心愿详情
  getDetail: async (id: string): Promise<ApiResponse<Wish>> => {
    return apiRequest<Wish>(`/api/wishes/detail?id=${id}`);
  },

  // 点赞心愿
  like: async (id: string): Promise<ApiResponse<{ likes: number }>> => {
    return apiRequest<{ likes: number }>(`/api/wishes/like?id=${id}`, {
      method: 'POST',
    });
  },
};

// 游戏分数类型定义
export type GameScore = {
  _id: string;
  playerName: string;
  score: number;
  duration: number;
  rank?: number;
  createdAt: string;
};

export type GameStats = {
  totalPlayers: number;
  totalGames: number;
  highestScore: number;
  topPlayer: string;
  avgScore?: number;
  avgDuration?: number;
};

// 滑雪游戏 API
export const skiingGameApi = {
  // 提交分数
  submitScore: async (
    playerName: string,
    score: number,
    duration: number
  ): Promise<ApiResponse<GameScore>> => {
    return apiRequest<GameScore>('/api/games/skiing/scores', {
      method: 'POST',
      body: JSON.stringify({ playerName, score, duration }),
    });
  },

  // 获取排行榜
  getLeaderboard: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<{
    leaderboard: GameScore[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>> => {
    return apiRequest(`/api/games/skiing/leaderboard?page=${page}&limit=${limit}`);
  },

  // 获取游戏统计
  getStats: async (): Promise<ApiResponse<GameStats>> => {
    return apiRequest<GameStats>('/api/games/skiing/stats');
  },

  // 获取玩家记录
  getPlayerRecords: async (
    playerName: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<GameScore>>> => {
    return apiRequest<PaginatedResponse<GameScore>>(
      `/api/games/skiing/player/records?playerName=${encodeURIComponent(playerName)}&page=${page}&limit=${limit}`
    );
  },
};

// 数羊游戏 API
export const sheepGameApi = {
  // 提交分数
  submitScore: async (
    playerName: string,
    score: number,
    duration: number
  ): Promise<ApiResponse<GameScore>> => {
    return apiRequest<GameScore>('/api/games/sheep/scores', {
      method: 'POST',
      body: JSON.stringify({ playerName, score, duration }),
    });
  },

  // 获取排行榜
  getLeaderboard: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<{
    leaderboard: GameScore[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>> => {
    return apiRequest(`/api/games/sheep/leaderboard?page=${page}&limit=${limit}`);
  },

  // 获取游戏统计
  getStats: async (): Promise<ApiResponse<GameStats>> => {
    return apiRequest<GameStats>('/api/games/sheep/stats');
  },

  // 获取玩家记录
  getPlayerRecords: async (
    playerName: string,
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<GameScore>>> => {
    return apiRequest<PaginatedResponse<GameScore>>(
      `/api/games/sheep/player/records?playerName=${encodeURIComponent(playerName)}&page=${page}&limit=${limit}`
    );
  },
};

// 综合游戏统计 API
export const gamesApi = {
  // 获取综合统计
  getOverallStats: async (): Promise<ApiResponse<{
    skiing: GameStats;
    sheep: GameStats;
    overall: {
      totalPlayers: number;
      totalGames: number;
    };
  }>> => {
    return apiRequest('/api/games/stats');
  },
};

// AI聊天 API
export const chatApi = {
  // 创建会话
  createSession: async (): Promise<ApiResponse<{ sessionId: string }>> => {
    return apiRequest<{ sessionId: string }>('/api/chat/sessions', {
      method: 'POST',
    });
  },

  // 发送消息
  sendMessage: async (
    message: string,
    sessionId: string
  ): Promise<ApiResponse<{ userMessage: ChatMessage; aiMessage: ChatMessage }>> => {
    return apiRequest<{ userMessage: ChatMessage; aiMessage: ChatMessage }>(
      '/api/chat/send',
      {
        method: 'POST',
        body: JSON.stringify({ message, sessionId }),
      }
    );
  },

  // 获取对话历史
  getHistory: async (
    sessionId: string,
    page = 1,
    limit = 50
  ): Promise<ApiResponse<{ messages: ChatMessage[]; total: number }>> => {
    return apiRequest<{ messages: ChatMessage[]; total: number }>(
      `/api/chat/history?sessionId=${sessionId}&page=${page}&limit=${limit}`
    );
  },

  // 获取单条消息详情
  getMessageDetail: async (messageId: string): Promise<ApiResponse<ChatMessage>> => {
    return apiRequest<ChatMessage>(`/api/chat/message/detail?messageId=${messageId}`);
  },

  // 获取会话列表
  getSessionsList: async (): Promise<ApiResponse<Array<{
    _id: string;
    lastMessage: string;
    lastMessageTime: string;
    lastMessageId: string;
    messageCount: number;
  }>>> => {
    return apiRequest('/api/chat/sessions/list');
  },

  // 删除会话
  deleteSession: async (sessionId: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/api/chat/session/delete?sessionId=${sessionId}`, {
      method: 'DELETE',
    });
  },

  // 删除单条消息
  deleteMessage: async (messageId: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/api/chat/message/delete?messageId=${messageId}`, {
      method: 'DELETE',
    });
  },
};

// 内心留言 API  
export const messagesApi = {
  // 发布留言
  create: async (
    text: string,
    author: string,
    color: string
  ): Promise<ApiResponse<InnerMessage>> => {
    return apiRequest<InnerMessage>('/api/messages/create', {
      method: 'POST',
      body: JSON.stringify({ text, author, color }),
    });
  },

  // 获取留言列表
  getList: async (
    page = 1,
    limit = 20
  ): Promise<ApiResponse<PaginatedResponse<InnerMessage>>> => {
    return apiRequest<PaginatedResponse<InnerMessage>>(
      `/api/messages/list?page=${page}&limit=${limit}`
    );
  },

  // 获取热门留言
  getPopular: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<InnerMessage>>> => {
    return apiRequest<PaginatedResponse<InnerMessage>>(
      `/api/messages/popular?page=${page}&limit=${limit}`
    );
  },

  // 获取留言统计
  getStats: async (): Promise<ApiResponse<{
    totalMessages: number;
    totalHugs: number;
    totalReplies: number;
  }>> => {
    return apiRequest('/api/messages/stats');
  },

  // 获取留言详情
  getDetail: async (id: string): Promise<ApiResponse<InnerMessage>> => {
    return apiRequest<InnerMessage>(`/api/messages/detail?id=${id}`);
  },

  // 送拥抱
  sendHug: async (id: string): Promise<ApiResponse<{ hugs: number }>> => {
    return apiRequest<{ hugs: number }>(`/api/messages/hug?id=${id}`, {
      method: 'POST',
    });
  },

  // 回复留言
  reply: async (
    id: string,
    text: string,
    author: string
  ): Promise<ApiResponse<Reply>> => {
    return apiRequest<Reply>(`/api/messages/reply?id=${id}`, {
      method: 'POST',
      body: JSON.stringify({ text, author }),
    });
  },

  // 获取回复详情
  getReplyDetail: async (replyId: string): Promise<ApiResponse<Reply>> => {
    return apiRequest<Reply>(`/api/messages/reply/detail?replyId=${replyId}`);
  },

  // 删除回复
  deleteReply: async (replyId: string): Promise<ApiResponse<void>> => {
    return apiRequest<void>(`/api/messages/reply/delete?replyId=${replyId}`, {
      method: 'DELETE',
    });
  },
};