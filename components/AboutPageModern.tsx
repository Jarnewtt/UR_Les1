"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function AboutPageModern() {
  const [isLoaded, setIsLoaded] = useState(false)

  const profileDetails = [
    { label: "Leeftijd", value: "23 Jaar" },
    { label: "Locatie", value: "Antwerpen (BE)" },
    { label: "Rol", value: "Junior Designer" },
    { label: "Focus", value: "Visual Identity" }
  ]

  const marqueeItems = [
    "Photography", "Branding", "Visual Identity", "Art Direction",
    "UI/UX Design", "Packaging", "Motion Graphics", "Digital Design"
  ]

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] overflow-x-hidden flex flex-col">

      {/* NOISE & GLOW EFFECTS */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full animate-pulse-slow" />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 py-16 flex-grow flex items-center">
        <div className="max-w-6xl w-full">

          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">

            {/* AFBEELDING */}
            <div className={`lg:col-span-5 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="relative border border-zinc-800 p-2 bg-zinc-900/20 backdrop-blur-sm">
                <img
                  src="/img/portfolio_about.png"
                  alt="Jarne Waterschoot"
                  className="w-full aspect-[3/4] object-cover block"
                />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-600 z-20" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-600 z-20" />
              </div>
            </div>

            {/* BIO CONTENT */}
            <div className={`lg:col-span-7 space-y-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
              <div className="space-y-6">
                <h3 className="text-red-600 font-mono text-sm uppercase tracking-[0.3em] italic flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-red-600 inline-block" />
                  Bio / Introductie
                </h3>

                <div className="space-y-2">
                  <h2 className="text-white text-4xl md:text-5xl lg:text-6xl font-black uppercase italic tracking-tighter leading-none">
                    Jarne Waterschoot
                  </h2>
                  <h2 className="text-transparent stroke-text text-2xl md:text-3xl lg:text-4xl font-black uppercase italic tracking-tighter leading-none">
                    junior grafische designer
                  </h2>
                </div>

                <p className="text-zinc-500 text-lg leading-relaxed max-w-xl font-light mt-4 mb-6">
                  Ik ben een 23-jarige designer,{" "}
                  <span className="text-zinc-300 italic underline decoration-red-900 underline-offset-4">
                    gevestigd in Antwerpen
                  </span>
                  , met een passie voor het creëren van tastbare visuele verhalen. Door strategie en esthetiek te combineren, bouw ik aan moderne en schaalbare oplossingen.
                </p>

                <div className="pt-2">
                  <Link href="/contact" className="inline-flex items-center gap-6 group">
                    <div className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-500">
                      <span className="text-white text-xl group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                    <span className="text-white uppercase tracking-[0.2em] font-black text-xs">Let's work together</span>
                  </Link>
                </div>
              </div>

              {/* QUICK INFO GRID */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-6 pt-8 border-t border-zinc-900/50">
                {profileDetails.map((detail, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-red-600 font-mono text-[10px] uppercase tracking-widest">{detail.label}</p>
                    <p className="text-white text-lg font-bold uppercase italic tracking-tighter">{detail.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* INFINITE SCROLL */}
      <div className="relative z-10 w-full py-6 overflow-hidden border-t border-zinc-900 bg-black/40 mt-auto">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...marqueeItems, ...marqueeItems].map((item, idx) => (
            <div key={idx} className="flex items-center group">
              <span className="text-zinc-500 group-hover:text-white text-xl md:text-2xl font-medium uppercase tracking-[0.2em] mx-12 transition-colors duration-500">
                {item}
              </span>
              <span className="w-1.5 h-1.5 bg-red-900/40 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
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
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}