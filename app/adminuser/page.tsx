"use client"

import React, { useState, useCallback, useRef } from "react"

// ── THEME ─────────────────────────────────────────────────────────────────────
const ACCENT_SWATCHES = [
  "#FF5C1A","#5B8DEF","#34C759","#BF5AF2","#FF375F","#FFD60A","#5AC8FA","#FF9F0A",
]
const BG_OPTIONS = [
  { bg: "#000000", light: false }, { bg: "#0D1117", light: false },
  { bg: "#0A0F1E", light: false }, { bg: "#F5F2EE", light: true },
  { bg: "#FFFFFF",  light: true },
]
const FONTS = [
  { label: "Mono",  value: "'DM Mono', monospace" },
  { label: "Sans",  value: "'DM Sans', sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
]
const RADII = [
  { label: "Scherp", value: "0px" },
  { label: "Zacht",  value: "6px" },
  { label: "Rond",   value: "12px" },
]

interface Theme {
  accent: string; bg: string; surf: string; surf2: string
  border: string; border2: string; ink: string; ink2: string; ink3: string
  font: string; radius: string
}
const DEFAULT_THEME: Theme = {
  accent: "#FF5C1A", bg: "#000000", surf: "#0A0A0A", surf2: "#111111",
  border: "#1A1A1A", border2: "#2A2A2A", ink: "#F0EDE8", ink2: "#888882",
  ink3: "#3A3A38", font: "'DM Mono', monospace", radius: "0px",
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
  city:      (v) => v.trim().length < 2 ? "Vul een stad in" : null,
  country:   (v) => v.trim().length < 2 ? "Vul een land in" : null,
  role:      (v) => v.trim().length < 2 ? "Vul een functie in" : null,
  bio:       (v) => v.length > 200 ? "Maximum 200 tekens" : null,
  instagram: (v) => (v && !/^@?[\w.]+$/.test(v)) ? "Ongeldige handle" : null,
}

// ── FIELD ─────────────────────────────────────────────────────────────────────
function Field({ label, value, onChange, onBlur, type = "text", placeholder,
  mono = false, error, touched, success, t }: {
  label: string; value: string; onChange: (v: string) => void; onBlur?: () => void
  type?: string; placeholder?: string; mono?: boolean; error?: string | null
  touched?: boolean; success?: boolean; t: Theme
}) {
  const [focused, setFocused] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const isPass = type === "password"
  const showError = !!(touched && error)
  const showOk    = !!(touched && !error && value && success)
  const bc = showError ? "#FF3B30" : focused ? t.accent : t.border

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: t.font, fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase",
        color: showError ? "#FF3B30" : focused ? t.accent : t.ink2, transition: "color .2s" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          type={isPass ? (showPass ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); onBlur?.() }}
          placeholder={placeholder}
          style={{
            width: "100%", background: focused ? t.surf2 : t.surf,
            border: `1px solid ${bc}`, borderRadius: t.radius, color: t.ink,
            fontFamily: mono ? "'DM Mono', monospace" : t.font, fontSize: 13, fontWeight: 300,
            padding: `11px ${isPass ? "64px" : "34px"} 11px 12px`,
            transition: "border-color .2s, background .2s", outline: "none", boxSizing: "border-box",
          }}
        />
        <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 6, alignItems: "center" }}>
          {isPass && (
            <button type="button" onClick={() => setShowPass(v => !v)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px",
                color: showPass ? t.accent : t.ink2, fontSize: 13, lineHeight: 1, transition: "color .2s", display: "flex" }}>
              {showPass
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              }
            </button>
          )}
          {showError && <span style={{ color: "#FF3B30", fontSize: 11 }}>✕</span>}
          {showOk    && <span style={{ color: "#34C759", fontSize: 11 }}>✓</span>}
        </div>
      </div>
      {showError && <p style={{ fontFamily: t.font, fontSize: 9, color: "#FF3B30", letterSpacing: "0.14em", margin: 0 }}>{error}</p>}
    </div>
  )
}

// ── TEXTAREA ──────────────────────────────────────────────────────────────────
function TextareaField({ label, value, onChange, onBlur, placeholder, error, touched, t }: {
  label: string; value: string; onChange: (v: string) => void; onBlur?: () => void
  placeholder?: string; error?: string | null; touched?: boolean; t: Theme
}) {
  const [focused, setFocused] = useState(false)
  const showError = !!(touched && error)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontFamily: t.font, fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase",
        color: showError ? "#FF3B30" : focused ? t.accent : t.ink2 }}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); onBlur?.() }}
        placeholder={placeholder} rows={4}
        style={{ background: focused ? t.surf2 : t.surf, border: `1px solid ${showError ? "#FF3B30" : focused ? t.accent : t.border}`,
          color: t.ink, fontFamily: t.font, fontSize: 13, fontWeight: 300, lineHeight: 1.75,
          padding: "11px 12px", outline: "none", resize: "none", width: "100%", boxSizing: "border-box",
          borderRadius: t.radius, transition: "border-color .2s, background .2s" }} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {showError && <p style={{ fontFamily: t.font, fontSize: 9, color: "#FF3B30", letterSpacing: "0.14em", margin: 0 }}>{error}</p>}
        <span style={{ marginLeft: "auto", fontFamily: t.font, fontSize: 9, letterSpacing: "0.12em",
          color: value.length > 180 ? t.accent : t.ink3 }}>{value.length} / 200</span>
      </div>
    </div>
  )
}

// ── SECTION HEADER ────────────────────────────────────────────────────────────
function SectionHeader({ label, complete, t }: { label: string; complete: boolean; t: Theme }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8 }}>
      <div style={{ width: 16, height: 1, background: complete ? "#34C759" : t.accent }} />
      <span style={{ fontFamily: t.font, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase",
        color: complete ? "#34C759" : t.accent }}>{label}</span>
      {complete && <span style={{ fontSize: 10, color: "#34C759" }}>✓</span>}
    </div>
  )
}

// ── TOGGLE ROW ────────────────────────────────────────────────────────────────
function ToggleRow({ icon, label, sub, checked, onChange, t }: {
  icon: string; label: string; sub?: string; checked: boolean; onChange: (v: boolean) => void; t: Theme
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
      background: t.surf, border: `1px solid ${t.border}`, borderRadius: t.radius, marginBottom: 10 }}>
      <div style={{ width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
        background: checked ? `${t.accent}22` : t.surf2, border: `1px solid ${checked ? t.accent : t.border}`,
        borderRadius: t.radius, fontSize: 16, flexShrink: 0, transition: "all .2s" }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: t.font, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: t.ink }}>{label}</div>
        {sub && <div style={{ fontFamily: t.font, fontSize: 10, color: t.ink2, marginTop: 3, letterSpacing: "0.06em" }}>{sub}</div>}
      </div>
      <button onClick={() => onChange(!checked)} style={{
        width: 22, height: 22, border: `1px solid ${checked ? t.accent : t.border}`,
        background: checked ? t.accent : "transparent", borderRadius: t.radius,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .2s", flexShrink: 0,
      }}>
        {checked && <span style={{ color: "#000", fontSize: 11, fontWeight: 700, lineHeight: 1 }}>✓</span>}
      </button>
    </div>
  )
}

// ── TOAST ─────────────────────────────────────────────────────────────────────
function Toast({ show, type, message, t }: { show: boolean; type: "success"|"error"; message: string; t: Theme }) {
  const color = type === "error" ? "#FF3B30" : t.accent
  if (!show) return null
  return (
    <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", zIndex: 1000,
      background: t.bg, border: `1px solid ${color}`, display: "flex", alignItems: "center",
      gap: 12, padding: "12px 20px 12px 14px", minWidth: 260, borderRadius: t.radius }}>
      <div style={{ width: 3, alignSelf: "stretch", background: color, flexShrink: 0, borderRadius: 2 }} />
      <span style={{ fontSize: 14 }}>{type === "error" ? "✕" : "✓"}</span>
      <div>
        <div style={{ fontFamily: t.font, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color }}>
          {type === "error" ? "Fout" : "Succes"}
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: t.ink, marginTop: 2, fontWeight: 300 }}>{message}</div>
      </div>
    </div>
  )
}

// ── THEME PANEL ───────────────────────────────────────────────────────────────
function ThemePanel({ theme, onChange }: { theme: Theme; onChange: (t: Theme) => void }) {
  const setBg = (bg: string, light: boolean) => onChange({
    ...theme, bg,
    surf:    light ? "#EEEBE7" : "#0A0A0A", surf2:   light ? "#E5E2DE" : "#111111",
    border:  light ? "#D5D0CA" : "#1A1A1A", border2: light ? "#C0BAB3" : "#2A2A2A",
    ink:     light ? "#1A1816" : "#F0EDE8", ink2:    light ? "#6B6660" : "#888882",
    ink3:    light ? "#B5B0AA" : "#3A3A38",
  })
  const sw = (active: boolean, bg: string, bord?: string): React.CSSProperties => ({
    width: 20, height: 20, borderRadius: "50%", background: bg, cursor: "pointer",
    border: active ? `2px solid ${theme.ink}` : `1px solid ${bord || "transparent"}`,
    transform: active ? "scale(1.25)" : "scale(1)", transition: "transform .2s", flexShrink: 0,
  })
  const ob = (active: boolean): React.CSSProperties => ({
    flex: 1, border: `1px solid ${active ? theme.accent : theme.border}`,
    background: "transparent", color: active ? theme.accent : theme.ink2,
    fontFamily: theme.font, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
    padding: "7px 4px", cursor: "pointer", transition: "all .2s", borderRadius: theme.radius,
  })
  const lbl: React.CSSProperties = { fontFamily: theme.font, fontSize: 9, letterSpacing: "0.26em",
    textTransform: "uppercase", color: theme.ink2, display: "block", marginBottom: 8, marginTop: 12 }
  return (
    <div>
      <label style={{ ...lbl, marginTop: 0 }}>Accentkleur</label>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {ACCENT_SWATCHES.map(c => <div key={c} style={sw(theme.accent === c, c)} onClick={() => onChange({ ...theme, accent: c })} />)}
      </div>
      <label style={lbl}>Achtergrond</label>
      <div style={{ display: "flex", gap: 6 }}>
        {BG_OPTIONS.map(b => <div key={b.bg} style={sw(theme.bg === b.bg, b.bg, b.light ? "#ccc" : "#333")} onClick={() => setBg(b.bg, b.light)} />)}
      </div>
      <label style={lbl}>Lettertype</label>
      <div style={{ display: "flex", gap: 6 }}>
        {FONTS.map(f => <button key={f.label} style={ob(theme.font === f.value)} onClick={() => onChange({ ...theme, font: f.value })}>{f.label}</button>)}
      </div>
      <label style={lbl}>Hoeken</label>
      <div style={{ display: "flex", gap: 6 }}>
        {RADII.map(r => <button key={r.label} style={ob(theme.radius === r.value)} onClick={() => onChange({ ...theme, radius: r.value })}>{r.label}</button>)}
      </div>
    </div>
  )
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [theme, setTheme]     = useState<Theme>(DEFAULT_THEME)
  const [form,  setForm]      = useState<FormState>(DEFAULT_FORM)
  const [touched, setTouched] = useState<Partial<Record<FormKey, boolean>>>({})
  const [toast,  setToast]    = useState<{ show: boolean; type: "success"|"error"; message: string }>({ show: false, type: "success", message: "" })
  const [pushOn,    setPushOn]    = useState(true)
  const [emailOn,   setEmailOn]   = useState(true)
  const [privacyOn, setPrivacyOn] = useState(false)
  const [twoFaOn,   setTwoFaOn]   = useState(false)
  const [links,     setLinks]     = useState<string[]>([])
  const [newLink,   setNewLink]   = useState("")
  const [addingLink, setAddingLink] = useState(false)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const t = theme

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
  const initials    = form.firstName[0] || form.lastName[0]
    ? `${form.firstName[0] ?? ""}${form.lastName[0] ?? ""}` : "JW"

  const handleSave = () => {
    touchAll()
    if (!isFormValid) { showToast("error", "Controleer de fouten"); return }
    showToast("success", "Profiel opgeslagen")
  }

  const card: React.CSSProperties      = { background: t.surf, border: `1px solid ${t.border}`, padding: "20px", borderRadius: t.radius, position: "relative" }
  const ctitle: React.CSSProperties    = { fontFamily: t.font, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: t.accent, marginBottom: 16 }
  const saveBtn: React.CSSProperties   = { border: `1px solid ${t.accent}`, background: "transparent", color: t.accent, fontFamily: t.font, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", padding: "11px 24px", borderRadius: t.radius, cursor: "pointer" }
  const cancelBtn: React.CSSProperties = { border: `1px solid ${t.border}`, background: "transparent", color: t.ink2, fontFamily: t.font, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", padding: "11px 16px", borderRadius: t.radius, cursor: "pointer" }
  const subText: React.CSSProperties   = { fontFamily: t.font, fontSize: 9, color: t.ink2, letterSpacing: "0.14em", marginBottom: 16 }
  const inlineInput: React.CSSProperties = { flex: 1, background: "transparent", border: "none", color: t.ink, fontFamily: t.font, fontSize: 13, outline: "none" }

  return (
    <div style={{ background: t.bg, minHeight: "100vh", color: t.ink, fontFamily: t.font }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:${t.accent};color:#000}
        ::-webkit-scrollbar{width:2px} ::-webkit-scrollbar-thumb{background:${t.accent}}
        input::placeholder,textarea::placeholder{color:${t.ink3};font-family:${t.font};font-size:12px}
        select option{background:${t.surf};color:${t.ink}}
      `}</style>

      <Toast show={toast.show} type={toast.type} message={toast.message} t={t} />

      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${t.border}`, padding: "28px 48px 22px", position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,${t.accent},transparent)` }} />
        <div>
          <div style={{ fontSize: 8, letterSpacing: "0.32em", textTransform: "uppercase", color: t.accent, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 14, height: 1, background: t.accent, display: "inline-block" }} />Instellingen
          </div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(32px,4vw,52px)", letterSpacing: "0.06em", lineHeight: 0.9 }}>
            Mijn <span style={{ WebkitTextStroke: `1.5px ${t.accent}`, color: "transparent" }}>Profiel</span>
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {hasChanges && <span style={{ fontSize: 9, color: t.ink2, letterSpacing: "0.14em" }}>Niet opgeslagen</span>}
          <button style={saveBtn} onClick={handleSave}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = t.accent; (e.target as HTMLButtonElement).style.color = "#000" }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = "transparent"; (e.target as HTMLButtonElement).style.color = t.accent }}>
            Opslaan ↗
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>

        {/* SIDEBAR */}
        <div style={{ borderRight: `1px solid ${t.border}`, padding: "28px 18px", display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 0, height: "calc(100vh - 90px)", overflowY: "auto" }}>
          <div style={{ ...card, textAlign: "center" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,${t.accent},transparent)` }} />
            <div style={{ width: 68, height: 68, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, background: t.surf2, border: `1px solid ${t.border}`, color: t.accent, borderRadius: t.radius, margin: "0 auto 12px" }}>
              {initials}
            </div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, color: form.firstName || form.lastName ? t.ink : t.ink3, lineHeight: 1 }}>
              {form.firstName || form.lastName ? `${form.firstName} ${form.lastName}`.trim() : "Jouw naam"}
            </div>
            <div style={{ fontFamily: t.font, fontSize: 10, color: t.accent, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 5 }}>
              {form.role || "Jouw functietitel"}
            </div>
            <div style={{ fontFamily: t.font, fontSize: 11, color: t.ink2, marginTop: 3 }}>
              {form.city || form.country ? `${form.city}${form.city && form.country ? ", " : ""}${form.country}` : "Jouw locatie"}
            </div>
            <div style={{ height: 1, background: t.border, margin: "10px 0" }} />
            {[["Email", form.email, "Vul je e-mail in"], ["Instagram", form.instagram, "Vul je handle in"]].map(([lbl, val, fb]) => (
              <div key={lbl} style={{ textAlign: "left", marginBottom: 8 }}>
                <span style={{ display: "block", fontFamily: t.font, fontSize: 9, color: t.accent, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 2 }}>{lbl}</span>
                <span style={{ fontFamily: t.font, fontSize: 11, color: val ? t.ink : t.ink3, wordBreak: "break-all" }}>{val || fb}</span>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={ctitle}>Volledigheid</div>
            {[
              { label: "Persoonlijk",   done: isCoreValid },
              { label: "Bio",           done: isBioValid },
              { label: "Sociale Media", done: !!form.instagram || links.length > 0 },
              { label: "Communicatie",  done: pushOn || emailOn },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                <span style={{ fontFamily: t.font, fontSize: 11, color: item.done ? t.ink : t.ink2, letterSpacing: "0.08em" }}>{item.label}</span>
                <span style={{ fontSize: 13, color: item.done ? "#34C759" : t.ink3, transition: "color .3s" }}>{item.done ? "✓" : "○"}</span>
              </div>
            ))}
          </div>

          <div style={card}>
            <div style={ctitle}>Uiterlijk</div>
            <ThemePanel theme={theme} onChange={setTheme} />
          </div>
        </div>

        {/* MAIN */}
        <div style={{ padding: "36px 44px" }}>

          {/* 1. Persoonlijke Info */}
          <section style={{ marginBottom: 40 }}>
            <SectionHeader label="Persoonlijke Info" complete={isCoreValid} t={t} />
            <p style={{ ...subText, marginBottom: 20 }}>Beheer je basisgegevens en identiteit op het platform.</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
              <Field label="Voornaam"   value={form.firstName} onChange={update("firstName")} onBlur={touch("firstName")} error={getError("firstName")} touched={touched.firstName} success placeholder="Vul je voornaam in" t={t} />
              <Field label="Achternaam" value={form.lastName}  onChange={update("lastName")}  onBlur={touch("lastName")}  error={getError("lastName")}  touched={touched.lastName}  success placeholder="Vul je achternaam in" t={t} />
              <Field label="E-mail"     value={form.email}     onChange={update("email")}     onBlur={touch("email")}     type="email" mono error={getError("email")} touched={touched.email} success placeholder="Vul je e-mailadres in" t={t} />
              <Field label="Telefoon"   value={form.phone}     onChange={update("phone")}     onBlur={touch("phone")}     mono error={getError("phone")} touched={touched.phone} success placeholder="Vul je telefoonnummer in" t={t} />
              <Field label="Stad"       value={form.city}      onChange={update("city")}      onBlur={touch("city")}      error={getError("city")}    touched={touched.city}    success placeholder="Vul je stad in" t={t} />
              <Field label="Land"       value={form.country}   onChange={update("country")}   onBlur={touch("country")}   error={getError("country")} touched={touched.country} success placeholder="Vul je land in" t={t} />
            </div>
            <Field label="Functietitel" value={form.role} onChange={update("role")} onBlur={touch("role")} error={getError("role")} touched={touched.role} success placeholder="Vul je functietitel in" t={t} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: t.font, fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: t.ink2 }}>Geboortedatum</label>
                <input type="date" value={form.birthdate} onChange={e => update("birthdate")(e.target.value)}
                  style={{ background: t.surf, border: `1px solid ${t.border}`, borderRadius: t.radius, color: t.ink, fontFamily: t.font, fontSize: 13, padding: "11px 12px", outline: "none", width: "100%", colorScheme: "dark" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontFamily: t.font, fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: t.ink2 }}>Geslacht</label>
                <select value={form.gender} onChange={e => update("gender")(e.target.value)}
                  style={{ background: t.surf, border: `1px solid ${t.border}`, borderRadius: t.radius, color: form.gender ? t.ink : t.ink3, fontFamily: t.font, fontSize: 13, padding: "11px 12px", outline: "none", width: "100%", appearance: "none", cursor: "pointer" }}>
                  <option value="" disabled>Selecteer geslacht</option>
                  <option value="man">Man</option>
                  <option value="vrouw">Vrouw</option>
                  <option value="anders">Anders / Niet vermeld</option>
                </select>
              </div>
            </div>
          </section>

          {/* 2. Bio */}
          <section style={{ marginBottom: 40 }}>
            <SectionHeader label="Bio" complete={isBioValid} t={t} />
            <p style={{ ...subText, marginBottom: 20 }}>Een korte beschrijving die op je publiek profiel verschijnt.</p>
            <TextareaField label="Korte beschrijving" value={form.bio} onChange={update("bio")} onBlur={touch("bio")} placeholder="Beschrijf jezelf kort, max. 200 tekens…" error={getError("bio")} touched={touched.bio} t={t} />
          </section>

          {/* 3. Sociale Media */}
          <section style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <SectionHeader label="Sociale Media" complete={!!form.instagram || links.length > 0} t={t} />
              <button onClick={() => setAddingLink(v => !v)}
                style={{ width: 28, height: 28, borderRadius: t.radius, border: `1px solid ${t.accent}`, background: "transparent", color: t.accent, cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8, flexShrink: 0, lineHeight: 1 }}>
                {addingLink ? "×" : "+"}
              </button>
            </div>
            <p style={{ ...subText, marginBottom: 16 }}>Koppel je profielen en deel je externe kanalen.</p>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: t.surf, border: `1px solid ${t.border}`, borderRadius: t.radius, marginBottom: 10 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>📷</span>
              <input value={form.instagram} onChange={e => update("instagram")(e.target.value)}
                placeholder="Instagram handle" style={inlineInput} />
            </div>
            {links.map((link, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: t.surf, border: `1px solid ${t.border}`, borderRadius: t.radius, marginBottom: 10 }}>
                <span style={{ fontSize: 18 }}>🔗</span>
                <input value={link} onChange={e => { const nl = [...links]; nl[i] = e.target.value; setLinks(nl) }}
                  placeholder="URL" style={inlineInput} />
                <button onClick={() => setLinks(links.filter((_, j) => j !== i))}
                  style={{ background: "none", border: "none", color: t.ink3, cursor: "pointer", fontSize: 16, lineHeight: 1, padding: "2px 4px" }}>×</button>
              </div>
            ))}
            {addingLink && (
              <div style={{ background: t.surf, border: `1px solid ${t.accent}`, borderRadius: t.radius, padding: "14px" }}>
                <div style={{ fontFamily: t.font, fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: t.accent, marginBottom: 10 }}>Nieuwe Link</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={newLink} onChange={e => setNewLink(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && newLink.trim()) { setLinks([...links, newLink.trim()]); setNewLink(""); setAddingLink(false) }}}
                    placeholder="Vul een URL in" style={{ flex: 1, background: t.surf2, border: `1px solid ${t.border}`, borderRadius: t.radius, color: t.ink, fontFamily: t.font, fontSize: 13, padding: "10px 12px", outline: "none" }} />
                  <button onClick={() => { if (newLink.trim()) { setLinks([...links, newLink.trim()]); setNewLink(""); setAddingLink(false) }}}
                    style={{ ...saveBtn, padding: "10px 16px" }}>+</button>
                </div>
              </div>
            )}
          </section>

          {/* 4. Communicatie */}
          <section style={{ marginBottom: 40 }}>
            <SectionHeader label="Communicatie" complete={pushOn || emailOn} t={t} />
            <p style={{ ...subText, marginBottom: 16 }}>Bepaal hoe en wanneer we contact met je opnemen.</p>
            <ToggleRow icon="📱" label="Push Meldingen" checked={pushOn}  onChange={setPushOn}  t={t} />
            <ToggleRow icon="✉️" label="E-mail Alerts"  checked={emailOn} onChange={setEmailOn} t={t} />
          </section>

          {/* 5. Security & GDPR */}
          <section style={{ marginBottom: 40 }}>
            <SectionHeader label="Security & GDPR" complete={twoFaOn} t={t} />
            <p style={{ ...subText, marginBottom: 16 }}>Beheer je accountveiligheid en 2FA.</p>
            <ToggleRow icon="🔒" label="Privacy Mode" sub="Verberg gevoelige informatie van publieke profielen." checked={privacyOn} onChange={setPrivacyOn} t={t} />
            <ToggleRow icon="🔑" label="2-Stap Verificatie" checked={twoFaOn} onChange={setTwoFaOn} t={t} />
            <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: t.surf, border: `1px solid ${t.border}`, borderRadius: t.radius, color: t.ink, fontFamily: t.font, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", cursor: "pointer", transition: "border-color .2s", marginBottom: 10 }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = t.border}
              onClick={() => showToast("success", "Data export gestart — je ontvangt een e-mail")}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ fontSize: 16 }}>📥</span><span>Download Mijn Data</span></div>
              <span style={{ color: t.ink2, fontSize: 16 }}>›</span>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: t.surf, border: `1px solid ${t.border}`, borderRadius: t.radius, marginBottom: 10 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>🎨</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: t.font, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: t.ink }}>Profiel Accent</div>
                <div style={{ fontFamily: t.font, fontSize: 10, color: t.ink2, marginTop: 3 }}>Kies een kleur voor je kaart.</div>
              </div>
              <div style={{ width: 28, height: 28, borderRadius: t.radius, background: t.accent, border: `1px solid ${t.border2}`, cursor: "pointer" }}
                onClick={() => { const next = ACCENT_SWATCHES[(ACCENT_SWATCHES.indexOf(t.accent) + 1) % ACCENT_SWATCHES.length]; setTheme(p => ({ ...p, accent: next })) }} />
            </div>
            <div style={{ height: 1, background: t.border, margin: "20px 0" }} />
            <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px", background: t.ink, border: `1px solid ${t.ink}`, borderRadius: t.radius, color: t.bg, fontFamily: t.font, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "opacity .2s", marginBottom: 10 }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.opacity = "1"}
              onClick={() => showToast("success", "Wachtwoord reset e-mail verstuurd")}>
              <span>🔒</span> Wachtwoord Reset
            </button>
            <button style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "14px", background: "transparent", border: `1px solid #FF3B3022`, borderRadius: t.radius, color: "#FF3B30", fontFamily: t.font, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer", transition: "all .2s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#FF3B3012"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#FF3B30" }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = "#FF3B3022" }}
              onClick={() => showToast("error", "Account verwijderen — implementeer bevestigingsmodal")}>
              <span>🗑</span> Verwijder Account
            </button>
          </section>

          {/* Actions */}
          <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 24, display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button style={cancelBtn} onClick={() => setTouched({})}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = t.ink}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = t.ink2}>
              Annuleren
            </button>
            <button style={{ ...saveBtn, display: "flex", alignItems: "center", gap: 10 }} onClick={handleSave}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = t.accent; (e.currentTarget as HTMLButtonElement).style.color = "#000" }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = t.accent }}>
              Wijzigingen Opslaan →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}