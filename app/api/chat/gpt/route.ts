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
      // Use user's OpenAI API key
      response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: message }],
        }),
      })
    } else {
      // Use fallback API
      response = await fetch("https://agent-prod.studio.lyzr.ai/v3/inference/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.LYZR_GPT_API_KEY || "",
        },
        body: JSON.stringify({
          user_id: "user@example.com",
          agent_id: "68a4381929d545bad109ae57",
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
      ? data.choices[0].message.content 
      : (data.response || data.message || JSON.stringify(data))

    return NextResponse.json({ content })
  } catch (error) {
    console.error('GPT API error:', error)
    return NextResponse.json(
      { error: 'Failed to get response from GPT' },
      { status: 500 }
    )
  }
}