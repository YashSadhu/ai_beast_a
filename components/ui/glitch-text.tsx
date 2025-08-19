'use client'

import { useState, useEffect } from 'react'

interface GlitchTextProps {
  text: string
  className?: string
  glitchIntensity?: number
}

export function GlitchText({ text, className = '', glitchIntensity = 0.1 }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text)
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const glitchChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    const glitchInterval = setInterval(() => {
      if (Math.random() < glitchIntensity) {
        setIsGlitching(true)
        
        // Create glitched version
        const glitched = text.split('').map(char => 
          Math.random() < 0.3 ? glitchChars[Math.floor(Math.random() * glitchChars.length)] : char
        ).join('')
        
        setDisplayText(glitched)
        
        // Reset after short time
        setTimeout(() => {
          setDisplayText(text)
          setIsGlitching(false)
        }, 100)
      }
    }, 2000)

    return () => clearInterval(glitchInterval)
  }, [text, glitchIntensity])

  return (
    <span 
      className={`${className} ${isGlitching ? 'animate-pulse text-red-500' : ''} transition-all duration-100`}
      style={{
        textShadow: isGlitching ? '2px 0 red, -2px 0 cyan' : 'none',
        filter: isGlitching ? 'hue-rotate(90deg)' : 'none'
      }}
    >
      {displayText}
    </span>
  )
}