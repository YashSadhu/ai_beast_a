import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AI Beast-a - Compare AI Models',
    short_name: 'AI Beast-a',
    description: 'Compare responses from multiple AI models in real-time',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563eb',
    icons: [
      {
        src: '/ai-beast-logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  }
}