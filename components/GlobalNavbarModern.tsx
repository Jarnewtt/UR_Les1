"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import * as d3 from "d3"
import StyleToggle from "@/components/StyleToggle"

// ── Zelfde structuur als Industrial, maar rood ipv oranje ──
const C = {
  bg:     "#080808",
  ink:    "#F2F0EC",
  red:    "#E8280A",   // ← rood accent
  greyLt: "#2A2A28",
  mid:    "#888884",
  grey:   "#4A4A48",
} as const

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const NAV_LINKS = [
  { label: "Home",      href: "/home" },
  { label: "About",     href: "/about" },
  { label: "Contact",   href: "/contact" },
  { label: "Login",     href: "/login" },
  { label: "Admin",     href: "/admin" },
  { label: "Adminuser", href: "/adminuser" },
]

const PROJECTS = [
  { name: "Hélène Binet",    href: "/Architectuur" },
  { name: "CineCity",        href: "/CineCity" },
  { name: "C for chocolate", href: "/Chocolate" },
]

/* ── D3 Animated Theme Toggle ── */
function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const W = 52, H = 26, R = 11, PAD = 3
  const SUN_X  = PAD + R
  const MOON_X = W - PAD - R

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    const thumbX = isDark ? MOON_X : SUN_X

    svg.select<SVGRectElement>(".track")
      .transition().duration(380).ease(d3.easeCubicInOut)
      .attr("fill",   isDark ? C.red + "22" : C.ink + "22")
      .attr("stroke", isDark ? C.red : C.ink)

    svg.select<SVGCircleElement>(".thumb")
      .transition().duration(380).ease(d3.easeCubicInOut)
      .attr("cx",   thumbX)
      .attr("fill", isDark ? C.red : C.ink)

    svg.selectAll<SVGLineElement, unknown>(".ray")
      .transition().duration(300).ease(d3.easeCubicInOut)
      .attr("opacity",   isDark ? 0 : 1)
      .attr("transform", `rotate(${isDark ? 30 : 0}, ${SUN_X}, ${H / 2})`)

    svg.select<SVGPathElement>(".moon")
      .transition().duration(300).ease(d3.easeCubicInOut)
      .attr("opacity",   isDark ? 1 : 0)
      .attr("transform", `rotate(${isDark ? 0 : -30}, ${MOON_X}, ${H / 2})`)
  }, [isDark])

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()
    const thumbX = isDark ? MOON_X : SUN_X

    svg.append("rect").attr("class", "track")
      .attr("x", 1).attr("y", 1)
      .attr("width", W - 2).attr("height", H - 2)
      .attr("rx", (H - 2) / 2)
      .attr("fill",         isDark ? C.red + "22" : C.ink + "22")
      .attr("stroke",       isDark ? C.red : C.ink)
      .attr("stroke-width", 1)

    const rayLen = 3.5
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2
      const ri = R + 3, ro = ri + rayLen
      svg.append("line").attr("class", "ray")
        .attr("x1", SUN_X + Math.cos(angle) * ri).attr("y1", H / 2 + Math.sin(angle) * ri)
        .attr("x2", SUN_X + Math.cos(angle) * ro).attr("y2", H / 2 + Math.sin(angle) * ro)
        .attr("stroke", C.ink).attr("stroke-width", 1.2).attr("stroke-linecap", "round")
        .attr("opacity", isDark ? 0 : 1)
    }

    const moonR = R - 2
    svg.append("path").attr("class", "moon")
      .attr("d", `M ${MOON_X} ${H / 2 - moonR} A ${moonR} ${moonR} 0 1 1 ${MOON_X} ${H / 2 + moonR} A ${moonR * 0.55} ${moonR * 0.55} 0 1 0 ${MOON_X} ${H / 2 - moonR} Z`)
      .attr("fill", C.red).attr("opacity", isDark ? 1 : 0)

    svg.append("circle").attr("class", "thumb")
      .attr("cx", thumbX).attr("cy", H / 2).attr("r", R - 1)
      .attr("fill", isDark ? C.red : C.ink)
      .style("filter", isDark ? `drop-shadow(0 0 4px ${C.red}AA)` : `drop-shadow(0 0 3px ${C.ink}55)`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <button onClick={onToggle} aria-label="Toggle light/dark theme"
      style={{ background:"none", border:"none", cursor:"none", padding:0, display:"flex", alignItems:"center", lineHeight:0, opacity:0.85, transition:"opacity 0.2s" }}
      onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
      onMouseLeave={e => (e.currentTarget.style.opacity = "0.85")}>
      <div style={{ width:W, height:H, flexShrink:0 }}>
        <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display:"block", overflow:"visible" }} />
      </div>
    </button>
  )
}

export default function GlobalNavbarModern() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProjectOpen,    setIsProjectOpen]    = useState(false)
  const [scrolled,         setScrolled]         = useState(false)
  const [isDark,           setIsDark]           = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", !isDark)
    document.documentElement.classList.toggle("theme-dark",   isDark)
  }, [isDark])

  useEffect(() => {
    setIsProjectOpen(false)
    setIsMobileMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => pathname === href

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&display=swap');

        .nav-link-m { position:relative; text-decoration:none; transition:color 0.2s; padding-bottom:4px; letter-spacing:0.2em; }
        .nav-link-m::after { content:''; position:absolute; bottom:-2px; left:0; width:0; height:2px; background:${C.red}; box-shadow:0 0 8px ${C.red}CC, 0 0 16px ${C.red}55; transition:width 0.3s cubic-bezier(0.16,1,0.3,1); }
        .nav-link-m:hover::after, .nav-link-m.active::after { width:100%; }
        .nav-link-m:hover { color:${C.ink} !important; }
        .nav-link-m.active { color:${C.red} !important; }

        .proj-item-m { transition:color 0.18s, background 0.18s, padding-left 0.22s, border-color 0.18s; }
        .proj-item-m:hover { color:${C.ink} !important; background:${C.red}20 !important; border-left-color:${C.red} !important; padding-left:24px !important; }

        .proj-btn-m { background:none; border:none; cursor:none; display:flex; align-items:center; gap:8px; font-family:'DM Mono',monospace; font-size:10px; letter-spacing:0.2em; text-transform:uppercase; color:${C.mid}; transition:color 0.2s; padding:4px 0; }
        .proj-btn-m:hover, .proj-btn-m.open { color:${C.ink}; }

        @keyframes blink-m { 0%,100%{opacity:1} 50%{opacity:0} }
        .blink-m { animation:blink-m 1.2s step-end infinite; }

        @keyframes spinY-m { 0%{transform:rotateY(0deg);} 100%{transform:rotateY(360deg);} }
        .logo-3d-m { animation:spinY-m 3s linear infinite; will-change:transform; display:block; }
        .logo-3d-m:hover { animation:spinY-m 1s linear infinite; }

        @media (max-width:768px) { .desktop-nav-m { display:none !important; } .hamburger-m { display:flex !important; } }
        @media (min-width:769px) { .hamburger-m { display:none !important; } }
        @media (hover:hover) and (pointer:fine) { header, header *, header a, header button { cursor: none !important; } }
      `}</style>

      <header style={{
        position:"fixed", top:0, left:0, right:0, zIndex:9000,
        background:C.bg, backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)",
        transition:"background 0.4s, box-shadow 0.4s",
        boxShadow: scrolled ? `0 1px 0 ${C.greyLt}, 0 2px 24px ${C.red}18` : `0 1px 0 ${C.greyLt}`,
        fontFamily:"'DM Mono', monospace",
      }}>
        {/* Top accent line — rood */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${C.red}, ${C.red}88 50%, transparent 100%)`, boxShadow:`0 0 12px ${C.red}66` }} />
        {/* Left accent bar — rood */}
        <div style={{ position:"absolute", left:0, top:0, bottom:0, width:2, background:`linear-gradient(to bottom, ${C.red}, ${C.red}22 80%, transparent)`, boxShadow:`2px 0 10px ${C.red}44` }} />

        <div style={{ maxWidth:1400, margin:"0 auto", padding:"0 60px", height:72, display:"flex", alignItems:"center", justifyContent:"space-between", gap:40 }}>

          {/* LOGO */}
          <Link href="/home" style={{ textDecoration:"none", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, cursor:"none" }}>
              <div style={{ perspective:"150px", perspectiveOrigin:"50% 50%" }}>
                <img src="/img/logo.png" alt="Logo" width={40} height={30} className="logo-3d-m" />
              </div>
              <span className="blink-m" style={{ width:4, height:4, borderRadius:"50%", background:C.red, boxShadow:`0 0 6px ${C.red}`, display:"inline-block", flexShrink:0 }} />
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="desktop-nav-m" style={{ display:"flex", alignItems:"center", gap:40, fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase" }}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href}
                className={`nav-link-m${isActive(link.href) ? " active" : ""}`}
                style={{ color: isActive(link.href) ? C.red : C.mid }}>
                {link.label}
              </Link>
            ))}

            {/* Project dropdown */}
            <div style={{ position:"relative" }}>
              <button className={`proj-btn-m${isProjectOpen ? " open" : ""}`} onClick={() => setIsProjectOpen((v) => !v)}>
                Project
                <motion.span
                  animate={{ rotate:isProjectOpen ? 180 : 0, color:isProjectOpen ? C.red : C.mid }}
                  transition={{ duration:0.25 }}
                  style={{ fontSize:9, display:"inline-block" }}>▾
                </motion.span>
              </button>

              <AnimatePresence>
                {isProjectOpen && (
                  <motion.div
                    initial={{ opacity:0, y:-10, scaleY:0.9 }}
                    animate={{ opacity:1, y:0,   scaleY:1   }}
                    exit={{    opacity:0, y:-8,   scaleY:0.94 }}
                    transition={{ duration:0.25, ease:EASE }}
                    style={{ position:"absolute", top:"calc(100% + 18px)", left:"50%", transform:"translateX(-50%)", transformOrigin:"top center", width:210, background:`${C.bg}F8`, border:`1px solid ${C.greyLt}`, borderTop:"none", backdropFilter:"blur(20px)", overflow:"hidden", boxShadow:`0 8px 32px #000A, 0 0 0 1px ${C.red}22` }}>
                    <div style={{ height:2, background:C.red, boxShadow:`0 0 10px ${C.red}` }} />
                    {PROJECTS.map((proj, i) => (
                      <Link key={proj.href} href={proj.href} onClick={() => setIsProjectOpen(false)}
                        className="proj-item-m"
                        style={{ display:"flex", alignItems:"center", gap:12, padding:"15px 20px", textDecoration:"none", color:C.mid, fontSize:10, letterSpacing:"0.16em", textTransform:"uppercase", borderBottom: i < PROJECTS.length - 1 ? `1px solid ${C.greyLt}` : "none", borderLeft:"2px solid transparent" }}>
                        <span style={{ fontSize:8, color:C.red, opacity:0.7, flexShrink:0 }}>{String(i+1).padStart(2,"0")}</span>
                        {proj.name}
                        <span style={{ marginLeft:"auto", fontSize:11, opacity:0.35 }}>↗</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── CONTROLS: Style Toggle + Theme Toggle ── */}
            <div style={{ display:"flex", alignItems:"center", gap:12, paddingLeft:20, borderLeft:`1px solid ${C.greyLt}` }}>
              <StyleToggle />
              <div style={{ width:1, height:20, background:C.greyLt }} />
              <span style={{ fontSize:9, color:C.mid, letterSpacing:"0.18em", textTransform:"uppercase", transition:"color 0.3s" }}>
                {isDark ? "Dark" : "Light"}
              </span>
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark((v) => !v)} />
            </div>
          </nav>

          {/* HAMBURGER */}
          <button className="hamburger-m" onClick={() => setIsMobileMenuOpen((v) => !v)}
            style={{ display:"none", background:"none", border:`1px solid ${isMobileMenuOpen ? C.red : C.greyLt}`, padding:"9px 11px", cursor:"none", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:5, transition:"border-color 0.2s" }}
            aria-label="Toggle menu">
            {[0,1,2].map((i) => (
              <motion.div key={i}
                animate={ isMobileMenuOpen ? i===1 ? {opacity:0,scaleX:0} : i===0 ? {rotate:45,y:6} : {rotate:-45,y:-6} : {rotate:0,y:0,opacity:1,scaleX:1} }
                transition={{ duration:0.25 }}
                style={{ width:20, height:1, background:isMobileMenuOpen ? C.red : C.mid, transformOrigin:"center", transition:"background 0.2s" }} />
            ))}
          </button>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
              transition={{ duration:0.35, ease:EASE }}
              style={{ overflow:"hidden", background:C.bg, borderTop:`1px solid ${C.greyLt}` }}>
              <div style={{ padding:"32px 60px 40px", display:"flex", flexDirection:"column", gap:0 }}>
                {NAV_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                    style={{ display:"block", padding:"16px 0", borderBottom:`1px solid ${C.greyLt}`, textDecoration:"none", fontFamily:"'Bebas Neue', sans-serif", fontSize:28, letterSpacing:"0.1em", color: isActive(link.href) ? C.red : C.mid, transition:"color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.ink)}
                    onMouseLeave={e => (e.currentTarget.style.color = isActive(link.href) ? C.red : C.mid)}>
                    {link.label}
                  </Link>
                ))}

                <div>
                  <button onClick={() => setIsProjectOpen((v) => !v)}
                    style={{ width:"100%", background:"none", border:"none", padding:"16px 0", borderBottom:`1px solid ${C.greyLt}`, textAlign:"left", cursor:"none", display:"flex", justifyContent:"space-between", alignItems:"center", fontFamily:"'Bebas Neue', sans-serif", fontSize:28, letterSpacing:"0.1em", color: isProjectOpen ? C.red : C.mid }}>
                    Project
                    <motion.span animate={{ rotate: isProjectOpen ? 180 : 0 }} transition={{ duration:0.25 }}>▾</motion.span>
                  </button>
                  <AnimatePresence>
                    {isProjectOpen && (
                      <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
                        transition={{ duration:0.25 }} style={{ overflow:"hidden" }}>
                        {PROJECTS.map((proj) => (
                          <Link key={proj.href} href={proj.href}
                            onClick={() => { setIsMobileMenuOpen(false); setIsProjectOpen(false) }}
                            style={{ display:"block", padding:"12px 0 12px 20px", textDecoration:"none", fontFamily:"'DM Mono', monospace", fontSize:11, letterSpacing:"0.18em", textTransform:"uppercase", color:C.mid, borderLeft:`1px solid ${C.greyLt}`, marginLeft:8, transition:"color 0.2s, border-color 0.2s" }}
                            onMouseEnter={e => { e.currentTarget.style.color=C.red; e.currentTarget.style.borderLeftColor=C.red }}
                            onMouseLeave={e => { e.currentTarget.style.color=C.mid; e.currentTarget.style.borderLeftColor=C.greyLt }}>
                            {proj.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile controls */}
                <div style={{ display:"flex", alignItems:"center", gap:16, paddingTop:28, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:"'DM Mono', monospace", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:C.mid }}>
                    <ThemeToggle isDark={isDark} onToggle={() => setIsDark((v) => !v)} />
                    <span>{isDark ? "Dark" : "Light"} mode</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:10, fontFamily:"'DM Mono', monospace", fontSize:9, letterSpacing:"0.2em", textTransform:"uppercase", color:C.mid }}>
                    <StyleToggle />
                    <span>Stijl</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div style={{ height:72 }} />
    </>
  )
}