'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from './card'
import { Button } from './button'
import { Progress } from './progress'
import { Image, Palette, Wand2, Download, RefreshCw } from 'lucide-react'
import { NeonButton } from './neon-button'

interface FakeImageGeneratorProps {
  prompt: string
  isActive: boolean
  className?: string
}

export function FakeImageGenerator({ prompt, isActive, className = '' }: FakeImageGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [currentStyle, setCurrentStyle] = useState('cyberpunk')

  const imageStyles = [
    'cyberpunk', 'neon', 'holographic', 'matrix', 'synthwave', 'glitch', 'vaporwave', 'digital-art'
  ]

  const generateFakeImage = async () => {
    setIsGenerating(true)
    setProgress(0)

    // Simulate image generation progress
    const progressSteps = [
      'Initializing neural networks...',
      'Processing prompt semantics...',
      'Generating base composition...',
      'Adding style layers...',
      'Enhancing details...',
      'Applying final effects...',
      'Rendering complete!'
    ]

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setProgress(i)
    }

    // Generate fake image URL (placeholder with dynamic parameters)
    const imageUrl = `https://picsum.photos/400/300?random=${Date.now()}&blur=1`
    setGeneratedImages(prev => [imageUrl, ...prev.slice(0, 3)])
    setIsGenerating(false)
    setProgress(0)
  }

  const downloadImage = (imageUrl: string) => {
    const link = document.createElement('a')
    link.href = imageUrl
    link.download = `ai-generated-${Date.now()}.jpg`
    link.click()
  }

  if (!isActive) return null

  return (
    <Card className={`${className} bg-gradient-to-br from-pink-900/20 to-purple-900/20 border-pink-500/30`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image className="w-6 h-6 text-pink-500" />
            <h3 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              AI IMAGE FORGE
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <select 
              value={currentStyle}
              onChange={(e) => setCurrentStyle(e.target.value)}
              className="bg-black/30 border border-pink-500/30 rounded px-2 py-1 text-sm text-pink-400"
            >
              {imageStyles.map(style => (
                <option key={style} value={style} className="bg-black text-pink-400">
                  {style.replace('-', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="p-4 bg-black/30 rounded-lg border border-pink-500/20">
          <p className="text-sm text-gray-300 mb-3">
            <span className="text-pink-400 font-semibold">Prompt:</span> {prompt}
          </p>
          <p className="text-sm text-gray-400">
            <span className="text-purple-400 font-semibold">Style:</span> {currentStyle.replace('-', ' ').toUpperCase()}
          </p>
        </div>

        {isGenerating && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Wand2 className="w-5 h-5 text-pink-500 animate-spin" />
              <span className="text-sm text-pink-400">Generating masterpiece...</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="text-xs text-gray-500 text-center">
              {progress}% complete
            </div>
          </div>
        )}

        <div className="flex space-x-3">
          <NeonButton
            neonColor="pink"
            onClick={generateFakeImage}
            disabled={isGenerating}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Palette className="w-4 h-4 mr-2 animate-pulse" />
                Forging...
              </>
            ) : (
              <>
                <Palette className="w-4 h-4 mr-2" />
                Generate Image
              </>
            )}
          </NeonButton>

          <NeonButton
            neonColor="purple"
            onClick={() => setCurrentStyle(imageStyles[Math.floor(Math.random() * imageStyles.length)])}
            className="px-4"
          >
            <RefreshCw className="w-4 h-4" />
          </NeonButton>
        </div>

        {/* Generated Images Gallery */}
        {generatedImages.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-pink-400 flex items-center">
              <Image className="w-4 h-4 mr-2" />
              Generated Masterpieces
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <div className="relative overflow-hidden rounded-lg border border-pink-500/30">
                    <img
                      src={imageUrl}
                      alt={`Generated image ${index + 1}`}
                      className="w-full h-32 object-cover transition-transform group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                      <Badge variant="outline" className="text-xs border-pink-500/50 bg-black/50">
                        #{index + 1}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => downloadImage(imageUrl)}
                        className="text-white hover:text-pink-400 p-1 h-auto"
                      >
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Holographic effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/20 to-transparent skew-x-12 opacity-0 group-hover:opacity-100 transition-opacity animate-shimmer" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}