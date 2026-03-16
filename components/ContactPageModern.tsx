"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button }   from "@/components/ui/button"
import { Input }    from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label }    from "@/components/ui/label"

const contactSchema = z.object({
  name:    z.string().min(2, "Naam moet minstens 2 tekens bevatten"),
  email:   z.string().email("Ongeldig e-mailadres"),
  subject: z.string().min(3, "Onderwerp is verplicht"),
  message: z.string().min(10, "Bericht moet minstens 10 tekens bevatten"),
})

type ContactFormValues = z.infer<typeof contactSchema>

export default function ContactPageModern() {
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
    <div className="relative min-h-screen w-full bg-[#0a0a0a] overflow-x-hidden flex flex-col">

      {/* NOISE & GLOW */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-[1] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full animate-pulse-slow" />

      <main className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12 py-12 mt-12 flex-grow flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-start w-full">

          {/* LINKERKANT */}
          <div className="space-y-8">
            <div className={`space-y-6 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <p className="text-red-700 font-mono tracking-[0.3em] uppercase text-sm">
                Get in touch — Contact
              </p>

              <div className="flex items-stretch gap-6 md:gap-8">
                <div className="w-2 md:w-3 bg-red-800 animate-pulse shadow-[0_0_20px_rgba(153,27,27,0.4)]" />
                <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter italic uppercase py-2">
                  LET'S <br />
                  <span className="text-transparent stroke-text">TALK</span>
                </h1>
              </div>
            </div>

            <p className="text-zinc-400 text-lg leading-relaxed font-light max-w-md">
              Klaar om een project te starten of gewoon even hallo te zeggen?
              Vul het formulier in en ik kom zo snel mogelijk bij je terug.
            </p>

            <div className="border-l border-zinc-800 pl-6 py-2 space-y-4">
              <div>
                <h3 className="text-red-600 font-mono text-[10px] uppercase tracking-[0.2em] mb-1 italic">E-mail</h3>
                <p className="text-white font-medium">jarnewaterschoot@hotmail.com</p>
              </div>
              <div>
                <h3 className="text-red-600 font-mono text-[10px] uppercase tracking-[0.2em] mb-1 italic">Locatie</h3>
                <p className="text-white font-medium">België</p>
              </div>
            </div>
          </div>

          {/* RECHTERKANT: FORMULIER */}
          <div className={`transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 bg-zinc-900/20 backdrop-blur-md p-8 border border-zinc-800/50 rounded-2xl"
            >
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-zinc-500 uppercase tracking-widest text-[10px]">Naam</Label>
                  <Input {...form.register("name")} className="bg-black/40 border-zinc-800 focus:border-red-800 text-white rounded-none transition-all" />
                  {form.formState.errors.name && <p className="text-[10px] text-red-500 uppercase">{form.formState.errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-500 uppercase tracking-widest text-[10px]">Email</Label>
                  <Input type="email" {...form.register("email")} className="bg-black/40 border-zinc-800 focus:border-red-800 text-white rounded-none transition-all" />
                  {form.formState.errors.email && <p className="text-[10px] text-red-500 uppercase">{form.formState.errors.email.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-500 uppercase tracking-widest text-[10px]">Onderwerp</Label>
                <Input {...form.register("subject")} className="bg-black/40 border-zinc-800 focus:border-red-800 text-white rounded-none transition-all" />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-500 uppercase tracking-widest text-[10px]">Bericht</Label>
                <Textarea rows={4} {...form.register("message")} className="bg-black/40 border-zinc-800 focus:border-red-800 text-white rounded-none transition-all resize-none" />
                {form.formState.errors.message && <p className="text-[10px] text-red-500 uppercase">{form.formState.errors.message.message}</p>}
              </div>

              <Button
                className="w-full bg-red-800 hover:bg-red-700 text-white font-bold uppercase tracking-widest py-6 transition-all duration-300 rounded-none overflow-hidden group relative"
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
        .stroke-text { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4); }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1);    opacity: 0.1;  }
          50%       { transform: scale(1.05); opacity: 0.15; }
        }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}