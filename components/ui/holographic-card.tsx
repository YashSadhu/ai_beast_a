'use client'

import { useState, useRef, MouseEvent } from 'react'
import { Card, CardContent, CardHeader } from './card'

interface HolographicCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
}

export function HolographicCard({ children, className = '', intensity = 0.5 }: HolographicCardProps) {
  const [transform, setTransform] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    const rotateX = (y - centerY) / centerY * 10 * intensity
    const rotateY = (centerX - x) / centerX * 10 * intensity
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`)
  }

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)')
  }

  return (
    <div
      ref={cardRef}
      className={`relative transition-transform duration-200 ease-out ${className}`}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20 rounded-lg blur-xl opacity-50 animate-pulse" />
      <div className="relative bg-white/90 backdrop-blur-sm border border-white/20 rounded-lg shadow-2xl">
        {children}
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-shimmer" />
    </div>
  )
}