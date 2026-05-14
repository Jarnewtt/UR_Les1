"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FiInstagram, FiMail } from "react-icons/fi"
import { trackSocialClick, trackFooterLinkClick } from "@/lib/analytics"

type Theme = {
  bg: string; surface: string; ink: string; inkSub: string
  inkMuted: string; blue: string; border: string; isLight: boolean
}

const DARK: Theme  = { bg:"#080808", surface:"#111111", ink:"#F0EDF0", inkSub:"#AEAEAE", inkMuted:"#545454", blue:"#1A1AFF", border:"#1E1E1E", isLight:false }
const LIGHT: Theme = { bg:"#F5F4F0", surface:"#ECEAE6", ink:"#0A0A0A", inkSub:"#3A3A36", inkMuted:"#888884", blue:"#1A1AFF", border:"#D4D4D0", isLight:true  }

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

const FOOTER_LINKS = [
  { name: "Gebruiksvoorwaarden", href: "/terms-of-agreement"    },
  { name: "Auteursrecht",        href: "/copyright-regulations" },
  { name: "Cookie-instellingen", href: "/cookie-settings"       },
]

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/jarne_wtt/", icon: "instagram" },
  { label: "jarnewaterschoot@hotmail.com", href: "mailto:jarnewaterschoot@hotmail.com", icon: "mail" },
]

interface FooterProps { accentColor?: string; onClose?: () => void }

export default function FooterIndustrial({ accentColor: _accentColor, onClose }: FooterProps) {
  const C = useTheme()
  const router = useRouter()
  const year = new Date().getFullYear()
  const T = "background 0.4s, color 0.4s, border-color 0.4s"

  return (
    <footer style={{
      background: C.bg, color: C.ink,
      fontFamily: "Inter, system-ui, sans-serif",
      borderTop: `1px solid ${C.border}`,
      position: "relative", overflow: "hidden",
      transition: T,
    }}>
      <style>{`
        @keyframes avail-pulse {
          0%, 100% { opacity:1; transform:scale(1); }
          50%       { opacity:0.35; transform:scale(1.7); }
        }
        .footer-avail-dot { animation: avail-pulse 2.4s ease-in-out infinite; }
        .footer-link { transition: color 0.22s; }
        .footer-link:hover { color: var(--f-blue) !important; }
      `}</style>

      {/* Top cobalt accent line — mirrors the hero */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${C.blue}, ${C.blue}55 60%, transparent)`,
      }} />

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 clamp(24px,5vw,72px)" }}>

        {/* ── MAIN ROW ────────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "flex-end",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: "32px 48px",
          padding: "52px 0 40px",
          borderBottom: `1px solid ${C.border}`,
          transition: T,
        }}>

          {/* Name block — identical treatment to hero */}
          <div>
            <div style={{
              fontFamily: "'Anton', Impact, sans-serif",
              fontSize: "clamp(36px, 6vw, 72px)",
              textTransform: "uppercase", lineHeight: 0.9,
              letterSpacing: "0.01em", color: C.ink, transition: "color 0.4s",
            }}>
              JARNE
            </div>
            <div style={{
              fontFamily: "'Anton', Impact, sans-serif",
              fontSize: "clamp(20px, 3.4vw, 40px)",
              textTransform: "uppercase", lineHeight: 1,
              letterSpacing: "0.02em",
              color: C.blue,
            }}>
              WATERSCHOOT
            </div>

            {/* Availability */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginTop: 18,
            }}>
              <motion.span
                animate={{ scale: [1, 1.7, 1], opacity: [1, 0.35, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 5, height: 5, borderRadius: "50%", background: C.blue, display: "inline-block", flexShrink: 0 }}
              />
              <span style={{
                fontFamily: "Inter, sans-serif", fontSize: 14,
                letterSpacing: "0.28em", textTransform: "uppercase", color: C.blue,
              }}>
                Beschikbaar voor projecten
              </span>
            </div>
          </div>

          {/* Right column — tagline + socials */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28, alignItems: "flex-start" }}>

            {/* Tagline */}
            <p style={{
              fontFamily: "Inter, sans-serif", fontStyle: "italic", fontWeight: 300,
              fontSize: "clamp(16px,1.4vw,20px)", lineHeight: 1.8,
              color: C.inkSub, maxWidth: "30ch", margin: 0, transition: "color 0.4s",
            }}>
              Tastbare visuele verhalen.<br />
              Strategie en esthetiek voor merken die durven opvallen.
            </p>

            {/* Social links */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{
                fontSize: 14, letterSpacing: "0.32em", textTransform: "uppercase",
                color: C.inkMuted, display: "flex", alignItems: "center", gap: 10,
                transition: "color 0.4s",
              }}>
                <span style={{ width: 20, height: 1, background: C.blue, display: "inline-block", flexShrink: 0 }} />
                Socials
              </div>
              {SOCIAL_LINKS.map(s => (
                <Link
                  key={s.label}
                  href={s.href}
                  target={s.icon === "instagram" ? "_blank" : undefined}
                  rel={s.icon === "instagram" ? "noopener noreferrer" : undefined}
                  onClick={() => trackSocialClick(s.icon === "instagram" ? "instagram" : "email", "footer")}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 10,
                    textDecoration: "none",
                    fontFamily: "Inter, sans-serif", fontSize: 14,
                    letterSpacing: "0.1em",
                    color: C.blue, transition: "opacity 0.22s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  {s.icon === "instagram" ? <FiInstagram size={16} /> : <FiMail size={16} />}
                  {s.label}
                </Link>
              ))}
            </div>

          </div>
        </div>

        {/* ── BOTTOM BAR ────────────────────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap",
          gap: 16, padding: "16px 0 24px",
        }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {FOOTER_LINKS.map(link => (
              <button
                key={link.name}
                onClick={() => {
                  trackFooterLinkClick(link.name)
                  onClose?.()
                  router.push(link.href)
                }}
                style={{
                  background: "none", border: "none", padding: 0, cursor: "pointer",
                  fontFamily: "Inter, sans-serif", fontSize: 14,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  color: C.inkMuted, transition: "color 0.22s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = C.blue)}
                onMouseLeave={e => (e.currentTarget.style.color = C.inkMuted)}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: "Inter, sans-serif", fontSize: 14,
            letterSpacing: "0.24em", textTransform: "uppercase",
            color: C.inkMuted, transition: "color 0.4s",
          }}>
            <span style={{ width: 16, height: 1, background: C.border, display: "inline-block", transition: "background 0.4s" }} />
            © {year} Jarne Waterschoot — België
          </div>
        </div>

      </div>
    </footer>
  )
}
