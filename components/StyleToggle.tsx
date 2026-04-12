"use client"

import { useStyle } from "@/components/useStyle"
import { motion } from "framer-motion"

const ACCENT = {
  industrial: "#FF5C1A",
  modern:     "#E8280A",
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function StyleToggle() {
  const { style, setStyle } = useStyle()
  const isIndustrial = style === "industrial"
  const accent = ACCENT[style]

  return (
    <>
      <style>{`
        .st-wrap {
          position: relative;
          display: flex;
          align-items: center;
          border-radius: 100px;
          background: #181816;
          border: 1px solid #383835;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.06) inset,
            0 4px 16px rgba(0,0,0,0.6);
          padding: 3px;
        }
        .st-pill {
          position: absolute;
          top: 3px; bottom: 3px;
          border-radius: 100px;
          background: ${accent}20;
          border: 1px solid ${accent}60;
          box-shadow: 0 0 16px ${accent}30;
          pointer-events: none;
          transition: background .35s, border-color .35s, box-shadow .35s;
        }
        .st-btn {
          position: relative;
          z-index: 1;
          padding: 6px 16px;
          border-radius: 100px;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .26em;
          text-transform: uppercase;
          white-space: nowrap;
          transition: color .3s;
        }
        .st-btn-active   { color: ${accent}; }
        .st-btn-inactive { color: #888884; }
        .st-btn-inactive:hover { color: #AAAAAA; transition: color .2s; }
      `}</style>

      <div className="st-wrap">
        <motion.div
          layout
          transition={{ duration: 0.35, ease: EASE }}
          className="st-pill"
          style={{
            left:  isIndustrial ? 3 : "calc(50%)",
            width: "calc(50% - 3px)",
          }}
        />

        <button
          onClick={() => setStyle("industrial")}
          aria-label="Schakel naar industriële stijl"
          aria-pressed={isIndustrial}
          className={`st-btn ${isIndustrial ? "st-btn-active" : "st-btn-inactive"}`}
        >
          INDS
        </button>

        <button
          onClick={() => setStyle("modern")}
          aria-label="Schakel naar moderne stijl"
          aria-pressed={!isIndustrial}
          className={`st-btn ${!isIndustrial ? "st-btn-active" : "st-btn-inactive"}`}
        >
          MOD
        </button>
      </div>
    </>
  )
}
