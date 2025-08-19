import { Redis } from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

interface MetricData {
  timestamp: number
  value: number
  tags?: Record<string, string>
}

interface AlertRule {
  metric: string
  threshold: number
  operator: 'gt' | 'lt' | 'eq'
  duration: number // seconds
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export class MonitoringService {
  private metricsPrefix = 'metrics'
  private alertsPrefix = 'alerts'

  // Record custom metrics
  async recordMetric(name: string, value: number, tags?: Record<string, string>): Promise<void> {
    const metric: MetricData = {
      timestamp: Date.now(),
      value,
      tags
    }

    try {
      const key = `${this.metricsPrefix}:${name}`
      await redis.zadd(key, metric.timestamp, JSON.stringify(metric))
      
      // Keep only last 24 hours of data
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000)
      await redis.zremrangebyscore(key, 0, oneDayAgo)
      
      // Set expiry
      await redis.expire(key, 86400) // 24 hours
    } catch (error) {
      console.error('Failed to record metric:', error)
    }
  }

  // Get metrics for a time range
  async getMetrics(name: string, startTime: number, endTime: number): Promise<MetricData[]> {
    try {
      const key = `${this.metricsPrefix}:${name}`
      const results = await redis.zrangebyscore(key, startTime, endTime)
      
      return results.map(result => JSON.parse(result))
    } catch (error) {
      console.error('Failed to get metrics:', error)
      return []
    }
  }

  // Calculate aggregated metrics
  async getAggregatedMetrics(name: string, duration: number): Promise<{
    avg: number
    min: number
    max: number
    count: number
    p95: number
    p99: number
  }> {
    const endTime = Date.now()
    const startTime = endTime - duration
    const metrics = await this.getMetrics(name, startTime, endTime)
    
    if (metrics.length === 0) {
      return { avg: 0, min: 0, max: 0, count: 0, p95: 0, p99: 0 }
    }

    const values = metrics.map(m => m.value).sort((a, b) => a - b)
    const sum = values.reduce((a, b) => a + b, 0)
    
    return {
      avg: sum / values.length,
      min: values[0],
      max: values[values.length - 1],
      count: values.length,
      p95: values[Math.floor(values.length * 0.95)],
      p99: values[Math.floor(values.length * 0.99)]
    }
  }

  // Health check for all services
  async healthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy'
    services: Record<string, boolean>
    metrics: Record<string, number>
  }> {
    const services = {
      redis: await this.checkRedis(),
      database: await this.checkDatabase(),
      sonar: await this.checkApiHealth('sonar'),
      sonnet: await this.checkApiHealth('sonnet'),
      deepseek: await this.checkApiHealth('deepseek'),
      gpt: await this.checkApiHealth('gpt')
    }

    const healthyServices = Object.values(services).filter(Boolean).length
    const totalServices = Object.keys(services).length
    const healthRatio = healthyServices / totalServices

    let status: 'healthy' | 'degraded' | 'unhealthy'
    if (healthRatio >= 0.8) status = 'healthy'
    else if (healthRatio >= 0.5) status = 'degraded'
    else status = 'unhealthy'

    // Get recent metrics
    const recentMetrics = await this.getAggregatedMetrics('response_time', 5 * 60 * 1000) // 5 minutes

    return {
      status,
      services,
      metrics: {
        avgResponseTime: recentMetrics.avg,
        p95ResponseTime: recentMetrics.p95,
        requestCount: recentMetrics.count
      }
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      await redis.ping()
      return true
    } catch {
      return false
    }
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      // Add database health check here
      return true
    } catch {
      return false
    }
  }

  private async checkApiHealth(model: string): Promise<boolean> {
    try {
      const key = `api_health:${model}`
      const lastCheck = await redis.get(key)
      
      if (!lastCheck) return false
      
      const data = JSON.parse(lastCheck)
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
      
      return data.timestamp > fiveMinutesAgo && data.healthy
    } catch {
      return false
    }
  }

  // Record API health status
  async recordApiHealth(model: string, healthy: boolean, responseTime?: number): Promise<void> {
    try {
      const key = `api_health:${model}`
      const data = {
        healthy,
        responseTime,
        timestamp: Date.now()
      }
      
      await redis.setex(key, 600, JSON.stringify(data)) // 10 minutes TTL
    } catch (error) {
      console.error('Failed to record API health:', error)
    }
  }
}

// Singleton instance
export const monitoring = new MonitoringService()

// Middleware for automatic metrics collection
export function withMetrics<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  metricName: string
): T {
  return (async (...args: any[]) => {
    const startTime = Date.now()
    
    try {
      const result = await fn(...args)
      const duration = Date.now() - startTime
      
      await monitoring.recordMetric(`${metricName}_duration`, duration)
      await monitoring.recordMetric(`${metricName}_success`, 1)
      
      return result
    } catch (error) {
      const duration = Date.now() - startTime
      
      await monitoring.recordMetric(`${metricName}_duration`, duration)
      await monitoring.recordMetric(`${metricName}_error`, 1)
      
      throw error
    }
  }) as T
}