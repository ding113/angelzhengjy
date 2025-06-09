import React from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function WelcomeModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative max-w-md mx-4 p-8 bg-white/95 backdrop-blur-xl rounded-3xl border-3 border-[#d4a5a0]/60 shadow-2xl animate-bounce-in">
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
          <p className="text-sm text-[#9a8d7d]/80 font-serif">愿你有个甜美的梦境 🌸</p>
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
