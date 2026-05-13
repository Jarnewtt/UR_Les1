'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { trackTimeOnPage } from '@/lib/analytics'

// Fires time_on_page at 30 s, 60 s, 2 min, 5 min — and on page leave.
const MILESTONES = [30, 60, 120, 300] // seconds

export default function EngagementTracker() {
  const pathname = usePathname()
  const startRef  = useRef(Date.now())
  const firedRef  = useRef(new Set<number>())
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    startRef.current = Date.now()
    firedRef.current = new Set()
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []

    // Schedule milestone fires
    for (const s of MILESTONES) {
      const id = setTimeout(() => {
        if (!firedRef.current.has(s)) {
          firedRef.current.add(s)
          trackTimeOnPage(s, pathname)
        }
      }, s * 1000)
      timersRef.current.push(id)
    }

    // Fire exact elapsed time when leaving or hiding page (works on mobile too)
    const onLeave = () => {
      const elapsed = Math.round((Date.now() - startRef.current) / 1000)
      trackTimeOnPage(elapsed, pathname)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') onLeave()
    }

    window.addEventListener('beforeunload', onLeave)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      timersRef.current.forEach(clearTimeout)
      window.removeEventListener('beforeunload', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [pathname])

  return null
}
