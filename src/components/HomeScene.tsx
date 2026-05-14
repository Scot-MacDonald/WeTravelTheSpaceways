'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  interactive?: boolean
  initialRotation?: number
}

export function HomeScene({ interactive = true, initialRotation }: Props) {
  const router = useRouter()

const [rotation, setRotation] = useState(0)

useEffect(() => {
  setRotation(initialRotation ?? (interactive ? 180 : 0))
}, [interactive, initialRotation])  

const [hasDragged, setHasDragged] = useState(false)

  const lastX = useRef(0)
  const animationFrame = useRef<number | null>(null)

  useEffect(() => {
    if (!interactive && typeof initialRotation === 'number') {
      setRotation(initialRotation)
    }
  }, [interactive, initialRotation])

  useEffect(() => {
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
    }
  }, [])

  function clamp(value: number) {
    return Math.max(0, Math.min(180, value))
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (!interactive) return

    e.currentTarget.setPointerCapture(e.pointerId)
    lastX.current = e.clientX
    setHasDragged(true)

    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
    }
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!interactive || e.buttons !== 1) return

    const delta = e.clientX - lastX.current
    lastX.current = e.clientX

    setRotation((current) => clamp(current - delta * 0.7))
  }

  function handlePointerUp() {
    if (!interactive) return

    const snapTarget = rotation < 120 ? 0 : 180
    const startRotation = rotation
    const duration = 450
    const startTime = performance.now()

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3)
    }

    function animate(now: number) {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = easeOutCubic(progress)

      const next = startRotation + (snapTarget - startRotation) * eased
      setRotation(next)

      if (progress < 1) {
        animationFrame.current = requestAnimationFrame(animate)
      } else {
        setRotation(snapTarget)

        if (snapTarget === 0) {
          router.push('/left')
        }
      }
    }


    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current)
    }

    animationFrame.current = requestAnimationFrame(animate)
  }

  return (
    <main className="homePage">
      <div id="contact">
        Scot MacDonald
        <br />
        Design &amp; Web Development
        <br />
        10245 Berlin
        <br />
        Germany
        <br />
        <a href="mailto:mail@scot.com">mail@scot.com</a>
      </div>

      <div className="word up">ALWAYS</div>
      <div className="word right">FLOAT</div>
      <div className="word front">TO</div>

      {interactive && <div className={`dragHint ${hasDragged ? 'hidden' : ''}`}>drag to turn</div>}

      <div
        className={`word left ${interactive ? 'draggable' : ''}`}
        style={{
          transform: `translateY(-50%) rotate(${rotation}deg)`,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        LEFT
      </div>

      <div className="word down">THE</div>
    </main>
  )
}
