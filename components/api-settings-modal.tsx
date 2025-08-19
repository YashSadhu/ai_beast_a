"use client"
import { X } from "lucide-react"

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
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">API Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">🔑 Use Your Own API Keys</h3>
            <p className="text-blue-800 text-sm">
              Add your own API keys for unlimited usage without rate limits. All keys are stored locally in your browser
              for privacy.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              Running this free service costs me money for API access. In future I might run out of my API credits. If you find AI Beast-A helpful, consider{" "}
              <a
                href="https://buymeacoffee.com/yashsadhu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                buying me a coffee
              </a>{" "}
              to keep it running for everyone.
            </p>
          </div>

          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">OpenAI API Key (for GPT-5)</label>
              <input
                type="password"
                value={apiKeys.openai}
                onChange={(e) => onSaveKeys({ ...apiKeys, openai: e.target.value })}
                placeholder="sk-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Format: sk-... • Get from: platform.openai.com/api-keys</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Anthropic API Key (for Claude Sonnet 3.7)
              </label>
              <input
                type="password"
                value={apiKeys.anthropic}
                onChange={(e) => onSaveKeys({ ...apiKeys, anthropic: e.target.value })}
                placeholder="sk-ant-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: sk-ant-... • Get from: console.anthropic.com/settings/keys
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Perplexity API Key (for Sonar Pro)</label>
              <input
                type="password"
                value={apiKeys.perplexity}
                onChange={(e) => onSaveKeys({ ...apiKeys, perplexity: e.target.value })}
                placeholder="pplx-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Format: pplx-... • Get from: perplexity.ai/settings/api</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DeepSeek API Key (for DeepSeek R-1)
              </label>
              <input
                type="password"
                value={apiKeys.deepseek}
                onChange={(e) => onSaveKeys({ ...apiKeys, deepseek: e.target.value })}
                placeholder="sk-..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Format: sk-... • Get from: platform.deepseek.com/api_keys</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">✅ Privacy & Security</h4>
            <ul className="text-green-800 text-sm space-y-1">
              <li>• API keys are stored locally in your browser only</li>
              <li>• Keys are never sent to our servers</li>
              <li>• Direct API calls to official providers</li>
              <li>• Clear browser data to remove stored keys</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
