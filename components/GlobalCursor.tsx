"use client"

import { useEffect, useState } from "react"
import { useMotionValue, useSpring, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import { useStyle } from "@/components/useStyle"

function useCursorColor(style: string, pathname: string): string {
  if (pathname.startsWith("/CineCity"))      return "#9333EA"
  if (pathname.startsWith("/Chocolate"))     return "#D97706"
  if (pathname.startsWith("/Architectuur"))  return style === "industrial" ? "#C9A96E" : "#E8280A"
  return style === "industrial" ? "#FF5C1A" : "#E8280A"
}

export default function GlobalCursor() {
  const { style } = useStyle()
  const pathname = usePathname()
  const color = useCursorColor(style, pathname)

  /* Only render on devices with a fine pointer (mouse/trackpad).
   * Touch screens have pointer:coarse — no cursor needed there. */
  const [isMouse, setIsMouse] = useState(false)

  useEffect(() => {
    function evaluate() {
      const hoverFine = window.matchMedia("(hover: hover) and (pointer: fine)").matches
      // maxTouchPoints > 0 on real phones AND on Chrome DevTools touch simulation.
      // Combine with screen width so a laptop touchscreen (wide) still gets the cursor.
      const likelyTouch = navigator.maxTouchPoints > 0 && window.innerWidth < 1024
      setIsMouse(hoverFine && !likelyTouch)
    }

    evaluate()

    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    mq.addEventListener("change", evaluate)
    window.addEventListener("resize", evaluate, { passive: true })
    return () => {
      mq.removeEventListener("change", evaluate)
      window.removeEventListener("resize", evaluate)
    }
  }, [])

  const cx = useMotionValue(-100)
  const cy = useMotionValue(-100)
  const sx = useSpring(cx, { stiffness: 500, damping: 28 })
  const sy = useSpring(cy, { stiffness: 500, damping: 28 })
  const tx = useSpring(cx, { stiffness: 100, damping: 18 })
  const ty = useSpring(cy, { stiffness: 100, damping: 18 })

  useEffect(() => {
    if (!isMouse) return
    const move = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [isMouse, cx, cy])

  if (!isMouse) return null

  return (
    <>
      {/* Dot */}
      <motion.div style={{
        x: sx, y: sy,
        position: "fixed", top: 0, left: 0,
        zIndex: 99999, pointerEvents: "none",
        width: 6, height: 6, borderRadius: "50%",
        background: color,
        translateX: "-50%", translateY: "-50%",
        transition: "background 0.3s",
      }} />
      {/* Ring */}
      <motion.div style={{
        x: tx, y: ty,
        position: "fixed", top: 0, left: 0,
        zIndex: 99998, pointerEvents: "none",
        width: 32, height: 32, borderRadius: "50%",
        border: `1px solid ${color}`,
        opacity: 0.5,
        translateX: "-50%", translateY: "-50%",
        transition: "border-color 0.3s",
      }} />
    </>
  )
}