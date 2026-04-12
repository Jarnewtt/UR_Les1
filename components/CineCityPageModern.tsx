"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── TOKENS ────────────────────────────────────────────────────────────────────
type Tokens = {
  bg: string; surface: string; surfaceAlt: string;
  ink: string; inkSub: string; inkMuted: string;
  purple: string; purpleL: string;
  border: string;
  isLight: boolean;
}

const DARK: Tokens = {
  bg:         "#09090b",
  surface:    "#18181b",
  surfaceAlt: "#27272a",
  ink:        "#fafafa",
  inkSub:     "#d4d4d8",
  inkMuted:   "#71717a",
  purple:     "#a855f7",
  purpleL:    "#c084fc",
  border:     "#3f3f46",
  isLight: false,
}

const LIGHT: Tokens = {
  bg:         "#F5F2FF",
  surface:    "#EDE8FF",
  surfaceAlt: "#E0D9FF",
  ink:        "#0c0812",
  inkSub:     "#3b3649",
  inkMuted:   "#6b6878",
  purple:     "#7c3aed",
  purpleL:    "#9333ea",
  border:     "#c4b5fd",
  isLight: true,
}

function useModernTheme(): Tokens {
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

// ── DATA ──────────────────────────────────────────────────────────────────────
const GALLERY_ITEMS = [
  { src: "/img/Mockup_affichereeks.jpg",     title: "Affichereeks",       category: "Print"      },
  { src: "/img/Mockup_booklet.jpg",          title: "Programmaboekje",    category: "Editorial"  },
  { src: "/img/Usb.jpg",                     title: "USB flash drive",    category: "Merchandise"},
  { src: "/img/Mockup_desktop.jpg",          title: "Desktop Interface",  category: "Web Design" },
  { src: "/img/Mockup_mobile.jpg",           title: "Mobile Experience",  category: "App Design" },
  { src: "/img/Mockup_reserveringstool.jpg", title: "Ticketing Flow",     category: "UI/UX"      },
];

const ALL_IMAGES = [
  { src: "/img/Mockup_affiche.jpg", title: "Hoofdcampagne", category: "Key Visual" },
  ...GALLERY_ITEMS,
];

// ── CURSOR ────────────────────────────────────────────────────────────────────

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function CineCityPageModern() {
  const T = useModernTheme();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const TT = "background 0.45s ease, color 0.45s ease, border-color 0.45s ease";

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      if (e.key === "Escape")     setSelectedIndex(null);
      if (e.key === "ArrowRight") setSelectedIndex(i => (i! + 1) % ALL_IMAGES.length);
      if (e.key === "ArrowLeft")  setSelectedIndex(i => (i! - 1 + ALL_IMAGES.length) % ALL_IMAGES.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex]);

  return (
    <div style={{
      position:"relative", width:"100%", background: T.bg, color: T.ink,
      overflowX:"hidden", cursor:"none",
      fontFamily:"'DM Sans', sans-serif", transition: TT,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;600;700;900&family=DM+Mono:wght@300;400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { cursor: none !important; }
        ::selection { background: ${T.purple}; color: #fff; }
        ::-webkit-scrollbar { width: 1px; }
        ::-webkit-scrollbar-thumb { background: ${T.purple}44; }

        @keyframes mod-cc-zoom {
          0%   { transform: scale(1); }
          100% { transform: scale(1.08); }
        }
        .mod-cc-zoom { animation: mod-cc-zoom 20s linear infinite alternate; }

        @keyframes mod-cc-pulse {
          0%,100% { opacity: ${T.isLight ? "0.07" : "0.12"}; transform: scale(1); }
          50%     { opacity: ${T.isLight ? "0.13" : "0.2"};  transform: scale(1.05); }
        }
        .mod-cc-glow { animation: mod-cc-pulse 8s ease-in-out infinite; }

        @keyframes mod-cc-fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mod-cc-fadeIn { animation: mod-cc-fadeIn 0.8s ease-out forwards; opacity: 0; }
        .mod-cc-scaleIn { animation: mod-cc-scaleIn 0.3s ease-out forwards; }
        @keyframes mod-cc-scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1); opacity: 1; }
        }

        .mod-cc-d100 { animation-delay: 0.1s; }
        .mod-cc-d200 { animation-delay: 0.2s; }
        .mod-cc-d300 { animation-delay: 0.3s; }
        .mod-cc-d400 { animation-delay: 0.4s; }
        .mod-cc-d500 { animation-delay: 0.5s; }

        /* ── Layout ── */
        .mod-cc-hero-content {
          position: relative; z-index: 5;
          width: 100%; max-width: 1400px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr;
          gap: 40px; align-items: center;
          padding: 0 clamp(16px,5vw,60px) clamp(40px,6vw,80px);
        }
        @media (min-width: 1024px) {
          .mod-cc-hero-content { grid-template-columns: 1fr 1fr; gap: 64px; }
        }
        .mod-cc-hero-img { display: none; }
        @media (min-width: 768px) { .mod-cc-hero-img { display: block; } }

        .mod-cc-gallery {
          display: grid; grid-template-columns: 1fr; gap: 24px;
        }
        @media (min-width: 768px)  { .mod-cc-gallery { grid-template-columns: repeat(2,1fr); } }
        @media (min-width: 1024px) { .mod-cc-gallery { grid-template-columns: repeat(3,1fr); } }

        .mod-cc-card-img { transition: transform 0.7s ease, opacity 0.4s ease; }
        .mod-cc-card:hover .mod-cc-card-img { transform: scale(1.1); opacity: 1; }
        .mod-cc-card-overlay { transform: translateY(8px); transition: transform 0.3s ease; }
        .mod-cc-card:hover .mod-cc-card-overlay { transform: translateY(0); }
        .mod-cc-card-cat { opacity: 0; transition: opacity 0.3s ease 0.1s; }
        .mod-cc-card:hover .mod-cc-card-cat { opacity: 1; }
      `}</style>



      {/* Purple glow orb */}
      <div className="mod-cc-glow" style={{
        position:"absolute", top:"-5%", right:"-5%",
        width:600, height:600, borderRadius:"50%",
        background:`radial-gradient(circle, ${T.purple}22 0%, transparent 70%)`,
        filter:"blur(80px)", pointerEvents:"none", zIndex:0,
      }}/>

      {/* ── HERO ── */}
      <section style={{
        position:"relative", minHeight:"100vh", overflow:"hidden",
        display:"flex", alignItems:"center", justifyContent:"center",
        marginTop:"-80px", paddingTop:"80px",
      }}>
        {/* Cinematic background image */}
        <div className="mod-cc-zoom" style={{
          position:"absolute", inset:0, zIndex:0,
          backgroundImage:"url('/img/CineCity_image.jpg')",
          backgroundSize:"cover", backgroundPosition:"center",
        }}>
          <div style={{
            position:"absolute", inset:0,
            background: T.isLight
              ? `linear-gradient(to top, ${T.bg} 0%, ${T.bg}BB 20%, transparent 60%)`
              : `linear-gradient(to top, ${T.bg} 0%, ${T.bg}DD 20%, transparent 60%)`,
            transition: TT,
          }}/>
          <div style={{
            position:"absolute", inset:0,
            background: T.isLight ? "rgba(245,242,255,0.45)" : "rgba(0,0,0,0.45)",
            transition: TT,
          }}/>
        </div>

        <div className="mod-cc-hero-content">
          <div style={{ display:"flex", flexDirection:"column", gap:28 }}>

            {/* Eyebrow */}
            <div className="mod-cc-fadeIn mod-cc-d100"
              style={{ display:"flex", alignItems:"center", gap:12 }}>
              <span style={{ height:1, width:40, background:T.purple, display:"inline-block" }}/>
              <span style={{ fontSize:10, fontFamily:"'DM Mono', monospace",
                letterSpacing:"0.22em", textTransform:"uppercase", color:T.purple }}>
                Visual Identity — Antwerpen
              </span>
            </div>

            {/* Title */}
            <h1 className="mod-cc-fadeIn mod-cc-d200" style={{
              fontFamily:"'DM Sans', sans-serif",
              fontSize:"clamp(72px,14vw,160px)",
              fontWeight:900, letterSpacing:"-0.03em", lineHeight:0.88,
              color:"transparent",
              backgroundImage:`linear-gradient(135deg, ${T.ink} 0%, ${T.inkSub} 60%, ${T.inkMuted} 100%)`,
              WebkitBackgroundClip:"text",
              backgroundClip:"text",
              transition: TT,
            }}>CineCity</h1>

            {/* Description */}
            <div className="mod-cc-fadeIn mod-cc-d300" style={{
              borderLeft:`2px solid ${T.purple}55`, paddingLeft:20, maxWidth:520,
            }}>
              <p style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:300,
                fontSize:"clamp(15px,1.8vw,18px)", lineHeight:1.85,
                color:T.inkSub, transition: TT }}>
                Een visuele identiteit voor het dagprogramma van een nieuw filmfestival.
                Het thema{" "}
                <span style={{ color:T.ink, fontWeight:600, transition: TT }}>"Coming of Age"</span>
                {" "}vertaald naar een abstracte, prikkelende beeldtaal zonder clichés.
              </p>
            </div>

            {/* Scroll CTA */}
            <div className="mod-cc-fadeIn mod-cc-d500">
              <button
                onClick={() => document.getElementById("mod-cc-work")?.scrollIntoView({ behavior:"smooth" })}
                style={{ display:"inline-flex", alignItems:"center", gap:10,
                  background:"none", border:"none", cursor:"none", padding:0,
                  fontFamily:"'DM Mono', monospace", fontSize:11,
                  letterSpacing:"0.2em", textTransform:"uppercase",
                  color:T.inkMuted, transition:"color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = T.purple)}
                onMouseLeave={e => (e.currentTarget.style.color = T.inkMuted)}
              >
                Bekijk de cases
                <span style={{ display:"inline-block", animation:"mod-cc-bob 1.8s ease-in-out infinite" }}>↓</span>
              </button>
            </div>
          </div>

          {/* Hero image */}
          <div className="mod-cc-hero-img mod-cc-fadeIn mod-cc-d400"
            style={{ position:"relative", display:"flex", justifyContent:"flex-end" }}>
            <div style={{
              position:"absolute", inset:0, borderRadius:"50%",
              background:`radial-gradient(circle, ${T.purple}33 0%, transparent 70%)`,
              filter:"blur(60px)", opacity: T.isLight ? 0.5 : 1,
            }}/>
            <img
              src="/img/Mockup_affiche.jpg"
              alt="CineCity design mockup"
              onClick={() => setSelectedIndex(0)}
              style={{ position:"relative", width:"100%", maxWidth:440,
                borderRadius:8, cursor:"none",
                boxShadow:`0 40px 80px rgba(0,0,0,${T.isLight ? "0.12" : "0.5"})`,
                border:`1px solid ${T.border}`,
                transition:`transform 0.6s ease, ${TT}`,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04) rotateY(-8deg)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "scale(1) rotateY(0deg)"; }}
            />
          </div>
        </div>
      </section>

      {/* ── CONCEPT ── */}
      <section style={{
        background: T.surface, transition: TT,
        borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`,
        padding:"clamp(48px,7vw,96px) clamp(16px,5vw,60px)",
      }}>
        <div style={{ maxWidth:760, margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"'DM Sans', sans-serif",
            fontSize:"clamp(28px,4vw,44px)", fontWeight:700, letterSpacing:"-0.02em",
            color:T.ink, marginBottom:28, transition: TT }}>De Uitdaging</h2>
          <p style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:300,
            fontSize:"clamp(15px,1.8vw,18px)", lineHeight:1.9,
            color:T.inkSub, transition: TT }}>
            Hoe visualiseer je{" "}
            <span style={{ color:T.purpleL }}>groei en identiteit</span>
            {" "}zonder letterlijke filmscènes te gebruiken?
            Het doel was om een systeem te creëren dat herkenbaar is, maar flexibel genoeg voor diverse media.
            De visuele stijl nodigt uit tot nieuwsgierigheid en weerspiegelt de rauwe, stedelijke energie van Antwerpen.
          </p>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section id="mod-cc-work" style={{
        background: T.surfaceAlt, transition: TT,
        padding:"clamp(48px,7vw,96px) clamp(16px,5vw,60px)",
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:48 }}>
          <div>
            <h2 style={{ fontFamily:"'DM Sans', sans-serif",
              fontSize:"clamp(36px,5vw,56px)", fontWeight:700, letterSpacing:"-0.02em",
              color:T.ink, marginBottom:10, transition: TT }}>Deliverables</h2>
            <div style={{ height:3, width:64, background:T.purple, borderRadius:2 }}/>
          </div>
          <span style={{ fontFamily:"'DM Mono', monospace", fontSize:9,
            letterSpacing:"0.2em", textTransform:"uppercase", color:T.inkMuted }}>
            {GALLERY_ITEMS.length} werken
          </span>
        </div>

        <div className="mod-cc-gallery">
          {GALLERY_ITEMS.map((item, i) => (
            <div
              key={i}
              className="mod-cc-card"
              onClick={() => setSelectedIndex(i + 1)}
              style={{ position:"relative", overflow:"hidden", cursor:"none",
                background: T.surface, border:`1px solid ${T.border}`,
                borderRadius:6, transition:`border-color 0.4s ease, background ${TT}` }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = `${T.purple}88`)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = T.border)}
            >
              <div style={{ height:256, overflow:"hidden" }}>
                <img src={item.src} alt={item.title}
                  className="mod-cc-card-img"
                  style={{ width:"100%", height:"100%", objectFit:"cover",
                    opacity: T.isLight ? 0.88 : 0.8, display:"block" }}/>
              </div>

              <div className="mod-cc-card-overlay" style={{
                position:"absolute", bottom:0, left:0, right:0,
                background: T.isLight
                  ? `linear-gradient(to top, ${T.bg}F0 0%, ${T.bg}99 50%, transparent 100%)`
                  : "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, transparent 100%)",
                padding:"clamp(12px,2vw,20px)",
              }}>
                <p className="mod-cc-card-cat" style={{
                  fontFamily:"'DM Mono', monospace", fontSize:9,
                  letterSpacing:"0.22em", textTransform:"uppercase",
                  color:T.purpleL, marginBottom:5 }}>{item.category}</p>
                <h3 style={{ fontFamily:"'DM Sans', sans-serif", fontWeight:700, fontSize:18,
                  color: T.isLight ? T.ink : "#ffffff", transition: TT }}>{item.title}</h3>
              </div>

              {/* Purple bottom bar */}
              <div className="mod-cc-card-bar" style={{
                position:"absolute", bottom:0, left:0, right:0, height:2,
                background:`linear-gradient(90deg, ${T.purple}, ${T.purpleL})`,
                transform:"scaleX(0)", transformOrigin:"left",
                transition:"transform 0.4s ease",
              }}/>
            </div>
          ))}
        </div>

        {/* Extra CSS for card bar hover (can't do in inline) */}
        <style>{`
          .mod-cc-card:hover .mod-cc-card-bar { transform: scaleX(1) !important; }
          @keyframes mod-cc-bob {
            0%,100% { transform: translateY(0); }
            50%     { transform: translateY(5px); }
          }
        `}</style>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: T.bg, textAlign:"center",
        borderTop:`1px solid ${T.border}`,
        padding:"clamp(48px,7vw,96px) clamp(16px,5vw,60px)",
        transition: TT,
      }}>
        <p style={{ fontFamily:"'DM Mono', monospace", fontSize:9,
          letterSpacing:"0.3em", textTransform:"uppercase",
          color:T.inkMuted, marginBottom:20 }}>Next Project</p>
        <h2 style={{ fontFamily:"'DM Sans', sans-serif",
          fontSize:"clamp(28px,4.5vw,52px)", fontWeight:700, letterSpacing:"-0.02em",
          color:T.ink, marginBottom:36, transition: TT }}>
          Klaar om jouw visie te verfilmen?
        </h2>
        <a
          href="/contact"
          style={{ display:"inline-block", border:`1px solid ${T.border}`,
            padding:"14px 36px",
            fontFamily:"'DM Mono', monospace", fontSize:10,
            letterSpacing:"0.22em", textTransform:"uppercase",
            color:T.inkSub, textDecoration:"none", transition:"all 0.3s ease" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.purple;
            e.currentTarget.style.color = T.purple;
            e.currentTarget.style.background = `${T.purple}12`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;
            e.currentTarget.style.color = T.inkSub;
            e.currentTarget.style.background = "transparent"; }}
        >Start Samenwerking</a>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:0.3 }}
            onClick={() => setSelectedIndex(null)}
            style={{ position:"fixed", inset:0, zIndex:9000,
              background: T.isLight ? "rgba(245,242,255,0.96)" : "rgba(9,9,11,0.97)",
              backdropFilter:"blur(12px)",
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:48, cursor:"none" }}>

            <button onClick={e => { e.stopPropagation();
              setSelectedIndex(i => (i! - 1 + ALL_IMAGES.length) % ALL_IMAGES.length); }}
              style={{ position:"absolute", left:24, background:"none", border:"none",
                color:`${T.ink}44`, fontSize:32, cursor:"none", padding:16, transition:"color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = T.purpleL)}
              onMouseLeave={e => (e.currentTarget.style.color = `${T.ink}44`)}
            >‹</button>

            <motion.div key={selectedIndex}
              initial={{ opacity:0, scale:0.94, y:12 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.96 }}
              transition={{ duration:0.4, ease: EASE }}
              onClick={e => e.stopPropagation()}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:20,
                maxWidth:960, width:"100%" }}>
              <img src={ALL_IMAGES[selectedIndex].src} alt={ALL_IMAGES[selectedIndex].title}
                className="mod-cc-scaleIn"
                style={{ maxHeight:"76vh", maxWidth:"100%", objectFit:"contain",
                  borderRadius:4,
                  boxShadow: T.isLight
                    ? `0 40px 80px rgba(0,0,0,0.1), 0 0 60px ${T.purple}18`
                    : `0 40px 80px rgba(0,0,0,0.8), 0 0 60px ${T.purple}22`,
                  border:`1px solid ${T.border}` }}/>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'DM Mono', monospace", fontSize:9,
                  letterSpacing:"0.26em", textTransform:"uppercase",
                  color:T.purple, marginBottom:6 }}>{ALL_IMAGES[selectedIndex].category}</div>
                <div style={{ fontFamily:"'DM Sans', sans-serif",
                  fontWeight:700, fontSize:22, color:T.ink, transition: TT }}>
                  {ALL_IMAGES[selectedIndex].title}
                </div>
              </div>
            </motion.div>

            <button onClick={e => { e.stopPropagation();
              setSelectedIndex(i => (i! + 1) % ALL_IMAGES.length); }}
              style={{ position:"absolute", right:24, background:"none", border:"none",
                color:`${T.ink}44`, fontSize:32, cursor:"none", padding:16, transition:"color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = T.purpleL)}
              onMouseLeave={e => (e.currentTarget.style.color = `${T.ink}44`)}
            >›</button>

            <div style={{ position:"absolute", top:28, right:36,
              display:"flex", alignItems:"center", gap:24 }}>
              <span style={{ fontFamily:"'DM Mono', monospace", fontSize:9,
                letterSpacing:"0.2em", color:`${T.ink}44`, textTransform:"uppercase" }}>
                {String(selectedIndex+1).padStart(2,"0")} / {String(ALL_IMAGES.length).padStart(2,"0")}
              </span>
              <button onClick={() => setSelectedIndex(null)}
                style={{ background:"none", border:`1px solid ${T.border}`,
                  color:`${T.ink}55`, fontFamily:"'DM Mono', monospace",
                  fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase",
                  padding:"8px 16px", cursor:"none", transition:"all 0.25s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = T.purple;
                  e.currentTarget.style.color = T.purpleL; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.color = `${T.ink}55`; }}
              >Sluiten [ESC]</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
