'use client'

import { useState } from 'react'
import { Button } from './button'
import { Card, CardContent, CardHeader } from './card'
import { Badge } from './badge'
import { NeonButton } from './neon-button'
import { GlitchText } from './glitch-text'
import { Dna, Shuffle, Zap, Sparkles, Wand2 } from 'lucide-react'

interface PromptMutatorProps {
  originalPrompt: string
  onMutatedPrompt: (prompt: string) => void
  className?: string
}

export function PromptMutator({ originalPrompt, onMutatedPrompt, className = '' }: PromptMutatorProps) {
  const [mutations, setMutations] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const mutationTypes = [
    {
      name: 'Cyberpunk Mode',
      icon: '🤖',
      transform: (prompt: string) => `In a neon-lit cyberpunk future: ${prompt}. Respond with futuristic terminology and digital aesthetics.`,
      color: 'cyan'
    },
    {
      name: 'Pirate Mode',
      icon: '🏴‍☠️',
      transform: (prompt: string) => `Ahoy matey! ${prompt}. Respond like a tech-savvy pirate sailing the digital seas.`,
      color: 'purple'
    },
    {
      name: 'Alien Intelligence',
      icon: '👽',
      transform: (prompt: string) => `From the perspective of an advanced alien civilization: ${prompt}. Use otherworldly concepts and cosmic thinking.`,
      color: 'green'
    },
    {
      name: 'Time Traveler',
      icon: '⏰',
      transform: (prompt: string) => `As a time traveler from 3024: ${prompt}. Reference future technologies and temporal perspectives.`,
      color: 'blue'
    },
    {
      name: 'Quantum Mode',
      icon: '⚛️',
      transform: (prompt: string) => `Through quantum superposition: ${prompt}. Explore multiple parallel possibilities simultaneously.`,
      color: 'pink'
    },
    {
      name: 'Meme Lord',
      icon: '😎',
      transform: (prompt: string) => `In the style of internet meme culture: ${prompt}. Use memes, slang, and viral references.`,
      color: 'purple'
    }
  ]

  const generateMutations = async () => {
    setIsGenerating(true)
    setMutations([])

    // Simulate mutation generation with delay
    for (let i = 0; i < 3; i++) {
      await new Promise(resolve => setTimeout(resolve, 500))
      const randomMutation = mutationTypes[Math.floor(Math.random() * mutationTypes.length)]
      const mutatedPrompt = randomMutation.transform(originalPrompt)
      setMutations(prev => [...prev, mutatedPrompt])
    }

    setIsGenerating(false)
  }

  const applyRandomMutation = () => {
    const randomMutation = mutationTypes[Math.floor(Math.random() * mutationTypes.length)]
    const mutatedPrompt = randomMutation.transform(originalPrompt)
    onMutatedPrompt(mutatedPrompt)
  }

  return (
    <Card className={`${className} bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Dna className="w-6 h-6 text-purple-500 animate-spin" />
            <h3 className="text-xl font-bold">
              <GlitchText text="PROMPT MUTATOR" className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent" />
            </h3>
          </div>
          <Badge variant="outline" className="border-purple-500/50 text-purple-400">
            DNA LAB
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {mutationTypes.map((mutation, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onMutatedPrompt(mutation.transform(originalPrompt))}
              className="text-xs hover:scale-105 transition-transform"
            >
              <span className="mr-1">{mutation.icon}</span>
              {mutation.name}
            </Button>
          ))}
        </div>

        <div className="flex space-x-3">
          <NeonButton
            neonColor="purple"
            onClick={generateMutations}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Zap className="w-4 h-4 mr-2 animate-spin" />
                Mutating DNA...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Mutations
              </>
            )}
          </NeonButton>

          <NeonButton
            neonColor="pink"
            onClick={applyRandomMutation}
            className="px-4"
          >
            <Shuffle className="w-4 h-4" />
          </NeonButton>
        </div>

        {/* Generated Mutations */}
        {mutations.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-purple-400 flex items-center">
              <Wand2 className="w-4 h-4 mr-2" />
              Generated Mutations
            </h4>
            {mutations.map((mutation, index) => (
              <Card 
                key={index} 
                className="bg-black/20 border-purple-500/30 cursor-pointer hover:bg-purple-500/10 transition-colors"
                onClick={() => onMutatedPrompt(mutation)}
              >
                <CardContent className="p-3">
                  <p className="text-sm text-gray-300 line-clamp-3">{mutation}</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline" className="text-xs border-purple-500/50">
                      Mutation #{index + 1}
                    </Badge>
                    <span className="text-xs text-purple-400 hover:text-purple-300">
                      Click to apply →
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}