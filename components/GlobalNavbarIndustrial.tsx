"use client"

/* ================================================================
 * GlobalNavbarIndustrial.tsx
 * ----------------------------------------------------------------
 * Thin wrapper. All logic lives in GlobalNavbarBase.tsx.
 * Only the theme (accent + class prefix + label) differs between
 * this and GlobalNavbarModern. Do not add logic here — edit the
 * shared GlobalNavbarBase.tsx so both versions stay in sync.
 * ================================================================ */

import GlobalNavbarBase, { type NavTheme } from "@/components/GlobalNavbarBase"

const INDUSTRIAL_THEME: NavTheme = {
  accent:     "#1A1AFF",
  prefix:     "ni",
  label:      "Industrieel",
  navBgDark:  "#1A1816",
}

export default function GlobalNavbarIndustrial() {
  return <GlobalNavbarBase theme={INDUSTRIAL_THEME} />
}