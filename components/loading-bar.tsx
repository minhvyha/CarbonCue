'use client'
import { useLoading } from '@/contexts/loading'
import { useEffect, useState } from 'react'

export function LoadingBar() {
  const { loading } = useLoading()
  const [visible, setVisible] = useState(false)

  // mount bar when loading starts
  useEffect(() => {
    if (loading) {
      setVisible(true)
    }
  }, [loading])

  // when opacity transition ends and we're done, unmount
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName === 'opacity' && !loading) {
      setVisible(false)
    }
  }

  if (!visible) return null

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={`
        h-1 bg-primary z-50
        ${loading ? 'w-0 opacity-100' : 'w-full opacity-0'}
      `}
      style={{
        transition: [
          'width 500ms ease-in-out',
          'opacity 500ms ease-in-out 500ms'  // fade after width animation
        ].join(', '),
      }}
    />
  )
}
