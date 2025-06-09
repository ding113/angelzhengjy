import React from 'react'

export const Heart = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

export const Star = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
)

export const Music = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)

export const MessageCircle = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)

export const Send = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22,2 15,22 11,13 2,9 22,2" />
  </svg>
)

export const Play = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <polygon points="5,3 19,12 5,21" />
  </svg>
)

export const Pause = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
)

export const ChevronLeft = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="15,18 9,12 15,6" />
  </svg>
)

export const ChevronRight = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="9,18 15,12 9,6" />
  </svg>
)

export const Sparkles = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M9.5 2L8 6l-4 1.5L8 9l1.5 4L11 9l4-1.5L11 6 9.5 2zM19 10l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2zM19 2l-.5 1.5L17 4l1.5.5L19 6l.5-1.5L21 4l-1.5-.5L19 2z" />
  </svg>
)

export const Volume2 = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
  </svg>
)

export const Eye = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

export const Skiing = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M13 3c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-2.2 8.6L15 13l1.2-1.4c.4-.5 1.1-.6 1.6-.2.5.4.6 1.1.2 1.6L16.7 15l2.1 2.1c.4.4.4 1 0 1.4-.2.2-.5.3-.7.3s-.5-.1-.7-.3L15 16.1l-2.4 2.8c-.4.5-1.1.6-1.6.2-.5-.4-.6-1.1-.2-1.6L12.1 16l-1.7-1.7-3.2 3.2c-.2.2-.5.3-.7.3s-.5-.1-.7-.3c-.4-.4-.4-1 0-1.4l3.2-3.2L7.3 11l-2.1 2.1c-.4.4-1 .4-1.4 0-.2-.2-.3-.5-.3-.7s.1-.5.3-.7L5.2 10.3l1.4-1.2c.5-.4 1.2-.3 1.6.2l.6.8 2-2.4c.4-.5 1.1-.5 1.6-.1.5.4.5 1.1.1 1.6l-1.7 2.4z"/>
  </svg>
)

export const Sheep = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 8c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm-2.2 8.6L15 13l1.2-1.4c.4-.5 1.1-.6 1.6-.2.5.4.6 1.1.2 1.6L16.7 15l2.1 2.1c.4.4.4 1 0 1.4-.2.2-.5.3-.7.3s-.5-.1-.7-.3L15 16.1l-2.4 2.8c-.4.5-1.1.6-1.6.2-.5-.4-.6-1.1-.2-1.6L12.1 16l-1.7-1.7-3.2 3.2c-.2.2-.5.3-.7.3s-.5-.1-.7-.3c-.4-.4-.4-1 0-1.4l3.2-3.2L7.3 11l-2.1 2.1c-.4.4-1 .4-1.4 0-.2-.2-.3-.5-.3-.7s.1-.5.3-.7L5.2 10.3l1.4-1.2c.5-.4 1.2-.3 1.6.2l.6.8 2-2.4c.4-.5 1.1-.5 1.6-.1.5.4.5 1.1.1 1.6l-1.7 2.4z"/>
  </svg>
)

export const CuteBunny = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={`${className} animate-float`} viewBox="0 0 100 100" fill="none">
    <g>
      <ellipse cx="35" cy="25" rx="8" ry="20" fill="currentColor" opacity="0.8" />
      <ellipse cx="65" cy="25" rx="8" ry="20" fill="currentColor" opacity="0.8" />
      <circle cx="50" cy="45" r="25" fill="currentColor" opacity="0.9" />
      <circle cx="42" cy="40" r="3" fill="white" />
      <circle cx="58" cy="40" r="3" fill="white" />
      <circle cx="42" cy="40" r="1.5" fill="black" />
      <circle cx="58" cy="40" r="1.5" fill="black" />
      <ellipse cx="50" cy="48" rx="2" ry="1" fill="pink" />
      <path d="M50 50 Q45 52 40 50" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
      <path d="M50 50 Q55 52 60 50" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.6" />
    </g>
  </svg>
)

export const CuteCat = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={`${className} animate-pulse-slow`} viewBox="0 0 100 100" fill="none">
    <g>
      <path d="M30 35 L35 15 L45 35 Z" fill="currentColor" opacity="0.8" />
      <path d="M55 35 L65 15 L70 35 Z" fill="currentColor" opacity="0.8" />
      <circle cx="50" cy="50" r="22" fill="currentColor" opacity="0.9" />
      <ellipse cx="42" cy="45" rx="3" ry="4" fill="white" />
      <ellipse cx="58" cy="45" rx="3" ry="4" fill="white" />
      <ellipse cx="42" cy="45" rx="1" ry="3" fill="black" />
      <ellipse cx="58" cy="45" rx="1" ry="3" fill="black" />
      <path d="M50 52 L47 55 L53 55 Z" fill="pink" />
      <path d="M50 55 Q45 58 42 55" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M50 55 Q55 58 58 55" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <line x1="25" y1="48" x2="35" y2="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="25" y1="52" x2="35" y2="52" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="65" y1="50" x2="75" y2="48" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      <line x1="65" y1="52" x2="75" y2="52" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </g>
  </svg>
)

export const CuteBird = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={`${className} animate-float`} viewBox="0 0 100 100" fill="none">
    <g>
      <ellipse cx="50" cy="55" rx="18" ry="15" fill="currentColor" opacity="0.9" />
      <circle cx="50" cy="35" r="12" fill="currentColor" opacity="0.9" />
      <circle cx="47" cy="32" r="2" fill="white" />
      <circle cx="47" cy="32" r="1" fill="black" />
      <path d="M40 35 L35 37 L40 39 Z" fill="orange" />
      <ellipse cx="45" cy="50" rx="8" ry="12" fill="currentColor" opacity="0.7" transform="rotate(-20 45 50)" />
      <ellipse cx="65" cy="60" rx="6" ry="10" fill="currentColor" opacity="0.7" transform="rotate(30 65 60)" />
    </g>
  </svg>
)

export const CuteFox = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg className={`${className} animate-float`} viewBox="0 0 100 100" fill="none">
    <g>
      <path d="M35 30 L40 10 L50 30 Z" fill="currentColor" opacity="0.8" />
      <path d="M50 30 L60 10 L65 30 Z" fill="currentColor" opacity="0.8" />
      <ellipse cx="50" cy="45" rx="20" ry="18" fill="currentColor" opacity="0.9" />
      <ellipse cx="43" cy="40" rx="2" ry="3" fill="white" />
      <ellipse cx="57" cy="40" rx="2" ry="3" fill="white" />
      <ellipse cx="43" cy="40" rx="1" ry="2" fill="black" />
      <ellipse cx="57" cy="40" rx="1" ry="2" fill="black" />
      <circle cx="50" cy="48" r="2" fill="black" />
      <path d="M50 50 Q45 53 42 50" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M50 50 Q55 53 58 50" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.6" />
    </g>
  </svg>
)

