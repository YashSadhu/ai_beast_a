"use client"

import { Eye, EyeOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ModelToggles {
  sonar: boolean
  sonnet: boolean
  deepseek: boolean
  gpt5: boolean
}

interface ModelToggleBarProps {
  modelToggles: ModelToggles
  onToggleModel: (model: keyof ModelToggles) => void
  vertical?: boolean
}

export function ModelToggleBar({ modelToggles, onToggleModel, vertical = false }: ModelToggleBarProps) {
  const models = [
    { 
      key: "sonar", 
      name: "Perplexity Sonar", 
      shortName: "Sonar",
      icon: "🔍",
      description: "Real-time web search and analysis",
      activeClass: "bg-purple-100 text-purple-700 border-purple-200",
      inactiveClass: "bg-gray-100 text-gray-500 border-gray-200"
    },
    { 
      key: "sonnet", 
      name: "Claude Sonnet 3.5", 
      shortName: "Claude",
      icon: "🧠",
      description: "Advanced reasoning and creative tasks",
      activeClass: "bg-blue-100 text-blue-700 border-blue-200",
      inactiveClass: "bg-gray-100 text-gray-500 border-gray-200"
    },
    { 
      key: "deepseek", 
      name: "DeepSeek R1", 
      shortName: "DeepSeek",
      icon: "🚀",
      description: "Fast and efficient AI responses",
      activeClass: "bg-green-100 text-green-700 border-green-200",
      inactiveClass: "bg-gray-100 text-gray-500 border-gray-200"
    },
    { 
      key: "gpt5", 
      name: "GPT-4o", 
      shortName: "GPT-4o",
      icon: "⚡",
      description: "Versatile and creative AI assistant",
      activeClass: "bg-orange-100 text-orange-700 border-orange-200",
      inactiveClass: "bg-gray-100 text-gray-500 border-gray-200"
    },
  ] as const

  const activeCount = Object.values(modelToggles).filter(Boolean).length

  if (vertical) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">Active Models</h4>
          <Badge variant="secondary" className="text-xs">
            {activeCount}/4
          </Badge>
        </div>
        
        {models.map((model) => (
          <div 
            key={model.key} 
            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer hover:shadow-sm ${
              modelToggles[model.key as keyof ModelToggles] 
                ? model.activeClass 
                : model.inactiveClass
            }`}
            onClick={() => onToggleModel(model.key as keyof ModelToggles)}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{model.icon}</span>
              <div>
                <div className="text-sm font-medium">
                  {model.shortName}
                </div>
                <p className="text-xs text-gray-500">{model.description}</p>
              </div>
            </div>
            
            {modelToggles[model.key as keyof ModelToggles] ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50/50 rounded-lg border">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Compare with:</span>
          <Badge variant="outline" className="text-xs">
            {activeCount} model{activeCount !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        {models.map((model) => (
          <Tooltip key={model.key}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToggleModel(model.key as keyof ModelToggles)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all hover:shadow-sm ${
                  modelToggles[model.key as keyof ModelToggles] 
                    ? model.activeClass 
                    : model.inactiveClass
                }`}
              >
                <span className="text-sm">{model.icon}</span>
                <span className="text-sm font-medium">{model.shortName}</span>
                {modelToggles[model.key as keyof ModelToggles] ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <div className="text-center">
                <p className="font-medium">{model.name}</p>
                <p className="text-xs text-gray-500">{model.description}</p>
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  )
}
