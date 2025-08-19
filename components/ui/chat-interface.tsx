'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Sparkles, Copy, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ChatMessage {
  id: string
  query: string
  responses: {
    sonar: string
    sonnet: string
    deepseek: string
    gpt: string
  }
  timestamp: Date
  responseTime?: number
}

interface ModelResponse {
  content: string
  loading: boolean
  error: string | null
  responseTime?: number
}

const MODEL_CONFIG = {
  sonar: {
    name: 'Perplexity Sonar',
    color: 'bg-purple-50 border-purple-200',
    headerColor: 'text-purple-700',
    icon: '🔍',
    description: 'Real-time web search & analysis'
  },
  sonnet: {
    name: 'Claude Sonnet 3.5',
    color: 'bg-blue-50 border-blue-200',
    headerColor: 'text-blue-700',
    icon: '🧠',
    description: 'Advanced reasoning & analysis'
  },
  deepseek: {
    name: 'DeepSeek R1',
    color: 'bg-green-50 border-green-200',
    headerColor: 'text-green-700',
    icon: '🚀',
    description: 'Fast & efficient responses'
  },
  gpt: {
    name: 'GPT-4o',
    color: 'bg-orange-50 border-orange-200',
    headerColor: 'text-orange-700',
    icon: '⚡',
    description: 'Creative & versatile AI'
  }
}

export function ChatInterface() {
  const [query, setQuery] = useState('')
  const [isEnhancing, setIsEnhancing] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([])
  const [responses, setResponses] = useState<Record<string, ModelResponse>>({
    sonar: { content: '', loading: false, error: null },
    sonnet: { content: '', loading: false, error: null },
    deepseek: { content: '', loading: false, error: null },
    gpt: { content: '', loading: false, error: null }
  })
  
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatHistory, responses])

  const copyToClipboard = async (text: string, model: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${MODEL_CONFIG[model as keyof typeof MODEL_CONFIG].name} response copied!`)
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const enhancePrompt = async () => {
    if (!query.trim()) return

    setIsEnhancing(true)
    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })

      if (!response.ok) throw new Error('Enhancement failed')

      const data = await response.json()
      setQuery(data.enhancedPrompt)
      toast.success('Prompt enhanced!')
    } catch (error) {
      toast.error('Failed to enhance prompt')
    } finally {
      setIsEnhancing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const currentQuery = query
    setQuery('')

    // Reset responses
    setResponses({
      sonar: { content: '', loading: true, error: null },
      sonnet: { content: '', loading: true, error: null },
      deepseek: { content: '', loading: true, error: null },
      gpt: { content: '', loading: true, error: null }
    })

    const startTime = Date.now()

    // Call all APIs in parallel
    const apiCalls = Object.keys(MODEL_CONFIG).map(async (model) => {
      try {
        const response = await fetch(`/api/chat/${model}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentQuery })
        })

        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const data = await response.json()
        const responseTime = Date.now() - startTime

        setResponses(prev => ({
          ...prev,
          [model]: {
            content: data.content,
            loading: false,
            error: null,
            responseTime
          }
        }))
      } catch (error) {
        setResponses(prev => ({
          ...prev,
          [model]: {
            content: '',
            loading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            responseTime: Date.now() - startTime
          }
        }))
      }
    })

    await Promise.allSettled(apiCalls)
  }

  const isLoading = Object.values(responses).some(r => r.loading)

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Chat History */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6"
      >
        {chatHistory.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Compare AI Models
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Ask a question and see how different AI models respond. 
              Get insights from multiple perspectives instantly.
            </p>
          </div>
        )}

        {/* Current Query Responses */}
        {(isLoading || Object.values(responses).some(r => r.content)) && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 max-w-[80%] shadow-sm">
                <p className="text-sm">{query}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {Object.entries(MODEL_CONFIG).map(([key, config]) => (
                <ModelResponseCard
                  key={key}
                  model={key}
                  config={config}
                  response={responses[key]}
                  onCopy={(text) => copyToClipboard(text, key)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="border-t bg-white p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything... (e.g., 'Explain quantum computing in simple terms')"
              className="min-h-[80px] pr-32 resize-none border-2 focus:border-blue-500 transition-colors"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            
            <div className="absolute bottom-3 right-3 flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={enhancePrompt}
                      disabled={!query.trim() || isLoading || isEnhancing}
                      className="h-8 w-8 p-0"
                    >
                      {isEnhancing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Enhance prompt with AI</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="h-8 w-8 p-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-3 text-sm text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <span>{query.length}/4000</span>
          </div>
        </form>
      </div>
    </div>
  )
}

function ModelResponseCard({ 
  model, 
  config, 
  response, 
  onCopy 
}: {
  model: string
  config: any
  response: ModelResponse
  onCopy: (text: string) => void
}) {
  return (
    <Card className={`${config.color} transition-all duration-200 hover:shadow-md`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            <div>
              <h3 className={`font-semibold ${config.headerColor}`}>
                {config.name}
              </h3>
              <p className="text-xs text-gray-500">{config.description}</p>
            </div>
          </div>
          
          {response.responseTime && (
            <Badge variant="secondary" className="text-xs">
              {response.responseTime}ms
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {response.loading && (
          <div className="flex items-center gap-2 py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-gray-600">Thinking...</span>
          </div>
        )}

        {response.error && (
          <div className="py-4 text-red-600 text-sm">
            <p>⚠️ {response.error}</p>
          </div>
        )}

        {response.content && (
          <div className="space-y-3">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '')
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {response.content}
              </ReactMarkdown>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCopy(response.content)}
                className="h-7 text-xs"
              >
                <Copy className="h-3 w-3 mr-1" />
                Copy
              </Button>
              
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <ThumbsUp className="h-3 w-3 mr-1" />
                Good
              </Button>
              
              <Button variant="ghost" size="sm" className="h-7 text-xs">
                <ThumbsDown className="h-3 w-3 mr-1" />
                Poor
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}