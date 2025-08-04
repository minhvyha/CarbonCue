"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LoadingOverlayProps {
  isVisible: boolean
}

export function LoadingOverlay({ isVisible }: LoadingOverlayProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300",
        isVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
      )}
    >
      {/* Dark backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Loading animation container */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        {/* Hollow circle animation */}
<div className="relative w-16 h-16">
  {/* Outer rotating circle */}
  <div
    className="absolute inset-0
               w-16 h-16
               border-4 border-transparent border-t-carbon-red border-r-carbon-magenta
               rounded-full
               animate-spin"
  />

  {/* Centered wrapper for the two inner circles */}
  <div className="absolute inset-0 flex items-center justify-center">
    {/* Inner pulsing circle */}
    <div className="w-16 h-16 border-4 border-carbon-red/30 rounded-full animate-pulse flex items-center justify-center">
      {/* Center ping dot */}
      <div className="w-8 h-8 bg-gradient-to-r from-carbon-red to-carbon-magenta rounded-full animate-ping" />
    </div>
  </div>
</div>


        {/* Loading text */}
        <div className="mt-6 text-white font-medium text-lg tracking-wide">
          <span className="inline-block animate-pulse">Loading</span>
          <span className="inline-block animate-bounce ml-1 delay-100">.</span>
          <span className="inline-block animate-bounce ml-1 delay-200">.</span>
          <span className="inline-block animate-bounce ml-1 delay-300">.</span>
        </div>

        {/* Subtitle */}
        <div className="mt-2 text-white/70 text-sm">Please wait while we prepare your content</div>
      </div>
    </div>
  )
}
