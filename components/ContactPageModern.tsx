"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button }   from "@/components/ui/button"
import { Input }    from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label }    from "@/components/ui/label"

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

const contactSchema = z.object({
  name:    z.string().min(2, "Naam moet minstens 2 tekens bevatten"),
  email:   z.string().min(1).refine(v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), { message: "Ongeldig e-mailadres" }),
  subject: z.string().min(3, "Onderwerp is verplicht"),
  message: z.string().min(10, "Bericht moet minstens 10 tekens bevatten"),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPageModern() {
  const T = useModernTheme()
  const [loading, setLoading]   = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name:"", email:"", subject:"", message:"" },
  })

  useEffect(() => { setIsLoaded(true) }, [])

  async function onSubmit(_: ContactFormValues) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    alert("Bericht verzonden!")
    form.reset()
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex flex-col"
      style={{ background: T.bg, color: T.ink, transition: "background 0.4s, color 0.4s" }}>

      {/* NOISE */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      {/* GLOW */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] blur-[120px] rounded-full animate-pulse-slow"
        style={{ background: `${T.red}1A` }} />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-12 py-8 md:py-12 mt-6 md:mt-12 flex-grow flex items-start md:items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-start w-full">

          {/* LINKERKANT */}
          <div className="space-y-8">
            <div className={`space-y-6 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <p className="font-mono tracking-[0.3em] uppercase text-sm" style={{ color: T.red }}>
                Neem contact op
              </p>

              <div className="flex items-stretch gap-6 md:gap-8">
                <div className="w-2 md:w-3 animate-pulse"
                  style={{ background: T.red, boxShadow: `0 0 20px ${T.red}66` }} />
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter italic uppercase py-2"
                  style={{ color: T.ink }}>
                  LATEN WE <br />
                  <span className="stroke-text" style={{ color: "transparent" }}>PRATEN</span>
                </h1>
              </div>
            </div>

            <p className="text-lg leading-relaxed font-light max-w-md" style={{ color: T.inkMuted }}>
              Klaar om een project te starten of gewoon even hallo te zeggen?
              Vul het formulier in en ik kom zo snel mogelijk bij je terug.
            </p>

            <div className="pl-6 py-2 space-y-4" style={{ borderLeft: `1px solid ${T.border}` }}>
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1 italic" style={{ color: T.red }}>E-mail</h3>
                <p className="font-medium" style={{ color: T.ink }}>jarnewaterschoot@hotmail.com</p>
              </div>
              <div>
                <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] mb-1 italic" style={{ color: T.red }}>Locatie</h3>
                <p className="font-medium" style={{ color: T.ink }}>België</p>
              </div>
            </div>
          </div>

          {/* RECHTERKANT: FORMULIER */}
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-8 rounded-2xl"
              style={{
                background: `${T.surface}CC`,
                border: `1px solid ${T.border}`,
                backdropFilter: "blur(12px)",
              }}
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px]" style={{ color: T.inkMuted }}>Naam</Label>
                  <Input {...form.register("name")}
                    className="rounded-none transition-all"
                    style={{ background: T.isLight ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)", border: `1px solid ${T.border}`, color: T.ink }} />
                  {form.formState.errors.name && <p className="text-[10px] uppercase" style={{ color: T.red }}>{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="uppercase tracking-widest text-[10px]" style={{ color: T.inkMuted }}>Email</Label>
                  <Input type="email" {...form.register("email")}
                    className="rounded-none transition-all"
                    style={{ background: T.isLight ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)", border: `1px solid ${T.border}`, color: T.ink }} />
                  {form.formState.errors.email && <p className="text-[10px] uppercase" style={{ color: T.red }}>{form.formState.errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-[10px]" style={{ color: T.inkMuted }}>Onderwerp</Label>
                <Input {...form.register("subject")}
                  className="rounded-none transition-all"
                  style={{ background: T.isLight ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)", border: `1px solid ${T.border}`, color: T.ink }} />
              </div>

              <div className="space-y-2">
                <Label className="uppercase tracking-widest text-[10px]" style={{ color: T.inkMuted }}>Bericht</Label>
                <Textarea rows={4} {...form.register("message")}
                  className="rounded-none transition-all resize-none"
                  style={{ background: T.isLight ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.4)", border: `1px solid ${T.border}`, color: T.ink }} />
                {form.formState.errors.message && <p className="text-[10px] uppercase" style={{ color: T.red }}>{form.formState.errors.message.message}</p>}
              </div>

              <Button
                className="w-full font-bold uppercase tracking-widest py-6 transition-all duration-300 rounded-none overflow-hidden group relative"
                style={{ background: T.red, color: "#fff", border: "none" }}
                disabled={loading}
              >
                <span className="relative z-10">{loading ? "Verzenden..." : "Verstuur Bericht"}</span>
                <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10" />
              </Button>
            </form>
          </div>
        </div>
      </main>

      <style jsx>{`
        .stroke-text { -webkit-text-stroke: clamp(0.3px, 0.1vw, 1px) ${T.isLight ? "rgba(13,12,20,0.35)" : "rgba(255,255,255,0.4)"}; }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1);    opacity: 0.1;  }
          50%       { transform: scale(1.05); opacity: 0.15; }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}
