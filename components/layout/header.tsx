'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Settings, Home, Menu, X, Zap, Github, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ModelToggleBar } from '@/components/model-toggle-bar'

interface HeaderProps {
  modelToggles: Record<string, boolean>
  onToggleModel: (model: string) => void
  onOpenSettings: () => void
}

export function Header({ modelToggles, onToggleModel, onOpenSettings }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Beast-a
                </h1>
              </div>
            </div>
            
            <Badge variant="secondary" className="hidden sm:inline-flex bg-green-100 text-green-800 border-green-200">
              <Zap className="w-3 h-3 mr-1" />
              Free Forever
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Chat
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href="/landing">
                  About
                </Link>
              </Button>
              
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://github.com/YashSadhu/ai_beast_a" target="_blank">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Link>
              </Button>
            </nav>

            <div className="w-px h-6 bg-gray-200"></div>

            <Button
              variant="outline"
              size="sm"
              onClick={onOpenSettings}
              className="gap-2"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 py-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <nav className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                        <Home className="w-4 h-4 mr-2" />
                        Chat
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/landing" onClick={() => setMobileMenuOpen(false)}>
                        About
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link 
                        href="https://github.com/YashSadhu/ai_beast_a" 
                        target="_blank"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Github className="w-4 h-4 mr-2" />
                        GitHub
                      </Link>
                    </Button>

                    <div className="my-4 border-t"></div>

                    <Button
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        onOpenSettings()
                        setMobileMenuOpen(false)
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </nav>

                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-700">AI Models</h3>
                    <ModelToggleBar 
                      modelToggles={modelToggles} 
                      onToggleModel={onToggleModel}
                      vertical={true}
                    />
                  </div>

                  <div className="mt-auto pt-6 border-t">
                    <div className="flex items-center justify-center gap-4">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="https://twitter.com/YashSadhu" target="_blank">
                          <Twitter className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="https://github.com/YashSadhu" target="_blank">
                          <Github className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                    <p className="text-xs text-center text-gray-500 mt-2">
                      Made with ❤️ by Yash Sadhu
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Model Toggle Bar - Desktop */}
        <div className="hidden md:block pb-4">
          <ModelToggleBar 
            modelToggles={modelToggles} 
            onToggleModel={onToggleModel}
          />
        </div>
      </div>
    </header>
  )
}