import React from 'react'

export function FloatingPetals({ isClient }: { isClient: boolean }) {
  if (!isClient) return null

  return (
    <>
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-3 h-3 bg-gradient-to-br from-pink-300/40 to-rose-300/40 rounded-full blur-sm animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${8 + Math.random() * 4}s`,
          }}
        />
      ))}
    </>
  )
}
