"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
type Theme = {
  bg: string; surface: string; ink: string; inkSub: string; inkMuted: string
  red: string; border: string; borderSub: string; isLight: boolean
}
const DARK: Theme  = { bg:"#0C0C12", surface:"#14141E", ink:"#F2F0EC", inkSub:"#B8B6C4", inkMuted:"#787688", red:"#E8280A", border:"#22222E", borderSub:"#1C1C28", isLight:false }
const LIGHT: Theme = { bg:"#F5F4F8", surface:"#EEEDF2", ink:"#0D0C14", inkSub:"#2A2830", inkMuted:"#56546A", red:"#CC1F00", border:"#D0CED8", borderSub:"#E2E0E8", isLight:true  }

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

export default function HomePageModern() {
  const T = useModernTheme()
  const lastName = "Waterschoot"
  const [typedText, setTypedText] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)

  const projectCategories = [
    { name: "Fotografie",          href: "/Architectuur", image: "/img/Bewerkt_Mons.jpg" },
    { name: "Campagne / Branding", href: "/CineCity",     image: "/img/Mockup_desktop.jpg" },
    { name: "Verpakking / Branding", href: "/Chocolate",  image: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?q=80&w=1974&auto=format&fit=crop" },
  ]

  const marqueeItems = [
    "Fotografie", "Branding", "Visuele Identiteit", "Art Direction",
    "UI/UX Design", "Verpakking", "Motion Graphics", "Digitaal Design"
  ]

  useEffect(() => {
    setIsLoaded(true)
    let index = 0
    const interval = setInterval(() => {
      setTypedText(lastName.slice(0, index + 1))
      index++
      if (index === lastName.length) clearInterval(interval)
    }, 150)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col"
      style={{ background: T.bg, color: T.ink, transition: "background 0.4s, color 0.4s" }}>

      {/* DYNAMIC BACKGROUND */}
      <div
        className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${hoveredImage ? 'opacity-15 scale-105' : 'opacity-0 scale-100'}`}
        style={{ backgroundImage: hoveredImage ? `url(${hoveredImage})` : 'none' }}
      />

      {/* NOISE */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      {/* GLOW */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] blur-[120px] rounded-full animate-pulse-slow"
        style={{ background: `${T.red}1A` }} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-12 py-8 md:py-12 mt-6 md:mt-12 flex-grow">
        <div className="max-w-6xl space-y-12 md:space-y-20">

          {/* HEADING */}
          <div className="space-y-6">
            <p className={`font-mono tracking-[0.3em] uppercase text-xs sm:text-sm pl-4 sm:pl-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ color: T.red }}>
              Portfolio 2025 — Portfolio 2026
            </p>

            <div className={`flex items-stretch gap-6 md:gap-8 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="w-2 md:w-3 animate-pulse"
                style={{ background: T.red, boxShadow: `0 0 20px ${T.red}66` }} />
              <h1 className="text-[2.6rem] sm:text-6xl md:text-8xl lg:text-[9rem] font-black leading-[0.85] tracking-tighter italic uppercase py-2 drop-shadow-2xl"
                style={{ color: T.ink }}>
                JARNE<br />
                <span className="stroke-text relative" style={{ color: "transparent" }}>
                  {typedText}
                  <span className="absolute -right-3 sm:-right-6 bottom-0 animate-blink" style={{ color: T.red }}>_</span>
                </span>
              </h1>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div className={`grid lg:grid-cols-12 gap-8 lg:gap-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

            {/* LEFT: tekst */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8 p-0"
              style={{ backdropFilter: "blur(4px)" }}>
              <p className="text-base md:text-xl leading-relaxed font-light max-w-2xl"
                style={{ color: T.inkMuted }}>
                Gespecialiseerd in het creëren van{" "}
                <span className="font-medium" style={{ color: T.ink }}>tastbare visuele verhalen</span>.
                Een samenspel van strategie en esthetiek voor merken die durven opvallen.
              </p>

              <div className="border-l-2 pl-6 py-2" style={{ borderColor: `${T.red}50` }}>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2 italic" style={{ color: T.red }}>
                  Specialiteiten
                </h3>
                <ul className="flex flex-wrap gap-4 text-sm font-medium uppercase tracking-wide select-none"
                  style={{ color: T.inkSub }}>
                  {["Branding", "Verpakking", "Digitaal Design", "Fotografie"].map((s, i, arr) => (
                    <React.Fragment key={s}>
                      <li style={{ transition: "color 0.2s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = T.ink)}
                        onMouseLeave={e => (e.currentTarget.style.color = T.inkSub)}>{s}</li>
                      {i < arr.length - 1 && <li style={{ color: T.border }}>•</li>}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT: project links */}
            <div className="lg:col-span-5 flex flex-col justify-end space-y-4 md:space-y-6">
              <p className="font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2"
                style={{ color: T.ink }}>
                <span className="w-8 h-[1px] inline-block" style={{ background: T.red }} />
                Selecteer een Project
              </p>

              <div className="grid gap-4" onMouseLeave={() => setHoveredImage(null)}>
                {projectCategories.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onMouseEnter={e => {
                      setHoveredImage(item.image);
                      (e.currentTarget as HTMLElement).style.borderColor = `${T.red}88`
                    }}
                    onMouseLeave={e => {
                      setHoveredImage(null);
                      (e.currentTarget as HTMLElement).style.borderColor = T.border
                    }}
                    className="group relative flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5 transition-all duration-500 overflow-hidden"
                    style={{
                      border: `1px solid ${T.border}`,
                      background: T.surface,
                    }}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom"
                      style={{ background: T.red }} />
                    <span className="uppercase tracking-wider font-light text-base sm:text-lg z-10 transition-colors duration-300"
                      style={{ color: T.inkMuted }}
                      onMouseEnter={e => (e.currentTarget.style.color = T.ink)}
                      onMouseLeave={e => (e.currentTarget.style.color = T.inkMuted)}>
                      {item.name}
                    </span>
                    <span className="transform group-hover:translate-x-3 transition-all duration-300 z-10 text-xl"
                      style={{ color: T.border }}>
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MARQUEE */}
      <div className="relative z-10 w-full py-6 overflow-hidden mt-auto"
        style={{ borderTop: `1px solid ${T.borderSub}`, background: T.isLight ? `${T.surface}CC` : "rgba(0,0,0,0.3)" }}>
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center group">
              <span className="text-xl md:text-2xl font-medium uppercase tracking-[0.2em] mx-12 transition-colors duration-500"
                style={{ color: T.inkMuted }}
                onMouseEnter={e => (e.currentTarget.style.color = T.ink)}
                onMouseLeave={e => (e.currentTarget.style.color = T.inkMuted)}>
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: `${T.red}40` }} />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: clamp(0.3px, 0.1vw, 1px) ${T.isLight ? "rgba(13,12,20,0.35)" : "rgba(255,255,255,0.4)"};
        }
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
          display: flex;
          width: fit-content;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .animate-blink { animation: blink 1s step-end infinite; }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1);    opacity: 0.1;  }
          50%       { transform: scale(1.05); opacity: 0.15; }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
