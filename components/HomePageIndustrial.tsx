"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import Link from "next/link"

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
type Theme = {
  bg: string; surface: string; ink: string; inkSub: string; inkMuted: string
  orange: string; border: string; isLight: boolean
}
const DARK: Theme  = { bg:"#080807", surface:"#111110", ink:"#F0EDE8", inkSub:"#C8C4BE", inkMuted:"#888480", orange:"#FF5C1A", border:"#262420", isLight:false }
const LIGHT: Theme = { bg:"#FAFAF8", surface:"#F0EDE8", ink:"#0A0908",  inkSub:"#3A3530", inkMuted:"#4E4A46", orange:"#E84000", border:"#DDD8D0", isLight:true  }
const E: [number,number,number,number] = [0.16, 1, 0.3, 1]

interface Project { id:string; name:string; sub:string; year:string; href:string }
const PROJECTS: Project[] = [
  { id:"001", name:"Hélène Binet",    sub:"Fotografie",           year:"2025", href:"/Architectuur" },
  { id:"002", name:"CineCity",        sub:"Campagne — Branding",  year:"2026", href:"/CineCity"     },
  { id:"003", name:"C for chocolate", sub:"Verpakking — Branding", year:"2026", href:"/Chocolate"    },
]
const SKILLS  = ["Branding","Verpakking","Digitaal Design","Fotografie","Vormgeving","UI / UX"]
const MARQUEE = ["Fotografie","Branding","Visuele Identiteit","Vormgeving","UI/UX","Verpakking","Motion","Digitaal Design"]
const HERO_IMAGES = [
  { src:"/img/Gallerij_3.jpg",                       alt:"Design project 1" },
  { src:"/img/Mockup_affichereeks.jpg",              alt:"Design project 2" },
  { src:"/img/2526_BDL3_PACK_H4_WaterschootJ.jpg",  alt:"Design project 3" },
]

// ── THEME HOOK — FIX: custom event i.p.v. MutationObserver ───────────────────
function useTheme(): Theme {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    // Lees initiële staat van de DOM
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

// ── PARALLAX HERO ─────────────────────────────────────────────────────────────
function ParallaxHero({ C }: { C: Theme }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] })
  const scale          = useTransform(scrollYProgress, [0,1], prefersReduced ? [1,1] : [1.0, 1.18])
  const y              = useTransform(scrollYProgress, [0,1], prefersReduced ? ["0%","0%"] : ["0%","8%"])
  const overlayOpacity = useTransform(scrollYProgress, [0,1], [0, 0.4])

  useEffect(() => {
    const id = setInterval(() => setActiveIndex(i => (i+1) % HERO_IMAGES.length), 4000)
    return () => clearInterval(id)
  }, [])

  return (
    <div ref={containerRef} className="hero-image-wrap">
      {HERO_IMAGES.map((img, i) => (
        <motion.div key={img.src} style={{ position:"absolute", inset:0, scale, y }}
          initial={{ opacity:0 }} animate={{ opacity: i===activeIndex ? 1 : 0 }}
          transition={{ duration:1.2, ease:"easeInOut" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img.src} alt={img.alt} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
        </motion.div>
      ))}
      <motion.div style={{ position:"absolute", inset:0, background:"#000", opacity:overlayOpacity, zIndex:1, pointerEvents:"none" }} />
      <div className="hero-colorgrade" style={{ position:"absolute", inset:0, zIndex:2, pointerEvents:"none",
        background: C.isLight ? "linear-gradient(135deg,rgba(232,64,0,0.08) 0%,transparent 60%)"
                               : "linear-gradient(135deg,rgba(255,92,26,0.12) 0%,transparent 60%)" }} />
      <div className="hero-mask" style={{ position:"absolute", inset:0, zIndex:3, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:20, right:20, zIndex:4, display:"flex", gap:8 }}>
        {HERO_IMAGES.map((_,i) => (
          <button key={i} onClick={() => setActiveIndex(i)} style={{
            width: i===activeIndex ? 20 : 6, height:6, borderRadius:3,
            background: i===activeIndex ? C.orange : `${C.ink}44`,
            border:"none", cursor:"pointer", padding:0, transition:"all 0.35s ease" }} />
        ))}
      </div>
    </div>
  )
}

// ── CURSOR ────────────────────────────────────────────────────────────────────

// ── TICKER ────────────────────────────────────────────────────────────────────
function Ticker({ C }: { C:Theme }) {
  const items = [...MARQUEE,...MARQUEE,...MARQUEE,...MARQUEE]
  return (
    <div style={{ overflow:"hidden", borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"10px 0", background:C.isLight?C.ink:C.surface }}>
      <motion.div animate={{ x:["0%","-50%"] }} transition={{ duration:28, repeat:Infinity, ease:"linear" }}
        style={{ display:"flex", whiteSpace:"nowrap", width:"fit-content" }}>
        {items.map((item,i) => (
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:14, padding:"0 22px", fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.32em", textTransform:"uppercase" as const, color:i%4===0?C.orange:"rgba(255,255,255,0.38)" }}>
            {item}<span style={{ width:2,height:2,borderRadius:"50%",background:i%4===0?C.orange:"rgba(255,255,255,0.2)",display:"inline-block" }}/>
          </span>
        ))}
      </motion.div>
    </div>
  )
}

// ── PROJECT ROW ───────────────────────────────────────────────────────────────
function ProjectRow({ project, index, C }: { project:Project; index:number; C:Theme }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div initial={{ opacity:0,x:-20 }} whileInView={{ opacity:1,x:0 }} viewport={{ once:true,margin:"-40px" }}
      transition={{ duration:0.6, delay:index*0.08, ease:E }}>
      <Link href={project.href} style={{ display:"block", textDecoration:"none", color:"inherit" }}>
        <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} className="project-row"
          style={{ position:"relative", borderTop:`1px solid ${C.border}`, overflow:"hidden" }}>
          <motion.div animate={{ scaleX:hov?1:0 }} transition={{ duration:0.45,ease:E }}
            style={{ position:"absolute",inset:0,background:`linear-gradient(90deg,${C.orange}10,transparent)`,transformOrigin:"left",zIndex:0 }}/>
          <motion.div animate={{ scaleY:hov?1:0 }} transition={{ duration:0.3,ease:E }}
            style={{ position:"absolute",left:0,top:0,bottom:0,width:3,background:C.orange,transformOrigin:"top",zIndex:1 }}/>
          <span className="project-id" style={{ fontFamily:"'DM Mono',monospace", color:hov?C.orange:C.inkMuted, letterSpacing:"0.16em", zIndex:1, transition:"color 0.2s" }}>
            {project.id}
          </span>
          <div style={{ zIndex:1, minWidth:0 }}>
            <motion.div animate={{ x:hov?8:0 }} transition={{ duration:0.35,ease:E }}
              className="project-name" style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.05em", color:hov?C.orange:C.ink, lineHeight:1.05, transition:"color 0.2s" }}>
              {project.name}
            </motion.div>
            <div className="project-sub" style={{ fontFamily:"'DM Mono',monospace", color:C.inkSub, letterSpacing:"0.18em", textTransform:"uppercase", marginTop:4 }}>
              {project.sub} <span className="project-year-inline" style={{ color:C.inkMuted, marginLeft:8 }}>{project.year}</span>
            </div>
          </div>
          <span className="project-year-desktop" style={{ fontFamily:"'DM Mono',monospace", color:hov?C.inkSub:C.inkMuted, textAlign:"right", zIndex:1, transition:"color 0.2s" }}>
            {project.year}
          </span>
          <motion.span animate={{ x:hov?4:0, color:hov?C.orange:C.inkMuted }} transition={{ duration:0.2 }}
            style={{ fontSize:15, textAlign:"center", display:"block", zIndex:1 }}>↗</motion.span>
        </div>
      </Link>
    </motion.div>
  )
}

// ── COUNTER ───────────────────────────────────────────────────────────────────
function Counter({ to, suffix="" }: { to:number; suffix?:string }) {
  const [n, setN] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current; if(!el) return
    const obs = new IntersectionObserver(([e]) => {
      if(e.isIntersecting) {
        let s=0
        const step=()=>{ s+=Math.ceil((to-s)/8); if(s>=to)s=to; setN(s); if(s<to)requestAnimationFrame(step) }
        requestAnimationFrame(step); obs.disconnect()
      }
    }); obs.observe(el); return ()=>obs.disconnect()
  },[to])
  return <span ref={ref}>{n}{suffix}</span>
}

// ── GLITCH CHAR ───────────────────────────────────────────────────────────────
function GlitchChar({ ch, delay, C }: { ch:string; delay:number; C:Theme }) {
  const [g, setG] = useState(false)
  useEffect(() => {
    const iv = setInterval(() => {
      if(Math.random()>0.94){ setG(true); setTimeout(()=>setG(false), 60+Math.random()*70) }
    }, 2500)
    return ()=>clearInterval(iv)
  },[])
  return (
    <motion.span initial={{ y:"105%" }} animate={{ y:0 }} transition={{ duration:0.85,delay,ease:E }}
      style={{ display:"inline-block", fontFamily:"'Bebas Neue',sans-serif", lineHeight:0.86, color:g?C.orange:C.ink, textShadow:g?`3px 0 ${C.orange},-3px 0 #00eeff`:"none", transition:"color 0.04s" }}>
      {ch}
    </motion.span>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function HomePageIndustrial() {
  const [loaded, setLoaded] = useState(false)
  const C = useTheme()

  useEffect(() => {
    const t = setTimeout(()=>setLoaded(true), 100)
    return ()=>clearTimeout(t)
  },[])

  const first = "JARNE".split("")
  const last  = "WATERSCHOOT".split("")

  return (
    // FIX: transition verwijderd van background/color om synchroon te wisselen
    <div style={{ background:C.bg, minHeight:"100vh", color:C.ink, overflowX:"hidden", fontFamily:"'DM Mono',monospace" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }
        html { scroll-behavior:smooth }
        ::selection { background:#FF5C1A; color:#fff }
        ::-webkit-scrollbar { width:2px }
        ::-webkit-scrollbar-thumb { background:#FF5C1A }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .blink { animation:blink 1.1s step-end infinite }
        a { text-decoration:none; color:inherit }

        body { cursor:auto }
        @media (hover:hover) and (pointer:fine) { body { cursor:none !important } }

        .hero-image-wrap { position:absolute; inset:0; width:100%; overflow:hidden; zIndex:0 }

        /* FIX: hero-mask gebruikt nu inline background via C.bg i.p.v. CSS variabele */
        .hero-mask { background: linear-gradient(to bottom, transparent 25%, ${C.bg} 85%) }
        @media (min-width:768px) {
          .hero-image-wrap { top:0; right:0; bottom:0; left:auto; width:58% }
          .hero-mask { background: linear-gradient(to right, ${C.bg} 0%, color-mix(in srgb, ${C.bg} 88%, transparent) 12%, color-mix(in srgb, ${C.bg} 38%, transparent) 34%, transparent 58%) }
        }

        .hero-content { position:relative; z-index:5; margin-top:auto; padding: 0 20px }
        @media (min-width:768px) { .hero-content { padding: 0 64px } }

        .name-first { font-size: clamp(64px, 18vw, 108px) }
        @media (min-width:480px) { .name-first { font-size: clamp(80px, 18vw, 140px) } }
        @media (min-width:768px) { .name-first { font-size: clamp(108px, 16.5vw, 238px) } }

        .name-last { font-size: clamp(30px, 8.5vw, 52px) }
        @media (min-width:480px) { .name-last { font-size: clamp(36px, 9vw, 64px) } }
        @media (min-width:768px) { .name-last { font-size: clamp(52px, 8.2vw, 118px) } }

        .role-bar { display:flex; flex-wrap:wrap; align-items:center; gap:10px 18px; margin-top:16px; padding-bottom:16px }
        @media (min-width:768px) { .role-bar { gap:32px; margin-top:28px; padding-bottom:32px } }
        .role-divider { display:none }
        @media (min-width:768px) { .role-divider { display:block } }
        .role-location-mobile { display:block }
        @media (min-width:768px) { .role-location-mobile { display:none !important } }

        .tagline-cta { display:flex; flex-direction:column; align-items:flex-start; gap:20px; padding: 16px 0 44px }
        @media (min-width:768px) { .tagline-cta { flex-direction:row; align-items:center; justify-content:space-between; gap:48px; padding: 28px 0 60px } }
        .tagline-text { font-size:13px; line-height:1.8; max-width:100% }
        @media (min-width:768px) { .tagline-text { font-size:14px; max-width:380px } }

        .stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; margin-top:40px; overflow:hidden }
        @media (min-width:768px) { .stats-grid { margin-top:64px } }
        .stat-cell { padding:28px 16px; display:flex; flex-direction:column; align-items:center; text-align:center }
        @media (min-width:768px) { .stat-cell { padding:48px 40px } }
        .stat-number { font-size: clamp(36px, 10vw, 52px); line-height:1 }
        @media (min-width:768px) { .stat-number { font-size: clamp(48px, 5.5vw, 76px) } }

        .projects-section { padding: 52px 20px }
        @media (min-width:768px) { .projects-section { padding: 96px 64px } }
        .project-row { display:grid; grid-template-columns: 36px 1fr 24px; align-items:center; gap:12px; padding:18px 0 18px 16px; cursor:pointer }
        @media (min-width:768px) { .project-row { grid-template-columns: 56px 1fr 72px 36px; gap:24px; padding:28px 0 28px 24px; cursor:none } }
        .project-name { font-size: clamp(20px, 5.5vw, 32px) }
        @media (min-width:768px) { .project-name { font-size: clamp(28px, 3vw, 52px) } }
        .project-year-inline { display:inline }
        .project-year-desktop { display:none; font-size:13px }
        @media (min-width:768px) { .project-year-inline { display:none } .project-year-desktop { display:block; font-size:13px } }
        .project-id { display:none; font-size:11px }
        @media (min-width:480px) { .project-id { display:block } }
        @media (min-width:768px) { .project-id { font-size:12px } }
        .project-sub { font-size:9px }
        @media (min-width:768px) { .project-sub { font-size:11px } }
        .projects-header-label { font-size:9px }
        .projects-header-count { font-size:9px }
        @media (min-width:768px) { .projects-header-label { font-size:11px } .projects-header-count { font-size:12px } }

        .about-section {
          margin: 0 20px;
          padding: 52px 0 72px;
          display:grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (min-width:768px) {
          .about-section {
            margin: 0 64px;
            padding: 80px 0 100px;
            grid-template-columns: 3fr 2fr;
            gap: 80px;
          }
        }
        .about-label { font-size: 9px; letter-spacing: 0.32em; }
        @media (min-width:768px) { .about-label { font-size: 10px } }
        .about-heading { font-size: clamp(32px, 9vw, 56px); line-height: 0.92; margin-bottom: 20px; }
        @media (min-width:768px) { .about-heading { font-size: clamp(40px, 5vw, 76px); margin-bottom: 32px } }
        .about-body { font-size: 15px; line-height: 1.85; margin-bottom: 36px; max-width: 520px; }
        @media (min-width:768px) { .about-body { font-size: 17px; max-width: 100% } }
        .skills-grid { display:grid; grid-template-columns:1fr 1fr; gap:1px }
        .skill-cell { padding: 18px 16px; font-size: 13px }
        @media (min-width:768px) { .skill-cell { padding: 28px 28px; font-size: 15px } }
        .hero-fade { height:35% }
        @media (min-width:768px) { .hero-fade { height:25% } }
      `}</style>



      <svg style={{ position:"fixed",inset:0,zIndex:9989,opacity:0.028,pointerEvents:"none",width:"100%",height:"100%" }}>
        <filter id="gn">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={4} stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#gn)"/>
      </svg>

      {/* ══ HERO ══ */}
      <section style={{ minHeight:"100svh", position:"relative", display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <ParallaxHero C={C} />
        <div className="hero-fade" style={{ position:"absolute", bottom:0, left:0, right:0, background:`linear-gradient(to bottom,transparent,${C.bg})`, pointerEvents:"none", zIndex:3 }} />
        <motion.div initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:1.4,delay:0.1,ease:E }}
          style={{ position:"absolute",top:0,left:0,right:0,height:2,background:C.orange,transformOrigin:"left",zIndex:10,boxShadow:`0 0 20px ${C.orange}77` }}/>

        <div className="hero-content">
          <div style={{ overflow:"hidden", lineHeight:0.84 }}>
            <div className="name-first" style={{ display:"flex" }}>
              {loaded && first.map((ch,i) => <GlitchChar key={i} ch={ch} delay={0.25+i*0.055} C={C}/>)}
            </div>
          </div>
          <div style={{ overflow:"hidden", lineHeight:0.84 }}>
            <div className="name-last" style={{ display:"flex" }}>
              {loaded && last.map((ch,i) => (
                <motion.span key={i} initial={{ y:"105%" }} animate={{ y:0 }} transition={{ duration:0.82,delay:0.5+i*0.03,ease:E }}
                  style={{ display:"inline-block", fontFamily:"'Bebas Neue',sans-serif", lineHeight:0.84, letterSpacing:"0.025em", color:"transparent", WebkitTextStroke:`clamp(0.4px, 0.15vw, 1.5px) ${C.ink}`, transition:"none" }}>
                  {ch}
                </motion.span>
              ))}
            </div>
          </div>

          <motion.div className="role-bar" initial={{ opacity:0,y:12 }} animate={loaded?{opacity:1,y:0}:{}}
            transition={{ delay:1.6,duration:0.7,ease:E }}
            style={{ borderBottom:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:20,height:2,background:C.orange,flexShrink:0 }}/>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:C.inkSub }}>Grafisch Ontwerper</span>
            </div>
            <div className="role-divider" style={{ width:1,height:16,background:C.border }}/>
            <span className="role-divider" style={{ fontFamily:"'DM Mono',monospace", fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase", color:C.inkMuted }}>Antwerpen, BE</span>
            <div className="role-divider" style={{ width:1,height:16,background:C.border }}/>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <span className="blink" style={{ width:6,height:6,borderRadius:"50%",background:C.orange,display:"inline-block",flexShrink:0,boxShadow:`0 0 8px ${C.orange}` }}/>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase", color:C.orange }}>Beschikbaar</span>
            </div>
            <span className="role-location-mobile" style={{ fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.18em", textTransform:"uppercase", color:C.inkMuted }}>
              Antwerpen, BE
            </span>
          </motion.div>

          <motion.div className="tagline-cta" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2.0,duration:0.8 }}>
            <p className="tagline-text" style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, fontStyle:"italic", color:C.inkSub }}>
              Tastbare visuele verhalen. Strategie en esthetiek voor merken die durven opvallen.
            </p>
            <motion.a href="#werk"
              whileHover={{ boxShadow:`0 0 28px ${C.orange}99, 0 0 8px ${C.orange}55`, scale:1.03 }}
              whileTap={{ scale:0.97 }}
              style={{ border:`1.5px solid ${C.orange}`, backgroundColor:C.orange, color:"#fff", fontSize:9, letterSpacing:"0.3em", textTransform:"uppercase", padding:"14px 28px", display:"inline-flex", alignItems:"center", gap:14, transition:"box-shadow 0.28s, transform 0.28s", whiteSpace:"nowrap", flexShrink:0 }}>
              Bekijk Werk
              <motion.span animate={{ x:[0,6,0] }} transition={{ duration:1.6,repeat:Infinity }}>→</motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <Ticker C={C}/>

      {/* ══ STATS ══ */}
      <motion.section className="stats-grid" initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
        transition={{ duration:0.7 }} style={{ background:C.border, overflow:"hidden" }}>
        {[{n:12,s:"+",l:"Projecten"},{n:2,s:"+",l:"Jaar Ervaring"},{n:8,s:"",l:"Disciplines"},{n:100,s:"%",l:"Passie"}].map((stat,i) => (
          <div key={i} className="stat-cell" style={{ background:C.bg }}>
            <div className="stat-number" style={{ fontFamily:"'Bebas Neue',sans-serif", color:C.orange }}>
              <Counter to={stat.n} suffix={stat.s}/>
            </div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:C.inkSub, letterSpacing:"0.2em", textTransform:"uppercase", marginTop:8 }}>
              {stat.l}
            </div>
          </div>
        ))}
      </motion.section>

      {/* ══ PROJECTS ══ */}
      <section id="werk" className="projects-section">
        <motion.div initial={{ opacity:0,y:12 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }} transition={{ duration:0.5 }}
          style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:16 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:20,height:2,background:C.orange }}/>
            <span className="projects-header-label" style={{ fontFamily:"'DM Mono',monospace", letterSpacing:"0.3em", textTransform:"uppercase", color:C.inkSub }}>
              Geselecteerde Projecten
            </span>
          </div>
          <span className="projects-header-count" style={{ fontFamily:"'DM Mono',monospace", color:C.inkMuted, letterSpacing:"0.12em" }}>
            {PROJECTS.length} werken
          </span>
        </motion.div>
        {PROJECTS.map((p,i) => <ProjectRow key={p.id} project={p} index={i} C={C}/>)}
        <div style={{ borderTop:`1px solid ${C.border}` }}/>
      </section>

      {/* ══ ABOUT ══ */}
      <motion.section className="about-section" initial={{ opacity:0,y:40 }} whileInView={{ opacity:1,y:0 }}
        viewport={{ once:true,margin:"-80px" }} transition={{ duration:0.8,ease:E }}
        style={{ borderTop:`1px solid ${C.border}` }}>

        <div>
          <div className="about-label" style={{ fontFamily:"'DM Mono',monospace", textTransform:"uppercase", color:C.orange, marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ width:20,height:2,background:C.orange,display:"inline-block" }}/>
            Over mij
          </div>
          <h2 className="about-heading" style={{ fontFamily:"'Bebas Neue',sans-serif", letterSpacing:"0.03em", color:C.ink }}>
            Design dat werkt.<br/>
            <span style={{ WebkitTextStroke:`clamp(0.5px, 0.2vw, 2px) ${C.orange}`, color:"transparent" }}>Design dat blijft.</span>
          </h2>
          <p className="about-body" style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300, color:C.inkSub }}>
            Gespecialiseerd in het bouwen van visuele systemen die verder gaan dan het esthetische. Van merkidentiteit tot verpakking en digitale campagnes.
          </p>
          <motion.a href="/contact"
            whileHover={{ boxShadow:`0 0 28px ${C.orange}99, 0 0 8px ${C.orange}55`, scale:1.03 }}
            whileTap={{ scale:0.97 }}
            style={{ display:"inline-flex", alignItems:"center", gap:12, border:`1.5px solid ${C.orange}`, backgroundColor:C.orange, color:"#fff", fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.26em", textTransform:"uppercase", padding:"14px 28px", transition:"box-shadow 0.28s, transform 0.28s" }}>
            Contact ↗
          </motion.a>
        </div>

        <div>
          <div className="about-label" style={{ fontFamily:"'DM Mono',monospace", textTransform:"uppercase", color:C.orange, marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
            <span style={{ width:20,height:2,background:C.orange,display:"inline-block" }}/>
            Expertises
          </div>
          <div className="skills-grid" style={{ background:C.border }}>
            {SKILLS.map((skill,i) => (
              <motion.div key={skill} className="skill-cell" initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                transition={{ delay:i*0.06 }} whileHover={{ background:C.orange, color:"#fff" }}
                style={{ background:C.bg, fontFamily:"'DM Sans',sans-serif", fontWeight:400, color:C.ink, transition:"background 0.22s, color 0.22s", cursor:"default", display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ width:4,height:4,background:C.orange,borderRadius:"50%",flexShrink:0 }}/>
                {skill}
              </motion.div>
            ))}
          </div>
        </div>

      </motion.section>

    </div>
  )
}