import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Rate limiting store (in production, use Redis or similar)
const rateLimit = new Map()

export function middleware(request: NextRequest) {
  // Security headers
  const response = NextResponse.next()
  
  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.openai.com https://api.anthropic.com https://api.perplexity.ai https://api.deepseek.com https://agent-prod.studio.lyzr.ai;"
  )

  // Basic rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '127.0.0.1'
    const limit = 100 // requests per window
    const windowMs = 15 * 60 * 1000 // 15 minutes

    if (!rateLimit.has(ip)) {
      rateLimit.set(ip, { count: 0, resetTime: Date.now() + windowMs })
    }

    const rateLimitInfo = rateLimit.get(ip)

    if (Date.now() > rateLimitInfo.resetTime) {
      rateLimitInfo.count = 0
      rateLimitInfo.resetTime = Date.now() + windowMs
    }

    if (rateLimitInfo.count >= limit) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }

    rateLimitInfo.count++
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}