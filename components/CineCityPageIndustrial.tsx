"use client";
import { useState, useEffect, useRef } from "react";
import {
  motion, useInView,
  useMotionValue, useSpring, AnimatePresence,
  useScroll, useTransform,
} from "framer-motion";

// ── TOKENS ────────────────────────────────────────────────────────────────────
type Tokens = {
  bg: string; ink: string;
  orange: string; orangeL: string;
  grey: string; mid: string; dim: string;
  isLight: boolean;
}

const DARK: Tokens = {
  bg:      "#080807",
  ink:     "#F0EDE8",
  orange:  "#9333EA",
  orangeL: "#C084FC",
  grey:    "#3A3530",
  mid:     "#6E6A64",
  dim:     "#1E1C1A",
  isLight: false,
}

const LIGHT: Tokens = {
  bg:      "#FAF8F4",
  ink:     "#0A0908",
  orange:  "#7C3AED",
  orangeL: "#9333EA",
  grey:    "#C8C4BE",
  mid:     "#5A5650",
  dim:     "#EDE8E0",
  isLight: true,
}

function useIndustrialTheme(): Tokens {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("theme-light"))
    const handler = (e: Event) => setIsDark((e as CustomEvent).detail.isDark)
    window.addEventListener("theme-change", handler)
    return () => window.removeEventListener("theme-change", handler)
  }, [])
  return isDark ? DARK : LIGHT
}

const EASE: [number,number,number,number] = [0.16, 1, 0.3, 1];
const EASE_OUT: [number,number,number,number] = [0.22, 1, 0.36, 1];

// ── DATA ──────────────────────────────────────────────────────────────────────
const DELIVERABLES = [
  { src: "/img/Mockup_affichereeks.jpg",     title: "Affichereeks",       category: "Print",      num: "01" },
  { src: "/img/Mockup_booklet.jpg",          title: "Programmaboekje",    category: "Editorial",  num: "02" },
  { src: "/img/Usb.jpg",                     title: "USB Flash Drive",    category: "Merch",      num: "03" },
  { src: "/img/Mockup_desktop.jpg",          title: "Desktop Interface",  category: "Webdesign",  num: "04" },
  { src: "/img/Mockup_mobile.jpg",           title: "Mobiele Interface",   category: "App-ontwerp",num: "05" },
  { src: "/img/Mockup_reserveringstool.jpg", title: "Ticketing Flow",     category: "UI/UX",      num: "06" },
];


// ── CURSOR ────────────────────────────────────────────────────────────────────

// ── GRAIN ─────────────────────────────────────────────────────────────────────
function Grain({ T }: { T: Tokens }) {
  return (
    <svg style={{ position:"fixed", inset:0, zIndex:9990, opacity: T.isLight ? 0.02 : 0.04,
      pointerEvents:"none", width:"100%", height:"100%" }}>
      <filter id="ind-grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={4} stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
      <rect width="100%" height="100%" filter="url(#ind-grain)"/>
    </svg>
  );
}

// ── MASK REVEAL (slide up from clip) ──────────────────────────────────────────
function MaskReveal({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <div ref={ref} style={{ overflow:"hidden", ...style }}>
      <motion.div
        initial={{ y:"105%", skewY: 2 }}
        animate={inView ? { y:"0%", skewY:0 } : {}}
        transition={{ duration:1, delay, ease: EASE_OUT }}
      >{children}</motion.div>
    </div>
  );
}

// ── DELIVERABLE ROW ────────────────────────────────────────────────────────────
function DeliverableRow({ item, index, onSelect, T }: {
  item: typeof DELIVERABLES[0]; index: number;
  onSelect: () => void; T: Tokens;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset:["start end","end start"] });
  const imgY = useTransform(scrollYProgress, [0,1], ["-10%","10%"]);
  const TT = "background 0.45s ease, color 0.45s ease";
  const isEven = index % 2 === 0;

  return (
    <div ref={ref} style={{ borderBottom:`1px solid ${T.grey}`, transition: TT, cursor:"none" }}>
      {/* Rule that draws from left */}
      <motion.div
        initial={{ scaleX:0 }}
        animate={inView ? { scaleX:1 } : {}}
        transition={{ duration:1.1, delay:0.05, ease: EASE_OUT }}
        style={{ height:1, background:T.grey, transformOrigin:"left", transition: TT }}
      />

      <div
        className="ind-del-row"
        onClick={onSelect}
        style={{ display:"grid", alignItems:"stretch", position:"relative" }}
        onMouseEnter={e => {
          const img = e.currentTarget.querySelector(".ind-del-img") as HTMLElement;
          if (img) img.style.opacity = "1";
        }}
        onMouseLeave={e => {
          const img = e.currentTarget.querySelector(".ind-del-img") as HTMLElement;
          if (img) img.style.opacity = T.isLight ? "0.95" : "0.6";
        }}
      >
        {/* ── Text side ── */}
        <div className="ind-del-text-wrap" style={{
          padding:"clamp(28px,4vw,64px) clamp(16px,5vw,60px)",
          display:"flex", flexDirection:"column", justifyContent:"space-between",
          order: isEven ? 0 : 1,
        }}>
          {/* Number + category */}
          <div style={{ display:"flex", alignItems:"flex-start",
            justifyContent:"space-between", gap:12 }}>
            <MaskReveal delay={0.1}>
              <span style={{
                fontFamily:"'Bebas Neue', sans-serif",
                fontSize:"clamp(56px,10vw,140px)",
                lineHeight:1,
                color: T.isLight ? T.orange : `${T.orange}BB`,
                letterSpacing:"-0.02em", transition: TT,
              }}>{item.num}</span>
            </MaskReveal>
            <motion.span
              initial={{ opacity:0, x:12 }}
              animate={inView ? { opacity:1, x:0 } : {}}
              transition={{ duration:0.7, delay:0.35, ease: EASE }}
              style={{
                fontFamily:"'DM Mono', monospace",
                fontSize:11, letterSpacing:"0.22em", textTransform:"uppercase",
                color: T.isLight ? T.ink : T.ink,
                background: T.isLight ? `${T.orange}18` : `${T.orange}28`,
                border:`1px solid ${T.orange}`,
                padding:"5px 12px",
                marginTop:8, flexShrink:0,
              }}
            >{item.category}</motion.span>
          </div>

          {/* Title */}
          <MaskReveal delay={0.2} style={{ marginTop:12 }}>
            <h3 style={{
              fontFamily:"'Bebas Neue', sans-serif",
              fontSize:"clamp(28px,8vw,100px)",
              letterSpacing:"0.02em", lineHeight:0.9,
              color: T.ink, transition: TT,
              fontWeight:400,
            }}>{item.title}</h3>
          </MaskReveal>

          {/* Arrow CTA */}
          <motion.div
            initial={{ opacity:0, y:8 }}
            animate={inView ? { opacity:1, y:0 } : {}}
            transition={{ duration:0.7, delay:0.45, ease: EASE }}
            style={{ marginTop:"clamp(16px,3vw,32px)",
              display:"inline-flex", alignItems:"center", gap:10,
              fontFamily:"'DM Mono', monospace", fontSize:11,
              letterSpacing:"0.22em", textTransform:"uppercase",
              color: T.isLight ? T.ink : T.ink,
              borderBottom:`1px solid ${T.orange}`,
              paddingBottom:4,
            }}
          >
            <motion.span
              animate={{ x:[0,5,0] }}
              transition={{ duration:2.2, repeat:Infinity, ease:"easeInOut" }}
              style={{ color: T.orange }}
            >→</motion.span>
            Bekijk werk
          </motion.div>
        </div>

        {/* ── Image side ── */}
        <div
          ref={imgRef}
          className="ind-del-img-wrap"
          style={{
            overflow:"hidden", position:"relative",
            minHeight:"clamp(280px,45vw,480px)",
            order: isEven ? 1 : 0,
          }}
        >
          {/* Wipe reveal: right side folds away */}
          <motion.div
            initial={{ clipPath:"inset(0 0 0 0)" }}
            animate={inView ? { clipPath:"inset(0 0 0 100%)" } : {}}
            transition={{ duration:1.1, delay:0.15, ease: EASE_OUT }}
            style={{
              position:"absolute", inset:0, zIndex:2,
              background:T.bg, transition: TT,
            }}
          />

          {/* Parallax image */}
          <motion.img
            src={item.src} alt={item.title}
            className="ind-del-img"
            style={{
              position:"absolute",
              top:"-12%", left:"-5%",
              width:"110%", height:"124%",
              objectFit:"cover",
              y: imgY,
              opacity: T.isLight ? 0.95 : 0.65,
              transition:"opacity 0.4s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ── HORIZONTAL SCROLL CARD ────────────────────────────────────────────────────
function HScrollCard({ item, index, total, scrollYProgress, T, onSelect }: {
  item: typeof DELIVERABLES[0]; index: number; total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  T: Tokens; onSelect: () => void;
}) {
  const TT = "background 0.45s ease, color 0.45s ease";
  const [hovered, setHovered] = useState(false);

  // Parallax: image drifts opposite to the pan direction
  const imgX = useTransform(
    scrollYProgress,
    [0, 1],
    ["-10%", "10%"]
  );

  return (
    <div style={{
      width: "100vw", height: "100%",
      flex: "0 0 100vw",
      display: "flex", flexDirection: "column",
      background: T.bg, transition: TT,
    }}>

      {/* ── Image zone (top, ~57% height) ── */}
      <div
        style={{
          flex: "0 0 57%", overflow: "hidden",
          position: "relative", background: T.dim,
          cursor: "pointer",
          transition: TT,
        }}
        onClick={onSelect}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.img
          src={item.src} alt={item.title}
          style={{
            position: "absolute",
            top: "-10%", left: "-5%",
            width: "110%", height: "120%",
            objectFit: "cover",
            x: imgX,
            opacity: T.isLight ? 0.96 : 0.9,
          }}
        />

        {/* Tap-to-expand badge — bottom-right of image */}
        <motion.div
          animate={{ opacity: hovered ? 1 : 0.7, scale: hovered ? 1.04 : 1 }}
          transition={{ duration: 0.2 }}
          style={{
            position: "absolute", bottom: 14, right: 12,
            fontFamily: "'DM Mono', monospace",
            fontSize: 8, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "#fff",
            background: "rgba(0,0,0,0.52)",
            backdropFilter: "blur(6px)",
            padding: "5px 10px",
            display: "flex", alignItems: "center", gap: 6,
            border: "1px solid rgba(255,255,255,0.15)",
            zIndex: 3,
          }}
        >
          ⤢ Volledig scherm
        </motion.div>

        {/* Subtle bottom vignette — only to blend edge into text zone */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 40,
          background: `linear-gradient(to bottom, transparent, ${T.dim})`,
          transition: TT, pointerEvents: "none",
        }} />
      </div>

      {/* ── Text zone (bottom, solid bg) ── */}
      <div style={{
        flex: 1,
        padding: "18px 24px 20px",
        background: T.bg, transition: TT,
        display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        borderTop: `1px solid ${T.dim}`,
      }}>
        {/* Number + category row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(40px, 11vw, 64px)", lineHeight: 1,
            letterSpacing: "-0.02em",
            color: T.isLight ? T.orange : `${T.orange}BB`,
            transition: TT,
          }}>
            {item.num}
          </span>
          <span style={{
            display: "inline-block",
            fontFamily: "'DM Mono', monospace",
            fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase",
            color: T.ink,
            background: T.isLight ? `${T.orange}18` : `${T.orange}28`,
            border: `1px solid ${T.orange}`,
            padding: "4px 10px",
            marginTop: 4, flexShrink: 0,
          }}>
            {item.category}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(26px, 11vw, 64px)",
          letterSpacing: "0.02em", lineHeight: 0.9,
          color: T.ink, fontWeight: 400, transition: TT,
          margin: "6px 0 0",
        }}>
          {item.title}
        </h3>

        {/* CTA */}
        <button
          onClick={onSelect}
          style={{
            marginTop: 12, alignSelf: "flex-start",
            display: "inline-flex", alignItems: "center", gap: 10,
            fontFamily: "'DM Mono', monospace", fontSize: 10,
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: T.ink, background: "none", border: "none",
            borderBottom: `1px solid ${T.orange}`,
            paddingBottom: 4, cursor: "pointer",
          }}
        >
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ color: T.orange }}
          >→</motion.span>
          Bekijk werk
        </button>
      </div>
    </div>
  );
}

// ── MOBILE HORIZONTAL SCROLL ──────────────────────────────────────────────────
function MobileHorizontalScroll({ T, onSelect }: { T: Tokens; onSelect: (idx: number) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Derive active dot index
  useEffect(() => {
    return scrollYProgress.on("change", v => {
      const idx = Math.min(Math.floor(v * DELIVERABLES.length), DELIVERABLES.length - 1);
      setActive(idx);
    });
  }, [scrollYProgress]);

  // Strip slides left as user scrolls down
  const stripX = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `${-(DELIVERABLES.length - 1) * 100}vw`]
  );

  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const TT = "background 0.45s ease, color 0.45s ease";

  return (
    <div ref={containerRef} style={{ height: `${DELIVERABLES.length * 100}svh` }}>
      <div style={{
        position: "sticky", top: 0,
        height: "100svh", overflow: "hidden",
        background: T.bg, transition: TT,
      }}>

        {/* Counter — top right */}
        <div style={{
          position: "absolute", top: 20, right: 20, zIndex: 20,
          fontFamily: "'DM Mono', monospace",
          fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
          color: T.mid,
        }}>
          {String(active + 1).padStart(2, "0")} / {String(DELIVERABLES.length).padStart(2, "0")}
        </div>

        {/* Scroll hint — top left, fades out after first card */}
        <motion.div
          animate={{ opacity: active === 0 ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute", top: 22, left: 20, zIndex: 20,
            fontFamily: "'DM Mono', monospace",
            fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase",
            color: T.mid,
            display: "flex", alignItems: "center", gap: 7,
          }}
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >↓</motion.span>
          Scroll
        </motion.div>

        {/* Horizontal strip */}
        <motion.div style={{
          display: "flex",
          width: `${DELIVERABLES.length * 100}vw`,
          height: "100%",
          x: stripX,
        }}>
          {DELIVERABLES.map((item, i) => (
            <HScrollCard
              key={i}
              item={item} index={i} total={DELIVERABLES.length}
              scrollYProgress={scrollYProgress}
              T={T}
              onSelect={() => onSelect(i + 1)}
            />
          ))}
        </motion.div>

        {/* Dot indicators */}
        <div style={{
          position: "absolute", bottom: 14, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", gap: 6, zIndex: 20,
        }}>
          {DELIVERABLES.map((_, i) => (
            <div key={i} style={{
              width: i === active ? 20 : 4, height: 4, borderRadius: 2,
              background: i === active ? T.orange : `${T.mid}55`,
              transition: "all 0.35s ease",
            }} />
          ))}
        </div>

        {/* Progress bar at very bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 2, background: T.dim, zIndex: 20, transition: TT,
        }}>
          <motion.div style={{ height: "100%", background: T.orange, width: progressWidth }} />
        </div>
      </div>
    </div>
  );
}

// ── MARQUEE ────────────────────────────────────────────────────────────────────
function Marquee({ T }: { T: Tokens }) {
  const items = ["CineCity 2025", "Visuele Identiteit", "Coming of Age", "Antwerpen", "6 Deliverables"];
  const repeated = [...items, ...items];
  return (
    <div style={{
      overflow:"hidden", borderTop:`1px solid ${T.grey}`,
      borderBottom:`1px solid ${T.grey}`, padding:"14px 0",
      background:T.bg, transition:"background 0.45s ease",
    }}>
      <motion.div
        animate={{ x:["0%", "-50%"] }}
        transition={{ duration:22, repeat:Infinity, ease:"linear" }}
        style={{ display:"flex", gap:0, whiteSpace:"nowrap" }}
      >
        {repeated.map((item, i) => (
          <span key={i} style={{
            fontFamily:"'Bebas Neue', sans-serif",
            fontSize:"clamp(11px,1.2vw,14px)",
            letterSpacing:"0.22em", textTransform:"uppercase",
            color:`${T.mid}88`, padding:"0 clamp(24px,4vw,48px)",
            borderRight:`1px solid ${T.grey}`,
          }}>
            {item}
            <span style={{ color:`${T.orange}66`, marginLeft:16 }}>✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function CineCityPageIndustrial() {
  const T = useIndustrialTheme();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const TT = "background 0.45s ease, color 0.45s ease, border-color 0.45s ease";

  const toggleSound = () => {
    if (!videoRef.current) return;
    const newMuted = !muted;
    videoRef.current.muted = newMuted;
    setMuted(newMuted);
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape")     setSelectedIndex(null);
      if (e.key === "ArrowRight") setSelectedIndex(i => (i! + 1) % DELIVERABLES.length);
      if (e.key === "ArrowLeft")  setSelectedIndex(i => (i! - 1 + DELIVERABLES.length) % DELIVERABLES.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex]);

  return (
    <div style={{
      minHeight:"100vh", background: T.bg, color: T.ink,
      overflowX:"clip", cursor:"none",
      fontFamily:"'DM Mono', monospace", transition: TT,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }
        body { cursor:none !important; }
        ::selection { background:${T.orange}; color:#fff; }
        ::-webkit-scrollbar { width:1px; }
        ::-webkit-scrollbar-thumb { background:${T.orange}55; }

        .ind-cc-hero-pad { padding: 0 clamp(14px,4vw,60px) clamp(24px,4vw,64px); }
        .ind-cc-meta { display:none; }
        @media (min-width:768px) { .ind-cc-meta { display:block; } }

        .ind-cc-concept {
          padding:clamp(40px,7vw,96px) clamp(16px,5vw,60px);
          display:grid; grid-template-columns:1fr; gap:40px; align-items:start;
        }
        @media (min-width:768px) { .ind-cc-concept { grid-template-columns:1fr 1fr; gap:80px; } }

        /* Deliverable rows */
        .ind-del-row { grid-template-columns: 1fr; }
        @media (min-width:768px) {
          .ind-del-row { grid-template-columns: 1fr 1fr; }
        }

        /* On mobile: full-bleed image on top, text below */
        @media (max-width:767px) {
          .ind-del-img-wrap {
            order: 0 !important;
            width: 100vw !important;
            height: 70vw !important;
            min-height: 280px !important;
            margin-left: 0 !important;
            flex-shrink: 0;
          }
          .ind-del-img-wrap img {
            left: 0 !important; right: 0 !important;
            width: 100% !important;
            inset: 0 !important;
          }
          .ind-del-text-wrap { order: 1 !important; }
        }

        /* Hero title: single column on mobile */
        .ind-hero-title { display:grid; grid-template-columns:1fr; align-items:flex-end; }
        @media (min-width:640px) { .ind-hero-title { grid-template-columns:1fr 1fr; } }

        /* Concept stats: 3 cols on desktop, collapsed on tiny screens */
        @media (max-width:400px) {
          .ind-cc-stats { grid-template-columns: 1fr !important; }
        }

        /* Desktop editorial rows – hidden on mobile */
        .ind-editorial-desktop { display: none; }
        @media (min-width:768px) { .ind-editorial-desktop { display: block; } }

        /* Mobile horizontal scroll – hidden on desktop */
        .ind-carousel-mobile { display: block; }
        @media (min-width:768px) { .ind-carousel-mobile { display: none; } }
      `}</style>

      <Grain T={T}/>

      {/* ── HERO ── */}
      <section style={{ position:"relative", minHeight:"100svh", overflow:"hidden",
        display:"flex", flexDirection:"column", justifyContent:"flex-end",
        borderBottom:`1px solid ${T.grey}`, transition: TT }}>

        {/* ── Full-bleed opening title video ── */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          style={{
            position:"absolute", inset:0, zIndex:0,
            width:"100%", height:"100%", objectFit:"cover",
            opacity: T.isLight ? 0.55 : 0.78,
            transition:"opacity 0.45s ease",
          }}
        >
          <source src="/img/2526_VDL3_WaterschootJ_openingtitle.mp4" type="video/mp4"/>
        </video>

        {/* Decorative layer on top of video */}
        <div style={{ position:"absolute", inset:0, zIndex:1 }}>
          {/* Rings */}
          <motion.div animate={{ rotate:360 }} transition={{ duration:30, repeat:Infinity, ease:"linear" }}
            style={{ position:"absolute", top:"-18%", right:"-12%", width:700, height:700,
              border:`1px solid ${T.orange}18`, borderRadius:"50%" }}/>
          <motion.div animate={{ rotate:-360 }} transition={{ duration:42, repeat:Infinity, ease:"linear" }}
            style={{ position:"absolute", top:"-8%", right:"-4%", width:480, height:480,
              border:`1px solid ${T.orange}28`, borderRadius:"50%" }}/>
          {/* Glow orb */}
          <motion.div
            animate={{ scale:[1,1.15,1], opacity: T.isLight ? [0.03,0.06,0.03] : [0.08,0.14,0.08] }}
            transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }}
            style={{ position:"absolute", top:"10%", right:"8%", width:420, height:420,
              borderRadius:"50%",
              background:`radial-gradient(circle, ${T.orange} 0%, transparent 70%)`,
              filter:"blur(60px)" }}/>
          {/* Bottom-to-top gradient — ensures title legibility */}
          <div style={{ position:"absolute", inset:0,
            background:`linear-gradient(to top, ${T.bg} 0%, ${T.bg}F0 20%, ${T.bg}88 42%, ${T.bg}22 65%, transparent 100%)`,
            transition: TT }}/>
          {/* Left-side vignette */}
          <div style={{ position:"absolute", inset:0,
            background:`linear-gradient(to right, ${T.bg}BB 0%, transparent 45%)`,
            transition: TT }}/>
        </div>

{/* Meta top-right */}
        <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:1.8, duration:0.8 }}
          className="ind-cc-meta"
          style={{ position:"absolute", top:52, right:60, textAlign:"right",
            fontSize:9, letterSpacing:"0.22em", textTransform:"uppercase",
            color:T.mid, lineHeight:2.8, zIndex:10, transition: TT }}>
          <div>Antwerpen — Filmfestival</div>
          <div>Visuele Identiteit</div>
          <div style={{ color:T.orange }}>CineCity 2025</div>
        </motion.div>

        {/* Bottom content */}
        <div className="ind-cc-hero-pad" style={{ position:"relative", zIndex:5 }}>
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            transition={{ delay:0.25, duration:1 }}
            style={{ fontSize:9, letterSpacing:"0.36em", textTransform:"uppercase",
              color:T.mid, marginBottom:28, display:"flex", alignItems:"center", gap:14 }}>
            <span style={{ width:22, height:1, background:`${T.orange}88`, display:"inline-block" }}/>
            Visuele Identiteit — Coming of Age
          </motion.div>

          <div className="ind-hero-title">
            <div>
              <div style={{ overflow:"hidden" }}>
                <motion.h1 initial={{ y:"110%", skewY:5 }} animate={{ y:0, skewY:0 }}
                  transition={{ duration:1.1, delay:0.4, ease:EASE }}
                  style={{ fontFamily:"'Bebas Neue', sans-serif",
                    fontSize:"clamp(90px,17vw,240px)", lineHeight:0.82,
                    letterSpacing:"0.01em", color:T.ink, transition: TT }}>Cine</motion.h1>
              </div>
              <div style={{ overflow:"hidden" }}>
                <motion.h1 initial={{ y:"110%", skewY:5 }} animate={{ y:0, skewY:0 }}
                  transition={{ duration:1.1, delay:0.55, ease:EASE }}
                  style={{ fontFamily:"'Bebas Neue', sans-serif",
                    fontSize:"clamp(90px,17vw,240px)", lineHeight:0.82,
                    letterSpacing:"0.01em",
                    WebkitTextStroke:`clamp(0.5px, 0.2vw, 2px) ${T.orange}`, color:"transparent" }}>City</motion.h1>
              </div>
            </div>
          </div>

          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:1.5, duration:0.9 }}
            style={{ marginTop:48, borderTop:`1px solid ${T.dim}`, paddingTop:28,
              display:"flex", alignItems:"center", justifyContent:"space-between",
              flexWrap:"wrap", gap:14, transition: TT }}>

            {/* Sound toggle */}
            <motion.button
              onClick={toggleSound}
              whileHover={{ borderColor:T.orange, color:T.ink }}
              style={{
                display:"inline-flex", alignItems:"center", gap:10,
                border:`1px solid ${T.dim}`, color:T.mid, fontSize:9,
                letterSpacing:"0.22em", textTransform:"uppercase",
                padding:"14px 22px", background:"none", cursor:"none",
                fontFamily:"'DM Mono', monospace",
                transition:"all 0.3s",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                {muted ? (
                  <>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </>
                ) : (
                  <>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </>
                )}
              </svg>
              {muted ? "Geluid aan" : "Dempen"}
              {/* Pulse dot when unmuted */}
              {!muted && (
                <motion.span
                  animate={{ opacity:[1,0.2,1], scale:[1,1.4,1] }}
                  transition={{ duration:1.2, repeat:Infinity }}
                  style={{ width:5, height:5, borderRadius:"50%", background:T.orange,
                    display:"inline-block", flexShrink:0 }}
                />
              )}
            </motion.button>

            {/* CTA */}
            <motion.a href="#ind-work"
              whileHover={{ borderColor:T.orange, color:T.ink, background:`${T.orange}12` }}
              style={{ display:"inline-flex", alignItems:"center", gap:12,
                border:`1px solid ${T.dim}`, color:T.mid, fontSize:9,
                letterSpacing:"0.22em", textTransform:"uppercase",
                padding:"14px 28px", transition:"all 0.3s", textDecoration:"none" }}>
              Bekijk deliverables
              <motion.span animate={{ y:[0,5,0] }} transition={{ duration:1.8, repeat:Infinity }}>↓</motion.span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <Marquee T={T}/>

      {/* ── CONCEPT ── */}
      <section className="ind-cc-concept" style={{ borderBottom:`1px solid ${T.dim}`, transition: TT }}>
        <div>
          <MaskReveal>
            <div style={{ fontSize:9, letterSpacing:"0.32em", textTransform:"uppercase",
              color:T.orange, marginBottom:20, display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ width:18, height:1, background:T.orange, display:"inline-block" }}/>
              De Uitdaging
            </div>
          </MaskReveal>
          <MaskReveal delay={0.1}>
            <h2 style={{ fontFamily:"'Bebas Neue', sans-serif",
              fontSize:"clamp(32px,4.5vw,64px)", letterSpacing:"0.04em", lineHeight:0.92,
              color:T.ink, transition: TT }}>
              Groei zonder<br/>
              <span style={{ WebkitTextStroke:`clamp(0.4px, 0.15vw, 1.5px) ${T.orange}`, color:"transparent" }}>clichés</span>
            </h2>
          </MaskReveal>
        </div>

        <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }}
          viewport={{ once:true, margin:"-60px" }}
          transition={{ duration:0.9, delay:0.2, ease: EASE }}>
          <p style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:300,
            fontSize:15, lineHeight:1.95,
            color: T.isLight ? T.ink : `${T.ink}88`, marginBottom:28, transition: TT }}>
            Hoe visualiseer je <span style={{ color:T.orangeL }}>groei en identiteit</span> voor
            jongeren van 18 tot 25 jaar zonder letterlijke filmscènes.
            Het thema <em style={{ fontStyle:"italic" }}>Coming of Age</em> vraagt om beeldtaal
            die nieuwsgierigheid wekt en aansluit bij een stedelijk, Antwerps publiek.
          </p>
          <p style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:300,
            fontSize:15, lineHeight:1.95,
            color: T.isLight ? T.mid : `${T.ink}55`, transition: TT }}>
            Het dagprogramma van CineCity vertaald naar een flexibele visuele identiteit.
            Herkenbaar, fris en energiek genoeg voor diverse media.
          </p>

          <div className="ind-cc-stats" style={{ marginTop:48, display:"grid", gridTemplateColumns:"repeat(3,1fr)",
            gap:1, background:T.dim, transition: TT }}>
            {[["06","Deliverables"],["01","Festival"],["∞","Mogelijkheden"]].map(([n,l], i) => (
              <div key={i} style={{ background:T.bg, padding:"24px 20px",
                borderLeft: i===0 ? `3px solid ${T.orange}` : "none", transition: TT }}>
                <div style={{ fontFamily:"'Bebas Neue', sans-serif",
                  fontSize:36, color:T.orange, lineHeight:1 }}>{n}</div>
                <div style={{ fontSize:8, letterSpacing:"0.2em", textTransform:"uppercase",
                  color:T.mid, marginTop:6 }}>{l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── DELIVERABLES ── */}
      <section id="ind-work">
        {/* Section title */}
        <div style={{ padding:"clamp(40px,6vw,72px) clamp(16px,5vw,60px)",
          borderBottom:`1px solid ${T.dim}`, transition: TT,
          display:"flex", alignItems:"baseline", justifyContent:"space-between" }}>
          <MaskReveal>
            <span style={{ fontFamily:"'Bebas Neue', sans-serif",
              fontSize:"clamp(36px,5vw,64px)", letterSpacing:"0.04em",
              color:T.ink, transition: TT }}>Deliverables</span>
          </MaskReveal>
          <motion.span
            initial={{ opacity:0 }} whileInView={{ opacity:1 }}
            viewport={{ once:true }}
            transition={{ duration:0.8, delay:0.3 }}
            style={{ fontFamily:"'DM Mono', monospace", fontSize:11,
              letterSpacing:"0.2em", color: T.mid }}>
            {DELIVERABLES.length} werken
          </motion.span>
        </div>

        {/* Rows – desktop only */}
        <div className="ind-editorial-desktop">
          {DELIVERABLES.map((item, i) => (
            <DeliverableRow
              key={i} item={item} index={i} T={T}
              onSelect={() => setSelectedIndex(i + 1)}
            />
          ))}
        </div>

        {/* Parallax horizontal scroll – mobile only */}
        <div className="ind-carousel-mobile">
          <MobileHorizontalScroll T={T} onSelect={idx => setSelectedIndex(idx)} />
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.3 }}
            onClick={() => setSelectedIndex(null)}
            style={{ position:"fixed", inset:0, zIndex:9000,
              background: T.isLight ? "rgba(250,248,244,0.96)" : "rgba(8,8,7,0.97)",
              backdropFilter:"blur(12px)",
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:48, cursor:"none" }}>

            <button onClick={e => { e.stopPropagation();
              setSelectedIndex(i => (i! - 1 + DELIVERABLES.length) % DELIVERABLES.length); }}
              style={{ position:"absolute", left:32, background:"none", border:"none",
                color:`${T.ink}44`, fontSize:28, cursor:"none", padding:16, transition:"color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = T.orangeL)}
              onMouseLeave={e => (e.currentTarget.style.color = `${T.ink}44`)}
            >←</button>

            <motion.div key={selectedIndex}
              initial={{ opacity:0, scale:0.94, y:12 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.96 }}
              transition={{ duration:0.4, ease: EASE }}
              onClick={e => e.stopPropagation()}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
              <img src={DELIVERABLES[selectedIndex].src} alt={DELIVERABLES[selectedIndex].title}
                style={{ maxHeight:"76vh", maxWidth:"100%", objectFit:"contain",
                  boxShadow: T.isLight
                    ? `0 40px 80px rgba(0,0,0,0.1), 0 0 60px ${T.orange}18`
                    : `0 40px 120px rgba(0,0,0,0.9), 0 0 60px ${T.orange}22`,
                  border:`1px solid ${T.orange}22` }}/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontSize:8, letterSpacing:"0.26em", textTransform:"uppercase",
                  color:T.orange, marginBottom:6 }}>{DELIVERABLES[selectedIndex].category}</div>
                <div style={{ fontFamily:"'Bebas Neue', sans-serif", fontSize:24,
                  letterSpacing:"0.08em", color:T.ink }}>{DELIVERABLES[selectedIndex].title}</div>
              </div>
            </motion.div>

            <button onClick={e => { e.stopPropagation();
              setSelectedIndex(i => (i! + 1) % DELIVERABLES.length); }}
              style={{ position:"absolute", right:32, background:"none", border:"none",
                color:`${T.ink}44`, fontSize:28, cursor:"none", padding:16, transition:"color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = T.orangeL)}
              onMouseLeave={e => (e.currentTarget.style.color = `${T.ink}44`)}
            >→</button>

            <div style={{ position:"absolute", top:28, right:36,
              display:"flex", alignItems:"center", gap:24 }}>
              <span style={{ fontSize:9, letterSpacing:"0.2em",
                color:`${T.ink}44`, textTransform:"uppercase" }}>
                {String(selectedIndex+1).padStart(2,"0")} / {String(DELIVERABLES.length).padStart(2,"0")}
              </span>
              <button onClick={() => setSelectedIndex(null)}
                style={{ background:"none", border:`1px solid ${T.dim}`,
                  color:`${T.ink}55`, fontSize:9, letterSpacing:"0.24em",
                  textTransform:"uppercase", padding:"8px 16px", cursor:"none", transition:"all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.orange;
                  e.currentTarget.style.color = T.orangeL; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.dim;
                  e.currentTarget.style.color = `${T.ink}55`; }}
              >Sluiten [ESC]</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
