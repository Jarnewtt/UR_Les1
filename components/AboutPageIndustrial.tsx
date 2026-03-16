"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"

// ── THEME & TOKENS ───────────────────────────────────────────────────────────
type Theme = { bg: string; surface: string; ink: string; inkSub: string; orange: string; border: string; isLight: boolean }
const DARK: Theme  = { bg:"#080807", surface:"#111110", ink:"#F0EDE8", inkSub:"#C8C4BE", orange:"#FF5C1A", border:"#262420", isLight:false }
const LIGHT: Theme = { bg:"#FAFAF8", surface:"#F0EDE8", ink:"#0A0908",  inkSub:"#3A3530", orange:"#E84000", border:"#DDD8D0", isLight:true  }

const E = [0.16, 1, 0.3, 1] as const;

// ── DATA ─────────────────────────────────────────────────────────────────────
type Milestone = { year: string; title: string; desc: string }
const MILESTONES: Milestone[] = [
  { year: "2023", title: "The Spark", desc: "Start van mijn passie voor grafisch ontwerp en branding bij de opleiding grafische en digitale media bij de AP Hogeschool in Antwerpen." },
  { year: "2025", title: "Shift", desc: "Focus op verschillende designtechnieken en hoe analoge esthetiek vertaald wordt naar digitale schermen." },
  { year: "2026", title: "New Era", desc: "Als grafisch designer wil ik mij blijven ontwikkelen door te leren, experimenteren en mijn creatieve grenzen te verleggen. Ik streef ernaar mijn vaardigheden te verdiepen en mijn eigen stijl verder te verfijnen." },
]

// ── HOOK: THEME — FIX: custom event i.p.v. MutationObserver ─────────────────
function useTheme(): Theme {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    // Lees initiële staat
    setIsDark(document.documentElement.classList.contains("theme-dark"))
    // Luister naar synchrone theme-change events van de navbar
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
      style={{ opacity, color: C.inkSub, fontFamily: "'DM Sans', sans-serif" }}
      className="text-lg md:text-xl font-light leading-relaxed max-w-2xl"
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
    // FIX: transition op background verwijderd
    <div ref={containerRef} style={{ background: C.bg, color: C.ink }} className="min-h-screen selection:bg-[#FF5C1A] selection:text-white">

      {/* 1. HERO SECTION */}
      <section className="relative h-[90vh] flex flex-col justify-end px-6 md:px-16 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full z-0 overflow-hidden">
          <motion.div style={{ y: portraitY, scale: portraitScale }} className="h-full w-full">
            <img
              src="/img/portfolio_about.png"
              alt="Jarne Waterschoot"
              className="w-full h-full object-cover grayscale contrast-125 brightness-75 transition-all duration-700 hover:grayscale-0"
            />
            {/* FIX: gradient gebruikt C.bg direct i.p.v. CSS variabele */}
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${C.bg}, transparent)` }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${C.bg}, transparent 40%)` }} />
          </motion.div>
        </div>

        <div className="relative z-10">
          <motion.span
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
            className="block mb-4 text-xs tracking-[0.4em] uppercase" style={{ color: C.orange }}>
            Creatief DNA
          </motion.span>
          <h1 className="text-[15vw] md:text-[10vw] leading-[0.85] font-bebas uppercase mix-blend-difference" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            The Designer <br />
            <span style={{ WebkitTextStroke: `1px ${C.inkSub}`, color: "transparent" }}>Behind the work</span>
          </h1>
        </div>
      </section>

      {/* 2. THE PHILOSOPHY */}
      <section className="py-32 px-6 md:px-16 border-t" style={{ borderColor: C.border }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <h3
              className="sticky top-32 text-sm tracking-[0.4em] uppercase font-bold font-mono"
              style={{ color: C.orange }}
            >
              Filosofie
            </h3>
          </div>
          <div className="md:col-span-8 space-y-12">
            <RevealText C={C} text="Ik geloof dat design niet alleen gaat over hoe het eruit ziet, maar over hoe het communiceert in een wereld vol ruis." />
            <RevealText C={C} text="Mijn werk bevindt zich op het snijvlak van brute eenvoud en doordachte strategie. Geen decoratie, maar noodzaak." />
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE TIMELINE */}
      {/* FIX: background gebruikt C.bg/surface direct i.p.v. hardcoded hex */}
      <section className="py-32" style={{ background: C.isLight ? "#F0EDE8" : "#0C0C0B" }}>
        <div className="px-6 md:px-16 mb-20">
          <h2 className="text-5xl md:text-7xl font-bebas uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Het Traject</h2>
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
      <section className="py-32 px-6 md:px-16 overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 md:mb-20 gap-4 md:gap-8 items-center md:items-end text-center md:text-left">
          <h2 className="text-[15vw] sm:text-5xl md:text-7xl font-bebas uppercase leading-none" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
            Mijn <span style={{ color: C.orange }}>Toolbox</span>
          </h2>
          <p className="max-w-xs text-xs md:text-sm opacity-60 font-mono leading-relaxed mx-auto md:mx-0">
            Een mix van analoge technieken en high-end digitale tools om concepten tot leven te wekken.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px]" style={{ background: C.border }}>
          {["Adobe Illustrator", "Adobe Photoshop", "Adobe Indesign", "Adobe Premiere Pro", "After Effects", "Davinci Resolve", "Figma", "Visual Studio Code"].map((tool) => (
            <motion.div
              key={tool}
              whileHover={{ backgroundColor: C.orange, color: "#fff" }}
              style={{ background: C.bg }}
              className="p-6 md:p-10 text-center font-mono text-xs uppercase tracking-widest transition-colors cursor-default flex items-center justify-center"
            >
              {tool}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. CTA SECTION */}
      <section className="h-[60vh] flex flex-col items-center justify-center text-center border-t px-6" style={{ borderColor: C.border }}>
        <h2 className="text-4xl md:text-6xl mb-12 font-bebas uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>Iets groots bouwen?</h2>
        <motion.a
          href="mailto:jarnewaterschoot@hotmail.com"
          whileHover={{ scale: 1.05, rotate: -1 }}
          className="px-12 py-6 text-sm tracking-[.3em] uppercase font-bold"
          style={{ background: C.orange, color: "#fff" }}
        >
          Start Project
        </motion.a>
      </section>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;700&display=swap');
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
           style={{ background: isInView ? C.orange : C.border, transition: "0.6s all ease" }} />

      <div className="w-full md:w-1/2 px-12 md:px-24">
        <motion.div
          initial={{ opacity: 0, x: isEven ? 50 : -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: E }}
        >
          <span className="font-mono text-4xl font-bold block mb-2" style={{ color: C.orange }}>{milestone.year}</span>
          <h4 className="text-2xl font-bebas uppercase tracking-wider mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{milestone.title}</h4>
          <p className="text-sm leading-relaxed opacity-70 max-w-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{milestone.desc}</p>
        </motion.div>
      </div>
      <div className="hidden md:block md:w-1/2" />
    </div>
  )
}