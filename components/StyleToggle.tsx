"use client"

import { useStyle } from "@/components/useStyle"
import { motion } from "framer-motion"

// Accentkleur volgt de actieve stijl
const ACCENT = {
  industrial: "#FF5C1A",  // oranje
  modern:     "#E8280A",  // rood
}

const MID    = "#888884"
const BORDER = "#2A2A28"

function IconIndustrial({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="3"  width="14" height="2" rx="1" fill={color} />
      <rect x="1" y="7"  width="14" height="2" rx="1" fill={color} />
      <rect x="1" y="11" width="14" height="2" rx="1" fill={color} />
    </svg>
  )
}

function IconModern({ color }: { color: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="2" fill={color} />
      <rect x="9" y="1" width="6" height="6" rx="2" fill={color} opacity="0.5" />
      <rect x="1" y="9" width="6" height="6" rx="2" fill={color} opacity="0.5" />
      <rect x="9" y="9" width="6" height="6" rx="2" fill={color} />
    </svg>
  )
}

export default function StyleToggle() {
  const { style, setStyle } = useStyle()
  const isIndustrial = style === "industrial"

  // Actieve accentkleur — oranje als industrial actief, rood als modern actief
  const accent = ACCENT[style]

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 4,
      padding: "4px",
      border: `1px solid ${BORDER}`,
      borderRadius: 4,
      background: "#0d0d0b",
      position: "relative",
      transition: "border-color 0.3s",
    }}>

      {/* Sliding highlight — kleur volgt de actieve stijl */}
      <motion.div
        layout
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "absolute",
          top: 3,
          left: isIndustrial ? 3 : "calc(50% + 1px)",
          width: "calc(50% - 4px)",
          bottom: 3,
          background: `${accent}18`,
          border: `1px solid ${accent}55`,
          borderRadius: 2,
          pointerEvents: "none",
          transition: "background 0.3s, border-color 0.3s",
        }}
      />

      {/* Knop A — Industrial */}
      <button
        onClick={() => setStyle("industrial")}
        title="Industrieel"
        aria-label="Switch to Industrial style"
        style={{
          background: "none", border: "none", cursor: "none",
          padding: "5px 10px",
          display: "flex", alignItems: "center", gap: 6,
          // Actief = accent van de ACTIEVE stijl, inactief = grijs
          color: isIndustrial ? ACCENT.industrial : MID,
          fontFamily: "'DM Mono', monospace",
          fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
          transition: "color 0.3s",
          position: "relative", zIndex: 1, whiteSpace: "nowrap",
        }}
      >
        <IconIndustrial color={isIndustrial ? ACCENT.industrial : MID} />
        <span>A</span>
      </button>

      {/* Divider */}
      <div style={{ width: 1, height: 14, background: BORDER, flexShrink: 0 }} />

      {/* Knop B — Modern */}
      <button
        onClick={() => setStyle("modern")}
        title="Modern"
        aria-label="Switch to Modern style"
        style={{
          background: "none", border: "none", cursor: "none",
          padding: "5px 10px",
          display: "flex", alignItems: "center", gap: 6,
          // Actief = accent van de ACTIEVE stijl (rood), inactief = grijs
          color: !isIndustrial ? ACCENT.modern : MID,
          fontFamily: "'DM Mono', monospace",
          fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
          transition: "color 0.3s",
          position: "relative", zIndex: 1, whiteSpace: "nowrap",
        }}
      >
        <IconModern color={!isIndustrial ? ACCENT.modern : MID} />
        <span>B</span>
      </button>

    </div>
  )
}