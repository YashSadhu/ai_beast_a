import crypto from 'crypto'
import { z } from 'zod'

// Input validation schemas
export const chatMessageSchema = z.object({
  message: z.string()
    .min(1, 'Message cannot be empty')
    .max(4000, 'Message too long')
    .refine(val => val.trim().length > 0, 'Message cannot be only whitespace'),
  userApiKey: z.string().optional()
})

export const enhanceQuerySchema = z.object({
  query: z.string()
    .min(1, 'Query cannot be empty')
    .max(1000, 'Query too long')
})

// API key encryption/decryption
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(32)
const ALGORITHM = 'aes-256-gcm'

export function encryptApiKey(apiKey: string): string {
  try {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY)
    
    let encrypted = cipher.update(apiKey, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  } catch (error) {
    console.error('Encryption error:', error)
    throw new Error('Failed to encrypt API key')
  }
}

export function decryptApiKey(encryptedKey: string): string {
  try {
    const [ivHex, authTagHex, encrypted] = encryptedKey.split(':')
    
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY)
    
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    console.error('Decryption error:', error)
    throw new Error('Failed to decrypt API key')
  }
}

// Content filtering and sanitization
export class ContentFilter {
  private static readonly BLOCKED_PATTERNS = [
    // Malicious patterns
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    
    // Prompt injection attempts
    /ignore\s+previous\s+instructions/gi,
    /system\s*:\s*you\s+are/gi,
    /\[INST\]/gi,
    /\<\|system\|\>/gi,
    
    // Sensitive data patterns
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // emails
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // credit cards
    /\b\d{3}-\d{2}-\d{4}\b/g, // SSN
  ]

  static sanitize(input: string): string {
    let sanitized = input.trim()
    
    // Remove potentially malicious content
    for (const pattern of this.BLOCKED_PATTERNS) {
      sanitized = sanitized.replace(pattern, '[FILTERED]')
    }
    
    // Limit length
    if (sanitized.length > 4000) {
      sanitized = sanitized.substring(0, 4000) + '...'
    }
    
    return sanitized
  }

  static isBlocked(input: string): boolean {
    return this.BLOCKED_PATTERNS.some(pattern => pattern.test(input))
  }

  static detectSensitiveData(input: string): string[] {
    const detected: string[] = []
    
    if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(input)) {
      detected.push('email')
    }
    
    if (/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/.test(input)) {
      detected.push('credit_card')
    }
    
    if (/\b\d{3}-\d{2}-\d{4}\b/.test(input)) {
      detected.push('ssn')
    }
    
    return detected
  }
}

// Rate limiting by user/IP with different tiers
export interface RateLimitTier {
  name: string
  requestsPerMinute: number
  requestsPerHour: number
  requestsPerDay: number
}

export const RATE_LIMIT_TIERS: Record<string, RateLimitTier> = {
  free: {
    name: 'Free',
    requestsPerMinute: 5,
    requestsPerHour: 50,
    requestsPerDay: 200
  },
  premium: {
    name: 'Premium',
    requestsPerMinute: 20,
    requestsPerHour: 500,
    requestsPerDay: 2000
  },
  enterprise: {
    name: 'Enterprise',
    requestsPerMinute: 100,
    requestsPerHour: 5000,
    requestsPerDay: 20000
  }
}

// Security headers middleware
export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-DNS-Prefetch-Control': 'on',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self' https://api.openai.com https://api.anthropic.com https://api.perplexity.ai https://api.deepseek.com https://agent-prod.studio.lyzr.ai",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ')
  }
}

// API key validation
export function validateApiKey(key: string, provider: 'openai' | 'anthropic' | 'perplexity' | 'deepseek'): boolean {
  const patterns = {
    openai: /^sk-[a-zA-Z0-9]{48}$/,
    anthropic: /^sk-ant-[a-zA-Z0-9\-_]{95}$/,
    perplexity: /^pplx-[a-zA-Z0-9]{56}$/,
    deepseek: /^sk-[a-zA-Z0-9]{48}$/
  }
  
  return patterns[provider]?.test(key) || false
}