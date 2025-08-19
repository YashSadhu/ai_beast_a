import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = rateLimit(request, 10, 60 * 1000) // 10 requests per minute
  
  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    )
  }

  try {
    const { message, userApiKey } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    let response

    if (userApiKey) {
      // Use user's Anthropic API key
      response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": userApiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 4000,
          messages: [{ role: "user", content: message }],
        }),
      })
    } else {
      // Use fallback API
      response = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_SONNET_API_KEY || "",
        },
        body: JSON.stringify({
          user_id: "user@example.com",
          agent_id: "68a432d16e1baa11945cbcb3",
          session_id: `session-${Date.now()}`,
          message: message,
        }),
      })
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const content = userApiKey 
      ? data.content[0].text 
      : (data.response || data.message || JSON.stringify(data))

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Sonnet API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from Sonnet' },
      { status: 500 }
    )
  }
}