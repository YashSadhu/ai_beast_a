'use client'

import { Button } from './button'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  neonColor?: 'blue' | 'purple' | 'green' | 'pink' | 'cyan'
  intensity?: 'low' | 'medium' | 'high'
  pulse?: boolean
}

const NeonButton = forwardRef<HTMLButtonElement, NeonButtonProps>(
  ({ className = '', neonColor = 'blue', intensity = 'medium', pulse = false, children, ...props }, ref) => {
    const colorClasses = {
      blue: 'border-blue-500 text-blue-400 shadow-blue-500/50 hover:shadow-blue-500/75',
      purple: 'border-purple-500 text-purple-400 shadow-purple-500/50 hover:shadow-purple-500/75',
      green: 'border-green-500 text-green-400 shadow-green-500/50 hover:shadow-green-500/75',
      pink: 'border-pink-500 text-pink-400 shadow-pink-500/50 hover:shadow-pink-500/75',
      cyan: 'border-cyan-500 text-cyan-400 shadow-cyan-500/50 hover:shadow-cyan-500/75'
    }

    const intensityClasses = {
      low: 'shadow-lg',
      medium: 'shadow-xl',
      high: 'shadow-2xl'
    }

    return (
      <Button
        ref={ref}
        className={`
          relative bg-black/80 backdrop-blur-sm border-2 
          ${colorClasses[neonColor]} 
          ${intensityClasses[intensity]}
          ${pulse ? 'animate-pulse' : ''}
          hover:scale-105 hover:brightness-110
          transition-all duration-300 ease-out
          ${className}
        `}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-${neonColor}-500/20 to-transparent animate-shimmer`} />
      </Button>
    )
  }
)

NeonButton.displayName = 'NeonButton'

export { NeonButton }