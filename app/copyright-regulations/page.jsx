"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function CopyrightRegulations() {
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

  const regulations = [
    { 
      title: "General Policy", 
      text: "Alle inhoud op deze website, inclusief tekst, afbeeldingen, video's en software, is beschermd door auteursrechtwetgeving. Ongeautoriseerd gebruik is strikt verboden." 
    },
    { 
      title: "Fair Use & Permissions", 
      text: "Bepaalde vormen van gebruik kunnen onder 'fair use' vallen (zoals kritiek of educatie). Voor elk ander gebruik is schriftelijke toestemming van de eigenaar vereist." 
    },
    { 
      title: "Reporting Infringement", 
      text: "Geloof je dat jouw werk in strijd met de auteurswet wordt gebruikt? Neem onmiddellijk contact op met een gedetailleerd verslag voor onderzoek." 
    },
    { 
      title: "User Responsibilities", 
      text: "Gebruikers mogen geen inhoud uploaden of delen die inbreuk maakt op auteursrechten. Respect voor intellectueel eigendom is een vereiste voor gebruik." 
    },
    { 
      title: "Licensing Info", 
      text: "Sommige content kan beschikbaar zijn onder specifieke licenties. Controleer altijd de licentievoorwaarden voordat je materiaal hergebruikt of distribueert." 
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
            Legal — Intellectual Property
          </p>
          
          <div className={`flex items-stretch gap-6 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="w-2 bg-red-800 animate-pulse shadow-[0_0_20px_rgba(153,27,27,0.4)]"></div>
            <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tighter italic uppercase">
              Copyright<br />
              <span className="text-transparent stroke-text">Regulations</span>
            </h1>
          </div>
        </div>

        {/* CONTENT */}
        <div className={`space-y-8 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-zinc-400 text-lg leading-relaxed font-light max-w-2xl border-l-2 border-red-900/30 pl-6">
            Wij respecteren intellectuele eigendomsrechten en verwachten dat onze gebruikers hetzelfde doen. 
            Hieronder volgen onze richtlijnen voor het gebruik van materiaal.
          </p>

          <div className="grid gap-6">
            {regulations.map((item, i) => (
              <div key={i} className={sectionStyle}>
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-600 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300"></div>
                <h2 className="text-white font-bold uppercase tracking-widest text-sm mb-3 flex items-center gap-2">
                  <span className="text-red-600 font-mono">Art. 0{i + 1}</span> {item.title}
                </h2>
                <p className="text-zinc-400 font-light leading-relaxed group-hover:text-zinc-300 transition-colors">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* ACTIONS */}
          <div className="pt-12 flex flex-col sm:flex-row gap-6">
            <button 
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
              className="flex-1 px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-red-600 hover:text-white transition-all duration-300"
            >
              Acknowledge
            </button>
            <Link 
              href="/"
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
              className="flex-1 px-8 py-4 border border-zinc-800 text-zinc-400 font-bold uppercase tracking-widest text-sm text-center hover:border-red-800 hover:text-white transition-all duration-300"
            >
              Back to Home
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
