import { useMemo, useState } from 'react'

type ModelKey = 'gpt-5' | 'claude-sonnet' | 'gemini-pro' | 'deepseek-r1'

const ALL_MODELS: { key: ModelKey; label: string }[] = [
  { key: 'gpt-5', label: 'GPT‑5' },
  { key: 'claude-sonnet', label: 'Claude Sonnet' },
  { key: 'gemini-pro', label: 'Gemini Pro' },
  { key: 'deepseek-r1', label: 'DeepSeek R1' },
]

export default function App() {
  const [prompt, setPrompt] = useState('Explain quantum computing like I\'m five, then as a PhD, in 5 bullet points each.')
  const [selected, setSelected] = useState<Record<ModelKey, boolean>>({
    'gpt-5': true,
    'claude-sonnet': true,
    'gemini-pro': true,
    'deepseek-r1': true,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<Array<{ model: string; output: string; latencyMs: number; costUsd: number; tokens: number }>>([])
  const activeModels = useMemo(() => Object.entries(selected).filter(([, v]) => v).map(([k]) => k as ModelKey), [selected])

  async function runComparison() {
    if (!prompt.trim() || activeModels.length === 0) return
    setIsLoading(true)
    setResults([])
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, models: activeModels }),
      })
      const data = await res.json()
      setResults(data.results ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-white/10 sticky top-0 backdrop-blur bg-slate-900/70">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-semibold tracking-tight">AI Multi‑Model Lab</div>
          <div className="text-sm text-slate-300">Mock demo • No API keys required</div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 space-y-4">
          <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
            <label className="block text-sm font-medium mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={8}
              className="w-full rounded-lg bg-slate-900/60 border border-white/10 p-3 outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ask anything..."
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {ALL_MODELS.map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 text-sm bg-slate-900/60 border border-white/10 rounded-md px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selected[key]}
                    onChange={(e) => setSelected((s) => ({ ...s, [key]: e.target.checked }))}
                  />
                  {label}
                </label>
              ))}
            </div>
            <button
              onClick={runComparison}
              disabled={isLoading || activeModels.length === 0}
              className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-4 py-2 text-sm font-medium"
            >
              {isLoading ? 'Running…' : 'Run comparison'}
            </button>
          </div>
          <div className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
            <div className="text-sm opacity-80">Also try</div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <button className="bg-slate-900/60 border border-white/10 rounded-md px-3 py-2">Image (stub)</button>
              <button className="bg-slate-900/60 border border-white/10 rounded-md px-3 py-2">Transcribe (stub)</button>
            </div>
          </div>
        </section>
        <section className="lg:col-span-2">
          {results.length === 0 ? (
            <div className="h-full min-h-[300px] grid place-items-center text-slate-400 border border-dashed border-white/10 rounded-xl">
              Enter a prompt and click Run comparison
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {results.map((r) => (
                <div key={r.model} className="bg-slate-800/60 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{r.model}</div>
                    <div className="text-xs text-slate-400">{Math.round(r.latencyMs)} ms • ${r.costUsd.toFixed(4)}</div>
                  </div>
                  <pre className="whitespace-pre-wrap text-sm text-slate-200">{r.output}</pre>
                  <div className="mt-2 text-xs text-slate-400">~{r.tokens} tokens</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
