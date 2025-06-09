"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import {
  wishesApi,
  messagesApi,
  chatApi,
  type Wish,
  type InnerMessage,
  type ChatMessage
} from "../lib/api"
import { useApiAction } from "../hooks/useApi"
import { config } from "../lib/config"
import {
  Heart,
  Star,
  Music,
  MessageCircle,
  Send,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  Eye,
  Skiing,
  Sheep,
  CuteBunny,
  CuteCat,
  CuteBird,
  CuteFox
} from "../components/icons"
import { FloatingPetals } from "../components/FloatingPetals"

export default function AngelHeartStation() {
  // 在组件顶部添加
  const [fadeIn, setFadeIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  const [isClient, setIsClient] = useState(false)
  
  // 移除console.log以避免无限渲染时的日志污染
  // console.log("Rendering with isLoading:", isLoading, "fadeIn:", fadeIn)

  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [currentStory, setCurrentStory] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedWish, setSelectedWish] = useState<any>(null)
  const [showAllWishes, setShowAllWishes] = useState(false)
  const [wishes, setWishes] = useState([
    {
      id: 1,
      text: "希望世界和平，每个人都能找到内心的宁静，愿所有的心灵都能在这个美好的世界中找到属于自己的温暖港湾",
      author: "小天使",
      likes: 12,
      category: "世界和平",
    },
    {
      id: 2,
      text: "愿我的家人身体健康，快乐每一天",
      author: "守护者",
      likes: 8,
      category: "家庭幸福",
    },
    {
      id: 3,
      text: "希望能够勇敢地追求自己的梦想，不再害怕失败，相信每一次跌倒都是为了更好地站起来",
      author: "追梦人",
      likes: 15,
      category: "个人成长",
    },
    {
      id: 4,
      text: "愿所有孤独的心灵都能找到温暖的陪伴",
      author: "温暖使者",
      likes: 20,
      category: "情感治愈",
    },
    {
      id: 5,
      text: "希望每个人都能在困难中找到希望的光芒，永远不要放弃对美好生活的向往",
      author: "希望之光",
      likes: 18,
      category: "励志成长",
    },
  ])
  const [newWish, setNewWish] = useState("")
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "你好！我是你的心灵伙伴小天使，有什么想要分享的吗？✨", isAI: true },
  ])
  const [newMessage, setNewMessage] = useState("")
  const [encouragementShown, setEncouragementShown] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const [innerMessages, setInnerMessages] = useState([
    {
      id: 1,
      text: "最近总是感觉很孤独，希望能找到真正理解我的人",
      author: "匿名小鹿",
      color: "from-pink-200 to-pink-100",
      position: { x: 15, y: 25 },
      hugs: 8,
      replies: [{ id: 1, text: "我也有同样的感受，你不是一个人 🤗", author: "温暖天使" }],
    },
    {
      id: 2,
      text: "今天又被老板批评了，感觉自己什么都做不好",
      author: "努力小兔",
      color: "from-blue-200 to-blue-100",
      position: { x: 70, y: 35 },
      hugs: 12,
      replies: [],
    },
    {
      id: 3,
      text: "谢谢那个在地铁上让座的陌生人，让我相信世界还是很温暖的",
      author: "感恩小猫",
      color: "from-green-200 to-green-100",
      position: { x: 45, y: 50 },
      hugs: 15,
      replies: [{ id: 1, text: "小小的善意能照亮整个世界呢 ✨", author: "光芒使者" }],
    },
    {
      id: 4,
      text: "害怕毕业后找不到工作，对未来充满不安",
      author: "迷茫小鸟",
      color: "from-yellow-200 to-yellow-100",
      position: { x: 25, y: 65 },
      hugs: 6,
      replies: [],
    },
    {
      id: 5,
      text: "想念已经去世的奶奶，她总是给我最温暖的拥抱",
      author: "思念小熊",
      color: "from-purple-200 to-purple-100",
      position: { x: 60, y: 70 },
      hugs: 20,
      replies: [{ id: 1, text: "奶奶的爱会永远陪伴着你的 💕", author: "守护天使" }],
    },
  ])
  const [newInnerMessage, setNewInnerMessage] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [showAllMessages, setShowAllMessages] = useState(false)
  const [newReply, setNewReply] = useState("")
  const [hugAnimation, setHugAnimation] = useState<number | null>(null)

  // 滚动动画观察器
  const observerRef = useRef<IntersectionObserver | null>(null)
  
  // 聊天滚动控制
  const chatMessagesEndRef = useRef<HTMLDivElement>(null)

  // API hooks
  const createWishAction = useApiAction<{ text: string; author: string }, Wish>()
  const likeWishAction = useApiAction<{ id: string }, { likes: number }>()
  const createMessageAction = useApiAction<{ text: string; author: string; color: string }, InnerMessage>()
  const sendHugAction = useApiAction<{ id: string }, { hugs: number }>()
  const sendChatAction = useApiAction<{ message: string; sessionId: string }, { userMessage: ChatMessage; aiMessage: ChatMessage }>()

  // 会话ID管理
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [apiConnected, setApiConnected] = useState(false)

  // 创建或重新创建聊天会话
  const createChatSession = useCallback(async () => {
    try {
      console.log('Creating new chat session...')
      const sessionResponse = await chatApi.createSession()
      console.log('Session creation response:', sessionResponse)
      
      if (sessionResponse.success && sessionResponse.data) {
        setCurrentSessionId(sessionResponse.data.sessionId)
        console.log('✅ Chat session created successfully:', sessionResponse.data.sessionId)
        return sessionResponse.data.sessionId
      } else {
        console.error('❌ Failed to create chat session:', sessionResponse)
        throw new Error('Failed to create chat session')
      }
    } catch (error) {
      console.error('❌ Error creating chat session:', error)
      throw error
    }
  }, [])

  // 初始化数据加载
  const loadInitialData = useCallback(async () => {
    try {
      console.log('Attempting to connect to:', `${config.API_BASE_URL}/health`)
      
      // 测试API连接
      const healthResponse = await fetch(`${config.API_BASE_URL}/health`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Health response status:', healthResponse.status)
      console.log('Health response headers:', healthResponse.headers)
      
      if (!healthResponse.ok) {
        throw new Error(`Backend not available: ${healthResponse.status} ${healthResponse.statusText}`)
      }
      
      const healthData = await healthResponse.text()
      console.log('Health response data:', healthData)
      
      setApiConnected(true)

      // 加载心愿列表
      const wishesResponse = await wishesApi.getList(1, 10, 'latest')
      console.log('Wishes API Response:', wishesResponse)
      if (wishesResponse.success && wishesResponse.data) {
        // 转换API数据格式以适配现有UI
        const adaptedWishes = wishesResponse.data.items.map((wish: Wish, index: number) => ({
          id: index + 1, // 使用数字ID以兼容UI
          text: wish.text,
          author: wish.author,
          likes: wish.likes,
          category: "API数据",
          _id: wish._id // 保留原始ID用于API调用
        }))
        console.log('Adapted Wishes:', adaptedWishes)
        setWishes(adaptedWishes)
      }

      // 加载内心留言
      const messagesResponse = await messagesApi.getList(1, 10)
      console.log('Messages API Response:', messagesResponse)
      if (messagesResponse.success && messagesResponse.data) {
        // 转换API数据格式以适配现有UI
        const adaptedMessages = messagesResponse.data.items.map((msg: InnerMessage, index: number) => ({
          id: index + 1, // 使用数字ID以兼容UI
          text: msg.text,
          author: msg.author,
          color: msg.color,
          position: { 
            x: 15 + (index * 15) % 70, 
            y: 25 + (index * 10) % 50 
          },
          hugs: msg.hugs,
          replies: msg.replies.map((reply, replyIndex) => ({
            id: replyIndex + 1, // 使用数字ID以兼容UI
            text: reply.text,
            author: reply.author
          })),
          _id: msg._id // 保留原始ID用于API调用
        }))
        console.log('Adapted Messages:', adaptedMessages)
        setInnerMessages(adaptedMessages)
      }

      // 创建聊天会话
      await createChatSession()

      // 加载统计数据
      const [wishStatsResponse, messageStatsResponse] = await Promise.all([
        wishesApi.getStats(),
        messagesApi.getStats()
      ])
      
      console.log('Wish Stats:', wishStatsResponse)
      console.log('Message Stats:', messageStatsResponse)
      
      // 这些统计数据可以用于在UI中显示总数等信息
    } catch (error) {
      console.error('Failed to load initial data:', error)
      
      // 详细的错误诊断
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('🚨 Network Error Diagnosis:')
        console.error('1. Check if backend is running on', config.API_BASE_URL)
        console.error('2. Check CORS configuration on backend')
        console.error('3. Check if backend listens on 0.0.0.0:3001 not localhost:3001')
        console.error('4. Check firewall settings')
        console.error('5. Try accessing', `${config.API_BASE_URL}/health`, 'directly in browser')
      }
      
      setApiConnected(false)
      // 保留静态数据作为备用
    }
  }, [createChatSession])

  useEffect(() => {
    // 设置客户端渲染状态
    setIsClient(true)
    
    // 加载初始数据
    loadInitialData()
    
    // 检查是否是首次访问
    const hasVisited = sessionStorage.getItem('hasVisitedMain')
    if (hasVisited) {
      // 如果已经访问过，直接显示内容，不播放加载动画
      setIsLoading(false)
      setFadeIn(true)
      setIsFirstVisit(false)
      return
    }

    // 首次访问时播放加载动画
    sessionStorage.setItem('hasVisitedMain', 'true')
    
    // 进场动画逻辑
    const loadingTimer = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(loadingTimer)
          setTimeout(() => {
            setIsLoading(false)
            setTimeout(() => {
              setFadeIn(true)
              setIsFirstVisit(false)
            }, 100)
          }, 500)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)

    // 设置滚动动画观察器
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible")
          }
        })
      },
      { threshold: 0.1 },
    )

    // 观察所有需要动画的元素
    setTimeout(() => {
      const animateElements = document.querySelectorAll(".scroll-animate")
      animateElements.forEach((el) => {
        observerRef.current?.observe(el)
      })
    }, 1000)

    return () => {
      clearInterval(loadingTimer)
      observerRef.current?.disconnect()
    }
  }, [loadInitialData])

  const moods = [
    { name: "开心", color: "from-yellow-200 via-orange-200 to-pink-200", animal: CuteBunny },
    { name: "平静", color: "from-blue-200 via-indigo-200 to-purple-200", animal: CuteCat },
    { name: "感恩", color: "from-pink-200 via-rose-200 to-red-200", animal: CuteBird },
    { name: "希望", color: "from-green-200 via-emerald-200 to-teal-200", animal: CuteFox },
    { name: "温暖", color: "from-orange-200 via-amber-200 to-yellow-200", animal: CuteBunny },
    { name: "梦幻", color: "from-purple-200 via-violet-200 to-indigo-200", animal: CuteCat },
  ]

  const stories = [
    {
      title: "小星星的旅程",
      content:
        "在遥远的银河系中，有一颗小星星迷失了方向。它害怕黑暗，害怕孤独。但是当它学会发出自己的光芒时，发现原来自己就是别人的指路明灯。每当夜晚降临，小星星都会想起那些曾经帮助过的旅人，心中充满了温暖和力量。",
      category: "成长故事",
      color: "from-yellow-100 via-orange-100 to-pink-100",
    },
    {
      title: "花园里的秘密",
      content:
        "老园丁每天都在花园里种植各种花朵。有一天，他发现最美的花不是那些精心照料的，而是在角落里自然生长的野花。它们没有华丽的外表，却有着最纯真的美丽。从那天起，老园丁明白了，真正的美丽来自内心的纯净。",
      category: "人生感悟",
      color: "from-green-100 via-emerald-100 to-teal-100",
    },
    {
      title: "云朵的约定",
      content:
        "两朵云朵在天空中相遇，它们约定要一起环游世界。虽然风会把它们吹散，但它们相信总有一天会再次相遇。经过了春夏秋冬，它们终于在一个美丽的黄昏重逢，化作了天边最美的晚霞。",
      category: "友情故事",
      color: "from-blue-100 via-purple-100 to-indigo-100",
    },
    {
      title: "月亮的礼物",
      content:
        "每当夜晚来临，月亮都会为大地送上银色的光辉。有一个小女孩总是对着月亮许愿，希望能够帮助更多的人。月亮被她的善良感动，赐予了她一颗闪闪发光的心，让她成为了传播爱与希望的使者。",
      category: "奇幻故事",
      color: "from-indigo-100 via-violet-100 to-purple-100",
    },
  ]

  const encouragements = [
    "你的心情被温柔记录了 ✨",
    "愿这份美好伴随你一整天 🌸",
    "你的每一种情感都很珍贵 💖",
    "感谢你与我们分享内心的声音 🌙",
    "你的存在让世界更加美好 🦋",
  ]

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood)
    setEncouragementShown(true)
    setTimeout(() => {
      setSelectedMood(null)
      setEncouragementShown(false)
    }, 3000)
  }

  const handleWishSubmit = async () => {
    if (!newWish.trim()) return

    try {
      const response = await wishesApi.create(newWish.trim(), "匿名天使")
      if (response.success && response.data) {
        // 将新心愿添加到列表顶部
        const newWishItem = {
          id: wishes.length + 1,
          text: response.data.text,
          author: response.data.author,
          likes: response.data.likes,
          category: "新愿望",
          _id: response.data._id
        }
        setWishes([newWishItem, ...wishes])
        setNewWish("")
        
        // 显示成功提示
        console.log("心愿提交成功:", response.data)
      } else {
        alert("心愿提交失败，请重试")
      }
    } catch (error) {
      console.error("心愿提交错误:", error)
      alert("心愿提交失败，请重试")
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      console.warn("Message is empty")
      return
    }
    
    if (!currentSessionId) {
      console.warn("No session ID available, trying to create new session...")
      try {
        await createChatSession()
        if (!currentSessionId) {
          console.error("Failed to create session")
          alert("聊天会话创建失败，请刷新页面重试")
          return
        }
      } catch (error) {
        console.error("Failed to create session:", error)
        alert("聊天会话创建失败，请刷新页面重试")
        return
      }
    }

    const messageText = newMessage.trim()
    const userMessageId = chatMessages.length + 1
    const aiMessageId = chatMessages.length + 2
    
    // 1. 立即显示用户消息
    const userMessage = {
      id: userMessageId,
      text: messageText,
      isAI: false,
    }
    
    // 2. 添加AI加载消息
    const loadingAiMessage = {
      id: aiMessageId,
      text: "",
      isAI: true,
      isLoading: true, // 标记为加载状态
    }
    
    setChatMessages([...chatMessages, userMessage, loadingAiMessage])
    setNewMessage("")

    console.log('Sending message:', {
      message: messageText,
      sessionId: currentSessionId
    })

    try {
      const response = await chatApi.sendMessage(messageText, currentSessionId)
      console.log('Send message response:', response)
      
      if (response.success && response.data) {
        // 确保响应数据结构正确
        if (response.data.userMessage && response.data.aiMessage) {
          // 3. 用真实AI回复替换加载消息
          const realAiMessage = {
            id: aiMessageId,
            text: response.data.aiMessage.text,
            isAI: true,
            isLoading: false,
          }
          
          setChatMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId ? realAiMessage : msg
            )
          )
          
          console.log("✅ 真实AI消息发送成功:", {
            userMessage: response.data.userMessage,
            aiMessage: response.data.aiMessage
          })
        } else {
          console.error("API响应数据结构不正确:", response.data)
          throw new Error("API响应数据结构不正确")
        }
      } else {
        console.error("API调用失败:", response)
        throw new Error(`API调用失败: ${response.error || '未知错误'}`)
      }
    } catch (error) {
      console.error("❌ 消息发送错误:", error)
      console.log("🔄 回退到静态回复模式")
      
      // 4. 如果API失败，用静态回复替换加载消息
      setTimeout(() => {
        const responses = [
          "我理解你的感受。每个人都会有这样的时刻，重要的是要相信自己内心的力量。你想聊聊是什么让你有这样的感受吗？💫",
          "你的话语中充满了真诚，这让我很感动。有时候，分享内心的想法就是治愈的开始。🌸",
          "谢谢你愿意与我分享。在这个温暖的空间里，你可以自由地表达任何情感。我会一直陪伴着你。✨",
          "你的勇气让我敬佩。能够诚实面对自己的情感，这本身就是一种成长。🦋",
        ]
        const fallbackAiMessage = {
          id: aiMessageId,
          text: responses[Math.floor(Math.random() * responses.length)],
          isAI: true,
          isLoading: false,
        }
        
        setChatMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId ? fallbackAiMessage : msg
          )
        )
      }, 1000) // 稍微延迟一下，让用户看到加载效果
    }
  }

  // 自动滚动到最新消息
  useEffect(() => {
    if (chatMessagesEndRef.current) {
      chatMessagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      })
    }
  }, [chatMessages])

  const likeWish = async (wishId: number) => {
    const wish = wishes.find(w => w.id === wishId)
    if (!wish || !(wish as any)._id) {
      console.error("无法找到心愿ID")
      return
    }

    try {
      const response = await wishesApi.like((wish as any)._id)
      if (response.success && response.data && typeof response.data.likes === 'number') {
        // 更新本地状态
        setWishes(wishes.map((w) => 
          w.id === wishId ? { ...w, likes: response.data!.likes } : w
        ))
        console.log("点赞成功:", response.data)
      } else {
        alert("点赞失败，请重试")
      }
    } catch (error) {
      console.error("点赞错误:", error)
      // 如果API失败，回退到本地更新
      setWishes(wishes.map((w) => (w.id === wishId ? { ...w, likes: w.likes + 1 } : w)))
    }
  }

  const handleInnerMessageSubmit = async () => {
    if (!newInnerMessage.trim()) return

    const colors = [
      "from-pink-200 to-pink-100",
      "from-blue-200 to-blue-100",
      "from-green-200 to-green-100",
      "from-yellow-200 to-yellow-100",
      "from-purple-200 to-purple-100",
      "from-orange-200 to-orange-100",
    ]

    try {
      const randomColor = colors[Math.floor(Math.random() * colors.length)]
      const response = await messagesApi.create(newInnerMessage.trim(), "匿名天使", randomColor)
      
      if (response.success && response.data) {
        // 添加新留言到列表
        const newMessage = {
          id: innerMessages.length + 1,
          text: response.data.text,
          author: response.data.author,
          color: response.data.color,
          position: {
            x: Math.random() * 60 + 20,
            y: Math.random() * 50 + 20,
          },
          hugs: response.data.hugs,
          replies: response.data.replies.map((reply: any, index: number) => ({
            id: index + 1,
            text: reply.text,
            author: reply.author
          })),
          _id: response.data._id
        }
        setInnerMessages([...innerMessages, newMessage])
        setNewInnerMessage("")
        
        console.log("内心留言提交成功:", response.data)
      } else {
        alert("留言提交失败，请重试")
      }
    } catch (error) {
      console.error("留言提交错误:", error)
      // 如果API失败，回退到本地添加
      const message = {
        id: innerMessages.length + 1,
        text: newInnerMessage,
        author: "匿名天使",
        color: colors[Math.floor(Math.random() * colors.length)],
        position: {
          x: Math.random() * 60 + 20,
          y: Math.random() * 50 + 20,
        },
        hugs: 0,
        replies: [],
      }
      setInnerMessages([...innerMessages, message])
      setNewInnerMessage("")
    }
  }

  const handleSendHug = async (messageId: number) => {
    const message = innerMessages.find(m => m.id === messageId)
    if (!message || !(message as any)._id) {
      console.error("无法找到留言ID")
      return
    }

    try {
      const response = await messagesApi.sendHug((message as any)._id)
      if (response.success && response.data && typeof response.data.hugs === 'number') {
        // 更新本地状态
        setInnerMessages(innerMessages.map((msg) => 
          msg.id === messageId ? { ...msg, hugs: response.data!.hugs } : msg
        ))
        setHugAnimation(messageId)
        setTimeout(() => setHugAnimation(null), 1000)
        console.log("拥抱发送成功:", response.data)
      } else {
        alert("拥抱发送失败，请重试")
      }
    } catch (error) {
      console.error("拥抱发送错误:", error)
      // 如果API失败，回退到本地更新
      setInnerMessages(innerMessages.map((msg) => (msg.id === messageId ? { ...msg, hugs: msg.hugs + 1 } : msg)))
      setHugAnimation(messageId)
      setTimeout(() => setHugAnimation(null), 1000)
    }
  }

  const handleReplySubmit = async (messageId: number) => {
    if (!newReply.trim()) return

    const message = innerMessages.find(m => m.id === messageId)
    if (!message || !(message as any)._id) {
      console.error("无法找到留言ID")
      return
    }

    try {
      const response = await messagesApi.reply((message as any)._id, newReply.trim(), "温暖回应者")
      if (response.success && response.data) {
        // 更新本地状态
        setInnerMessages(
          innerMessages.map((msg) =>
            msg.id === messageId
              ? {
                  ...msg,
                  replies: [
                    ...msg.replies,
                    {
                      id: msg.replies.length + 1,
                      text: response.data!.text,
                      author: response.data!.author,
                    },
                  ],
                }
              : msg,
          ),
        )
        setNewReply("")
        console.log("回复提交成功:", response.data)
      } else {
        alert("回复提交失败，请重试")
      }
    } catch (error) {
      console.error("回复提交错误:", error)
      // 如果API失败，回退到本地更新
      setInnerMessages(
        innerMessages.map((msg) =>
          msg.id === messageId
            ? {
                ...msg,
                replies: [
                  ...msg.replies,
                  {
                    id: msg.replies.length + 1,
                    text: newReply,
                    author: "温暖回应者",
                  },
                ],
              }
            : msg,
        ),
      )
      setNewReply("")
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* API连接状态指示器 */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <div className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${
          apiConnected 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
        }`}>
          {apiConnected ? '🟢 API已连接' : '🟡 使用静态数据'}
        </div>
        {/* AI会话状态指示器 */}
        <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
          currentSessionId 
            ? 'bg-blue-100 text-blue-800 border border-blue-200' 
            : 'bg-gray-100 text-gray-800 border border-gray-200'
        }`}>
          {currentSessionId ? '💬 AI会话已就绪' : '⏳ AI会话准备中'}
        </div>
        {/* AI回复状态指示器 */}
        {chatMessages.some((msg: any) => msg.isLoading) && (
          <div className="px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 bg-purple-100 text-purple-800 border border-purple-200 animate-pulse">
            ⚡ AI正在回复中...
          </div>
        )}
      </div>
      {/* 进场动画 */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
          {/* 背景粒子效果 */}
          <div className="absolute inset-0">
            {isClient && [...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-gradient-to-br from-pink-300/60 to-purple-300/60 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${4 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* 主要内容 */}
          <div className="relative z-10 text-center">
            {/* 可爱动物欢迎团队 */}
            <div className="flex items-center justify-center space-x-8 mb-12">
              <div className="animate-float" style={{ animationDuration: "2s", animationDelay: "0s" }}>
                <CuteBunny className="w-16 h-16 text-pink-400" />
              </div>
              <div className="animate-float" style={{ animationDuration: "2s", animationDelay: "0.5s" }}>
                <CuteCat className="w-16 h-16 text-purple-400" />
              </div>
              <div className="animate-float" style={{ animationDuration: "2s", animationDelay: "1s" }}>
                <CuteBird className="w-16 h-16 text-blue-400" />
              </div>
              <div className="animate-float" style={{ animationDuration: "2s", animationDelay: "1.5s" }}>
                <CuteFox className="w-16 h-16 text-orange-400" />
              </div>
            </div>

            {/* 欢迎文字 */}
            <div className="mb-12">
              <h1
                className="text-6xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-pulse-slow"
                style={{ fontFamily: "'Fredoka One', 'Nunito', 'Patrick Hand', 'Kalam', 'Comic Sans MS', cursive" }}
              >
                欢迎来到
              </h1>
              <h2
                className="text-4xl font-bold bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent"
                style={{ fontFamily: "'Fredoka One', 'Nunito', 'Patrick Hand', 'Kalam', 'Comic Sans MS', cursive" }}
              >
                Angelzhengjy的心灵驿站
              </h2>
              <p className="text-xl text-gray-600 mt-4 animate-fadeIn" style={{ animationDelay: "1s" }}>
                心灵驿站正在为你准备温暖的空间...
              </p>
            </div>

            {/* 加载进度条 */}
            <div className="w-80 mx-auto">
              <div
                className="h-4 bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-sm border border-white/30 overflow-hidden mb-4"
                style={{ borderRadius: "20px" }}
              >
                <div
                  className="h-full bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 transition-all duration-300 ease-out relative overflow-hidden"
                  style={{
                    width: `${loadingProgress}%`,
                    borderRadius: "20px",
                  }}
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent animate-flow"
                    style={{ borderRadius: "inherit" }}
                  />
                </div>
              </div>
              <p className="text-lg text-gray-500 font-medium">{Math.round(loadingProgress)}%</p>
            </div>

            {/* 加载提示文字 */}
            <div className="mt-8">
              <p className="text-lg text-gray-600 animate-pulse-slow">
                {loadingProgress < 30 && "正在唤醒小天使们..."}
                {loadingProgress >= 30 && loadingProgress < 60 && "正在布置温暖的心灵空间..."}
                {loadingProgress >= 60 && loadingProgress < 90 && "正在准备治愈的故事和音乐..."}
                {loadingProgress >= 90 && "马上就好了，请稍等..."}
              </p>
            </div>

            {/* 装饰性星星 */}
            <div className="absolute top-20 left-20 animate-rotate" style={{ animationDuration: "8s" }}>
              <Star className="w-8 h-8 text-yellow-400/60" />
            </div>
            <div
              className="absolute top-32 right-24 animate-rotate"
              style={{ animationDuration: "6s", animationDirection: "reverse" }}
            >
              <Sparkles className="w-6 h-6 text-pink-400/60" />
            </div>
            <div className="absolute bottom-24 left-32 animate-rotate" style={{ animationDuration: "10s" }}>
              <Heart className="w-7 h-7 text-red-400/60" />
            </div>
            <div
              className="absolute bottom-20 right-20 animate-rotate"
              style={{ animationDuration: "7s", animationDirection: "reverse" }}
            >
              <Music className="w-6 h-6 text-purple-400/60" />
            </div>
          </div>

          {/* 底部波浪装饰 */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1200 120" className="w-full h-24 text-white/20">
              <path d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z" fill="currentColor" className="animate-flow" />
            </svg>
          </div>
        </div>
      )}

      {/* 原有的网站内容 */}
      {!isLoading && (
        <div className="contents">
          {/* 浪漫梦幻背景 */}
          <div className="fixed inset-0">
            {/* 背景图片层 */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/hero.jpg')",
                opacity: 1
              }}
            />
            
            {/* 渐变覆盖层，让原有元素更突出 */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-50/30 via-purple-50/30 to-blue-50/30">
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-50/20 via-transparent to-green-50/20"></div>
              <div className="absolute inset-0 bg-gradient-to-bl from-indigo-50/15 via-transparent to-rose-50/15"></div>
            </div>
            
            {/* 混合层 */}
            <div className="absolute inset-0 backdrop-blur-[0.2px] bg-white/10"></div>
            
            <div
              className="absolute top-20 left-16 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-2xl animate-float"
              style={{ animationDuration: "15s" }}
            />
            <div
              className="absolute top-60 right-24 w-28 h-28 bg-gradient-to-br from-blue-200/15 to-indigo-200/15 rounded-full blur-xl animate-float"
              style={{ animationDuration: "12s", animationDelay: "3s" }}
            />
            <div
              className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-br from-green-200/15 to-yellow-200/15 rounded-full blur-3xl animate-float"
              style={{ animationDuration: "18s", animationDelay: "6s" }}
            />
            <FloatingPetals isClient={isClient} />
          </div>

          {/* 其余内容保持不变 */}

          {/* 弯曲的导航栏 */}
          <nav
            className={`relative z-50 backdrop-blur-lg bg-gradient-to-r from-white/30 to-white/20 border-b border-white/30 transition-all duration-1000 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"}`}
            style={{
              clipPath: "ellipse(100% 100% at 50% 0%)",
              borderRadius: "0 0 50% 50%",
            }}
          >
            <div className="container mx-auto px-8 py-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 hover:scale-105 transition-transform duration-300">
                  <div className="animate-float" style={{ animationDuration: "5s" }}>
                    <CuteBunny className="w-10 h-10 text-pink-400" />
                  </div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                    Angelzhengjy的心灵驿站
                  </div>
                  <div className="animate-float" style={{ animationDuration: "5s", animationDelay: "2.5s" }}>
                    <CuteCat className="w-10 h-10 text-purple-400" />
                  </div>
                </div>
                <div className="flex space-x-3">
                  {[
                    { name: "首页", Icon: Sparkles, animal: CuteBird, href: "#home" },
                    { name: "心情", Icon: Heart, animal: CuteFox, href: "#mood" },
                    { name: "许愿", Icon: Star, animal: CuteBunny, href: "#wishes" },
                    { name: "故事", Icon: MessageCircle, animal: CuteCat, href: "#stories" },
                    { name: "音乐", Icon: Music, animal: CuteBird, href: "#music" },
                    { name: "滑雪", Icon: Skiing, animal: CuteFox, href: "/skiing" },
                    { name: "数羊", Icon: Sheep, animal: CuteBunny, href: "/sheep" },
                  ].map((item, index) => (
                    item.href.startsWith("/") ? (
                      <Link key={item.name} href={item.href}>
                        <button
                          className={`group relative px-3 py-2 md:px-5 md:py-3 bg-gradient-to-r from-white/40 to-white/25 backdrop-blur-sm border border-white/30 text-gray-600 hover:text-purple-600 transition-all duration-500 overflow-hidden rounded-full transform hover:scale-110 hover:-translate-y-1 active:scale-95 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center space-x-1 md:space-x-2 relative z-10">
                            <item.animal className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="font-medium text-xs md:text-sm">{item.name}</span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                        </button>
                      </Link>
                    ) : (
                      <a key={item.name} href={item.href}>
                        <button
                          className={`group relative px-3 py-2 md:px-5 md:py-3 bg-gradient-to-r from-white/40 to-white/25 backdrop-blur-sm border border-white/30 text-gray-600 hover:text-purple-600 transition-all duration-500 overflow-hidden rounded-full transform hover:scale-110 hover:-translate-y-1 active:scale-95 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"}`}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center space-x-1 md:space-x-2 relative z-10">
                            <item.animal className="w-3 h-3 md:w-4 md:h-4" />
                            <span className="font-medium text-xs md:text-sm">{item.name}</span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                        </button>
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="relative z-10">
            {/* 🏠 ANGEL标题区 */}
            <section id="home" className="flex flex-col items-center justify-center relative overflow-hidden pt-20 pb-8">
              <div className="absolute top-16 left-4 md:top-32 md:left-24 animate-float" style={{ animationDuration: "4s" }}>
                <CuteBird className="w-12 h-12 md:w-16 md:h-16 text-pink-300/70" />
              </div>
              <div
                className="absolute top-24 right-4 md:top-48 md:right-32 animate-float"
                style={{ animationDuration: "3s", animationDelay: "1s" }}
              >
                <CuteFox className="w-10 h-10 md:w-14 md:h-14 text-purple-300/70" />
              </div>

              <div
                className={`text-center relative transition-all duration-1000 ${fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
              >
                <h1
                  className="text-6xl md:text-8xl lg:text-[10rem] font-bold mb-6 md:mb-8 relative px-4"
                  style={{
                    background: "linear-gradient(to right, rgba(236, 72, 153, 0.7), rgba(168, 85, 247, 0.7), rgba(99, 102, 241, 0.7))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    WebkitTextStroke: "1px rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(2px)",
                    WebkitBackdropFilter: "blur(2px)",
                    fontFamily: "'Dancing Script', 'Satisfy', 'Patrick Hand', cursive",
                    fontWeight: "600",
                    letterSpacing: "0.1em",
                    textShadow: "0 0 20px rgba(236, 72, 153, 0.3), 0 0 40px rgba(168, 85, 247, 0.2), 0 0 60px rgba(99, 102, 241, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)",
                    filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.1)) drop-shadow(0 0 20px rgba(168, 85, 247, 0.2))",
                  }}
                >
                  ANGEL
                  <div
                    className="absolute -inset-6 bg-gradient-to-r from-pink-300/10 via-purple-300/15 to-blue-300/10 rounded-full blur-2xl animate-pulse-slow"
                    style={{ animationDuration: "8s" }}
                  />
                </h1>

                <div
                  className={`relative mb-12 md:mb-16 transition-all duration-1000 delay-500 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                  <p className="text-lg md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                    欢迎来到Angelzhengjy的心灵驿站，这里是温暖治愈的小天地
                    <br />
                    <span className="text-base md:text-xl text-purple-500 font-medium">让心灵得到安慰，让情感得到温暖</span>
                  </p>
                </div>

              </div>
            </section>

            {/* 🌟 温暖许愿池 */}
            <section id="wishes" className="relative">
              <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-16 md:mb-20 scroll-animate">
                  <h2
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-6 md:mb-8 px-4"
                    style={{ fontFamily: "'Fredoka One', 'Nunito', 'Patrick Hand', 'Kalam', 'Comic Sans MS', cursive" }}
                  >
                    温暖许愿池
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed px-4">在这里许下心愿，让美好的愿望传递给更多人</p>
                </div>

                <div
                  className="max-w-4xl mx-auto mb-20 p-12 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl border border-white/40 relative overflow-hidden scroll-animate"
                  style={{
                    borderRadius: "40px 40px 40px 40px",
                    boxShadow: "0 25px 50px rgba(168, 85, 247, 0.1)",
                  }}
                >
                  <div className="relative z-10">
                    <textarea
                      value={newWish}
                      onChange={(e) => setNewWish(e.target.value)}
                      placeholder="写下你的心愿，让它在星空中闪耀..."
                      className="w-full h-32 p-6 bg-white/60 backdrop-blur-sm border border-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-500 text-lg leading-relaxed"
                      style={{ borderRadius: "30px" }}
                    />
                    <button
                      onClick={handleWishSubmit}
                      className="mt-6 px-8 py-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 active:scale-95"
                      style={{ borderRadius: "25px" }}
                    >
                      <div className="flex items-center space-x-3">
                        <Star className="w-6 h-6" />
                        <span>许下心愿</span>
                        <CuteBird className="w-6 h-6" />
                      </div>
                    </button>
                  </div>

                  <div className="absolute top-6 right-8 animate-rotate" style={{ animationDuration: "15s" }}>
                    <CuteFox className="w-10 h-10 text-purple-400/40" />
                  </div>
                </div>

                <div className="text-center mb-12">
                  <button
                    onClick={() => setShowAllWishes(!showAllWishes)}
                    className="px-8 py-3 bg-gradient-to-r from-purple-300 to-pink-300 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                    style={{ borderRadius: "20px" }}
                  >
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5" />
                      <span>{showAllWishes ? "收起所有愿望" : "查看所有愿望"}</span>
                      <CuteBunny className="w-5 h-5" />
                    </div>
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(showAllWishes ? wishes : wishes.slice(0, 3)).map((wish, index) => (
                    <div
                      key={wish.id}
                      className="group relative p-8 bg-gradient-to-br from-white/40 to-white/25 backdrop-blur-lg border border-white/40 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden scroll-animate hover:scale-102 hover:-translate-y-1"
                      style={{
                        borderRadius: "25px",
                        boxShadow: "0 15px 35px rgba(168, 85, 247, 0.08)",
                        transitionDelay: `${index * 100}ms`,
                      }}
                      onClick={() => setSelectedWish(wish)}
                    >
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <span
                            className="px-4 py-2 bg-gradient-to-r from-pink-300/40 to-purple-300/40 text-purple-700 text-sm font-medium"
                            style={{ borderRadius: "15px" }}
                          >
                            {wish.category}
                          </span>
                          <div className="animate-float" style={{ animationDuration: "4s" }}>
                            <CuteBird className="w-6 h-6 text-pink-400/60" />
                          </div>
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed text-base">
                          {wish.text.length > 80 ? `${wish.text.substring(0, 80)}...` : wish.text}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 font-medium">— {wish.author}</span>
                          <button
                            className="flex items-center space-x-2 text-pink-500 hover:text-pink-600 transition-colors hover:scale-110 active:scale-90"
                            onClick={(e) => {
                              e.stopPropagation()
                              likeWish(wish.id)
                            }}
                          >
                            <Heart className="w-5 h-5" />
                            <span className="font-semibold">{wish.likes}</span>
                          </button>
                        </div>
                      </div>

                      <div
                        className="absolute inset-0 bg-gradient-to-br from-pink-300/10 to-purple-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ borderRadius: "inherit" }}
                      />
                    </div>
                  ))}
                </div>

                {selectedWish && (
                  <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-8"
                    onClick={() => setSelectedWish(null)}
                  >
                    <div
                      className="max-w-2xl w-full p-12 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl border border-white/50 relative overflow-hidden animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        borderRadius: "30px",
                        boxShadow: "0 30px 60px rgba(168, 85, 247, 0.15)",
                      }}
                    >
                      <div className="text-center mb-8">
                        <div className="animate-rotate" style={{ animationDuration: "10s" }}>
                          <Star className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                        </div>
                        <span
                          className="px-6 py-3 bg-gradient-to-r from-pink-300/40 to-purple-300/40 text-purple-700 text-lg font-medium"
                          style={{ borderRadius: "20px" }}
                        >
                          {selectedWish.category}
                        </span>
                      </div>

                      <p className="text-xl text-gray-700 leading-relaxed mb-8 text-center">{selectedWish.text}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-lg text-gray-600 font-medium">— {selectedWish.author}</span>
                        <div className="flex items-center space-x-2 text-pink-500">
                          <Heart className="w-6 h-6" />
                          <span className="text-lg font-semibold">{selectedWish.likes}</span>
                        </div>
                      </div>

                      <div className="absolute top-6 right-6 animate-float" style={{ animationDuration: "4s" }}>
                        <CuteFox className="w-8 h-8 text-purple-400/40" />
                      </div>
                      <div
                        className="absolute bottom-6 left-6 animate-float"
                        style={{ animationDuration: "4s", animationDelay: "2s" }}
                      >
                        <CuteBunny className="w-8 h-8 text-pink-400/40" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 📚 治愈故事时光 */}
            <section id="stories" className="py-16 md:py-24 relative">
              <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-16 md:mb-20 scroll-animate">
                  <h2
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-6 md:mb-8 px-4"
                    style={{ fontFamily: "'Fredoka One', 'Nunito', 'Patrick Hand', 'Kalam', 'Comic Sans MS', cursive" }}
                  >
                    治愈故事时光
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed px-4">每一个故事都是一束温暖的光，照亮心灵的角落</p>
                </div>

                <div className="max-w-5xl mx-auto relative">
                  <div
                    className={`p-12 bg-gradient-to-br ${stories[currentStory].color} backdrop-blur-xl border border-white/50 min-h-[400px] relative overflow-hidden scroll-animate`}
                    style={{
                      borderRadius: "60% 40% 40% 60% / 50% 60% 40% 50%",
                      boxShadow: "0 25px 50px rgba(34, 197, 94, 0.1)",
                    }}
                  >
                    <div className="relative z-10">
                      <div className="text-center mb-10">
                        <span
                          className="inline-block px-6 py-3 bg-gradient-to-r from-white/50 to-white/30 backdrop-blur-sm text-gray-700 font-bold mb-6 hover:scale-105 transition-transform duration-300"
                          style={{ borderRadius: "20px" }}
                        >
                          {stories[currentStory].category}
                        </span>
                        <h3 className="text-4xl font-bold text-gray-800 mb-8">{stories[currentStory].title}</h3>
                      </div>
                      <p className="text-xl text-gray-700 leading-relaxed text-center max-w-4xl mx-auto">
                        {stories[currentStory].content}
                      </p>
                    </div>

                    <div className="absolute top-8 left-8 animate-float" style={{ animationDuration: "6s" }}>
                      <CuteBird className="w-12 h-12 text-white/40" />
                    </div>
                    <div
                      className="absolute bottom-8 right-8 animate-float"
                      style={{ animationDuration: "6s", animationDelay: "3s" }}
                    >
                      <CuteCat className="w-12 h-12 text-white/40" />
                    </div>
                  </div>

                  <div className="flex justify-center items-center mt-12 space-x-12">
                    <button
                      onClick={() => setCurrentStory((prev) => (prev > 0 ? prev - 1 : stories.length - 1))}
                      className="group p-6 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-115 hover:-rotate-10 active:scale-90"
                      style={{ borderRadius: "50% 30% 50% 30%" }}
                    >
                      <ChevronLeft className="w-8 h-8" />
                    </button>

                    <div className="flex space-x-4">
                      {stories.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentStory(index)}
                          className={`w-4 h-4 transition-all duration-300 hover:scale-150 ${
                            index === currentStory
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg scale-130"
                              : "bg-gray-300 hover:bg-gray-400"
                          }`}
                          style={{
                            borderRadius: "50%",
                            boxShadow: index === currentStory ? "0 0 20px rgba(147, 51, 234, 0.5)" : "none",
                          }}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setCurrentStory((prev) => (prev < stories.length - 1 ? prev + 1 : 0))}
                      className="group p-6 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-115 hover:rotate-10 active:scale-90"
                      style={{ borderRadius: "30% 50% 30% 50%" }}
                    >
                      <ChevronRight className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 🎵 治愈音乐角落 */}
            <section id="music" className="py-16 md:py-24 relative">
              <div className="container mx-auto px-4 md:px-8">
                <div className="text-center mb-16 md:mb-20 scroll-animate">
                  <h2
                    className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent mb-6 md:mb-8 px-4"
                    style={{ fontFamily: "'Fredoka One', 'Nunito', 'Patrick Hand', 'Kalam', 'Comic Sans MS', cursive" }}
                  >
                    治愈音乐角落
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed px-4">让音乐的旋律抚慰疲惫的心灵</p>
                </div>

                <div
                  className="max-w-2xl md:max-w-3xl mx-auto p-8 md:p-12 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl border border-white/40 relative overflow-hidden scroll-animate"
                  style={{
                    borderRadius: "40% 60% 60% 40% / 30% 70% 30% 70%",
                    boxShadow: "0 25px 50px rgba(234, 88, 12, 0.1)",
                  }}
                >
                  <div className="text-center mb-10">
                    <h3 className="text-3xl font-bold text-gray-800 mb-3">夜空中最亮的星</h3>
                    <p className="text-xl text-gray-600">治愈系轻音乐 · 心灵疗愈</p>
                  </div>

                  <div className="flex items-center justify-center mb-12">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="group relative p-8 bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-115 active:scale-90"
                      style={{ borderRadius: "50% 40% 50% 40%" }}
                    >
                      {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}

                      {isPlaying && (
                        <div
                          className="absolute inset-0 bg-white/20 animate-pulse-slow"
                          style={{ borderRadius: "inherit" }}
                        />
                      )}
                    </button>
                  </div>

                  <div className="flex items-end justify-center space-x-2 mb-10 h-20">
                    {[...Array(20)].map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 bg-gradient-to-t from-orange-300 via-red-300 to-pink-300 transition-all duration-300 ${isPlaying ? "animate-music-bar" : ""}`}
                        style={{
                          borderRadius: "2px",
                          height: isPlaying ? `${Math.random() * 50 + 15}px` : "8px",
                          opacity: isPlaying ? 1 : 0.3,
                          animationDelay: `${index * 0.05}s`,
                          animationDuration: `${0.6 + Math.random() * 0.4}s`,
                        }}
                      />
                    ))}
                  </div>

                  <div className="relative mb-8">
                    <div
                      className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 overflow-hidden"
                      style={{ borderRadius: "15px" }}
                    >
                      <div
                        className={`h-full bg-gradient-to-r from-orange-300 to-red-300 relative transition-all duration-300 ${isPlaying ? "animate-progress" : ""}`}
                        style={{
                          borderRadius: "15px",
                          width: isPlaying ? "100%" : "0%",
                          transitionDuration: "180s",
                          transitionTimingFunction: "linear",
                        }}
                      >
                        <div
                          className={`absolute right-0 top-0 w-4 h-4 bg-white shadow-lg transform -translate-y-0.5 rounded-full ${isPlaying ? "animate-pulse-slow" : ""}`}
                        />
                      </div>
                    </div>
                    <div className="flex justify-between text-lg text-gray-500 mt-3">
                      <span>0:00</span>
                      <span>3:00</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-4">
                    <Volume2 className="w-6 h-6 text-gray-500" />
                    <div className="w-32 h-2 bg-gray-200" style={{ borderRadius: "10px" }}>
                      <div
                        className="w-3/4 h-full bg-gradient-to-r from-orange-300 to-red-300"
                        style={{ borderRadius: "10px" }}
                      ></div>
                    </div>
                  </div>

                  <div className="absolute top-6 right-6 animate-rotate" style={{ animationDuration: "15s" }}>
                    <CuteBird className="w-10 h-10 text-orange-400/40" />
                  </div>
                  <div className="absolute bottom-6 left-6 animate-pulse-slow" style={{ animationDuration: "3s" }}>
                    <CuteCat className="w-10 h-10 text-pink-400/40" />
                  </div>
                </div>
              </div>
            </section>

            {/* 🤖 AI心灵对话 */}
            <section className="py-24 relative">
              <div className="container mx-auto px-8">
                <div className="text-center mb-20 scroll-animate">
                  <h2
                    className="text-5xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8"
                    style={{ fontFamily: "'Fredoka One', 'Nunito', 'Patrick Hand', 'Kalam', 'Comic Sans MS', cursive" }}
                  >
                    AI心灵对话
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">与智能心理助理分享你的心声，获得温暖的陪伴</p>
                </div>

                <div className="max-w-5xl mx-auto">
                  <div
                    className="p-10 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl border border-white/40 min-h-[600px] flex flex-col relative overflow-hidden scroll-animate"
                    style={{
                      borderRadius: "30px 30px 30px 30px",
                      boxShadow: "0 25px 50px rgba(99, 102, 241, 0.1)",
                    }}
                  >
                    <div className="flex items-center mb-8 relative">
                      <div
                        className="w-20 h-20 bg-gradient-to-br from-indigo-300 via-purple-300 to-pink-300 flex items-center justify-center mr-6 relative overflow-hidden hover:scale-110 hover:rotate-5 transition-transform duration-300"
                        style={{ borderRadius: "25px" }}
                      >
                        <MessageCircle className="w-10 h-10 text-white" />

                        <div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-rotate"
                          style={{ borderRadius: "inherit", animationDuration: "8s" }}
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">心灵伙伴小天使</h3>
                        <p className="text-lg text-gray-600">随时为你提供温暖的陪伴与倾听</p>
                        <div
                          className="flex items-center space-x-2 mt-2 animate-pulse-slow"
                          style={{ animationDuration: "2s" }}
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-green-600 font-medium">在线中</span>
                        </div>
                      </div>

                      <div
                        className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-2 border-white/50 hover:scale-105 hover:rotate-3 transition-transform duration-300 overflow-hidden"
                        style={{ borderRadius: "20px" }}
                      >
                        <img 
                          src="/lain.jpg" 
                          alt="Lain Avatar" 
                          className="w-full h-full object-cover object-center"
                          style={{ 
                            objectPosition: "center 30%"  // 调整位置确保脸部居中显示
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex-1 space-y-6 mb-8 max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                      {chatMessages.map((message, index) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isAI ? "justify-start" : "justify-end"} animate-fadeIn`}
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div
                            className={`max-w-md lg:max-w-lg px-6 py-4 relative hover:scale-102 hover:-translate-y-1 transition-transform duration-300 ${
                              message.isAI
                                ? "bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-gray-800 border border-indigo-200/50"
                                : "bg-gradient-to-br from-purple-300 via-pink-300 to-indigo-300 text-white"
                            }`}
                            style={{
                              borderRadius: message.isAI ? "25px 25px 25px 8px" : "25px 25px 8px 25px",
                            }}
                          >
                            {/* 显示消息内容或加载动画 */}
                            {(message as any).isLoading ? (
                              <div className="flex items-center space-x-4 py-2">
                                <div className="flex space-x-1 chat-loading-dots">
                                  <div className="w-2 h-2 bg-indigo-400 rounded-full dot-1"></div>
                                  <div className="w-2 h-2 bg-purple-400 rounded-full dot-2"></div>
                                  <div className="w-2 h-2 bg-pink-400 rounded-full dot-3"></div>
                                </div>
                                <span className="text-sm text-gray-500 animate-pulse">AI正在思考中...</span>
                              </div>
                            ) : (
                              <p className="text-base leading-relaxed">{message.text}</p>
                            )}

                            {message.isAI && (
                              <div
                                className="absolute top-2 right-2 animate-rotate"
                                style={{ animationDuration: "10s" }}
                              >
                                <CuteBunny className="w-4 h-4 text-indigo-400/50" />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {/* 滚动到底部的目标元素 */}
                      <div ref={chatMessagesEndRef} />
                    </div>

                    <div className="flex space-x-4 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder="分享你的心声，我会用心倾听..."
                        className="flex-1 px-6 py-4 bg-white/60 backdrop-blur-sm border border-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 placeholder-gray-500 text-lg focus:scale-102 transition-transform duration-300"
                        style={{ borderRadius: "20px" }}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-8 py-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-108 hover:-translate-y-1 active:scale-95 relative overflow-hidden"
                        style={{ borderRadius: "20px" }}
                      >
                        <div className="flex items-center space-x-2 relative z-10">
                          <Send className="w-6 h-6" />
                          <span className="font-semibold">发送</span>
                        </div>

                        <div
                          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-flow"
                          style={{ borderRadius: "inherit" }}
                        />
                      </button>
                    </div>

                    <div className="absolute top-8 right-8 animate-rotate" style={{ animationDuration: "12s" }}>
                      <CuteCat className="w-8 h-8 text-pink-400/20" />
                    </div>
                    <div
                      className="absolute bottom-8 left-8 animate-rotate"
                      style={{ animationDuration: "15s", animationDirection: "reverse" }}
                    >
                      <CuteBird className="w-6 h-6 text-yellow-400/20" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 💭 内心留言区（心愿树便签墙） */}
            <section className="py-24 relative">
              <div className="container mx-auto px-8">
                <div className="text-center mb-20 scroll-animate">
                  <h2
                    className="text-5xl font-bold bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent mb-8"
                    style={{ fontFamily: "'Fredoka One', 'Nunito', 'Patrick Hand', 'Kalam', 'Comic Sans MS', cursive" }}
                  >
                    内心留言区
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    表达你的小困扰、小心情、匿名秘密...
                    <br />
                    <span className="text-lg text-teal-500 font-medium">
                      在这棵温暖的心愿树下，每一份心声都会被温柔对待
                    </span>
                  </p>
                </div>

                {/* 左右布局：心愿树 + 心情便签输入 */}
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
                  {/* 左侧：心愿树留言墙 */}
                  <div className="relative">
                    <div
                      className="relative min-h-[700px] bg-gradient-to-br from-teal-100 via-cyan-50 to-blue-50 p-8 scroll-animate overflow-hidden"
                      style={{
                        borderRadius: "40px",
                        boxShadow: "0 30px 60px rgba(20, 184, 166, 0.1)",
                      }}
                    >
                      {/* 飘落的雪花 */}
                      {isClient && [...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute text-white/60 animate-float pointer-events-none"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${6 + Math.random() * 3}s`,
                            fontSize: `${12 + Math.random() * 8}px`,
                          }}
                        >
                          ❄
                        </div>
                      ))}

                      {/* 留言树主体 */}
                      <div className="relative flex flex-col items-center pt-8">
                        {/* 留言树图片 - 放大30% */}
                        <div className="relative mb-2">
                          <img 
                            src="/tree.png" 
                            alt="留言树" 
                            className="w-[624px] h-[749px] object-contain"
                            style={{ filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.3))' }}
                          />
                          
                          {/* 在树上放置便签纸留言 - 调整位置稍微靠近树 */}
                          {innerMessages.slice(0, 8).map((message, messageIndex) => {
                            // 调整位置，稍微靠近树一点
                            const positions = [
                              { left: 30, top: 15 }, // 上层左侧
                              { left: 62, top: 18 }, // 上层右侧
                              { left: 25, top: 25 }, // 中上层左侧
                              { left: 68, top: 28 }, // 中上层右侧
                              { left: 22, top: 38 }, // 中层左侧
                              { left: 72, top: 40 }, // 中层右侧
                              { left: 32, top: 52 }, // 下层左侧
                              { left: 60, top: 55 }  // 下层右侧
                            ]
                            
                            const position = positions[messageIndex] || positions[0]
                            
                            return (
                              <div
                                key={message.id}
                                className={`absolute cursor-pointer transform hover:scale-110 hover:rotate-2 hover:-translate-y-2 transition-all duration-300 ${hugAnimation === message.id ? "animate-bounce" : ""}`}
                                style={{
                                  left: `${position.left}%`,
                                  top: `${position.top}%`,
                                  transform: `rotate(${-3 + Math.random() * 6}deg)`,
                                  zIndex: 20
                                }}
                                onClick={() => setSelectedMessage(message)}
                              >
                                <div
                                  className={`w-20 h-20 bg-gradient-to-br ${message.color} p-2 shadow-lg border border-white/50 relative overflow-hidden hover:shadow-xl`}
                                  style={{
                                    borderRadius: "8px",
                                    transform: "perspective(100px) rotateX(5deg)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                                  }}
                                >
                                  <p className="text-xs text-gray-700 font-medium leading-tight">
                                    {message.text.length > 15 ? `${message.text.substring(0, 15)}...` : message.text}
                                  </p>

                                  {/* 便签纸纹理 */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                                  {/* 拥抱数量 */}
                                  <div className="absolute bottom-1 right-1 flex items-center space-x-1">
                                    <span className="text-xs text-pink-500">🤗</span>
                                    <span className="text-xs text-gray-600 font-bold">{message.hugs}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* 增加更多可爱动物装饰 */}
                      <div className="absolute bottom-8 left-12 animate-float" style={{ animationDuration: "5s" }}>
                        <CuteBunny className="w-12 h-12 text-orange-400" />
                      </div>
                      <div className="absolute bottom-12 right-16 animate-float" style={{ animationDuration: "4s", animationDelay: "2s" }}>
                        <CuteFox className="w-10 h-10 text-amber-500" />
                      </div>
                      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 animate-float" style={{ animationDuration: "6s", animationDelay: "1s" }}>
                        <CuteCat className="w-8 h-8 text-teal-400" />
                      </div>
                      <div className="absolute top-20 left-8 animate-float" style={{ animationDuration: "7s", animationDelay: "3s" }}>
                        <CuteBird className="w-10 h-10 text-pink-400" />
                      </div>
                      <div className="absolute top-32 right-12 animate-float" style={{ animationDuration: "5s", animationDelay: "1.5s" }}>
                        <CuteBunny className="w-8 h-8 text-purple-400" />
                      </div>
                      <div className="absolute top-48 left-20 animate-float" style={{ animationDuration: "8s", animationDelay: "0.5s" }}>
                        <CuteFox className="w-9 h-9 text-green-400" />
                      </div>
                      <div className="absolute bottom-32 right-8 animate-float" style={{ animationDuration: "6s", animationDelay: "2.5s" }}>
                        <CuteCat className="w-11 h-11 text-blue-400" />
                      </div>
                      <div className="absolute top-64 right-20 animate-float" style={{ animationDuration: "4.5s", animationDelay: "3.5s" }}>
                        <CuteBird className="w-9 h-9 text-yellow-400" />
                      </div>
                    </div>

                    {/* 查看全部便签按钮 */}
                    <div className="absolute top-6 right-6">
                      <button
                        onClick={() => setShowAllMessages(true)}
                        className="px-6 py-3 bg-gradient-to-r from-teal-300 to-cyan-300 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{ borderRadius: "20px" }}
                      >
                        <div className="flex items-center space-x-2">
                          <Eye className="w-5 h-5" />
                          <span>展开全部</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 右侧：心情便签输入区 */}
                  <div className="space-y-8">
                    {/* 输入区域 */}
                    <div
                      className="p-8 bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-xl border border-white/50 relative overflow-hidden scroll-animate"
                      style={{
                        borderRadius: "30px",
                        boxShadow: "0 20px 40px rgba(20, 184, 166, 0.1)",
                      }}
                    >
                      <div className="relative z-10">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center space-x-3">
                          <CuteBird className="w-8 h-8 text-teal-500" />
                          <span>写下你的心情便签</span>
                          <CuteCat className="w-8 h-8 text-cyan-500" />
                        </h3>

                        <textarea
                          value={newInnerMessage}
                          onChange={(e) => setNewInnerMessage(e.target.value)}
                          placeholder="分享你的小困扰、小心情、匿名秘密..."
                          className="w-full h-40 p-6 bg-white/70 backdrop-blur-sm border border-white/60 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700 placeholder-gray-500 text-lg leading-relaxed"
                          style={{ borderRadius: "20px" }}
                        />

                        <button
                          onClick={handleInnerMessageSubmit}
                          className="mt-6 w-full px-8 py-4 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 active:scale-95"
                          style={{ borderRadius: "25px" }}
                        >
                          <div className="flex items-center justify-center space-x-3">
                            <MessageCircle className="w-6 h-6" />
                            <span>挂到心愿树上</span>
                            <span className="text-xl">🌲</span>
                          </div>
                        </button>
                      </div>

                      {/* 装饰动物 */}
                      <div className="absolute top-4 right-6 animate-rotate" style={{ animationDuration: "12s" }}>
                        <CuteFox className="w-8 h-8 text-teal-400/40" />
                      </div>
                    </div>

                    {/* 最近的便签预览 */}
                    <div
                      className="p-6 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl border border-white/40 relative overflow-hidden scroll-animate"
                      style={{
                        borderRadius: "25px",
                        boxShadow: "0 15px 30px rgba(20, 184, 166, 0.08)",
                      }}
                    >
                      <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center space-x-2">
                        <span className="text-xl">✨</span>
                        <span>最近的心声</span>
                      </h4>

                      <div className="space-y-3">
                        {innerMessages
                          .slice(-3)
                          .reverse()
                          .map((message, index) => (
                            <div
                              key={message.id}
                              className={`p-4 bg-gradient-to-r ${message.color} border border-white/50 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-102`}
                              style={{ borderRadius: "15px" }}
                              onClick={() => setSelectedMessage(message)}
                            >
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {message.text.length > 50 ? `${message.text.substring(0, 50)}...` : message.text}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-gray-600">— {message.author}</span>
                                <div className="flex items-center space-x-1 text-pink-500">
                                  <span className="text-xs">🤗</span>
                                  <span className="text-xs font-semibold">{message.hugs}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 便签墙弹窗 */}
                {showAllMessages && (
                  <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                    onClick={() => setShowAllMessages(false)}
                  >
                    <div
                      className="w-full max-w-7xl h-[90vh] bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl border border-white/60 relative overflow-hidden animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        borderRadius: "30px",
                        boxShadow: "0 30px 60px rgba(20, 184, 166, 0.2)",
                      }}
                    >
                      {/* 弹窗头部 */}
                      <div className="flex items-center justify-between p-8 border-b border-white/30">
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl">📝</span>
                          <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
                            心情便签墙
                          </h3>
                          <span className="text-3xl">💕</span>
                        </div>
                        <button
                          onClick={() => setShowAllMessages(false)}
                          className="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 text-white font-bold text-xl hover:from-gray-400 hover:to-gray-500 transition-all duration-300 hover:scale-110 active:scale-95"
                          style={{ borderRadius: "50%" }}
                        >
                          ×
                        </button>
                      </div>

                      {/* 便签墙内容 */}
                      <div className="p-8 h-full overflow-y-auto custom-scrollbar">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                          {innerMessages.map((message, index) => (
                            <div
                              key={message.id}
                              className={`p-4 bg-gradient-to-br ${message.color} border border-white/50 hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-110 hover:-translate-y-2 animate-fadeIn`}
                              style={{
                                borderRadius: "15px",
                                transform: `rotate(${Math.random() * 8 - 4}deg)`,
                                animationDelay: `${index * 50}ms`,
                                minHeight: "120px",
                              }}
                              onClick={() => setSelectedMessage(message)}
                            >
                              <p className="text-sm text-gray-800 leading-relaxed mb-3 font-medium">
                                {message.text.length > 60 ? `${message.text.substring(0, 60)}...` : message.text}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-600 font-medium">— {message.author}</span>
                                <div className="flex items-center space-x-1 text-pink-500">
                                  <span className="text-sm">🤗</span>
                                  <span className="text-sm font-bold">{message.hugs}</span>
                                </div>
                              </div>

                              {/* 便签纸效果 */}
                              <div
                                className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none"
                                style={{ borderRadius: "inherit" }}
                              />

                              {/* 便签纸阴影 */}
                              <div
                                className="absolute inset-0 shadow-lg opacity-0 hover:opacity-100 transition-opacity duration-300"
                                style={{ borderRadius: "inherit" }}
                              />
                            </div>
                          ))}
                        </div>

                        {/* 如果没有便签 */}
                        {innerMessages.length === 0 && (
                          <div className="text-center py-20">
                            <CuteBunny className="w-20 h-20 mx-auto mb-6 text-gray-400" />
                            <p className="text-xl text-gray-500">还没有心情便签，快来写下第一个吧！</p>
                          </div>
                        )}
                      </div>

                      {/* 装饰元素 */}
                      <div className="absolute top-20 right-20 animate-float" style={{ animationDuration: "4s" }}>
                        <CuteBird className="w-12 h-12 text-teal-400/30" />
                      </div>
                      <div
                        className="absolute bottom-20 left-20 animate-float"
                        style={{ animationDuration: "5s", animationDelay: "2s" }}
                      >
                        <CuteFox className="w-10 h-10 text-cyan-400/30" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 留言详情弹窗 */}
                {selectedMessage && (
                  <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-8"
                    onClick={() => setSelectedMessage(null)}
                  >
                    <div
                      className="max-w-2xl w-full p-10 bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl border border-white/60 relative overflow-hidden animate-fadeIn"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        borderRadius: "30px",
                        boxShadow: "0 30px 60px rgba(20, 184, 166, 0.15)",
                      }}
                    >
                      {/* 便签纸样式的消息内容 */}
                      <div
                        className={`p-8 bg-gradient-to-br ${selectedMessage.color} mb-8 relative overflow-hidden`}
                        style={{
                          borderRadius: "15px",
                          transform: "rotate(-1deg)",
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        }}
                      >
                        <p className="text-xl text-gray-800 leading-relaxed font-medium">{selectedMessage.text}</p>
                        <div className="mt-4 text-right">
                          <span className="text-sm text-gray-600 font-medium">— {selectedMessage.author}</span>
                        </div>

                        {/* 便签纸纹理 */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                      </div>

                      {/* 互动按钮 */}
                      <div className="flex justify-center space-x-6 mb-8">
                        <button
                          onClick={() => handleSendHug(selectedMessage.id)}
                          className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-pink-300 to-rose-300 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95"
                          style={{ borderRadius: "25px" }}
                        >
                          <span className="text-2xl">🤗</span>
                          <span>送拥抱</span>
                          <span className="bg-white/30 px-3 py-1 rounded-full text-sm">{selectedMessage.hugs}</span>
                        </button>
                      </div>

                      {/* 回复区域 */}
                      <div className="space-y-4 mb-6">
                        <h4 className="text-lg font-bold text-gray-800 flex items-center space-x-2">
                          <CuteCat className="w-6 h-6 text-teal-500" />
                          <span>温暖回应</span>
                        </h4>

                        {selectedMessage.replies.map((reply: any) => (
                          <div
                            key={reply.id}
                            className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200/50"
                            style={{ borderRadius: "15px" }}
                          >
                            <p className="text-gray-700 mb-2">{reply.text}</p>
                            <span className="text-sm text-teal-600 font-medium">— {reply.author}</span>
                          </div>
                        ))}
                      </div>

                      {/* 回复输入 */}
                      <div className="flex space-x-4">
                        <input
                          type="text"
                          value={newReply}
                          onChange={(e) => setNewReply(e.target.value)}
                          placeholder="写一句温暖的回应..."
                          className="flex-1 px-6 py-3 bg-white/70 backdrop-blur-sm border border-white/60 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700 placeholder-gray-500"
                          style={{ borderRadius: "20px" }}
                          onKeyPress={(e) => e.key === "Enter" && handleReplySubmit(selectedMessage.id)}
                        />
                        <button
                          onClick={() => handleReplySubmit(selectedMessage.id)}
                          className="px-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-400 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                          style={{ borderRadius: "20px" }}
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>

                      {/* 装饰动物 */}
                      <div className="absolute top-6 right-6 animate-float" style={{ animationDuration: "4s" }}>
                        <CuteFox className="w-8 h-8 text-teal-400/40" />
                      </div>
                      <div
                        className="absolute bottom-6 left-6 animate-float"
                        style={{ animationDuration: "4s", animationDelay: "2s" }}
                      >
                        <CuteBunny className="w-8 h-8 text-cyan-400/40" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* 😊 心情选择区 */}
            <section className="py-24 relative">
              <div className="container mx-auto px-8">
                <div className="text-center mb-20 scroll-animate">
                  <h2
                    className="text-5xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 bg-clip-text text-transparent mb-8"
                    style={{ fontFamily: "'Fredoka One', 'Nunito', 'Patrick Hand', 'Kalam', 'Comic Sans MS', cursive" }}
                  >
                    心情选择区
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    选择一个你今天的心情，让小天使为你记录
                    <br />
                    <span className="text-lg text-orange-500 font-medium">每一种心情都值得被温柔对待</span>
                  </p>
                </div>

                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-8">
                  {moods.map((mood, index) => (
                    <button
                      key={mood.name}
                      className={`group relative p-6 bg-gradient-to-br ${mood.color} backdrop-blur-xl border border-white/40 hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden scroll-animate hover:scale-105 hover:-translate-y-1`}
                      style={{
                        borderRadius: "25px",
                        boxShadow: "0 15px 35px rgba(251, 146, 60, 0.08)",
                        transitionDelay: `${index * 100}ms`,
                      }}
                      onClick={() => handleMoodSelect(mood.name)}
                    >
                      <div className="relative z-10 text-center">
                        <mood.animal className="w-12 h-12 mx-auto mb-4 text-white/80" />
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-white">{mood.name}</h3>
                      </div>

                      <div
                        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{ borderRadius: "inherit" }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 🦶 页脚区域 */}
            <footer className="py-20 relative overflow-hidden">
              <div className="container mx-auto px-8 text-center relative z-10">
                <div className="scroll-animate">
                  <div className="flex items-center justify-center space-x-6 mb-8 hover:scale-105 transition-transform duration-300">
                    <div className="animate-float" style={{ animationDuration: "4s" }}>
                      <CuteBunny className="w-12 h-12 text-pink-500" />
                    </div>
                    <h3 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                      Angelzhengjy的心灵驿站
                    </h3>
                    <div className="animate-float" style={{ animationDuration: "4s", animationDelay: "2s" }}>
                      <CuteFox className="w-12 h-12 text-purple-500" />
                    </div>
                  </div>

                  <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                    愿每一个来到这里的心灵都能找到属于自己的温暖与宁静
                    <br />
                    在这个充满爱与希望的空间里，我们一起成长，一起治愈
                    <br />
                    <span className="text-lg text-purple-500 font-medium">让美好的故事在心中永远闪耀 ✨</span>
                  </p>

                  <div className="flex justify-center space-x-6 mb-12">
                    {[
                      { Icon: Heart, color: "from-pink-300 to-rose-300", Animal: CuteBunny },
                      { Icon: Star, color: "from-yellow-300 to-orange-300", Animal: CuteBird },
                      { Icon: Music, color: "from-purple-300 to-indigo-300", Animal: CuteCat },
                      { Icon: MessageCircle, color: "from-blue-300 to-cyan-300", Animal: CuteFox },
                      { Icon: Sparkles, color: "from-green-300 to-emerald-300", Animal: CuteBunny },
                    ].map(({ Icon, color, Animal }, index) => (
                      <div
                        key={index}
                        className={`p-4 bg-gradient-to-r ${color} text-white shadow-lg relative overflow-hidden hover:scale-130 hover:rotate-15 hover:-translate-y-2 active:scale-90 transition-all duration-500 cursor-pointer`}
                        style={{ borderRadius: "40% 60% 60% 40%" }}
                      >
                        <Icon className="w-8 h-8 relative z-10" />
                        <div
                          className="absolute top-1 right-1 animate-pulse-slow"
                          style={{ animationDelay: `${index * 0.3}s`, animationDuration: "2s" }}
                        >
                          <Animal className="w-3 h-3 text-white/60" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-gray-500 text-lg animate-pulse-slow" style={{ animationDuration: "3s" }}>
                    © 2024 Angelzhengjy的心灵驿站. Made with 💖 for healing souls.
                  </p>
                </div>
              </div>

              <div
                className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-pink-200/20 to-purple-200/20 rounded-full blur-2xl animate-float"
                style={{ animationDuration: "8s" }}
              />
              <div
                className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 rounded-full blur-xl animate-float"
                style={{ animationDuration: "6s", animationDelay: "1s" }}
              />
            </footer>

            {/* ✨ 心情打卡鼓励弹窗 */}
            {encouragementShown && (
              <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-xl p-10 shadow-2xl border border-white/50 relative overflow-hidden animate-fadeIn"
                style={{
                  borderRadius: "50% 50% 50% 50% / 30% 30% 70% 70%",
                  boxShadow: "0 30px 60px rgba(168, 85, 247, 0.2)",
                }}
              >
                <div className="text-center relative z-10">
                  <div className="animate-rotate" style={{ animationDuration: "2s" }}>
                    <Star className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">心情已记录</h3>
                  <p className="text-xl text-gray-600">
                    {encouragements[Math.floor(Math.random() * encouragements.length)]}
                  </p>
                </div>

                <div className="absolute top-4 right-4 animate-float" style={{ animationDuration: "3s" }}>
                  <CuteBunny className="w-8 h-8 text-pink-400/40" />
                </div>
                <div
                  className="absolute bottom-4 left-4 animate-float"
                  style={{ animationDuration: "3s", animationDelay: "1.5s" }}
                >
                  <CuteCat className="w-8 h-8 text-purple-400/40" />
                </div>
              </div>
            )}
          </div>

          {/* 🎨 自定义滚动条样式 */}
          <style jsx global>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #f472b6, #a855f7);
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: linear-gradient(to bottom, #ec4899, #9333ea);
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

