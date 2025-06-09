"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { skiingGameApi, type GameScore, type GameStats } from '../../lib/api'


// 游戏常量
const GAME_CONSTANTS = {
  CANVAS_WIDTH: 800,
  CANVAS_HEIGHT: 400,
  SLOPE_ANGLE: 15,
  MOVEMENT_SPEED: 1.5,
  TREE_GENERATION_INTERVAL: 120,
  GRAVITY: 0.2,
  PLAYER_WIDTH: 32,
  PLAYER_HEIGHT: 32,
  OBSTACLE_WIDTH: 32,
  OBSTACLE_HEIGHT: 48
}

const COLORS = {
  sky: '#ffffff',
  snow: '#ffffff',
  skiTrail: '#e6f2ff'
}

const IMAGES = {
  PLAYER: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/snowboarder-d8ooGdTTeqCc73t5hfW0TPLcqBEcmx.png",
  TREES: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tree_0-IiABkoy1TJgd2IK76dMoZKcBoSM3OV.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tree_1-PQuEzy4tGxrfIvvsOKN1x30qB7LxAZ.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tree_2-3emosJCVNsMc6SFLYBDexLwAjvMMcc.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tree_3-tCJCvnL001vtrqLkK4TxBhvwDljBAz.png"
  ],
  SNOWMEN: [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_0-TCuDVs2e6275EeFLJgVZT2gG6xR8eW.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_1-1XU0CXxXygx3Tf6eGfSJhMcrv96ElE.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_2-5TfN4Fu4Jr2F9t91GlSdbqPFfPvupL.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_3-Lj63E3FyGim1kfm3G50zhSwi6zylMe.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_4-V6HRnct6cFbhVyfOx74b7CwzyGJ3la.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snowman_5-m2NUZb2dgzRCPibAWx09MzpzNxYmLB.png"
  ]
}

const FONTS = {
  PIXEL: "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
}

interface Obstacle {
  x: number
  y: number
  sprite: HTMLImageElement
}

interface Player {
  x: number
  y: number
  velocityY: number
  isMovingUp: boolean
  sprite: HTMLImageElement | null
}

interface TrailPoint {
  x: number
  y: number
}

// 温馨提醒弹窗组件（可选显示）
function WelcomeModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-md mx-4 p-8 bg-white/95 backdrop-blur-xl rounded-3xl border-3 border-[#d4a5a0]/60 shadow-2xl animate-bounce-in">
        {/* 装饰性元素 */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full border-2 border-white"></div>
        <div className="absolute -bottom-4 left-1/4 w-6 h-6 bg-gradient-to-r from-[#b8c4a8] to-[#e5c8c5] rounded-full border-2 border-white"></div>
        <div className="absolute -bottom-4 right-1/4 w-6 h-6 bg-gradient-to-r from-[#c8b8d5] to-[#d4a5a0] rounded-full border-2 border-white"></div>
        
        <div className="text-center space-y-6">
          <div className="text-4xl mb-4">🌙✨</div>
          <h2 className="text-2xl font-bold text-[#a89688] font-serif">温馨提醒</h2>
          <p className="text-lg text-[#9a8d7d] leading-relaxed font-serif">
            早点睡觉，不要熬夜了，<br/>
            不生气了呢。💫
          </p>
          <p className="text-sm text-[#9a8d7d]/80 font-serif">
            愿你有个甜美的梦境 🌸
          </p>
          
          <button
            onClick={onClose}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#d4a5a0] via-[#c8b8d5] to-[#b8c4a8] text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl border-none font-serif"
          >
            知道了，开始游戏 🎿
          </button>
        </div>
      </div>
    </div>
  )
}

function SnowBored() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [score, setScore] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [showWelcomeModal, setShowWelcomeModal] = useState(false) // 默认不显示弹窗
  const [isInitialized, setIsInitialized] = useState(false)
  
  // API相关状态
  const [leaderboard, setLeaderboard] = useState<GameScore[]>([])
  const [gameStats, setGameStats] = useState<GameStats | null>(null)
  const [playerName, setPlayerName] = useState('')
  const [showScoreSubmit, setShowScoreSubmit] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  
  // 直接使用API，不用useApiAction（因为它有使用方式问题）
  const [submittingScore, setSubmittingScore] = useState(false)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)
  
  // 动态游戏尺寸状态
  const [gameSize, setGameSize] = useState({
    width: 800,
    height: 400,
    scale: 1
  })
  
  // 存储已加载的精灵
  const spritesRef = useRef<{
    treeSprites: HTMLImageElement[]
    snowmanSprites: HTMLImageElement[]
    getRandomObstacleSprite: () => HTMLImageElement
  } | null>(null)
  
  // 游戏常量 - 稳定的速度设置
  const getDynamicConstants = useCallback(() => {
    const scale = gameSize.scale
    return {
      CANVAS_WIDTH: gameSize.width,
      CANVAS_HEIGHT: gameSize.height,
      SLOPE_ANGLE: 15,
      MOVEMENT_SPEED: 2.0 * scale, // 增加基础速度，让游戏更有动感
      TREE_GENERATION_INTERVAL: 80, // 固定间隔，不再基于scale动态变化
      GRAVITY: 0.15 * scale, // 略减重力，让控制更平滑
      PLAYER_WIDTH: Math.floor(32 * scale),
      PLAYER_HEIGHT: Math.floor(32 * scale),
      OBSTACLE_WIDTH: Math.floor(32 * scale),
      OBSTACLE_HEIGHT: Math.floor(48 * scale)
    }
  }, [gameSize])
  
  const gameStateRef = useRef({
    player: {
      x: 100,
      y: 200,
      velocityY: 0,
      isMovingUp: false,
      sprite: null as HTMLImageElement | null
    },
    obstacles: [] as Obstacle[],
    trailPoints: [] as TrailPoint[],
    frameCount: 0,
    startTime: Date.now(),
    gameSpeedMultiplier: 1,
    obstacleGenerationInterval: 120,
    lastSpeedIncreaseTime: Date.now(),
    score: 0,
    isGameOver: false,
    lastObstacleGenerationFrame: 0
  })

  // API相关函数
  const loadLeaderboardData = useCallback(async () => {
    setLoadingLeaderboard(true)
    try {
      const response = await skiingGameApi.getLeaderboard(1, 10)
      console.log('API Leaderboard Response:', response) // 调试日志
      if (response && response.success && response.data) {
        setLeaderboard(response.data.leaderboard || [])
      } else {
        console.warn('Invalid API response for leaderboard:', response)
        setLeaderboard([]) // 设置为空数组
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
      setLeaderboard([]) // 设置为空数组
    } finally {
      setLoadingLeaderboard(false)
    }
  }, [])

  const loadGameStats = useCallback(async () => {
    setLoadingStats(true)
    try {
      const response = await skiingGameApi.getStats()
      console.log('API Stats Response:', response) // 调试日志
      if (response && response.success && response.data) {
        setGameStats(response.data)
      } else {
        console.warn('Invalid API response for stats:', response)
        // 设置默认统计数据
        setGameStats({
          totalPlayers: 0,
          totalGames: 0,
          highestScore: 0,
          topPlayer: "暂无数据",
          avgScore: 0,
          avgDuration: 0
        })
      }
    } catch (error) {
      console.error('Failed to load game stats:', error)
      // 设置默认统计数据
      setGameStats({
        totalPlayers: 0,
        totalGames: 0,
        highestScore: 0,
        topPlayer: "暂无数据",
        avgScore: 0,
        avgDuration: 0
      })
    } finally {
      setLoadingStats(false)
    }
  }, [])

  const handleScoreSubmit = useCallback(async () => {
    if (!playerName.trim()) {
      alert('请输入玩家姓名')
      return
    }

    setSubmittingScore(true)
    try {
      // 直接调用API
      const response = await skiingGameApi.submitScore(playerName.trim(), score, gameTime)
      console.log('API Submit Response:', response) // 调试日志
      if (response && response.success) {
        console.log('Score submitted successfully:', response.data)
        setShowScoreSubmit(false)
        // 重新加载排行榜和统计数据
        await loadLeaderboardData()
        await loadGameStats()
        setShowLeaderboard(true)
      } else {
        console.warn('Invalid API response for score submit:', response)
        alert('分数提交失败，请重试')
      }
    } catch (error) {
      console.error('Failed to submit score:', error)
      alert('分数提交失败，请重试')
    } finally {
      setSubmittingScore(false)
    }
  }, [playerName, score, gameTime, loadLeaderboardData, loadGameStats])

  // 计算适合的游戏尺寸
  const calculateGameSize = useCallback(() => {
    if (typeof window === 'undefined') return { width: 800, height: 400, scale: 1 }
    
    const isMobile = window.innerWidth < 768
    const maxWidth = isMobile 
      ? Math.min(window.innerWidth - 16, 600) // 手机上稍小一些
      : Math.min(window.innerWidth - 64, 800)
    
    const maxHeight = isMobile 
      ? Math.min(window.innerHeight * 0.4, 300) // 手机上高度更小
      : Math.min(window.innerHeight * 0.5, 400)
    
    // 保持2:1的宽高比
    const aspectRatio = 2
    let width = maxWidth
    let height = width / aspectRatio
    
    // 如果高度超过最大高度，则以高度为准
    if (height > maxHeight) {
      height = maxHeight
      width = height * aspectRatio
    }
    
    // 确保最小尺寸
    width = Math.max(width, isMobile ? 280 : 400)
    height = Math.max(height, isMobile ? 140 : 200)
    
    const scale = width / 800 // 相对于原始尺寸的缩放比例
    
    return { width: Math.floor(width), height: Math.floor(height), scale }
  }, [])

  // 节流处理窗口尺寸变化
  const handleResize = useCallback(() => {
    const newSize = calculateGameSize()
    setGameSize(newSize)
    
    // 更新游戏状态中的玩家位置，但保持相对位置
    if (gameStateRef.current.player) {
      const relativeY = gameStateRef.current.player.y / gameStateRef.current.player.y || 0.5
      gameStateRef.current.player.y = newSize.height * relativeY
      gameStateRef.current.player.x = 100 * newSize.scale
    }
    
    // 更新障碍物位置比例，但不生成新的障碍物
    if (gameStateRef.current.obstacles.length > 0) {
      gameStateRef.current.obstacles = gameStateRef.current.obstacles.map(obstacle => ({
        ...obstacle,
        y: Math.min(obstacle.y, newSize.height - 100 * newSize.scale)
      }))
    }
    
    // 重置障碍物生成计数器，防止resize触发障碍物生成
    gameStateRef.current.lastObstacleGenerationFrame = gameStateRef.current.frameCount
  }, [calculateGameSize])

  // 监听窗口尺寸变化
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout
    
    const debouncedResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(handleResize, 150) // 防抖处理
    }

    // 初始化尺寸
    handleResize()
    
    window.addEventListener('resize', debouncedResize)
    return () => {
      window.removeEventListener('resize', debouncedResize)
      clearTimeout(resizeTimeout)
    }
  }, [handleResize])

  // 游戏循环初始化函数
  const initGameLoop = useCallback((ctx: CanvasRenderingContext2D) => {
    const constants = getDynamicConstants()

    const drawBackground = () => {
      ctx.fillStyle = COLORS.sky
      ctx.fillRect(0, 0, gameSize.width, gameSize.height)
    }

    const drawPlayer = () => {
      const { player } = gameStateRef.current
      
      if (player.sprite) {
        ctx.save()
        ctx.translate(player.x, player.y)
        
        if (gameStateRef.current.isGameOver) {
          ctx.rotate(-Math.PI / 2)
        }
        
        ctx.drawImage(
          player.sprite,
          -constants.PLAYER_WIDTH / 2,
          -constants.PLAYER_HEIGHT / 2,
          constants.PLAYER_WIDTH,
          constants.PLAYER_HEIGHT
        )
        ctx.restore()
      }
    }

    const drawObstacles = () => {
      gameStateRef.current.obstacles.forEach(obstacle => {
        ctx.drawImage(
          obstacle.sprite,
          obstacle.x - constants.OBSTACLE_WIDTH / 2,
          obstacle.y - constants.OBSTACLE_HEIGHT,
          constants.OBSTACLE_WIDTH,
          constants.OBSTACLE_HEIGHT
        )
      })
    }

    const drawSkiTrail = () => {
      ctx.strokeStyle = COLORS.skiTrail
      ctx.lineWidth = 2 * gameSize.scale
      ctx.beginPath()
      gameStateRef.current.trailPoints.forEach((point, index) => {
        if (index === 0) {
          ctx.moveTo(point.x, point.y)
        } else {
          ctx.lineTo(point.x, point.y)
        }
      })
      ctx.stroke()
    }

    const drawUI = () => {
      const fontSize = Math.max(12, Math.floor(16 * gameSize.scale))
      ctx.fillStyle = '#000000'
      ctx.font = `${fontSize}px "Press Start 2P"`
      
      const scoreText = `Score: ${gameStateRef.current.score}`
      const scoreWidth = ctx.measureText(scoreText).width
      ctx.fillText(scoreText, gameSize.width - scoreWidth - 20 * gameSize.scale, 30 * gameSize.scale)
      
      const currentTime = gameStateRef.current.isGameOver 
        ? gameTime 
        : Math.floor((Date.now() - gameStateRef.current.startTime) / 1000)
      const timeString = new Date(currentTime * 1000).toISOString().substr(14, 5)
      ctx.fillText(timeString, 20 * gameSize.scale, 30 * gameSize.scale)
    }

    const checkCollision = () => {
      const { player, obstacles } = gameStateRef.current
      
      for (let obstacle of obstacles) {
        const dx = Math.abs(player.x - obstacle.x)
        const dy = Math.abs(player.y - obstacle.y)
        
        // 调整碰撞检测，更精确一些
        const hitboxReduction = 0.6 // 进一步减小碰撞箱，让游戏更宽容
        const playerHitboxWidth = constants.PLAYER_WIDTH * hitboxReduction
        const playerHitboxHeight = constants.PLAYER_HEIGHT * hitboxReduction
        const obstacleHitboxWidth = constants.OBSTACLE_WIDTH * hitboxReduction
        const obstacleHitboxHeight = constants.OBSTACLE_HEIGHT * hitboxReduction
        
        if (dx < (playerHitboxWidth + obstacleHitboxWidth) / 4 && 
            dy < (playerHitboxHeight + obstacleHitboxHeight) / 4) {
          return true
        }
      }
      return false
    }

    const updateGame = () => {
      if (gameStateRef.current.isGameOver) return

      const { player, obstacles, trailPoints } = gameStateRef.current
      const constants = getDynamicConstants()
      
      // 简化的速度系统 - 保持恒定的基础速度
      const gameTimeElapsed = Math.floor((Date.now() - gameStateRef.current.startTime) / 1000)
      
      // 每10秒微调增加速度，幅度很小
      const speedIncrement = Math.floor(gameTimeElapsed / 10) * 0.05 // 每10秒增加5%
      gameStateRef.current.gameSpeedMultiplier = Math.min(1.0 + speedIncrement, 1.5) // 最大1.5倍速度

      // 固定的障碍物生成间隔，不再动态调整
      gameStateRef.current.obstacleGenerationInterval = constants.TREE_GENERATION_INTERVAL

      // 玩家移动逻辑 - 使用常量，保持一致性
      if (player.isMovingUp) {
        player.velocityY = Math.max(player.velocityY - constants.GRAVITY * 1.5, -2.0 * gameSize.scale)
      } else {
        player.velocityY = Math.min(player.velocityY + constants.GRAVITY, 2.0 * gameSize.scale)
      }

      player.y += player.velocityY

      // 边界检测
      const minY = 50 * gameSize.scale
      const maxY = gameSize.height - 70 * gameSize.scale
      
      if (player.y < minY) {
        player.y = minY
        player.velocityY = Math.max(0, player.velocityY)
      }
      if (player.y > maxY) {
        player.y = maxY
        player.velocityY = Math.min(0, player.velocityY)
      }

      // 滑雪轨迹
      trailPoints.unshift({ x: player.x, y: player.y + 10 * gameSize.scale })
      if (trailPoints.length > 50) {
        trailPoints.pop()
      }

      // 固定的移动速度 - 不再频繁变化
      const baseMovementSpeed = constants.MOVEMENT_SPEED * gameStateRef.current.gameSpeedMultiplier
      
      // 移动障碍物和轨迹点
      gameStateRef.current.obstacles = obstacles.map(obstacle => ({
        ...obstacle,
        x: obstacle.x - baseMovementSpeed
      })).filter(obstacle => obstacle.x > -100 * gameSize.scale)

      gameStateRef.current.trailPoints = trailPoints.map(point => ({
        ...point,
        x: point.x - baseMovementSpeed
      })).filter(point => point.x > 0)

      // 简化的障碍物生成 - 固定间隔
      const framesSinceLastObstacle = gameStateRef.current.frameCount - gameStateRef.current.lastObstacleGenerationFrame
      if (framesSinceLastObstacle >= gameStateRef.current.obstacleGenerationInterval) {
        if (!gameStateRef.current.isGameOver && gameStateRef.current.frameCount > 60 && spritesRef.current) {
          gameStateRef.current.obstacles.push({
            x: gameSize.width + 50 * gameSize.scale,
            y: Math.random() * (gameSize.height - 150 * gameSize.scale) + 75 * gameSize.scale,
            sprite: spritesRef.current.getRandomObstacleSprite()
          })
          gameStateRef.current.lastObstacleGenerationFrame = gameStateRef.current.frameCount
        }
      }

      // 碰撞检测
      if (checkCollision()) {
        gameStateRef.current.isGameOver = true
        setGameOver(true)
        setGameTime(Math.floor((Date.now() - gameStateRef.current.startTime) / 1000))
        return
      }

      // 简化分数计算
      const currentScore = Math.floor(gameTimeElapsed * 12 + gameStateRef.current.frameCount / 10)
      gameStateRef.current.score = currentScore

      gameStateRef.current.frameCount++
    }

    const gameLoop = (currentTime: number) => {
      if (gameStateRef.current.isGameOver && animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
        return
      }

      // 稳定的帧率控制（可选，用于限制FPS）
      // const deltaTime = currentTime - (gameStateRef.current.lastFrameTime || currentTime)
      // if (deltaTime < 16.67) { // 限制为60FPS
      //   animationFrameRef.current = requestAnimationFrame(gameLoop)
      //   return
      // }
      // gameStateRef.current.lastFrameTime = currentTime

      ctx.clearRect(0, 0, gameSize.width, gameSize.height)
      
      drawBackground()
      drawSkiTrail()
      drawObstacles()
      drawPlayer()
      drawUI()
      
      if (!gameStateRef.current.isGameOver) {
        updateGame()
        setScore(gameStateRef.current.score)
      }
      
      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    // 启动游戏循环
    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }, [gameSize, gameTime, getDynamicConstants])

  // 重启游戏函数
  const restartGame = useCallback(() => {
    const currentTime = Date.now()
    
    // 停止当前游戏循环
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    
    // 等待一帧确保动画停止
    setTimeout(() => {
      const constants = getDynamicConstants()
      
      // 完全重置游戏状态，确保所有速度相关的状态都被重置
      gameStateRef.current = {
        player: {
          x: 100 * gameSize.scale,
          y: gameSize.height / 2,
          velocityY: 0,
          isMovingUp: false,
          sprite: gameStateRef.current.player.sprite // 保持已加载的精灵
        },
        obstacles: [],
        trailPoints: [],
        frameCount: 0,
        startTime: currentTime,
        gameSpeedMultiplier: 1.0, // 确保重置为精确的初始速度
        obstacleGenerationInterval: constants.TREE_GENERATION_INTERVAL,
        lastSpeedIncreaseTime: currentTime,
        score: 0,
        isGameOver: false,
        lastObstacleGenerationFrame: 0 // 重置障碍物生成帧数
      }
      
      // 重新生成初始障碍物，但要确保不会立即碰撞
      if (spritesRef.current) {
        // 增加更大的安全距离
        const minDistance = 300 * gameSize.scale // 增加最小距离
        const obstacleSpacing = 200 * gameSize.scale // 障碍物间距
        
        for (let i = 0; i < 2; i++) { // 进一步减少初始障碍物数量
          gameStateRef.current.obstacles.push({
            x: gameSize.width + minDistance + (i * obstacleSpacing),
            y: Math.random() * (gameSize.height - 200 * gameSize.scale) + 100 * gameSize.scale,
            sprite: spritesRef.current.getRandomObstacleSprite()
          })
        }
      }
      
      // 重置React状态
      setScore(0)
      setGameTime(0)
      setGameOver(false)
      
      // 重新启动游戏循环
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          initGameLoop(ctx)
        }
      }
    }, 100) // 增加延迟确保状态完全重置
  }, [gameSize, getDynamicConstants, initGameLoop])

  // 关闭欢迎弹窗的处理函数
  const handleCloseWelcomeModal = useCallback(() => {
    setShowWelcomeModal(false)
  }, [])

  // 鼠标和触摸事件处理
  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!gameStateRef.current.isGameOver) {
      gameStateRef.current.player.isMovingUp = true
    }
  }, [])

  const handlePointerUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!gameStateRef.current.isGameOver) {
      gameStateRef.current.player.isMovingUp = false
    }
  }, [])

  // 处理鼠标离开canvas区域的情况
  const handlePointerLeave = useCallback(() => {
    if (!gameStateRef.current.isGameOver) {
      gameStateRef.current.player.isMovingUp = false
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // 避免重复初始化
    if (isInitialized) return

    const fontLink = document.createElement('link')
    fontLink.href = FONTS.PIXEL
    fontLink.rel = 'stylesheet'
    document.head.appendChild(fontLink)

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.src = src
        img.onload = () => resolve(img)
        img.onerror = (error) => {
          console.error('Image load failed:', src, error)
          reject(new Error(`Failed to load image: ${src}`))
        }
      })
    }

    const loadObstacleSprites = async () => {
      const treeSprites = await Promise.all(IMAGES.TREES.map(loadImage))
      const snowmanSprites = await Promise.all(IMAGES.SNOWMEN.map(loadImage))
      return { treeSprites, snowmanSprites }
    }

    const initGame = async () => {
      try {
        const playerSprite = await loadImage(IMAGES.PLAYER)
        const { treeSprites, snowmanSprites } = await loadObstacleSprites()

        gameStateRef.current.player.sprite = playerSprite
        gameStateRef.current.player.x = 100 * gameSize.scale
        gameStateRef.current.player.y = gameSize.height / 2

        const getRandomObstacleSprite = () => {
          const useTree = Math.random() > 0.3
          const sprites = useTree ? treeSprites : snowmanSprites
          return sprites[Math.floor(Math.random() * sprites.length)]
        }

        // 保存精灵到ref中
        spritesRef.current = {
          treeSprites,
          snowmanSprites,
          getRandomObstacleSprite
        }

        // 生成初始障碍物，确保不会立即碰撞
        const minDistance = 300 * gameSize.scale
        const obstacleSpacing = 200 * gameSize.scale
        for (let i = 0; i < 2; i++) {
          gameStateRef.current.obstacles.push({
            x: gameSize.width + minDistance + (i * obstacleSpacing),
            y: Math.random() * (gameSize.height - 200 * gameSize.scale) + 100 * gameSize.scale,
            sprite: getRandomObstacleSprite()
          })
        }

        setIsInitialized(true)
        initGameLoop(ctx)
        
        // 加载游戏统计数据
        loadGameStats()
      } catch (error) {
        console.error('Failed to initialize game:', error)
      }
    }

    initGame()

    return () => {
      // 清理函数
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
        animationFrameRef.current = null
      }
    }
  }, [gameSize, isInitialized, initGameLoop])

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-8">
      {/* 温馨提醒弹窗（可选） */}
      <WelcomeModal 
        isOpen={showWelcomeModal} 
        onClose={handleCloseWelcomeModal} 
      />
      
      {/* 游戏标题 */}
      <h1 
        className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 text-center ${gameOver ? 'text-red-500' : 'text-white'} px-4`} 
        style={{ 
          fontFamily: '"Press Start 2P", cursive',
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
        }}
      >
        {gameOver ? "It's Snow Over" : "We're Snow Back"}
      </h1>
      
      {/* 游戏画布容器 - 确保居中 */}
      <div className="flex justify-center items-center w-full mb-4">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={gameSize.width}
            height={gameSize.height}
            className="border-2 md:border-4 border-gray-700 rounded-lg cursor-pointer select-none shadow-xl"
            onMouseDown={handlePointerDown}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerLeave}
            onTouchStart={handlePointerDown}
            onTouchEnd={handlePointerUp}
            style={{ 
              touchAction: 'none',
              display: 'block',
              maxWidth: '100vw',
              maxHeight: '60vh'
            }}
          />
          {gameOver && !showScoreSubmit && !showLeaderboard && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/75 rounded-lg">
              <div className="text-white text-center p-4 space-y-4">
                <div className="text-lg mb-4">
                  <div>最终分数: {score}</div>
                  <div>游戏时间: {gameTime}s</div>
                </div>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setShowScoreSubmit(true)}
                    className="px-4 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-lg text-sm"
                    style={{ fontFamily: '"Press Start 2P", cursive' }}
                  >
                    提交分数
                  </button>
                  <button
                    onClick={restartGame}
                    className="px-4 py-3 bg-black text-white rounded hover:bg-gray-800 transition-colors shadow-lg text-sm"
                    style={{ fontFamily: '"Press Start 2P", cursive' }}
                  >
                    重新开始
                  </button>
                </div>
                <button
                  onClick={() => {
                    loadLeaderboardData()
                    setShowLeaderboard(true)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors shadow-lg text-xs"
                  style={{ fontFamily: '"Press Start 2P", cursive' }}
                >
                  查看排行榜
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 游戏说明 */}
      <div className="text-center max-w-md px-4">
        <p 
          className="text-white mb-2"
          style={{ 
            fontSize: `${Math.max(11, 14 * gameSize.scale)}px`,
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
          }}
        >
          点击并按住游戏区域向上飞行
        </p>
        <p 
          className="text-white/75 text-xs sm:text-sm"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
        >
          支持触摸操作 • 避开障碍物
        </p>
      </div>
      
      {/* 游戏信息显示 */}
      <div className="mt-4 text-white text-center flex gap-4 md:gap-8 px-4">
        <div style={{ 
          fontSize: `${Math.max(10, 12 * gameSize.scale)}px`,
          textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
        }}>
          分数: {score}
        </div>
        {gameOver && (
          <div style={{ 
            fontSize: `${Math.max(10, 12 * gameSize.scale)}px`,
            textShadow: '1px 1px 2px rgba(0,0,0,0.7)'
          }}>
            时间: {gameTime}s
          </div>
        )}
      </div>
      
      {/* 可选显示弹窗的按钮 */}
      <div className="mt-4">
        <button
          onClick={() => setShowWelcomeModal(true)}
          className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-all duration-300 text-sm border border-white/30"
          style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
        >
          温馨提醒 💫
        </button>
      </div>

      {/* 分数提交弹窗 */}
      {showScoreSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md mx-4 border-3 border-[#d4a5a0]/60 shadow-2xl">
            <h3 className="text-2xl font-bold text-[#a89688] mb-6 text-center">提交您的分数</h3>
            <div className="space-y-4">
              <div className="text-center text-[#9a8d7d]">
                <div>分数: <span className="font-bold text-[#a89688]">{score}</span></div>
                <div>时间: <span className="font-bold text-[#a89688]">{gameTime}s</span></div>
              </div>
              <input
                type="text"
                placeholder="请输入您的姓名"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#d4a5a0]/40 rounded-lg focus:border-[#d4a5a0] outline-none bg-white/70"
                maxLength={20}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleScoreSubmit}
                  disabled={submittingScore || !playerName.trim()}
                  className="flex-1 py-3 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  {submittingScore ? '提交中...' : '提交'}
                </button>
                <button
                  onClick={() => setShowScoreSubmit(false)}
                  className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 排行榜弹窗 */}
      {showLeaderboard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl mx-4 border-3 border-[#d4a5a0]/60 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-[#a89688]">滑雪排行榜</h3>
              <button
                onClick={() => setShowLeaderboard(false)}
                className="text-[#a89688] hover:text-[#9a8d7d] text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* 游戏统计 */}
            {gameStats && (
              <div className="mb-6 p-4 bg-gradient-to-r from-[#d4a5a0]/20 to-[#c8b8d5]/20 rounded-lg">
                <h4 className="font-bold text-[#a89688] mb-2">游戏统计</h4>
                <div className="grid grid-cols-2 gap-4 text-sm text-[#9a8d7d]">
                  <div>总玩家数: <span className="font-bold">{gameStats.totalPlayers}</span></div>
                  <div>总游戏数: <span className="font-bold">{gameStats.totalGames}</span></div>
                  <div>最高分: <span className="font-bold">{gameStats.highestScore}</span></div>
                  <div>冠军: <span className="font-bold">{gameStats.topPlayer}</span></div>
                </div>
              </div>
            )}

            {/* 排行榜 */}
            {loadingLeaderboard ? (
              <div className="text-center py-8 text-[#9a8d7d]">加载中...</div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={entry._id}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      index < 3 
                        ? 'bg-gradient-to-r from-yellow-100 to-yellow-50 border-2 border-yellow-300' 
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        index === 0 ? 'bg-yellow-500' :
                        index === 1 ? 'bg-gray-400' :
                        index === 2 ? 'bg-orange-400' : 'bg-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-bold text-[#a89688]">{entry.playerName}</div>
                        <div className="text-sm text-[#9a8d7d]">
                          {new Date(entry.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-[#a89688]">{entry.score} 分</div>
                      <div className="text-sm text-[#9a8d7d]">{entry.duration}s</div>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <div className="text-center py-8 text-[#9a8d7d]">暂无排行榜数据</div>
                )}
              </div>
            )}
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowLeaderboard(false)}
                className="px-6 py-2 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] text-white rounded-lg hover:scale-105 transition-transform"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SkiingPage() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* 背景图片层 */}
      <div 
        className="fixed inset-0 z-0" 
        style={{
          backgroundImage: 'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ice-RFivzrFYklghXcbtYkoYiMiESh5rh5.png")',
          backgroundRepeat: 'repeat'
        }}
      />
      
      {/* 背景遮罩层 */}
      <div className="fixed inset-0 z-1 bg-gradient-to-br from-[#f3ede5]/60 via-[#e8e2db]/40 via-[#ede6dd]/50 to-[#f0e9e0]/60"></div>
      
      {/* 返回首页按钮 */}
      <div className="fixed top-6 left-6 z-50">
        <Link
          href="/"
          className="group inline-flex items-center space-x-3 bg-white/70 backdrop-blur-xl hover:bg-white/90 px-6 py-3 rounded-full border-2 border-[#d4a5a0]/40 hover:border-[#d4a5a0]/60 transition-all duration-500 hover:scale-105 shadow-xl"
        >
          <div className="w-5 h-5 border-2 border-[#a89688] rounded-full group-hover:animate-pulse relative">
            <div className="absolute inset-1 bg-[#a89688] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span className="text-[#a89688] font-medium baroque-font">返回梦境</span>
        </Link>
      </div>
      
      {/* 标题区域 */}
      <div className="relative z-10 pt-28 pb-10 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/50 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-white/60 relative overflow-hidden">
            {/* 装饰元素 */}
            <div className="absolute top-6 left-6 w-8 h-8 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-6 right-6 w-8 h-8 border-2 border-[#b8c4a8] rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute bottom-6 left-6 w-6 h-6 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] transform rotate-45 opacity-60 animate-pulse"></div>
            <div className="absolute bottom-6 right-6 w-6 h-6 border-2 border-[#d4a5a0] rounded-full opacity-60 animate-pulse"></div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold baroque-title-font text-transparent bg-gradient-to-r from-[#a89688] via-[#9a8d7d] to-[#c0b0a0] bg-clip-text mb-6">
              雪地滑翔梦境
            </h1>
            <p className="text-lg md:text-xl text-[#a89688]/90 max-w-3xl mx-auto leading-relaxed baroque-text-font">
              在雪花纷飞的梦境中，与Angel一起体验滑雪的优雅与速度，
              <br className="hidden sm:block" />
              避开雪人和树木，在纯白的世界里自由翱翔
            </p>
            
            <div className="flex items-center justify-center space-x-4 mt-8">
              <div className="w-6 h-6 bg-gradient-to-r from-[#b8c4a8] to-[#c0b0a0] rounded-full animate-bounce"></div>
              <div className="w-4 h-4 border-2 border-[#c8b8d5] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-6 h-6 bg-gradient-to-r from-[#d4a5a0] to-[#9a8d7d] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-4 h-4 border-2 border-[#e5c8c5] rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 游戏区域 - 确保居中 */}
      <div className="relative z-10 flex justify-center">
        <SnowBored />
      </div>
      
      {/* 游戏说明 */}
      <div className="relative z-10 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-2 border-[#d4a5a0]/30 relative">
            <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full opacity-60"></div>
            
            <h3 className="text-xl md:text-2xl font-bold baroque-title-font text-[#a89688] mb-6 text-center">
              游戏玩法
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#d4a5a0] to-[#c8b8d5] rounded-full mx-auto flex items-center justify-center">
                  <span className="text-white font-bold">1</span>
                </div>
                <p className="text-[#9a8d7d] baroque-text-font">点击并按住游戏区域向上飞行</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#b8c4a8] to-[#c0b0a0] rounded-full mx-auto flex items-center justify-center">
                  <span className="text-white font-bold">2</span>
                </div>
                <p className="text-[#9a8d7d] baroque-text-font">避开雪人和树木障碍</p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-r from-[#c8b8d5] to-[#e5c8c5] rounded-full mx-auto flex items-center justify-center">
                  <span className="text-white font-bold">3</span>
                </div>
                <p className="text-[#9a8d7d] baroque-text-font">获得更高的分数</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 