'use client'

import { useState } from 'react'
import { Switch } from './switch'
import { Card, CardContent } from './card'
import { Badge } from './badge'
import { GlitchText } from './glitch-text'
import { Zap, Sparkles, Flame, Skull, Rocket, Brain } from 'lucide-react'

interface CrazyModeToggleProps {
  onModeChange: (modes: CrazyModes) => void
  className?: string
}

export interface CrazyModes {
  battleMode: boolean
  glitchMode: boolean
  particleMode: boolean
  matrixMode: boolean
  neonMode: boolean
  holographicMode: boolean
}

export function CrazyModeToggle({ onModeChange, className = '' }: CrazyModeToggleProps) {
  const [modes, setModes] = useState<CrazyModes>({
    battleMode: false,
    glitchMode: false,
    particleMode: true,
    matrixMode: false,
    neonMode: true,
    holographicMode: true
  })

  const toggleMode = (mode: keyof CrazyModes) => {
    const newModes = { ...modes, [mode]: !modes[mode] }
    setModes(newModes)
    onModeChange(newModes)
  }

  const modeConfigs = [
    {
      key: 'battleMode' as keyof CrazyModes,
      name: 'Battle Arena',
      icon: <Skull className="w-4 h-4" />,
      description: 'AI models compete with scores',
      color: 'text-red-400'
    },
    {
      key: 'glitchMode' as keyof CrazyModes,
      name: 'Glitch Effects',
      icon: <Zap className="w-4 h-4" />,
      description: 'Digital glitch aesthetics',
      color: 'text-cyan-400'
    },
    {
      key: 'particleMode' as keyof CrazyModes,
      name: 'Particle System',
      icon: <Sparkles className="w-4 h-4" />,
      description: 'Floating particle effects',
      color: 'text-blue-400'
    },
    {
      key: 'matrixMode' as keyof CrazyModes,
      name: 'Matrix Rain',
      icon: <Brain className="w-4 h-4" />,
      description: 'Falling code background',
      color: 'text-green-400'
    },
    {
      key: 'neonMode' as keyof CrazyModes,
      name: 'Neon UI',
      icon: <Flame className="w-4 h-4" />,
      description: 'Glowing neon elements',
      color: 'text-purple-400'
    },
    {
      key: 'holographicMode' as keyof CrazyModes,
      name: 'Holographic',
      icon: <Rocket className="w-4 h-4" />,
      description: '3D holographic cards',
      color: 'text-pink-400'
    }
  ]

  return (
    <Card className={`${className} bg-gradient-to-br from-gray-900/50 to-purple-900/30 border-purple-500/30`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">
            <GlitchText 
              text="🚀 CRAZY MODE CONTROL" 
              className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
              glitchIntensity={0.05}
            />
          </h3>
          <Badge 
            variant="outline" 
            className="border-cyan-500/50 text-cyan-400 animate-pulse"
          >
            EXPERIMENTAL
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {modeConfigs.map((config) => (
            <div 
              key={config.key}
              className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-gray-700/50 hover:border-purple-500/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={config.color}>
                  {config.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {config.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {config.description}
                  </div>
                </div>
              </div>
              <Switch
                checked={modes[config.key]}
                onCheckedChange={() => toggleMode(config.key)}
                className="data-[state=checked]:bg-purple-600"
              />
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
          <p className="text-xs text-gray-400 text-center">
            ⚠️ Enabling multiple crazy modes may cause reality distortion ⚠️
          </p>
        </div>
      </CardContent>
    </Card>
  )
}