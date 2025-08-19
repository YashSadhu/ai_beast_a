import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(request, 5, 60 * 1000) // 5 requests per minute for enhancement
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }

  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    const enhancementPrompt = `Enhance this prompt to be more detailed, specific, and effective. Return ONLY the improved prompt, no explanations or additional text: "${query}"`

    const response = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.LYZR_DEEPSEEK_API_KEY || "",
      },
      body: JSON.stringify({
        user_id: "user@example.com",
        agent_id: "68a4344658203a80ebac7f48",
        session_id: `enhance-${Date.now()}`,
        message: enhancementPrompt,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const enhancedPrompt = data.response || data.message || query

    return NextResponse.json({ enhancedPrompt })
  } catch (error) {
    console.error('Enhancement API error:', error)
    return NextResponse.json(
      { error: 'Failed to enhance prompt' },
      { status: 500 }
    )
  }
}