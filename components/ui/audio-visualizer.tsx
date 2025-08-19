'use client'

import { useEffect, useRef } from 'react'

interface AudioVisualizerProps {
  isActive?: boolean
  color?: string
  bars?: number
  className?: string
}

export function AudioVisualizer({ 
  isActive = false, 
  color = '#3b82f6', 
  bars = 20,
  className = ''
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const barsData = useRef<number[]>(Array(bars).fill(0))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 200
    canvas.height = 60

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (isActive) {
        // Generate random heights for bars
        barsData.current = barsData.current.map(() => Math.random())
      } else {
        // Fade out bars
        barsData.current = barsData.current.map(height => height * 0.95)
      }

      const barWidth = canvas.width / bars
      
      barsData.current.forEach((height, index) => {
        const barHeight = height * canvas.height * 0.8
        const x = index * barWidth
        const y = canvas.height - barHeight

        // Create gradient
        const gradient = ctx.createLinearGradient(0, y, 0, canvas.height)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, color + '80')

        ctx.fillStyle = gradient
        ctx.fillRect(x, y, barWidth - 2, barHeight)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isActive, color, bars])

  return (
    <canvas
      ref={canvasRef}
      className={`${className}`}
      style={{ width: '200px', height: '60px' }}
    />
  )
}