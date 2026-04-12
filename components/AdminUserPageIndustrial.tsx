"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
type T = {
  bg: string; surface: string; surface2: string
  border: string; border2: string
  ink: string; ink2: string; ink3: string
  accent: string; success: string; danger: string
  isLight: boolean
}
const DARK: T = {
  bg: "#0A0A0A", surface: "#111111", surface2: "#191919",
  border: "#222222", border2: "#2E2E2E",
  ink: "#F0EDE8", ink2: "#888882", ink3: "#3A3A38",
  accent: "#FF5C1A", success: "#34C759", danger: "#FF3B30",
  isLight: false,
}
const LIGHT: T = {
  bg: "#F5F2EE", surface: "#FDFAF7", surface2: "#EEEBE7",
  border: "#D8D3CD", border2: "#C8C3BC",
  ink: "#1A1816", ink2: "#6B6660", ink3: "#B8B3AC",
  accent: "#E04500", success: "#1A8A3C", danger: "#D42B22",
  isLight: true,
}

function useTheme(): T {
  const [isLight, setIsLight] = useState(false)
  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("theme-light"))
    const handler = (e: Event) => setIsLight(!(e as CustomEvent).detail.isDark)
    window.addEventListener("theme-change", handler)
    return () => window.removeEventListener("theme-change", handler)
  }, [])
  return isLight ? LIGHT : DARK
}

// ── FORM STATE ────────────────────────────────────────────────────────────────
interface FormState {
  firstName: string; lastName: string; email: string; phone: string
  city: string; country: string; role: string; bio: string
  birthdate: string; gender: string; instagram: string
}
const DEFAULT_FORM: FormState = {
  firstName: "", lastName: "", email: "", phone: "",
  city: "", country: "", role: "", bio: "",
  birthdate: "", gender: "", instagram: "",
}
type FormKey = keyof FormState

const validators: Partial<Record<FormKey, (v: string) => string | null>> = {
  firstName: (v) => v.trim().length < 2 ? "Minimaal 2 tekens" : null,
  lastName:  (v) => v.trim().length < 2 ? "Minimaal 2 tekens" : null,
  email:     (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Ongeldig e-mailadres" : null,
  phone:     (v) => (v && !/^\+?[\d\s\-()]{7,}$/.test(v)) ? "Ongeldig nummer" : null,
  city:      (v) => v.trim().length < 2 ? "Vereist" : null,
  country:   (v) => v.trim().length < 2 ? "Vereist" : null,
  role:      (v) => v.trim().length < 2 ? "Vereist" : null,
  bio:       (v) => v.length > 200 ? "Maximum 200 tekens" : null,
  instagram: (v) => (v && !/^@?[\w.]+$/.test(v)) ? "Ongeldige handle" : null,
}

// ── FORM FIELD ─────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, onBlur, type = "text", placeholder,
  mono = false, error, touched, hint, t }: {
  label: string; value: string; onChange: (v: string) => void; onBlur?: () => void
  type?: string; placeholder?: string; mono?: boolean; error?: string | null
  touched?: boolean; hint?: string; t: T
}) {
  const [focused, setFocused] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const isPass = type === "password"
  const showError = !!(touched && error)
  const showOk = !!(touched && !error && value)

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{
        fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em",
        textTransform: "uppercase", color: showError ? t.danger : focused ? t.accent : t.ink2,
        transition: "color .15s",
      }}>{label}</label>
      <div style={{ position: "relative" }}>
        <input
          type={isPass ? (showPass ? "text" : "password") : type}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.() }}
          placeholder={placeholder}
          style={{
            width: "100%", boxSizing: "border-box",
            background: focused ? t.surface2 : t.surface,
            borderTop: "none", borderLeft: "none", borderRight: "none",
            borderBottom: `2px solid ${showError ? t.danger : focused ? t.accent : t.border2}`,
            color: t.ink,
            fontFamily: mono ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
            fontSize: 14, fontWeight: 400,
            padding: `11px ${isPass ? "52px" : "40px"} 11px 0`,
            transition: "border-color .15s, background .15s", outline: "none",
          }}
        />
        <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 6, alignItems: "center" }}>
          {isPass && (
            <button type="button" onClick={() => setShowPass(v => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", color: showPass ? t.accent : t.ink2, display: "flex", padding: 2, transition: "color .15s" }}>
              {showPass
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
            </button>
          )}
          {showError && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={t.danger} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
          {showOk    && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={t.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
        </div>
      </div>
      {hint && !showError && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: t.ink3, margin: 0 }}>{hint}</p>}
      {showError && <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.danger, letterSpacing: "0.1em", margin: 0 }}>{error}</p>}
    </div>
  )
}

// ── TEXTAREA ──────────────────────────────────────────────────────────────────
function Textarea({ label, value, onChange, onBlur, placeholder, error, touched, t }: {
  label: string; value: string; onChange: (v: string) => void; onBlur?: () => void
  placeholder?: string; error?: string | null; touched?: boolean; t: T
}) {
  const [focused, setFocused] = useState(false)
  const showError = !!(touched && error)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: showError ? t.danger : focused ? t.accent : t.ink2 }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); onBlur?.() }}
        placeholder={placeholder} rows={5}
        style={{
          background: t.surface2, border: `1px solid ${showError ? t.danger : focused ? t.accent : t.border2}`,
          color: t.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.75,
          padding: "12px 14px", outline: "none", resize: "none", width: "100%", boxSizing: "border-box",
          transition: "border-color .15s",
        }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {showError ? <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.danger, letterSpacing: "0.1em", margin: 0 }}>{error}</p> : <span />}
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: value.length > 180 ? t.accent : t.ink3 }}>{value.length} / 200</span>
      </div>
    </div>
  )
}

// ── TOGGLE ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, t }: { checked: boolean; onChange: (v: boolean) => void; t: T }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      width: 44, height: 24, border: `1px solid ${checked ? t.accent : t.border2}`,
      background: checked ? `${t.accent}20` : "transparent",
      cursor: "pointer", position: "relative", flexShrink: 0, padding: 0,
      transition: "background .2s, border-color .2s",
    }}>
      <span style={{
        position: "absolute", top: "50%", transform: "translateY(-50%)",
        left: checked ? "calc(100% - 17px)" : 3,
        width: 14, height: 14,
        background: checked ? t.accent : t.ink3,
        transition: "left .2s, background .2s", display: "block",
      }} />
    </button>
  )
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ show, type, message, t }: { show: boolean; type: "success"|"error"; message: string; t: T }) {
  if (!show) return null
  const color = type === "error" ? t.danger : t.success
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, display: "flex", alignItems: "center", gap: 14,
      background: t.surface, border: `1px solid ${color}`,
      padding: "13px 20px 13px 16px", minWidth: 280,
    }}>
      <div style={{ width: 3, alignSelf: "stretch", background: color, flexShrink: 0 }} />
      <div>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color, marginBottom: 3 }}>
          {type === "error" ? "Fout" : "Succes"}
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: t.ink }}>{message}</p>
      </div>
    </div>
  )
}

// ── SECTION HEADER ────────────────────────────────────────────────────────────
function SectionHeader({ number, title, subtitle, complete, t }: {
  number: string; title: string; subtitle: string; complete?: boolean; t: T
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginBottom: 28 }}>
      <div style={{ paddingTop: 2, flexShrink: 0 }}>
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: complete ? t.success : t.accent, letterSpacing: "0.1em" }}>{number}</span>
        <div style={{ width: 1, height: 28, background: complete ? t.success : t.accent, margin: "5px auto 0" }} />
      </div>
      <div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: "0.08em", color: t.ink, lineHeight: 1, marginBottom: 5 }}>
          {title}
          {complete && <svg style={{ marginLeft: 10, verticalAlign: "middle" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={t.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
        </h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: t.ink2, lineHeight: 1.5 }}>{subtitle}</p>
      </div>
    </div>
  )
}

function HR({ t }: { t: T }) {
  return <div style={{ height: 1, background: t.border, margin: "32px 0" }} />
}

// ── ACTION ROW (toggle settings) ──────────────────────────────────────────────
function ActionRow({ title, description, checked, onChange, t, icon }: {
  title: string; description: string; checked: boolean; onChange: (v: boolean) => void; t: T
  icon: React.ReactNode
}) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 16,
      padding: "16px 18px",
      background: checked ? `${t.accent}0A` : t.surface2,
      border: `1px solid ${checked ? t.accent + "40" : t.border}`,
      marginBottom: 10, transition: "background .2s, border-color .2s",
    }}>
      <div style={{
        width: 40, height: 40, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: `1px solid ${checked ? t.accent + "60" : t.border2}`,
        color: checked ? t.accent : t.ink2, transition: "all .2s",
      }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: t.ink, marginBottom: 2 }}>{title}</p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: t.ink2 }}>{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} t={t} />
    </div>
  )
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminUserPageIndustrial() {
  const baseTheme = useTheme()
  const [form, setForm]       = useState<FormState>(DEFAULT_FORM)
  const [touched, setTouched] = useState<Partial<Record<FormKey, boolean>>>({})
  const [toast, setToast]     = useState<{ show: boolean; type: "success"|"error"; message: string }>({ show: false, type: "success", message: "" })
  const [pushOn,    setPushOn]    = useState(true)
  const [emailOn,   setEmailOn]   = useState(true)
  const [privacyOn, setPrivacyOn] = useState(false)
  const [twoFaOn,   setTwoFaOn]   = useState(false)
  const [links,     setLinks]     = useState<string[]>([])
  const [newLink,   setNewLink]   = useState("")
  const [addingLink, setAddingLink] = useState(false)
  const [profileColor, setProfileColor] = useState("#FF5C1A")

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Merge profileColor into the theme so every t.accent reference picks it up automatically
  const t = { ...baseTheme, accent: profileColor }

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const PROFILE_COLORS = ["#FF5C1A","#E8280A","#F59E0B","#3B82F6","#8B5CF6","#10B981","#EC4899","#64748B"]

  const showToast = (type: "success"|"error", message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast({ show: true, type, message })
    toastTimer.current = setTimeout(() => setToast(p => ({ ...p, show: false })), 3000)
  }

  const getError = useCallback((key: FormKey): string | null => {
    const fn = validators[key]; return fn ? fn(form[key]) : null
  }, [form])

  const update   = (key: FormKey) => (val: string) => setForm(f => ({ ...f, [key]: val }))
  const touch    = (key: FormKey) => () => setTouched(p => ({ ...p, [key]: true }))
  const touchAll = () => {
    const req: FormKey[] = ["firstName","lastName","email","phone","city","country","role","bio"]
    setTouched(Object.fromEntries(req.map(k => [k, true])) as Record<FormKey, boolean>)
  }

  const isCoreValid = (["firstName","lastName","email","city","country","role"] as FormKey[]).every(k => !getError(k))
  const isBioValid  = !getError("bio")
  const isFormValid = isCoreValid && isBioValid
  const hasChanges  = JSON.stringify(form) !== JSON.stringify(DEFAULT_FORM)
  const initials    = (form.firstName[0] || "") + (form.lastName[0] || "")
  const displayName = form.firstName || form.lastName ? `${form.firstName} ${form.lastName}`.trim() : null

  const handleSave = () => {
    touchAll()
    if (!isFormValid) { showToast("error", "Controleer de velden met fouten"); return }
    showToast("success", "Profiel opgeslagen")
  }

  const completionItems = [
    { label: "Basisgegevens",  done: isCoreValid },
    { label: "Bio",            done: isBioValid && !!form.bio },
    { label: "Sociale Media",  done: !!form.instagram || links.length > 0 },
    { label: "Meldingen",      done: pushOn || emailOn },
  ]
  const score = completionItems.filter(i => i.done).length

  const nativeInput: React.CSSProperties = {
    background: t.surface2, border: "none",
    borderBottom: `2px solid ${t.border2}`,
    color: t.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    padding: "11px 0", outline: "none", width: "100%", boxSizing: "border-box",
    transition: "border-color .15s", colorScheme: t.isLight ? "light" : "dark",
  }

  return (
    <div style={{ background: t.bg, minHeight: "100vh", color: t.ink, transition: "background .3s, color .3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:${t.accent};color:${t.isLight?"#fff":"#000"}}
        ::-webkit-scrollbar{width:2px} ::-webkit-scrollbar-thumb{background:${t.accent}}
        input::placeholder,textarea::placeholder{color:${t.ink3};font-family:'DM Sans',sans-serif;font-size:13px}
        select option{background:${t.surface};color:${t.ink}}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:${t.isLight?"none":"invert(1)"};opacity:.35;cursor:pointer}
      `}</style>

      <Toast show={toast.show} type={toast.type} message={toast.message} t={t} />

      {/* ── HEADER ── */}
      <header style={{
        borderBottom: `1px solid ${t.border}`,
        padding: isMobile ? "14px 16px" : "22px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
        background: t.bg,
      }}>
        {/* accent line top */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,${t.accent},transparent)` }} />

        <div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: t.accent, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, height: 1, background: t.accent, display: "inline-block" }} />
            Beheer / Profiel
          </p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(30px,4vw,48px)", letterSpacing: "0.06em", lineHeight: 0.9, color: t.ink }}>
            Mijn{" "}
            <span style={{ WebkitTextStroke: `clamp(0.4px, 0.15vw, 1.5px) ${t.accent}`, color: "transparent" }}>Profiel</span>
          </h1>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {hasChanges && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: t.ink2, letterSpacing: "0.16em", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, background: t.accent, display: "inline-block" }} />
              {!isMobile && "Niet opgeslagen"}
            </span>
          )}
          <button onClick={handleSave} style={{
            border: `1px solid ${t.accent}`, background: "transparent",
            color: t.accent, fontFamily: "'DM Mono', monospace",
            fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
            padding: "11px 28px", cursor: "pointer", transition: "background .15s, color .15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = t.accent; e.currentTarget.style.color = t.isLight ? "#fff" : "#000" }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.accent }}>
            Opslaan ↗
          </button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{
        display: "grid", gridTemplateColumns: isMobile ? "1fr" : "260px 1fr",
        maxWidth: 1240, margin: "0 auto",
        padding: isMobile ? "0 16px 40px" : "0 48px 64px",
      }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          borderRight: isMobile ? "none" : `1px solid ${t.border}`,
          borderBottom: isMobile ? `1px solid ${t.border}` : "none",
          paddingRight: isMobile ? 0 : 28,
          paddingTop: isMobile ? 20 : 40,
          paddingBottom: isMobile ? 24 : 0,
          position: isMobile ? "static" : "sticky", top: 90,
          height: isMobile ? "auto" : "calc(100vh - 90px)",
          overflowY: isMobile ? "visible" : "auto",
          display: "flex", flexDirection: "column", gap: isMobile ? 20 : 28,
        }}>

          {/* Avatar + naam */}
          <div style={{ paddingBottom: 24, borderBottom: `1px solid ${t.border}` }}>
            <div style={{ position: "relative", marginBottom: 14 }}>
              <div style={{
                width: 64, height: 64,
                border: `1px solid ${t.accent}50`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 22,
                color: t.accent, background: t.surface2,
              }}>{initials}</div>
              <div style={{ position: "absolute", bottom: -1, right: "calc(100% - 70px)", width: 8, height: 8, background: t.accent }} />
            </div>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: displayName ? t.ink : t.ink3, lineHeight: 1, marginBottom: 4 }}>
              {displayName ?? "Jouw naam"}
            </p>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.accent, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {form.role || "Jouw functietitel"}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: t.ink2, marginTop: 3 }}>
              {form.city || form.country
                ? `${form.city}${form.city && form.country ? ", " : ""}${form.country}`
                : "Stad, Land"}
            </p>
            {form.email && (
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.ink2, marginTop: 8, wordBreak: "break-all" }}>{form.email}</p>
            )}
            {form.instagram && (
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: t.ink2, marginTop: 4 }}>@{form.instagram.replace(/^@/, "")}</p>
            )}
          </div>

          {/* Volledigheid */}
          <div>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: t.accent, marginBottom: 14 }}>Volledigheid</p>

            {/* progress bar */}
            <div style={{ height: 2, background: t.border2, marginBottom: 16, overflow: "hidden" }}>
              <div style={{
                height: "100%", width: `${(score / 4) * 100}%`,
                background: score === 4 ? t.success : t.accent,
                transition: "width .4s ease",
              }} />
            </div>

            {completionItems.map((item, i) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 0",
                borderBottom: i < completionItems.length - 1 ? `1px solid ${t.border}` : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: t.ink3 }}>0{i + 1}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: item.done ? t.ink : t.ink2 }}>{item.label}</span>
                </div>
                {item.done
                  ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={t.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <div style={{ width: 8, height: 8, border: `1px solid ${t.ink3}` }} />
                }
              </div>
            ))}

            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, color: t.ink3, letterSpacing: "0.12em", marginTop: 14 }}>
              {score}/4 secties ingevuld
            </p>
          </div>

          {/* Profielkleur */}
          <div style={{ paddingTop: 4 }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: t.ink2, marginBottom: 14 }}>Profielkleur</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PROFILE_COLORS.map(c => (
                <button key={c} onClick={() => setProfileColor(c)} style={{
                  width: 20, height: 20, background: c, border: "none",
                  cursor: "pointer", padding: 0, flexShrink: 0,
                  outline: profileColor === c ? `2px solid ${t.ink}` : "2px solid transparent",
                  outlineOffset: 2,
                  transform: profileColor === c ? "scale(1.2)" : "scale(1)",
                  transition: "transform .15s, outline .15s",
                }} />
              ))}
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ paddingLeft: isMobile ? 0 : 48, paddingTop: isMobile ? 24 : 48 }}>

          {/* 01 — Basisgegevens */}
          <section style={{ marginBottom: 0 }}>
            <SectionHeader number="01" title="Basisgegevens" subtitle="Je naam, contactgegevens en locatie." complete={isCoreValid} t={t} />

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : "20px 32px", marginBottom: 24 }}>
              <Field label="Voornaam" value={form.firstName} onChange={update("firstName")} onBlur={touch("firstName")} error={getError("firstName")} touched={touched.firstName} placeholder="Jouw voornaam" t={t} />
              <Field label="Achternaam" value={form.lastName} onChange={update("lastName")} onBlur={touch("lastName")} error={getError("lastName")} touched={touched.lastName} placeholder="Jouw achternaam" t={t} />
              <Field label="E-mailadres" value={form.email} onChange={update("email")} onBlur={touch("email")} type="email" mono error={getError("email")} touched={touched.email} placeholder="naam@domein.be" t={t} />
              <Field label="Telefoonnummer" value={form.phone} onChange={update("phone")} onBlur={touch("phone")} mono error={getError("phone")} touched={touched.phone} placeholder="+32 4xx xx xx xx" t={t} />
              <Field label="Stad" value={form.city} onChange={update("city")} onBlur={touch("city")} error={getError("city")} touched={touched.city} placeholder="Antwerpen" t={t} />
              <Field label="Land" value={form.country} onChange={update("country")} onBlur={touch("country")} error={getError("country")} touched={touched.country} placeholder="België" t={t} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <Field label="Functietitel" value={form.role} onChange={update("role")} onBlur={touch("role")} error={getError("role")} touched={touched.role} placeholder="bv. Grafisch Designer" hint="Verschijnt onder je naam op het publieke profiel." t={t} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : "20px 32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: t.ink2 }}>Geboortedatum</label>
                <input type="date" value={form.birthdate} onChange={e => update("birthdate")(e.target.value)} style={nativeInput}
                  onFocus={e => e.currentTarget.style.borderBottomColor = t.accent}
                  onBlur={e => e.currentTarget.style.borderBottomColor = t.border2} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: t.ink2 }}>Geslacht</label>
                <select value={form.gender} onChange={e => update("gender")(e.target.value)} style={{ ...nativeInput, appearance: "none", cursor: "pointer", color: form.gender ? t.ink : t.ink3 }}
                  onFocus={e => e.currentTarget.style.borderBottomColor = t.accent}
                  onBlur={e => e.currentTarget.style.borderBottomColor = t.border2}>
                  <option value="" disabled>Selecteer</option>
                  <option value="man">Man</option>
                  <option value="vrouw">Vrouw</option>
                  <option value="anders">X</option>
                </select>
              </div>
            </div>
          </section>

          <HR t={t} />

          {/* 02 — Bio */}
          <section>
            <SectionHeader number="02" title="Bio" subtitle="Een korte beschrijving zichtbaar op je publiek profiel." complete={isBioValid && !!form.bio} t={t} />
            <Textarea label="Over jezelf" value={form.bio} onChange={update("bio")} onBlur={touch("bio")}
              placeholder="Vertel in een paar zinnen wie je bent en wat je doet…" error={getError("bio")} touched={touched.bio} t={t} />
          </section>

          <HR t={t} />

          {/* 03 — Sociale Media */}
          <section>
            <SectionHeader number="03" title="Sociale Media" subtitle="Koppel je online kanalen voor bezoekers." complete={!!form.instagram || links.length > 0} t={t} />

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: t.ink2, display: "block", marginBottom: 10 }}>Instagram</label>
              <div style={{
                display: "flex", alignItems: "center", gap: 12,
                borderBottom: `2px solid ${t.border2}`, paddingBottom: 10,
                transition: "border-color .15s",
              }}
                onFocusCapture={e => (e.currentTarget.style.borderBottomColor = t.accent)}
                onBlurCapture={e => (e.currentTarget.style.borderBottomColor = t.border2)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.ink2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: t.ink3 }}>@</span>
                <input value={form.instagram.replace(/^@/, "")} onChange={e => update("instagram")(e.target.value)}
                  placeholder="jouw_handle"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: t.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }} />
              </div>
            </div>

            {links.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {links.map((link, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    borderBottom: `1px solid ${t.border}`, paddingBottom: 10,
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.ink2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                    <input value={link} onChange={e => { const nl = [...links]; nl[i] = e.target.value; setLinks(nl) }}
                      placeholder="https://..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: t.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }} />
                    <button onClick={() => setLinks(links.filter((_, j) => j !== i))}
                      style={{ background: "none", border: "none", color: t.ink3, cursor: "pointer", display: "flex", padding: 2 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {addingLink ? (
              <div style={{ border: `1px solid ${t.accent}`, padding: 18, marginBottom: 12 }}>
                <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: t.accent, marginBottom: 12 }}>Nieuwe link</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={newLink} onChange={e => setNewLink(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && newLink.trim()) { setLinks([...links, newLink.trim()]); setNewLink(""); setAddingLink(false) }}}
                    placeholder="https://jouwwebsite.be" autoFocus
                    style={{ flex: 1, background: t.surface2, border: `1px solid ${t.border2}`, color: t.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "9px 12px", outline: "none" }} />
                  <button onClick={() => { if (newLink.trim()) { setLinks([...links, newLink.trim()]); setNewLink(""); setAddingLink(false) }}}
                    style={{ border: `1px solid ${t.accent}`, background: "transparent", color: t.accent, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: "9px 16px", cursor: "pointer" }}>Voeg toe</button>
                  <button onClick={() => setAddingLink(false)}
                    style={{ border: `1px solid ${t.border}`, background: "transparent", color: t.ink2, fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", padding: "9px 12px", cursor: "pointer" }}>Annuleer</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingLink(true)} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "transparent", border: `1px dashed ${t.border2}`,
                padding: "10px 14px",
                fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: "0.16em",
                textTransform: "uppercase", color: t.ink2,
                cursor: "pointer", transition: "border-color .15s, color .15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border2; e.currentTarget.style.color = t.ink2 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Extra link toevoegen
              </button>
            )}
          </section>

          <HR t={t} />

          {/* 04 — Meldingen */}
          <section>
            <SectionHeader number="04" title="Meldingen" subtitle="Bepaal hoe en wanneer we je bereiken." complete={pushOn || emailOn} t={t} />
            <ActionRow title="Push meldingen" description="Realtime meldingen in je browser." checked={pushOn} onChange={setPushOn} t={t}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>} />
            <ActionRow title="E-mail updates" description="Samenvattingen en berichten per mail." checked={emailOn} onChange={setEmailOn} t={t}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>} />
          </section>

          <HR t={t} />

          {/* 05 — Beveiliging */}
          <section>
            <SectionHeader number="05" title="Beveiliging" subtitle="Beheer je accountveiligheid en privacy." complete={twoFaOn} t={t} />

            <ActionRow title="Privacymodus" description="Verberg persoonlijke informatie van publieke profielen." checked={privacyOn} onChange={setPrivacyOn} t={t}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>} />
            <ActionRow title="Tweestapsverificatie (2FA)" description="Extra beveiliging bij het inloggen via je telefoon." checked={twoFaOn} onChange={setTwoFaOn} t={t}
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>} />

            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: 10, marginTop: 20 }}>
              <button onClick={() => showToast("success", "Data export gestart. Je ontvangt binnenkort een e-mail.")} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", background: t.surface2,
                border: `1px solid ${t.border}`, cursor: "pointer", transition: "border-color .15s",
                fontFamily: "'DM Sans', sans-serif",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.ink2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  <span style={{ fontSize: 13, color: t.ink }}>Download data</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.ink2} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>

              <button onClick={() => showToast("success", "Wachtwoord reset e-mail verstuurd")} style={{
                flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 16px", background: t.surface2,
                border: `1px solid ${t.border}`, cursor: "pointer", transition: "border-color .15s",
                fontFamily: "'DM Sans', sans-serif",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = t.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.ink2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  <span style={{ fontSize: 13, color: t.ink }}>Wachtwoord resetten</span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.ink2} strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>

            {/* Danger zone */}
            <div style={{ marginTop: 28, padding: "18px", border: `1px solid ${t.danger}25`, background: `${t.danger}05` }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: t.danger, marginBottom: 8 }}>Gevaarlijke zone</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: t.ink2, marginBottom: 14 }}>Het verwijderen van je account is permanent en kan niet ongedaan worden gemaakt.</p>
              <button onClick={() => showToast("error", "Bevestigingsscherm nog niet geïmplementeerd")} style={{
                background: "transparent", border: `1px solid ${t.danger}50`,
                color: t.danger, fontFamily: "'DM Mono', monospace",
                fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
                padding: "9px 18px", cursor: "pointer", transition: "background .15s, border-color .15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${t.danger}12`; e.currentTarget.style.borderColor = t.danger }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${t.danger}50` }}>
                Account verwijderen
              </button>
            </div>
          </section>

          {/* BOTTOM ACTIONS */}
          <div style={{ borderTop: `1px solid ${t.border}`, marginTop: 40, paddingTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button onClick={() => setTouched({})} style={{
              border: `1px solid ${t.border}`, background: "transparent",
              color: t.ink2, fontFamily: "'DM Mono', monospace",
              fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase",
              padding: "11px 20px", cursor: "pointer", transition: "color .15s, border-color .15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = t.ink; e.currentTarget.style.borderColor = t.border2 }}
              onMouseLeave={e => { e.currentTarget.style.color = t.ink2; e.currentTarget.style.borderColor = t.border }}>
              Annuleren
            </button>
            <button onClick={handleSave} style={{
              border: `1px solid ${t.accent}`, background: "transparent",
              color: t.accent, fontFamily: "'DM Mono', monospace",
              fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
              padding: "11px 32px", cursor: "pointer", transition: "background .15s, color .15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = t.accent; e.currentTarget.style.color = t.isLight ? "#fff" : "#000" }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = t.accent }}>
              Wijzigingen opslaan →
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
