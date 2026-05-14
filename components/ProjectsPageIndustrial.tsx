"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { trackProjectClick, trackCTAClick } from "@/lib/analytics"

// ── THEME ─────────────────────────────────────────────────────────────────────
type Theme = {
  bg: string; surface: string; ink: string; inkSub: string
  inkMuted: string; blue: string; border: string; isLight: boolean
}
const DARK: Theme  = { bg:"#080808", surface:"#111111", ink:"#F0EDF0", inkSub:"#AEAEAE", inkMuted:"#545454", blue:"#1A1AFF", border:"#1E1E1E", isLight:false }
const LIGHT: Theme = { bg:"#F5F4F0", surface:"#ECEAE6", ink:"#0A0A0A", inkSub:"#3A3A36", inkMuted:"#888884", blue:"#1A1AFF", border:"#D4D4D0", isLight:true  }

const E: [number,number,number,number] = [0.16, 1, 0.3, 1]

function useTheme(): Theme {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("theme-dark"))
    const h = (e: Event) => setIsDark((e as CustomEvent).detail.isDark)
    window.addEventListener("theme-change", h)
    return () => window.removeEventListener("theme-change", h)
  }, [])
  return isDark ? DARK : LIGHT
}

// ── DATA ──────────────────────────────────────────────────────────────────────
const PROJECTS = [
  {
    id: "01",
    name: "Hélène Binet",
    sub: "Fotografie",
    year: "2025",
    href: "/Architectuur",
    image: "/img/Gallerij_3.jpg",
    desc: "Een typografische verkenning van architecturale fotografie. Licht, schaduw en de stilte tussen structuren als beeldtaal.",
  },
  {
    id: "02",
    name: "CineCity",
    sub: "Branding",
    year: "2026",
    href: "/CineCity",
    image: "/img/Mockup_affichereeks.jpg",
    desc: "Visuele identiteit en affichereeks voor een fictief filmfestival. Stedelijk, direct en onverwisseld herkenbaar.",
  },
  {
    id: "03",
    name: "C for Chocolate",
    sub: "Verpakking",
    year: "2026",
    href: "/Chocolate",
    image: "/img/2526_BDL3_PACK_H4_WaterschootJ.jpg",
    desc: "Exclusieve pralinedozen voor het BELvue Museum. Art Deco esthetiek vertaald naar luxeverpakking voor een kritisch publiek.",
  },
]

const TOTAL = PROJECTS.length

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function ProjectsPageIndustrial() {
  const C = useTheme()
  const router = useRouter()
  const [active, setActive] = useState(0)
  const [revealingId, setRevealingId] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleMobileProjectClick = (p: typeof PROJECTS[0]) => {
    trackProjectClick(p.name, p.href, '/projects')
    setRevealingId(p.id)
    setTimeout(() => router.push(p.href), 520)
  }

  // Track scroll within sticky section via window scroll listener.
  // Container height = (TOTAL + 1) × 100vh → each project gets exactly 100vh.
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current) return
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--navbar-h") || "72")
      const scrolled = Math.max(0, -scrollRef.current.getBoundingClientRect().top)
      const idx = Math.min(TOTAL - 1, Math.floor(scrolled / (window.innerHeight - navH)))
      setActive(idx)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div style={{
      background: C.bg, color: C.ink,
      minHeight: "100vh",
      transition: "background 0.4s, color 0.4s",
    }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
        ::selection { background: #1A1AFF; color: #fff }

        .proj-h-pad {
          padding-left:  clamp(20px,5vw,48px);
          padding-right: clamp(20px,5vw,48px);
        }
        @media(min-width:1024px){
          .proj-h-pad {
            padding-left:  clamp(48px,6vw,96px);
            padding-right: clamp(48px,6vw,96px);
          }
        }

        .proj-label {
          font-family: Inter, sans-serif;
          font-size: 14px; letter-spacing: 0.32em;
          text-transform: uppercase; color: #1A1AFF;
          display: flex; align-items: center; gap: 14px;
        }
        .proj-label::before {
          content: ''; display: block; width: 24px; height: 1px;
          background: #1A1AFF; flex-shrink: 0;
        }

        /* ── STICKY SCROLL: desktop layout ── */
        .proj-sticky-outer {
          display: none;
        }
        @media(min-width:768px){
          .proj-sticky-outer { display: block; }
        }

        /* ── LEFT/RIGHT SPLIT — tablet narrows to 55/45 ── */
        .proj-left-panel  { flex: 0 0 62%; }
        .proj-right-panel { flex: 0 0 38%; }
        @media(min-width:768px) and (max-width:1023px){
          .proj-left-panel  { flex: 0 0 55%; }
          .proj-right-panel { flex: 0 0 45%; }
        }

        /* ── MOBILE LIST: only shown < 768px ── */
        .proj-mobile-list {
          display: flex;
          flex-direction: column;
        }
        @media(min-width:768px){
          .proj-mobile-list { display: none; }
        }

        /* Mobile card */
        .proj-mobile-card {
          border-top: 1px solid var(--proj-border);
          padding: clamp(32px,6vw,56px) clamp(20px,5vw,48px);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* CTA pill button */
        .proj-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 32px;
          background: #1A1AFF;
          color: #fff;
          border: 1px solid transparent;
          border-radius: 4px;
          font-family: Inter, sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          text-decoration: none;
          transition: box-shadow 0.3s, opacity 0.2s;
        }
        .proj-cta-btn:hover {
          box-shadow: 0 0 0 4px rgba(26,26,255,0.18), 0 0 36px rgba(26,26,255,0.5);
          opacity: 0.92;
        }
        .proj-cta-btn:active {
          box-shadow: 0 0 0 6px rgba(26,26,255,0.28), 0 0 48px rgba(26,26,255,0.65);
        }
        .proj-cta-btn:disabled {
          opacity: 0.5;
          cursor: default;
          pointer-events: none;
        }

        /* ── IMAGE GRAYSCALE ── */
        .proj-img-panel { cursor: default; }
        .proj-img-inner img {
          filter: grayscale(1);
          transition: filter 0.55s ease;
        }
        .proj-img-panel:hover .proj-img-inner img { filter: grayscale(0); }

        .proj-mobile-img-wrap {
          border-radius: 8px; overflow: hidden; aspect-ratio: 16/10;
          position: relative;
        }
        .proj-mobile-img-wrap img {
          filter: grayscale(1);
          transition: filter 0.5s ease;
          width: 100%; height: 100%; object-fit: cover; display: block;
        }
        .proj-mobile-img-wrap.proj-color-reveal img { filter: grayscale(0); }

        @media(max-width:767px){
          .proj-cta-btn {
            background: transparent;
            color: #1A1AFF;
            border: 1px solid #1A1AFF;
            box-shadow: none;
          }
          .proj-cta-btn:hover {
            background: #1A1AFF;
            color: #fff;
            box-shadow: none;
          }
        }
      `}</style>

      {/* Inject border color as CSS var for mobile cards */}
      <style>{`:root { --proj-border: ${C.border}; }`}</style>

      {/* ══ HERO ══ */}
      <section
        className="proj-h-pad"
        style={{
          paddingTop: "clamp(120px,15vw,200px)",
          paddingBottom: "clamp(48px,6vw,80px)",
          position: "relative",
          borderBottom: `1px solid ${C.border}`,
          transition: "border-color 0.4s",
        }}
      >
        <motion.span
          className="proj-label"
          initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: E }}
          style={{ marginBottom: 28 }}
        >
          Geselecteerd werk
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: E }}
          style={{
            fontFamily: "'Anton', Impact, sans-serif",
            fontSize: "clamp(72px,12vw,148px)",
            textTransform: "uppercase",
            lineHeight: 0.88, letterSpacing: "0.01em",
            margin: 0,
          }}
        >
          <span style={{ color: C.ink }}>Mijn</span>
          <br />
          <span style={{ color: C.blue }}>Projecten.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap",
            gap: 16, marginTop: "clamp(24px,4vw,48px)",
          }}
        >
          <p style={{
            fontFamily: "Inter, sans-serif", fontWeight: 300,
            fontSize: "clamp(16px,1.4vw,20px)", lineHeight: 1.8,
            color: C.inkSub, maxWidth: "52ch",
            transition: "color 0.4s",
          }}>
            Branding, verpakking en fotografie. Elk project met een eigen
            visuele taal, verbonden door strategie en esthetiek.
          </p>
          <span style={{
            fontFamily: "Inter, sans-serif", fontSize: 14,
            letterSpacing: "0.28em", textTransform: "uppercase",
            color: C.blue, transition: "color 0.4s",
          }}>
            {String(TOTAL).padStart(2, "0")} werken
          </span>
        </motion.div>
      </section>

      {/* ══ STICKY SCROLL — desktop ══ */}
      <div
        className="proj-sticky-outer"
        ref={scrollRef}
        style={{ height: `${(TOTAL + 1) * 100}vh`, position: "relative" }}
      >
        <div style={{
          position: "sticky", top: "var(--navbar-h, 72px)",
          height: "calc(100vh - var(--navbar-h, 72px))",
          display: "flex",
          overflow: "hidden",
        }}>

          {/* ── LEFT: Image panel ── */}
          <div className="proj-img-panel proj-left-panel" style={{
            flex: "0 0 62%",
            padding: "clamp(28px,3.5vw,48px) clamp(14px,2vw,28px) clamp(28px,3.5vw,48px) clamp(28px,3.5vw,48px)",
            position: "relative",
          }}>
            <div className="proj-img-inner" style={{
              width: "100%", height: "100%",
              borderRadius: 12, overflow: "hidden",
              position: "relative",
            }}>
              <AnimatePresence mode="sync">
                <motion.img
                  key={active}
                  src={PROJECTS[active].image}
                  alt={PROJECTS[active].name}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.6, ease: E }}
                  style={{
                    position: "absolute", inset: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover",
                  }}
                />
              </AnimatePresence>

              {/* Category badge */}
              <div style={{
                position: "absolute", top: 24, left: 24,
                background: "#1A1AFF",
                padding: "6px 14px",
                borderRadius: 4,
              }}>
                <span style={{
                  fontFamily: "Inter, sans-serif", fontSize: 14,
                  fontWeight: 600, letterSpacing: "0.22em",
                  textTransform: "uppercase", color: "#fff", lineHeight: 1,
                }}>
                  {PROJECTS[active].sub}
                </span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Info panel ── */}
          <div className="proj-right-panel" style={{
            flex: "0 0 38%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "clamp(40px,5vw,72px) clamp(40px,5vw,64px) clamp(40px,5vw,72px) clamp(24px,3vw,40px)",
            position: "relative",
          }}>

            {/* Top: number */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{
                fontFamily: "'Anton', Impact, sans-serif",
                fontSize: "clamp(40px,5vw,72px)",
                lineHeight: 1, color: C.blue,
                transition: "color 0.4s",
              }}>
                {String(active + 1).padStart(2, "0")}
              </span>
              <span style={{
                fontFamily: "Inter, sans-serif", fontSize: 14,
                color: C.inkMuted, letterSpacing: "0.12em",
                transition: "color 0.4s",
              }}>
                / {String(TOTAL).padStart(2, "0")}
              </span>
            </div>

            {/* Middle: title + CTA + desc */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "clamp(24px,3vw,40px)" }}>

              <AnimatePresence mode="wait">
                <motion.h2
                  key={`name-${active}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: E }}
                  style={{
                    fontFamily: "'Anton', Impact, sans-serif",
                    fontSize: "clamp(32px,4.5vw,64px)",
                    textTransform: "uppercase",
                    lineHeight: 0.95, letterSpacing: "0.01em",
                    color: C.ink, transition: "color 0.4s",
                  }}
                >
                  {PROJECTS[active].name}
                </motion.h2>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`cta-${active}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, delay: 0.06, ease: E }}
                >
                  <Link
                    href={PROJECTS[active].href}
                    className="proj-cta-btn"
                    onClick={() => trackProjectClick(PROJECTS[active].name, PROJECTS[active].href, '/projects')}
                  >
                    Bekijk project <span style={{ fontSize: 14 }}>→</span>
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Dot indicators */}
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                {PROJECTS.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      width: i === active ? 24 : 6,
                      background: i === active ? "#1A1AFF" : C.border,
                    }}
                    transition={{ duration: 0.35, ease: E }}
                    style={{ height: 6, borderRadius: 999 }}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.p
                  key={`desc-${active}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, delay: 0.1, ease: E }}
                  style={{
                    fontFamily: "Inter, sans-serif", fontWeight: 300,
                    fontSize: "clamp(16px,1.4vw,20px)", lineHeight: 1.8,
                    color: C.inkSub, maxWidth: "36ch",
                    transition: "color 0.4s",
                  }}
                >
                  {PROJECTS[active].desc}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Bottom: year */}
            <div style={{
              fontFamily: "Inter, sans-serif", fontSize: 14,
              letterSpacing: "0.28em", textTransform: "uppercase",
              color: C.inkMuted, transition: "color 0.4s",
            }}>
              {PROJECTS[active].year}
            </div>
          </div>
        </div>
      </div>

      {/* ══ MOBILE LIST — < 768px ══ */}
      <section className="proj-mobile-list">
        {PROJECTS.map((p) => (
          <div key={p.id} className="proj-mobile-card">
            {/* Image */}
            <div className={`proj-mobile-img-wrap${revealingId === p.id ? " proj-color-reveal" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt={p.name} />
              <div style={{
                position: "absolute", top: 16, left: 16,
                background: "#1A1AFF",
                padding: "6px 14px", borderRadius: 4,
              }}>
                <span style={{
                  fontFamily: "Inter, sans-serif", fontSize: 14,
                  fontWeight: 600, letterSpacing: "0.22em",
                  textTransform: "uppercase", color: "#fff", lineHeight: 1,
                }}>
                  {p.sub}
                </span>
              </div>
            </div>

            {/* Meta */}
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{
                fontFamily: "'Anton', Impact, sans-serif",
                fontSize: "clamp(28px,8vw,40px)", lineHeight: 1, color: C.blue,
              }}>
                {p.id}
              </span>
              <span style={{ fontFamily: "Inter, sans-serif", fontSize: 16, color: C.inkMuted }}>
                / {String(TOTAL).padStart(2, "0")}
              </span>
            </div>

            <h2 style={{
              fontFamily: "'Anton', Impact, sans-serif",
              fontSize: "clamp(28px,8vw,48px)",
              textTransform: "uppercase",
              lineHeight: 0.95, color: C.ink,
            }}>
              {p.name}
            </h2>

            <p style={{
              fontFamily: "Inter, sans-serif", fontWeight: 300,
              fontSize: "clamp(16px,1.4vw,20px)", lineHeight: 1.8,
              color: C.inkSub, maxWidth: "44ch",
            }}>
              {p.desc}
            </p>

            <button
              className="proj-cta-btn"
              style={{ alignSelf: "flex-start" }}
              onClick={() => handleMobileProjectClick(p)}
              disabled={revealingId === p.id}
            >
              Bekijk project <span style={{ fontSize: 14 }}>→</span>
            </button>
          </div>
        ))}
      </section>

      {/* ══ CTA ══ */}
      <section
        id="contact-section"
        style={{
          background: "#1A1AFF",
          padding: "clamp(80px,12vw,160px) clamp(24px,6vw,96px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          gap: "clamp(28px,3.5vw,44px)",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8, ease: E }}
          style={{
            fontFamily: "'Anton', Impact, sans-serif",
            fontSize: "clamp(52px,9vw,120px)",
            textTransform: "uppercase", lineHeight: 0.9,
            letterSpacing: "0.01em", color: "#fff",
            margin: 0,
          }}
        >
          Een project samen aanpakken?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: "Inter, sans-serif", fontWeight: 300,
            fontSize: "clamp(16px,1.4vw,20px)", lineHeight: 1.8,
            color: "rgba(255,255,255,0.65)",
            maxWidth: "42ch", margin: 0,
          }}
        >
          Branding, verpakking of fotografie. Laten we iets maken dat blijft hangen.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25, ease: E }}
        >
          <Link
            href="/contact"
            onClick={() => trackCTAClick('Neem contact op', '/projects')}
            style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              background: "#fff", color: "#1A1AFF",
              fontFamily: "Inter, sans-serif", fontSize: 14, fontWeight: 600,
              letterSpacing: "0.28em", textTransform: "uppercase",
              padding: "16px 40px", borderRadius: 4, textDecoration: "none",
              transition: "opacity 0.22s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Neem contact op <span style={{ fontSize: 14 }}>→</span>
          </Link>
        </motion.div>
      </section>

    </div>
  )
}




