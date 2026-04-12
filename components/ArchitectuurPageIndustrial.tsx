"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  motion, useScroll, useTransform, useInView,
  AnimatePresence,
} from 'framer-motion';

type Tokens = {
  bg: string; surface: string; surfaceAlt: string;
  ink: string; inkSub: string; inkMuted: string;
  orange: string; orangeDim: string;
  border: string; borderStrong: string;
  isLight: boolean;
}

const DARK: Tokens = {
  bg: "#080807", surface: "#111110", surfaceAlt: "#0C0C0A",
  ink: "#F0EDE8", inkSub: "#C8C4BE", inkMuted: "#6E6A64",
  orange: "#C9A96E", orangeDim: "rgba(201,169,110,0.10)",
  border: "#262420", borderStrong: "#3A3630",
  isLight: false,
};

const LIGHT: Tokens = {
  bg: "#FAFAF8", surface: "#F0EDE8", surfaceAlt: "#E8E4DC",
  ink: "#0A0908", inkSub: "#3A3530", inkMuted: "#5A5650",
  orange: "#A07840", orangeDim: "rgba(160,120,64,0.08)",
  border: "#DDD8D0", borderStrong: "#C4BEB4",
  isLight: true,
};

function getTokens(): Tokens {
  if (typeof window === "undefined") return DARK;
  return document.documentElement.classList.contains("theme-light") ? LIGHT : DARK;
}

function useTheme(): Tokens {
  const [C, setC] = useState<Tokens>(DARK);
  useEffect(() => {
    setC(getTokens());
    const obs = new MutationObserver(() => setC(getTokens()));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return C;
}

type Panel = { id: number; imagePath: string; label: string; sub: string };
type Props  = { heroTop?: string; heroBottom?: string; tribute?: string; introText?: string; panels?: Panel[] };

const DEFAULT_PANELS: Panel[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  imagePath: `/img/Paneel_${i + 1}.jpg`,
  label: ["Chaotische lijn","Organische lijn","Geordende lijn","","Abstracte lijn",
          "Rechte lijn","Ritmische lijn","","Doorlopende lijn","Gebogen lijn",
          "Onregelmatige lijn","Onderbroken lijn",][i],
  sub: `Paneel ${String(i + 1).padStart(2, "0")}`,
}));

const GALLERY = Array.from({ length: 10 }, (_, i) => `/img/Gallerij_${i + 1}.jpg`);
const EASE: [number,number,number,number] = [0.16, 1, 0.3, 1];

// Cinematic slide data
const HERO_SLIDES = [
  { src: GALLERY[0], caption: "Licht als architectuur" },
  { src: GALLERY[2], caption: "Lijn als herinnering" },
  { src: GALLERY[1], caption: "Schaduw als taal" },
];



function Grain({ isLight }: { isLight: boolean }) {
  return (
    <svg style={{ position: "fixed", inset: 0, zIndex: 9990, opacity: isLight ? 0.025 : 0.045, pointerEvents: "none", width: "100%", height: "100%" }}>
      <filter id="hb-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={4} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#hb-grain)" />
    </svg>
  );
}

function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ overflow: "hidden" }}>
      <motion.div initial={{ y: "105%", skewY: 4 }} animate={inView ? { y: 0, skewY: 0 } : {}} transition={{ duration: 0.9, delay, ease: EASE }}>
        {children}
      </motion.div>
    </div>
  );
}

// ── SLIDE COUNTER ─────────────────────────────────────────────────────────────
function SlideCounter({ current, total, orange, inkMuted }: { current: number; total: number; orange: string; inkMuted: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, color: orange, letterSpacing: "0.1em" }}>
        {String(current + 1).padStart(2, "0")}
      </span>
      <div style={{ width: 1, height: 40, background: `linear-gradient(to bottom, ${orange}80, transparent)` }} />
      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 11, color: inkMuted, letterSpacing: "0.1em" }}>
        {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}

// ── PANEL CARD ────────────────────────────────────────────────────────────────
function PanelCard({ panel, index, isUnfolded, onOpen, C }: { panel: Panel; index: number; isUnfolded: boolean; onOpen: () => void; C: Tokens }) {
  const [flipped, setFlipped] = useState(false);
  const col = index % 6, row = Math.floor(index / 6);
  const T = "0.45s ease";
  return (
    <div
      onClick={() => isUnfolded ? setFlipped(f => !f) : onOpen()}
      style={{
        position: "absolute", width: 160, height: 250,
        transform: isUnfolded
          ? `translateX(${(col - 2.5) * 175}px) translateY(${(row - 0.5) * 310}px) rotateY(${flipped ? 180 : 0}deg) scale(1)`
          : `translateX(${(index - 5.5) * 4}px) translateY(${index * 1.5}px) rotateY(${index * 4}deg) rotateZ(${index * 0.6}deg) scale(0.82)`,
        transition: "transform 1.4s cubic-bezier(0.2,0.85,0.2,1)",
        transformStyle: "preserve-3d",
        zIndex: isUnfolded ? 10 : 30 - index,
        cursor: "pointer",
      }}>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", background: C.surface, border: `1px solid ${C.border}`, overflow: "hidden", transition: `background ${T}, border-color ${T}` }}>
        <img src={panel.imagePath} alt={panel.label}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) contrast(1.15)", transition: "filter 0.8s ease" }}
          onMouseEnter={e => (e.currentTarget.style.filter = "grayscale(0%) contrast(1)")}
          onMouseLeave={e => (e.currentTarget.style.filter = "grayscale(100%) contrast(1.15)")} />

      </div>
      <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "#F0EDE8", padding: "20px 16px", display: "flex", flexDirection: "column", justifyContent: "space-between", border: "1px solid #C4BEB4" }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(8,8,7,0.4)", marginBottom: 8 }}>Tegenstelling</div>
          <div style={{ fontSize: 12, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em", color: "#080807", lineHeight: 1.2 }}>{panel.label.toUpperCase()}</div>
        </div>
        <div>
          <div style={{ height: 1, background: C.orange, opacity: 0.4, marginBottom: 10 }} />
          <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(8,8,7,0.45)", lineHeight: 1.8 }}>Studie naar Lijnen<br />FOMU × Binet 2025</div>
        </div>
      </div>
    </div>
  );
}

function GalleryItem({ src, index, onClick, C }: { src: string; index: number; onClick: () => void; C: Tokens }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: (index % 5) * 0.08, ease: EASE }}
      onClick={onClick}
      style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden", background: C.surface, cursor: "none", border: `0.5px solid ${C.border}`, transition: "background 0.45s ease, border-color 0.45s ease" }}>
      <img src={src} alt={`Fragment ${index + 1}`}
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) contrast(1.1)", opacity: C.isLight ? 0.8 : 0.65, transition: "filter 1s ease, opacity 1s ease, transform 1.2s ease", transform: "scale(1.02)" }}
        onMouseEnter={e => { const el = e.currentTarget; el.style.filter = "grayscale(0%)"; el.style.opacity = "1"; el.style.transform = "scale(1.06)"; }}
        onMouseLeave={e => { const el = e.currentTarget; el.style.filter = "grayscale(100%) contrast(1.1)"; el.style.opacity = C.isLight ? "0.8" : "0.65"; el.style.transform = "scale(1.02)"; }} />
      <div
        style={{
          position: "absolute", bottom: 12, left: 12, fontSize: 8,
          letterSpacing: "0.28em", textTransform: "uppercase",
          color: "transparent", background: "transparent",
          padding: "4px 8px", transition: "color 0.4s ease, background 0.4s ease",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = C.inkSub;
          e.currentTarget.style.background = C.isLight ? "rgba(250,250,248,0.85)" : "rgba(8,8,7,0.65)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = "transparent";
          e.currentTarget.style.background = "transparent";
        }}
      >
        P_{String(index + 1).padStart(2, "0")} — Vergroot
      </div>
    </motion.div>
  );
}

export default function HeleneBinetPage({
  heroTop = "Shadow &",
  heroBottom = "Light",
  tribute = "Een tribuut aan Hélène Binet",
  introText = "",
  panels = DEFAULT_PANELS,
}: Props) {

  const C = useTheme();

  const [isUnfolded, setIsUnfolded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [heroReady, setHeroReady] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroY       = useTransform(scrollYProgress, [0, 0.2],  ["0%", "18%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Cinematic slide timer
  useEffect(() => {
    setHeroReady(true);
    let start = Date.now();
    const DURATION = 6000;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      if (elapsed >= DURATION) {
        setActiveSlide(i => (i + 1) % HERO_SLIDES.length);
        start = Date.now();
      }
    }, 50);
    return () => clearInterval(tick);
  }, []);

  const openLightbox = (i: number) => { setLightboxIndex(i); setSelectedImage(GALLERY[i]); };

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === "ArrowRight") setLightboxIndex(i => { const n = (i + 1) % GALLERY.length; setSelectedImage(GALLERY[n]); return n; });
      if (e.key === "ArrowLeft")  setLightboxIndex(i => { const n = (i - 1 + GALLERY.length) % GALLERY.length; setSelectedImage(GALLERY[n]); return n; });
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [selectedImage]);

  const TT = "background 0.45s ease, color 0.45s ease, border-color 0.45s ease";

  return (
    <div ref={containerRef} style={{ minHeight: "100vh", background: C.bg, color: C.ink, overflowX: "hidden", cursor: "none", fontFamily: "'DM Mono', monospace", transition: TT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;1,300&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { cursor:none !important; }
        ::selection { background:${C.orange}; color:#fff; }
        ::-webkit-scrollbar { width:1px; }
        ::-webkit-scrollbar-thumb { background:${C.orange}60; }
        a { text-decoration:none; color:inherit; }

        /* ── Responsive layout ── */
        .hb-intro-grid { display:grid; grid-template-columns:1fr; gap:40px; align-items:start; padding:clamp(40px,7vw,96px) clamp(16px,5vw,60px); }
        @media (min-width:768px) { .hb-intro-grid { grid-template-columns:1fr 1fr; gap:80px; } }

        .hb-gallery-grid { display:grid; grid-template-columns:repeat(2,1fr); }
        @media (min-width:640px)  { .hb-gallery-grid { grid-template-columns:repeat(3,1fr); } }
        @media (min-width:1024px) { .hb-gallery-grid { grid-template-columns:repeat(5,1fr); } }

        .hb-leporello-mobile { display:grid; grid-template-columns:repeat(3,1fr); gap:4px; padding:20px; }
        .hb-leporello-3d { display:none; }
        @media (min-width:768px) { .hb-leporello-mobile { display:none; } .hb-leporello-3d { display:block; } }
      `}</style>




      {/* ══════════════════════════════════════════════════════════
          ── CINEMATIC HERO ──
          ══════════════════════════════════════════════════════════ */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="cinematic-hero"
      >
        <section style={{
          position: "relative",
          height: "100vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderBottom: `1px solid ${C.border}`,
        }}>

          {/* ── BG SLIDESHOW with Ken Burns ── */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            {HERO_SLIDES.map((slide, i) => (
              <AnimatePresence key={i}>
                {activeSlide === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.2, ease: "easeInOut" }}
                    style={{ position: "absolute", inset: 0 }}
                  >
                    <motion.img
                      src={slide.src}
                      alt=""
                      initial={{ scale: 1.08 }}
                      animate={{ scale: 1.0 }}
                      transition={{ duration: 7, ease: "easeOut" }}
                      style={{
                        width: "100%", height: "100%",
                        objectFit: "cover",
                        filter: "grayscale(100%) contrast(1.15) brightness(0.55)",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </div>

          {/* ── Cinematic vignette ── */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
            background: "radial-gradient(ellipse at center, transparent 30%, rgba(8,8,7,0.75) 100%)",
          }} />

          {/* ── Left edge gradient ── */}
          <div style={{
            position: "absolute", left: 0, top: 0, bottom: 0, width: "25%", zIndex: 1, pointerEvents: "none",
            background: "linear-gradient(to right, rgba(8,8,7,0.7), transparent)",
          }} />

          {/* ── Bottom gradient ── */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", zIndex: 1, pointerEvents: "none",
            background: "linear-gradient(to top, rgba(8,8,7,0.9), transparent)",
          }} />



          {/* ── Top bar ── */}
          <div style={{
          }}>

            {/* Slide dots top right */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={heroReady ? { opacity: 1 } : {}}
              transition={{ delay: 1, duration: 0.8 }}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              {HERO_SLIDES.map((_, i) => (
                <button key={i} onClick={() => { setActiveSlide(i); }}
                  style={{
                    width: i === activeSlide ? 24 : 4,
                    height: 4,
                    borderRadius: 2,
                    background: i === activeSlide ? C.orange : "rgba(240,237,232,0.25)",
                    border: "none",
                    cursor: "none",
                    transition: "width 0.4s ease, background 0.4s ease",
                  }}
                />
              ))}
            </motion.div>
          </div>

          {/* ── LEFT VERTICAL LINE ── */}
          <motion.div
            initial={{ scaleY: 0 }}
            animate={heroReady ? { scaleY: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.6, ease: EASE }}
            style={{
              position: "absolute", left: 28, top: "8%", bottom: "12%", width: 1, zIndex: 10,
              background: `linear-gradient(to bottom, transparent, ${C.orange}55 30%, ${C.orange}55 70%, transparent)`,
              transformOrigin: "top",
            }}
          />

          {/* ── RIGHT: SLIDE COUNTER ── */}
          <div style={{
            position: "absolute", right: 40, top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
          }}>
            <motion.div
              initial={{ opacity: 0, x: 12 }}
              animate={heroReady ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.8, ease: EASE }}
            >
              <SlideCounter current={activeSlide} total={HERO_SLIDES.length} orange={C.orange} inkMuted="rgba(240,237,232,0.3)" />
            </motion.div>
          </div>

          {/* ── MAIN TITLE BLOCK ── */}
          <div style={{
            position: "absolute",
            bottom: "22%",
            left: "clamp(20px, 5vw, 60px)",
            zIndex: 10,
            maxWidth: "85vw",
          }}>
            {/* Slide caption */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`caption-${activeSlide}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.7, ease: EASE }}
                style={{
                  display: "flex", alignItems: "center", gap: 14, marginBottom: 24,
                }}
              >
                <span style={{ width: 28, height: 1, background: C.orange, opacity: 0.7, flexShrink: 0 }} />
                <span style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontStyle: "italic", fontWeight: 300,
                  fontSize: 13,
                  color: "rgba(240,237,232,0.85)",
                  letterSpacing: "0.06em",
                }}>
                  {HERO_SLIDES[activeSlide].caption}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Hero headline — big cinematic text */}
            <div style={{ overflow: "hidden", marginBottom: 2 }}>
              <motion.h1
                initial={{ y: "110%", skewY: 5 }}
                animate={heroReady ? { y: 0, skewY: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.35, ease: EASE }}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(64px, 10vw, 140px)",
                  lineHeight: 0.86,
                  letterSpacing: "0.015em",
                  color: "#F0EDE8",
                  margin: 0,
                }}
              >
                {heroTop}
              </motion.h1>
            </div>
            <div style={{ overflow: "hidden", marginBottom: 36 }}>
              <motion.h1
                initial={{ y: "110%", skewY: 5 }}
                animate={heroReady ? { y: 0, skewY: 0 } : {}}
                transition={{ duration: 1.2, delay: 0.52, ease: EASE }}
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(64px, 10vw, 140px)",
                  lineHeight: 0.86,
                  letterSpacing: "0.015em",
                  WebkitTextStroke: `clamp(0.4px, 0.15vw, 1.5px) ${C.orange}`,
                  color: "transparent",
                  margin: 0,
                  textShadow: "none",
                }}
              >
                {heroBottom}
              </motion.h1>
            </div>

            {/* Tribute line */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={heroReady ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.95, duration: 1, ease: EASE }}
              style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}
            >
              <span style={{ width: 28, height: 1, background: C.orange, opacity: 0.7, flexShrink: 0 }} />
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontStyle: "italic", fontWeight: 300,
                fontSize: 15,
                color: "rgba(240,237,232,0.85)",
              }}>
                {tribute}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={heroReady ? { opacity: 1 } : {}}
              transition={{ delay: 1.15, duration: 0.8 }}
              style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 42 }}
            >
              <span style={{ fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(240,237,232,0.75)" }}>
                Jarne Waterschoot
              </span>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: C.orange, opacity: 0.5, flexShrink: 0 }} />
              <span style={{ fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(240,237,232,0.75)" }}>
                Fotografische studie
              </span>
            </motion.div>
          </div>



        </section>
      </motion.section>

      {/* ── INTRO ── */}
      <section className="hb-intro-grid" style={{ borderBottom: `1px solid ${C.border}`, transition: TT }}>
        <div>
          <RevealText>
            <div style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: C.orange, marginBottom: 20, display: "flex", alignItems: "center", gap: 12, transition: "color 0.45s ease" }}>
              <span style={{ width: 18, height: 1, background: C.orange, opacity: 0.7, display: "inline-block" }} />
              Project — FOMU Antwerpen
            </div>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(32px, 4.5vw, 62px)", letterSpacing: "0.04em", lineHeight: 0.95, color: C.ink, marginBottom: 28, transition: "color 0.45s ease" }}>
              Mijn blik op<br />architecturaal<br />
              <span style={{ WebkitTextStroke: `clamp(0.4px, 0.15vw, 1.5px) ${C.orange}`, color: "transparent" }}>licht &amp; schaduw</span>
            </h2>
          </RevealText>
        </div>
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, delay: 0.2, ease: EASE }}>
          {introText ? (
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 15, lineHeight: 1.95, color: C.inkSub, transition: "color 0.45s ease" }}>
              {introText}
            </p>
          ) : (
            <>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 15, lineHeight: 1.95, color: C.inkSub, marginBottom: 28, transition: "color 0.45s ease" }}>
                In opdracht van het <span style={{ color: C.ink }}>FOMU te Antwerpen</span> analyseerde ik het fotografisch werk van Hélène Binet. Vanuit haar visuele stijl onderzocht ik hoe lijnen een belangrijke rol spelen in haar fotografie en vertaalde dit naar vijf visuele tegenstellingen rond lijnen. Deze werden uitgewerkt in een leporello die als tribuut tijdens een tentoonstelling zou kunnen worden uitgedeeld.
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 15, lineHeight: 1.95, color: C.inkSub, transition: "color 0.45s ease" }}>
                Binet's analoge, contrastrijke manier van kijken diende als inspiratie. De beelden, de keuzes en de compositie zijn volledig van <span style={{ color: C.inkSub, fontStyle: "italic" }}>mijn hand</span>.
              </p>
            </>
          )}
          <div style={{ marginTop: 48, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1, background: C.border, transition: "background 0.45s ease" }}>
            {[["05", "Tegenstellingen"], ["10", "Foto's"]].map(([n, l], i) => (
              <div key={i} style={{ background: C.bg, padding: "24px 20px", transition: TT }}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: C.ink, lineHeight: 1, transition: "color 0.45s ease" }}>{n}</div>
                <div style={{ fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase", color: C.inkMuted, marginTop: 6, transition: "color 0.45s ease" }}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── LEPORELLO ── */}
      <section id="lijnen" className="hidden md:block" style={{ borderBottom: `1px solid ${C.border}`, transition: TT }}>
        <motion.div onClick={() => setIsUnfolded(u => !u)} whileHover={{ background: C.surfaceAlt }}
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(20px,4vw,32px) clamp(16px,5vw,60px)", cursor: "none", borderBottom: `1px solid ${C.border}`, transition: TT }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: C.inkMuted, marginBottom: 8, transition: "color 0.45s ease" }}>
              {isUnfolded ? "Klik een paneel om te draaien" : "Klik om de studie te openen"}
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(20px,3vw,38px)", letterSpacing: "0.06em", color: C.ink, transition: "color 0.45s ease" }}>
              {isUnfolded ? "Sluit Leporello" : "Bekijk de Lijnen"}
            </div>
          </div>
          <motion.div animate={{ rotate: isUnfolded ? 45 : 0, borderColor: isUnfolded ? C.orange : C.border }} transition={{ duration: 0.4 }}
            style={{ width: 44, height: 44, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: isUnfolded ? C.orange : C.inkMuted, flexShrink: 0 }}>+</motion.div>
        </motion.div>

        {/* Mobile fallback: simple grid */}
        <div className="hb-leporello-mobile">
          {panels.map((panel) => (
            <div key={panel.id} style={{ position: "relative", overflow: "hidden", aspectRatio: "2/3", background: C.surface, border: `0.5px solid ${C.border}` }}>
              <img src={panel.imagePath} alt={panel.label} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%) contrast(1.15)" }} />
              {panel.label && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.6)", padding: "4px 6px" }}>
                  <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(240,237,232,0.7)" }}>{panel.label}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: 3D leporello */}
        <div className="hb-leporello-3d">
          <div style={{ perspective: "3200px", overflow: "hidden" }}>
            <motion.div
              animate={{ height: isUnfolded ? 660 : 300 }}
              transition={{ duration: 0.8, ease: EASE }}
              style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {panels.map((panel, i) => (
                <PanelCard key={panel.id} panel={panel} index={i} isUnfolded={isUnfolded} onOpen={() => setIsUnfolded(true)} C={C} />
              ))}
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isUnfolded && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.6, delay: 1.2, ease: EASE }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, padding: "20px 0 28px", borderTop: `1px solid ${C.border}`, transition: TT }}>
              <span style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: C.inkMuted, transition: "color 0.45s ease" }}>Klik op een paneel om het te draaien</span>
              <div style={{ display: "flex", gap: 4 }}>
                {[0, 1, 2].map(i => (
                  <motion.span key={i} animate={{ opacity: [0.15, 0.6, 0.15] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.25 }}
                    style={{ width: 3, height: 3, borderRadius: "50%", background: C.orange, display: "inline-block", transition: "background 0.45s ease" }} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ── GALLERY ── */}
      <section>
        <div style={{ padding: "clamp(28px,4vw,56px) clamp(16px,5vw,60px) clamp(14px,2vw,28px)", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "baseline", justifyContent: "space-between", transition: TT }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 24, height: 1, background: C.orange, opacity: 0.6, display: "inline-block", transition: "background 0.45s ease" }} />
            <span style={{ fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: C.inkMuted, transition: "color 0.45s ease" }}>Fotografisch Archief</span>
          </motion.div>
          <span style={{ fontSize: 9, letterSpacing: "0.16em", color: C.inkMuted, transition: "color 0.45s ease" }}>10 Fragmenten</span>
        </div>
        <div className="hb-gallery-grid">
          {GALLERY.map((src, i) => <GalleryItem key={i} src={src} index={i} onClick={() => openLightbox(i)} C={C} />)}
        </div>
      </section>

      {/* ── CLOSING ── */}
      <section style={{ padding: "clamp(60px,10vw,120px) clamp(20px,5vw,60px)", borderTop: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", transition: TT }}>
        <RevealText><div style={{ fontSize: 9, letterSpacing: "0.36em", textTransform: "uppercase", color: C.inkMuted, marginBottom: 40, transition: "color 0.45s ease" }}>Jarne Waterschoot × FOMU × 2025</div></RevealText>
        <RevealText delay={0.1}><div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px,6vw,88px)", letterSpacing: "0.04em", lineHeight: 0.9, color: C.ink, marginBottom: 8, transition: "color 0.45s ease" }}>Shadow is the</div></RevealText>
        <RevealText delay={0.2}><div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px,6vw,88px)", letterSpacing: "0.04em", lineHeight: 0.9, WebkitTextStroke: `clamp(0.5px, 0.2vw, 2px) ${C.orange}`, color: "transparent" }}>architect of light</div></RevealText>
        <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.4, ease: EASE }}
          style={{ width: 1, height: 80, background: `linear-gradient(to bottom, ${C.orange}90, transparent)`, marginTop: 56, transformOrigin: "top", transition: "background 0.45s ease" }} />
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            onClick={() => setSelectedImage(null)}
            style={{ position: "fixed", inset: 0, zIndex: 9000, background: C.isLight ? "rgba(250,250,248,0.97)" : "rgba(8,8,7,0.97)", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px", cursor: "none", transition: "background 0.45s ease" }}>

            <button onClick={e => { e.stopPropagation(); const n = (lightboxIndex - 1 + GALLERY.length) % GALLERY.length; setLightboxIndex(n); setSelectedImage(GALLERY[n]); }}
              style={{ position: "absolute", left: 32, background: "none", border: "none", color: C.inkMuted, fontSize: 28, cursor: "none", padding: 16, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.orange)}
              onMouseLeave={e => (e.currentTarget.style.color = C.inkMuted)}>←</button>

            <motion.img key={selectedImage} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.4, ease: EASE }}
              src={selectedImage} onClick={e => e.stopPropagation()}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", boxShadow: C.isLight ? "0 20px 80px rgba(0,0,0,0.15)" : "0 40px 120px rgba(0,0,0,0.8)", cursor: "none" }}
              alt="Volledige weergave" />

            <button onClick={e => { e.stopPropagation(); const n = (lightboxIndex + 1) % GALLERY.length; setLightboxIndex(n); setSelectedImage(GALLERY[n]); }}
              style={{ position: "absolute", right: 32, background: "none", border: "none", color: C.inkMuted, fontSize: 28, cursor: "none", padding: 16, transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.orange)}
              onMouseLeave={e => (e.currentTarget.style.color = C.inkMuted)}>→</button>

            <div style={{ position: "absolute", top: 28, right: 32, display: "flex", alignItems: "center", gap: 24 }}>
              <span style={{ fontSize: 9, letterSpacing: "0.22em", color: C.inkMuted, textTransform: "uppercase", transition: "color 0.45s ease" }}>
                {String(lightboxIndex + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}
              </span>
              <button onClick={() => setSelectedImage(null)}
                style={{ background: "none", border: `1px solid ${C.orange}40`, color: C.inkMuted, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", padding: "8px 16px", cursor: "none", transition: "all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.orange; e.currentTarget.style.color = C.orange; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${C.orange}40`; e.currentTarget.style.color = C.inkMuted; }}>
                Sluiten [ESC]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}