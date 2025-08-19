"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Send, Loader2, Twitter, Linkedin, Sparkles, Home, Settings } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { DonationPopup } from "@/components/donation-popup"
import Link from "next/link"
import { ApiSettingsModal } from "@/components/api-settings-modal"
import { ModelToggleBar } from "@/components/model-toggle-bar"
import { logger } from "@/lib/logger"
import { event } from "@/lib/analytics"

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
    if (apiKeys.perplexity) {
      // Use user's Perplexity API key
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKeys.perplexity}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-sonar-large-128k-online",
          messages: [{ role: "user", content: message }],
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } else {
      // Use default API
      const response = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_SONAR_API_KEY || "",
        },
        body: JSON.stringify({
          user_id: "fametheholyboooy@gmail.com",
          agent_id: "68a431a658203a80ebac7ef4",
          session_id: "68a431a658203a80ebac7ef4-kncehfvdb7",
          message: message,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response || data.message || JSON.stringify(data)
    }
  }

  const callSonnetApi = async (message: string): Promise<string> => {
    if (apiKeys.anthropic) {
      // Use user's Anthropic API key
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKeys.anthropic,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 4000,
          messages: [{ role: "user", content: message }],
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.content[0].text
    } else {
      // Use default API
      const response = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_SONNET_API_KEY || "",
        },
        body: JSON.stringify({
          user_id: "gabrukaand@g.com",
          agent_id: "68a432d16e1baa11945cbcb3",
          session_id: "68a432d16e1baa11945cbcb3-2og8831g8t8",
          message: message,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response || data.message || JSON.stringify(data)
    }
  }

  const callDeepseekApi = async (message: string): Promise<string> => {
    if (apiKeys.deepseek) {
      // Use user's DeepSeek API key
      const response = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKeys.deepseek}`,
        },
        body: JSON.stringify({
          model: "deepseek-reasoner",
          messages: [{ role: "user", content: message }],
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } else {
      // Use default API
      const response = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_DEEPSEEK_API_KEY || "",
        },
        body: JSON.stringify({
          user_id: "abkcaa@gmaill.com",
          agent_id: "68a4344658203a80ebac7f48",
          session_id: "68a4344658203a80ebac7f48-6294ig6loc8",
          message: message,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response || data.message || JSON.stringify(data)
    }
  }

  const callGpt5Api = async (message: string): Promise<string> => {
    if (apiKeys.openai) {
      // Use user's OpenAI API key
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKeys.openai}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: message }],
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.choices[0].message.content
    } else {
      // Use default API
      const response = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_GPT_API_KEY || "",
        },
        body: JSON.stringify({
          user_id: "abkcaa@gmaill.com",
          agent_id: "68a4381929d545bad109ae57",
          session_id: "68a4381929d545bad109ae57-d6oi8gmsbit",
          message: message,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data.response || data.message || JSON.stringify(data)
    }
  }

  const enhancePrompt = async () => {
    if (!query.trim()) return

    setIsEnhancing(true)
    try {
      const enhancementPrompt = `Enhance this prompt to be more detailed, specific, and effective. Return ONLY the improved prompt, no explanations or additional text: "${query}"`

      const response = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_DEEPSEEK_API_KEY || "",
        },
        body: JSON.stringify({
          user_id: "abkcaa@gmaill.com",
          agent_id: "68a4344658203a80ebac7f48",
          session_id: "68a4344658203a80ebac7f48-enhance",
          message: enhancementPrompt,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const enhancedPrompt = data.response || data.message || query
      setQuery(enhancedPrompt)
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-100 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <img src="/ai-beast-logo.png" alt="AI Beast-a Logo" className="w-10 h-10 object-contain" />
              <h1 className="text-2xl font-bold text-gray-900">AI Beast-a</h1>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                FREE FOREVER
              </span>
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-6">
        {/* Chat History and Live Responses */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-6 space-y-6 max-h-[60vh]">
          {chatHistory.length === 0 && !isLoading && (
            <div className="space-y-4">
              <div className="text-center text-gray-500 mb-6">
                <p className="text-lg">Ask a question to compare AI models</p>
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
                  )}

                  {/* Sonnet Response */}
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
                      {chat.responses.sonnet && (
                        <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800">
                          <ReactMarkdown>{chat.responses.sonnet}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}

                  {/* DeepSeek Response */}
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
                      {chat.responses.deepseek && (
                        <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800">
                          <ReactMarkdown>{chat.responses.deepseek}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}

                  {/* GPT-5 Response */}
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
                      {chat.responses.gpt5 && (
                        <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-800">
                          <ReactMarkdown>{chat.responses.gpt5}</ReactMarkdown>
                        </div>
                      )}
                    </div>
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

        {/* Chat Input Section */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a question to compare all four AI models..."
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
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span>Made with ❤️ by Yash Sadhu</span>
            <span>•</span>
            <span>Saving you ₹999/month compared to AI Fiesta</span>
            <span>•</span>
            <span>Free forever, no hidden costs</span>
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
  )
}
