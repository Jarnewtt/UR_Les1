"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
type Theme = {
  bg: string; surface: string; ink: string; inkSub: string; inkMuted: string
  red: string; border: string; isLight: boolean
}
const DARK: Theme  = { bg:"#0C0C12", surface:"#14141E", ink:"#F2F0EC", inkSub:"#B8B6C4", inkMuted:"#787688", red:"#E8280A", border:"#22222E", isLight:false }
const LIGHT: Theme = { bg:"#F5F4F8", surface:"#EEEDF2", ink:"#0D0C14", inkSub:"#2A2830", inkMuted:"#56546A", red:"#CC1F00", border:"#D0CED8", isLight:true  }

function useModernTheme(): Theme {
  const [isDark, setIsDark] = useState(true)
  useEffect(() => {
    setIsDark(!document.documentElement.classList.contains("theme-light"))
    const handler = (e: Event) => setIsDark((e as CustomEvent).detail.isDark)
    window.addEventListener("theme-change", handler)
    return () => window.removeEventListener("theme-change", handler)
  }, [])
  return isDark ? DARK : LIGHT
}

export default function LoginPage() {
  const T = useModernTheme()
  const [loading, setLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => { setIsLoaded(true) }, [])

  async function mockSubmit(e: React.FormEvent, actionName: string) {
    e.preventDefault()
    setLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1200))
      toast.success(`${actionName} succesvol!`)
    } catch {
      toast.error(`Fout bij ${actionName}`)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    background: T.isLight ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.4)",
    border: `1px solid ${T.border}`,
    color: T.ink,
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col justify-center items-center"
      style={{ background: T.bg, color: T.ink, transition: "background 0.4s, color 0.4s" }}>

      {/* NOISE */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      {/* GLOW */}
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] blur-[120px] rounded-full animate-pulse-slow"
        style={{ background: `${T.red}1A` }} />

      {/* LOGIN CARD */}
      <main className={`relative z-10 w-full max-w-md px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* HEADER */}
        <div className="mb-10 flex items-center gap-4">
          <div className="w-1.5 h-12 animate-pulse"
            style={{ background: T.red, boxShadow: `0 0 15px ${T.red}66` }} />
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter" style={{ color: T.ink }}>
              Jarne <span className="stroke-text" style={{ color: "transparent" }}>Waterschoot</span>
            </h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: T.red }}>
              Toegang 2025/2026 Portaal
            </p>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-3 p-1 rounded-none"
            style={{ background: `${T.surface}66`, border: `1px solid ${T.border}` }}>
            <TabsTrigger
              value="login"
              className="rounded-none data-[state=active]:text-white font-mono text-[10px] uppercase transition-all"
              style={{ color: T.inkMuted }}
            >Aanmelden</TabsTrigger>
            <TabsTrigger
              value="register"
              className="rounded-none data-[state=active]:text-white font-mono text-[10px] uppercase transition-all"
              style={{ color: T.inkMuted }}
            >Registreren</TabsTrigger>
            <TabsTrigger
              value="forgot"
              className="rounded-none data-[state=active]:text-white font-mono text-[10px] uppercase transition-all"
              style={{ color: T.inkMuted }}
            >Herstel</TabsTrigger>
          </TabsList>

          <div className="mt-8 p-8"
            style={{ background: `${T.surface}CC`, border: `1px solid ${T.border}`, backdropFilter: "blur(12px)" }}>

            {/* AANMELDEN */}
            <TabsContent value="login" className="mt-0 outline-none">
              <form onSubmit={(e) => mockSubmit(e, 'Login')} className="space-y-6">
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px]" style={{ color: T.inkMuted }}>E-mailadres</Label>
                  <Input type="email" required className="rounded-none transition-all h-12" style={inputStyle} />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px]" style={{ color: T.inkMuted }}>Wachtwoord</Label>
                  <Input type="password" required className="rounded-none transition-all h-12" style={inputStyle} />
                </div>
                <Button
                  className="w-full font-bold uppercase tracking-widest py-6 transition-all duration-300 rounded-none relative overflow-hidden group"
                  style={{ background: T.red, color: "#fff", border: "none" }}
                  disabled={loading}
                >
                  <span className="relative z-10">{loading ? "Even geduld..." : "Aanmelden"}</span>
                  <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10" />
                </Button>
              </form>
            </TabsContent>

            {/* REGISTREREN */}
            <TabsContent value="register" className="mt-0 outline-none">
              <form onSubmit={(e) => mockSubmit(e, 'Register')} className="space-y-6">
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px]" style={{ color: T.inkMuted }}>E-mailadres</Label>
                  <Input type="email" required className="rounded-none h-12" style={inputStyle} />
                </div>
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px]" style={{ color: T.inkMuted }}>Wachtwoord aanmaken</Label>
                  <Input type="password" required className="rounded-none h-12" style={inputStyle} />
                </div>
                <Button
                  className="w-full font-bold uppercase tracking-widest py-6 transition-all duration-300 rounded-none"
                  style={{ background: T.isLight ? T.ink : "#F0EDE8", color: T.isLight ? T.bg : "#0A0908", border: "none" }}
                  disabled={loading}
                >
                  {loading ? "Bezig..." : "Account aanmaken"}
                </Button>
              </form>
            </TabsContent>

            {/* HERSTEL */}
            <TabsContent value="forgot" className="mt-0 outline-none">
              <form onSubmit={(e) => mockSubmit(e, 'Reset')} className="space-y-6">
                <p className="text-xs font-light leading-relaxed" style={{ color: T.inkMuted }}>
                  Voer je email in om een link te ontvangen voor een nieuw wachtwoord.
                </p>
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px]" style={{ color: T.inkMuted }}>E-mailadres</Label>
                  <Input type="email" required className="rounded-none h-12" style={inputStyle} />
                </div>
                <Button
                  className="w-full font-bold uppercase tracking-widest py-6 transition-all duration-300 rounded-none"
                  style={{ background: "transparent", border: `1px solid ${T.red}`, color: T.red }}
                  disabled={loading}
                >
                  {loading ? "Verzenden..." : "Herstel aanvragen"}
                </Button>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: clamp(0.3px, 0.1vw, 1px) ${T.isLight ? "rgba(13,12,20,0.35)" : "rgba(255,255,255,0.4)"};
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.15; }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
