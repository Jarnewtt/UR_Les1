'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackScrollDepth } from '@/lib/analytics'

export default function ScrollDepthTracker() {
  const pathname = usePathname()
  const fired = useRef(new Set<number>())

  useEffect(() => {
    fired.current = new Set()

    const check = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      if (total <= 0) return

      const pct = Math.round((scrolled / total) * 100)
      const milestones = [25, 50, 75, 100] as const

      for (const m of milestones) {
        if (pct >= m && !fired.current.has(m)) {
          fired.current.add(m)
          trackScrollDepth(m, pathname)
        }
      }
    }

    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [pathname])

  return null
}
