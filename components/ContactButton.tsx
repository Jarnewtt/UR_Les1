"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiInstagram, FiMail } from "react-icons/fi"
import { usePathname } from "next/navigation"
import { trackContactToggle, trackSocialClick } from "@/lib/analytics"

const BLUE = "#1A1AFF"
const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function ContactButton() {
  const pathname = usePathname()
  const onContactPage = pathname === "/contact"
  const [isOpen,     setIsOpen]     = useState(false)
  const [isMobile,   setIsMobile]   = useState(false)
  const [overBlue,   setOverBlue]   = useState(false)
  const [footerOpen, setFooterOpen] = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)

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

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [isOpen])

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false) }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [])

  return (
    <>
      <style>{`
        .cb-qr { flex-shrink: 0; }
        @media (max-width: 600px) { .cb-qr { width: 100%; display: flex; justify-content: center; } }
      `}</style>

      {/* ── OVERLAY ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cb-overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: "fixed", inset: 0, zIndex: 99990,
              background: "rgba(0,0,0,0.82)",
              backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "clamp(16px,4vw,48px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.36, ease: E }}
              onClick={e => e.stopPropagation()}
              style={{
                background: "#0A0A0A",
                width: "100%", maxWidth: 860,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Cobalt top accent */}
              <div style={{ height: 2, background: `linear-gradient(90deg, ${BLUE}, ${BLUE}55 60%, transparent)` }} />

              {/* Close */}
              <div style={{ display: "flex", justifyContent: "flex-end", padding: "14px 20px 0" }}>
                <button
                  onClick={() => setIsOpen(false)}
                  style={{
                    background: BLUE, border: "none",
                    color: "#fff",
                    padding: "9px 20px",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12, letterSpacing: "0.26em", textTransform: "uppercase",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
                    transition: "opacity 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.82")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  Sluit
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Card content */}
              <div style={{ padding: "clamp(20px,4vw,52px) clamp(20px,4vw,52px) clamp(28px,4vw,52px)", display: "flex", flexDirection: "column", gap: "clamp(24px,4vw,48px)" }}>

                {/* Heading */}
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(44px,9vw,108px)", lineHeight: 0.88, letterSpacing: "0.01em", color: "#fff" }}>
                    Vertel me wat
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(44px,9vw,108px)", lineHeight: 0.88, letterSpacing: "0.01em", color: BLUE }}>
                    je wil,
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(44px,9vw,108px)", lineHeight: 0.88, letterSpacing: "0.01em", color: "#fff" }}>
                    ik maak het
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(44px,9vw,108px)", lineHeight: 0.88, letterSpacing: "0.01em", color: BLUE }}>
                    verschil
                  </div>
                </div>

                {/* Bottom: description + links + QR */}
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 28 }}>

                  {/* Left: bio + icon buttons */}
                  <div style={{ flex: "1 1 260px", display: "flex", flexDirection: "column", gap: 24 }}>
                    <p style={{
                      fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
                      fontSize: "clamp(15px,1.2vw,17px)", lineHeight: 1.8,
                      color: "rgba(255,255,255,0.5)", maxWidth: "42ch", margin: 0,
                    }}>
                      Grafisch ontwerper gespecialiseerd in branding, verpakking en digitale campagnes.
                      Ik verdiep me in elk project om tot heldere en esthetische oplossingen te komen.
                    </p>

                    <div style={{ display: "flex", gap: 12 }}>
                      <a
                        href="https://www.instagram.com/jarne_wtt"
                        target="_blank" rel="noopener noreferrer"
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 48, height: 48,
                          border: "1px solid rgba(255,255,255,0.25)",
                          color: "#fff", textDecoration: "none",
                          transition: "background 0.2s, border-color 0.2s",
                        }}
                        onClick={() => trackSocialClick('instagram', 'contact')}
                        onMouseEnter={e => { e.currentTarget.style.background = BLUE; e.currentTarget.style.borderColor = BLUE }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)" }}
                      >
                        <FiInstagram size={20} />
                      </a>
                      <a
                        href="mailto:jarnewaterschoot@hotmail.com"
                        onClick={() => trackSocialClick('email', 'contact')}
                        style={{
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          width: 48, height: 48,
                          border: "1px solid rgba(255,255,255,0.25)",
                          color: "#fff", textDecoration: "none",
                          transition: "background 0.2s, border-color 0.2s",
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = BLUE; e.currentTarget.style.borderColor = BLUE }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)" }}
                      >
                        <FiMail size={20} />
                      </a>
                    </div>
                  </div>

                  {/* Right: QR code */}
                  <div className="cb-qr">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=mailto%3Ajarnewaterschoot%40hotmail.com&bgcolor=ffffff&color=0a0a0a&qzone=2"
                      alt="QR — mail Jarne"
                      width={160}
                      height={160}
                      style={{ display: "block" }}
                    />
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING BUTTON ────────────────────────────────────────────────── */}
      {!footerOpen && (
        <div style={{
          position: "fixed",
          bottom: isMobile ? 94 : 28,
          left: isMobile ? "auto" : 28,
          right: isMobile ? 28 : "auto",
          zIndex: 9995,
          pointerEvents: "none",
        }}>
          <motion.button
            onClick={() => { const next = !isOpen; setIsOpen(next); trackContactToggle(next ? 'open' : 'close') }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            style={{
              pointerEvents: "all",
              position: "relative",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: isMobile ? 0 : 9,
              background: isMobile
                ? ((overBlue || onContactPage) && !footerOpen && !menuOpen ? "#fff" : BLUE)
                : (isOpen ? "#1A1A1A" : "#111"),
              color: isMobile
                ? ((overBlue || onContactPage) && !footerOpen && !menuOpen ? BLUE : "#fff")
                : "#fff",
              border: isMobile ? "none" : "1px solid rgba(255,255,255,0.12)",
              width:  isMobile ? 56 : "auto",
              height: isMobile ? 56 : "auto",
              padding: isMobile ? 0 : "11px 20px",
              borderRadius: isMobile ? 14 : 0,
              cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
              fontSize: 13, letterSpacing: "0.26em", textTransform: "uppercase",
              boxShadow: isMobile
                ? ((overBlue || onContactPage) && !footerOpen && !menuOpen
                    ? "0 4px 28px rgba(255,255,255,0.3), 0 1px 6px rgba(0,0,0,0.12)"
                    : "0 4px 28px rgba(26,26,255,0.38), 0 1px 6px rgba(0,0,0,0.18)")
                : "0 4px 24px rgba(0,0,0,0.5)",
              WebkitTapHighlightColor: "transparent",
              transition: "background 0.3s, color 0.3s, box-shadow 0.3s",
            }}
          >
            {isOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="square">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : isMobile ? (
              <FiMail size={20} />
            ) : (
              <>
                <motion.span
                  animate={{ opacity: [1, 0.25, 1] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  style={{ width: 5, height: 5, borderRadius: "50%", background: BLUE, flexShrink: 0 }}
                />
                Contact
              </>
            )}
          </motion.button>
        </div>
      )}
    </>
  )
}
