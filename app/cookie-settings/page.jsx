"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function CookieSettings() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHoveringLink, setIsHoveringLink] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const sectionStyle = "group relative p-6 border border-zinc-800/50 bg-zinc-900/40 backdrop-blur-md transition-all duration-500 hover:border-red-800/40"

  const cookieCategories = [
    {
      title: "Essential Cookies",
      text: "Deze cookies zijn noodzakelijk voor de werking van de website en kunnen niet worden uitgeschakeld. Ze zorgen voor basisfunctionaliteiten zoals beveiliging en navigatie."
    },
    {
      title: "Performance & Analytics",
      text: "Deze helpen ons te begrijpen hoe bezoekers met de site omgaan, zodat we de prestaties en de gebruikerservaring continu kunnen verbeteren."
    },
    {
      title: "Functional Cookies",
      text: "Deze cookies maken extra functies en personalisatie mogelijk, zoals het onthouden van je voorkeuren of taalinstellingen."
    },
    {
      title: "Advertising & Targeting",
      text: "Gebruikt om relevante advertenties te tonen op basis van jouw interesses en browsegedrag. Ze beperken ook hoe vaak je een advertentie ziet."
    }
  ]

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] overflow-x-hidden flex flex-col cursor-none text-zinc-300">
      
      {/* CUSTOM CURSOR */}
      <div 
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 pointer-events-none z-[100] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${isHoveringLink ? 'scale-[2.5] bg-white/10' : 'scale-100'}`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />
      <div 
        className={`fixed top-0 left-0 w-2 h-2 bg-red-600 rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHoveringLink ? 'opacity-0' : 'opacity-100'}`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />

      {/* NOISE & GLOW EFFECTS */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full animate-pulse-slow"></div>

      <main className="relative z-10 w-full max-w-4xl mx-auto px-8 md:px-12 py-20 flex-grow">
        
        {/* HEADER SECTION */}
        <div className="space-y-6 mb-16">
          <p className={`text-red-700 font-mono tracking-[0.3em] uppercase text-sm transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
            Preferences — Privacy
          </p>
          
          <div className={`flex items-stretch gap-6 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="w-2 bg-red-800 animate-pulse shadow-[0_0_20px_rgba(153,27,27,0.4)]"></div>
            <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tighter italic uppercase">
              Cookie<br />
              <span className="text-transparent stroke-text">Settings</span>
            </h1>
          </div>
        </div>

        {/* CONTENT */}
        <div className={`space-y-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-zinc-400 text-lg leading-relaxed font-light max-w-2xl border-l-2 border-red-900/30 pl-6">
            Wij gebruiken cookies om je ervaring te verbeteren, verkeer te analyseren en content te personaliseren. 
            Beheer hieronder jouw <span className="text-white font-medium">digitale voetafdruk</span>.
          </p>

          <div className="grid gap-6">
            {cookieCategories.map((item, i) => (
              <div key={i} className={sectionStyle}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                    <span className="text-red-600 font-mono">ID:0{i + 1}</span> {item.title}
                  </h2>
                </div>
                <p className="text-zinc-400 font-light leading-relaxed group-hover:text-zinc-300 transition-colors">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button 
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
              className="px-6 py-4 bg-white text-black font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Accept All
            </button>
            <button 
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
              className="px-6 py-4 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-[10px] md:text-xs hover:border-red-800 hover:text-white transition-all duration-300"
            >
              Reject Non-Essential
            </button>
            <button 
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
              className="px-6 py-4 border border-red-900/50 text-red-600 font-bold uppercase tracking-widest text-[10px] md:text-xs hover:bg-red-600/10 transition-all duration-300"
            >
              Customize
            </button>
          </div>
          
          <div className="text-center pt-8">
             <Link 
              href="/"
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
              className="text-zinc-600 hover:text-white text-xs uppercase tracking-[0.3em] transition-colors duration-300"
            >
              [ Back to Home ]
            </Link>
          </div>
        </div>
      </main>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.15; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        :global(body) {
          cursor: none;
          background-color: #0a0a0a;
        }
      `}</style>
    </div>
  )
}
