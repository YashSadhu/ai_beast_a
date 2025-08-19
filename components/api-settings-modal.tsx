"use client"

import { useState } from "react"
import { X, Eye, EyeOff, Save, Key, Shield, Zap, Globe, AlertCircle, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ApiKeys {
  openai: string
  anthropic: string
  perplexity: string
  deepseek: string
}

interface ApiSettingsModalProps {
  isOpen: boolean
  onClose: () => void
  apiKeys: ApiKeys
  onSaveKeys: (keys: ApiKeys) => void
}

export function ApiSettingsModal({ isOpen, onClose, apiKeys, onSaveKeys }: ApiSettingsModalProps) {
  const [keys, setKeys] = useState<ApiKeys>(apiKeys)
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    perplexity: false,
    deepseek: false,
  })

  if (!isOpen) return null

  const handleSave = () => {
    onSaveKeys(keys)
    onClose()
  }

  const toggleShowKey = (provider: keyof typeof showKeys) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }))
  }

  const clearKey = (provider: keyof ApiKeys) => {
    setKeys(prev => ({ ...prev, [provider]: '' }))
  }

  const apiProviders = [
    {
      key: "openai" as keyof ApiKeys,
      name: "OpenAI",
      placeholder: "sk-proj-...",
      description: "GPT-4o, GPT-4 Turbo",
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
      icon: "⚡",
      website: "https://platform.openai.com/api-keys",
      pricing: "$0.03/1K tokens"
    },
    {
      key: "anthropic" as keyof ApiKeys,
      name: "Anthropic",
      placeholder: "sk-ant-api03-...",
      description: "Claude 3.5 Sonnet",
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
      icon: "🧠",
      website: "https://console.anthropic.com/",
      pricing: "$0.015/1K tokens"
    },
    {
      key: "perplexity" as keyof ApiKeys,
      name: "Perplexity",
      placeholder: "pplx-...",
      description: "Sonar Pro with web search",
      color: "text-purple-600",
      bgColor: "bg-purple-50 border-purple-200",
      icon: "🔍",
      website: "https://www.perplexity.ai/settings/api",
      pricing: "$0.02/1K tokens"
    },
    {
      key: "deepseek" as keyof ApiKeys,
      name: "DeepSeek",
      placeholder: "sk-...",
      description: "DeepSeek R1 Reasoning",
      color: "text-orange-600",
      bgColor: "bg-orange-50 border-orange-200",
      icon: "🚀",
      website: "https://platform.deepseek.com/api_keys",
      pricing: "$0.001/1K tokens"
    },
  ]

  const hasAnyKeys = Object.values(keys).some(key => key.trim().length > 0)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Key className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">API Configuration</h2>
              <p className="text-sm text-gray-600">Manage your AI model API keys</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <Tabs defaultValue="keys" className="w-full">
            <TabsList className="grid w-full grid-cols-3 m-6 mb-0">
              <TabsTrigger value="keys">API Keys</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="keys" className="p-6 space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Adding your own API keys provides better rate limits and faster responses. 
                  Keys are stored locally and never sent to our servers.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4">
                {apiProviders.map((provider) => (
                  <Card key={provider.key} className={`transition-all hover:shadow-md ${
                    keys[provider.key] ? provider.bgColor : ''
                  }`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{provider.icon}</span>
                          <div>
                            <CardTitle className={`text-lg ${provider.color}`}>
                              {provider.name}
                            </CardTitle>
                            <CardDescription>{provider.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="text-xs">
                            {provider.pricing}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                            className="ml-2"
                          >
                            <a href={provider.website} target="_blank" rel="noopener noreferrer">
                              <Globe className="w-3 h-3 mr-1" />
                              Get Key
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Label htmlFor={provider.key}>API Key</Label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Input
                              id={provider.key}
                              type={showKeys[provider.key] ? "text" : "password"}
                              value={keys[provider.key]}
                              onChange={(e) =>
                                setKeys(prev => ({ ...prev, [provider.key]: e.target.value }))
                              }
                              placeholder={provider.placeholder}
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleShowKey(provider.key)}
                              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                            >
                              {showKeys[provider.key] ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          {keys[provider.key] && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => clearKey(provider.key)}
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      Performance Benefits
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Higher Rate Limits</p>
                        <p className="text-sm text-gray-600">Up to 10x more requests per minute</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Faster Response Times</p>
                        <p className="text-sm text-gray-600">Direct API access without proxy delays</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Latest Models</p>
                        <p className="text-sm text-gray-600">Access to newest AI model versions</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-500" />
                      Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Local Storage Only</p>
                        <p className="text-sm text-gray-600">Keys stored in your browser, never on our servers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Direct API Calls</p>
                        <p className="text-sm text-gray-600">Your queries go directly to AI providers</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="font-medium">Open Source</p>
                        <p className="text-sm text-gray-600">Code is public - verify our security practices</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="support" className="p-6">
              <div className="space-y-6">
                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader>
                    <CardTitle className="text-amber-800 flex items-center gap-2">
                      <Coffee className="w-5 h-5" />
                      Support This Project
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-amber-700">
                    <p className="mb-4">
                      Running AI Beast-a costs money for API access and server hosting. 
                      If you find this tool helpful, consider supporting its development!
                    </p>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                      <a 
                        href="https://buymeacoffee.com/yashsadhu" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <Coffee className="w-4 h-4" />
                        Buy me a coffee
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-green-800">🔒 Your Security is Our Priority</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-green-700">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-2">Local Storage Only</h4>
                        <p className="text-sm">API keys are stored in your browser's local storage and never transmitted to our servers.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Direct API Calls</h4>
                        <p className="text-sm">Keys are used only for direct communication with AI providers from your browser.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">No Logging</h4>
                        <p className="text-sm">We don't log, store, or have access to your API keys or conversations.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Open Source</h4>
                        <p className="text-sm">Our code is open source - you can verify our security practices yourself.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            {hasAnyKeys ? (
              <span className="text-green-600 font-medium">✓ {Object.values(keys).filter(k => k.trim()).length} API key(s) configured</span>
            ) : (
              <span>No API keys configured - using fallback endpoints</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="w-4 h-4" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
