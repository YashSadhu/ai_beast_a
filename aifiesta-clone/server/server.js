import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT ? Number(process.env.PORT) : 8787

app.use(cors())
app.use(express.json({ limit: '2mb' }))

function pseudoModelOutput(model, prompt) {
  const base = prompt.trim().slice(0, 160)
  const seed = [...(model + base)].reduce((a, c) => a + c.charCodeAt(0), 0)
  const random = (min, max) => min + ((seed % 997) / 997) * (max - min)
  const styles = {
    'gpt-5': 'Precise, structured, neutral tone',
    'claude-sonnet': 'Thoughtful, safety-aware, analogical',
    'gemini-pro': 'Concise, factual, tool-friendly',
    'deepseek-r1': 'Exploratory, chain-of-thought summarized',
  }
  const bullets = Array.from({ length: 5 }, (_, i) => `- ${styles[model] || 'Model'} insight ${i + 1} about: ${base}`)
  return bullets.join('\n')
}

app.post('/api/chat', async (req, res) => {
  const { prompt, models } = req.body || {}
  if (!prompt || !Array.isArray(models) || models.length === 0) {
    return res.status(400).json({ error: 'prompt and models[] are required' })
  }
  const start = Date.now()
  const results = models.map((m) => {
    const latencyMs = Math.floor(200 + Math.random() * 800)
    const tokens = Math.floor(150 + Math.random() * 450)
    const costUsd = Number(((tokens / 1000) * (0.5 + Math.random())).toFixed(4))
    return {
      model: m,
      output: pseudoModelOutput(m, prompt),
      latencyMs,
      tokens,
      costUsd,
    }
  })
  // Simulate variable latency
  const maxLatency = Math.max(...results.map((r) => r.latencyMs))
  const elapsed = Date.now() - start
  const remaining = Math.max(0, maxLatency - elapsed)
  await new Promise((r) => setTimeout(r, remaining))
  res.json({ results })
})

app.post('/api/image', async (req, res) => {
  const { prompt } = req.body || {}
  if (!prompt) return res.status(400).json({ error: 'prompt is required' })
  res.json({ url: 'data:image/svg+xml;utf8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="512" height="320"><rect width="100%" height="100%" fill="#0f172a"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#e2e8f0" font-family="monospace" font-size="16">Mock image for: ${prompt.replace(/</g, '&lt;')}</text></svg>`) })
})

app.post('/api/transcribe', async (req, res) => {
  res.json({ text: 'This is a mock transcription. Replace with real ASR provider.' })
})

app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`)
})

