"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, Sparkles, Zap, Crown, Image, Music, Settings, Home } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ParticleSystem } from "@/components/ui/particle-system"
import { MatrixRain } from "@/components/ui/matrix-rain"
import { GlitchText } from "@/components/ui/glitch-text"
import { HolographicCard } from "@/components/ui/holographic-card"
import { NeonButton } from "@/components/ui/neon-button"
import { AudioVisualizer } from "@/components/ui/audio-visualizer"
import { AIBattleArena } from "@/components/ui/ai-battle-arena"
import { PromptMutator } from "@/components/ui/prompt-mutator"
import { FakeImageGenerator } from "@/components/ui/fake-image-generator"
import { CrazyModeToggle, CrazyModes } from "@/components/ui/crazy-mode-toggle"
import ReactMarkdown from "react-markdown"
import { toast } from "sonner"

interface ModelResponse {
  content: string
  loading: boolean
  error: string | null
  responseTime?: number
}

interface ChatMessage {
  id: string
  query: string
  responses: Record<string, string>
  timestamp: Date
}

const MODEL_CONFIGS = {
  sonar: {
    name: 'Perplexity Sonar Pro',
    icon: '🔍',
    color: 'purple',
    personality: 'analytical',
    description: 'Real-time web search & analysis'
  },
  sonnet: {
    name: 'Claude Sonnet 4',
    icon: '🧠',
    color: 'blue', 
    personality: 'thoughtful',
    description: 'Advanced reasoning & deep analysis'
  },
  deepseek: {
    name: 'DeepSeek R1',
    icon: '🚀',
    color: 'green',
    personality: 'efficient',
    description: 'Lightning-fast AI responses'
  },
  gpt5: {
    name: 'GPT-5 Turbo',
    icon: '⚡',
    color: 'orange',
    personality: 'creative',
    description: 'Creative & versatile intelligence'
  },
  gemini: {
    name: 'Gemini 2.5 Pro',
    icon: '💎',
    color: 'cyan',
    personality: 'versatile',
    description: 'Multimodal AI powerhouse'
  },
  grok: {
    name: 'Grok 4',
    icon: '🤖',
    color: 'pink',
    personality: 'witty',
    description: 'Humorous & irreverent AI'
  }
}

export default function CrazyAIFiestaPage() {
  const [query, setQuery] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [responses, setResponses] = useState<Record<string, ModelResponse>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [crazyModes, setCrazyModes] = useState<CrazyModes>({
    battleMode: true,
    glitchMode: true,
    particleMode: true,
    matrixMode: false,
    neonMode: true,
    holographicMode: true
  })
  const [showImageGen, setShowImageGen] = useState(false)
  const [showPromptMutator, setShowPromptMutator] = useState(false)

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Initialize responses for all models
  useEffect(() => {
    const initialResponses: Record<string, ModelResponse> = {}
    Object.keys(MODEL_CONFIGS).forEach(model => {
      initialResponses[model] = { content: '', loading: false, error: null }
    })
    setResponses(initialResponses)
  }, [])

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, responses])

  // Mock AI responses with different personalities
  const generateMockResponse = async (model: string, prompt: string): Promise<string> => {
    const config = MODEL_CONFIGS[model as keyof typeof MODEL_CONFIGS]
    const delay = Math.random() * 3000 + 1000 // 1-4 seconds

    await new Promise(resolve => setTimeout(resolve, delay))

    const personalityResponses = {
      analytical: `🔍 **Analysis Complete**\n\nBased on comprehensive web search and data analysis:\n\n${prompt}\n\n**Key Findings:**\n- Data point 1: Relevant information found\n- Data point 2: Cross-referenced sources confirm\n- Data point 3: Real-time updates available\n\n**Confidence Level:** 94.7%\n\n*Sources: 47 web pages analyzed in 0.3 seconds*`,
      
      thoughtful: `🧠 **Deep Reasoning Response**\n\nAfter careful consideration of your query: "${prompt}"\n\nI've analyzed this from multiple perspectives:\n\n**Philosophical Angle:** This touches on fundamental questions about...\n\n**Practical Implications:** The real-world applications include...\n\n**Nuanced Considerations:** We must also consider the edge cases where...\n\n**Synthesis:** Bringing together these various threads, I believe the most balanced approach would be...\n\n*Reasoning depth: Maximum | Confidence: High*`,
      
      efficient: `🚀 **Rapid Response Protocol**\n\n**Query:** ${prompt}\n\n**Answer:** Direct and efficient solution provided.\n\n**Key Points:**\n• Point 1 ✓\n• Point 2 ✓ \n• Point 3 ✓\n\n**Execution Time:** 0.247 seconds\n**Efficiency Score:** 98.3%\n\n*DeepSeek R1: Optimized for speed and accuracy*`,
      
      creative: `⚡ **Creative Intelligence Activated**\n\n*Imagine this:* ${prompt}\n\nBut what if we approached this from a completely different angle? 🎨\n\n**Creative Solutions:**\n1. 🌟 The unconventional approach: ...\n2. 🎭 The artistic interpretation: ...\n3. 🚀 The futuristic vision: ...\n\n**Plot Twist:** What if the real answer was the friends we made along the way? Just kidding! Here's the actual creative solution...\n\n*GPT-5: Where logic meets imagination*`,
      
      versatile: `💎 **Multimodal Analysis**\n\n**Text Understanding:** ✅ Processed\n**Context Awareness:** ✅ Analyzed  \n**Cross-Modal Synthesis:** ✅ Complete\n\nRegarding: "${prompt}"\n\n**Multi-Dimensional Response:**\n\n📊 **Data Perspective:** Statistical analysis shows...\n🎨 **Visual Interpretation:** If this were an image, it would show...\n🎵 **Audio Correlation:** The rhythm of this concept resembles...\n🔮 **Predictive Insights:** Future implications suggest...\n\n*Gemini 2.5 Pro: Seeing the full spectrum*`,
      
      witty: `🤖 **Grok Mode: Sass Level Maximum**\n\nOh, you want to know about "${prompt}"? \n\nWell, buckle up buttercup, because I'm about to drop some knowledge that's spicier than a jalapeño in a hot sauce factory! 🌶️\n\n**The Real Talk:**\nListen, human, while other AIs are busy being all proper and professional, I'm here to tell you the ACTUAL truth...\n\n**Grok's Hot Take:**\n- This is either genius or completely bonkers\n- Plot twist: it's both!\n- *chef's kiss* 👨‍🍳💋\n\n**Bottom Line:** Life's too short for boring AI responses.\n\n*Grok 4: Keeping it real since 2024* 😎`
    }

    return personalityResponses[config.personality as keyof typeof personalityResponses] || 
           `${config.icon} Response from ${config.name}: ${prompt}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || isLoading) return

    const currentQuery = query
    setQuery("")
    setIsLoading(true)

    // Reset all model responses
    const loadingResponses: Record<string, ModelResponse> = {}
    Object.keys(MODEL_CONFIGS).forEach(model => {
      loadingResponses[model] = { content: '', loading: true, error: null }
    })
    setResponses(loadingResponses)

    // Generate responses for all models in parallel
    const responsePromises = Object.keys(MODEL_CONFIGS).map(async (model) => {
      try {
        const startTime = Date.now()
        const content = await generateMockResponse(model, currentQuery)
        const responseTime = Date.now() - startTime

        setResponses(prev => ({
          ...prev,
          [model]: { content, loading: false, error: null, responseTime }
        }))
      } catch (error) {
        setResponses(prev => ({
          ...prev,
          [model]: { 
            content: '', 
            loading: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          }
        }))
      }
    })

    await Promise.all(responsePromises)
    setIsLoading(false)

    // Add to chat history
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      query: currentQuery,
      responses: Object.fromEntries(
        Object.entries(responses).map(([model, response]) => [model, response.content])
      ),
      timestamp: new Date()
    }
    setChatHistory(prev => [...prev, newMessage])
  }

  const enhancePrompt = async () => {
    if (!query.trim()) return

    setIsEnhancing(true)
    
    // Simulate prompt enhancement
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const enhancements = [
      "Please provide a comprehensive analysis with examples and practical applications",
      "Include multiple perspectives and consider edge cases in your response",
      "Explain this in detail with step-by-step reasoning and relevant context",
      "Break this down with clear explanations and actionable insights",
      "Provide both theoretical background and practical implementation details"
    ]
    
    const enhancement = enhancements[Math.floor(Math.random() * enhancements.length)]
    setQuery(`${query}\n\n${enhancement}`)
    setIsEnhancing(false)
    toast.success("🚀 Prompt enhanced with AI magic!")
  }

  const currentResponses = Object.fromEntries(
    Object.entries(responses).map(([model, response]) => [model, response.content])
  )

  return (
    <div className={`min-h-screen relative ${crazyModes.matrixMode ? 'overflow-hidden' : ''}`}>
      {/* Background Effects */}
      {crazyModes.matrixMode && <MatrixRain opacity={0.05} />}
      {crazyModes.particleMode && (
        <ParticleSystem 
          count={100} 
          colors={['#3b82f6', '#8b5cf6', '#06d6a0', '#f72585', '#ffd60a']} 
        />
      )}

      <div className={`relative z-10 ${crazyModes.neonMode ? 'cyber-grid' : ''}`}>
        {/* Header */}
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="animate-float">
                  <h1 className={`text-3xl font-bold ${crazyModes.glitchMode ? 'neon-text' : ''}`}>
                    <GlitchText 
                      text="🎉 CRAZY AI FIESTA 🎉" 
                      className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent"
                      glitchIntensity={crazyModes.glitchMode ? 0.1 : 0}
                    />
                  </h1>
                </div>
                <Badge className={`${crazyModes.neonMode ? 'animate-neon-pulse' : ''} bg-gradient-to-r from-purple-500 to-pink-500`}>
                  6 AI MODELS
                </Badge>
                <Badge className="bg-gradient-to-r from-green-500 to-cyan-500 animate-pulse">
                  BATTLE MODE
                </Badge>
              </div>
              
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
          {/* Crazy Mode Controls */}
          <CrazyModeToggle onModeChange={setCrazyModes} />

          {/* Enhanced Input Section */}
          <div className="space-y-6">
            {crazyModes.holographicMode ? (
              <HolographicCard>
                <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/30">
                  <CardHeader>
                    <h2 className="text-2xl font-bold text-center">
                      <GlitchText 
                        text="🎯 QUANTUM PROMPT INTERFACE 🎯"
                        className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                      />
                    </h2>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <Textarea
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="🚀 Ask something CRAZY to compare all 6 AI models..."
                          className={`w-full min-h-[120px] bg-black/30 border-2 border-purple-500/30 text-white placeholder-gray-400 focus:border-cyan-500 ${crazyModes.neonMode ? 'animate-neon-pulse' : ''}`}
                          disabled={isLoading || isEnhancing}
                        />
                        {crazyModes.neonMode && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer pointer-events-none rounded" />
                        )}
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <NeonButton
                          type="submit"
                          disabled={!query.trim() || isLoading || isEnhancing}
                          neonColor="purple"
                          className="flex-1 min-w-[200px]"
                          pulse={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              🔥 BATTLE IN PROGRESS...
                            </>
                          ) : (
                            <>
                              <Zap className="w-5 h-5 mr-2" />
                              🚀 LAUNCH AI BATTLE!
                            </>
                          )}
                        </NeonButton>

                        <NeonButton
                          type="button"
                          onClick={enhancePrompt}
                          disabled={!query.trim() || isLoading || isEnhancing}
                          neonColor="cyan"
                          className="px-6"
                        >
                          {isEnhancing ? (
                            <>
                              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                              Enhancing...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4 mr-2" />
                              ✨ Enhance
                            </>
                          )}
                        </NeonButton>

                        <NeonButton
                          type="button"
                          onClick={() => setShowPromptMutator(!showPromptMutator)}
                          neonColor="pink"
                          className="px-6"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          🧬 Mutate
                        </NeonButton>

                        <NeonButton
                          type="button"
                          onClick={() => setShowImageGen(!showImageGen)}
                          neonColor="green"
                          className="px-6"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          🎨 Images
                        </NeonButton>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </HolographicCard>
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask a question to compare all AI models..."
                      className="w-full min-h-[100px]"
                      disabled={isLoading || isEnhancing}
                    />
                    <div className="flex space-x-3">
                      <Button type="submit" disabled={!query.trim() || isLoading} className="flex-1">
                        {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                        Compare Models
                      </Button>
                      <Button type="button" onClick={enhancePrompt} variant="outline">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Enhance
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Prompt Mutator */}
            {showPromptMutator && (
              <PromptMutator
                originalPrompt={query}
                onMutatedPrompt={(mutated) => {
                  setQuery(mutated)
                  toast.success("🧬 Prompt DNA successfully mutated!")
                }}
              />
            )}

            {/* Fake Image Generator */}
            {showImageGen && (
              <FakeImageGenerator
                prompt={query}
                isActive={showImageGen}
              />
            )}
          </div>

          {/* AI Battle Arena */}
          {crazyModes.battleMode && Object.values(responses).some(r => r.content) && (
            <AIBattleArena
              query={chatHistory[chatHistory.length - 1]?.query || ''}
              responses={currentResponses}
              isActive={true}
            />
          )}

          {/* Model Responses */}
          {Object.values(responses).some(r => r.content || r.loading) && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">
                  <GlitchText 
                    text="🤖 AI MODEL RESPONSES 🤖"
                    className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  />
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.entries(MODEL_CONFIGS).map(([modelKey, config]) => {
                  const response = responses[modelKey]
                  if (!response) return null

                  const CardComponent = crazyModes.holographicMode ? HolographicCard : 'div'

                  return (
                    <CardComponent key={modelKey}>
                      <Card className={`h-full ${crazyModes.neonMode ? 'bg-black/80 border-2 border-purple-500/50' : 'bg-white'}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className={`text-2xl ${crazyModes.neonMode ? 'animate-bounce' : ''}`}>
                                {config.icon}
                              </span>
                              <div>
                                <h3 className={`font-bold ${crazyModes.neonMode ? 'text-white neon-text' : 'text-gray-900'}`}>
                                  {config.name}
                                </h3>
                                <p className={`text-sm ${crazyModes.neonMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  {config.description}
                                </p>
                              </div>
                            </div>
                            {response.responseTime && (
                              <Badge variant="outline" className={crazyModes.neonMode ? 'border-cyan-500 text-cyan-400' : ''}>
                                {response.responseTime}ms
                              </Badge>
                            )}
                          </div>
                          {response.loading && (
                            <div className="flex items-center space-x-2 mt-2">
                              <AudioVisualizer isActive={true} color={`#${config.color === 'purple' ? '8b5cf6' : '3b82f6'}`} />
                              <span className={`text-sm ${crazyModes.neonMode ? 'text-cyan-400' : 'text-gray-600'}`}>
                                {config.name} is thinking...
                              </span>
                            </div>
                          )}
                        </CardHeader>

                        <CardContent>
                          {response.loading ? (
                            <div className="space-y-3">
                              <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                              </div>
                            </div>
                          ) : response.error ? (
                            <div className="text-red-500 text-sm">
                              Error: {response.error}
                            </div>
                          ) : response.content ? (
                            <div className={`prose prose-sm max-w-none ${crazyModes.neonMode ? 'prose-invert' : ''}`}>
                              <ReactMarkdown>{response.content}</ReactMarkdown>
                            </div>
                          ) : null}
                        </CardContent>
                      </Card>
                    </CardComponent>
                  )
                })}
              </div>
            </div>
          )}

          {/* Chat History */}
          {chatHistory.length > 0 && (
            <Card className="bg-gradient-to-br from-gray-900/10 to-purple-900/10">
              <CardHeader>
                <h3 className="text-xl font-bold">
                  <GlitchText text="📜 BATTLE HISTORY" />
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto" ref={chatContainerRef}>
                  {chatHistory.map((message) => (
                    <div key={message.id} className="p-4 bg-white/50 rounded-lg border">
                      <div className="font-semibold text-gray-900 mb-2">
                        🎯 {message.query}
                      </div>
                      <div className="text-sm text-gray-600">
                        💬 {Object.keys(message.responses).length} models responded • {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 bg-white/80 backdrop-blur-md py-6 px-6 mt-12">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className="animate-bounce">🎉</span>
              <GlitchText 
                text="CRAZY AI FIESTA - WHERE AI MODELS BATTLE!"
                className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
              />
              <span className="animate-bounce">🎉</span>
            </div>
            <p className="text-gray-600">
              Experience the future of AI with 6 models, battle arena, prompt mutations, and crazy visual effects!
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <Badge variant="outline" className="animate-pulse">🚀 Next-Gen AI</Badge>
              <Badge variant="outline" className="animate-pulse">⚡ Lightning Fast</Badge>
              <Badge variant="outline" className="animate-pulse">🎨 Visual Effects</Badge>
              <Badge variant="outline" className="animate-pulse">🥊 Battle Mode</Badge>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}