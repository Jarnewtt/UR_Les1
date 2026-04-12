"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
type Theme = {
  bg: string; surface: string; ink: string; inkSub: string
  inkMuted: string; red: string; border: string; isLight: boolean
}
const DARK: Theme  = { bg:"#0C0C12", surface:"#14141E", ink:"#F2F0EC", inkSub:"#B8B6C4", inkMuted:"#787688", red:"#E8280A", border:"#22222E", isLight:false }
const LIGHT: Theme = { bg:"#F5F4F8", surface:"#EEEDF2", ink:"#0D0C14", inkSub:"#2A2830", inkMuted:"#56546A", red:"#CC1F00", border:"#D0CED8", isLight:true  }

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

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

export type LegalSection = { heading: string; body: React.ReactNode }

export default function LegalPageModern({
  number, title, updated, sections,
}: {
  number: string
  title: string
  updated: string
  sections: LegalSection[]
}) {
  const T = useModernTheme()

  return (
    <div style={{
      minHeight: "100vh", background: T.bg, color: T.ink,
      fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
      transition: "background 0.4s, color 0.4s",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600&family=DM+Mono:wght@300;400&display=swap');
      `}</style>

      {/* Top accent line */}
      <div style={{
        height: 2,
        background: `linear-gradient(90deg, ${T.red}, ${T.red}33 60%, transparent)`,
      }} />

      {/* Left vertical bar */}
      <div style={{
        position: "fixed", left: 0, top: 0, bottom: 0, width: 2, pointerEvents: "none", zIndex: 1,
        background: `linear-gradient(to bottom, ${T.red}44, transparent 55%)`,
      }} />

      {/* Ambient glow */}
      <div style={{
        position: "fixed", bottom: 0, right: 0, pointerEvents: "none",
        width: 400, height: 400, borderRadius: "50%",
        background: `radial-gradient(circle, ${T.red}0A 0%, transparent 70%)`,
      }} />

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "clamp(48px,8vw,96px) clamp(20px,5vw,48px)" }}>

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: E }}
        >
          <Link
            href="/home"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
              color: T.inkMuted, textDecoration: "none",
              display: "inline-flex", alignItems: "center", gap: 8,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = T.red)}
            onMouseLeave={e => (e.currentTarget.style.color = T.inkMuted)}
          >
            ← Terug naar portfolio
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: E }}
          style={{ marginTop: 40, marginBottom: 60 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ width: 20, height: 1, background: T.red, display: "inline-block" }} />
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: T.red,
            }}>
              {number}
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 600,
            letterSpacing: "-0.02em", lineHeight: 0.92,
            color: T.ink, marginBottom: 24,
          }}>
            {title}
          </h1>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 40, height: 1, background: T.border }} />
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: T.inkMuted,
            }}>
              Laatste update — {updated}
            </span>
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
              transition={{ duration: 0.6, delay: i * 0.06, ease: E }}
              style={{
                marginBottom: 52,
                paddingBottom: 52,
                borderBottom: i < sections.length - 1 ? `1px solid ${T.border}` : "none",
              }}
            >
              <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 9, letterSpacing: "0.2em",
                  color: `${T.red}55`, flexShrink: 0, paddingTop: 6,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 600,
                    color: T.ink, marginBottom: 14, letterSpacing: "-0.01em",
                  }}>
                    {s.heading}
                  </h2>
                  <div style={{
                    fontSize: 15, fontWeight: 300, lineHeight: 1.9,
                    color: T.inkSub,
                  }}>
                    {s.body}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
          color: T.inkMuted, display: "flex", alignItems: "center", gap: 12,
          marginTop: 8,
        }}>
          <div style={{ width: 16, height: 1, background: T.border }} />
          © {new Date().getFullYear()} Jarne Waterschoot — België
        </div>

      </div>
    </div>
  )
}
