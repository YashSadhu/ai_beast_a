import { Redis } from 'ioredis'

interface QueueJob {
  id: string
  type: string
  data: any
  priority: number
  attempts: number
  maxAttempts: number
  createdAt: number
  processAt: number
}

export class JobQueue {
  private redis: Redis
  private queueName: string
  private processing = false

  constructor(queueName: string, redisUrl?: string) {
    this.queueName = queueName
    this.redis = new Redis(redisUrl || process.env.REDIS_URL || 'redis://localhost:6379')
  }

  async addJob(
    type: string,
    data: any,
    options: {
      priority?: number
      delay?: number
      maxAttempts?: number
    } = {}
  ): Promise<string> {
    const job: QueueJob = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      priority: options.priority || 0,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: Date.now(),
      processAt: Date.now() + (options.delay || 0)
    }

    // Add to sorted set with processAt as score for delayed processing
    await this.redis.zadd(
      `queue:${this.queueName}:waiting`,
      job.processAt,
      JSON.stringify(job)
    )

    return job.id
  }

  async processJobs(processor: (job: QueueJob) => Promise<void>): Promise<void> {
    if (this.processing) return
    this.processing = true

    try {
      while (this.processing) {
        const now = Date.now()
        
        // Get jobs ready to process
        const jobs = await this.redis.zrangebyscore(
          `queue:${this.queueName}:waiting`,
          0,
          now,
          'LIMIT',
          0,
          10
        )

        if (jobs.length === 0) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          continue
        }

        for (const jobData of jobs) {
          try {
            const job: QueueJob = JSON.parse(jobData)
            
            // Move to processing
            await this.redis.zrem(`queue:${this.queueName}:waiting`, jobData)
            await this.redis.sadd(`queue:${this.queueName}:processing`, jobData)

            // Process the job
            await processor(job)

            // Remove from processing (job completed)
            await this.redis.srem(`queue:${this.queueName}:processing`, jobData)
            
          } catch (error) {
            console.error('Job processing error:', error)
            
            // Handle failed job
            const job: QueueJob = JSON.parse(jobData)
            await this.handleFailedJob(job, error as Error)
          }
        }
      }
    } finally {
      this.processing = false
    }
  }

  private async handleFailedJob(job: QueueJob, error: Error): Promise<void> {
    job.attempts++

    if (job.attempts >= job.maxAttempts) {
      // Move to failed queue
      await this.redis.lpush(
        `queue:${this.queueName}:failed`,
        JSON.stringify({ ...job, error: error.message })
      )
    } else {
      // Retry with exponential backoff
      const delay = Math.pow(2, job.attempts) * 1000
      job.processAt = Date.now() + delay
      
      await this.redis.zadd(
        `queue:${this.queueName}:waiting`,
        job.processAt,
        JSON.stringify(job)
      )
    }

    // Remove from processing
    await this.redis.srem(
      `queue:${this.queueName}:processing`,
      JSON.stringify(job)
    )
  }

  async getQueueStats(): Promise<{
    waiting: number
    processing: number
    failed: number
  }> {
    const [waiting, processing, failed] = await Promise.all([
      this.redis.zcard(`queue:${this.queueName}:waiting`),
      this.redis.scard(`queue:${this.queueName}:processing`),
      this.redis.llen(`queue:${this.queueName}:failed`)
    ])

    return { waiting, processing, failed }
  }

  stop(): void {
    this.processing = false
  }
}

// AI processing queue
export const aiQueue = new JobQueue('ai-processing')