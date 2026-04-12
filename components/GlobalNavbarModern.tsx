"use client"

/* ================================================================
 * GlobalNavbarModern.tsx
 * ----------------------------------------------------------------
 * Thin wrapper. All logic lives in GlobalNavbarBase.tsx.
 * Only the theme (accent + class prefix + label) differs between
 * this and GlobalNavbarIndustrial. Do not add logic here — edit
 * the shared GlobalNavbarBase.tsx so both versions stay in sync.
 * ================================================================ */

import GlobalNavbarBase, { type NavTheme } from "@/components/GlobalNavbarBase"

const MODERN_THEME: NavTheme = {
  accent:     "#E8280A",
  prefix:     "nm",
  label:      "Modern",
  navBgDark:  "#111116",   // cool dark charcoal — clear contrast vs body #080808
}

export default function GlobalNavbarModern() {
  return <GlobalNavbarBase theme={MODERN_THEME} />
}