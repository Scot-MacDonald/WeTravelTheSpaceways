'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { HomeScene } from '@/components/HomeScene'

export function LeftOverlayShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isClosing, setIsClosing] = useState(false)
  const hasAddedHistoryEntry = useRef(false)

  function goHome() {
    if (isClosing) return

    setIsClosing(true)

    window.setTimeout(() => {
      router.replace('/')
    }, 850)
  }

  useEffect(() => {
    if (!hasAddedHistoryEntry.current) {
      window.history.pushState({ leftOverlay: true }, '', window.location.href)
      hasAddedHistoryEntry.current = true
    }

    function handlePopState() {
      goHome()
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [isClosing])

  return (
    <div className="leftOverlayScene">
      <HomeScene interactive={false} initialRotation={isClosing ? 180 : 0} />

      <div className={`leftOverlayPanel ${isClosing ? 'isClosing' : ''}`}>
        <button type="button" onClick={goHome} className="backHomeButton">
          Back
        </button>

        {children}
      </div>
    </div>
  )
}
