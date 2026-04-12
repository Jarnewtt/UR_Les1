"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"

// ── DESIGN TOKENS — matches all other Modern pages ────────────────────────────
type T = {
  bg: string; surface: string; surface2: string
  border: string; borderSub: string
  ink: string; inkSub: string; inkMuted: string
  red: string; success: string; danger: string
  isLight: boolean
}
const DARK: T = {
  bg: "#0C0C12", surface: "#14141E", surface2: "#1C1C28",
  border: "#22222E", borderSub: "#1C1C28",
  ink: "#F2F0EC", inkSub: "#B8B6C4", inkMuted: "#787688",
  red: "#E8280A", success: "#22C55E", danger: "#EF4444",
  isLight: false,
}
const LIGHT: T = {
  bg: "#F5F4F8", surface: "#EEEDF2", surface2: "#E6E4EE",
  border: "#D0CED8", borderSub: "#E2E0E8",
  ink: "#0D0C14", inkSub: "#2A2830", inkMuted: "#56546A",
  red: "#CC1F00", success: "#16A34A", danger: "#DC2626",
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
  firstName: (v) => v.trim().length < 2 ? "Minimaal 2 tekens vereist" : null,
  lastName:  (v) => v.trim().length < 2 ? "Minimaal 2 tekens vereist" : null,
  email:     (v) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Ongeldig e-mailadres" : null,
  phone:     (v) => (v && !/^\+?[\d\s\-()]{7,}$/.test(v)) ? "Ongeldig telefoonnummer" : null,
  city:      (v) => v.trim().length < 2 ? "Vereist" : null,
  country:   (v) => v.trim().length < 2 ? "Vereist" : null,
  role:      (v) => v.trim().length < 2 ? "Vereist" : null,
  bio:       (v) => v.length > 200 ? "Maximum 200 tekens" : null,
  instagram: (v) => (v && !/^@?[\w.]+$/.test(v)) ? "Ongeldige handle" : null,
}

// ── FORM FIELD ────────────────────────────────────────────────────────────────
function FormField({ label, value, onChange, onBlur, type = "text", placeholder,
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
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: showError ? t.danger : t.inkSub }}>
        {label}
      </label>
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
            border: `1.5px solid ${showError ? t.danger : focused ? t.red : t.border}`,
            borderRadius: 10, color: t.ink,
            fontFamily: mono ? "'DM Mono', monospace" : "'DM Sans', sans-serif",
            fontSize: 14, fontWeight: 400,
            padding: `10px ${isPass ? "48px" : "36px"} 10px 14px`,
            transition: "border-color .15s, background .15s", outline: "none",
          }}
        />
        <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 6, alignItems: "center" }}>
          {isPass && (
            <button type="button" onClick={() => setShowPass(v => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", color: t.inkMuted, display: "flex", padding: 2 }}>
              {showPass
                ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>}
            </button>
          )}
          {showError && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.danger} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
          {showOk    && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
        </div>
      </div>
      {hint && !showError && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: t.inkMuted, margin: 0 }}>{hint}</p>}
      {showError && <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: t.danger, margin: 0 }}>{error}</p>}
    </div>
  )
}

// ── TEXTAREA FIELD ────────────────────────────────────────────────────────────
function TextareaField({ label, value, onChange, onBlur, placeholder, error, touched, t }: {
  label: string; value: string; onChange: (v: string) => void; onBlur?: () => void
  placeholder?: string; error?: string | null; touched?: boolean; t: T
}) {
  const [focused, setFocused] = useState(false)
  const showError = !!(touched && error)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: showError ? t.danger : t.inkSub }}>{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); onBlur?.() }}
        placeholder={placeholder} rows={4}
        style={{
          background: focused ? t.surface2 : t.surface,
          border: `1.5px solid ${showError ? t.danger : focused ? t.red : t.border}`,
          borderRadius: 10, color: t.ink,
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.7,
          padding: "10px 14px", outline: "none", resize: "none",
          width: "100%", boxSizing: "border-box",
          transition: "border-color .15s, background .15s",
        }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {showError ? <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: t.danger, margin: 0 }}>{error}</p> : <span />}
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: value.length > 180 ? t.red : t.inkMuted }}>{value.length} / 200</span>
      </div>
    </div>
  )
}

// ── PILL TOGGLE ───────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, t }: { checked: boolean; onChange: (v: boolean) => void; t: T }) {
  return (
    <button onClick={() => onChange(!checked)} style={{
      width: 44, height: 24, borderRadius: 12, border: "none",
      background: checked ? t.red : t.border,
      cursor: "pointer", position: "relative",
      transition: "background .2s", flexShrink: 0, padding: 0,
    }}>
      <span style={{
        position: "absolute", top: 3, left: checked ? 23 : 3,
        width: 18, height: 18, borderRadius: "50%", background: "#fff",
        transition: "left .2s", display: "block",
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
      position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)",
      zIndex: 9999, display: "flex", alignItems: "center", gap: 12,
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: 12,
      padding: "12px 20px", boxShadow: `0 4px 24px ${t.isLight ? "rgba(0,0,0,0.12)" : "rgba(0,0,0,0.6)"}`,
      minWidth: 280,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: t.ink }}>{message}</span>
    </div>
  )
}

// ── SECTION CARD ──────────────────────────────────────────────────────────────
function SectionCard({ children, t }: { children: React.ReactNode; t: T }) {
  return (
    <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: 16, padding: "28px" }}>
      {children}
    </div>
  )
}

function SectionTitle({ number, title, description, complete, t }: {
  number: string; title: string; description: string; complete?: boolean; t: T
}) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, flexShrink: 0,
        background: complete ? `${t.success}18` : `${t.red}15`,
        border: `1px solid ${complete ? t.success + "40" : t.red + "30"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 500,
        color: complete ? t.success : t.red,
      }}>
        {complete
          ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          : number
        }
      </div>
      <div>
        <h2 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 17, fontWeight: 600, color: t.ink, margin: "0 0 4px", lineHeight: 1.2 }}>{title}</h2>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: t.inkSub, margin: 0, lineHeight: 1.5 }}>{description}</p>
      </div>
    </div>
  )
}

function Divider({ t }: { t: T }) {
  return <div style={{ height: 1, background: t.border, margin: "24px 0" }} />
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function AdminUserPageModern() {
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
  const [profileColor, setProfileColor] = useState("#E8280A")

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Merge profileColor into the theme so every t.red reference picks it up automatically
  const t = { ...baseTheme, red: profileColor }

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const PROFILE_COLORS = ["#E8280A","#3B82F6","#8B5CF6","#10B981","#F59E0B","#EC4899","#06B6D4","#64748B"]

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
    showToast("success", "Profiel succesvol opgeslagen")
  }

  const completionItems = [
    { label: "Basisgegevens",  done: isCoreValid },
    { label: "Bio",            done: isBioValid && !!form.bio },
    { label: "Sociale Media",  done: !!form.instagram || links.length > 0 },
    { label: "Meldingen",      done: pushOn || emailOn },
  ]
  const score = completionItems.filter(i => i.done).length

  const nativeInput: React.CSSProperties = {
    background: t.surface2, border: `1.5px solid ${t.border}`, borderRadius: 10,
    color: t.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 14,
    padding: "10px 14px", outline: "none", width: "100%", boxSizing: "border-box",
    transition: "border-color .15s", colorScheme: t.isLight ? "light" : "dark",
  }

  return (
    <div style={{ background: t.bg, minHeight: "100vh", color: t.ink, transition: "background .3s, color .3s" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:${t.red};color:#fff}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:${t.border};border-radius:4px}
        input::placeholder,textarea::placeholder{color:${t.inkMuted};font-family:'DM Sans',sans-serif}
        select option{background:${t.surface};color:${t.ink}}
        input[type="date"]::-webkit-calendar-picker-indicator{filter:${t.isLight?"none":"invert(1)"};opacity:.4;cursor:pointer}
      `}</style>

      <Toast show={toast.show} type={toast.type} message={toast.message} t={t} />

      {/* TOPBAR */}
      <header style={{
        background: t.surface, borderBottom: `1px solid ${t.border}`,
        padding: isMobile ? "0 16px" : "0 32px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `${t.red}18`, border: `1px solid ${t.red}35`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "'DM Mono', monospace", fontWeight: 600, fontSize: 13, color: t.red,
          }}>{initials}</div>
          <div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: t.ink, lineHeight: 1.1 }}>
              {displayName ?? "Mijn profiel"}
            </p>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: t.inkSub, lineHeight: 1 }}>
              {form.role || "Instellingen"}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {hasChanges && (
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: t.inkSub, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.red, display: "inline-block" }} />
              {!isMobile && "Niet opgeslagen"}
            </span>
          )}
          <button onClick={handleSave} style={{
            background: t.red, color: "#fff", border: "none", borderRadius: 10,
            padding: "9px 20px", fontFamily: "'DM Sans', sans-serif",
            fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "opacity .15s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            Opslaan
          </button>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "280px 1fr", maxWidth: 1200, margin: "0 auto", padding: isMobile ? "16px" : "32px 24px", gap: 24, alignItems: "start" }}>

        {/* SIDEBAR */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 16, position: isMobile ? "static" : "sticky", top: 80 }}>

          {/* Profile card */}
          <SectionCard t={t}>
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 72, height: 72, borderRadius: 20, margin: "0 auto 14px",
                background: `${t.red}18`, border: `2px solid ${t.red}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'DM Mono', monospace", fontSize: 24, fontWeight: 600, color: t.red,
              }}>{initials}</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 700, color: t.ink, lineHeight: 1.1, marginBottom: 4 }}>
                {displayName ?? <span style={{ color: t.inkMuted }}>Jouw naam</span>}
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500, color: t.red, marginBottom: 4 }}>
                {form.role || <span style={{ color: t.inkMuted }}>Functietitel</span>}
              </p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: t.inkSub }}>
                {form.city || form.country
                  ? `${form.city}${form.city && form.country ? ", " : ""}${form.country}`
                  : <span style={{ color: t.inkMuted }}>Locatie</span>}
              </p>
              {(form.email || form.instagram) && (
                <>
                  <Divider t={t} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
                    {form.email && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.inkSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: t.inkSub, wordBreak: "break-all" }}>{form.email}</span>
                      </div>
                    )}
                    {form.instagram && (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={t.inkSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: t.inkSub }}>{form.instagram}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Profielkleur */}
            <Divider t={t} />
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 500, color: t.inkSub, marginBottom: 10 }}>Profielkleur</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {PROFILE_COLORS.map(c => (
                <button key={c} onClick={() => setProfileColor(c)} style={{
                  width: 22, height: 22, borderRadius: "50%", background: c, border: "none",
                  cursor: "pointer", padding: 0, flexShrink: 0,
                  outline: profileColor === c ? `2px solid ${t.ink}` : "2px solid transparent",
                  outlineOffset: 2,
                  transform: profileColor === c ? "scale(1.2)" : "scale(1)",
                  transition: "transform .15s, outline .15s",
                }} />
              ))}
            </div>
          </SectionCard>

          {/* Volledigheid */}
          <SectionCard t={t}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: t.ink }}>Volledigheid</p>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, fontWeight: 600, color: score === 4 ? t.success : t.red }}>{score}/4</span>
            </div>
            <div style={{ height: 4, borderRadius: 4, background: t.borderSub, marginBottom: 16, overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: 4, width: `${(score / 4) * 100}%`,
                background: score === 4 ? t.success : t.red, transition: "width .4s ease",
              }} />
            </div>
            {completionItems.map(item => (
              <div key={item.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "7px 0", borderBottom: `1px solid ${t.borderSub}`,
              }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: item.done ? t.ink : t.inkSub }}>{item.label}</span>
                {item.done
                  ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.success} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : <div style={{ width: 14, height: 14, borderRadius: "50%", border: `1.5px solid ${t.inkMuted}` }} />
                }
              </div>
            ))}
          </SectionCard>
        </aside>

        {/* MAIN */}
        <main style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* 01 Basisgegevens */}
          <SectionCard t={t}>
            <SectionTitle number="01" title="Basisgegevens" description="Je naam, contactinfo en locatie zichtbaar op je profiel." complete={isCoreValid} t={t} />
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <FormField label="Voornaam" value={form.firstName} onChange={update("firstName")} onBlur={touch("firstName")} error={getError("firstName")} touched={touched.firstName} placeholder="Jouw voornaam" t={t} />
              <FormField label="Achternaam" value={form.lastName} onChange={update("lastName")} onBlur={touch("lastName")} error={getError("lastName")} touched={touched.lastName} placeholder="Jouw achternaam" t={t} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <FormField label="E-mailadres" value={form.email} onChange={update("email")} onBlur={touch("email")} type="email" mono error={getError("email")} touched={touched.email} placeholder="naam@domein.be" t={t} />
              <FormField label="Telefoonnummer" value={form.phone} onChange={update("phone")} onBlur={touch("phone")} mono error={getError("phone")} touched={touched.phone} placeholder="+32 4xx xx xx xx" t={t} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <FormField label="Functietitel" value={form.role} onChange={update("role")} onBlur={touch("role")} error={getError("role")} touched={touched.role} placeholder="bv. Grafisch Designer" hint="Verschijnt onder je naam op het publieke profiel." t={t} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <FormField label="Stad" value={form.city} onChange={update("city")} onBlur={touch("city")} error={getError("city")} touched={touched.city} placeholder="Antwerpen" t={t} />
              <FormField label="Land" value={form.country} onChange={update("country")} onBlur={touch("country")} error={getError("country")} touched={touched.country} placeholder="België" t={t} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: t.inkSub }}>Geboortedatum</label>
                <input type="date" value={form.birthdate} onChange={e => update("birthdate")(e.target.value)} style={nativeInput}
                  onFocus={e => e.currentTarget.style.borderColor = t.red} onBlur={e => e.currentTarget.style.borderColor = t.border} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: t.inkSub }}>Geslacht</label>
                <select value={form.gender} onChange={e => update("gender")(e.target.value)} style={{ ...nativeInput, appearance: "none", cursor: "pointer", color: form.gender ? t.ink : t.inkMuted }}
                  onFocus={e => e.currentTarget.style.borderColor = t.red} onBlur={e => e.currentTarget.style.borderColor = t.border}>
                  <option value="" disabled>Selecteer</option>
                  <option value="man">Man</option>
                  <option value="vrouw">Vrouw</option>
                  <option value="anders">X</option>
                </select>
              </div>
            </div>
          </SectionCard>

          {/* 02 Bio */}
          <SectionCard t={t}>
            <SectionTitle number="02" title="Bio" description="Een korte beschrijving die bezoekers te zien krijgen op je publieke pagina." complete={isBioValid && !!form.bio} t={t} />
            <TextareaField label="Over jezelf" value={form.bio} onChange={update("bio")} onBlur={touch("bio")}
              placeholder="Vertel in een paar zinnen wie je bent en wat je doet…" error={getError("bio")} touched={touched.bio} t={t} />
          </SectionCard>

          {/* 03 Sociale Media */}
          <SectionCard t={t}>
            <SectionTitle number="03" title="Sociale Media" description="Koppel je online kanalen voor bezoekers." complete={!!form.instagram || links.length > 0} t={t} />
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: t.inkSub }}>Instagram</label>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: t.surface2, border: `1.5px solid ${t.border}`,
                borderRadius: 10, padding: "10px 14px", marginTop: 6, transition: "border-color .15s",
              }}
                onFocusCapture={e => (e.currentTarget.style.borderColor = t.red)}
                onBlurCapture={e => (e.currentTarget.style.borderColor = t.border)}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.inkSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: t.inkMuted, flexShrink: 0 }}>@</span>
                <input value={form.instagram.replace(/^@/, "")} onChange={e => update("instagram")(e.target.value)}
                  placeholder="jouw_handle"
                  style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: t.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }} />
              </div>
            </div>

            {links.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                {links.map((link, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: t.surface2, border: `1.5px solid ${t.border}`, borderRadius: 10, padding: "10px 14px",
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.inkSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                    <input value={link} onChange={e => { const nl = [...links]; nl[i] = e.target.value; setLinks(nl) }}
                      placeholder="https://..." style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: t.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 14 }} />
                    <button onClick={() => setLinks(links.filter((_, j) => j !== i))}
                      style={{ background: "none", border: "none", color: t.inkMuted, cursor: "pointer", display: "flex", padding: 2 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {addingLink ? (
              <div style={{ background: t.surface2, border: `1.5px solid ${t.red}40`, borderRadius: 10, padding: 16 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 500, color: t.red, marginBottom: 10 }}>Nieuwe link toevoegen</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={newLink} onChange={e => setNewLink(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && newLink.trim()) { setLinks([...links, newLink.trim()]); setNewLink(""); setAddingLink(false) }}}
                    placeholder="https://jouwwebsite.be" autoFocus
                    style={{ flex: 1, background: t.surface, border: `1.5px solid ${t.border}`, borderRadius: 10, color: t.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 14, padding: "10px 14px", outline: "none" }} />
                  <button onClick={() => { if (newLink.trim()) { setLinks([...links, newLink.trim()]); setNewLink(""); setAddingLink(false) }}}
                    style={{ background: t.red, color: "#fff", border: "none", borderRadius: 10, padding: "0 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Voeg toe</button>
                  <button onClick={() => setAddingLink(false)}
                    style={{ background: "transparent", color: t.inkSub, border: `1px solid ${t.border}`, borderRadius: 10, padding: "0 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, cursor: "pointer" }}>Annuleer</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingLink(true)} style={{
                display: "flex", alignItems: "center", gap: 8,
                background: "transparent", border: `1.5px dashed ${t.border}`,
                borderRadius: 10, padding: "10px 14px", width: "100%",
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: t.inkSub,
                cursor: "pointer", transition: "border-color .15s, color .15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.red; e.currentTarget.style.color = t.red }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.inkSub }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Extra link toevoegen
              </button>
            )}
          </SectionCard>

          {/* 04 Meldingen */}
          <SectionCard t={t}>
            <SectionTitle number="04" title="Meldingen" description="Bepaal via welke kanalen je op de hoogte blijft." complete={pushOn || emailOn} t={t} />
            {[
              { label: "Push meldingen", description: "Ontvang realtime meldingen in je browser.", checked: pushOn, onChange: setPushOn,
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
              { label: "E-mail updates",  description: "Ontvang samenvattingen en berichten per mail.", checked: emailOn, onChange: setEmailOn,
                icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
            ].map(row => (
              <div key={row.label} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                borderRadius: 12, marginBottom: 10,
                background: row.checked ? `${t.red}0D` : t.surface2,
                border: `1px solid ${row.checked ? t.red + "30" : t.border}`,
                transition: "background .2s, border-color .2s",
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  background: row.checked ? `${t.red}15` : t.surface, border: `1px solid ${row.checked ? t.red + "40" : t.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: row.checked ? t.red : t.inkSub, transition: "all .2s",
                }}>{row.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: t.ink, marginBottom: 2 }}>{row.label}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: t.inkSub }}>{row.description}</p>
                </div>
                <Toggle checked={row.checked} onChange={row.onChange} t={t} />
              </div>
            ))}
          </SectionCard>

          {/* 05 Beveiliging */}
          <SectionCard t={t}>
            <SectionTitle number="05" title="Beveiliging" description="Beheer je accountveiligheid en privacy." complete={twoFaOn} t={t} />
            {[
              { label: "Privacymodus", description: "Verberg persoonlijke gegevens van publieke profielen.", checked: privacyOn, onChange: setPrivacyOn },
              { label: "Tweestapsverificatie (2FA)", description: "Extra beveiliging bij het inloggen via je telefoon.", checked: twoFaOn, onChange: setTwoFaOn },
            ].map(row => (
              <div key={row.label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14,
                padding: "14px 16px", borderRadius: 12, background: t.surface2, border: `1px solid ${t.border}`, marginBottom: 10,
              }}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: t.ink, marginBottom: 2 }}>{row.label}</p>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: t.inkSub }}>{row.description}</p>
                </div>
                <Toggle checked={row.checked} onChange={row.onChange} t={t} />
              </div>
            ))}
            <Divider t={t} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Download mijn data", desc: "Exporteer een kopie van je accountgegevens", action: () => showToast("success", "Data export gestart. Je ontvangt binnenkort een e-mail."),
                  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.inkSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
                { label: "Wachtwoord resetten", desc: "Stuur een reset link naar je e-mailadres", action: () => showToast("success", "Wachtwoord reset e-mail verstuurd"),
                  icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.inkSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> },
              ].map(btn => (
                <button key={btn.label} onClick={btn.action} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "13px 16px", background: t.surface2, border: `1px solid ${t.border}`,
                  borderRadius: 12, cursor: "pointer", width: "100%", transition: "border-color .15s",
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = t.red}
                  onMouseLeave={e => e.currentTarget.style.borderColor = t.border}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {btn.icon}
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: t.ink }}>{btn.label}</p>
                      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: t.inkSub }}>{btn.desc}</p>
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={t.inkSub} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 20, padding: "16px", background: `${t.danger}08`, border: `1px solid ${t.danger}20`, borderRadius: 12 }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: t.danger, marginBottom: 4 }}>Gevaarlijke zone</p>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: t.inkSub, marginBottom: 12 }}>Het verwijderen van je account is permanent en kan niet ongedaan worden gemaakt.</p>
              <button onClick={() => showToast("error", "Bevestigingsscherm nog niet geïmplementeerd")} style={{
                background: "transparent", border: `1px solid ${t.danger}50`, borderRadius: 8,
                padding: "8px 16px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
                color: t.danger, cursor: "pointer", transition: "background .15s, border-color .15s",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = `${t.danger}12`; e.currentTarget.style.borderColor = t.danger }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = `${t.danger}50` }}>
                Account verwijderen
              </button>
            </div>
          </SectionCard>

          {/* BOTTOM ACTIONS */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, paddingBottom: 32 }}>
            <button onClick={() => setTouched({})} style={{
              background: "transparent", border: `1px solid ${t.border}`, borderRadius: 10,
              padding: "10px 20px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
              color: t.inkSub, cursor: "pointer", transition: "color .15s, border-color .15s",
            }}
              onMouseEnter={e => { e.currentTarget.style.color = t.ink; e.currentTarget.style.borderColor = t.border }}
              onMouseLeave={e => { e.currentTarget.style.color = t.inkSub; e.currentTarget.style.borderColor = t.border }}>
              Annuleren
            </button>
            <button onClick={handleSave} style={{
              background: t.red, border: "none", borderRadius: 10, padding: "10px 28px",
              fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff",
              cursor: "pointer", transition: "opacity .15s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              Wijzigingen opslaan
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
