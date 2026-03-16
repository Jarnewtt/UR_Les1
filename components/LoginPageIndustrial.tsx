"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// ── DESIGN TOKENS ─────────────────────────────────────────────────────────────
type Theme = {
  bg: string; surface: string; ink: string; inkSub: string
  inkMuted: string; orange: string; border: string; isLight: boolean
}

const DARK: Theme  = { bg:"#080807", surface:"#111110", ink:"#F0EDE8", inkSub:"#C8C4BE", inkMuted:"#888480", orange:"#FF5C1A", border:"#262420", isLight:false }
const LIGHT: Theme = { bg:"#FAFAF8", surface:"#F0EDE8", ink:"#0A0908",  inkSub:"#3A3530", inkMuted:"#6A6460", orange:"#E84000", border:"#DDD8D0", isLight:true  }

const E: [number, number, number, number] = [0.16, 1, 0.3, 1]

// ── THEME HOOK ────────────────────────────────────────────────────────────────
function useTheme(): Theme {
  const [l, setL] = useState(false)
  useEffect(() => {
    const u = () => setL(document.documentElement.classList.contains("theme-light"))
    u()
    const obs = new MutationObserver(u)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    return () => obs.disconnect()
  }, [])
  return l ? LIGHT : DARK
}

// ── EYE ICON ──────────────────────────────────────────────────────────────────
function EyeIcon({ open, color }: { open: boolean; color: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {open ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
          <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </>
      )}
    </svg>
  )
}

// ── PASSWORD INPUT ────────────────────────────────────────────────────────────
function PasswordInput({ C, ...rest }: { C: Theme; [key: string]: any }) {
  const [show, setShow]       = useState(false)
  const [focused, setFocused] = useState(false)

  return (
    <div style={{ position: "relative" }}>
      <input
        {...rest}
        type={show ? "text" : "password"}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", background: "transparent", border: "none",
          borderBottom: `1px solid ${focused ? C.orange : C.border}`,
          padding: "12px 32px 12px 0",
          color: C.ink, fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 300,
          outline: "none", transition: "border-color 0.25s",
        }}
      />
      <motion.button
        type="button"
        onClick={() => setShow(s => !s)}
        whileTap={{ scale: 0.85 }}
        style={{
          position: "absolute", right: 0, top: 0, bottom: 0, margin: "auto 0",
          height: "fit-content", background: "none", border: "none", cursor: "pointer",
          padding: 4, display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <EyeIcon open={show} color={show ? C.orange : C.inkMuted} />
      </motion.button>
    </div>
  )
}

// ── VERTICAL DECORATIVE TEXT ──────────────────────────────────────────────────
function VerticalDecor({ C }: { C: Theme }) {
  return (
    <>
      <style>{`
        .vert-decor { display: none; }
        @media (min-width: 768px) { .vert-decor { display: flex; } }
      `}</style>

      {/* Left edge — hidden on mobile */}
      <div className="vert-decor" style={{ position:"fixed", left:28, top:0, bottom:0, flexDirection:"column", justifyContent:"center", alignItems:"center", pointerEvents:"none", zIndex:1 }}>
        <motion.div
          initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
          transition={{ delay:0.5, duration:0.8, ease:E }}
          style={{
            fontFamily:"'Bebas Neue',sans-serif",
            fontSize: 13,
            letterSpacing: "0.55em",
            color: C.ink,
            opacity: 0.10,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            userSelect: "none",
          }}>
          WATERSCHOOT
        </motion.div>
      </div>

      {/* Right edge — hidden on mobile */}
      <div className="vert-decor" style={{ position:"fixed", right:28, top:0, bottom:0, flexDirection:"column", justifyContent:"center", alignItems:"center", pointerEvents:"none", zIndex:1 }}>
        <motion.div
          initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }}
          transition={{ delay:0.9, duration:0.8, ease:E }}
          style={{
            fontFamily:"'DM Mono',monospace",
            fontSize: 9,
            letterSpacing: "0.55em",
            color: C.orange,
            opacity: 0.18,
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            userSelect: "none",
          }}>
          DESIGN
        </motion.div>
      </div>
    </>
  )
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
export default function LoginPage() {
  const C = useTheme()
  const [loading, setLoading]   = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => { setIsLoaded(true) }, [])

  const mockSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
  }

  const HERO = "ACCESS".split("")

  const labelStyle: React.CSSProperties = {
    fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.28em",
    textTransform:"uppercase", color:C.inkMuted, display:"block", marginBottom:10,
  }

  const submitBtnStyle: React.CSSProperties = {
    marginTop:4, display:"inline-flex", alignItems:"center", justifyContent:"center", gap:14,
    border:`1.5px solid ${C.orange}`, backgroundColor:C.orange, color:"#fff",
    fontFamily:"'DM Mono',monospace", fontSize:9, letterSpacing:"0.3em",
    textTransform:"uppercase", padding:"16px 32px", cursor:"pointer", transition:"all 0.28s",
  }

  return (
    <div style={{
      background: C.bg, minHeight:"100vh", color:C.ink,
      fontFamily:"'DM Mono',monospace", transition:"background 0.5s, color 0.5s",
      display:"flex", alignItems:"center", justifyContent:"center",
      overflow:"hidden", position:"relative",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@300;400;500&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0 }
        ::selection { background:#FF5C1A; color:#fff }
        ::-webkit-scrollbar { width:2px }
        ::-webkit-scrollbar-thumb { background:#FF5C1A }
        body { cursor:auto }
        @media (hover:hover) and (pointer:fine) { body { cursor:none !important } }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        .blink { animation:blink 1.1s step-end infinite }

        .login-input {
          width:100%; background:transparent; border:none;
          border-bottom:1px solid ${C.border};
          padding:12px 0; color:${C.ink};
          font-family:'DM Sans',sans-serif; font-size:15px; font-weight:300;
          outline:none; transition:border-color 0.25s;
        }
        .login-input:focus { border-bottom-color:${C.orange}; }
        .login-input::placeholder { color:${C.inkMuted}; font-size:13px; }

        .tab-trigger {
          font-family:'DM Mono',monospace; font-size:9px; letter-spacing:0.28em;
          text-transform:uppercase; padding:12px 16px; cursor:pointer;
          transition:all 0.25s; border:1px solid transparent;
          background:transparent; color:${C.inkMuted}; flex:1;
        }
        .tab-trigger[data-state="active"] {
          color:${C.orange}; border-color:${C.border}; background:${C.surface};
        }
        .tab-trigger:hover:not([data-state="active"]) { color:${C.inkSub}; }
      `}</style>

      {/* Grain */}
      <svg style={{ position:"fixed", inset:0, zIndex:9989, opacity:0.028, pointerEvents:"none", width:"100%", height:"100%" }}>
        <filter id="gn">
          <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves={4} stitchTiles="stitch"/>
          <feColorMatrix type="saturate" values="0"/>
        </filter>
        <rect width="100%" height="100%" filter="url(#gn)"/>
      </svg>

      {/* ── VERTICAL DECOR ── */}
      <VerticalDecor C={C} />

      {/* ── TOP ACCENT LINE ── */}
      <motion.div
        initial={{ scaleX:0 }} animate={{ scaleX:1 }}
        transition={{ duration:1.4, delay:0.1, ease:E }}
        style={{ position:"fixed", top:0, left:0, right:0, height:2, background:C.orange, transformOrigin:"left", zIndex:1000, boxShadow:`0 0 20px ${C.orange}77` }}
      />

      {/* ── CARD ── */}
      <motion.div
        initial={{ opacity:0, y:24 }}
        animate={isLoaded ? { opacity:1, y:0 } : {}}
        transition={{ duration:0.85, ease:E }}
        style={{ width:"100%", maxWidth:"440px", padding:"20px", zIndex:10 }}
      >

        {/* HEADER */}
        <div style={{ marginBottom:44, textAlign:"center" }}>
          <motion.div
            initial={{ scaleX:0 }} animate={{ scaleX:1 }}
            transition={{ delay:0.5, duration:0.8, ease:E }}
            style={{ width:32, height:2, background:C.orange, margin:"0 auto 20px" }}
          />

          <div style={{ overflow:"hidden", display:"flex", justifyContent:"center", lineHeight:0.86 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:64, lineHeight:0.86, display:"flex" }}>
              {isLoaded && HERO.map((ch, i) => (
                <motion.span key={i}
                  initial={{ y:"105%" }} animate={{ y:0 }}
                  transition={{ duration:0.75, delay:0.3+i*0.06, ease:E }}
                  style={{ display:"inline-block", fontFamily:"'Bebas Neue',sans-serif" }}>
                  {ch}
                </motion.span>
              ))}
            </div>
          </div>

          <div style={{ overflow:"hidden" }}>
            <motion.div
              initial={{ y:"100%" }} animate={isLoaded ? { y:0 } : {}}
              transition={{ delay:0.85, duration:0.75, ease:E }}
              style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:28, lineHeight:0.9, color:"transparent", WebkitTextStroke:`1px ${C.inkMuted}` }}>
              PORTAL
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity:0 }} animate={isLoaded ? { opacity:1 } : {}}
            transition={{ delay:1.3, duration:0.6 }}
            style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:C.inkMuted, marginTop:14, letterSpacing:"0.3em", textTransform:"uppercase" }}>
            Waterschoot — Design 25/26
          </motion.p>

          <motion.div
            initial={{ opacity:0 }} animate={isLoaded ? { opacity:1 } : {}}
            transition={{ delay:1.5, duration:0.6 }}
            style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:10 }}>
            <span className="blink" style={{ width:6, height:6, borderRadius:"50%", background:C.orange, display:"inline-block", boxShadow:`0 0 8px ${C.orange}` }}/>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, letterSpacing:"0.22em", textTransform:"uppercase", color:C.orange }}>
              Secure Access
            </span>
          </motion.div>
        </div>

        {/* TABS */}
        <motion.div
          initial={{ opacity:0, y:16 }} animate={isLoaded ? { opacity:1, y:0 } : {}}
          transition={{ delay:0.6, duration:0.7, ease:E }}>

          <Tabs defaultValue="login" style={{ width:"100%" }}>
            <TabsList style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:4, background:"none", marginBottom:20, padding:0 }}>
              <TabsTrigger value="login" className="tab-trigger">Login</TabsTrigger>
              <TabsTrigger value="join"  className="tab-trigger">Register</TabsTrigger>
            </TabsList>

            <div style={{
              background: C.surface,
              border:`1px solid ${C.border}`,
              padding:"36px 32px", position:"relative",
            }}>
              <div style={{ position:"absolute", top:0,  right:0, width:20, height:20, borderTop:`2px solid ${C.orange}`, borderRight:`2px solid ${C.orange}` }}/>
              <div style={{ position:"absolute", bottom:0, left:0,  width:20, height:20, borderBottom:`2px solid ${C.orange}`, borderLeft:`2px solid ${C.orange}` }}/>

              <AnimatePresence mode="wait">

                {/* LOGIN */}
                <TabsContent key="login" value="login" style={{ outline:"none" }}>
                  <motion.form key="login-form" onSubmit={mockSubmit}
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:12 }}
                    transition={{ duration:0.35, ease:E }}
                    style={{ display:"flex", flexDirection:"column", gap:28 }}>

                    <div>
                      <label style={labelStyle}>E-mailadres</label>
                      <input type="email" className="login-input" placeholder="je@email.be" required />
                    </div>
                    <div>
                      <label style={labelStyle}>Wachtwoord</label>
                      <PasswordInput C={C} placeholder="••••••••" required />
                    </div>

                    <motion.button type="submit" disabled={loading}
                      whileHover={{ boxShadow:`0 0 28px ${C.orange}99, 0 0 8px ${C.orange}55`, scale:1.02 }}
                      whileTap={{ scale:0.97 }} style={submitBtnStyle}>
                      {loading ? (
                        <motion.span animate={{ rotate:360 }} transition={{ duration:0.9, repeat:Infinity, ease:"linear" }}
                          style={{ display:"inline-block", width:14, height:14, borderRadius:"50%", border:"2px solid #fff", borderTopColor:"transparent" }}/>
                      ) : (
                        <>Enter Portal <motion.span animate={{ x:[0,5,0] }} transition={{ duration:1.6, repeat:Infinity }}>→</motion.span></>
                      )}
                    </motion.button>
                  </motion.form>
                </TabsContent>

                {/* REGISTER */}
                <TabsContent key="join" value="join" style={{ outline:"none" }}>
                  <motion.form key="join-form" onSubmit={mockSubmit}
                    initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-12 }}
                    transition={{ duration:0.35, ease:E }}
                    style={{ display:"flex", flexDirection:"column", gap:28 }}>

                    <div>
                      <label style={labelStyle}>E-mailadres</label>
                      <input type="email" className="login-input" placeholder="je@email.be" required />
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                      <div>
                        <label style={labelStyle}>Wachtwoord</label>
                        <PasswordInput C={C} placeholder="••••••••" required />
                      </div>
                      <div>
                        <label style={labelStyle}>Bevestig</label>
                        <PasswordInput C={C} placeholder="••••••••" required />
                      </div>
                    </div>

                    <motion.button type="submit" disabled={loading}
                      whileHover={{ boxShadow:`0 0 28px ${C.orange}99, 0 0 8px ${C.orange}55`, scale:1.02 }}
                      whileTap={{ scale:0.97 }} style={submitBtnStyle}>
                      {loading ? (
                        <motion.span animate={{ rotate:360 }} transition={{ duration:0.9, repeat:Infinity, ease:"linear" }}
                          style={{ display:"inline-block", width:14, height:14, borderRadius:"50%", border:"2px solid #fff", borderTopColor:"transparent" }}/>
                      ) : (
                        <>Create Identity <motion.span animate={{ x:[0,5,0] }} transition={{ duration:1.6, repeat:Infinity }}>→</motion.span></>
                      )}
                    </motion.button>
                  </motion.form>
                </TabsContent>

              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity:0 }} animate={isLoaded ? { opacity:1 } : {}}
          transition={{ delay:1.6, duration:0.6 }}
          style={{ marginTop:28, textAlign:"center" }}>
          <a href="#" style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:C.inkMuted, letterSpacing:"0.2em", textTransform:"uppercase", borderBottom:`1px solid ${C.border}`, paddingBottom:2 }}>
            Wachtwoord vergeten?
          </a>
        </motion.div>

      </motion.div>
    </div>
  )
}