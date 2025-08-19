type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  metadata?: Record<string, any>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(level: LogLevel, message: string, metadata?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
    }
  }

  private log(entry: LogEntry) {
    if (this.isDevelopment) {
      const { level, message, timestamp, metadata } = entry
      console[level === 'debug' ? 'log' : level](
        `[${timestamp}] ${level.toUpperCase()}: ${message}`,
        metadata ? metadata : ''
      )
    }

    // In production, send to logging service (e.g., Sentry, LogRocket, etc.)
    if (!this.isDevelopment) {
      // Example: Send to external logging service
      // this.sendToLoggingService(entry)
    }
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log(this.formatMessage('info', message, metadata))
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log(this.formatMessage('warn', message, metadata))
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    const errorMetadata = error
      ? {
          ...metadata,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        }
      : metadata

    this.log(this.formatMessage('error', message, errorMetadata))
  }

  debug(message: string, metadata?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log(this.formatMessage('debug', message, metadata))
    }
  }

  // Method to send logs to external service in production
  private async sendToLoggingService(entry: LogEntry) {
    try {
      // Example implementation for external logging service
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // })
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }
}

export const logger = new Logger()