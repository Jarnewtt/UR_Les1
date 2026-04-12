"use client";
import { useState, useEffect, useRef } from "react";
import {
  motion, useInView, AnimatePresence,
  useMotionValue, useSpring,
} from "framer-motion";

// ── TOKENS ────────────────────────────────────────────────────────────────────
type Tokens = {
  bg: string; surface: string;
  ink: string; inkDim: string;
  gold: string; goldL: string;
  line: string; lineSub: string;
  isLight: boolean;
}
const DARK: Tokens = {
  bg:      "#0C0A09",
  surface: "#141210",
  ink:     "#EDE8DC",
  inkDim:  "#7A6A58",
  gold:    "#C49A3C",
  goldL:   "#E2B96A",
  line:    "#2A2218",
  lineSub: "#1A1610",
  isLight: false,
}
const LIGHT: Tokens = {
  bg:      "#FAF7F2",
  surface: "#F2EAE0",
  ink:     "#1C1208",
  inkDim:  "#5A4838",
  gold:    "#9A6A20",
  goldL:   "#C49A3C",
  line:    "#D8CCBC",
  lineSub: "#EDE4D8",
  isLight: true,
}
function useIndustrialChocTheme(): Tokens {
  const [isDark, setIsDark] = useState(true);
  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("theme-light"));
    const h = (e: Event) => setIsDark((e as CustomEvent).detail.isDark);
    window.addEventListener("theme-change", h);
    return () => window.removeEventListener("theme-change", h);
  }, []);
  return isDark ? DARK : LIGHT;
}
const EASE: [number,number,number,number] = [0.16,1,0.3,1];
const EASE_OUT: [number,number,number,number] = [0.22,1,0.36,1];

// ── DATA ──────────────────────────────────────────────────────────────────────
const DELIVERABLES = [
  { src:"/img/2526_BDL3_PACK_H1_WaterschootJ.jpg", title:"Praline Doos",    category:"Packaging", num:"01" },
  { src:"/img/2526_BLD3_PACK_H7_WaterschootJ.jpg", title:"Luxe Verpakking", category:"Finish",    num:"02" },
  { src:"/img/2526_BDL3_PACK_H6_WaterschootJ.jpg", title:"Tin Collectie",   category:"Premium",   num:"03" },
  { src:"/img/2526_BDL3_PACK_H2_WaterschootJ.jpg", title:"Gift Sleeve",     category:"Luxe",      num:"04" },
  { src:"/img/2526_BDL3_PACK_H3_WaterschootJ.jpg", title:"Chocolade Zak",   category:"Retail",    num:"05" },
  { src:"/img/2526_BDL3_PACK_H5_WaterschootJ.jpg", title:"Label Design",    category:"Branding",  num:"06" },
];
const ALL_IMAGES = [
  { src:"/img/2526_BDL3_PACK_H4_WaterschootJ.jpg", title:"Campagnebeeld", category:"Key Visual", num:"00" },
  ...DELIVERABLES,
];

// ── GRAIN ─────────────────────────────────────────────────────────────────────
function Grain({ T }: { T: Tokens }) {
  return (
    <svg style={{ position:"fixed", inset:0, zIndex:9990, pointerEvents:"none",
      width:"100%", height:"100%", opacity: T.isLight ? 0.015 : 0.035 }}>
      <filter id="choc-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={4} stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#choc-grain)"/>
    </svg>
  );
}

// ── MASK REVEAL ───────────────────────────────────────────────────────────────
function MaskReveal({ children, delay=0, style={} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true, margin:"-6%" });
  return (
    <div ref={ref} style={{ overflow:"hidden", ...style }}>
      <motion.div
        initial={{ y:"105%" }}
        animate={inView ? { y:"0%" } : {}}
        transition={{ duration:1, delay, ease:EASE_OUT }}
      >{children}</motion.div>
    </div>
  );
}

// ── DIVIDER LINE ──────────────────────────────────────────────────────────────
function GoldLine({ T, delay=0 }: { T: Tokens; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once:true });
  return (
    <div ref={ref} style={{ overflow:"hidden" }}>
      <motion.div
        initial={{ scaleX:0 }} animate={inView ? { scaleX:1 } : {}}
        transition={{ duration:1.2, delay, ease:EASE_OUT }}
        style={{ height:1, background:`linear-gradient(to right, ${T.gold}88, ${T.gold}22, transparent)`,
                 transformOrigin:"left" }}/>
    </div>
  );
}

// ── CAROUSEL ─────────────────────────────────────────────────────────────────
function DeliverableCarousel({ images, T }: {
  images: typeof DELIVERABLES; T: Tokens;
}) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const goTo = (next: number, dir: number) => { setDirection(dir); setCurrent(next); };
  const goNext = () => goTo((current + 1) % images.length, 1);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(goNext, 4500);
    return () => clearTimeout(t);
  }, [current, paused]);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness:120, damping:22 });
  const sRotY = useSpring(rotY, { stiffness:120, damping:22 });

  const onMainMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rotX.set(-((e.clientY - r.top) / r.height - 0.5) * 4);
    rotY.set(((e.clientX - r.left) / r.width - 0.5) * 4);
  };
  const onMainLeave = () => { rotX.set(0); rotY.set(0); setPaused(false); };

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0 },
    exit:  (d: number) => ({ opacity: 0, x: d > 0 ? -48 : 48 }),
  };

  return (
    <div style={{ userSelect:"none" }}>

      {/* ── Image stage ── */}
      <motion.div
        onMouseMove={onMainMove}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={onMainLeave}
        style={{ position:"relative",
          padding:"0 clamp(0px,6vw,100px)",
          background:T.surface,
          rotateX:sRotX, rotateY:sRotY,
          transformStyle:"preserve-3d", perspective:1400,
          transition:"background 0.45s ease",
          boxShadow: T.isLight
            ? "0 20px 60px rgba(0,0,0,0.07)"
            : "0 20px 80px rgba(0,0,0,0.45)" }}>

        <AnimatePresence custom={direction} mode="wait">
          <motion.div key={current}
            custom={direction} variants={variants}
            initial="enter" animate="center" exit="exit"
            transition={{ duration:0.55, ease:EASE_OUT }}>
            <img src={images[current].src} alt=""
              style={{ width:"100%", height:"auto", display:"block",
                maxHeight:"78vh", objectFit:"contain", margin:"0 auto" }}/>
          </motion.div>
        </AnimatePresence>

        {/* Gold shimmer */}
        <AnimatePresence>
          <motion.div key={`shimmer-${current}`}
            initial={{ x:"-110%", opacity:0 }}
            animate={{ x:"210%", opacity:[0, 0.35, 0] }}
            transition={{ duration:0.7, ease:"easeOut" }}
            style={{ position:"absolute", inset:0, zIndex:4, pointerEvents:"none",
              width:"40%",
              background:`linear-gradient(105deg, transparent 0%, ${T.gold}44 50%, transparent 100%)` }}/>
        </AnimatePresence>

        {/* Large italic number — decorative corner */}
        <AnimatePresence mode="wait">
          <motion.span key={`num-${current}`}
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.5 }}
            style={{ position:"absolute", bottom:"clamp(12px,2vw,24px)",
              left:"clamp(8px,7vw,108px)", zIndex:5, pointerEvents:"none",
              fontFamily:"'Playfair Display',serif", fontStyle:"italic",
              fontSize:"clamp(40px,6vw,80px)", fontWeight:400, lineHeight:1,
              color:`${T.gold}30` }}>
            {images[current].num}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* ── Progress bar ── */}
      <div style={{ height:2, background:T.line, overflow:"hidden",
        transition:"background 0.45s ease" }}>
        <motion.div key={`${current}-${paused}`}
          initial={{ scaleX:0 }}
          animate={{ scaleX: paused ? 0 : 1 }}
          transition={{ duration: paused ? 0 : 4.5, ease:"linear" }}
          style={{ height:"100%",
            background:`linear-gradient(to right, ${T.gold}, ${T.goldL})`,
            transformOrigin:"left" }}/>
      </div>

      {/* ── Meta bar ── */}
      <div style={{ padding:"clamp(16px,2.5vw,28px) clamp(16px,5vw,80px)",
        display:"flex", alignItems:"center", gap:16,
        borderBottom:`1px solid ${T.line}`, transition:"border-color 0.45s ease" }}>

        <AnimatePresence mode="wait">
          <motion.span key={`label-${current}`}
            initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-5 }}
            transition={{ duration:0.3, ease:EASE_OUT }}
            style={{ fontFamily:"'Playfair Display',serif", fontStyle:"italic",
              fontSize:"clamp(13px,1.3vw,16px)", color:T.gold, minWidth:32 }}>
            {images[current].num}
          </motion.span>
        </AnimatePresence>

        <div style={{ width:1, height:12, background:`${T.gold}40`, flexShrink:0 }}/>

        <div style={{ flex:1, height:1,
          background:`linear-gradient(to right, ${T.gold}22, transparent)` }}/>

        <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8,
          letterSpacing:"0.28em", textTransform:"uppercase",
          color:T.inkDim, flexShrink:0 }}>
          {String(current+1).padStart(2,"0")} — {String(images.length).padStart(2,"0")}
        </span>
      </div>

      {/* ── Thumbnail grid ── */}
      <div style={{ padding:"clamp(12px,2vw,24px) clamp(16px,5vw,80px) clamp(24px,4vw,48px)" }}>
        <div className="choc-thumbs">
          {images.map((img, i) => (
            <motion.div key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              whileHover={{ opacity:1 }}
              style={{ cursor:"pointer", overflow:"hidden", aspectRatio:"2/3",
                opacity: i===current ? 1 : 0.32,
                outline: i===current ? `1px solid ${T.gold}` : `1px solid ${T.line}`,
                outlineOffset: i===current ? 3 : 0,
                transition:"outline 0.35s ease, opacity 0.35s ease, outline-offset 0.35s ease" }}>
              <motion.img src={img.src} alt=""
                style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }}
                whileHover={{ scale:1.08 }}
                transition={{ duration:0.5, ease:EASE_OUT }}/>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function ChocolatePageIndustrial() {
  const T = useIndustrialChocTheme();
  const [selectedIndex, setSelectedIndex] = useState<number|null>(null);
  const TT = "background 0.45s ease, color 0.45s ease, border-color 0.45s ease";

useEffect(() => {
    const h = (e:KeyboardEvent) => {
      if (selectedIndex===null) return;
      if (e.key==="Escape") setSelectedIndex(null);
      if (e.key==="ArrowRight") setSelectedIndex(i=>(i!+1)%ALL_IMAGES.length);
      if (e.key==="ArrowLeft") setSelectedIndex(i=>(i!-1+ALL_IMAGES.length)%ALL_IMAGES.length);
    };
    window.addEventListener("keydown",h);
    return ()=>window.removeEventListener("keydown",h);
  }, [selectedIndex]);

  return (
    <div style={{ minHeight:"100vh", background:T.bg, color:T.ink,
      overflowX:"clip", cursor:"none", fontFamily:"'DM Mono',monospace", transition:TT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;1,300&family=Playfair+Display:ital,wght@0,400;0,500;1,400&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { cursor:none !important; }
        ::selection { background:${T.gold}55; color:${T.ink}; }
        ::-webkit-scrollbar { width:1px; }
        ::-webkit-scrollbar-thumb { background:${T.gold}33; }

        .choc-hero-grid {
          display:grid;
          grid-template-columns:1fr;
          align-items:flex-end;
        }
        @media (min-width:640px) {
          .choc-hero-grid { grid-template-columns:auto 1fr; gap:clamp(12px,2vw,32px); }
        }

        .choc-meta { display:none; }
        @media (min-width:900px) { .choc-meta { display:block; } }

.choc-concept-split {
          display:grid;
          grid-template-columns:1fr;
          gap:clamp(40px,6vw,80px);
          align-items:start;
        }
        @media (min-width:900px) {
          .choc-concept-split { grid-template-columns:5fr 4fr; }
        }

        .choc-thumbs {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:clamp(4px,0.6vw,8px);
        }
        @media (min-width:640px) {
          .choc-thumbs { grid-template-columns:repeat(6,1fr); }
        }

      `}</style>

      <Grain T={T}/>

      {/* ────────────────────────────────── HERO ── */}
      <section style={{ position:"relative", minHeight:"100svh", overflow:"hidden",
        display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center",
        borderBottom:`1px solid ${T.line}`, transition:TT }}>

        {/* Background image + overlay */}
        <div style={{ position:"absolute", inset:0, zIndex:0 }}>
          <img src="/img/2526_BDL3_PACK_H4_WaterschootJ.jpg" alt=""
            style={{ width:"100%", height:"100%", objectFit:"cover", transform:"scale(1.05)" }}/>
          <div style={{ position:"absolute", inset:0,
            background: T.isLight
              ? `linear-gradient(to bottom, rgba(12,8,4,0.68) 0%, rgba(12,8,4,0.62) 60%, rgba(12,8,4,0.45) 78%, ${T.bg} 100%)`
              : `linear-gradient(to bottom, rgba(12,10,9,0.7) 0%, rgba(12,10,9,0.5) 50%, ${T.bg} 100%)`,
            transition:TT }}/>
        </div>

        {/* Decorative circles */}
        <div style={{ position:"absolute", inset:0, zIndex:1, pointerEvents:"none" }}>
          <motion.div animate={{ rotate:360 }} transition={{ duration:90, repeat:Infinity, ease:"linear" }}
            style={{ position:"absolute", top:"-18%", right:"-12%",
              width:"clamp(280px,48vw,580px)", height:"clamp(280px,48vw,580px)",
              border:`1px dashed ${T.gold}18`, borderRadius:"50%" }}/>
          <motion.div animate={{ rotate:-360 }} transition={{ duration:60, repeat:Infinity, ease:"linear" }}
            style={{ position:"absolute", top:"-8%", right:"-5%",
              width:"clamp(180px,32vw,380px)", height:"clamp(180px,32vw,380px)",
              border:`1px solid ${T.gold}22`, borderRadius:"50%" }}/>
        </div>

        {/* Centered content */}
        <div style={{ position:"relative", zIndex:5, textAlign:"center",
          padding:"clamp(80px,12vw,140px) clamp(24px,6vw,80px) clamp(32px,5vw,64px)",
          display:"flex", flexDirection:"column", alignItems:"center", gap:28, maxWidth:900, margin:"0 auto" }}>

          {/* Badge */}
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.2, duration:0.8 }}>
            <span style={{ padding:"10px 32px",
              border:`1px solid ${T.gold}55`, borderRadius:999,
              fontSize:10, letterSpacing:"0.28em", textTransform:"uppercase",
              color:"#fde68a", background:"rgba(12,8,4,0.35)",
              backdropFilter:"blur(8px)" }}>
              BELvue Museum • Verpakking
            </span>
          </motion.div>

          {/* Title */}
          <div style={{ overflow:"hidden" }}>
            <motion.h1 initial={{ y:"100%" }} animate={{ y:0 }}
              transition={{ duration:1.1, delay:0.35, ease:EASE }}
              style={{ fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(52px,10vw,128px)", fontWeight:500,
                lineHeight:1, letterSpacing:"-0.02em", color:"#fef3c7",
                margin:0 }}>
              <em style={{ color:T.gold, fontStyle:"italic" }}>C</em> for chocolate
            </motion.h1>
          </div>

          {/* Subtitle */}
          <motion.p initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.7, duration:0.9 }}
            style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
              fontSize:"clamp(15px,1.8vw,19px)", lineHeight:1.75,
              color:"#e8d5b0", maxWidth:580 }}>
            Een exclusieve pralinelijn waar Brusselse Art Deco en culinaire luxe samenkomen.
          </motion.p>

          {/* CTA */}
          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:1, duration:0.8 }}>
            <motion.a href="#choc-inspiratie"
              whileHover={{ borderColor:T.gold, color:"#fef3c7",
                backgroundColor:`${T.gold}18` }}
              style={{ display:"inline-flex", alignItems:"center", gap:10,
                border:`1px solid rgba(232,213,176,0.45)`, color:"#e8d5b0",
                fontFamily:"'DM Mono',monospace", fontSize:9,
                letterSpacing:"0.24em", textTransform:"uppercase",
                padding:"14px 32px", transition:"all 0.3s", textDecoration:"none" }}>
              Ontdek het verhaal
              <motion.span animate={{ y:[0,4,0] }} transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }}>↓</motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ──────────────────────────── DE INSPIRATIE ── */}
      <section id="choc-inspiratie" style={{ borderBottom:`1px solid ${T.line}`, transition:TT,
        padding:"clamp(64px,10vw,128px) clamp(24px,5vw,72px)" }}>
        <div style={{ maxWidth:1120, margin:"0 auto" }}>
          <div className="choc-concept-split">

            {/* Left: text */}
            <div>
              <MaskReveal>
                <div style={{ fontSize:8, letterSpacing:"0.36em", textTransform:"uppercase",
                  color:T.gold, marginBottom:28,
                  display:"flex", alignItems:"center", gap:14 }}>
                  <span style={{ width:18, height:"1px", background:T.gold, display:"inline-block" }}/>
                  De Inspiratie
                </div>
              </MaskReveal>

              <MaskReveal delay={0.1}>
                <h2 style={{ fontFamily:"'Playfair Display',serif",
                  fontSize:"clamp(32px,4.5vw,64px)", lineHeight:1.1,
                  fontWeight:500, color:T.ink, transition:TT }}>
                  Drie dozen,<br/>
                  <em style={{ fontStyle:"italic", color:T.gold }}>één verhaal</em>
                </h2>
              </MaskReveal>

              <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }}
                viewport={{ once:true, margin:"-60px" }} transition={{ duration:1, delay:0.3 }}
                style={{ marginTop:32 }}>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                  fontSize:15, lineHeight:1.95,
                  color: T.isLight ? T.ink : `${T.ink}88`,
                  marginBottom:16, maxWidth:520, transition:TT }}>
                  Een verpakkingsreeks van{" "}
                  <em style={{ color:T.goldL, fontStyle:"italic" }}>drie exclusieve pralinedozen</em>{" "}
                  voor het BELvue Museum. Elk stuk draagt een eigen patroon, maar samen vormen
                  ze een samenhangend geheel, schaalbaar over 4, 6 en 8 pralines.
                </p>
                <p style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:300,
                  fontSize:15, lineHeight:1.95,
                  color: T.isLight ? T.inkDim : `${T.ink}55`,
                  maxWidth:520, transition:TT }}>
                  Doelgroep: kapitaalkrachtige early adopters met een sterke affiniteit
                  voor kunst en cultuur. Een merk dat zich onderscheidt van de middenmoot,
                  upperclass en tijdloos.
                </p>
              </motion.div>

              <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }}
                viewport={{ once:true }} transition={{ delay:0.5, duration:0.8 }}
                style={{ display:"flex", alignItems:"center", gap:16,
                  marginTop:36, paddingTop:8 }}>
                <div style={{ height:1, flex:1,
                  background:`linear-gradient(to right, ${T.gold}55, transparent)` }}/>
                <span style={{ fontFamily:"'Playfair Display',serif",
                  fontStyle:"italic", fontSize:14, color:T.gold }}>
                  Est. 2026
                </span>
              </motion.div>
            </div>

            {/* Right: image */}
            <motion.div
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, margin:"-60px" }} transition={{ duration:0.9, delay:0.25 }}
              style={{ position:"relative", overflow:"hidden",
                borderRadius:4, boxShadow:`0 0 0 1px ${T.line}` }}>
              <img src="/img/2526_BDL3_PACK_H4_WaterschootJ.jpg" alt="Campagnebeeld"
                style={{ width:"100%", height:"100%", objectFit:"cover",
                  display:"block", transition:"transform 0.7s ease" }}
                className="choc-concept-img"/>
            </motion.div>

          </div>
        </div>
      </section>


      {/* ────────────────────────── DELIVERABLES ── */}
      <section id="choc-work" style={{ transition:TT }}>

        {/* Header */}
        <div style={{ padding:"clamp(56px,8vw,100px) clamp(24px,5vw,80px) clamp(28px,4vw,48px)",
          borderBottom:`1px solid ${T.line}`, transition:TT,
          display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:16 }}>

          <div>
            <MaskReveal>
              <div style={{ fontSize:8, letterSpacing:"0.36em", textTransform:"uppercase",
                color:T.gold, marginBottom:20,
                display:"flex", alignItems:"center", gap:14 }}>
                <span style={{ width:18, height:"1px", background:T.gold, display:"inline-block" }}/>
                Grafische uitwerking
              </div>
            </MaskReveal>
            <MaskReveal delay={0.1}>
              <h2 style={{ fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(32px,5vw,64px)", fontWeight:500, letterSpacing:"-0.01em",
                lineHeight:1, color:T.ink, transition:TT, margin:0 }}>
                Ontwerpen
              </h2>
            </MaskReveal>
          </div>

          <div className="choc-meta">
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8,
              letterSpacing:"0.28em", textTransform:"uppercase", color:T.inkDim }}>
              06 stuks
            </span>
          </div>
        </div>

        <DeliverableCarousel
          images={DELIVERABLES}
          T={T}/>
      </section>

      {/* ────────────────────────────── LIGHTBOX ── */}
      <AnimatePresence>
        {selectedIndex!==null && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.3 }}
            onClick={() => setSelectedIndex(null)}
            style={{ position:"fixed", inset:0, zIndex:9000,
              background: T.isLight ? "rgba(250,247,242,0.97)" : "rgba(12,10,9,0.97)",
              backdropFilter:"blur(16px)",
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:"clamp(24px,4vw,64px)", cursor:"none" }}>

            <button
              onClick={e=>{e.stopPropagation();setSelectedIndex(i=>(i!-1+ALL_IMAGES.length)%ALL_IMAGES.length);}}
              style={{ position:"absolute", left:"clamp(12px,3vw,40px)",
                background:"none", border:`1px solid ${T.line}`,
                color:T.inkDim, fontSize:18, cursor:"none", padding:"12px 18px",
                transition:"all 0.25s", fontFamily:"'DM Mono',monospace" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.color=T.gold;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.line;e.currentTarget.style.color=T.inkDim;}}>
              ←
            </button>

            <motion.div key={selectedIndex}
              initial={{ opacity:0, scale:0.95, y:10 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.97 }}
              transition={{ duration:0.4, ease:EASE }}
              onClick={e=>e.stopPropagation()}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20,
                maxWidth:"90vw" }}>
              <img src={ALL_IMAGES[selectedIndex].src} alt={ALL_IMAGES[selectedIndex].title}
                style={{ maxHeight:"75vh", maxWidth:"100%", objectFit:"contain",
                  border:`1px solid ${T.gold}22`,
                  boxShadow: T.isLight
                    ? `0 32px 64px rgba(0,0,0,0.12), 0 0 40px ${T.gold}14`
                    : `0 40px 100px rgba(0,0,0,0.85), 0 0 50px ${T.gold}18` }}/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:8, letterSpacing:"0.28em", textTransform:"uppercase",
                  color:T.gold, marginBottom:8 }}>
                  {ALL_IMAGES[selectedIndex].category}
                </div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif",
                  fontSize:22, letterSpacing:"0.1em", color:T.ink }}>
                  {ALL_IMAGES[selectedIndex].title}
                </div>
              </div>
            </motion.div>

            <button
              onClick={e=>{e.stopPropagation();setSelectedIndex(i=>(i!+1)%ALL_IMAGES.length);}}
              style={{ position:"absolute", right:"clamp(12px,3vw,40px)",
                background:"none", border:`1px solid ${T.line}`,
                color:T.inkDim, fontSize:18, cursor:"none", padding:"12px 18px",
                transition:"all 0.25s", fontFamily:"'DM Mono',monospace" }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.color=T.gold;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=T.line;e.currentTarget.style.color=T.inkDim;}}>
              →
            </button>

            <div style={{ position:"absolute", top:24, right:"clamp(12px,3vw,40px)",
              display:"flex", alignItems:"center", gap:20 }}>
              <span style={{ fontSize:8, letterSpacing:"0.22em", textTransform:"uppercase",
                color:T.inkDim }}>
                {String(selectedIndex+1).padStart(2,"0")} / {String(ALL_IMAGES.length).padStart(2,"0")}
              </span>
              <button onClick={()=>setSelectedIndex(null)}
                style={{ background:"none", border:`1px solid ${T.line}`,
                  color:T.inkDim, fontSize:8, letterSpacing:"0.24em", textTransform:"uppercase",
                  padding:"8px 16px", cursor:"none", transition:"all 0.25s",
                  fontFamily:"'DM Mono',monospace" }}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=T.gold;e.currentTarget.style.color=T.gold;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=T.line;e.currentTarget.style.color=T.inkDim;}}>
                Sluiten [ESC]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .choc-concept-img:hover { transform:scale(1.03); }
      `}</style>
    </div>
  );
}
