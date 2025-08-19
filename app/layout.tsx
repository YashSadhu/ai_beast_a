import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Beast-a - Compare AI Models',
  description: 'Compare responses from multiple AI models including GPT-4, Claude, DeepSeek, and Perplexity in real-time. Free forever.',
  keywords: ['AI', 'ChatGPT', 'Claude', 'DeepSeek', 'Perplexity', 'AI Comparison', 'Machine Learning'],
  authors: [{ name: 'AI Beast-a Team' }],
  creator: 'AI Beast-a',
  publisher: 'AI Beast-a',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'AI Beast-a - Compare AI Models',
    description: 'Compare responses from multiple AI models in real-time. Free forever.',
    url: '/',
    siteName: 'AI Beast-a',
    images: [
      {
        url: '/ai-beast-logo.png',
        width: 1200,
        height: 630,
        alt: 'AI Beast-a Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Beast-a - Compare AI Models',
    description: 'Compare responses from multiple AI models in real-time. Free forever.',
    images: ['/ai-beast-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
