"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { trackSurveyToggle } from "@/lib/analytics"

const SURVEY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdoWTGC_5GOFbgfPOVd7nNMQOxbnOmrNqFqJbmEvIp3AUc43Q/viewform?embedded=true"

const BLUE = "#1A1AFF"
const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ── SURVEY PANEL + BUTTON ─────────────────────────────────────────────────────
export default function SurveyButton() {
  const pathname = usePathname()
  const onContactPage = pathname === "/contact"
  const [isOpen,   setIsOpen]   = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [overBlue,     setOverBlue]     = useState(false)
  const [footerOpen,   setFooterOpen]   = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)")
    setIsMobile(mq.matches)
    const h = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener("change", h)
    return () => mq.removeEventListener("change", h)
  }, [])

  useEffect(() => {
    const h = (e: Event) => setFooterOpen((e as CustomEvent).detail.isOpen)
    window.addEventListener("footer-change", h)
    return () => window.removeEventListener("footer-change", h)
  }, [])

  useEffect(() => {
    const h = (e: Event) => setMenuOpen((e as CustomEvent).detail.isOpen)
    window.addEventListener("menu-change", h)
    return () => window.removeEventListener("menu-change", h)
  }, [])

  useEffect(() => {
    const isVisible = (id: string) => {
      const el = document.getElementById(id)
      if (!el) return false
      const r = el.getBoundingClientRect()
      return r.top < window.innerHeight && r.bottom > 0
    }
    const check = () => {
      setOverBlue(isVisible("contact-section") || isVisible("project-nav-section"))
    }
    window.addEventListener("scroll", check, { passive: true })
    window.addEventListener("resize", check)
    check()
    return () => {
      window.removeEventListener("scroll", check)
      window.removeEventListener("resize", check)
    }
  }, [])

  return (
    <>
      {/* ── Side panel ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="survey-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.42, ease: E }}
            style={{
              position: "fixed",
              top: 0, right: 0, bottom: 0,
              width: "min(480px, 100vw)",
              zIndex: 9990,
              background: "#fff",
              boxShadow: "-6px 0 48px rgba(0,0,0,0.18)",
              display: "flex", flexDirection: "column",
              pointerEvents: "all",
            }}
          >
            {/* Panel header */}
            <div style={{
              display: "flex", alignItems: "center",
              justifyContent: "space-between",
              padding: "0 20px", height: 56,
              background: BLUE, flexShrink: 0,
            }}>
              {/* Left: icon + label */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2.2" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                  <rect x="9" y="3" width="6" height="4" rx="1"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
                <span style={{
                  fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600,
                  letterSpacing: "0.24em", textTransform: "uppercase", color: "#fff",
                }}>
                  Enquête
                </span>
              </div>

            </div>

            {/* Google Form iframe */}
            <iframe
              src={SURVEY_URL}
              title="Enquête"
              style={{ flex: 1, border: "none", display: "block" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating toggle button ─────────────────────────────────────────── */}
      <div style={{
        position: "fixed", bottom: 28, right: 28,
        zIndex: 9995, pointerEvents: "none",
      }}>
  
        <motion.button
          onClick={() => { const next = !isOpen; setIsOpen(next); trackSurveyToggle(next ? 'open' : 'close') }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            pointerEvents: "all",
            position: "relative",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: isMobile ? 0 : 10,
            background: (overBlue || onContactPage) && !footerOpen && !menuOpen ? "#fff" : BLUE,
            color: (overBlue || onContactPage) && !footerOpen && !menuOpen ? BLUE : "#fff",
            width:  isMobile ? 56 : "auto",
            height: isMobile ? 56 : "auto",
            padding: isMobile ? 0 : "13px 22px",
            borderRadius: isMobile ? 14 : 4,
            border: "none", cursor: "pointer",
            fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600,
            letterSpacing: "0.24em", textTransform: "uppercase",
            boxShadow: (overBlue || onContactPage) && !footerOpen && !menuOpen
              ? "0 4px 28px rgba(255,255,255,0.3), 0 1px 6px rgba(0,0,0,0.12)"
              : "0 4px 28px rgba(26,26,255,0.38), 0 1px 6px rgba(0,0,0,0.18)",
            whiteSpace: "nowrap",
            WebkitTapHighlightColor: "transparent",
            transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
          }}
        >
          {isOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.2" strokeLinecap="square">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          ) : (
            <>
              <svg width={isMobile ? 20 : 14} height={isMobile ? 20 : 14} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="square" strokeLinejoin="miter">
                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
                <rect x="9" y="3" width="6" height="4" rx="1"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
              <span className="survey-label">Enquête</span>
            </>
          )}
        </motion.button>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .survey-label { display: none }
        }
      `}</style>
    </>
  )
}


