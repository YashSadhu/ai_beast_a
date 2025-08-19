import { NextRequest } from 'next/server'

interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

// Simple in-memory rate limiter (use Redis in production)
const requests = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(
  request: NextRequest,
  limit: number = 100,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): RateLimitResult {
  const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1'
  const now = Date.now()
  const resetTime = now + windowMs

  if (!requests.has(ip)) {
    requests.set(ip, { count: 1, resetTime })
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetTime,
    }
  }

  const requestData = requests.get(ip)!

  if (now > requestData.resetTime) {
    requestData.count = 1
    requestData.resetTime = resetTime
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: resetTime,
    }
  }

  if (requestData.count >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: requestData.resetTime,
    }
  }

  requestData.count++
  return {
    success: true,
    limit,
    remaining: limit - requestData.count,
    reset: requestData.resetTime,
  }
}

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [ip, data] of requests.entries()) {
    if (now > data.resetTime) {
      requests.delete(ip)
    }
  }
}, 60 * 1000) // Clean up every minute