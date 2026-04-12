"use client"

/* ================================================================
 * GlobalNavbarBase.tsx
 * ----------------------------------------------------------------
 * Single source of truth for both GlobalNavbarIndustrial and
 * GlobalNavbarModern. Wrappers only inject a theme.
 * ================================================================ */

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion"
import StyleToggle from "@/components/StyleToggle"
import { useStyle }  from "@/components/useStyle"

/* ----------------------------------------------------------------
 * Types
 * ---------------------------------------------------------------- */

export type NavTheme = {
  accent:    string
  prefix:    string
  label:     string
  navBgDark: string   // navbar bg in dark mode — distinct contrast from page body
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const EASE_MENU: [number, number, number, number] = [0.76, 0, 0.24, 1]

type NavLink = { label: string; href: string }
type Project = { name: string; href: string; year: string }

const NAV_LINKS: NavLink[] = [
  { label: "Welkom",     href: "/home" },
  { label: "Over mij",      href: "/about" },
  { label: "Projecten", href: "#projects" },
  { label: "Contact",   href: "/contact" },
]

const PROJECTS: Project[] = [
  { name: "Hélène Binet",    href: "/Architectuur", year: "2025" },
  { name: "CineCity",        href: "/CineCity",     year: "2026" },
  { name: "C for chocolate", href: "/Chocolate",    year: "2026" },
]

const MEMBER_LINKS = [
  { label: "Aanmelden",  href: "/login",     hint: "Gewone gebruiker" },
  { label: "Beheer",     href: "/admin",     hint: "Beheer & dashboard" },
  { label: "Beheerder",  href: "/adminuser", hint: "Beheer met gebruikersrol" },
]

/* ----------------------------------------------------------------
 * Utilities
 * ---------------------------------------------------------------- */

function hexAlpha(hex: string, a: number) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${a})`
}

/* ----------------------------------------------------------------
 * Persistent state — survives style/theme remounts
 * ---------------------------------------------------------------- */

function makePersistent<T>(initial: T) {
  let store = initial
  const listeners = new Set<(v: T) => void>()
  return function usePersistent(): [T, (v: T | ((p: T) => T)) => void] {
    const [val, setVal] = useState(store)
    useEffect(() => {
      const fn = (v: T) => setVal(v)
      listeners.add(fn)
      return () => { listeners.delete(fn) }
    }, [])
    const set = useCallback((v: T | ((p: T) => T)) => {
      const next = typeof v === "function" ? (v as (p: T) => T)(store) : v
      store = next
      listeners.forEach(fn => fn(next))
    }, [])
    return [val, set]
  }
}

const usePersistentMenuOpen = makePersistent<boolean>(false)
const usePersistentDark     = makePersistent<boolean>(true)

/* ----------------------------------------------------------------
 * HamburgerButton — animated 3-bar → X
 * ---------------------------------------------------------------- */

/* Bar widths for the asymmetric stacked-lines design:
 * top + bottom = full; middle = ⅔ width, left-aligned — gives intentional
 * typographic rhythm. On hover all lines reach full width. On open → X. */
const BAR_W = [22, 14, 22] as const

function HamburgerButton({
  open,
  accent,
  navInk,
  onClick,
}: {
  open: boolean
  accent: string
  navInk: string
  onClick: () => void
}) {
  const [hover, setHover] = useState(false)

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={open ? "Sluit menu" : "Open menu"}
      aria-expanded={open}
      aria-controls="global-nav-menu"
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.15 }}
      style={{
        width: 44, height: 44,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 6,
        background: "none", border: "none",
        cursor: "pointer", padding: 0,
        zIndex: 10000, position: "relative",
      }}
    >
      {BAR_W.map((w, i) => (
        <motion.span
          key={i}
          animate={open ? {
            y:       i === 0 ?  7.5 : i === 2 ? -7.5 : 0,
            rotate:  i === 0 ?  45  : i === 2 ? -45  : 0,
            opacity: i === 1 ? 0 : 1,
            scaleX:  i === 1 ? 0 : 1,
          } : {
            y: 0, rotate: 0, opacity: 1, scaleX: 1,
          }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{
            display: "block",
            /* middle bar extends on hover, shrinks when open */
            width: open ? (i === 1 ? 0 : 22) : (i === 1 && hover ? 22 : w),
            height: 1.5,
            borderRadius: 1,
            background: (open || hover) ? accent : navInk,
            transformOrigin: "center",
            transition: "width .4s cubic-bezier(0.16,1,0.3,1), background .3s",
          }}
        />
      ))}
    </motion.button>
  )
}

/* ----------------------------------------------------------------
 * ThemeToggle
 * ---------------------------------------------------------------- */

function ThemeToggle({
  isDark,
  onToggle,
  accent,
  ink,
}: {
  isDark: boolean
  onToggle: () => void
  accent: string
  ink: string
}) {
  const W = 44, H = 24, R = 9
  const PAD = 3
  const tx = isDark ? W - PAD - R : PAD + R

  return (
    <button
      onClick={onToggle}
      aria-label={isDark ? "Schakel naar licht thema" : "Schakel naar donker thema"}
      aria-pressed={isDark}
      style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        display: "flex", alignItems: "center",
      }}
    >
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
        <rect
          x="1" y="1" width={W - 2} height={H - 2} rx={(H - 2) / 2}
          fill={isDark ? hexAlpha(accent, 0.13) : hexAlpha(ink, 0.09)}
          stroke={isDark ? accent : ink}
          strokeWidth="0.8"
          style={{ transition: "all .35s" }}
        />
        <circle
          cx={tx} cy={H / 2} r={R - 1}
          fill={isDark ? accent : ink}
          style={{ transition: "all .35s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
    </button>
  )
}

/* ----------------------------------------------------------------
 * DiceLink — 3D flipping cube of text
 * ---------------------------------------------------------------- */

function DiceLink({
  label,
  href,
  prefix,
  onClick,
  asButton,
  buttonProps,
  trailing,
  isFirst,
}: {
  label: string
  href?: string
  prefix: string
  onClick?: () => void
  asButton?: boolean
  buttonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  trailing?: React.ReactNode
  isFirst?: boolean
}) {
  const inner = (
    <span className={`${prefix}-dice`}>
      <span className={`${prefix}-dice-cube`}>
        <span className={`${prefix}-dice-face ${prefix}-dice-front`}>{label}</span>
        <span className={`${prefix}-dice-face ${prefix}-dice-top`}>{label}</span>
      </span>
      {trailing}
    </span>
  )

  const className = `${prefix}-nav-item`

  if (asButton) {
    return (
      <button
        type="button"
        className={className}
        onClick={onClick}
        data-nav-first={isFirst || undefined}
        {...buttonProps}
      >
        {inner}
      </button>
    )
  }

  return (
    <Link
      href={href!}
      onClick={onClick}
      className={className}
      data-nav-first={isFirst || undefined}
    >
      {inner}
    </Link>
  )
}

/* ----------------------------------------------------------------
 * LockIcon
 * ---------------------------------------------------------------- */

function LockIcon({ color, size = 11 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" fill="none" aria-hidden>
      <rect x="1.5" y="4.5" width="7" height="5" rx="0.5" stroke={color} strokeWidth="0.8" />
      <path d="M3 4.5 V3 a2 2 0 0 1 4 0 V4.5" stroke={color} strokeWidth="0.8" />
    </svg>
  )
}

/* ================================================================
 * MAIN COMPONENT
 * ================================================================ */

export default function GlobalNavbarBase({ theme }: { theme: NavTheme }) {
  const { accent, prefix, label: themeLabel } = theme
  const { style, setStyle } = useStyle()

  const [menuOpen, setMenuOpen]       = usePersistentMenuOpen()
  const [projectOpen, setProjectOpen] = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [isDark, setIsDark]           = usePersistentDark()

  /* theme-aware palette — used for menu overlay content */
  const P = isDark
    ? { bg: "#080808", ink: "#F2F0EC", greyLt: "#2A2A28", mid: "#888884" }
    : { bg: "#F4F2EC", ink: "#0A0A0A", greyLt: "#D8D5CC", mid: "#6E6B63" }

  /* navbar-specific palette — always dark regardless of page theme */
  const NAV = isDark
    ? { bg: theme.navBgDark, ink: "#F2F0EC", mid: "#888884", greyLt: "#2A2A28" }
    : { bg: "#0A0A0A",       ink: "#F2F0EC", mid: "#888884", greyLt: "#2A2A28" }

  const menuRef  = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()
  const reduced  = useReducedMotion()

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    fn()
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("theme-light", !isDark)
    document.documentElement.classList.toggle("theme-dark",   isDark)
    window.dispatchEvent(new CustomEvent("theme-change", { detail: { isDark } }))
  }, [isDark])

  useEffect(() => {
    setMenuOpen(false)
    setProjectOpen(false)
  }, [pathname, setMenuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false) }
    window.addEventListener("keydown", onKey)
    const t = window.setTimeout(() => {
      menuRef.current?.querySelector<HTMLElement>("[data-nav-first]")?.focus()
    }, 500)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.clearTimeout(t)
    }
  }, [menuOpen, setMenuOpen])

  const linkVariants = {
    closed: { y: 60, opacity: 0 },
    open: (i: number) => ({
      y: 0, opacity: 1,
      transition: { duration: 0.65, ease: EASE, delay: 0.3 + i * 0.07 },
    }),
  }

  const REVEAL_R = 2400

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&display=swap');

        /* ---------- NAV ITEM ---------- */
        .${prefix}-nav-item {
          position: relative;
          display: block;
          padding: 6px 0;
          width: 100%;
          text-align: left;
          text-decoration: none;
          background: none;
          border: none;
          color: ${P.ink};
          cursor: pointer;
          font: inherit;
        }

        /* ---------- DICE FLIP TYPOGRAPHY ---------- */
        .${prefix}-dice {
          display: inline-flex;
          align-items: center;
          gap: 18px;
          perspective: 700px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(64px, 10vw, 150px);
          line-height: 0.9;
          letter-spacing: -0.01em;
        }
        .${prefix}-dice-cube {
          position: relative;
          display: inline-block;
          transform-style: preserve-3d;
          transform-origin: 50% 50% -0.45em;
          transition: transform .55s cubic-bezier(0.16,1,0.3,1);
          will-change: transform;
        }
        .${prefix}-dice-face {
          display: inline-block;
          backface-visibility: hidden;
        }
        .${prefix}-dice-front { color: ${P.ink}; }
        .${prefix}-dice-top {
          position: absolute;
          inset: 0;
          color: ${accent};
          transform: rotateX(90deg);
          transform-origin: 50% 50% -0.45em;
        }
        .${prefix}-nav-item:hover .${prefix}-dice-cube,
        .${prefix}-nav-item:focus-visible .${prefix}-dice-cube {
          transform: rotateX(-90deg);
        }

        /* ---------- HEADER ---------- */
        :root { --navbar-h: 72px; }

        .${prefix}-header-bar {
          max-width: 1320px;
          margin: 0 auto;
          padding: 0 32px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .${prefix}-header-logo {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          pointer-events: auto;
          z-index: 1;
        }
        .${prefix}-header-logo img {
          width: 42px;
          height: 42px;
          object-fit: contain;
          filter: brightness(0) invert(1);
          opacity: 0.9;
          transition: opacity .3s, transform .3s cubic-bezier(0.16,1,0.3,1);
          display: block;
        }
        .${prefix}-header-logo:hover img {
          opacity: 1;
          transform: scale(1.08);
        }

        .${prefix}-header-toggles {
          display: flex;
          align-items: center;
          gap: 18px;
          flex-shrink: 0;
        }
        /* Wrapper around the style toggle — hidden on mobile */
        .${prefix}-style-group {
          display: flex;
          align-items: center;
        }
        /* Divider between style group and theme group — hidden on mobile */
        .${prefix}-divider-style {
          width: 1px;
          height: 18px;
          background: ${NAV.greyLt};
          flex-shrink: 0;
        }
        /* ---- MENU STYLE SELECTOR (mobile only, top of menu) ---- */
        .${prefix}-style-sel { display: none; }

        .${prefix}-style-sel-opts {
          display: grid;
          grid-template-columns: 1fr 1px 1fr;
          align-items: stretch;
          border: 1px solid ${P.greyLt};
        }
        .${prefix}-style-sel-sep {
          background: ${P.greyLt};
          display: block;
        }
        .${prefix}-style-sel-opt {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 22px 24px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background .25s;
        }
        .${prefix}-style-sel-opt:hover {
          background: ${hexAlpha(accent, 0.04)};
        }
        .${prefix}-style-sel-opt--active {
          background: ${hexAlpha(accent, 0.06)};
        }
        .${prefix}-style-sel-name {
          display: block;
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 8vw, 52px);
          line-height: 0.9;
          letter-spacing: 0.01em;
          transition: color .25s;
        }
        .${prefix}-style-sel-opt--active .${prefix}-style-sel-name { color: ${accent}; }
        .${prefix}-style-sel-opt:not(.${prefix}-style-sel-opt--active) .${prefix}-style-sel-name { color: ${P.mid}; }

        .${prefix}-style-sel-sub {
          display: block;
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .26em;
          text-transform: uppercase;
          transition: color .25s;
        }
        .${prefix}-style-sel-opt--active .${prefix}-style-sel-sub { color: ${accent}; opacity: 0.7; }
        .${prefix}-style-sel-opt:not(.${prefix}-style-sel-opt--active) .${prefix}-style-sel-sub { color: ${P.mid}; opacity: 0.5; }

        /* Active bar — left edge of the active option */
        .${prefix}-style-sel-opt--active { position: relative; }
        .${prefix}-style-sel-opt--active::before {
          content: '';
          position: absolute;
          top: 0; bottom: 0; left: 0;
          width: 2px;
          background: ${accent};
        }
        .${prefix}-header-toggle-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .${prefix}-header-toggle-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .28em;
          text-transform: uppercase;
          color: ${NAV.mid};
        }
        .${prefix}-header-toggle-readout {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: ${accent};
          min-width: 64px;
        }
        .${prefix}-header-divider {
          width: 1px;
          height: 18px;
          background: ${NAV.greyLt};
        }

        /* ---------- MENU LAYOUT ---------- */
        .${prefix}-menu-inner {
          max-width: 1320px;
          margin: 0 auto;
          width: 100%;
          padding: 130px 32px 60px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 56px;
        }

        .${prefix}-menu-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(320px, 420px);
          gap: 100px;
          flex: 1;
          align-items: start;
        }

        /* ---------- PROJECT SUB-LIST ---------- */
        .${prefix}-proj-sub {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 16px;
          padding: 14px 20px 14px 28px;
          border-left: 1px solid ${P.greyLt};
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          letter-spacing: .16em;
          text-transform: uppercase;
          text-decoration: none;
          color: ${P.mid};
          transition: color .25s, border-color .25s, transform .4s cubic-bezier(0.16,1,0.3,1);
        }
        .${prefix}-proj-sub:hover {
          color: ${P.ink};
          border-left-color: ${accent};
          transform: translateX(10px);
        }
        .${prefix}-proj-name { color: ${P.ink}; }
        .${prefix}-proj-year { color: ${accent}; font-size: 10px; white-space: nowrap; }

        /* ---------- TESTZONE ASIDE ---------- */
        .${prefix}-testzone {
          position: relative;
          justify-self: end;
          width: 100%;
          max-width: 420px;
          margin-top: 24px;
          border: 1px solid ${P.greyLt};
          padding: 32px 28px;
          background:
            radial-gradient(120% 80% at 100% 0%, ${hexAlpha(accent, 0.07)}, transparent 60%),
            ${hexAlpha(P.ink, 0.015)};
        }
        .${prefix}-testzone-corner {
          position: absolute;
          width: 26px; height: 26px;
          border-color: ${accent};
        }
        .${prefix}-testzone-corner.tr { top: 0; right: 0; border-top: 1px solid; border-right: 1px solid; }
        .${prefix}-testzone-corner.bl { bottom: 0; left: 0; border-bottom: 1px solid; border-left: 1px solid; }

        .${prefix}-testzone-tag {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 12px;
          border: 1px solid ${hexAlpha(accent, 0.4)};
          background: ${hexAlpha(accent, 0.08)};
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .28em;
          text-transform: uppercase;
          color: ${accent};
          margin-bottom: 18px;
        }
        .${prefix}-testzone-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(32px, 3.4vw, 44px);
          line-height: .95;
          letter-spacing: -0.01em;
          color: ${P.ink};
          margin-bottom: 12px;
        }
        .${prefix}-testzone-title em {
          font-style: normal;
          color: ${accent};
        }
        .${prefix}-testzone-desc {
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          line-height: 1.7;
          letter-spacing: .04em;
          color: ${P.mid};
          margin-bottom: 24px;
          max-width: 38ch;
        }

        .${prefix}-test-link {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
          border-top: 1px solid ${P.greyLt};
          text-decoration: none;
          color: ${P.ink};
          transition: transform .35s cubic-bezier(0.16,1,0.3,1);
        }
        .${prefix}-test-link:last-child { border-bottom: 1px solid ${P.greyLt}; }
        .${prefix}-test-link:hover { transform: translateX(8px); }
        .${prefix}-test-link:hover .${prefix}-test-arrow { color: ${accent}; transform: translateX(4px); }

        .${prefix}-test-label {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .${prefix}-test-label-main {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: .02em;
          line-height: 1;
          color: ${P.ink};
        }
        .${prefix}-test-label-hint {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: ${P.mid};
        }
        .${prefix}-test-arrow {
          font-family: 'DM Mono', monospace;
          font-size: 16px;
          color: ${P.mid};
          transition: color .25s, transform .35s cubic-bezier(0.16,1,0.3,1);
        }

        /* ---------- FOOTER ---------- */
        .${prefix}-menu-footer {
          position: relative;
          border-top: 1px solid ${P.greyLt};
          padding: 18px 32px;
          max-width: 1320px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 24px;
        }

        /* ---------- FOCUS ---------- */
        .${prefix}-nav-item:focus-visible,
        .${prefix}-proj-sub:focus-visible,
        .${prefix}-test-link:focus-visible {
          outline: 1px solid ${accent};
          outline-offset: 6px;
        }

        /* ---------- RESPONSIVE ---------- */
        @media (max-width: 1000px) {
          .${prefix}-menu-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 48px;
          }
          .${prefix}-testzone { justify-self: stretch; max-width: 100%; margin-top: 0; }
        }
        @media (max-width: 780px) {
          :root { --navbar-h: 64px; }
          .${prefix}-header-bar { padding: 0 20px; height: 64px; }
          .${prefix}-header-toggles { gap: 12px; }
          .${prefix}-header-toggle-label,
          .${prefix}-header-toggle-readout { display: none; }
          .${prefix}-header-logo img { width: 34px; height: 34px; }
          /* On mobile: hide style toggle + its divider from the header */
          .${prefix}-style-group   { display: none; }
          .${prefix}-divider-style { display: none; }
          /* On mobile: show the prominent style selector inside the menu */
          .${prefix}-style-sel { display: block; }

          .${prefix}-menu-inner { padding: 100px 20px 40px; gap: 36px; }
          .${prefix}-dice { font-size: clamp(54px, 14vw, 96px); gap: 14px; }

          .${prefix}-proj-sub {
            padding: 12px 20px 12px 18px;
            font-size: 11px;
          }
          .${prefix}-testzone { padding: 24px 22px; }
        }
        @media (max-width: 560px) {
          .${prefix}-menu-footer {
            grid-template-columns: 1fr;
            gap: 8px;
            padding: 16px 20px;
            text-align: center;
          }
          .${prefix}-menu-footer > *:last-child { text-align: center !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .${prefix}-dice-cube,
          .${prefix}-nav-item,
          .${prefix}-proj-sub,
          .${prefix}-test-link {
            transition: none !important;
          }
          .${prefix}-nav-item:hover .${prefix}-dice-cube { transform: none; }
          .${prefix}-nav-item:hover .${prefix}-dice-front { color: ${accent}; }
        }
      `}</style>

      {/* ============== HEADER ============== */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 9000,
          background: NAV.bg,
          borderBottom: scrolled && !menuOpen
            ? `1px solid ${hexAlpha(NAV.ink, 0.08)}`
            : "1px solid transparent",
        }}
      >
        {/* top accent line */}
        <div
          style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 1,
            background: `linear-gradient(90deg, ${accent}, ${accent}55 40%, transparent)`,
            boxShadow: `0 0 12px ${accent}66`,
            opacity: menuOpen ? 0 : 1,
            transition: "opacity .4s",
          }}
        />

        <div className={`${prefix}-header-bar`}>
          {/* LEFT — hamburger */}
          <HamburgerButton
            open={menuOpen}
            accent={accent}
            navInk={NAV.ink}
            onClick={() => setMenuOpen(v => !v)}
          />

          {/* CENTER — logo linked to home */}
          <Link
            href="/home"
            aria-label="Home"
            className={`${prefix}-header-logo`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo.png" alt="Logo" width={26} height={26} />
          </Link>

          {/* RIGHT — style toggle (desktop only) + theme toggle (always) */}
          <div
            className={`${prefix}-header-toggles`}
            style={{ position: "relative", zIndex: 10000 }}
          >
            {/* Style toggle: visible on desktop, hidden on mobile via CSS */}
            <div className={`${prefix}-style-group`} aria-label="Wissel visuele stijl">
              <StyleToggle />
            </div>

            {/* Divider: hides with style group on mobile */}
            <span className={`${prefix}-divider-style`} />

            {/* Theme toggle: always visible */}
            <div className={`${prefix}-header-toggle-group`} aria-label="Wissel kleurthema">
              <span className={`${prefix}-header-toggle-label`}>Thema</span>
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(v => !v)} accent={accent} ink={NAV.ink} />
            </div>
          </div>
        </div>

        {/* scroll progress bar */}
        <motion.div
          style={{
            position: "absolute", left: 0, bottom: 0, height: 1,
            background: accent,
            transformOrigin: "0% 50%",
            scaleX: progress,
            width: "100%",
            opacity: menuOpen ? 0 : 0.9,
            boxShadow: `0 0 8px ${accent}88`,
          }}
        />
      </header>

      {/* ============== MENU OVERLAY ============== */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="global-nav-menu"
            ref={menuRef}
            role="dialog"
            aria-modal="true"
            aria-label="Hoofdnavigatie"
            initial={{ pointerEvents: "none" }}
            animate={{ pointerEvents: "auto" }}
            exit={{ pointerEvents: "none" }}
            style={{ position: "fixed", inset: 0, zIndex: 8900, overflow: "hidden" }}
          >
            <motion.div
              initial={{ clipPath: `circle(0px at 54px 36px)` }}
              animate={{ clipPath: `circle(${REVEAL_R}px at 54px 36px)` }}
              exit={{    clipPath: `circle(0px at 54px 36px)` }}
              transition={{ duration: reduced ? 0.2 : 0.7, ease: EASE_MENU }}
              style={{ position: "absolute", inset: 0, background: accent }}
            />
            <motion.div
              initial={{ clipPath: `circle(0px at 54px 36px)` }}
              animate={{ clipPath: `circle(${REVEAL_R}px at 54px 36px)` }}
              exit={{    clipPath: `circle(0px at 54px 36px)` }}
              transition={{ duration: reduced ? 0.2 : 0.65, ease: EASE_MENU, delay: reduced ? 0 : 0.16 }}
              style={{ position: "absolute", inset: 0, background: P.bg }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: reduced ? 0 : 0.35 }}
              style={{
                position: "relative", zIndex: 2,
                height: "100%",
                display: "flex", flexDirection: "column",
                overflowY: "auto",
              }}
            >
              <div className={`${prefix}-menu-inner`}>

                {/* MOBILE ONLY — prominent style selector at the top of the menu */}
                <motion.div
                  className={`${prefix}-style-sel`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: reduced ? 0 : 0.22 }}
                >
                  <div className={`${prefix}-style-sel-opts`}>
                    <button
                      onClick={() => setStyle("industrial")}
                      className={`${prefix}-style-sel-opt${style === "industrial" ? ` ${prefix}-style-sel-opt--active` : ""}`}
                      aria-pressed={style === "industrial"}
                    >
                      <span className={`${prefix}-style-sel-name`}>Industrieel</span>
                      <span className={`${prefix}-style-sel-sub`}>Stijl A</span>
                    </button>
                    <span className={`${prefix}-style-sel-sep`} />
                    <button
                      onClick={() => setStyle("modern")}
                      className={`${prefix}-style-sel-opt${style === "modern" ? ` ${prefix}-style-sel-opt--active` : ""}`}
                      aria-pressed={style === "modern"}
                    >
                      <span className={`${prefix}-style-sel-name`}>Modern</span>
                      <span className={`${prefix}-style-sel-sub`}>Stijl B</span>
                    </button>
                  </div>
                </motion.div>

                <div className={`${prefix}-menu-grid`}>
                  {/* ---- LEFT: nav links ---- */}
                  <nav style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {NAV_LINKS.map((link, i) => {
                      const isProjects = link.href === "#projects"
                      return (
                        <motion.div
                          key={link.href}
                          custom={i}
                          variants={linkVariants}
                          initial="closed"
                          animate="open"
                        >
                          {isProjects ? (
                            <div>
                              <DiceLink
                                label={link.label}
                                prefix={prefix}
                                asButton
                                isFirst={i === 0}
                                onClick={() => setProjectOpen(v => !v)}
                                buttonProps={{ "aria-expanded": projectOpen }}
                                trailing={
                                  <motion.span
                                    animate={{ rotate: projectOpen ? 90 : 0 }}
                                    transition={{ duration: 0.35, ease: EASE }}
                                    style={{
                                      display: "inline-block",
                                      color: accent,
                                      fontSize: "0.32em",
                                      lineHeight: 1,
                                    }}
                                  >
                                    →
                                  </motion.span>
                                }
                              />

                              <AnimatePresence>
                                {projectOpen && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: EASE }}
                                    style={{ overflow: "hidden", paddingLeft: 8, paddingTop: 12 }}
                                  >
                                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                      {PROJECTS.map((p, pi) => (
                                        <motion.div
                                          key={p.href}
                                          initial={{ x: -20, opacity: 0 }}
                                          animate={{ x: 0, opacity: 1 }}
                                          transition={{ duration: 0.45, ease: EASE, delay: 0.05 + pi * 0.06 }}
                                        >
                                          <Link
                                            href={p.href}
                                            className={`${prefix}-proj-sub`}
                                            onClick={() => setMenuOpen(false)}
                                          >
                                            <span className={`${prefix}-proj-name`}>{p.name}</span>
                                            <span className={`${prefix}-proj-year`}>{p.year}</span>
                                          </Link>
                                        </motion.div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ) : (
                            <DiceLink
                              label={link.label}
                              href={link.href}
                              prefix={prefix}
                              isFirst={i === 0}
                              onClick={() => setMenuOpen(false)}
                            />
                          )}
                        </motion.div>
                      )
                    })}
                  </nav>

                  {/* ---- RIGHT: testzone (Behind the scenes) ---- */}
                  <motion.aside
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: EASE, delay: reduced ? 0 : 0.6 }}
                    className={`${prefix}-testzone`}
                  >
                    <span className={`${prefix}-testzone-corner tr`} />
                    <span className={`${prefix}-testzone-corner bl`} />

                    <div className={`${prefix}-testzone-tag`}>
                      <LockIcon color={accent} size={9} />
                      <span>Testzone</span>
                    </div>

                    <div className={`${prefix}-testzone-title`}>
                      Achter de <em>schermen</em>.
                    </div>
                    <div className={`${prefix}-testzone-desc`}>
                      Hier mag je rondklikken. Login als gebruiker, bekijk het admin-dashboard,
                      of switch tussen rollen — alles is bedoeld om te testen.
                    </div>

                    <div>
                      {MEMBER_LINKS.map(link => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className={`${prefix}-test-link`}
                          onClick={() => setMenuOpen(false)}
                        >
                          <LockIcon color={accent} size={11} />
                          <span className={`${prefix}-test-label`}>
                            <span className={`${prefix}-test-label-main`}>{link.label}</span>
                            <span className={`${prefix}-test-label-hint`}>{link.hint}</span>
                          </span>
                          <span className={`${prefix}-test-arrow`}>→</span>
                        </Link>
                      ))}
                    </div>
                  </motion.aside>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: reduced ? 0 : 0.7 }}
                className={`${prefix}-menu-footer`}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.9, ease: EASE, delay: reduced ? 0 : 0.8 }}
                  style={{
                    position: "absolute", left: 32, right: 32, top: 0, height: 1,
                    background: `linear-gradient(90deg, ${accent}, ${accent}44 60%, transparent)`,
                    transformOrigin: "0% 50%",
                    boxShadow: `0 0 8px ${accent}55`,
                  }}
                />
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 9,
                  letterSpacing: ".25em", textTransform: "uppercase", color: P.mid,
                }}>
                  Jarne Waterschoot — Portfolio
                </span>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 10,
                  letterSpacing: ".2em", color: accent,
                }}>
                  {themeLabel}
                </span>
                <span style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 9,
                  letterSpacing: ".25em", textTransform: "uppercase",
                  color: P.mid, textAlign: "right",
                }}>
                  © {new Date().getFullYear()}
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )
}