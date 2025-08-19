// Google Analytics
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// PostHog Analytics
export const posthog = {
  capture: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture(event, properties)
    }
  },
  identify: (userId: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.identify(userId, properties)
    }
  },
}

// Type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    posthog: {
      capture: (event: string, properties?: Record<string, any>) => void
      identify: (userId: string, properties?: Record<string, any>) => void
    }
  }
}