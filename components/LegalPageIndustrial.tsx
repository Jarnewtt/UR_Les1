"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
type Theme = {
  bg: string; surface: string; ink: string; inkSub: string
  inkMuted: string; orange: string; border: string; isLight: boolean
}

const DARK: Theme = {
  bg: "#080807", surface: "#111110", ink: "#F0EDE8", inkSub: "#C8C4BE",
  inkMuted: "#6E6A64", orange: "#FF5C1A", border: "#262420", isLight: false,
}
const LIGHT: Theme = {
  bg: "#FAF8F4", surface: "#F0EDE8", ink: "#0A0908", inkSub: "#3A3530",
  inkMuted: "#5A5650", orange: "#E84000", border: "#DDD8D0", isLight: true,
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

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

export type LegalSection = { heading: string; body: React.ReactNode }

export default function LegalPageIndustrial({
  code, title, updated, sections,
}: {
  code: string
  title: string
  updated: string
  sections: LegalSection[]
}) {
  const C = useIndustrialTheme()
  const TT = "background 0.45s ease, color 0.45s ease, border-color 0.45s ease"

  return (
    <div style={{
      minHeight: "100vh", background: C.bg, color: C.ink,
      fontFamily: "'DM Mono', monospace",
      transition: TT, overflowX: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400&display=swap');
      `}</style>

      {/* Top accent line */}
      <div style={{
        height: 2,
        background: `linear-gradient(90deg, ${C.orange}, ${C.orange}44 60%, transparent)`,
      }} />

      {/* Left vertical bar */}
      <div style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 2,
        background: `linear-gradient(to bottom, ${C.orange}55, transparent 60%)`,
        pointerEvents: "none", zIndex: 1, transition: "background 0.45s ease",
      }} />

      {/* Decorative corner mark */}
      <div style={{
        position: "fixed", bottom: 40, right: 40, pointerEvents: "none", zIndex: 1,
        fontFamily: "'DM Mono', monospace", fontSize: 8,
        letterSpacing: "0.28em", textTransform: "uppercase",
        color: C.inkMuted, opacity: 0.4,
        writingMode: "vertical-rl", transition: "color 0.45s ease",
      }}>
        WATERSCHOOT © {new Date().getFullYear()}
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(48px,8vw,96px) clamp(24px,5vw,60px)" }}>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: E }}
        >
          <Link
            href="/home"
            style={{
              fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
              color: C.inkMuted, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = C.orange)}
            onMouseLeave={e => (e.currentTarget.style.color = C.inkMuted)}
          >
            ← Terug naar portfolio
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: E }}
          style={{ marginTop: 40, marginBottom: 60 }}
        >
          {/* Code label */}
          <div style={{
            fontSize: 9, letterSpacing: "0.4em", textTransform: "uppercase",
            color: C.orange, marginBottom: 16,
            display: "flex", alignItems: "center", gap: 12,
            transition: "color 0.45s ease",
          }}>
            <span style={{ width: 20, height: 1, background: C.orange, opacity: 0.7, display: "inline-block" }} />
            {code}
          </div>

          {/* Big Bebas title */}
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(52px, 8vw, 108px)",
            lineHeight: 0.88, letterSpacing: "0.03em",
            color: C.ink, marginBottom: 28,
            transition: "color 0.45s ease",
          }}>
            {title}
          </div>

          {/* Orange ruled line */}
          <div style={{
            height: 1,
            background: `linear-gradient(90deg, ${C.orange}99, ${C.border})`,
            marginBottom: 16, transition: "background 0.45s ease",
          }} />

          <div style={{
            fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
            color: C.inkMuted, transition: "color 0.45s ease",
          }}>
            Laatste update — {updated}
          </div>
        </motion.div>

        {/* Sections */}
        <div>
          {sections.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.65, delay: i * 0.07, ease: E }}
              style={{ marginBottom: 52 }}
            >
              {/* Section number + rule */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 32, color: C.orange, opacity: 0.45, lineHeight: 1,
                  flexShrink: 0, transition: "color 0.45s ease",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ flex: 1, height: 1, background: C.border, transition: "background 0.45s ease" }} />
              </div>

              {/* Section heading */}
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(22px, 3vw, 38px)",
                letterSpacing: "0.06em", lineHeight: 1,
                color: C.ink, marginBottom: 18,
                transition: "color 0.45s ease",
              }}>
                {s.heading}
              </h2>

              {/* Body */}
              <div style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 15, fontWeight: 300, lineHeight: 1.9,
                color: C.inkSub, transition: "color 0.45s ease",
              }}>
                {s.body}
              </div>

              {i < sections.length - 1 && (
                <div style={{
                  height: 1, background: C.border, marginTop: 44,
                  transition: "background 0.45s ease",
                }} />
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          marginTop: 40, paddingTop: 24,
          borderTop: `1px solid ${C.border}`,
          fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
          color: C.inkMuted, display: "flex", alignItems: "center", gap: 12,
          transition: TT,
        }}>
          <span style={{ width: 16, height: 1, background: C.orange, opacity: 0.4, display: "inline-block" }} />
          © {new Date().getFullYear()} Jarne Waterschoot — België
        </div>

      </div>
    </div>
  )
}
