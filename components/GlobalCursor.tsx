"use client"

import { useEffect } from "react"
import { useMotionValue, useSpring, motion } from "framer-motion"
import { useStyle } from "@/components/useStyle"

export default function GlobalCursor() {
  const { style } = useStyle()
  const color = style === "industrial" ? "#FF5C1A" : "#E8280A"

  const cx = useMotionValue(-100)
  const cy = useMotionValue(-100)
  const sx = useSpring(cx, { stiffness: 500, damping: 28 })
  const sy = useSpring(cy, { stiffness: 500, damping: 28 })
  const tx = useSpring(cx, { stiffness: 100, damping: 18 })
  const ty = useSpring(cy, { stiffness: 100, damping: 18 })

  useEffect(() => {
    const move = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY) }
    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [cx, cy])

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