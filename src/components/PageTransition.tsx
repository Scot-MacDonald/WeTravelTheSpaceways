'use client'

import { AnimatePresence, motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { HomeScene } from '@/components/HomeScene'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isHome = pathname === '/'
  const isLeft = pathname === '/left'
  const isOverlayRoute = isHome || isLeft

  const [leftContent, setLeftContent] = useState<React.ReactNode | null>(null)
  const [showLeftOverlay, setShowLeftOverlay] = useState(false)

  useEffect(() => {
    if (isLeft) {
      setLeftContent(children)
      setShowLeftOverlay(true)
    }

    if (isHome) {
      setShowLeftOverlay(false)
    }
  }, [isLeft, isHome, children])

  if (!isOverlayRoute) {
    return <>{children}</>
  }

  return (
    <div className="overlayStack">
      <HomeScene interactive={isHome} />

      <AnimatePresence
        initial={false}
        mode="sync"
        onExitComplete={() => {
          if (!isLeft) {
            setLeftContent(null)
          }
        }}
      >
        {showLeftOverlay && leftContent && (
          <motion.div
            key="left-overlay"
            className="leftOverlay"
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '100%' }}
            transition={{
              duration: 0.85,
              ease: [0.76, 0, 0.24, 1],
            }}
          >
            {leftContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
