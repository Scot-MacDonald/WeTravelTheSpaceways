'use client'

import { useRouter } from 'next/navigation'

export function BackHomeButton() {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.push('/')} className="backHomeButton">
      Back
    </button>
  )
}
