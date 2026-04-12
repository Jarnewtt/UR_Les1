"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

// ── TOKENS ────────────────────────────────────────────────────────────────────
type Theme = {
  bg: string; surface: string; ink: string; inkSub: string; inkMuted: string
  orange: string; border: string; isLight: boolean
}
const DARK: Theme  = { bg:"#080807", surface:"#111110", ink:"#F0EDE8", inkSub:"#C8C4BE", inkMuted:"#888480", orange:"#FF5C1A", border:"#262420", isLight:false }
const LIGHT: Theme = { bg:"#FAFAF8", surface:"#F0EDE8", ink:"#0A0908",  inkSub:"#3A3530", inkMuted:"#4E4A46", orange:"#E84000", border:"#DDD8D0", isLight:true  }
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

// ── SCHEMA ────────────────────────────────────────────────────────────────────
const schema = z.object({
  name:    z.string().min(2, "Naam is verplicht"),
  email:   z.string().refine(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: "Ongeldig e-mailadres" }),
  subject: z.string().min(3, "Onderwerp is verplicht"),
  message: z.string().min(10, "Bericht is te kort"),
})
type FormValues = z.infer<typeof schema>

// ── MASK REVEAL ───────────────────────────────────────────────────────────────
function MaskReveal({ children, delay = 0, style = {} }: {
  children: React.ReactNode; delay?: number; style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-4%" })
  return (
    <div ref={ref} style={{ overflow: "hidden", ...style }}>
      <motion.div
        initial={{ y: "105%" }}
        animate={inView ? { y: "0%" } : {}}
        transition={{ duration: 0.95, delay, ease: E }}
      >{children}</motion.div>
    </div>
  )
}

// ── NUMBERED FIELD ────────────────────────────────────────────────────────────
function Field({
  num, label, error, C, children,
}: {
  num: string; label: string; error?: string; C: Theme; children: React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: E }}
      style={{ display: "flex", gap: "clamp(16px,3vw,36px)", alignItems: "flex-start" }}
    >
      {/* Number */}
      <span style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(32px,4vw,52px)", lineHeight: 1,
        color: `${C.orange}55`, flexShrink: 0,
        paddingTop: 14, minWidth: "clamp(32px,4vw,52px)", textAlign: "right",
      }}>{num}</span>

      {/* Input block */}
      <div style={{ flex: 1, borderTop: `1px solid ${C.border}`, paddingTop: 14, transition: "border-color 0.4s" }}>
        <div style={{
          fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase",
          fontFamily: "'DM Mono', monospace", color: C.inkMuted,
          marginBottom: 10, transition: "color 0.4s",
        }}>{label}</div>
        {children}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              style={{ fontSize: 9, letterSpacing: "0.15em", marginTop: 8, color: C.orange, overflow: "hidden" }}
            >— {error}</motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function ContactPageIndustrial() {
  const C = useTheme()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLElement>(null)
  const TT = "background 0.5s ease, color 0.5s ease, border-color 0.5s ease"

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(_data: FormValues) {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    setSubmitted(true)
    reset()
    setTimeout(() => setSubmitted(false), 7000)
  }

  return (
    <div style={{
      background: C.bg, minHeight: "100vh", color: C.ink,
      fontFamily: "'DM Mono', monospace",
      transition: TT, overflowX: "hidden",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::selection { background: ${C.orange}55; color: ${C.ink}; }
        ::-webkit-scrollbar { width: 1px; }
        ::-webkit-scrollbar-thumb { background: ${C.orange}33; }

        .c-inp {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid ${C.border};
          padding: 12px 0;
          color: ${C.ink};
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(15px,1.6vw,17px);
          font-weight: 300;
          outline: none;
          transition: border-color 0.3s ease;
          border-radius: 0;
        }
        .c-inp::placeholder { color: ${C.inkMuted}; }
        .c-inp:focus { border-bottom-color: ${C.orange}; }

        .c-fields-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(24px,4vw,0px);
        }
        @media (min-width: 620px) {
          .c-fields-row { grid-template-columns: 1fr 1fr; gap: clamp(24px,4vw,48px); }
        }

        .info-strip {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 720px) {
          .info-strip { grid-template-columns: 1fr 1fr 1fr; }
        }

        /* Mobile-only info item: bottom border + no right border */
        .info-item {
          border-bottom: 1px solid var(--border);
          border-right: none !important;
        }
        .info-item:last-child { border-bottom: none; }
        @media (min-width: 720px) {
          .info-item {
            border-bottom: none !important;
            border-right: 1px solid var(--border) !important;
          }
          .info-item:last-child { border-right: none !important; }
        }

        /* Hide inline CTA on mobile, show standalone */
        .cta-inline  { display: none; }
        .cta-standalone { display: flex; }
        @media (min-width: 560px) {
          .cta-inline { display: inline-flex; }
          .cta-standalone { display: none; }
        }
      `}</style>

      {/* Grain */}
      <svg style={{ position:"fixed", inset:0, zIndex:0, opacity: C.isLight ? 0.015 : 0.035, pointerEvents:"none", width:"100%", height:"100%" }}>
        <filter id="cg">
          <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves={4} stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#cg)"/>
      </svg>

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* ─────────────────────────────────────── HERO ── */}
        <section style={{
          minHeight: "100svh",
          padding: "clamp(90px,13vh,140px) clamp(20px,5vw,72px) 0",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          borderBottom: `1px solid ${C.border}`, transition: TT,
        }}>

          {/* Label */}
          <motion.div
            initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: E }}
            style={{ display: "flex", alignItems: "center", gap: 14 }}
          >
            <span style={{ fontSize: 9, letterSpacing: "0.36em", textTransform: "uppercase", color: C.inkMuted }}>04</span>
            <div style={{ width: 28, height: 1, background: C.orange }}/>
            <span style={{ fontSize: 9, letterSpacing: "0.36em", textTransform: "uppercase", color: C.orange }}>Contact</span>

            {/* Availability dot */}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <motion.div
                animate={{ opacity: [1, 0.3, 1] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }}
              />
              <span style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: C.inkMuted }}>
                Beschikbaar
              </span>
            </div>
          </motion.div>

          {/* Main title */}
          <div style={{ paddingTop: "clamp(36px,8vw,96px)", paddingBottom: "clamp(32px,5vw,64px)" }}>

            {/* "Van een" — normaal */}
            <MaskReveal>
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(68px,16vw,148px)",
                lineHeight: 0.88, letterSpacing: "0.01em",
                color: C.ink, margin: 0, transition: TT,
              }}>Van een</h1>
            </MaskReveal>

            {/* "witblad" — leeg, stroke outline */}
            <MaskReveal delay={0.07}>
              <h1 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(68px,16vw,148px)",
                lineHeight: 0.88, letterSpacing: "0.01em",
                WebkitTextStroke: `clamp(1px,0.2vw,1.5px) ${C.inkMuted}`,
                color: "transparent",
                margin: 0,
              }}>witblad</h1>
            </MaskReveal>

            {/* Transitieregel */}
            <MaskReveal delay={0.14}>
              <div style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "clamp(14px,2vw,22px) 0",
              }}>
                <motion.div
                  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.7, ease: E }}
                  style={{ width: "clamp(28px,4vw,56px)", height: 1, background: `${C.orange}77`, transformOrigin: "left", flexShrink: 0 }}
                />
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "clamp(9px,1.1vw,10px)",
                  letterSpacing: "0.36em", textTransform: "uppercase",
                  color: C.inkMuted,
                }}>naar een</span>
              </div>
            </MaskReveal>

            {/* "blikvanger" — vol, oranje impact */}
            <MaskReveal delay={0.2}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "clamp(16px,3vw,40px)", flexWrap: "wrap" }}>
                <h1 style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(68px,16vw,148px)",
                  lineHeight: 0.88, letterSpacing: "0.01em",
                  color: C.orange, margin: 0,
                }}>blikvanger</h1>
                {/* Desktop-only inline CTA */}
                <motion.button
                  className="cta-inline"
                  onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0.7 }}
                  whileHover={{ backgroundColor: `${C.orange}18`, borderColor: C.orange, color: C.orange }}
                  style={{
                    background: "none", border: `1px solid ${C.border}`,
                    color: C.inkMuted, padding: "12px 24px",
                    fontFamily: "'DM Mono', monospace", fontSize: 9,
                    letterSpacing: "0.26em", textTransform: "uppercase",
                    cursor: "pointer", transition: "all 0.3s ease",
                    marginBottom: 12, flexShrink: 0, alignItems: "center",
                  }}
                >Schrijf me ↓</motion.button>
              </div>
            </MaskReveal>

            {/* Mobile-only standalone CTA */}
            <motion.div
              className="cta-standalone"
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
              style={{ marginTop: "clamp(24px,4vw,0px)" }}
            >
              <motion.button
                onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%", background: C.orange, color: "#fff",
                  border: "none", padding: "18px 24px",
                  fontFamily: "'DM Mono', monospace", fontSize: 9,
                  letterSpacing: "0.28em", textTransform: "uppercase",
                  cursor: "pointer", display: "flex",
                  justifyContent: "space-between", alignItems: "center",
                }}
              >
                <span>Schrijf me</span>
                <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>↓</motion.span>
              </motion.button>
            </motion.div>
          </div>

          {/* Info strip */}
          <div className="info-strip" style={{ borderTop: `1px solid ${C.border}`, transition: TT }}>

            {[
              { label: "E-mail", delay: 0,    content: <a href="mailto:jarnewaterschoot@hotmail.com" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(13px,1.4vw,16px)", color:C.ink, textDecoration:"none", transition:"color 0.3s", wordBreak:"break-all" }} onMouseEnter={e=>(e.currentTarget.style.color=C.orange)} onMouseLeave={e=>(e.currentTarget.style.color=C.ink)}>jarnewaterschoot@hotmail.com ↗</a> },
              { label: "Instagram", delay: 0.08, content: <a href="https://www.instagram.com/jarne_wtt" target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(13px,1.4vw,16px)", color:C.ink, textDecoration:"none", transition:"color 0.3s" }} onMouseEnter={e=>(e.currentTarget.style.color=C.orange)} onMouseLeave={e=>(e.currentTarget.style.color=C.ink)}>@jarne_wtt ↗</a> },
              { label: "Locatie",   delay: 0.16, content: <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:"clamp(13px,1.4vw,16px)", color:C.inkSub }}>Antwerpen, België</span> },
            ].map(({ label, delay, content }) => (
              <motion.div
                key={label}
                className="info-item"
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay, ease: E }}
                style={{
                  padding: "clamp(20px,3vw,32px) clamp(16px,3vw,40px) clamp(24px,3vw,36px)",
                  transition: TT,
                  ["--border" as string]: C.border,
                }}
              >
                <div style={{ fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: C.orange, marginBottom: 12 }}>{label}</div>
                {content}
              </motion.div>
            ))}

          </div>
        </section>

        {/* ──────────────────────────────────── FORM ── */}
        <section ref={formRef} style={{
          padding: "clamp(64px,10vw,120px) clamp(20px,5vw,72px)",
          borderBottom: `1px solid ${C.border}`,
          transition: TT,
        }}>

          {/* Section eyebrow */}
          <MaskReveal style={{ marginBottom: "clamp(40px,6vw,72px)" }}>
            <div style={{ fontSize: 9, letterSpacing: "0.36em", textTransform: "uppercase", color: C.orange, display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ width: 18, height: "1px", background: C.orange, display: "inline-block" }}/>
              Stuur een bericht
            </div>
          </MaskReveal>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.6, ease: E }}
                style={{ padding: "clamp(48px,8vw,96px) 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 24, width: "100%", maxWidth: 640 }}>
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, ease: E }}
                    style={{ height: 1, flex: 1, background: `${C.orange}55`, transformOrigin: "left" }}/>
                  <span style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(28px,4vw,52px)", color: C.orange,
                    letterSpacing: "0.04em", lineHeight: 1,
                  }}>Bericht verzonden</span>
                  <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.7, delay: 0.15, ease: E }}
                    style={{ height: 1, flex: 1, background: `${C.orange}55`, transformOrigin: "right" }}/>
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: C.inkSub, fontSize: 15, lineHeight: 1.8, textAlign: "center" }}>
                  Ik neem zo snel mogelijk contact met je op.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: "flex", flexDirection: "column", gap: "clamp(0px,2vw,8px)", maxWidth: 900 }}
              >
                {/* Row: Naam + Email */}
                <div className="c-fields-row">
                  <Field num="01" label="Naam" error={errors.name?.message} C={C}>
                    <input {...register("name")} className="c-inp" placeholder="Hoe heet je?" />
                  </Field>
                  <Field num="02" label="Email" error={errors.email?.message} C={C}>
                    <input {...register("email")} className="c-inp" placeholder="je@email.com" />
                  </Field>
                </div>

                <Field num="03" label="Onderwerp" error={errors.subject?.message} C={C}>
                  <input {...register("subject")} className="c-inp" placeholder="Branding, Web, Verpakking..." />
                </Field>

                <Field num="04" label="Bericht" error={errors.message?.message} C={C}>
                  <textarea {...register("message")} className="c-inp" rows={5} placeholder="Vertel me over je project..." style={{ resize: "none" }} />
                </Field>

                {/* Submit bar */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2, ease: E }}
                  style={{ paddingTop: "clamp(16px,3vw,32px)" }}
                >
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ opacity: loading ? 1 : 0.88 }}
                    whileTap={{ scale: 0.995 }}
                    style={{
                      width: "100%",
                      background: C.orange,
                      color: "#fff",
                      border: "none",
                      padding: "clamp(18px,2.5vw,26px) clamp(20px,3vw,40px)",
                      fontFamily: "'DM Mono', monospace",
                      fontSize: "clamp(9px,1vw,11px)",
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      cursor: loading ? "wait" : "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 16,
                      transition: "background 0.3s ease",
                    }}
                  >
                    <span>{loading ? "Verzenden..." : "Verstuur bericht"}</span>
                    {!loading && (
                      <motion.span
                        animate={{ x: [0, 8, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                        style={{ fontSize: 16 }}
                      >→</motion.span>
                    )}
                  </motion.button>
                </motion.div>
              </motion.form>
            )}
          </AnimatePresence>
        </section>

      </div>
    </div>
  )
}
