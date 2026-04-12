"use client"

import { useState, useEffect } from "react"
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

export default function AboutPageModern() {
  const T = useModernTheme()
  const [isLoaded, setIsLoaded] = useState(false)

  const profileDetails = [
    { label: "Leeftijd", value: "23 Jaar" },
    { label: "Locatie", value: "Antwerpen (BE)" },
    { label: "Rol", value: "Junior Designer" },
    { label: "Focus", value: "Visuele Identiteit" }
  ]

  const marqueeItems = [
    "Fotografie", "Branding", "Visuele Identiteit", "Art Direction",
    "UI/UX Design", "Verpakking", "Motion Graphics", "Digitaal Design"
  ]

  useEffect(() => { setIsLoaded(true) }, [])

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col"
      style={{ background: T.bg, color: T.ink, transition: "background 0.4s, color 0.4s" }}>

      {/* NOISE */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      {/* GLOW */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] blur-[120px] rounded-full animate-pulse-slow"
        style={{ background: `${T.red}1A` }} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 py-16 flex-grow flex items-center">
        <div className="max-w-6xl w-full">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* AFBEELDING */}
            <div className={`lg:col-span-5 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="relative p-2" style={{ border: `1px solid ${T.border}`, background: `${T.surface}33` }}>
                <img
                  src="/img/portfolio_about.png"
                  alt="Jarne Waterschoot"
                  className="w-full aspect-[3/4] object-cover block"
                />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 z-20" style={{ borderColor: T.red }} />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 z-20" style={{ borderColor: T.red }} />
              </div>
            </div>

            {/* BIO CONTENT */}
            <div className={`lg:col-span-7 space-y-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="space-y-6">
                <h3 className="font-mono text-sm uppercase tracking-[0.3em] italic flex items-center gap-4"
                  style={{ color: T.red }}>
                  <span className="w-8 h-[1px] inline-block" style={{ background: T.red }} />
                  Bio / Introductie
                </h3>

                <div className="space-y-2">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none"
                    style={{ color: T.ink }}>
                    Jarne Waterschoot
                  </h2>
                  <h2 className="stroke-text text-2xl md:text-3xl lg:text-4xl font-black uppercase italic tracking-tighter leading-none"
                    style={{ color: "transparent" }}>
                    junior grafische designer
                  </h2>
                </div>

                <p className="text-lg leading-relaxed max-w-xl font-light mt-4 mb-6"
                  style={{ color: T.inkMuted }}>
                  Ik ben een 23-jarige designer,{" "}
                  <span className="italic underline underline-offset-4"
                    style={{ color: T.inkSub, textDecorationColor: `${T.red}60` }}>
                    gevestigd in Antwerpen
                  </span>
                  , met een passie voor het creëren van tastbare visuele verhalen. Door strategie en esthetiek te combineren, bouw ik aan moderne en schaalbare oplossingen.
                </p>

                <div className="pt-2">
                  <Link href="/contact" className="inline-flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500"
                      style={{ border: `1px solid ${T.border}` }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = T.red
                        ;(e.currentTarget as HTMLElement).style.borderColor = T.red
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = "transparent"
                        ;(e.currentTarget as HTMLElement).style.borderColor = T.border
                      }}
                    >
                      <span className="text-xl group-hover:translate-x-1 transition-transform" style={{ color: T.ink }}>→</span>
                    </div>
                    <span className="uppercase tracking-[0.2em] font-black text-xs" style={{ color: T.ink }}>
                      Laten we samenwerken
                    </span>
                  </Link>
                </div>
              </div>

              {/* QUICK INFO GRID */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-6 pt-8"
                style={{ borderTop: `1px solid ${T.borderSub}` }}>
                {profileDetails.map((detail, index) => (
                  <div key={index} className="space-y-1">
                    <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: T.red }}>{detail.label}</p>
                    <p className="text-lg font-bold uppercase italic tracking-tighter" style={{ color: T.ink }}>{detail.value}</p>
                  </div>
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
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1);    opacity: 0.1;  }
          50%       { transform: scale(1.05); opacity: 0.15; }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
