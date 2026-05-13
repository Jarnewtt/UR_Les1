"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FiInstagram, FiMail } from "react-icons/fi"
import { trackSocialClick } from "@/lib/analytics"

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

export default function ContactPageIndustrial() {
  const C = useTheme()

  return (
    <div id="contact-section" style={{
      background: C.blue,
      minHeight: "calc(100svh - var(--navbar-h, 72px))",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "clamp(48px,8vh,96px) clamp(24px,6vw,80px)",
      position: "relative", overflow: "hidden",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=DM+Mono:wght@400;500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;1,9..40,300;1,9..40,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .cp-btn {
          display: inline-flex; align-items: center; justify-content: center;
          padding: 14px;
          border: 1px solid rgba(255,255,255,0.35);
          background: transparent;
          color: #fff;
          font-family: 'DM Mono', monospace;
          font-size: 13px; letter-spacing: 0.26em; text-transform: uppercase;
          text-decoration: none; cursor: pointer;
          transition: background 0.22s, border-color 0.22s;
        }
        .cp-btn:hover {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.6);
        }
      `}</style>

      {/* Grain */}
      <svg style={{ position:"absolute", inset:0, zIndex:0, opacity:0.04, pointerEvents:"none", width:"100%", height:"100%" }}>
        <filter id="cp-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={4} stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#cp-grain)"/>
      </svg>

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, maxWidth: 960, width: "100%", textAlign: "center" }}>

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: E }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: "clamp(40px,7vh,72px)" }}
        >
          <span style={{ width: 20, height: 1, background: "rgba(255,255,255,0.4)", display: "inline-block" }}/>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>
            04 — Contact
          </span>
          <span style={{ width: 20, height: 1, background: "rgba(255,255,255,0.4)", display: "inline-block" }}/>
        </motion.div>

        {/* Heading */}
        <div style={{ overflow: "hidden", marginBottom: 2, paddingBottom: "0.1em" }}>
          <motion.div
            initial={{ y: "110%" }} animate={{ y: "0%" }}
            transition={{ duration: 0.9, ease: E }}
          >
            <h1 style={{
              fontFamily: "'Anton', Impact, sans-serif",
              fontSize: "clamp(52px,9.5vw,124px)",
              lineHeight: 0.9, letterSpacing: "0.01em",
              textTransform: "uppercase",
              color: "#fff", margin: 0,
            }}>
              Laten we
            </h1>
          </motion.div>
        </div>
        <div style={{ overflow: "hidden", marginBottom: "clamp(28px,5vh,52px)", paddingBottom: "0.1em" }}>
          <motion.div
            initial={{ y: "110%" }} animate={{ y: "0%" }}
            transition={{ duration: 0.9, delay: 0.08, ease: E }}
          >
            <h1 style={{
              fontFamily: "'Anton', Impact, sans-serif",
              fontSize: "clamp(52px,9.5vw,124px)",
              lineHeight: 0.9, letterSpacing: "0.01em",
              textTransform: "uppercase",
              color: "#fff", margin: 0,
            }}>
              Samenwerken.
            </h1>
          </motion.div>
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: E }}
          style={{
            fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
            fontSize: "clamp(16px,1.4vw,20px)", lineHeight: 1.8,
            color: "rgba(255,255,255,0.7)", maxWidth: "48ch", margin: "0 auto clamp(28px,5vh,48px)",
          }}
        >
          Ik ben altijd op zoek naar nieuwe projecten en samenwerkingen.
          Heb je een project in gedachten of wil je gewoon hallo zeggen?
          Neem gerust contact op.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: E }}
          style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}
        >
          <a href="https://www.instagram.com/jarne_wtt" target="_blank" rel="noopener noreferrer" className="cp-btn" onClick={() => trackSocialClick('instagram', '/contact')}>
            <FiInstagram size={18} />
          </a>
          <a href="mailto:jarnewaterschoot@hotmail.com" className="cp-btn" onClick={() => trackSocialClick('email', '/contact')}>
            <FiMail size={18} />
          </a>
        </motion.div>

      </div>
    </div>
  )
}
