"use client"

import React, { useState, useEffect, useRef } from 'react'
import {
  motion, useInView,
  AnimatePresence,
} from 'framer-motion'

// ── TOKENS ────────────────────────────────────────────────────────────────────
type Tokens = {
  bg: string; surface: string; surfaceAlt: string
  ink: string; inkSub: string; inkMuted: string
  red: string; border: string; borderStrong: string
  isLight: boolean
}

const DARK: Tokens = {
  bg: "#08080C", surface: "#111118", surfaceAlt: "#0C0C14",
  ink: "#F0EEFF", inkSub: "#C4C0D8", inkMuted: "#68648C",
  red: "#E8280A", border: "#1C1C2C", borderStrong: "#2C2C40",
  isLight: false,
}

const LIGHT: Tokens = {
  bg: "#F4F2FA", surface: "#ECEAF4", surfaceAlt: "#E4E2EE",
  ink: "#080812", inkSub: "#28263C", inkMuted: "#5A5872",
  red: "#CC1E00", border: "#D8D6E8", borderStrong: "#C0BDCE",
  isLight: true,
}

function useTheme(): Tokens {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("theme-light"))
    const handler = (e: Event) => setIsDark((e as CustomEvent).detail.isDark)
    window.addEventListener("theme-change", handler)
    return () => window.removeEventListener("theme-change", handler)
  }, [])
  return isDark ? DARK : LIGHT
}

// ── TYPES ─────────────────────────────────────────────────────────────────────
type Panel = { id: number; imagePath: string; label: string; sub?: string }
type Props  = { heroTop?: string; heroBottom?: string; tribute?: string; introText?: string; panels?: Panel[] }

const DEFAULT_PANELS: Panel[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  imagePath: `/img/Paneel_${i + 1}.jpg`,
  label: [
    "Chaotische lijn","Organische lijn","Geordende lijn","",
    "Abstracte lijn","Rechte lijn","Ritmische lijn","",
    "Doorlopende lijn","Gebogen lijn","Onregelmatige lijn","Onderbroken lijn",
  ][i],
}))

const GALLERY = Array.from({ length: 10 }, (_, i) => `/img/Gallerij_${i + 1}.jpg`)
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ── CURSOR ────────────────────────────────────────────────────────────────────

// ── GRAIN ─────────────────────────────────────────────────────────────────────
function Grain({ isLight }: { isLight: boolean }) {
  return (
    <svg style={{ position: "fixed", inset: 0, zIndex: 9990, opacity: isLight ? 0.02 : 0.04,
      pointerEvents: "none", width: "100%", height: "100%" }}>
      <filter id="mod-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={4} stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#mod-grain)"/>
    </svg>
  )
}

// ── REVEAL ────────────────────────────────────────────────────────────────────
function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <motion.div
        initial={{ y: "105%", skewY: 3 }}
        animate={inView ? { y: 0, skewY: 0 } : {}}
        transition={{ duration: 0.9, delay, ease: EASE }}>
        {children}
      </motion.div>
    </div>
  )
}

// ── PANEL CARD ────────────────────────────────────────────────────────────────
function PanelCard({ panel, index, isUnfolded, C }: { panel: Panel; index: number; isUnfolded: boolean; C: Tokens }) {
  const [flipped, setFlipped] = useState(false)
  const col = index % 6, row = Math.floor(index / 6)

  return (
    <div
      onClick={() => isUnfolded && setFlipped(f => !f)}
      style={{
        position: "absolute", width: 160, height: 250,
        transform: isUnfolded
          ? `translateX(${(col - 2.5) * 175}px) translateY(${(row - 0.5) * 310}px) rotateY(${flipped ? 180 : 0}deg) scale(1)`
          : `translateX(${(index - 5.5) * 4}px) translateY(${index * 1.5}px) rotateY(${index * 4}deg) rotateZ(${index * 0.6}deg) scale(0.82)`,
        transition: "transform 1.4s cubic-bezier(0.2,0.85,0.2,1)",
        transformStyle: "preserve-3d",
        zIndex: isUnfolded ? 10 : 30 - index,
        cursor: isUnfolded ? "none" : "default",
      }}>

      {/* Front */}
      <div
        style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden",
          background: C.surface, border: `1px solid ${C.border}`, overflow: "hidden",
          transition: "border-color 0.3s" }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = `${C.red}66`)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
        <img src={panel.imagePath} alt={panel.label}
          style={{ width: "100%", height: "100%", objectFit: "cover",
            filter: "grayscale(100%) contrast(1.2)", opacity: C.isLight ? 0.85 : 0.7,
            transition: "filter 0.8s ease, opacity 0.8s ease" }}
          onMouseEnter={e => { e.currentTarget.style.filter = "grayscale(0%) contrast(1)"; e.currentTarget.style.opacity = "1" }}
          onMouseLeave={e => { e.currentTarget.style.filter = "grayscale(100%) contrast(1.2)"; e.currentTarget.style.opacity = C.isLight ? "0.85" : "0.7" }}
        />
        <div style={{ position: "absolute", top: 12, left: 12, fontFamily: "'DM Mono', monospace",
          fontSize: 9, letterSpacing: "0.2em", color: `${C.red}88`,
          background: C.isLight ? "rgba(244,242,250,0.8)" : "rgba(8,8,12,0.65)", padding: "3px 7px" }}>
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>

      {/* Back — inverted for visual punch */}
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden",
        transform: "rotateY(180deg)",
        background: C.isLight ? "#080812" : "#F0EEFF",
        padding: "20px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
            color: C.isLight ? "rgba(240,238,255,0.38)" : "rgba(8,8,18,0.38)", marginBottom: 8 }}>
            Tegenstelling
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 700,
            letterSpacing: "0.01em", lineHeight: 1.2,
            color: C.isLight ? "#F0EEFF" : "#080812" }}>
            {panel.label.toUpperCase()}
          </div>
        </div>
        <div>
          <div style={{ height: 1, background: C.red, opacity: 0.45, marginBottom: 10 }} />
          <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", lineHeight: 1.8,
            color: C.isLight ? "rgba(240,238,255,0.42)" : "rgba(8,8,18,0.42)" }}>
            Studie naar Lijnen<br/>FOMU × Binet 2025
          </div>
        </div>
      </div>
    </div>
  )
}

// ── GALLERY ITEM ──────────────────────────────────────────────────────────────
function GalleryItem({ src, index, onClick, C }: { src: string; index: number; onClick: () => void; C: Tokens }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: (index % 5) * 0.07, ease: EASE }}
      onClick={onClick}
      style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden",
        background: C.surface, cursor: "none", border: `0.5px solid ${C.border}` }}>
      <img src={src} alt={`Fragment ${index + 1}`}
        style={{ width: "100%", height: "100%", objectFit: "cover",
          filter: "grayscale(100%) contrast(1.1)",
          opacity: C.isLight ? 0.8 : 0.65,
          transition: "filter 0.9s ease, opacity 0.9s ease, transform 1.1s ease",
          transform: "scale(1.02)" }}
        onMouseEnter={e => { e.currentTarget.style.filter = "grayscale(0%)"; e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "scale(1.06)" }}
        onMouseLeave={e => { e.currentTarget.style.filter = "grayscale(100%) contrast(1.1)"; e.currentTarget.style.opacity = C.isLight ? "0.8" : "0.65"; e.currentTarget.style.transform = "scale(1.02)" }}
      />
      <div style={{ position: "absolute", bottom: 12, left: 12, fontSize: 8, letterSpacing: "0.24em",
        textTransform: "uppercase", color: "transparent", padding: "4px 8px",
        transition: "color 0.35s, background 0.35s" }}
        onMouseEnter={e => { e.currentTarget.style.color = C.inkSub; e.currentTarget.style.background = C.isLight ? "rgba(244,242,250,0.9)" : "rgba(8,8,12,0.7)" }}
        onMouseLeave={e => { e.currentTarget.style.color = "transparent"; e.currentTarget.style.background = "transparent" }}>
        P_{String(index + 1).padStart(2, "0")} — Vergroot
      </div>
    </motion.div>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function ArchitectuurPageModern({
  heroTop   = "Shadow &",
  heroBottom = "Light",
  tribute   = "Een tribuut aan Hélène Binet",
  introText = "",
  panels    = DEFAULT_PANELS,
}: Props) {
  const C = useTheme()
  const [isUnfolded, setIsUnfolded] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isReady, setIsReady] = useState(false)
  const TT = "background 0.4s ease, color 0.4s ease, border-color 0.4s ease"

  useEffect(() => { setIsReady(true) }, [])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === "Escape") setLightboxIndex(null)
      if (e.key === "ArrowRight") setLightboxIndex(i => (i! + 1) % GALLERY.length)
      if (e.key === "ArrowLeft")  setLightboxIndex(i => (i! - 1 + GALLERY.length) % GALLERY.length)
    }
    window.addEventListener("keydown", h)
    return () => window.removeEventListener("keydown", h)
  }, [lightboxIndex])

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.ink, overflowX: "hidden",
      cursor: "none", fontFamily: "'DM Mono', monospace", transition: TT }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { cursor: none !important; }
        ::selection { background: ${C.red}; color: #fff; }
        ::-webkit-scrollbar { width: 1px; }
        ::-webkit-scrollbar-thumb { background: ${C.red}60; }

        /* ── Responsive ── */
        .mod-intro-grid {
          display: grid; grid-template-columns: 1fr; gap: 40px; align-items: start;
          padding: clamp(40px,7vw,96px) clamp(16px,5vw,60px);
        }
        @media (min-width: 768px) { .mod-intro-grid { grid-template-columns: 1fr 1fr; gap: 80px; } }

        .mod-gallery-grid { display: grid; grid-template-columns: repeat(2, 1fr); }
        @media (min-width: 640px)  { .mod-gallery-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .mod-gallery-grid { grid-template-columns: repeat(5, 1fr); } }

        .mod-leporello-mobile { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px; padding: 20px; }
        .mod-leporello-3d     { display: none; }
        @media (min-width: 768px) {
          .mod-leporello-mobile { display: none; }
          .mod-leporello-3d     { display: block; }
        }
        .mod-meta { display: none; }
        @media (min-width: 768px) { .mod-meta { display: block; } }
      `}</style>


      <Grain isLight={C.isLight} />

      {/* ── FIXED TOP ACCENT LINE ── */}
      <motion.div
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 1.4, ease: EASE }}
        style={{ position: "fixed", top: 0, left: 0, right: 0, height: 2,
          background: C.red, transformOrigin: "left", zIndex: 999,
          boxShadow: `0 0 20px ${C.red}66` }}
      />

      {/* ══════════════════════════════════════════════════════════
          ── HERO ──
          ══════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        borderBottom: `1px solid ${C.border}` }}>

        {/* Geometric mid-line */}
        <motion.div
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.8, delay: 0.3, ease: EASE }}
          style={{ position: "absolute", top: "42%", left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, ${C.border}, ${C.red}44 40%, ${C.border} 100%)`,
            transformOrigin: "left", zIndex: 0, pointerEvents: "none" }}
        />

        {/* Left vertical accent */}
        <motion.div
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          transition={{ duration: 1.3, delay: 0.5, ease: EASE }}
          style={{ position: "absolute", left: 28, top: "8%", bottom: "12%", width: 1, zIndex: 2,
            background: `linear-gradient(to bottom, transparent, ${C.red}66 30%, ${C.red}66 70%, transparent)`,
            transformOrigin: "top" }}
        />

        {/* Top-right metadata — desktop only */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mod-meta"
          style={{ position: "absolute", top: 52, right: 60, textAlign: "right",
            fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
            color: C.inkMuted, lineHeight: 2.8, zIndex: 10, transition: "color 0.4s" }}>
          <div>Antwerpen — FOMU</div>
          <div>Fotografische studie</div>
          <div style={{ color: C.red }}>Hélène Binet 2025</div>
        </motion.div>

        {/* Hero content */}
        <div style={{ position: "relative", zIndex: 5,
          padding: "0 clamp(20px,5vw,60px) clamp(40px,6vw,72px)" }}>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0 }} animate={isReady ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ fontSize: 9, letterSpacing: "0.36em", textTransform: "uppercase",
              color: C.inkMuted, marginBottom: 28, display: "flex", alignItems: "center", gap: 14,
              transition: "color 0.4s" }}>
            <span style={{ width: 22, height: 1, background: `${C.red}88`, display: "inline-block" }} />
            Visuele Studie — Lijn als taal
          </motion.div>

          {/* Title — Space Grotesk heavy + stroke variant */}
          <div>
            <div style={{ overflow: "hidden" }}>
              <motion.h1
                initial={{ y: "110%", skewY: 4 }} animate={isReady ? { y: 0, skewY: 0 } : {}}
                transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
                style={{ fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(36px,13vw,180px)", lineHeight: 0.84,
                  fontWeight: 700, letterSpacing: "-0.03em", color: C.ink,
                  transition: "color 0.4s" }}>
                {heroTop}
              </motion.h1>
            </div>
            <div style={{ overflow: "hidden" }}>
              <motion.h1
                initial={{ y: "110%", skewY: 4 }} animate={isReady ? { y: 0, skewY: 0 } : {}}
                transition={{ duration: 1.1, delay: 0.48, ease: EASE }}
                style={{ fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(36px,13vw,180px)", lineHeight: 0.84,
                  fontWeight: 700, letterSpacing: "-0.03em",
                  color: "transparent", WebkitTextStroke: `clamp(0.5px, 0.2vw, 2px) ${C.red}` }}>
                {heroBottom}
              </motion.h1>
            </div>
          </div>

          {/* Tribute line */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={isReady ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
            style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 28, height: 1, background: C.red, opacity: 0.7, flexShrink: 0 }} />
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontStyle: "italic", fontWeight: 300,
              fontSize: 15, color: C.inkSub, transition: "color 0.4s" }}>
              {tribute}
            </span>
          </motion.div>

          {/* Bottom strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={isReady ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.4, duration: 0.9 }}
            style={{ marginTop: 40, borderTop: `1px solid ${C.border}`, paddingTop: 24,
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 20, flexWrap: "wrap", transition: "border-color 0.4s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase",
                color: C.inkMuted, transition: "color 0.4s" }}>
                Jarne Waterschoot
              </span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: C.red, opacity: 0.5, flexShrink: 0 }} />
              <span style={{ fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase",
                color: C.inkMuted, transition: "color 0.4s" }}>
                Fotografische studie
              </span>
            </div>
            <motion.a
              href="#archief"
              whileHover={{ borderColor: C.red, color: C.ink, background: `${C.red}14` }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 12,
                border: `1px solid ${C.border}`, color: C.inkMuted, fontSize: 9,
                letterSpacing: "0.22em", textTransform: "uppercase", padding: "14px 28px",
                transition: "all 0.3s", textDecoration: "none" }}>
              Bekijk het werk
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>↓</motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ── INTRO ──
          ══════════════════════════════════════════════════════════ */}
      <section className="mod-intro-grid" style={{ borderBottom: `1px solid ${C.border}`, transition: TT }}>
        <div>
          <RevealText>
            <div style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase",
              color: C.red, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ width: 18, height: 1, background: C.red, opacity: 0.7, display: "inline-block" }} />
              Project — FOMU Antwerpen
            </div>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              fontSize: "clamp(28px,4vw,54px)", letterSpacing: "-0.02em", lineHeight: 0.95,
              color: C.ink, marginBottom: 28, transition: "color 0.4s" }}>
              Mijn blik op<br />architecturaal<br />
              <span style={{ WebkitTextStroke: `clamp(0.4px, 0.15vw, 1.5px) ${C.red}`, color: "transparent" }}>
                licht &amp; schaduw
              </span>
            </h2>
          </RevealText>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}>

          {introText ? (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 15,
              lineHeight: 1.95, color: C.inkSub, marginBottom: 28, transition: "color 0.4s" }}>
              {introText}
            </p>
          ) : (
            <>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 15,
                lineHeight: 1.95, color: C.inkSub, marginBottom: 28, transition: "color 0.4s" }}>
                In opdracht van het <span style={{ color: C.ink }}>FOMU te Antwerpen</span> analyseerde ik het fotografisch werk van Hélène Binet. Vanuit haar visuele stijl onderzocht ik hoe lijnen een centrale rol spelen — vertaald naar vijf visuele tegenstellingen in een leporello en one-pager.
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 15,
                lineHeight: 1.95, color: C.inkSub, transition: "color 0.4s" }}>
                Binet's analoge, contrastrijke manier van kijken diende als inspiratie — maar de beelden, keuzes en compositie zijn volledig van{" "}
                <span style={{ fontStyle: "italic" }}>mijn hand</span>.
              </p>
            </>
          )}

          <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(2,1fr)",
            gap: 1, background: C.border, transition: "background 0.4s" }}>
            {[["05","Tegenstellingen"],["10","Foto's"]].map(([n, l], i) => (
              <div key={i} style={{ background: C.bg, padding: "24px 20px", transition: TT }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 36,
                  fontWeight: 700, color: C.ink, lineHeight: 1, transition: "color 0.4s" }}>
                  {n}
                </div>
                <div style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: C.inkMuted, marginTop: 6, transition: "color 0.4s" }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ── LEPORELLO ──
          ══════════════════════════════════════════════════════════ */}
      <section id="lijnen" className="hidden md:block" style={{ borderBottom: `1px solid ${C.border}`, transition: TT }}>

        {/* Trigger */}
        <motion.div
          onClick={() => setIsUnfolded(u => !u)}
          whileHover={{ background: C.surfaceAlt }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "clamp(20px,4vw,32px) clamp(16px,5vw,60px)", cursor: "none",
            borderBottom: `1px solid ${C.border}`, transition: TT }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
              color: C.inkMuted, marginBottom: 8, transition: "color 0.4s" }}>
              {isUnfolded ? "Klik een paneel om te draaien" : "Klik om de studie te openen"}
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
              fontSize: "clamp(20px,3vw,38px)", letterSpacing: "-0.01em",
              color: C.ink, transition: "color 0.4s" }}>
              {isUnfolded ? "Sluit Leporello" : "Bekijk de Lijnen"}
            </div>
          </div>
          <motion.div
            animate={{ rotate: isUnfolded ? 45 : 0, borderColor: isUnfolded ? C.red : C.border }}
            transition={{ duration: 0.4 }}
            style={{ width: 44, height: 44, border: `1px solid ${C.border}`, display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20,
              color: isUnfolded ? C.red : C.inkMuted, flexShrink: 0 }}>
            +
          </motion.div>
        </motion.div>

        {/* Mobile fallback */}
        <div className="mod-leporello-mobile">
          {panels.map(panel => (
            <div key={panel.id} style={{ position: "relative", overflow: "hidden",
              aspectRatio: "2/3", background: C.surface, border: `0.5px solid ${C.border}` }}>
              <img src={panel.imagePath} alt={panel.label}
                style={{ width: "100%", height: "100%", objectFit: "cover",
                  filter: "grayscale(100%) contrast(1.2)" }} />
              {panel.label && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "rgba(0,0,0,0.65)", padding: "4px 6px" }}>
                  <p style={{ fontSize: 9, textTransform: "uppercase",
                    letterSpacing: "0.08em", color: "rgba(240,238,255,0.75)" }}>
                    {panel.label}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop 3D */}
        <div className="mod-leporello-3d">
          <div style={{ perspective: "3200px", overflow: "hidden" }}>
            <motion.div
              animate={{ height: isUnfolded ? 660 : 300 }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {panels.map((panel, i) => (
                <PanelCard key={panel.id} panel={panel} index={i} isUnfolded={isUnfolded} C={C} />
              ))}
            </motion.div>
          </div>
        </div>

        {/* Hint */}
        <AnimatePresence>
          {isUnfolded && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.6, delay: 1.2, ease: EASE }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
                padding: "20px 0 28px", borderTop: `1px solid ${C.border}`, transition: TT }}>
              <span style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
                color: C.inkMuted, transition: "color 0.4s" }}>
                Klik op een paneel om het te draaien
              </span>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <motion.span key={i}
                    animate={{ opacity: [0.15, 0.6, 0.15] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.25 }}
                    style={{ width: 3, height: 3, borderRadius: "50%", background: C.red, display: "inline-block" }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ── GALLERY ──
          ══════════════════════════════════════════════════════════ */}
      <section id="archief">
        <div style={{ padding: "clamp(28px,4vw,56px) clamp(16px,5vw,60px) clamp(14px,2vw,28px)",
          borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "baseline",
          justifyContent: "space-between", transition: TT }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 24, height: 1, background: C.red, opacity: 0.6, display: "inline-block" }} />
            <span style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
              color: C.inkMuted, transition: "color 0.4s" }}>
              Fotografisch Archief
            </span>
          </motion.div>
          <span style={{ fontSize: 9, letterSpacing: "0.16em", color: C.inkMuted, transition: "color 0.4s" }}>
            10 Fragmenten
          </span>
        </div>
        <div className="mod-gallery-grid">
          {GALLERY.map((src, i) => (
            <GalleryItem key={i} src={src} index={i} onClick={() => setLightboxIndex(i)} C={C} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          ── CLOSING ──
          ══════════════════════════════════════════════════════════ */}
      <section style={{ padding: "clamp(60px,10vw,120px) clamp(20px,5vw,60px)",
        borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center", transition: TT }}>
        <RevealText>
          <div style={{ fontSize: 9, letterSpacing: "0.36em", textTransform: "uppercase",
            color: C.inkMuted, marginBottom: 40, transition: "color 0.4s" }}>
            Jarne Waterschoot × FOMU × 2025
          </div>
        </RevealText>
        <RevealText delay={0.1}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: "clamp(32px,5.5vw,80px)", letterSpacing: "-0.02em", lineHeight: 0.92,
            color: C.ink, marginBottom: 8, transition: "color 0.4s" }}>
            Shadow is the
          </div>
        </RevealText>
        <RevealText delay={0.2}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
            fontSize: "clamp(32px,5.5vw,80px)", letterSpacing: "-0.02em", lineHeight: 0.92,
            WebkitTextStroke: `clamp(0.5px, 0.2vw, 2px) ${C.red}`, color: "transparent" }}>
            architect of light
          </div>
        </RevealText>
        <motion.div
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          style={{ width: 1, height: 80,
            background: `linear-gradient(to bottom, ${C.red}90, transparent)`,
            marginTop: 56, transformOrigin: "top", transition: "background 0.4s" }} />
      </section>

      {/* ══════════════════════════════════════════════════════════
          ── LIGHTBOX ──
          ══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightboxIndex(null)}
            style={{ position: "fixed", inset: 0, zIndex: 9000,
              background: C.isLight ? "rgba(244,242,250,0.97)" : "rgba(8,8,12,0.97)",
              backdropFilter: "blur(12px)", display: "flex", alignItems: "center",
              justifyContent: "center", padding: 48, cursor: "none" }}>

            <button
              onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i! - 1 + GALLERY.length) % GALLERY.length) }}
              style={{ position: "absolute", left: 32, background: "none", border: "none",
                color: C.inkMuted, fontSize: 28, cursor: "none", padding: 16, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.red)}
              onMouseLeave={e => (e.currentTarget.style.color = C.inkMuted)}>
              ←
            </button>

            <motion.img
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, ease: EASE }}
              src={GALLERY[lightboxIndex]}
              alt={`Fragment ${lightboxIndex + 1}`}
              onClick={e => e.stopPropagation()}
              style={{ maxHeight: "76vh", maxWidth: "100%", objectFit: "contain",
                boxShadow: C.isLight
                  ? "0 20px 80px rgba(0,0,0,0.15)"
                  : `0 40px 120px rgba(0,0,0,0.9), 0 0 60px ${C.red}18`,
                border: `1px solid ${C.border}` }}
            />

            <button
              onClick={e => { e.stopPropagation(); setLightboxIndex(i => (i! + 1) % GALLERY.length) }}
              style={{ position: "absolute", right: 32, background: "none", border: "none",
                color: C.inkMuted, fontSize: 28, cursor: "none", padding: 16, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.red)}
              onMouseLeave={e => (e.currentTarget.style.color = C.inkMuted)}>
              →
            </button>

            <div style={{ position: "absolute", top: 28, right: 36, display: "flex", alignItems: "center", gap: 24 }}>
              <span style={{ fontSize: 9, letterSpacing: "0.2em", color: C.inkMuted, textTransform: "uppercase" }}>
                {String(lightboxIndex + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}
              </span>
              <button
                onClick={() => setLightboxIndex(null)}
                style={{ background: "none", border: `1px solid ${C.border}`, color: C.inkMuted,
                  fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase",
                  padding: "8px 16px", cursor: "none", transition: "all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.red; e.currentTarget.style.color = C.red }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.inkMuted }}>
                Sluiten [ESC]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
