"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Send, Loader2, Twitter, Linkedin, Sparkles, Home, Settings, Zap, Crown, Image } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { DonationPopup } from "@/components/donation-popup"
import Link from "next/link"
import { ApiSettingsModal } from "@/components/api-settings-modal"
import { ModelToggleBar } from "@/components/model-toggle-bar"
import { logger } from "@/lib/logger"
import { event } from "@/lib/analytics"
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
import { toast } from "sonner"

interface ApiResponse {
  content: string
  loading: boolean
  error: string | null
}

interface ChatHistory {
  id: string
  query: string
  responses: {
    sonar: string
    sonnet: string
    deepseek: string
    gpt5: string
    gemini: string
    grok: string
  }
  timestamp: Date
}

interface ApiKeys {
  openai: string
  anthropic: string
  perplexity: string
  deepseek: string
}

export default function Page() {
  const [query, setQuery] = useState("")
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
  const [chatCount, setChatCount] = useState(0)
  const [showDonationPopup, setShowDonationPopup] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isEnhancing, setIsEnhancing] = useState(false)
  
  // 🚀 CRAZY MODE FEATURES 🚀
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
  const [battleActive, setBattleActive] = useState(false)

  const [apiKeys, setApiKeys] = useState<ApiKeys>({
    openai: "",
    anthropic: "",
    perplexity: "",
    deepseek: "",
  })

  useEffect(() => {
    const savedKeys = localStorage.getItem("ai-beast-api-keys")
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys))
    }
  }, [])

  const saveApiKeys = (newKeys: ApiKeys) => {
    setApiKeys(newKeys)
    localStorage.setItem("ai-beast-api-keys", JSON.stringify(newKeys))
  }

  const [sonarResponse, setSonarResponse] = useState<ApiResponse>({
    content: "",
    loading: false,
    error: null,
  })
  const [sonnetResponse, setSonnetResponse] = useState<ApiResponse>({
    content: "",
    loading: false,
    error: null,
  })
  const [deepseekResponse, setDeepseekResponse] = useState<ApiResponse>({
    content: "",
    loading: false,
    error: null,
  })
  const [gpt5Response, setGpt5Response] = useState<ApiResponse>({
    content: "",
    loading: false,
    error: null,
  })

  const [modelToggles, setModelToggles] = useState({
    sonar: true,
    sonnet: true,
    deepseek: true,
    gpt5: true,
  })

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, sonarResponse, sonnetResponse, deepseekResponse, gpt5Response])

  const callSonarApi = async (message: string): Promise<string> => {
    const response = await fetch("/api/chat/sonar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        userApiKey: apiKeys.perplexity,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.content
  }

  const callSonnetApi = async (message: string): Promise<string> => {
    const response = await fetch("/api/chat/sonnet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        userApiKey: apiKeys.anthropic,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.content
  }

  const callDeepseekApi = async (message: string): Promise<string> => {
    const response = await fetch("/api/chat/deepseek", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        userApiKey: apiKeys.deepseek,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.content
  }

  const callGpt5Api = async (message: string): Promise<string> => {
    const response = await fetch("/api/chat/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        userApiKey: apiKeys.openai,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.content
  }

  const enhancePrompt = async () => {
    if (!query.trim()) return

    setIsEnhancing(true)
    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setQuery(data.enhancedPrompt)
    } catch (error) {
      console.error("Failed to enhance prompt:", error)
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const currentQuery = query
    setQuery("")

    const newChatCount = chatCount + 1
    setChatCount(newChatCount)
    if (newChatCount === 2) {
      setShowDonationPopup(true)
    }

    if (modelToggles.sonar) setSonarResponse({ content: "", loading: true, error: null })
    if (modelToggles.sonnet) setSonnetResponse({ content: "", loading: true, error: null })
    if (modelToggles.deepseek) setDeepseekResponse({ content: "", loading: true, error: null })
    if (modelToggles.gpt5) setGpt5Response({ content: "", loading: true, error: null })

    const chatId = Date.now().toString()
    const newChat: ChatHistory = {
      id: chatId,
      query: currentQuery,
      responses: { sonar: "", sonnet: "", deepseek: "", gpt5: "" },
      timestamp: new Date(),
    }

    setChatHistory((prev) => [...prev, newChat])

    const promises: Promise<void>[] = []

    if (modelToggles.sonar) {
      const sonarPromise = callSonarApi(currentQuery)
        .then((content) => {
          setSonarResponse({ content, loading: false, error: null })
          setChatHistory((prev) =>
            prev.map((chat) =>
              chat.id === chatId ? { ...chat, responses: { ...chat.responses, sonar: content } } : chat,
            ),
          )
        })
        .catch((error) => setSonarResponse({ content: "", loading: false, error: error.message }))
      promises.push(sonarPromise)
    }

    if (modelToggles.sonnet) {
      const sonnetPromise = callSonnetApi(currentQuery)
        .then((content) => {
          setSonnetResponse({ content, loading: false, error: null })
          setChatHistory((prev) =>
            prev.map((chat) =>
              chat.id === chatId ? { ...chat, responses: { ...chat.responses, sonnet: content } } : chat,
            ),
          )
        })
        .catch((error) => setSonnetResponse({ content: "", loading: false, error: error.message }))
      promises.push(sonnetPromise)
    }

    if (modelToggles.deepseek) {
      const deepseekPromise = callDeepseekApi(currentQuery)
        .then((content) => {
          setDeepseekResponse({ content, loading: false, error: null })
          setChatHistory((prev) =>
            prev.map((chat) =>
              chat.id === chatId ? { ...chat, responses: { ...chat.responses, deepseek: content } } : chat,
            ),
          )
        })
        .catch((error) => setDeepseekResponse({ content: "", loading: false, error: error.message }))
      promises.push(deepseekPromise)
    }

    if (modelToggles.gpt5) {
      const gpt5Promise = callGpt5Api(currentQuery)
        .then((content) => {
          setGpt5Response({ content, loading: false, error: null })
          setChatHistory((prev) =>
            prev.map((chat) =>
              chat.id === chatId ? { ...chat, responses: { ...chat.responses, gpt5: content } } : chat,
            ),
          )
        })
        .catch((error) => setGpt5Response({ content: "", loading: false, error: error.message }))
      promises.push(gpt5Promise)
    }

    await Promise.allSettled(promises)
  }

  const clearResults = () => {
    setSonarResponse({ content: "", loading: false, error: null })
    setSonnetResponse({ content: "", loading: false, error: null })
    setDeepseekResponse({ content: "", loading: false, error: null })
    setGpt5Response({ content: "", loading: false, error: null })
    setChatHistory([])
    setQuery("")
  }

  const isLoading =
    (modelToggles.sonar && sonarResponse.loading) ||
    (modelToggles.sonnet && sonnetResponse.loading) ||
    (modelToggles.deepseek && deepseekResponse.loading) ||
    (modelToggles.gpt5 && gpt5Response.loading)

  const toggleModel = (model: keyof typeof modelToggles) => {
    setModelToggles((prev) => ({
      ...prev,
      [model]: !prev[model],
    }))
  }

  const activeModels = Object.entries(modelToggles).filter(([_, isActive]) => isActive)
  const gridCols =
    activeModels.length === 1
      ? "grid-cols-1"
      : activeModels.length === 2
        ? "grid-cols-1 lg:grid-cols-2"
        : activeModels.length === 3
          ? "grid-cols-1 lg:grid-cols-3"
          : "grid-cols-1 lg:grid-cols-4"

  return (
    <div className={`min-h-screen flex flex-col relative ${crazyModes.matrixMode ? 'overflow-hidden' : ''} ${crazyModes.neonMode ? 'bg-black cyber-grid' : 'bg-white'}`}>
      {/* 🚀 CRAZY BACKGROUND EFFECTS 🚀 */}
      {crazyModes.matrixMode && <MatrixRain opacity={0.05} />}
      {crazyModes.particleMode && (
        <ParticleSystem 
          count={150} 
          colors={['#3b82f6', '#8b5cf6', '#06d6a0', '#f72585', '#ffd60a', '#ff006e']} 
        />
      )}
      
      <div className="relative z-10 flex flex-col min-h-screen">
      {/* 🎉 CRAZY HEADER 🎉 */}
      <header className={`border-b py-4 px-6 sticky top-0 z-50 ${crazyModes.neonMode ? 'border-purple-500/30 bg-black/80 backdrop-blur-md' : 'border-gray-100 bg-white/80 backdrop-blur-md'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <div className="animate-float">
                <span className="text-4xl animate-bounce">🎉</span>
              </div>
              <h1 className={`text-3xl font-bold ${crazyModes.neonMode ? 'neon-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text' : 'text-gray-900'}`}>
                <GlitchText 
                  text="CRAZY AI FIESTA" 
                  glitchIntensity={crazyModes.glitchMode ? 0.05 : 0}
                />
              </h1>
              <div className="animate-float" style={{ animationDelay: '0.5s' }}>
                <span className="text-4xl animate-bounce">🤖</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className={`${crazyModes.neonMode ? 'animate-neon-pulse bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-green-100 text-green-800'} text-xs font-medium px-3 py-1`}>
                {crazyModes.neonMode ? '🚀 CRAZY MODE ACTIVE' : 'FREE FOREVER'}
              </Badge>
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white animate-pulse">
                6 AI MODELS
              </Badge>
              {crazyModes.battleMode && (
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white animate-bounce">
                  ⚔️ BATTLE MODE
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="API Settings"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm">Settings</span>
              </button>
              <Link
                href="/landing"
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title="View Landing Page"
              >
                <Home className="w-4 h-4" />
                <span className="text-sm">Home</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-500">This tool is completely free and always will be</p>
          </div>

          <ModelToggleBar modelToggles={modelToggles} onToggleModel={toggleModel} />
        </div>
      </header>

      <ApiSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        apiKeys={apiKeys}
        onSaveKeys={saveApiKeys}
      />

      {/* 🎮 CRAZY MODE CONTROLS 🎮 */}
      <div className="max-w-7xl mx-auto w-full px-6 py-4">
        <CrazyModeToggle onModeChange={setCrazyModes} />
      </div>

      {/* 🧬 PROMPT MUTATOR 🧬 */}
      {showPromptMutator && (
        <div className="max-w-7xl mx-auto w-full px-6 py-2">
          <PromptMutator
            originalPrompt={query}
            onMutatedPrompt={(mutated) => {
              setQuery(mutated)
              toast.success("🧬 Prompt DNA successfully mutated!")
            }}
          />
        </div>
      )}

      {/* 🎨 IMAGE GENERATOR 🎨 */}
      {showImageGen && (
        <div className="max-w-7xl mx-auto w-full px-6 py-2">
          <FakeImageGenerator
            prompt={query}
            isActive={showImageGen}
          />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-6">
        {/* Chat History and Live Responses */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-6 space-y-6 max-h-[60vh]">
          {chatHistory.length === 0 && !isLoading && (
            <div className="space-y-4">
              <div className={`text-center mb-6 ${crazyModes.neonMode ? 'text-white' : 'text-gray-500'}`}>
                <h2 className="text-2xl font-bold mb-2">
                  <GlitchText 
                    text="🎯 READY FOR AI BATTLE!" 
                    className={crazyModes.neonMode ? 'neon-text bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent' : ''}
                    glitchIntensity={crazyModes.glitchMode ? 0.03 : 0}
                  />
                </h2>
                <p className={`text-lg ${crazyModes.neonMode ? 'text-gray-300' : 'text-gray-500'}`}>
                  {crazyModes.neonMode ? '🚀 Unleash the power of 6 AI models with crazy visual effects!' : 'Ask a question to compare AI models'}
                </p>
                {crazyModes.neonMode && (
                  <div className="flex justify-center space-x-4 mt-4">
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">⚡ Battle Mode</Badge>
                    <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 animate-pulse">🎨 Visual Effects</Badge>
                    <Badge className="bg-gradient-to-r from-green-500 to-yellow-500 animate-pulse">🧬 Prompt Mutations</Badge>
                  </div>
                )}
              </div>

              {/* Blank Cards */}
              <div className="overflow-x-auto">
                <div className={`grid ${gridCols} gap-4`} style={{ minWidth: `${activeModels.length * 300}px` }}>
                  {modelToggles.sonar && (
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 min-w-[280px] flex-shrink-0">
                      <div className="flex items-center space-x-2 mb-3">
                        <img
                          src="https://chat.aifiesta.ai/static/images/models/perplexity.svg"
                          alt="Perplexity"
                          className="w-5 h-5"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                          }}
                        />
                        <span className="text-sm font-medium text-purple-700">Sonar Pro</span>
                      </div>
                      <div className="text-gray-400 text-sm">Ready to respond...</div>
                    </div>
                  )}

                  {modelToggles.sonnet && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 min-w-[280px] flex-shrink-0">
                      <div className="flex items-center space-x-2 mb-3">
                        <img
                          src="https://chat.aifiesta.ai/static/images/models/claude.svg"
                          alt="Claude"
                          className="w-5 h-5"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                          }}
                        />
                        <span className="text-sm font-medium text-blue-700">Claude Sonnet 3.7</span>
                      </div>
                      <div className="text-gray-400 text-sm">Ready to respond...</div>
                    </div>
                  )}

                  {modelToggles.deepseek && (
                    <div className="bg-green-50 rounded-xl p-4 border border-green-100 min-w-[280px] flex-shrink-0">
                      <div className="flex items-center space-x-2 mb-3">
                        <img
                          src="https://chat.aifiesta.ai/static/images/models/deepseek.svg"
                          alt="DeepSeek"
                          className="w-5 h-5"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                          }}
                        />
                        <span className="text-sm font-medium text-green-700">DeepSeek R-1</span>
                      </div>
                      <div className="text-gray-400 text-sm">Ready to respond...</div>
                    </div>
                  )}

                  {modelToggles.gpt5 && (
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 min-w-[280px] flex-shrink-0">
                      <div className="flex items-center space-x-2 mb-3">
                        <img
                          src="https://chat.aifiesta.ai/static/images/models/openai.svg"
                          alt="OpenAI"
                          className="w-5 h-5"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = "none"
                          }}
                        />
                        <span className="text-sm font-medium text-orange-700">GPT-5</span>
                      </div>
                      <div className="text-gray-400 text-sm">Ready to respond...</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {chatHistory.map((chat) => (
            <div key={chat.id} className="space-y-4">
              {/* User Question */}
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 max-w-[80%]">
                  <p className="text-sm">{chat.query}</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className={`grid ${gridCols} gap-4`} style={{ minWidth: `${activeModels.length * 300}px` }}>
                  {/* Sonar Response */}
                  {modelToggles.sonar && (
                    crazyModes.holographicMode ? (
                      <HolographicCard>
                        <div className={`${crazyModes.neonMode ? 'bg-black/80 border-2 border-purple-500/50' : 'bg-purple-50 border border-purple-100'} rounded-xl p-4 min-w-[280px] flex-shrink-0 relative`}>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className={`text-2xl ${crazyModes.neonMode ? 'animate-bounce' : ''}`}>🔍</span>
                            <div>
                              <span className={`text-sm font-medium ${crazyModes.neonMode ? 'text-purple-400 neon-text' : 'text-purple-700'}`}>
                                <GlitchText text="Perplexity Sonar Pro" glitchIntensity={crazyModes.glitchMode ? 0.02 : 0} />
                              </span>
                              {crazyModes.neonMode && (
                                <div className="text-xs text-gray-400">🌐 Real-time web search</div>
                              )}
                            </div>
                          </div>
                          {chat.responses.sonar && (
                            <div className={`prose prose-sm max-w-none ${crazyModes.neonMode ? 'prose-invert' : 'prose-headings:text-gray-900 prose-p:text-gray-800'}`}>
                              <ReactMarkdown>{chat.responses.sonar}</ReactMarkdown>
                            </div>
                          )}
                          {crazyModes.neonMode && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-shimmer pointer-events-none rounded-xl" />
                          )}
                        </div>
                      </HolographicCard>
                    ) : (
                      <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 min-w-[280px] flex-shrink-0">
                        <div className="flex items-center space-x-2 mb-3">
                          <img
                            src="https://chat.aifiesta.ai/static/images/models/perplexity.svg"
                            alt="Perplexity"
                            className="w-5 h-5"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                          <span className="text-sm font-medium text-purple-700">Sonar Pro</span>
                        </div>
                        {chat.responses.sonar && (
                          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800">
                            <ReactMarkdown>{chat.responses.sonar}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )
                  )}

                  {/* Sonnet Response */}
                  {modelToggles.sonnet && (
                    crazyModes.holographicMode ? (
                      <HolographicCard>
                        <div className={`${crazyModes.neonMode ? 'bg-black/80 border-2 border-blue-500/50' : 'bg-blue-50 border border-blue-100'} rounded-xl p-4 min-w-[280px] flex-shrink-0 relative`}>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className={`text-2xl ${crazyModes.neonMode ? 'animate-pulse' : ''}`}>🧠</span>
                            <div>
                              <span className={`text-sm font-medium ${crazyModes.neonMode ? 'text-blue-400 neon-text' : 'text-blue-700'}`}>
                                <GlitchText text="Claude Sonnet 4" glitchIntensity={crazyModes.glitchMode ? 0.02 : 0} />
                              </span>
                              {crazyModes.neonMode && (
                                <div className="text-xs text-gray-400">🎭 Advanced reasoning</div>
                              )}
                            </div>
                          </div>
                          {chat.responses.sonnet && (
                            <div className={`prose prose-sm max-w-none ${crazyModes.neonMode ? 'prose-invert' : 'prose-headings:text-gray-900 prose-p:text-gray-800'}`}>
                              <ReactMarkdown>{chat.responses.sonnet}</ReactMarkdown>
                            </div>
                          )}
                          {crazyModes.neonMode && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-shimmer pointer-events-none rounded-xl" />
                          )}
                        </div>
                      </HolographicCard>
                    ) : (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 min-w-[280px] flex-shrink-0">
                        <div className="flex items-center space-x-2 mb-3">
                          <img
                            src="https://chat.aifiesta.ai/static/images/models/claude.svg"
                            alt="Claude"
                            className="w-5 h-5"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                          <span className="text-sm font-medium text-blue-700">Claude Sonnet 3.7</span>
                        </div>
                        {chat.responses.sonnet && (
                          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800">
                            <ReactMarkdown>{chat.responses.sonnet}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )
                  )}

                  {/* DeepSeek Response */}
                  {modelToggles.deepseek && (
                    crazyModes.holographicMode ? (
                      <HolographicCard>
                        <div className={`${crazyModes.neonMode ? 'bg-black/80 border-2 border-green-500/50' : 'bg-green-50 border border-green-100'} rounded-xl p-4 min-w-[280px] flex-shrink-0 relative`}>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className={`text-2xl ${crazyModes.neonMode ? 'animate-spin' : ''}`}>🚀</span>
                            <div>
                              <span className={`text-sm font-medium ${crazyModes.neonMode ? 'text-green-400 neon-text' : 'text-green-700'}`}>
                                <GlitchText text="DeepSeek R1 Ultra" glitchIntensity={crazyModes.glitchMode ? 0.02 : 0} />
                              </span>
                              {crazyModes.neonMode && (
                                <div className="text-xs text-gray-400">⚡ Lightning speed AI</div>
                              )}
                            </div>
                          </div>
                          {chat.responses.deepseek && (
                            <div className={`prose prose-sm max-w-none ${crazyModes.neonMode ? 'prose-invert' : 'prose-headings:text-gray-900 prose-p:text-gray-800'}`}>
                              <ReactMarkdown>{chat.responses.deepseek}</ReactMarkdown>
                            </div>
                          )}
                          {crazyModes.neonMode && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent animate-shimmer pointer-events-none rounded-xl" />
                          )}
                        </div>
                      </HolographicCard>
                    ) : (
                      <div className="bg-green-50 rounded-xl p-4 border border-green-100 min-w-[280px] flex-shrink-0">
                        <div className="flex items-center space-x-2 mb-3">
                          <img
                            src="https://chat.aifiesta.ai/static/images/models/deepseek.svg"
                            alt="DeepSeek"
                            className="w-5 h-5"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                          <span className="text-sm font-medium text-green-700">DeepSeek R-1</span>
                        </div>
                        {chat.responses.deepseek && (
                          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800">
                            <ReactMarkdown>{chat.responses.deepseek}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )
                  )}

                  {/* GPT-5 Response */}
                  {modelToggles.gpt5 && (
                    crazyModes.holographicMode ? (
                      <HolographicCard>
                        <div className={`${crazyModes.neonMode ? 'bg-black/80 border-2 border-orange-500/50' : 'bg-orange-50 border border-orange-100'} rounded-xl p-4 min-w-[280px] flex-shrink-0 relative`}>
                          <div className="flex items-center space-x-2 mb-3">
                            <span className={`text-2xl ${crazyModes.neonMode ? 'animate-bounce' : ''}`}>⚡</span>
                            <div>
                              <span className={`text-sm font-medium ${crazyModes.neonMode ? 'text-orange-400 neon-text' : 'text-orange-700'}`}>
                                <GlitchText text="GPT-5 Turbo" glitchIntensity={crazyModes.glitchMode ? 0.02 : 0} />
                              </span>
                              {crazyModes.neonMode && (
                                <div className="text-xs text-gray-400">🎨 Creative genius</div>
                              )}
                            </div>
                          </div>
                          {chat.responses.gpt5 && (
                            <div className={`prose prose-sm max-w-none ${crazyModes.neonMode ? 'prose-invert' : 'prose-headings:text-gray-900 prose-p:text-gray-800'}`}>
                              <ReactMarkdown>{chat.responses.gpt5}</ReactMarkdown>
                            </div>
                          )}
                          {crazyModes.neonMode && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/5 to-transparent animate-shimmer pointer-events-none rounded-xl" />
                          )}
                        </div>
                      </HolographicCard>
                    ) : (
                      <div className="bg-orange-50 rounded-xl p-4 border border-orange-100 min-w-[280px] flex-shrink-0">
                        <div className="flex items-center space-x-2 mb-3">
                          <img
                            src="https://chat.aifiesta.ai/static/images/models/openai.svg"
                            alt="OpenAI"
                            className="w-5 h-5"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                          <span className="text-sm font-medium text-orange-700">GPT-5</span>
                        </div>
                        {chat.responses.gpt5 && (
                          <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800">
                            <ReactMarkdown>{chat.responses.gpt5}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="overflow-x-auto">
              <div className={`grid ${gridCols} gap-4`} style={{ minWidth: `${activeModels.length * 300}px` }}>
                {[
                  { name: "Sonar Pro", color: "purple", loading: sonarResponse.loading, key: "sonar" },
                  { name: "Claude Sonnet 3.7", color: "blue", loading: sonnetResponse.loading, key: "sonnet" },
                  { name: "DeepSeek R-1", color: "green", loading: deepseekResponse.loading, key: "deepseek" },
                  { name: "GPT-5", color: "orange", loading: gpt5Response.loading, key: "gpt5" },
                ]
                  .filter((model) => modelToggles[model.key as keyof typeof modelToggles])
                  .map((model, index) => (
                    <div
                      key={index}
                      className={`bg-${model.color}-50 rounded-xl p-4 border border-${model.color}-100 min-w-[280px] flex-shrink-0`}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <span className={`text-sm font-medium text-${model.color}-700`}>{model.name}</span>
                      </div>
                      {model.loading && (
                        <div className="flex items-center space-x-2">
                          <Loader2 className={`w-4 h-4 animate-spin text-${model.color}-600`} />
                          <span className={`text-sm text-${model.color}-600`}>Generating...</span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* 🚀 CRAZY INPUT SECTION 🚀 */}
        {crazyModes.holographicMode ? (
          <HolographicCard>
            <div className={`${crazyModes.neonMode ? 'bg-black/80 border-2 border-purple-500/50' : 'bg-white border border-gray-200'} rounded-2xl shadow-sm p-6`}>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={crazyModes.neonMode ? "🚀 Ask something INSANE to unleash 6 AI models..." : "Ask a question to compare all AI models..."}
                    className={`w-full px-4 py-4 pr-16 rounded-xl focus:outline-none resize-none ${
                      crazyModes.neonMode 
                        ? 'bg-black/50 border-2 border-purple-500/30 text-white placeholder-gray-400 focus:border-cyan-500 neon-text' 
                        : 'border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 bg-gray-50'
                    }`}
                    rows={4}
                    disabled={isLoading || isEnhancing}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  {crazyModes.neonMode && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent animate-shimmer pointer-events-none rounded-xl" />
                  )}
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  {crazyModes.neonMode ? (
                    <>
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
                    </>
                  ) : (
                    <div className="flex space-x-3 w-full">
                      <button
                        type="submit"
                        disabled={!query.trim() || isLoading || isEnhancing}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-1"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Comparing...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Compare All Models</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={enhancePrompt}
                        disabled={!query.trim() || isLoading || isEnhancing}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Enhance</span>
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </HolographicCard>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a question to compare all AI models..."
                  className="w-full px-4 py-4 pr-16 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 bg-gray-50"
                  rows={3}
                  disabled={isLoading || isEnhancing}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading || isEnhancing}
                  className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Press Enter to send, Shift+Enter for new line</span>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={enhancePrompt}
                    disabled={!query.trim() || isLoading || isEnhancing}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isEnhancing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enhancing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Enhance Prompt</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={clearResults}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                  <button
                    type="submit"
                    disabled={!query.trim() || isLoading || isEnhancing}
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Comparing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Compare All Models</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* 🥊 AI BATTLE ARENA 🥊 */}
        {crazyModes.battleMode && chatHistory.length > 0 && (
          <div className="mt-6">
            <AIBattleArena
              query={chatHistory[chatHistory.length - 1]?.query || ''}
              responses={chatHistory[chatHistory.length - 1]?.responses || {}}
              isActive={true}
            />
          </div>
        )}
      </main>

      {/* 🎉 CRAZY FOOTER 🎉 */}
      <footer className={`border-t py-6 px-6 ${crazyModes.neonMode ? 'border-purple-500/30 bg-black/80 backdrop-blur-md' : 'border-gray-100 bg-white'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className={`flex items-center space-x-6 text-sm ${crazyModes.neonMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <span className="flex items-center space-x-2">
              <span className="animate-bounce">❤️</span>
              <GlitchText text="Made with CRAZY LOVE" glitchIntensity={crazyModes.glitchMode ? 0.02 : 0} />
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span className="animate-bounce">💰</span>
              <span>Saving you ₹999/month vs AI Fiesta</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <span className="animate-pulse">🚀</span>
              <span>FREE FOREVER + CRAZY FEATURES!</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://buymeacoffee.com/yashsadhu"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm"
            >
              <span>☕</span>
              <span>Buy me coffee</span>
            </a>
            <a
              href="https://x.com/yashsadhu09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500 transition-colors"
              title="Follow on X (Twitter)"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/in/yash-sadhu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-600 transition-colors"
              title="Connect on LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* Donation Popup */}
      <DonationPopup isOpen={showDonationPopup} onClose={() => setShowDonationPopup(false)} />
      </div>
    </div>
  )
}
