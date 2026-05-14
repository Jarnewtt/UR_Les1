"use client"

import Link from "next/link"
import { useEffect } from "react"
import { trackProjectNav } from "@/lib/analytics"

const BLUE = "#1A1AFF"

const PROJECTS = [
  { id: "01", name: "Hélène Binet",    sub: "Fotografie", href: "/Architectuur" },
  { id: "02", name: "CineCity",        sub: "Branding",   href: "/CineCity"     },
  { id: "03", name: "C for Chocolate", sub: "Verpakking", href: "/Chocolate"    },
]

export default function ProjectNav({ currentHref }: { currentHref: string }) {
  const idx  = PROJECTS.findIndex(p => p.href === currentHref)
  const prev = idx > 0                    ? PROJECTS[idx - 1] : null
  const next = idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null

  useEffect(() => {
    const main = document.querySelector("main") as HTMLElement | null
    if (!main) return
    const prevBg = main.style.backgroundColor
    main.style.backgroundColor = BLUE
    return () => { main.style.backgroundColor = prevBg }
  }, [])

  return (
    /* Extra paddingBottom creates clear visual gap above the fixed footer arrow */
    <div id="project-nav-section" style={{ background: BLUE, paddingBottom: "clamp(56px, 8vw, 72px)" }}>
      <style>{`
        .pn-link {
          display: flex; flex-direction: column; gap: 8px;
          padding: clamp(20px, 4vw, 48px) clamp(16px, 4vw, 52px);
          text-decoration: none; transition: background 0.22s;
          min-height: 80px;
        }
        .pn-link:hover { background: rgba(255,255,255,0.08); }
        .pn-center-link {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 10px; text-decoration: none;
          padding: clamp(20px, 4vw, 48px) clamp(20px, 3vw, 40px);
          transition: background 0.22s; min-height: 80px;
        }
        .pn-center-link:hover { background: rgba(255,255,255,0.08); }
        @media (max-width: 639px) {
          .pn-nav { grid-template-columns: 1fr 1fr !important; }
          .pn-center {
            grid-column: 1 / -1; grid-row: 1;
            border-right: none !important; border-left: none !important;
            border-bottom: 1px solid rgba(255,255,255,0.15);
          }
          .pn-prev { grid-column: 1; grid-row: 2; border-top: none; }
          .pn-next { grid-column: 2; grid-row: 2; border-top: none; }
        }
      `}</style>

      <nav className="pn-nav" style={{
        position: "relative",
        background: BLUE,
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        overflow: "hidden",
      }}>

        {/* Grain overlay */}
        <svg style={{ position: "absolute", inset: 0, zIndex: 0, opacity: 0.045, pointerEvents: "none", width: "100%", height: "100%" }}>
          <filter id="pn-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={4} stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#pn-grain)"/>
        </svg>

        {/* ── Prev ── */}
        <div className="pn-prev" style={{ position: "relative", zIndex: 1, borderRight: "1px solid rgba(255,255,255,0.15)" }}>
          {prev ? (
            <Link href={prev.href} className="pn-link" onClick={() => trackProjectNav('prev', currentHref, prev.href)}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                ← Vorig
              </span>
              <span style={{ fontFamily: "'Anton', Impact, sans-serif", fontSize: "clamp(16px, 2.5vw, 28px)", textTransform: "uppercase", color: "#fff", lineHeight: 1.1 }}>
                {prev.name}
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                {prev.sub}
              </span>
            </Link>
          ) : <div />}
        </div>

        {/* ── Center: alle projecten ── */}
        <div className="pn-center" style={{ position: "relative", zIndex: 1, borderLeft: "1px solid rgba(255,255,255,0.15)", borderRight: "1px solid rgba(255,255,255,0.15)" }}>
          <Link href="/projects" className="pn-center-link" onClick={() => trackProjectNav('overview', currentHref)}>
            {/* Visible button container — clearly a tappable button */}
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              border: "1px solid rgba(255,255,255,0.35)",
              padding: "clamp(12px, 2vw, 18px) clamp(16px, 2.5vw, 28px)",
              minWidth: "clamp(100px, 15vw, 160px)",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="square">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
              </svg>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)", whiteSpace: "nowrap" }}>
                Alle projecten
              </span>
            </div>
          </Link>
        </div>

        {/* ── Next ── */}
        <div className="pn-next" style={{ position: "relative", zIndex: 1, borderLeft: "1px solid rgba(255,255,255,0.15)" }}>
          {next ? (
            <Link href={next.href} className="pn-link" style={{ alignItems: "flex-end" }} onClick={() => trackProjectNav('next', currentHref, next.href)}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                Volgend →
              </span>
              <span style={{ fontFamily: "'Anton', Impact, sans-serif", fontSize: "clamp(16px, 2.5vw, 28px)", textTransform: "uppercase", color: "#fff", lineHeight: 1.1, textAlign: "right" }}>
                {next.name}
              </span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", textAlign: "right" }}>
                {next.sub}
              </span>
            </Link>
          ) : <div />}
        </div>

      </nav>
    </div>
  )
}
