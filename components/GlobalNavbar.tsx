"use client"

/* ================================================================
 * GlobalNavbar.tsx
 * ----------------------------------------------------------------
 * Top-level component imported by app/layout.tsx.
 * Switches between the Industrial and Modern navbar based on the
 * useStyle() hook, with a crossfade between versions.
 *
 * Note: when the user switches styles WHILE the menu is open, the
 * underlying GlobalNavbarBase component reads its persisted
 * menuOpen state from a module-level store (see GlobalNavbarBase),
 * so the new variant re-opens the menu instantly after mount.
 * ================================================================ */

import { useStyle } from "@/components/useStyle"
import { AnimatePresence, motion } from "framer-motion"
import GlobalNavbarIndustrial from "@/components/GlobalNavbarIndustrial"
import GlobalNavbarModern     from "@/components/GlobalNavbarModern"

export default function GlobalNavbar() {
  const { style } = useStyle()

  return (
    <>
      {/* The fixed header + menu overlay — crossfades on style switch */}
      <AnimatePresence mode="wait">
        <motion.div
          key={style}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {style === "industrial"
            ? <GlobalNavbarIndustrial />
            : <GlobalNavbarModern />
          }
        </motion.div>
      </AnimatePresence>

      {/* Stable spacer — lives outside AnimatePresence so layout never jumps
          during style transitions. Height matches the fixed header (72px / 64px mobile). */}
      <div aria-hidden style={{ height: "var(--navbar-h, 72px)", flexShrink: 0 }} />
    </>
  )
}