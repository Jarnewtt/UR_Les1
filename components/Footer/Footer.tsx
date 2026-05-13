"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { usePathname } from "next/navigation"
import FooterIndustrial from "@/components/FooterIndustrial"
import { trackFooterToggle } from "@/lib/analytics"

const EASE_IN:  [number, number, number, number] = [0.16, 1, 0.3, 1]
const EASE_OUT: [number, number, number, number] = [0.4, 0, 0.6, 1]

const ACCENT = "#1A1AFF"

interface FooterProps { accentColor?: string }

export default function Footer({ accentColor }: FooterProps) {
  const pathname = usePathname()
  const onContactPage = pathname === "/contact"
  const [isOpen,   setIsOpen]   = useState(false)
  const [overBlue, setOverBlue] = useState(false)
  const [footerBg, setFooterBg] = useState("#080808")

  // Broadcast open state so other fixed buttons can react
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("footer-change", { detail: { isOpen } }))
  }, [isOpen])

  // Keep footer background in sync with theme
  useEffect(() => {
    const update = () => {
      const isDark = document.documentElement.classList.contains("theme-dark")
      setFooterBg(isDark ? "#080808" : "#F5F4F0")
    }
    update()
    window.addEventListener("theme-change", update)
    return () => window.removeEventListener("theme-change", update)
  }, [])

  // Detect when the arrow strip overlaps the contact section
  useEffect(() => {
    const isOverBlue = (id: string) => {
      const el = document.getElementById(id)
      if (!el) return false
      const r = el.getBoundingClientRect()
      const stripTop = window.innerHeight - 48
      return r.top <= window.innerHeight && r.bottom >= stripTop
    }
    const check = () => {
      setOverBlue(isOverBlue("contact-section") || isOverBlue("project-nav-section"))
    }
    window.addEventListener("scroll", check, { passive: true })
    window.addEventListener("resize", check)
    check()
    return () => {
      window.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
    }
  }, [])

  const arrowColor = (overBlue || onContactPage) && !isOpen ? "#fff" : ACCENT

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      zIndex: 200, pointerEvents: "none",
      display: "flex", flexDirection: "column",
    }}>

      {/* Footer drawer */}
      <div style={{ overflow: "hidden", width: "100%", pointerEvents: "none" }}>
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="footer-body"
              initial={{ y: "100%" }}
              animate={{ y: 0,       transition: { duration: 0.48, ease: EASE_IN  } }}
              exit={{   y: "100%",   transition: { duration: 0.32, ease: EASE_OUT } }}
              style={{ pointerEvents: "all" }}
            >
              <div style={{ background: footerBg, maxHeight: "85vh", overflowY: "auto" }}>
                <FooterIndustrial accentColor={accentColor} onClose={() => setIsOpen(false)} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Arrow strip */}
      <motion.div
        animate={{ backgroundColor: isOpen ? footerBg : "rgba(0,0,0,0)" }}
        transition={{ duration: isOpen ? 0.48 : 0.32, ease: isOpen ? EASE_IN : EASE_OUT }}
        style={{
          display: "flex", justifyContent: "center",
          width: "100%",
          pointerEvents: "all",
        }}
      >
        <button
          onClick={() => { const next = !isOpen; setIsOpen(next); trackFooterToggle(next ? 'open' : 'close') }}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Verberg footer" : "Toon footer"}
          style={{
            width: 64, height: 48,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <motion.div
            animate={{ y: isOpen ? 0 : [0, -5, 0] }}
            transition={
              isOpen
                ? { duration: 0.25, ease: EASE_IN }
                : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
            }
            style={{ display: "flex", alignItems: "center" }}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.32, ease: EASE_IN }}
              style={{ display: "flex" }}
            >
              <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
                <path
                  d="M1 9L8 2L15 9"
                  stroke={arrowColor}
                  strokeWidth="1.8"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  style={{ transition: "stroke 0.3s" }}
                />
              </svg>
            </motion.div>
          </motion.div>
        </button>
      </motion.div>

    </div>
  )
}
