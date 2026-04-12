"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
type Theme = {
  bg: string; ink: string; orange: string
  greyLt: string; mid: string; grey: string; isLight: boolean
}

const DARK: Theme = {
  bg: "#1E1C1A", ink: "#F2F0EC", orange: "#FF5C1A",
  greyLt: "#2A2A28", mid: "#888884", grey: "#4A4A48", isLight: false,
}
const LIGHT: Theme = {
  bg: "#0A0A0A", ink: "#F2F0EC", orange: "#FF5C1A",
  greyLt: "#2A2A28", mid: "#888884", grey: "#4A4A48", isLight: false,
}

function useIndustrialTheme(): Theme {
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

function GlitchWord({ text, T }: { text: string; T: Theme }) {
  const [glitch, setGlitch] = useState(false)
  useEffect(() => {
    const iv = setInterval(() => {
      if (Math.random() > 0.92) {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 80 + Math.random() * 80)
      }
    }, 2500)
    return () => clearInterval(iv)
  }, [])
  return (
    <span style={{
      color: glitch ? T.orange : T.ink,
      textShadow: glitch ? `2px 0 ${T.orange}, -2px 0 #00ffff` : "none",
      transition: "color 0.05s, text-shadow 0.05s",
    }}>
      {text}
    </span>
  )
}

interface FooterProps { accentColor?: string }

export default function Footer({ accentColor: customColor }: FooterProps) {
  const T = useIndustrialTheme()
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const TT = "background 0.45s ease, color 0.45s ease, border-color 0.45s ease"

  let glowColor = customColor || T.orange
  if (pathname?.includes("CineCity"))  glowColor = "#a855f7"
  if (pathname?.includes("Chocolate")) glowColor = "#f97316"

  return (
    <footer style={{
      position: "relative",
      background: T.bg,
      color: T.ink,
      fontFamily: "'DM Mono', monospace",
      overflow: "hidden",
      transition: TT,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .blink { animation: blink 1.2s step-end infinite; }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: "absolute", bottom: 0, right: 0,
        width: 280, height: 280, borderRadius: "50%",
        background: `radial-gradient(circle, ${glowColor}18 0%, transparent 70%)`,
        pointerEvents: "none", transition: "background 0.7s",
      }} />

      {/* Metallic sheen */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 1,
        background: `linear-gradient(90deg, ${T.orange}, ${T.orange}44 60%, transparent 100%)`,
      }} />

      {/* Left vertical bar */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
        background: `linear-gradient(to bottom, ${T.orange}44, transparent 60%)`,
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
            transition: TT,
          }}
        >
          {/* Name */}
          <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
            <div>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(36px, 5vw, 64px)",
                letterSpacing: "0.06em", lineHeight: 1,
              }}>
                <GlitchWord text="JARNE" T={T} />
              </div>
              <div style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(20px, 2.8vw, 36px)",
                letterSpacing: "0.1em",
                WebkitTextStroke: `clamp(0.3px, 0.1vw, 1px) ${T.mid}`,
                color: "transparent",
                transition: TT,
              }}>
                WATERSCHOOT
              </div>
            </div>
          </div>

          {/* Socials */}
          <div style={{ display: "flex", alignItems: "center", gap: 32, flexShrink: 0 }}>
            <div style={{
              fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
              color: T.orange, display: "flex", alignItems: "center", gap: 8,
              transition: "color 0.45s ease",
            }}>
              <span style={{ width: 12, height: 1, background: T.orange, display: "inline-block", transition: "background 0.45s ease" }} />
              Socials
            </div>
            {SOCIAL_LINKS.map((s, i) => (
              <Link
                key={s.label}
                href={s.href}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  textDecoration: "none",
                  fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                  color: T.mid, transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = T.ink)}
                onMouseLeave={e => (e.currentTarget.style.color = T.mid)}
              >
                <span style={{ fontSize: 8, color: T.orange, opacity: 0.6 }}>
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
            display: "flex", alignItems: "center", gap: 12,
            fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase",
            color: T.grey, transition: "color 0.45s ease",
          }}>
            <span style={{ width: 16, height: 1, background: T.greyLt, display: "inline-block", transition: "background 0.45s ease" }} />
            © {currentYear} Jarne Waterschoot — België
          </div>
        </motion.div>

      </div>
    </footer>
  )
}
