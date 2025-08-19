'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from './card'
import { Badge } from './badge'
import { Progress } from './progress'
import { HolographicCard } from './holographic-card'
import { AudioVisualizer } from './audio-visualizer'
import { Zap, Crown, Flame, Sparkles } from 'lucide-react'

interface BattleResult {
  model: string
  score: number
  reasoning: string
  strengths: string[]
  weaknesses: string[]
}

interface AIBattleArenaProps {
  query: string
  responses: Record<string, string>
  isActive: boolean
}

export function AIBattleArena({ query, responses, isActive }: AIBattleArenaProps) {
  const [battleResults, setBattleResults] = useState<BattleResult[]>([])
  const [battlePhase, setBattlePhase] = useState<'preparing' | 'analyzing' | 'scoring' | 'complete'>('preparing')
  const [winner, setWinner] = useState<string | null>(null)

  const modelConfigs = {
    sonar: { name: 'Perplexity Sonar', icon: '🔍', color: 'purple' },
    sonnet: { name: 'Claude Sonnet', icon: '🧠', color: 'blue' },
    deepseek: { name: 'DeepSeek R1', icon: '🚀', color: 'green' },
    gpt: { name: 'GPT-4o', icon: '⚡', color: 'orange' }
  }

  useEffect(() => {
    if (!isActive || !query || Object.values(responses).some(r => !r)) return

    const runBattle = async () => {
      setBattlePhase('preparing')
      await new Promise(resolve => setTimeout(resolve, 1000))

      setBattlePhase('analyzing')
      await new Promise(resolve => setTimeout(resolve, 2000))

      setBattlePhase('scoring')
      
      // Simulate battle scoring
      const results: BattleResult[] = Object.entries(responses).map(([model, response]) => {
        const lengthScore = Math.min(response.length / 100, 10)
        const creativityScore = (response.match(/[!?]/g)?.length || 0) * 2
        const technicalScore = (response.match(/\b(algorithm|function|data|analysis)\b/gi)?.length || 0) * 3
        const clarityScore = response.split('.').length * 0.5
        const randomBonus = Math.random() * 10

        const totalScore = Math.min(lengthScore + creativityScore + technicalScore + clarityScore + randomBonus, 100)

        return {
          model,
          score: Math.round(totalScore),
          reasoning: generateReasoning(model, totalScore),
          strengths: generateStrengths(model),
          weaknesses: generateWeaknesses(model)
        }
      })

      results.sort((a, b) => b.score - a.score)
      setBattleResults(results)
      setWinner(results[0].model)
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      setBattlePhase('complete')
    }

    runBattle()
  }, [isActive, query, responses])

  const generateReasoning = (model: string, score: number): string => {
    const reasons = {
      sonar: score > 80 ? 'Excellent web search integration and real-time data' : 'Good factual accuracy but limited creativity',
      sonnet: score > 80 ? 'Superior reasoning and nuanced understanding' : 'Solid analysis but could be more concise',
      deepseek: score > 80 ? 'Lightning-fast processing with great efficiency' : 'Quick responses but sometimes lacks depth',
      gpt: score > 80 ? 'Outstanding creativity and versatile problem-solving' : 'Creative but occasionally verbose'
    }
    return reasons[model as keyof typeof reasons] || 'Standard AI performance'
  }

  const generateStrengths = (model: string): string[] => {
    const strengths = {
      sonar: ['Real-time data', 'Web search', 'Fact checking'],
      sonnet: ['Deep reasoning', 'Code analysis', 'Nuanced responses'],
      deepseek: ['Speed', 'Efficiency', 'Mathematical tasks'],
      gpt: ['Creativity', 'Versatility', 'Natural language']
    }
    return strengths[model as keyof typeof strengths] || ['General AI capabilities']
  }

  const generateWeaknesses = (model: string): string[] => {
    const weaknesses = {
      sonar: ['Limited creativity', 'Dependency on web data'],
      sonnet: ['Can be verbose', 'Sometimes overthinks'],
      deepseek: ['Less creative', 'Shorter responses'],
      gpt: ['Can hallucinate', 'Sometimes too verbose']
    }
    return weaknesses[model as keyof typeof weaknesses] || ['Standard limitations']
  }

  if (!isActive) return null

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
          🥊 AI BATTLE ARENA 🥊
        </h2>
        <p className="text-gray-600 mt-2">Watch the models compete in real-time!</p>
      </div>

      {/* Battle Status */}
      <Card className="bg-gradient-to-r from-purple-900/20 to-pink-900/20 border-purple-500/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Zap className="w-6 h-6 text-yellow-500 animate-bounce" />
                {battlePhase === 'analyzing' && (
                  <div className="absolute inset-0 animate-ping">
                    <Zap className="w-6 h-6 text-yellow-500" />
                  </div>
                )}
              </div>
              <span className="font-semibold text-white">
                {battlePhase === 'preparing' && 'Preparing Battle Arena...'}
                {battlePhase === 'analyzing' && 'Analyzing Responses...'}
                {battlePhase === 'scoring' && 'Calculating Battle Scores...'}
                {battlePhase === 'complete' && '🏆 Battle Complete!'}
              </span>
            </div>
            <AudioVisualizer isActive={battlePhase !== 'complete'} color="#8b5cf6" />
          </div>
        </CardContent>
      </Card>

      {/* Battle Results */}
      {battleResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {battleResults.map((result, index) => {
            const config = modelConfigs[result.model as keyof typeof modelConfigs]
            const isWinner = result.model === winner
            
            return (
              <HolographicCard key={result.model} intensity={isWinner ? 1 : 0.3}>
                <Card className={`relative overflow-hidden ${isWinner ? 'ring-4 ring-yellow-500 ring-opacity-75' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <h3 className="font-bold text-lg">{config.name}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={isWinner ? 'default' : 'secondary'}>
                              Rank #{index + 1}
                            </Badge>
                            {isWinner && (
                              <Crown className="w-4 h-4 text-yellow-500 animate-bounce" />
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-500">
                          {result.score}
                        </div>
                        <div className="text-sm text-gray-500">Battle Score</div>
                      </div>
                    </div>
                    <Progress value={result.score} className="mt-3" />
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Battle Analysis</h4>
                      <p className="text-sm text-gray-600">{result.reasoning}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-semibold text-xs text-green-700 mb-1 flex items-center">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Strengths
                        </h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {result.strengths.map((strength, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-1 h-1 bg-green-500 rounded-full mr-2" />
                              {strength}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-xs text-red-700 mb-1 flex items-center">
                          <Flame className="w-3 h-3 mr-1" />
                          Areas to Improve
                        </h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {result.weaknesses.map((weakness, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-1 h-1 bg-red-500 rounded-full mr-2" />
                              {weakness}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>

                  {/* Winner effects */}
                  {isWinner && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 animate-pulse" />
                      <div className="absolute top-2 right-2">
                        <div className="animate-bounce">
                          🏆
                        </div>
                      </div>
                    </>
                  )}
                </Card>
              </HolographicCard>
            )
          })}
        </div>
      )}
    </div>
  )
}