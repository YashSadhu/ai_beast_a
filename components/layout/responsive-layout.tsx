'use client'

import { useState, useEffect } from 'react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { cn } from '@/lib/utils'

interface ResponsiveLayoutProps {
  children: React.ReactNode
  modelToggles: Record<string, boolean>
  onToggleModel: (model: string) => void
  onOpenSettings: () => void
}

export function ResponsiveLayout({ 
  children, 
  modelToggles, 
  onToggleModel, 
  onOpenSettings 
}: ResponsiveLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        modelToggles={modelToggles}
        onToggleModel={onToggleModel}
        onOpenSettings={onOpenSettings}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />

      <div className="flex">
        {/* Sidebar for mobile */}
        {isMobile && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            modelToggles={modelToggles}
            onToggleModel={onToggleModel}
          />
        )}

        {/* Main content */}
        <main className={cn(
          "flex-1 transition-all duration-300",
          isMobile && sidebarOpen && "blur-sm"
        )}>
          {children}
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}