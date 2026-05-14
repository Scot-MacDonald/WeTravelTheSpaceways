import React from 'react'

import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
