"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"

interface FooterProps {
  accentColor?: string; // Optioneel, standaard rood
}

export default function Footer({ accentColor: customColor }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const pathname = usePathname()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // --- DYNAMISCHE KLEUR LOGICA ---
  let accentColor = customColor || "#b91c1c" 

  if (pathname?.includes("CineCity")) {
    accentColor = "#a855f7" 
  } else if (pathname?.includes("Chocolate")) {
    accentColor = "#f97316" 
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // HIER ZIJN DE LINKS AANGEPAST AAN JOUW BESTANDSCONTRACT
  const footerLinks = [
    { name: "Terms of Agreement", href: "/terms-of-agreement" }, 
    { name: "Copyright Regulations", href: "/copyright-regulations" }, // Was /copyright
    { name: "Cookie Settings", href: "/cookie-settings" },             // Was /cookies
  ]

  return (
    <footer className="relative w-full bg-[#0a0a0a] border-t border-zinc-900 pt-16 pb-8 px-8 md:px-12 overflow-hidden group">
      
      <div 
        className="absolute bottom-0 right-0 w-[300px] h-[300px] blur-[100px] rounded-full pointer-events-none opacity-20 transition-colors duration-700"
        style={{ backgroundColor: accentColor }}
      ></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-1 h-8 transition-colors duration-700"
                style={{ backgroundColor: accentColor, boxShadow: `0 0 15px ${accentColor}66` }}
              ></div>
              <h2 className="text-white text-2xl font-black italic uppercase tracking-tighter">
                Jarne <span className="text-transparent stroke-text-small">Waterschoot</span>
              </h2>
            </div>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.2em] max-w-xs leading-relaxed">
              Gespecialiseerd in visuele identiteit. <br />
              Portfolio 2025 — 2026.
            </p>
          </div>

          <div className="flex flex-col md:items-end justify-end">
            <nav className="flex flex-wrap gap-x-8 gap-y-4 md:justify-end">
              {footerLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-zinc-500 hover:text-white font-mono text-[10px] uppercase tracking-[0.2em] transition-colors duration-300 relative group/link"
                >
                  {link.name}
                  <span 
                    className="absolute -bottom-1 left-0 w-0 h-[1px] transition-all duration-300 group-hover/link:w-full"
                    style={{ backgroundColor: accentColor }}
                  ></span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center border-t border-zinc-900/50 pt-8 gap-4">
          <div className="text-zinc-600 font-mono text-[9px] uppercase tracking-[0.3em]">
            &copy; {currentYear} All Rights Reserved
          </div>
          <div className="flex items-center gap-4 text-zinc-600 font-mono text-[9px] uppercase tracking-[0.3em]">
            <span className="w-12 h-[1px] bg-zinc-800"></span>
            België
          </div>
        </div>
      </div>

      <style jsx>{`
        .stroke-text-small {
          -webkit-text-stroke: 0.5px rgba(255, 255, 255, 0.4);
        }
      `}</style>
    </footer>
  )
}