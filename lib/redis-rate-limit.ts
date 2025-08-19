import { Redis } from 'ioredis'

// Redis client (use connection pooling in production)
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  keyPrefix?: string
}

export async function redisRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const { windowMs, maxRequests, keyPrefix = 'rl' } = config
  const key = `${keyPrefix}:${identifier}`
  const now = Date.now()
  const window = Math.floor(now / windowMs)
  const windowKey = `${key}:${window}`

  try {
    // Use Redis pipeline for atomic operations
    const pipeline = redis.pipeline()
    pipeline.incr(windowKey)
    pipeline.expire(windowKey, Math.ceil(windowMs / 1000))
    
    const results = await pipeline.exec()
    const count = results?.[0]?.[1] as number

    const remaining = Math.max(0, maxRequests - count)
    const resetTime = (window + 1) * windowMs

    return {
      success: count <= maxRequests,
      remaining,
      resetTime,
    }
  } catch (error) {
    console.error('Redis rate limit error:', error)
    // Fallback to allow request if Redis is down
    return { success: true, remaining: maxRequests, resetTime: now + windowMs }
  }
}

// Sliding window rate limiter (more accurate)
export async function slidingWindowRateLimit(
  identifier: string,
  config: RateLimitConfig
): Promise<{ success: boolean; remaining: number; resetTime: number }> {
  const { windowMs, maxRequests, keyPrefix = 'sw' } = config
  const key = `${keyPrefix}:${identifier}`
  const now = Date.now()
  const windowStart = now - windowMs

  try {
    // Remove old entries and add current request
    const pipeline = redis.pipeline()
    pipeline.zremrangebyscore(key, 0, windowStart)
    pipeline.zadd(key, now, `${now}-${Math.random()}`)
    pipeline.zcard(key)
    pipeline.expire(key, Math.ceil(windowMs / 1000))
    
    const results = await pipeline.exec()
    const count = results?.[2]?.[1] as number

    const remaining = Math.max(0, maxRequests - count)
    const resetTime = now + windowMs

    return {
      success: count <= maxRequests,
      remaining,
      resetTime,
    }
  } catch (error) {
    console.error('Redis sliding window error:', error)
    return { success: true, remaining: maxRequests, resetTime: now + windowMs }
  }
}