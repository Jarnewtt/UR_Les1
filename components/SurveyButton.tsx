"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const SURVEY_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfktzkKEzM8ydmEobW6X5Dy5PDIwoidVu8et621vgk1l3CBIw/viewform?usp=publish-editor"

const LS_KEY = "survey_opened"

// ── THANK YOU MODAL ───────────────────────────────────────────────────────────
function ThankYouModal({ onClose }: { onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      onTouchEnd={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        pointerEvents: "all",
        cursor: "default",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 12 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        onTouchEnd={e => e.stopPropagation()}
        style={{
          background: "#FDFAF7",
          maxWidth: 440, width: "100%",
          padding: "48px 40px 40px",
          position: "relative",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
        }}
      >
        {/* Oranje accentlijn bovenaan */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 3,
          background: "linear-gradient(90deg, #FF5C1A, #FF9A6C)",
        }} />

        {/* Sluitknop */}
        <button
          onClick={onClose}
          onTouchEnd={onClose}
          style={{
            position: "absolute", top: 16, right: 16,
            background: "none", border: "none", cursor: "pointer",
            color: "#888", padding: 8, display: "flex",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Icoon */}
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: "#FFF0EB", border: "2px solid #FFD5C4",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="#FF5C1A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>

        {/* Tekst */}
        <h2 style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 24, fontWeight: 700,
          color: "#1A1816", lineHeight: 1.2, marginBottom: 12,
        }}>
          Merci voor je feedback!
        </h2>
        <p style={{
          fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300,
          color: "#5A5650", lineHeight: 1.75, marginBottom: 32,
        }}>
          Jouw antwoorden helpen mij om dit portfolio verder te verbeteren.
          Ik waardeer de tijd die je nam — echt bedankt!
        </p>

        {/* Sluitknop onderaan */}
        <motion.button
          onClick={onClose}
          onTouchEnd={onClose}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: "#FF5C1A", color: "#fff", border: "none",
            padding: "13px 28px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
            letterSpacing: "0.04em", width: "100%",
          }}
        >
          Sluit venster
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ── SURVEY BUTTON ─────────────────────────────────────────────────────────────
export default function SurveyButton() {
  const [showThankYou, setShowThankYou] = useState(false)

  // Detect tab return after survey
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible" && localStorage.getItem(LS_KEY)) {
        localStorage.removeItem(LS_KEY)
        setShowThankYou(true)
      }
    }
    document.addEventListener("visibilitychange", handleVisibility)
    return () => document.removeEventListener("visibilitychange", handleVisibility)
  }, [])

  const handleClick = () => {
    localStorage.setItem(LS_KEY, "1")
  }

  return (
    <>
      <AnimatePresence>
        {showThankYou && <ThankYouModal onClose={() => setShowThankYou(false)} />}
      </AnimatePresence>

      <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9998, pointerEvents: "none" }}>

        {/* Pulsing ring 1 */}
        <div style={{
          position: "absolute", inset: -8, borderRadius: 999,
          border: "2px solid #FF5C1A",
          animation: "survey-ring 2.4s ease-out infinite",
          pointerEvents: "none",
        }} />
        {/* Pulsing ring 2 (delayed) */}
        <div style={{
          position: "absolute", inset: -8, borderRadius: 999,
          border: "2px solid #FF5C1A",
          animation: "survey-ring 2.4s ease-out infinite 1.2s",
          pointerEvents: "none",
        }} />

        <motion.a
          href={SURVEY_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          style={{
            pointerEvents: "all",
            position: "relative",
            display: "flex", alignItems: "center", gap: 10,
            background: "#FF5C1A",
            color: "#fff",
            padding: "13px 22px",
            borderRadius: 999,
            fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 700,
            textDecoration: "none",
            letterSpacing: "0.02em",
            boxShadow: "0 4px 28px rgba(255,92,26,0.5), 0 1px 6px rgba(0,0,0,0.25)",
            whiteSpace: "nowrap",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
            <rect x="9" y="3" width="6" height="4" rx="1"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
          <span className="hidden sm:inline">Vul enquête in</span>
          <span style={{
            position: "absolute", top: -4, right: -4,
            width: 12, height: 12, borderRadius: "50%",
            background: "#fff", border: "2px solid #FF5C1A",
            animation: "survey-dot 1.8s ease-in-out infinite",
          }} />
        </motion.a>

        <style>{`
          @keyframes survey-ring {
            0%   { transform: scale(1);   opacity: 0.7; }
            100% { transform: scale(1.6); opacity: 0;   }
          }
          @keyframes survey-dot {
            0%, 100% { transform: scale(1);    background: #fff; }
            50%       { transform: scale(1.25); background: #ffe0d4; }
          }
        `}</style>
      </div>
    </>
  )
}
