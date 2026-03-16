"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const DARK = { bg:"#080807", surface:"#111110", ink:"#F0EDE8", inkSub:"#C8C4BE", inkMuted:"#888480", orange:"#FF5C1A", border:"#262420", isLight:false }
const LIGHT = { bg:"#FAFAF8", surface:"#F0EDE8", ink:"#0A0908", inkSub:"#3A3530", inkMuted:"#6A6460", orange:"#E84000", border:"#DDD8D0", isLight:true }
const E = [0.16, 1, 0.3, 1] as const

const contactSchema = z.object({
  name: z.string().min(2, "Naam is verplicht"),
  email: z.string().email("Ongeldig e-mailadres"),
  subject: z.string().min(3, "Onderwerp is verplicht"),
  message: z.string().min(10, "Bericht is te kort"),
})

type ContactFormValues = z.infer<typeof contactSchema>

function useTheme() {
  const [l, setL] = useState(false)
  useEffect(() => {
    const u = () => setL(document.documentElement.classList.contains("theme-light"))
    u()
    const obs = new MutationObserver(u)
    obs.observe(document.documentElement, { attributes:true, attributeFilter:["class"] })
    return () => obs.disconnect()
  }, [])
  return l ? LIGHT : DARK
}

export default function ContactPage() {
  const C = useTheme()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema)
  })

  async function onSubmit(data: ContactFormValues) {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoading(false)
    setIsSubmitted(true)
    reset()
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <div style={{ background:C.bg, minHeight:"100vh", color:C.ink, fontFamily:"'DM Mono',monospace", transition:"background 0.5s, color 0.5s", overflowX: "hidden" }}>
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');
        .input-field {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid ${C.border};
          padding: 16px 0;
          color: ${C.ink};
          font-family: 'DM Sans', sans-serif;
          font-size: 16px;
          outline: none;
          transition: border-color 0.3s ease;
        }
        .input-field:focus {
          border-bottom-color: ${C.orange};
        }
        .label-text {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: ${C.inkMuted};
        }
        .error-text {
          font-size: 10px;
          color: ${C.orange};
          margin-top: 4px;
        }
      `}</style>

      <svg style={{ position:"fixed",inset:0,zIndex:1,opacity:0.025,pointerEvents:"none",width:"100%",height:"100%" }}>
        <filter id="gn"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={4} stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
        <rect width="100%" height="100%" filter="url(#gn)"/>
      </svg>

      <main style={{ position: "relative", zIndex: 2, maxWidth: "1400px", margin: "0 auto", padding: "120px 20px" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "80px" }} className="lg:grid-cols-2">
          
          {/* LINKER KOLOM: TITEL */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 0.8, ease: E }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 30, height: 2, background: C.orange }} />
              <span style={{ fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase", color: C.orange }}>Contact</span>
            </div>

            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(60px, 10vw, 120px)", lineHeight: 0.85, marginBottom: 40 }}>
              LET'S CREATE <br />
              <span style={{ WebkitTextStroke: `1.5px ${C.orange}`, color: "transparent" }}>SOMETHING NEW</span>
            </h1>

            <div style={{ maxWidth: "400px", borderLeft: `1px solid ${C.border}`, paddingLeft: "24px" }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, color: C.inkSub, lineHeight: 1.8, fontSize: "16px" }}>
                Heb je een project in gedachten of wil je gewoon even sparren? Ik sta altijd open voor nieuwe uitdagingen.
              </p>
              
              <div style={{ marginTop: "40px" }}>
                <span className="label-text">E-mail</span>
                <a href="mailto:jarnewaterschoot@hotmail.com" style={{ display: "block", fontSize: "18px", marginTop: "8px", color: C.ink }}>
                  jarnewaterschoot@hotmail.com
                </a>
              </div>
            </div>
          </motion.div>

          {/* RECHTER KOLOM: FORMULIER */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.2, ease: E }}
            style={{ background: C.surface, padding: "48px", border: `1px solid ${C.border}`, position: "relative" }}
          >
            {isSubmitted ? (
              <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} style={{ textAlign:"center", padding: "40px 0" }}>
                <div style={{ fontSize: "40px", marginBottom: "20px" }}>✓</div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "32px" }}>Bericht verzonden</h3>
                <p style={{ color: C.inkMuted, marginTop: "10px" }}>Ik neem zo snel mogelijk contact met je op.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                <div>
                  <label className="label-text">Naam</label>
                  <input {...register("name")} className="input-field" placeholder="Hoe heet je?" />
                  {errors.name && <p className="error-text">{errors.name.message}</p>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
                  <div>
                    <label className="label-text">Email</label>
                    <input {...register("email")} className="input-field" placeholder="je@email.com" />
                    {errors.email && <p className="error-text">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="label-text">Onderwerp</label>
                    <input {...register("subject")} className="input-field" placeholder="Branding, Web..." />
                    {errors.subject && <p className="error-text">{errors.subject.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="label-text">Bericht</label>
                  <textarea {...register("message")} className="input-field" rows={4} placeholder="Vertel me over je project..." style={{ resize: "none" }} />
                  {errors.message && <p className="error-text">{errors.message.message}</p>}
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02, boxShadow: `0 0 20px ${C.orange}44` }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: C.orange,
                    color: "#fff",
                    border: "none",
                    padding: "20px",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "12px",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "12px"
                  }}
                >
                  {loading ? "Verzenden..." : "Verstuur Bericht"}
                  {!loading && <span>→</span>}
                </motion.button>
              </form>
            )}

            {/* Decoratief element in de hoek */}
            <div style={{ position: "absolute", top: 0, right: 0, width: "40px", height: "40px", borderRight: `2px solid ${C.orange}`, borderTop: `2px solid ${C.orange}` }} />
          </motion.div>
        </div>
      </main>
    </div>
  )
}