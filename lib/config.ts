// 环境配置
console.log('🔥 Environment Variables Check:', {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  allEnvVars: Object.keys(process.env).filter(key => key.startsWith('NEXT_PUBLIC_'))
});

export const config = {
  // API基础URL
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  
  // 其他配置
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // 颜色选项
  MESSAGE_COLORS: [
    "from-pink-200 to-pink-100",
    "from-blue-200 to-blue-100", 
    "from-green-200 to-green-100",
    "from-yellow-200 to-yellow-100",
    "from-purple-200 to-purple-100",
    "from-orange-200 to-orange-100",
  ],
  
  // 默认作者名称
  DEFAULT_WISH_AUTHOR: "匿名天使",
  DEFAULT_MESSAGE_AUTHOR: "匿名天使",
  DEFAULT_REPLY_AUTHOR: "温暖回应者",
};