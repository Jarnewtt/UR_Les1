"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
type Theme = {
  bg: string; ink: string; mid: string; grey: string; greyLt: string
  red: string; isLight: boolean
}
const DARK: Theme  = { bg:"#111116", ink:"#F2F0EC", mid:"#888884", grey:"#4A4A52", greyLt:"#2A2A32", red:"#E8280A", isLight:false }
const LIGHT: Theme = { bg:"#0A0A0A", ink:"#F2F0EC", mid:"#888884", grey:"#4A4A52", greyLt:"#2A2A32", red:"#E8280A", isLight:false }

function useModernTheme(): Theme {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("theme-light"))
    const handler = (e: Event) => setIsDark((e as CustomEvent).detail.isDark)
    window.addEventListener("theme-change", handler)
    return () => window.removeEventListener("theme-change", handler)
  }, [])
  return isDark ? DARK : LIGHT
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const FOOTER_LINKS = [
  { name: "Gebruiksvoorwaarden",  href: "/terms-of-agreement" },
  { name: "Auteursrecht",         href: "/copyright-regulations" },
  { name: "Cookie-instellingen",  href: "/cookie-settings" },
]

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/jarne_wtt/" },
]

interface FooterProps { accentColor?: string }

export default function Footer({ accentColor: customColor }: FooterProps) {
  const T = useModernTheme()
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()

  let glowColor = customColor || T.red
  if (pathname?.includes("CineCity"))  glowColor = "#a855f7"
  if (pathname?.includes("Chocolate")) glowColor = "#f97316"

  return (
    <footer style={{
      position: "relative",
      background: T.bg,
      color: T.ink,
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      overflow: "hidden",
      transition: "background 0.4s, color 0.4s",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600&family=DM+Mono:wght@300;400&display=swap');
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: "absolute", bottom: 0, right: 0,
        width: 320, height: 320, borderRadius: "50%",
        background: `radial-gradient(circle, ${glowColor}14 0%, transparent 70%)`,
        pointerEvents: "none", transition: "background 0.7s",
      }} />

      {/* Top accent line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, ${T.red}, ${T.red}33 60%, transparent 100%)`,
      }} />

      {/* Left vertical bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
        background: `linear-gradient(to bottom, ${T.red}33, transparent 55%)`,
      }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(20px, 5vw, 60px)" }}>

        {/* ── MAIN ROW ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: EASE }}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap", gap: "16px 40px",
            padding: "28px 0 24px",
            borderBottom: `1px solid ${T.greyLt}`,
          }}
        >
          {/* Name */}
          <div>
            <div style={{
              fontSize: "clamp(28px, 4vw, 52px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: T.ink,
            }}>
              Jarne
            </div>
            <div style={{
              fontSize: "clamp(16px, 2.2vw, 28px)",
              fontWeight: 300,
              letterSpacing: "0.04em",
              color: "transparent",
              WebkitTextStroke: `clamp(0.3px, 0.1vw, 1px) ${T.mid}`,
            }}>
              Waterschoot
            </div>
          </div>

          {/* Socials */}
          <div style={{ display: "flex", alignItems: "center", gap: 32, flexShrink: 0 }}>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
              color: T.red, display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ width: 12, height: 1, background: T.red, display: "inline-block" }} />
              Socials
            </div>
            {SOCIAL_LINKS.map((s, i) => (
              <Link
                key={s.label}
                href={s.href}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  textDecoration: "none",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: T.mid, transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = T.ink)}
                onMouseLeave={e => (e.currentTarget.style.color = T.mid)}
              >
                <span style={{ fontSize: 8, color: T.red, opacity: 0.6 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.label}
                <span style={{ opacity: 0.3, fontSize: 11 }}>↗</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── BOTTOM BAR ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: 24,
            flexWrap: "wrap",
            padding: "16px 0 24px",
          }}
        >
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                style={{
                  textDecoration: "none",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: T.grey, transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = T.mid)}
                onMouseLeave={e => (e.currentTarget.style.color = T.grey)}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div style={{
            fontFamily: "'DM Mono', monospace",
            display: "flex", alignItems: "center", gap: 12,
            fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase",
            color: T.grey,
          }}>
            <span style={{ width: 16, height: 1, background: T.greyLt, display: "inline-block" }} />
            © {currentYear} Jarne Waterschoot — België
          </div>
        </motion.div>

      </div>
    </footer>
  )
}
