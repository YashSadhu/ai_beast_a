interface CircuitBreakerOptions {
  failureThreshold: number
  recoveryTimeout: number
  monitoringPeriod: number
}

enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED
  private failureCount = 0
  private lastFailureTime = 0
  private nextAttemptTime = 0

  constructor(
    private name: string,
    private options: CircuitBreakerOptions = {
      failureThreshold: 5,
      recoveryTimeout: 60000, // 1 minute
      monitoringPeriod: 10000  // 10 seconds
    }
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error(`Circuit breaker is OPEN for ${this.name}`)
      }
      this.state = CircuitState.HALF_OPEN
    }

    try {
      const result = await operation()
      this.onSuccess()
      return result
    } catch (error) {
      this.onFailure()
      throw error
    }
  }

  private onSuccess(): void {
    this.failureCount = 0
    this.state = CircuitState.CLOSED
  }

  private onFailure(): void {
    this.failureCount++
    this.lastFailureTime = Date.now()

    if (this.failureCount >= this.options.failureThreshold) {
      this.state = CircuitState.OPEN
      this.nextAttemptTime = Date.now() + this.options.recoveryTimeout
    }
  }

  getState(): { state: CircuitState; failureCount: number; lastFailureTime: number } {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    }
  }
}

// Circuit breakers for each AI service
export const circuitBreakers = {
  sonar: new CircuitBreaker('sonar-api'),
  sonnet: new CircuitBreaker('sonnet-api'),
  deepseek: new CircuitBreaker('deepseek-api'),
  gpt: new CircuitBreaker('gpt-api')
}