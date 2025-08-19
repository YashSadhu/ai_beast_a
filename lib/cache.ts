import { Redis } from 'ioredis'
import crypto from 'crypto'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

interface CacheOptions {
  ttl?: number // Time to live in seconds
  prefix?: string
}

export class CacheManager {
  private defaultTTL = 3600 // 1 hour
  private prefix = 'cache'

  constructor(options?: CacheOptions) {
    if (options?.ttl) this.defaultTTL = options.ttl
    if (options?.prefix) this.prefix = options.prefix
  }

  // Generate cache key from message content
  private generateKey(model: string, message: string, userApiKey?: string): string {
    const content = `${model}:${message}:${userApiKey ? 'user' : 'default'}`
    const hash = crypto.createHash('sha256').update(content).digest('hex').substring(0, 16)
    return `${this.prefix}:${model}:${hash}`
  }

  async get(model: string, message: string, userApiKey?: string): Promise<string | null> {
    try {
      const key = this.generateKey(model, message, userApiKey)
      const cached = await redis.get(key)
      
      if (cached) {
        // Update TTL on cache hit
        await redis.expire(key, this.defaultTTL)
        return cached
      }
      
      return null
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  async set(model: string, message: string, response: string, userApiKey?: string, ttl?: number): Promise<void> {
    try {
      const key = this.generateKey(model, message, userApiKey)
      const expiry = ttl || this.defaultTTL
      
      await redis.setex(key, expiry, response)
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      const keys = await redis.keys(`${this.prefix}:${pattern}`)
      if (keys.length > 0) {
        await redis.del(...keys)
      }
    } catch (error) {
      console.error('Cache invalidation error:', error)
    }
  }

  // Get cache statistics
  async getStats(): Promise<{ totalKeys: number; memoryUsage: string }> {
    try {
      const keys = await redis.keys(`${this.prefix}:*`)
      const info = await redis.memory('usage', `${this.prefix}:*`)
      
      return {
        totalKeys: keys.length,
        memoryUsage: `${Math.round((info as number) / 1024 / 1024 * 100) / 100} MB`
      }
    } catch (error) {
      console.error('Cache stats error:', error)
      return { totalKeys: 0, memoryUsage: '0 MB' }
    }
  }
}

// Singleton instance
export const cache = new CacheManager({
  ttl: 1800, // 30 minutes for AI responses
  prefix: 'ai_beast'
})