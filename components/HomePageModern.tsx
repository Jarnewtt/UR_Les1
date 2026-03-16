"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"

export default function HomePageModern() {
  const lastName = "Waterschoot"
  const [typedText, setTypedText] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [hoveredImage, setHoveredImage] = useState<string | null>(null)

  const projectCategories = [
    {
      name: "Photography",
      href: "/Architectuur",
      image: "/img/Bewerkt_Mons.jpg"
    },
    {
      name: "Campaign/Branding",
      href: "/CineCity",
      image: "/img/Mockup_desktop.png"
    },
    {
      name: "Packaging/Branding",
      href: "/Chocolate",
      image: "https://images.unsplash.com/photo-1614088685112-0a760b71a3c8?q=80&w=1974&auto=format&fit=crop"
    },
  ]

  const marqueeItems = [
    "Photography", "Branding", "Visual Identity", "Art Direction",
    "UI/UX Design", "Packaging", "Motion Graphics", "Digital Design"
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
    <div className="relative min-h-screen w-full bg-[#0a0a0a] overflow-x-hidden flex flex-col">

      {/* DYNAMIC BACKGROUND */}
      <div
        className={`absolute inset-0 z-0 bg-cover bg-center transition-all duration-1000 ease-in-out ${hoveredImage ? 'opacity-20 scale-105' : 'opacity-0 scale-100'}`}
        style={{ backgroundImage: hoveredImage ? `url(${hoveredImage})` : 'none' }}
      />

      {/* NOISE & GLOW */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full animate-pulse-slow" />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 py-12 mt-12 flex-grow">
        <div className="max-w-6xl space-y-20">

          {/* HEADING */}
          <div className="space-y-6">
            <p className={`text-red-700 font-mono tracking-[0.3em] uppercase text-sm pl-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              Portfolio 2025 — Portfolio 2026
            </p>

            <div className={`flex items-stretch gap-6 md:gap-8 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <div className="w-2 md:w-3 bg-red-800 animate-pulse shadow-[0_0_20px_rgba(153,27,27,0.4)]" />
              <h1 className="text-white text-6xl md:text-8xl lg:text-[9rem] font-black leading-[0.85] tracking-tighter italic uppercase py-2 drop-shadow-2xl">
                JARNE<br />
                <span className="text-transparent stroke-text relative">
                  {typedText}
                  <span className="absolute -right-6 bottom-0 text-red-600 animate-blink">_</span>
                </span>
              </h1>
            </div>
          </div>

          {/* CONTENT GRID */}
          <div className={`grid lg:grid-cols-12 gap-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

            {/* LEFT: tekst */}
            <div className="lg:col-span-7 space-y-8 backdrop-blur-sm bg-black/10 p-6 rounded-2xl md:p-0 md:bg-transparent">
              <p className="text-zinc-400 text-lg md:text-xl leading-relaxed font-light max-w-2xl">
                Gespecialiseerd in het creëren van{" "}
                <span className="text-white font-medium">tastbare visuele verhalen</span>.
                Een samenspel van strategie en esthetiek voor merken die durven opvallen.
              </p>

              <div className="border-l-2 border-red-900/50 pl-6 py-2">
                <h3 className="text-red-600 font-mono text-[10px] uppercase tracking-[0.2em] mb-2 italic">
                  Specialiteiten
                </h3>
                <ul className="flex flex-wrap gap-4 text-sm font-medium text-zinc-300 uppercase tracking-wide select-none">
                  {["Branding", "Packaging", "Digital Design", "Photography"].map((s, i, arr) => (
                    <React.Fragment key={s}>
                      <li className="hover:text-white transition-colors">{s}</li>
                      {i < arr.length - 1 && <li className="text-zinc-600">•</li>}
                    </React.Fragment>
                  ))}
                </ul>
              </div>
            </div>

            {/* RIGHT: project links */}
            <div className="lg:col-span-5 flex flex-col justify-end space-y-6">
              <p className="text-white font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
                <span className="w-8 h-[1px] bg-red-600 inline-block" />
                Selecteer een Project
              </p>

              <div className="grid gap-4" onMouseLeave={() => setHoveredImage(null)}>
                {projectCategories.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onMouseEnter={() => setHoveredImage(item.image)}
                    onMouseLeave={() => setHoveredImage(null)}
                    className="group relative flex items-center justify-between px-6 py-5 border border-zinc-800/50 hover:border-red-800/80 bg-zinc-900/40 hover:bg-black/60 backdrop-blur-md transition-all duration-500 overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-bottom" />
                    <span className="text-zinc-400 group-hover:text-white uppercase tracking-wider font-light text-lg z-10 transition-colors duration-300">
                      {item.name}
                    </span>
                    <span className="text-zinc-700 group-hover:text-red-500 transform group-hover:translate-x-3 transition-all duration-300 z-10 text-xl">
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
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .animate-blink {
          animation: blink 1s step-end infinite;
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