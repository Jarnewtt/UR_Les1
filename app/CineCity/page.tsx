"use client";
import { useState, useEffect, useRef } from "react";
import {
  motion, useInView,
  useMotionValue, useSpring, AnimatePresence
} from "framer-motion";

// ── TOKENS ────────────────────────────────────────────────────────────────────
const C = {
  bg:      "#07070a",
  ink:     "#F0EEF8",
  purple:  "#9333EA",
  purpleL: "#C084FC",
  purpleD: "#6B21A8",
  grey:    "#3A3A42",
  mid:     "#7A7A88",
  dim:     "#2A2A32",
} as const;

const EASE: [number,number,number,number] = [0.16, 1, 0.3, 1];

// ── DATA ──────────────────────────────────────────────────────────────────────
const DELIVERABLES = [
  { src: "/img/Mockup_affichereeks.jpg",     title: "Affichereeks",       category: "Print",      num: "01" },
  { src: "/img/Mockup_booklet.jpg",          title: "Programmaboekje",    category: "Editorial",  num: "02" },
  { src: "/img/Usb.jpg",                     title: "USB Flash Drive",    category: "Merch",      num: "03" },
  { src: "/img/Mockup_desktop.jpg",          title: "Desktop Interface",  category: "Web Design", num: "04" },
  { src: "/img/Mockup_mobile.jpg",           title: "Mobile Experience",  category: "App Design", num: "05" },
  { src: "/img/Mockup_reserveringstool.jpg", title: "Ticketing Flow",     category: "UI/UX",      num: "06" },
];

const ALL_IMAGES = [
  { src: "/img/Mockup_affiche.png", title: "Hoofdcampagne", category: "Key Visual", num: "00" },
  ...DELIVERABLES,
];

// ── CURSOR ────────────────────────────────────────────────────────────────────
function Cursor() {
  const cx = useMotionValue(-100), cy = useMotionValue(-100);
  const sx = useSpring(cx, { stiffness: 500, damping: 28 });
  const sy = useSpring(cy, { stiffness: 500, damping: 28 });
  const tx = useSpring(cx, { stiffness: 100, damping: 18 });
  const ty = useSpring(cy, { stiffness: 100, damping: 18 });
  useEffect(() => {
    const m = (e: MouseEvent) => { cx.set(e.clientX); cy.set(e.clientY); };
    window.addEventListener("mousemove", m);
    return () => window.removeEventListener("mousemove", m);
  }, [cx, cy]);
  return (
    <>
      <motion.div style={{ x: sx, y: sy, position:"fixed", top:0, left:0, zIndex:9999,
        pointerEvents:"none", width:7, height:7, borderRadius:"50%",
        background: C.purple, translateX:"-50%", translateY:"-50%" }}/>
      <motion.div style={{ x: tx, y: ty, position:"fixed", top:0, left:0, zIndex:9998,
        pointerEvents:"none", width:38, height:38, borderRadius:"50%",
        border:`1px solid ${C.purple}66`, translateX:"-50%", translateY:"-50%" }}/>
    </>
  );
}

// ── GRAIN ─────────────────────────────────────────────────────────────────────
function Grain() {
  return (
    <svg style={{ position:"fixed", inset:0, zIndex:9990, opacity:0.04,
      pointerEvents:"none", width:"100%", height:"100%" }}>
      <filter id="cc-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves={4} stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#cc-grain)"/>
    </svg>
  );
}

// ── REVEAL ────────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ overflow:"hidden", ...style }}>
      <motion.div
        initial={{ y:"108%", skewY: 3 }}
        animate={inView ? { y:0, skewY:0 } : {}}
        transition={{ duration:0.9, delay, ease: EASE }}
      >{children}</motion.div>
    </div>
  );
}

// ── DELIVERABLE CARD ──────────────────────────────────────────────────────────
function DeliverableCard({ item, index, onClick }: {
  item: typeof DELIVERABLES[0]; index: number; onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const rotX = useMotionValue(0), rotY = useMotionValue(0);
  const sx = useSpring(rotX, { stiffness: 200, damping: 22 });
  const sy = useSpring(rotY, { stiffness: 200, damping: 22 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current; if (!el) return;
    const rect = el.getBoundingClientRect();
    sy.set(((e.clientX - rect.left - rect.width/2) / rect.width) * 14);
    sx.set(-((e.clientY - rect.top - rect.height/2) / rect.height) * 10);
  };
  const onLeave = () => { rotX.set(0); rotY.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity:0, y:50 }}
      animate={inView ? { opacity:1, y:0 } : {}}
      transition={{ duration:0.75, delay: (index % 3) * 0.1, ease: EASE }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ perspective:900, cursor:"none" }}
    >
      <motion.div
        style={{ rotateX: sx, rotateY: sy, transformStyle:"preserve-3d" }}
        whileTap={{ scale:0.97 }}
      >
        <div style={{
          background: C.dim,
          border: `1px solid ${C.grey}`,
          overflow:"hidden",
          transition:"border-color 0.3s",
          position:"relative",
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = `${C.purple}88`)}
          onMouseLeave={e => (e.currentTarget.style.borderColor = C.grey)}
        >
          {/* Image */}
          <div style={{ height:240, overflow:"hidden", position:"relative" }}>
            <motion.img
              src={item.src} alt={item.title}
              style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.75 }}
              whileHover={{ scale:1.06, opacity:1 }}
              transition={{ duration:0.6 }}
            />
            {/* Number badge */}
            <div style={{
              position:"absolute", top:12, left:12,
              fontFamily:"'DM Mono', monospace",
              fontSize:9, letterSpacing:"0.2em",
              color:`${C.purpleL}88`,
              background:"rgba(0,0,0,0.6)",
              padding:"4px 8px",
              transform:"translateZ(20px)",
            }}>{item.num}</div>
          </div>

          {/* Info bar */}
          <div style={{ padding:"18px 20px",
            borderTop:`1px solid ${C.grey}`,
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div>
              <div style={{ fontSize:8, letterSpacing:"0.24em", textTransform:"uppercase",
                color: C.purple, marginBottom:5 }}>{item.category}</div>
              <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:20,
                letterSpacing:"0.06em", color: C.ink }}>{item.title}</div>
            </div>
            <motion.div
              whileHover={{ x:3, y:-3 }}
              style={{ fontSize:16, color:`${C.purpleL}66` }}>↗</motion.div>
          </div>

          {/* Purple bottom bar on hover */}
          <motion.div
            initial={{ scaleX:0 }}
            whileHover={{ scaleX:1 }}
            transition={{ duration:0.4, ease: EASE }}
            style={{ position:"absolute", bottom:0, left:0, right:0,
              height:2, background:`linear-gradient(90deg, ${C.purple}, ${C.purpleL})`,
              transformOrigin:"left" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function CineCityPage() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") setSelectedIndex(i => (i! + 1) % ALL_IMAGES.length);
      if (e.key === "ArrowLeft")  setSelectedIndex(i => (i! - 1 + ALL_IMAGES.length) % ALL_IMAGES.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex]);

  return (
    <div style={{
      minHeight:"100vh", background: C.bg, color: C.ink,
      overflowX:"hidden", cursor:"none",
      fontFamily:"'DM Mono', monospace",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { cursor:none !important; background:${C.bg}; }
        ::selection { background:${C.purple}; color:#fff; }
        ::-webkit-scrollbar { width:1px; }
        ::-webkit-scrollbar-thumb { background:${C.purple}44; }
      `}</style>

      <Cursor/>
      <Grain/>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ position:"relative", minHeight:"100vh", overflow:"hidden",
        display:"flex", flexDirection:"column", justifyContent:"flex-end",
        borderBottom:`1px solid ${C.grey}` }}>

        {/* Abstract animated background geometry */}
        <div style={{ position:"absolute", inset:0, zIndex:0 }}>
          {/* Large rotating ring */}
          <motion.div
            animate={{ rotate:360 }}
            transition={{ duration:28, repeat:Infinity, ease:"linear" }}
            style={{
              position:"absolute", top:"-18%", right:"-12%",
              width:700, height:700,
              border:`1px solid ${C.purple}18`,
              borderRadius:"50%",
            }}
          />
          <motion.div
            animate={{ rotate:-360 }}
            transition={{ duration:40, repeat:Infinity, ease:"linear" }}
            style={{
              position:"absolute", top:"-8%", right:"-4%",
              width:480, height:480,
              border:`1px solid ${C.purple}28`,
              borderRadius:"50%",
            }}
          />
          {/* Pulsing purple glow orb */}
          <motion.div
            animate={{ scale:[1, 1.15, 1], opacity:[0.12, 0.22, 0.12] }}
            transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }}
            style={{
              position:"absolute", top:"10%", right:"8%",
              width:420, height:420,
              borderRadius:"50%",
              background:`radial-gradient(circle, ${C.purple} 0%, transparent 70%)`,
              filter:"blur(60px)",
            }}
          />
          {/* Diagonal line grid — cinematic frames */}
          {[0,1,2,3,4].map(i => (
            <motion.div
              key={i}
              initial={{ scaleY:0 }}
              animate={{ scaleY:1 }}
              transition={{ duration:1.4, delay:0.3+i*0.12, ease:EASE }}
              style={{
                position:"absolute", top:0, bottom:0,
                left:`${10 + i*20}%`, width:1,
                background:`linear-gradient(to bottom, transparent, ${C.purple}${i===2?"18":"0A"} 40%, ${C.purple}${i===2?"18":"0A"} 60%, transparent)`,
                transformOrigin:"top",
              }}
            />
          ))}
          {/* Bottom gradient fade to bg */}
          <div style={{ position:"absolute", inset:0,
            background:`linear-gradient(to top, ${C.bg} 0%, ${C.bg}CC 18%, transparent 55%)` }}/>
        </div>

        {/* Decorative left vertical line */}
        <motion.div
          initial={{ scaleY:0 }}
          animate={{ scaleY:1 }}
          transition={{ duration:1.3, delay:0.5, ease:EASE }}
          style={{
            position:"absolute", left:28, top:"8%", bottom:"14%", width:1,
            background:`linear-gradient(to bottom, transparent, ${C.purple}55 30%, ${C.purple}55 70%, transparent)`,
            transformOrigin:"top", zIndex:2,
          }}
        />

        {/* Top metadata */}
        <motion.div
          initial={{ opacity:0, y:-10 }}
          animate={{ opacity:1, y:0 }}
          transition={{ delay:1.8, duration:0.8 }}
          style={{
            position:"absolute", top:52, right:60, textAlign:"right",
            fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase",
            color:C.mid, lineHeight:2.8, zIndex:10,
          }}
        >
          <div>Antwerpen — Filmfestival</div>
          <div>Visual Identity</div>
          <div style={{ color:C.purple }}>CineCity 2025</div>
        </motion.div>

        {/* Hero content — full width typographic */}
        <div style={{ position:"relative", zIndex:5, padding:"0 60px 64px" }}>

          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ delay:0.25, duration:1 }}
            style={{ fontSize:9, letterSpacing:"0.36em", textTransform:"uppercase",
              color:C.mid, marginBottom:28,
              display:"flex", alignItems:"center", gap:14 }}
          >
            <span style={{ width:22, height:1, background:`${C.purple}88`, display:"inline-block" }}/>
            Visual Identity — Coming of Age
          </motion.div>

          {/* Giant title with split layout */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", alignItems:"flex-end", gap:0 }}>
            <div>
              <div style={{ overflow:"hidden" }}>
                <motion.h1
                  initial={{ y:"110%", skewY:5 }}
                  animate={{ y:0, skewY:0 }}
                  transition={{ duration:1.1, delay:0.4, ease:EASE }}
                  style={{
                    fontFamily:"'Bebas Neue', sans-serif",
                    fontSize:"clamp(90px, 17vw, 240px)",
                    lineHeight:0.82, letterSpacing:"0.01em",
                    color:C.ink,
                  }}
                >Cine</motion.h1>
              </div>
              <div style={{ overflow:"hidden" }}>
                <motion.h1
                  initial={{ y:"110%", skewY:5 }}
                  animate={{ y:0, skewY:0 }}
                  transition={{ duration:1.1, delay:0.55, ease:EASE }}
                  style={{
                    fontFamily:"'Bebas Neue', sans-serif",
                    fontSize:"clamp(90px, 17vw, 240px)",
                    lineHeight:0.82, letterSpacing:"0.01em",
                    WebkitTextStroke:`2px ${C.purple}`,
                    color:"transparent",
                  }}
                >City</motion.h1>
              </div>
            </div>
          </div>

          {/* Bottom strip */}
          <motion.div
            initial={{ opacity:0, y:16 }}
            animate={{ opacity:1, y:0 }}
            transition={{ delay:1.5, duration:0.9 }}
            style={{
              marginTop:48,
              borderTop:`1px solid ${C.dim}`,
              paddingTop:28,
              display:"flex", alignItems:"center",
              justifyContent:"flex-end", gap:20,
            }}
          >
            <motion.a
              href="#work"
              whileHover={{ borderColor:C.purple, color:C.ink, background:`${C.purple}18` }}
              whileTap={{ scale:0.97 }}
              style={{
                display:"inline-flex", alignItems:"center", gap:12,
                border:`1px solid ${C.dim}`,
                color:C.mid, fontSize:9,
                letterSpacing:"0.22em", textTransform:"uppercase",
                padding:"14px 28px", transition:"all 0.3s",
                textDecoration:"none",
              }}
            >
              Bekijk deliverables
              <motion.span animate={{ y:[0,5,0] }} transition={{ duration:1.8, repeat:Infinity }}>↓</motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── CONCEPT ─────────────────────────────────────────────────────────── */}
      <section style={{ padding:"96px 60px",
        borderBottom:`1px solid ${C.dim}`,
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:80, alignItems:"start" }}>
        <div>
          <Reveal>
            <div style={{ fontSize:9, letterSpacing:"0.32em", textTransform:"uppercase",
              color: C.purple, marginBottom:20,
              display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ width:18, height:1, background: C.purple, display:"inline-block" }}/>
              De Uitdaging
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 style={{ fontFamily:"'Bebas Neue', sans-serif",
              fontSize:"clamp(32px,4.5vw,64px)",
              letterSpacing:"0.04em", lineHeight:0.92,
              color: C.ink }}>
              Groei zonder<br/>
              <span style={{ WebkitTextStroke:`1.5px ${C.purple}`, color:"transparent" }}>
                clichés
              </span>
            </h2>
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity:0, x:30 }}
          whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true, margin:"-60px" }}
          transition={{ duration:0.9, delay:0.2, ease: EASE }}
        >
          <p style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:300,
            fontSize:15, lineHeight:1.95, color:`${C.ink}88`, marginBottom:28 }}>
            Hoe visualiseer je <span style={{ color: C.purpleL }}>groei en identiteit</span> zonder letterlijke filmscènes te gebruiken?
            Het doel: een systeem dat herkenbaar is, maar flexibel genoeg voor diverse media.
          </p>
          <p style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:300,
            fontSize:15, lineHeight:1.95, color:`${C.ink}55` }}>
            De visuele stijl weerspiegelt de rauwe, stedelijke energie van Antwerpen — en nodigt uit tot nieuwsgierigheid.
          </p>

          {/* Stats */}
          <div style={{ marginTop:48, display:"grid", gridTemplateColumns:"repeat(3,1fr)",
            gap:1, background: C.dim }}>
            {[["06","Deliverables"],["01","Festival"],["∞","Mogelijkheden"]].map(([n,l], i) => (
              <div key={i} style={{ background: C.bg, padding:"24px 20px",
                borderLeft: i===0 ? `3px solid ${C.purple}` : "none" }}>
                <div style={{ fontFamily:"'Bebas Neue', sans-serif",
                  fontSize:36, color: C.purple, lineHeight:1 }}>{n}</div>
                <div style={{ fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase",
                  color: C.mid, marginTop:6 }}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── DELIVERABLES ────────────────────────────────────────────────────── */}
      <section id="work" style={{ padding:"96px 60px",
        borderBottom:`1px solid ${C.dim}` }}>

        <motion.div
          initial={{ opacity:0 }}
          whileInView={{ opacity:1 }}
          viewport={{ once:true }}
          style={{ display:"flex", alignItems:"baseline",
            justifyContent:"space-between", marginBottom:56 }}
        >
          <div style={{ display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ width:24, height:1, background: C.purple, display:"inline-block" }}/>
            <span style={{ fontSize:9, letterSpacing:"0.28em", textTransform:"uppercase",
              color: C.mid }}>Deliverables</span>
          </div>
          <span style={{ fontSize:9, color:`${C.mid}88`, letterSpacing:"0.12em" }}>
            {DELIVERABLES.length} werken
          </span>
        </motion.div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:2 }}>
          {DELIVERABLES.map((item, i) => (
            <DeliverableCard
              key={i} item={item} index={i}
              onClick={() => setSelectedIndex(i + 1)}
            />
          ))}
        </div>
      </section>

      {/* ── LIGHTBOX ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.3 }}
            onClick={() => setSelectedIndex(null)}
            style={{
              position:"fixed", inset:0, zIndex:9000,
              background:"rgba(7,7,10,0.97)",
              backdropFilter:"blur(12px)",
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:48, cursor:"none",
            }}
          >
            {/* Prev */}
            <button
              onClick={e => { e.stopPropagation();
                setSelectedIndex(i => (i! - 1 + ALL_IMAGES.length) % ALL_IMAGES.length); }}
              style={{ position:"absolute", left:32, background:"none", border:"none",
                color:`${C.ink}44`, fontSize:28, cursor:"none", padding:16,
                transition:"color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.purpleL)}
              onMouseLeave={e => (e.currentTarget.style.color = `${C.ink}44`)}
            >←</button>

            <motion.div
              key={selectedIndex}
              initial={{ opacity:0, scale:0.94, y:12 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.96 }}
              transition={{ duration:0.4, ease: EASE }}
              onClick={e => e.stopPropagation()}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}
            >
              <img
                src={ALL_IMAGES[selectedIndex].src}
                alt={ALL_IMAGES[selectedIndex].title}
                style={{ maxHeight:"76vh", maxWidth:"100%", objectFit:"contain",
                  boxShadow:`0 40px 120px rgba(0,0,0,0.9), 0 0 60px ${C.purple}22`,
                  border:`1px solid ${C.purple}22` }}
              />
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:8, letterSpacing:"0.26em", textTransform:"uppercase",
                  color: C.purple, marginBottom:6 }}>
                  {ALL_IMAGES[selectedIndex].category}
                </div>
                <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:24,
                  letterSpacing:"0.08em", color: C.ink }}>
                  {ALL_IMAGES[selectedIndex].title}
                </div>
              </div>
            </motion.div>

            {/* Next */}
            <button
              onClick={e => { e.stopPropagation();
                setSelectedIndex(i => (i! + 1) % ALL_IMAGES.length); }}
              style={{ position:"absolute", right:32, background:"none", border:"none",
                color:`${C.ink}44`, fontSize:28, cursor:"none", padding:16,
                transition:"color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.purpleL)}
              onMouseLeave={e => (e.currentTarget.style.color = `${C.ink}44`)}
            >→</button>

            {/* Counter + close */}
            <div style={{ position:"absolute", top:28, right:36,
              display:"flex", alignItems:"center", gap:24 }}>
              <span style={{ fontSize:9, letterSpacing:"0.2em",
                color:`${C.ink}44`, textTransform:"uppercase" }}>
                {String(selectedIndex+1).padStart(2,"0")} / {String(ALL_IMAGES.length).padStart(2,"0")}
              </span>
              <button
                onClick={() => setSelectedIndex(null)}
                style={{ background:"none", border:`1px solid ${C.dim}`,
                  color:`${C.ink}55`, fontSize:9, letterSpacing:"0.24em",
                  textTransform:"uppercase", padding:"8px 16px", cursor:"none",
                  transition:"all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = C.purple;
                  e.currentTarget.style.color = C.purpleL; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = C.dim;
                  e.currentTarget.style.color = `${C.ink}55`; }}
              >Sluiten [ESC]</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}