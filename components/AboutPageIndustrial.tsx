"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { trackCTAClick } from "@/lib/analytics"

// ── THEME & TOKENS ───────────────────────────────────────────────────────────
type Theme = { bg: string; surface: string; ink: string; inkSub: string; blue: string; border: string; isLight: boolean }
const DARK: Theme  = { bg:"#080807", surface:"#111110", ink:"#F0EDE8", inkSub:"#C8C4BE", blue:"#1A1AFF", border:"#262420", isLight:false }
const LIGHT: Theme = { bg:"#FAFAF8", surface:"#F0EDE8", ink:"#0A0908",  inkSub:"#3A3530", blue:"#1A1AFF", border:"#DDD8D0", isLight:true  }

const E = [0.16, 1, 0.3, 1] as const;

// ── DATA ─────────────────────────────────────────────────────────────────────
type Milestone = { year: string; title: string; desc: string }
const MILESTONES: Milestone[] = [
  { year: "2023", title: "The Spark", desc: "Start van mijn passie voor grafisch ontwerp en branding bij de opleiding grafische en digitale media bij de AP Hogeschool in Antwerpen." },
  { year: "2025", title: "Shift", desc: "Focus op verschillende designtechnieken en hoe analoge esthetiek vertaald wordt naar digitale schermen." },
  { year: "2026", title: "New Era", desc: "Als grafisch designer wil ik mij blijven ontwikkelen door te leren, experimenteren en mijn creatieve grenzen te verleggen. Ik streef ernaar mijn vaardigheden te verdiepen." },
]

// ── HOOK: THEME ───────────────────────────────────────────────────────────────
function useTheme(): Theme {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("theme-dark"))
    const handler = (e: Event) => {
      setIsDark((e as CustomEvent).detail.isDark)
    }
    window.addEventListener("theme-change", handler)
    return () => window.removeEventListener("theme-change", handler)
  }, [])
  return isDark ? DARK : LIGHT
}

// ── COMPONENT: SCROLLING TEXT REVEAL ─────────────────────────────────────────
function RevealText({ text, C }: { text: string; C: Theme }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end center"] })
  const opacity = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.p
      ref={ref}
      style={{ opacity, color: C.inkSub, fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px,1.4vw,20px)", fontWeight: 300, lineHeight: 1.8 }}
      className="max-w-2xl"
    >
      {text}
    </motion.p>
  )
}

export default function AboutPageIndustrial() {
  const C = useTheme()
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })

  const portraitY     = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const portraitScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])


  return (
    <div ref={containerRef} style={{ background: C.bg, color: C.ink }} className="min-h-screen selection:bg-[#1A1AFF] selection:text-white">

      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex flex-col justify-end px-6 md:px-16 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0 overflow-hidden">
          <motion.div style={{ y: portraitY, scale: portraitScale }} className="h-full w-full">
            <img
              src="/img/portfolio_about.png"
              alt="Jarne Waterschoot"
              className="w-full h-full object-cover grayscale contrast-125 brightness-75"
            />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${C.bg}, transparent)` }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${C.bg}, transparent 40%)` }} />
          </motion.div>
        </div>

        <div className="relative z-10">
          <motion.span
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
            className="block mb-4 uppercase" style={{ color: C.blue, fontFamily: "Inter, sans-serif", fontSize: 14, letterSpacing: "0.32em" }}>
            Creatief DNA
          </motion.span>
          <h1 className="leading-[0.85] mix-blend-difference" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(52px,10vw,120px)", textTransform: "uppercase" }}>
            De Ontwerper <br />
            <span style={{ color: C.blue }}>Achter het werk</span>
          </h1>
        </div>
      </section>

      {/* 2. THE PHILOSOPHY */}
      <section className="py-32 px-6 md:px-16 border-t" style={{ borderColor: C.border }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h3
              className="sticky top-32"
              style={{ color: C.blue, fontFamily: "'DM Mono', monospace", fontSize: 14, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 600 }}
            >
              Filosofie
            </h3>
          </div>
          <div className="md:col-span-8 space-y-12">
            <RevealText C={C} text="Autisme wordt vaak als een beperking gezien, maar voor mij is het mijn grootste troef als grafisch ontwerper." />
            <RevealText C={C} text="Details en verbanden die anderen missen, springen meteen in het oog. Out-of-the-box denken voelt natuurlijk aan en de noden van de eindgebruiker staan altijd centraal, want goed design is nooit louter decoratief, maar altijd doelgericht en doordacht." />
            <RevealText C={C} text="Wat ik nog niet weet, leer ik met volle overgave, want stilstaan is simpelweg geen optie voor iemand als mij die elke dag wil groeien en het verschil wil maken." />
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE TIMELINE */}
      <section className="py-32" style={{ background: C.isLight ? "#F0EDE8" : "#0C0C0B" }}>
        <div className="px-6 md:px-16 mb-20">
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px,7vw,72px)", textTransform: "uppercase", fontWeight: 400, lineHeight: 1 }}>Het Traject</h2>
        </div>

        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[1px]" style={{ background: C.border }} />
          <div className="space-y-32">
            {MILESTONES.map((m, i) => (
              <TimelineItem key={i} milestone={m} index={i} C={C} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. SKILLS / TOOLS */}
      <section className="py-32 px-6 md:px-16 overflow-hidden" style={{ borderTop: `1px solid ${C.border}` }}>
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 md:mb-24 gap-4 md:gap-8 items-start text-left">
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(40px,7vw,72px)", textTransform: "uppercase", fontWeight: 400, lineHeight: 1 }}>
            Mijn <span style={{ color: C.blue }}>Toolbox</span>
          </h2>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px,1.4vw,20px)", fontWeight: 300, lineHeight: 1.8, opacity: 0.6, maxWidth: "30ch" }}>
            Een mix van analoge technieken en high-end digitale tools om concepten tot leven te wekken.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3" style={{ borderTop: `1px solid ${C.border}` }}>
          {[
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
              ),
              title: "Graphic & Motion",
              tools: ["Illustrator", "Photoshop", "Indesign", "After Effects", "Premiere Pro", "Davinci Resolve", "TouchDesigner"],
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
                  <rect x="2" y="3" width="20" height="14" rx="1"/><path d="M8 21h8"/><path d="M12 17v4"/>
                </svg>
              ),
              title: "Digital & Code",
              tools: ["Figma", "Next.js", "Tailwind CSS", "TypeScript", "D3.js", "Framer Motion", "VS Code"],
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter">
                  <rect x="4" y="4" width="16" height="16" rx="1"/><rect x="9" y="9" width="6" height="6"/>
                  <path d="M9 2v2"/><path d="M15 2v2"/><path d="M9 20v2"/><path d="M15 20v2"/>
                  <path d="M2 9h2"/><path d="M2 15h2"/><path d="M20 9h2"/><path d="M20 15h2"/>
                </svg>
              ),
              title: "Studio & Productie",
              tools: ["3D Mockups", "Packaging Design", "Brand Books", "Brand Identity"],
            },
          ].map((cat, ci) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: ci * 0.1, ease: E }}
              style={{
                padding: "clamp(28px,4vw,48px) clamp(20px,3vw,40px)",
                borderRight: ci < 2 ? `1px solid ${C.border}` : "none",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {/* Category header */}
              <div style={{
                display: "flex", alignItems: "center", gap: 14,
                color: C.blue, marginBottom: 32,
              }}>
                {cat.icon}
                <span style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 14, fontWeight: 600,
                  letterSpacing: "0.28em", textTransform: "uppercase",
                }}>
                  {cat.title}
                </span>
              </div>

              {/* Tool list */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
                {cat.tools.map((tool, ti) => (
                  <motion.li
                    key={tool}
                    initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.35, delay: ci * 0.1 + ti * 0.04, ease: E }}
                    className="tool-item"
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <span className="tool-dot" style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: C.blue, opacity: 0.35, flexShrink: 0,
                      transition: "opacity 0.22s, transform 0.22s",
                    }} />
                    <span style={{
                      fontFamily: "DM Mono, monospace",
                      fontSize: 14, letterSpacing: "0.18em",
                      textTransform: "uppercase", color: C.inkSub,
                      transition: "color 0.22s",
                    }}>
                      {tool}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section
        id="contact-section"
        style={{
          background: "#1A1AFF",
          padding: "clamp(80px,12vw,160px) clamp(24px,6vw,96px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          gap: "clamp(28px,3.5vw,44px)",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: E }}
          style={{
            fontFamily: "'Anton', Impact, sans-serif",
            fontSize: "clamp(52px,9vw,120px)",
            textTransform: "uppercase",
            lineHeight: 0.9,
            letterSpacing: "0.01em",
            color: "#fff",
            margin: 0,
          }}
        >
          Gezien worden.<br />Niet vergeten worden.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 300,
            fontSize: "clamp(16px,1.4vw,20px)",
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.65)",
            maxWidth: "42ch",
            margin: 0,
          }}
        >
          Klaar om samen iets te maken dat blijft hangen?
        </motion.p>

        <motion.a
          href="/contact"
          onClick={() => trackCTAClick('Project Starten', '/about')}
          whileHover={{ scale: 1.02 }}
          className="about-cta"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "#fff",
            color: "#1A1AFF",
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            padding: "16px 40px",
            borderRadius: 4,
            textDecoration: "none",
          }}
        >
          Project Starten <span style={{ fontSize: 14 }}>→</span>
        </motion.a>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;700&display=swap');
        .tool-item:hover span:last-child { color: #1A1AFF !important; }
        .tool-item:hover .tool-dot { opacity: 1 !important; transform: scale(1.5); }
        @keyframes about-cta-glow {
          0%, 100% { box-shadow: 0 0 0px rgba(255,255,255,0), 0 0 0px rgba(255,255,255,0); }
          50%       { box-shadow: 0 0 28px rgba(255,255,255,0.55), 0 0 56px rgba(255,255,255,0.2); }
        }
        .about-cta { animation: about-cta-glow 2.8s ease-in-out infinite; }
        .about-cta:hover { animation-play-state: paused; opacity: 0.9; }
      `}</style>
    </div>
  )
}

function TimelineItem({ milestone, index, C }: { milestone: Milestone; index: number; C: Theme }) {
  const isEven = index % 2 === 0
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref} className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? 'md:flex-row-reverse' : ''}`}>
      <div className="absolute left-[24px] md:left-1/2 w-3 h-3 -translate-x-1/2 rounded-full z-10"
           style={{ background: isInView ? C.blue : C.border, transition: "0.6s all ease" }} />

      <div className="w-full md:w-1/2 px-12 md:px-24">
        <motion.div
          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: E }}
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "clamp(28px,4vw,48px)", fontWeight: 700, display: "block", marginBottom: 8, color: C.blue }}>{milestone.year}</span>
          <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(20px,2.5vw,28px)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16, fontWeight: 400 }}>{milestone.title}</h4>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(16px,1.4vw,20px)", fontWeight: 300, lineHeight: 1.8, opacity: 0.7, maxWidth: "40ch" }}>{milestone.desc}</p>
        </motion.div>
      </div>
      <div className="hidden md:block md:w-1/2" />
    </div>
  )
}




