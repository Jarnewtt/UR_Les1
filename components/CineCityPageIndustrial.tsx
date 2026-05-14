"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import ProjectNav from "@/components/ProjectNav";
import { trackLightboxOpen, trackLightboxClose, trackLightboxNav, trackSoundToggle } from "@/lib/analytics";

// ── TOKENS ────────────────────────────────────────────────────────────────────
type Tokens = {
  bg: string; ink: string;
  orange: string; orangeL: string;
  grey: string; mid: string; dim: string;
  isLight: boolean;
};

const DARK: Tokens = {
  bg:      "#080807",
  ink:     "#F0EDE8",
  orange:  "#9333EA",
  orangeL: "#C084FC",
  grey:    "#3A3530",
  mid:     "#6E6A64",
  dim:     "#1E1C1A",
  isLight: false,
};

const LIGHT: Tokens = {
  bg:      "#FAF8F4",
  ink:     "#0A0908",
  orange:  "#7C3AED",
  orangeL: "#9333EA",
  grey:    "#C8C4BE",
  mid:     "#5A5650",
  dim:     "#EDE8E0",
  isLight: true,
};

function useIndustrialTheme(): Tokens {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("theme-light"));
    const handler = (e: Event) => setIsDark((e as CustomEvent).detail.isDark);
    window.addEventListener("theme-change", handler);
    return () => window.removeEventListener("theme-change", handler);
  }, []);
  return isDark ? DARK : LIGHT;
}

// ── DATA ──────────────────────────────────────────────────────────────────────
const DELIVERABLES = [
  { src: "/img/Mockup_affichereeks.jpg",     title: "Affichereeks",       category: "Print",       num: "01" },
  { src: "/img/Mockup_booklet.jpg",          title: "Programmaboekje",    category: "Editorial",   num: "02" },
  { src: "/img/Usb.jpg",                     title: "USB Flash Drive",    category: "Merch",       num: "03" },
  { src: "/img/Mockup_desktop.jpg",          title: "Desktop Interface",  category: "Webdesign",   num: "04" },
  { src: "/img/Mockup_mobile.jpg",           title: "Mobiele Interface",  category: "App-ontwerp", num: "05" },
  { src: "/img/Mockup_reserveringstool.jpg", title: "Ticketing Flow",     category: "UI/UX",       num: "06" },
];

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ── FADE UP ───────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-6%" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ── DELIVERABLE CARD ──────────────────────────────────────────────────────────
function DeliverableCard({ item, index, onSelect, T }: {
  item: typeof DELIVERABLES[0]; index: number;
  onSelect: () => void; T: Tokens;
}) {
  const TT = "background 0.4s ease, color 0.4s ease, border-color 0.4s ease";
  return (
    <FadeUp delay={Math.min(index * 0.08, 0.32)}>
      <button
        onClick={onSelect}
        style={{
          display: "block", width: "100%", textAlign: "left",
          background: "none", border: "none", padding: 0, cursor: "pointer",
        }}
      >
        {/* Image */}
        <div style={{
          width: "100%", aspectRatio: "4 / 3", overflow: "hidden",
          background: T.dim, transition: TT,
        }}>
          <img
            src={item.src}
            alt={item.title}
            style={{
              width: "100%", height: "100%", objectFit: "cover",
              display: "block", transition: "transform 0.45s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"; }}
          />
        </div>

        {/* Meta */}
        <div style={{ paddingTop: 12 }}>
          <span style={{
            display: "inline-block",
            fontFamily: "'DM Mono', monospace",
            fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase",
            color: T.orange,
            background: T.isLight ? `${T.orange}14` : `${T.orange}22`,
            border: `1px solid ${T.orange}55`,
            padding: "3px 10px",
            marginBottom: 8,
            transition: TT,
          }}>{item.category}</span>
          <div style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(18px, 2.2vw, 26px)",
            letterSpacing: "0.04em", lineHeight: 1.1,
            color: T.ink, fontWeight: 400, transition: TT,
          }}>{item.title}</div>
        </div>
      </button>
    </FadeUp>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function CineCityPageIndustrial() {
  const T = useIndustrialTheme();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const TT = "background 0.4s ease, color 0.4s ease, border-color 0.4s ease";

  const toggleSound = () => {
    if (!videoRef.current) return;
    const newMuted = !muted;
    videoRef.current.muted = newMuted;
    setMuted(newMuted);
    trackSoundToggle(newMuted ? 'mute' : 'unmute', 'cinecity');
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape")     setSelectedIndex(null);
      if (e.key === "ArrowRight") setSelectedIndex(i => (i! + 1) % DELIVERABLES.length);
      if (e.key === "ArrowLeft")  setSelectedIndex(i => (i! - 1 + DELIVERABLES.length) % DELIVERABLES.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex]);

  return (
    <div style={{
      minHeight: "100vh", background: T.bg, color: T.ink,
      overflowX: "clip",
      fontFamily: "'DM Mono', monospace",
      transition: TT,
    }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${T.orange}; color: #fff; }
        ::-webkit-scrollbar { width: 2px; }
        ::-webkit-scrollbar-thumb { background: ${T.orange}55; }

        .cc-hero-bottom {
          padding: 0 clamp(16px, 5vw, 60px) 100px;
        }
        @media (min-width: 768px) {
          .cc-hero-bottom { padding-bottom: clamp(40px, 5vw, 72px); }
        }
        .cc-hero-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        @media (min-width: 480px) {
          .cc-hero-actions {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .cc-hero-btn {
          width: 100%;
          justify-content: center;
        }
        @media (min-width: 480px) {
          .cc-hero-btn { width: auto; justify-content: flex-start; }
        }
        .cc-section {
          padding: clamp(48px, 8vw, 96px) clamp(16px, 5vw, 60px);
        }
        .cc-concept-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(32px, 5vw, 72px);
          align-items: start;
        }
        @media (min-width: 768px) {
          .cc-concept-grid { grid-template-columns: 1fr 1fr; }
        }
        .cc-deliverables-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(20px, 3vw, 36px);
        }
        @media (min-width: 768px) {
          .cc-deliverables-grid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 400px) {
          .cc-stats-grid { grid-template-columns: 1fr !important; }
        }
        .cc-meta-desktop { display: none; }
        @media (min-width: 768px) { .cc-meta-desktop { display: block; } }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        position: "relative", minHeight: "100svh", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        borderBottom: `1px solid ${T.grey}`, transition: TT,
      }}>

        {/* Video */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          style={{
            position: "absolute", inset: 0, zIndex: 0,
            width: "100%", height: "100%", objectFit: "cover",
            opacity: 0.88,
          }}
        >
          <source src="/img/2526_VDL3_WaterschootJ_openingtitle.mp4" type="video/mp4" />
        </video>

        {/* Dark gradient overlays — always dark so video stays visible */}
        <div style={{ position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 18%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.08) 68%, transparent 100%)",
        }} />
        <div style={{ position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(to right, rgba(0,0,0,0.55) 0%, transparent 55%)",
        }} />

        {/* Meta — desktop top-right */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="cc-meta-desktop"
          style={{
            position: "absolute", top: 52, right: 60,
            textAlign: "right", zIndex: 10,
            fontFamily: "'DM Mono', monospace",
            fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase",
            color: T.mid, lineHeight: 2.6, transition: TT,
          }}
        >
          <div>Antwerpen — Filmfestival</div>
          <div>Visuele Identiteit</div>
          <div style={{ color: T.orange }}>CineCity 2025</div>
        </motion.div>

        {/* Hero content */}
        <div className="cc-hero-bottom" style={{ position: "relative", zIndex: 5 }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            style={{
              fontSize: 13, letterSpacing: "0.36em", textTransform: "uppercase",
              color: "rgba(255,255,255,0.6)", marginBottom: 24,
              display: "flex", alignItems: "center", gap: 12,
            }}
          >
            <span style={{ width: 20, height: 1, background: `${T.orange}`, display: "inline-block" }} />
            Visuele Identiteit — Coming of Age
          </motion.div>

          {/* Title */}
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.55, ease: EASE_OUT }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(64px, 11vw, 148px)",
                lineHeight: 0.85, letterSpacing: "0.01em",
                color: "#fff",
              }}
            >
              Cine
            </motion.h1>
          </div>
          <div style={{ overflow: "hidden" }}>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.55, ease: EASE_OUT }}
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(64px, 11vw, 148px)",
                lineHeight: 0.85, letterSpacing: "0.01em",
                WebkitTextStroke: `clamp(0.5px, 0.2vw, 2px) ${T.orange}`,
                color: "transparent",
              }}
            >
              City
            </motion.h1>
          </div>

          {/* Bottom bar: sound + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="cc-hero-actions"
            style={{
              marginTop: 40,
              borderTop: "1px solid rgba(255,255,255,0.2)",
              paddingTop: 24,
            }}
          >
            {/* Sound toggle */}
            <button
              onClick={toggleSound}
              className="cc-hero-btn"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                border: "1px solid rgba(255,255,255,0.35)", color: "rgba(255,255,255,0.7)",
                fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase",
                padding: "14px 20px", background: "none",
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer", transition: "border-color 0.3s, color 0.3s",
                minHeight: 48,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.8)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.35)"; e.currentTarget.style.color = "rgba(255,255,255,0.7)"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {muted ? (
                  <>
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </>
                ) : (
                  <>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </>
                )}
              </svg>
              {muted ? "Geluid aan" : "Dempen"}
            </button>

            {/* CTA */}
            <a
              href="#cc-work"
              className="cc-hero-btn"
              style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                border: "none", color: "#fff",
                fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase",
                padding: "14px 24px", transition: "opacity 0.2s",
                textDecoration: "none", fontFamily: "'DM Mono', monospace",
                background: T.orange, minHeight: 48,
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = "0.82"; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
            >
              Bekijk deliverables
              <span style={{ display: "inline-block" }}>↓</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CONCEPT ── */}
      <section className="cc-section" style={{ borderBottom: `1px solid ${T.dim}`, transition: TT }}>
        <div className="cc-concept-grid">

          {/* Left: heading */}
          <div>
            <FadeUp>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase",
                color: T.orange, marginBottom: 20,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ width: 16, height: 1, background: T.orange, display: "inline-block" }} />
                De Uitdaging
              </div>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(32px, 4.5vw, 64px)",
                letterSpacing: "0.04em", lineHeight: 0.94,
                color: T.ink, fontWeight: 400, transition: TT,
              }}>
                Groei zonder<br />
                <span style={{
                  WebkitTextStroke: `clamp(0.4px, 0.15vw, 1.5px) ${T.orange}`,
                  color: "transparent",
                }}>clichés</span>
              </h2>
            </FadeUp>
          </div>

          {/* Right: body + stats */}
          <FadeUp delay={0.15}>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: "clamp(16px, 1.4vw, 20px)", lineHeight: 1.8,
              color: T.ink, marginBottom: 24, transition: TT,
            }}>
              Hoe visualiseer je <span style={{ color: T.orangeL }}>groei en identiteit</span> voor
              jongeren van 18 tot 25 jaar zonder letterlijke filmscènes.
              Het thema <em style={{ fontStyle: "italic" }}>Coming of Age</em> vraagt om beeldtaal
              die nieuwsgierigheid wekt en aansluit bij een stedelijk, Antwerps publiek.
            </p>
            <p style={{
              fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
              fontSize: "clamp(16px, 1.4vw, 20px)", lineHeight: 1.8,
              color: T.mid, transition: TT,
            }}>
              Het dagprogramma van CineCity vertaald naar een flexibele visuele identiteit.
              Herkenbaar, fris en energiek genoeg voor diverse media.
            </p>

            {/* Stats */}
            <div
              className="cc-stats-grid"
              style={{
                marginTop: 40, display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1, background: T.dim, transition: TT,
              }}
            >
              {[["06", "Deliverables"], ["01", "Festival"], ["∞", "Mogelijkheden"]].map(([n, l], i) => (
                <div key={i} style={{
                  background: T.bg, padding: "22px 18px", transition: TT,
                  borderLeft: i === 0 ? `3px solid ${T.orange}` : "none",
                }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(28px, 3.5vw, 40px)", color: T.orange, lineHeight: 1,
                  }}>{n}</div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "clamp(11px, 1vw, 13px)", letterSpacing: "0.2em", textTransform: "uppercase",
                    color: T.mid, marginTop: 6, transition: TT,
                  }}>{l}</div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── DELIVERABLES ── */}
      <section id="cc-work" className="cc-section" style={{ borderBottom: `1px solid ${T.dim}`, transition: TT }}>

        {/* Section header */}
        <div style={{
          display: "flex", alignItems: "baseline",
          justifyContent: "space-between", marginBottom: "clamp(28px, 4vw, 48px)",
        }}>
          <FadeUp>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "0.04em",
              color: T.ink, fontWeight: 400, transition: TT,
            }}>Deliverables</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 12, letterSpacing: "0.2em",
              textTransform: "uppercase", color: T.mid,
            }}>
              {DELIVERABLES.length} werken
            </span>
          </FadeUp>
        </div>

        {/* Grid */}
        <div className="cc-deliverables-grid">
          {DELIVERABLES.map((item, i) => (
            <DeliverableCard
              key={i}
              item={item}
              index={i}
              T={T}
              onSelect={() => { setSelectedIndex(i); trackLightboxOpen(String(i), 'cinecity') }}
            />
          ))}
        </div>
      </section>

      <ProjectNav currentHref="/CineCity" />

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => { setSelectedIndex(null); trackLightboxClose('cinecity') }}
            style={{
              position: "fixed", inset: 0, zIndex: 9000,
              background: T.isLight ? "rgba(250,248,244,0.96)" : "rgba(8,8,7,0.97)",
              backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: "48px 72px",
            }}
          >
            {/* Prev */}
            <button
              onClick={e => {
                e.stopPropagation();
                setSelectedIndex(i => { const next = (i! - 1 + DELIVERABLES.length) % DELIVERABLES.length; trackLightboxNav('prev', String(next)); return next; });
              }}
              aria-label="Vorige"
              style={{
                position: "absolute", left: 20,
                background: "none", border: "none",
                color: `${T.ink}55`, fontSize: 28, padding: 16,
                cursor: "pointer", transition: "color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = T.orangeL; }}
              onMouseLeave={e => { e.currentTarget.style.color = `${T.ink}55`; }}
            >
              ←
            </button>

            {/* Image + caption */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              onClick={e => e.stopPropagation()}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: 18,
                maxWidth: "90vw",
              }}
            >
              <img
                src={DELIVERABLES[selectedIndex].src}
                alt={DELIVERABLES[selectedIndex].title}
                style={{
                  maxHeight: "74vh", maxWidth: "100%", objectFit: "contain",
                  boxShadow: T.isLight
                    ? `0 32px 72px rgba(0,0,0,0.1), 0 0 48px ${T.orange}18`
                    : `0 32px 96px rgba(0,0,0,0.88), 0 0 48px ${T.orange}22`,
                  border: `1px solid ${T.orange}22`,
                }}
              />
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12, letterSpacing: "0.28em", textTransform: "uppercase",
                  color: T.orange, marginBottom: 6,
                }}>
                  {DELIVERABLES[selectedIndex].category}
                </div>
                <div style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 22, letterSpacing: "0.08em", color: T.ink,
                }}>
                  {DELIVERABLES[selectedIndex].title}
                </div>
              </div>
            </motion.div>

            {/* Next */}
            <button
              onClick={e => {
                e.stopPropagation();
                setSelectedIndex(i => { const next = (i! + 1) % DELIVERABLES.length; trackLightboxNav('next', String(next)); return next; });
              }}
              aria-label="Volgende"
              style={{
                position: "absolute", right: 20,
                background: "none", border: "none",
                color: `${T.ink}55`, fontSize: 28, padding: 16,
                cursor: "pointer", transition: "color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = T.orangeL; }}
              onMouseLeave={e => { e.currentTarget.style.color = `${T.ink}55`; }}
            >
              →
            </button>

            {/* Top-right: counter + close */}
            <div style={{
              position: "absolute", top: 24, right: 28,
              display: "flex", alignItems: "center", gap: 20,
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 12, letterSpacing: "0.2em",
                textTransform: "uppercase", color: `${T.ink}55`,
              }}>
                {String(selectedIndex + 1).padStart(2, "0")} / {String(DELIVERABLES.length).padStart(2, "0")}
              </span>
              <button
                onClick={() => { setSelectedIndex(null); trackLightboxClose('cinecity') }}
                aria-label="Sluiten"
                style={{
                  background: T.orange, border: "none",
                  color: "#fff",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12, letterSpacing: "0.24em", textTransform: "uppercase",
                  padding: "8px 16px", cursor: "pointer",
                  transition: "opacity 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = "0.85"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >
                Sluiten [ESC]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
