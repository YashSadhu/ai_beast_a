"use client"

import { Eye, EyeOff } from "lucide-react"

interface ModelToggles {
  sonar: boolean
  sonnet: boolean
  deepseek: boolean
  gpt5: boolean
}

interface ModelToggleBarProps {
  modelToggles: ModelToggles
  onToggleModel: (model: keyof ModelToggles) => void
}

export function ModelToggleBar({ modelToggles, onToggleModel }: ModelToggleBarProps) {
  const models = [
    { key: "sonar", name: "Sonar Pro", color: "purple" },
    { key: "sonnet", name: "Claude Sonnet 3.7", color: "blue" },
    { key: "deepseek", name: "DeepSeek R-1", color: "green" },
    { key: "gpt5", name: "GPT-5", color: "orange" },
  ] as const

  return (
    <div className="flex items-center space-x-4 mt-4 p-3 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium text-gray-700">Toggle Models:</span>
      {models.map(({ key, name, color }) => (
        <button
          key={key}
          onClick={() => onToggleModel(key)}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm transition-all ${
            modelToggles[key]
              ? `bg-${color}-100 text-${color}-700 border border-${color}-200`
              : "bg-gray-200 text-gray-500 border border-gray-300"
          }`}
        >
          {modelToggles[key] ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          <span>{name}</span>
        </button>
      ))}
    </div>
  )
}
