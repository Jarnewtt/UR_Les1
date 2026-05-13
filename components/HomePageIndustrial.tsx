"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { trackProjectClick, trackSlideChange, trackCTAClick } from "@/lib/analytics"

// ── THEME ─────────────────────────────────────────────────────────────────────
type Theme = {
  bg: string; surface: string; ink: string; inkSub: string; inkMuted: string
  blue: string; border: string; isLight: boolean
}
const DARK: Theme  = { bg:"#080808", surface:"#111111", ink:"#F0EDF0", inkSub:"#AEAEAE", inkMuted:"#545454", blue:"#1A1AFF", border:"#1E1E1E", isLight:false }
const LIGHT: Theme = { bg:"#F5F4F0", surface:"#ECEAE6", ink:"#0A0A0A", inkSub:"#3A3A36", inkMuted:"#888884", blue:"#1A1AFF", border:"#D4D4D0", isLight:true  }
const E: [number,number,number,number] = [0.16, 1, 0.3, 1]

function useTheme(): Theme {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("theme-dark"))
    const h = (e: Event) => setIsDark((e as CustomEvent).detail.isDark)
    window.addEventListener("theme-change", h)
    return () => window.removeEventListener("theme-change", h)
  }, [])
  return isDark ? DARK : LIGHT
}

// ── DATA ──────────────────────────────────────────────────────────────────────
interface Project { id:string; name:string; sub:string; year:string; href:string; image:string }
const PROJECTS: Project[] = [
  { id:"01", name:"Hélène Binet",    sub:"Fotografie",  year:"2025", href:"/Architectuur", image:"/img/Gallerij_3.jpg"                    },
  { id:"02", name:"CineCity",        sub:"Branding",    year:"2026", href:"/CineCity",     image:"/img/Mockup_affichereeks.jpg"             },
  { id:"03", name:"C for Chocolate", sub:"Verpakking",  year:"2026", href:"/Chocolate",    image:"/img/2526_BDL3_PACK_H4_WaterschootJ.jpg" },
]
const HERO_IMAGES = [
  { src:"/img/2526_BDL3_PACK_H4_WaterschootJ.jpg", label:"Verpakking",  project:"C for Chocolate" },
  { src:"/img/Mockup_affichereeks.jpg",             label:"Branding",    project:"CineCity"         },
  { src:"/img/Gallerij_3.jpg",                      label:"Fotografie",  project:"Hélène Binet"     },
]

// ── CAROUSEL CARD ─────────────────────────────────────────────────────────────
function CarouselCard({ project, C }: { project:Project; C:Theme }) {
  const [hov, setHov] = useState(false)

  return (
    <Link
      href={project.href}
      className="carousel-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => trackProjectClick(project.name, project.href, '/home')}
    >
      <div className="carousel-img-wrap">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          src={project.image} alt={project.name}
          animate={{ scale: hov ? 1.05 : 1, filter: hov ? "grayscale(0)" : "grayscale(1)" }}
          transition={{ duration:0.7, ease:E }}
          style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
        />
        {/* Category badge */}
        <div style={{ position:"absolute", top:16, left:16, background:C.blue, padding:"6px 14px", borderRadius:4 }}>
          <span style={{
            fontFamily:"Inter, system-ui, sans-serif",
            fontWeight:600,
            fontSize:"clamp(10px, 2.2vw, 12px)",
            letterSpacing:"0.22em",
            textTransform:"uppercase",
            color:"#fff",
            lineHeight:1,
          }}>
            {project.sub}
          </span>
        </div>
      </div>

      {/* Name row */}
      <div style={{ padding:"14px 0 10px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div style={{
          fontFamily:"'Anton',Impact,sans-serif",
          fontSize:"clamp(18px,2.8vw,24px)",
          textTransform:"uppercase", lineHeight:1,
          color:C.ink,
        }}>
          {project.name}
        </div>
        <motion.span
          animate={{ x: hov ? 5 : 0, color: hov ? C.blue : C.inkMuted }}
          transition={{ duration:0.22 }}
          style={{ fontSize:18, flexShrink:0 }}
        >→</motion.span>
      </div>

      <motion.div
        animate={{ scaleX: hov ? 1 : 0 }}
        transition={{ duration:0.35, ease:E }}
        style={{ height:2, background:C.blue, transformOrigin:"left" }}
      />
    </Link>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function HomePageIndustrial() {
  const [loaded,  setLoaded]  = useState(false)
  const [heroIdx, setHeroIdx] = useState(0)
  const C = useTheme()
  const contactBtnRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const iv = setInterval(() => setHeroIdx(n => (n + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const btn = contactBtnRef.current
    if (!btn || window.matchMedia("(pointer: coarse)").matches) return
    let cur = 0 // current glow intensity (lerped)
    let tgt = 0 // target glow intensity
    let raf: number

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width  / 2
      const cy = rect.top  + rect.height / 2
      const dist = Math.sqrt((e.clientX - cx) ** 2 + (e.clientY - cy) ** 2)
      tgt = Math.max(0, 1 - dist / 220) ** 2
    }

    const tick = () => {
      cur += (tgt - cur) * 0.1
      const g = cur
      btn.style.boxShadow = g > 0.01
        ? `0 0 ${16 + g * 48}px rgba(26,26,255,${0.25 + g * 0.65}), 0 0 ${48 + g * 80}px rgba(26,26,255,${g * 0.35})`
        : ""
      btn.style.filter = g > 0.01 ? `brightness(${1 + g * 0.45})` : ""
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener("mousemove", onMove)
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div style={{ background:C.bg, color:C.ink, minHeight:"100vh", overflowX:"hidden", transition:"background 0.4s, color 0.4s" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Dancing+Script:wght@400;700&family=Inter:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }
        html { scroll-behavior:smooth }
        ::selection { background:${C.blue}; color:#fff }
        ::-webkit-scrollbar { width:2px }
        ::-webkit-scrollbar-thumb { background:${C.blue} }
        a { text-decoration:none; color:inherit }

        /* ── SECTION LABEL ── */
        .section-label {
          font-family:Inter,sans-serif; font-size: 14px; letter-spacing:0.32em;
          text-transform:uppercase; color:${C.blue};
          display:flex; align-items:center; gap:14px;
        }
        .section-label::before {
          content:''; display:block; width:24px; height:1px;
          background:${C.blue}; flex-shrink:0;
        }
        .contact-label { color:rgba(255,255,255,0.55) !important; }
        .contact-label::before { background:rgba(255,255,255,0.55) !important; }

        /* ── HERO — mobile-first ── */
        .hero-section {
          position:relative; min-height:100svh;
          display:flex; flex-direction:column; overflow:hidden;
        }
        /* MOBILE: image is a real block at the top */
        .hero-images-panel {
          position:relative; height:58svh;
          z-index:0; overflow:hidden; flex-shrink:0;
        }
        /* Bottom-fade so name text overlaps cleanly */
        .hero-images-panel::after {
          content:''; pointer-events:none;
          position:absolute; left:0; bottom:0; right:0; height:48%;
          background:linear-gradient(to top, ${C.bg} 0%, transparent 100%);
          z-index:2;
        }
        /* MOBILE: text panel flows below image, pulled up to overlap */
        .hero-text-panel {
          position:relative; z-index:10;
          display:flex; flex-direction:column; justify-content:flex-start;
          padding:0 clamp(20px,5vw,48px) clamp(24px,6vw,52px);
          margin-top:-2.8rem;
          flex:1;
          background:none;
          max-width:100%;
        }
        .hero-name-jarne      { color:${C.ink} }
        .hero-name-waterschoot { color:${C.blue} }
        .hero-progress-dots { display:none }
        /* DESKTOP */
        @media(min-width:1024px){
          .hero-section { flex-direction:row }
          .hero-images-panel {
            position:absolute; inset:0; height:auto; flex-shrink:unset;
          }
          .hero-images-panel::after {
            top:0; bottom:0; left:0; right:auto; width:62%; height:auto;
            background:linear-gradient(to right, ${C.bg} 0%, ${C.bg} 38%, transparent 100%);
          }
          .hero-text-panel {
            max-width:clamp(480px,48%,720px);
            padding:80px clamp(48px,6vw,96px);
            justify-content:center;
            margin-top:0;
            background:none;
          }
          .hero-progress-dots { display:flex }
        }

        /* ── STATS ── */
        .stats-band {
          display:flex; align-items:stretch;
          background:${C.surface}; border-top:1px solid ${C.border}; border-bottom:1px solid ${C.border};
          transition:background 0.4s;
        }
        .stat-cell { flex:1; padding:32px 12px; text-align:center; border-right:1px solid ${C.border}; }
        .stat-cell:last-child { border-right:none }
        @media(min-width:768px){ .stat-cell { padding:48px 40px } }
        .stat-num {
          font-family:'Anton',Impact,sans-serif;
          font-size:clamp(34px,8vw,52px);
          color:${C.blue}; line-height:1;
        }
        .stat-lbl {
          font-family:Inter,sans-serif; font-size: 14px;
          letter-spacing:0.22em; text-transform:uppercase;
          color:${C.ink}; margin-top:10px;
        }

        /* ── HERO IMAGE DESATURATION ── */
        .hero-images-panel img {
          filter: grayscale(1);
          transition: filter 0.75s ease;
        }
        .hero-section:hover .hero-images-panel img {
          filter: grayscale(0);
        }

        /* ── CAROUSEL ── */
        @keyframes carousel-scroll {
          from { transform:translateX(0) }
          to   { transform:translateX(-1176px) }
        }
        .carousel-track {
          display:flex; gap:32px; width:max-content;
          animation:carousel-scroll 28s linear infinite;
          will-change:transform;
        }
        .carousel-track:hover { animation-play-state:paused }
        .carousel-card {
          width:360px; flex-shrink:0;
          display:block; text-decoration:none; color:inherit; cursor:pointer;
        }
        .carousel-img-wrap { position:relative; overflow:hidden; aspect-ratio:4/3 }


        /* ── SECTION HORIZONTAL PADDING (matches hero text panel) ── */
        .section-h-pad {
          padding-left:  clamp(20px,5vw,48px);
          padding-right: clamp(20px,5vw,48px);
        }
        @media(min-width:1024px){
          .section-h-pad {
            padding-left:  clamp(48px,6vw,96px);
            padding-right: clamp(48px,6vw,96px);
          }
        }

        /* ── CONTACT SECTION ── */
        .contact-section {
          padding-top:    clamp(64px,10vw,120px);
          padding-bottom: clamp(48px,8vw,96px);
        }

        /* ── CONTACT CTA ── */
        @keyframes contact-glow {
          0%, 100% { box-shadow: 0 0 0px rgba(255,255,255,0), 0 0 0px rgba(255,255,255,0); }
          50%       { box-shadow: 0 0 28px rgba(255,255,255,0.55), 0 0 56px rgba(255,255,255,0.2); }
        }
        .contact-cta { animation: contact-glow 2.8s ease-in-out infinite; }
        .contact-cta:hover { animation-play-state: paused; opacity: 0.9; }

      `}</style>

      {/* Grain texture */}
      <svg style={{ position:"fixed", inset:0, zIndex:9989, opacity:0.02, pointerEvents:"none", width:"100%", height:"100%" }}>
        <filter id="gn">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={4} stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#gn)"/>
      </svg>

      {/* ══ HERO ══ */}
      <section className="hero-section">

        {/* Cycling images — full bleed background */}
        <div className="hero-images-panel">
          {HERO_IMAGES.map((img, i) => (
            <motion.div
              key={i}
              animate={{ opacity: i === heroIdx ? 1 : 0 }}
              transition={{ duration:1.1, ease:"easeInOut" }}
              style={{ position:"absolute", inset:0, zIndex: i === heroIdx ? 1 : 0 }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src} alt={img.project}
                style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", display:"block" }}
              />
            </motion.div>
          ))}
        </div>

        {/* Text panel */}
        <motion.div
          className="hero-text-panel"
          initial={{ opacity:0, x:-24 }}
          animate={loaded ? { opacity:1, x:0 } : {}}
          transition={{ duration:0.9, delay:0.1, ease:E }}
        >
          {/* Name block */}
          <h1 style={{ margin:0, lineHeight:1 }}>
            <div
              className="hero-name-jarne"
              style={{
                fontFamily:"'Anton',Impact,sans-serif",
                fontSize:"clamp(72px,12vw,148px)",
                textTransform:"uppercase",
                lineHeight:0.9, letterSpacing:"0.01em",
              }}
            >
              JARNE
            </div>
            <div
              className="hero-name-waterschoot"
              style={{
                fontFamily:"'Anton',Impact,sans-serif",
                fontSize:"clamp(40px,6.8vw,88px)",
                textTransform:"uppercase",
                lineHeight:1, letterSpacing:"0.02em",
              }}
            >
              WATERSCHOOT
            </div>
          </h1>

          {/* Info bar */}
          <div style={{
            display:"flex", alignItems:"center", flexWrap:"wrap", gap:"0 10px",
            marginTop:20,
            fontFamily:"Inter,sans-serif", fontSize: 14,
            letterSpacing:"0.28em", textTransform:"uppercase",
            color:C.inkMuted,
          }}>
            <span style={{ display:"inline-block", width:20, height:1, background: C.isLight ? C.blue : C.ink, verticalAlign:"middle", marginRight:4, flexShrink:0 }}/>
            <span style={{ color: C.isLight ? C.blue : C.ink }}>Grafisch Ontwerper</span>
            <span style={{ opacity:0.3 }}>|</span>
            <span style={{ color: C.isLight ? C.blue : C.ink }}>Antwerpen, BE</span>
          </div>

          {/* Tagline */}
          <p style={{
            fontFamily:"Inter,sans-serif", fontStyle:"italic", fontWeight:300,
            fontSize:"clamp(16px,1.4vw,20px)", lineHeight:1.75,
            color:C.inkSub, maxWidth:"34ch", marginTop:14,
          }}>
            Tastbare visuele verhalen. Strategie en esthetiek voor merken die durven opvallen.
          </p>

          {/* CTA — inline in text flow */}
          <motion.a
            href="#werk"
            onClick={() => trackCTAClick('Bekijk Werk', '/home')}
            initial={{ opacity:0, y:12 }}
            animate={loaded ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.7, delay:0.5, ease:E }}
            whileHover={{ opacity:0.85 }} whileTap={{ scale:0.97 }}
            style={{
              marginTop:22,
              display:"inline-flex", alignItems:"center", gap:12,
              backgroundColor:C.blue, color:"#fff",
              fontFamily:"Inter,sans-serif", fontSize: 14,
              letterSpacing:"0.28em", textTransform:"uppercase",
              padding:"14px 32px", borderRadius:4,
              textDecoration:"none", alignSelf:"flex-start",
            }}
          >
            Bekijk Werk <span style={{ fontSize: 14 }}>→</span>
          </motion.a>
        </motion.div>

        {/* Image progress dots — bottom center */}
        <div className="hero-progress-dots" style={{
          position:"absolute", bottom:32, left:"50%",
          transform:"translateX(-50%)",
          gap:6, alignItems:"center", zIndex:20,
        }}>
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setHeroIdx(i); trackSlideChange(i, '/home') }}
              style={{
                height:3, border:"none", cursor:"pointer",
                background: i === heroIdx ? C.blue : `rgba(255,255,255,0.25)`,
                width: i === heroIdx ? 28 : 8,
                transition:"width 0.35s ease, background 0.35s ease",
                padding:0,
              }}
            />
          ))}
        </div>

        {/* Top accent line */}
        <motion.div
          initial={{ scaleX:0 }} animate={{ scaleX:1 }}
          transition={{ duration:1.2, delay:0.1, ease:E }}
          style={{
            position:"absolute", top:0, left:0, right:0, height:2,
            background:`linear-gradient(90deg, ${C.blue}, ${C.blue}55 60%, transparent)`,
            transformOrigin:"left", zIndex:30,
          }}
        />
      </section>

      {/* ══ STATS ══ */}
      <motion.div
        className="stats-band"
        initial={{ opacity:0 }} whileInView={{ opacity:1 }}
        viewport={{ once:true }} transition={{ duration:0.6 }}
      >
        {[
          { n:"12+",  l:"Projecten"    },
          { n:"2+",   l:"Jaar Ervaring"},
          { n:"100%", l:"Passie"       },
        ].map((s, i) => (
          <div key={i} className="stat-cell">
            <div className="stat-num">{s.n}</div>
            <div className="stat-lbl">{s.l}</div>
          </div>
        ))}
      </motion.div>


      {/* ══ CAROUSEL — Geselecteerd Werk ══ */}
      <section id="werk" style={{
        padding:"72px 0 80px",
        borderTop:`1px solid ${C.border}`,
        background:C.bg, transition:"background 0.4s",
        overflow:"hidden",
      }}>
        <motion.div
          className="section-label section-h-pad"
          initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.5 }}
          style={{ marginBottom:44 }}
        >
          01 — Geselecteerd Werk
        </motion.div>

        <div style={{ overflow:"hidden" }}>
          <div className="carousel-track">
            {[...PROJECTS, ...PROJECTS, ...PROJECTS, ...PROJECTS].map((p, i) => (
              <CarouselCard key={i} project={p} C={C} />
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ══ */}
      <section
        id="contact-section"
        style={{
          background: "#1A1AFF",
          padding: "clamp(80px,12vw,160px) clamp(24px,6vw,96px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          gap: "clamp(28px,3.5vw,44px)",
        }}
      >
        <motion.h2
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.8 }}
          style={{
            fontFamily:"'Anton',Impact,sans-serif",
            fontSize:"clamp(52px,9vw,120px)",
            textTransform:"uppercase", lineHeight:0.9,
            letterSpacing:"0.01em", color:"#fff",
            margin: 0,
          }}
        >
          Laten we<br />samenwerken.
        </motion.h2>

        <motion.p
          initial={{ opacity:0 }} whileInView={{ opacity:1 }}
          viewport={{ once:true }} transition={{ duration:0.6, delay:0.2 }}
          style={{
            fontFamily:"Inter,sans-serif", fontWeight:300,
            fontSize:"clamp(16px,1.4vw,20px)", lineHeight:1.8,
            color:"rgba(255,255,255,0.65)", maxWidth:"42ch", margin: 0,
          }}
        >
          Een nieuw project, een vraag of gewoon kennismaken?
          Stuur een bericht en ik kom zo snel mogelijk bij je terug.
        </motion.p>

        <motion.div
          initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
          viewport={{ once:true }} transition={{ duration:0.5, delay:0.25 }}
        >
          <Link
            ref={contactBtnRef}
            href="/contact"
            className="contact-cta"
            onClick={() => trackCTAClick('Neem contact op', '/home')}
            style={{
              display:"inline-flex", alignItems:"center", gap:12,
              backgroundColor:"#fff", color:"#1A1AFF",
              fontFamily:"Inter,sans-serif", fontSize: 14, fontWeight: 600,
              letterSpacing:"0.28em", textTransform:"uppercase",
              padding:"16px 40px", borderRadius:4, textDecoration:"none",
            }}
          >
            Neem contact op <span style={{ fontSize: 14 }}>→</span>
          </Link>
        </motion.div>

      </section>


    </div>
  )
}




