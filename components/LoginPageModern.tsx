"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/toast"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHoveringLink, setIsHoveringLink] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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

  return (
    <div className="relative min-h-screen w-full bg-[#0a0a0a] overflow-hidden flex flex-col justify-center items-center cursor-none">
      
      {/* CUSTOM CURSOR */}
      <div 
        className={`fixed top-0 left-0 w-8 h-8 rounded-full border border-white/50 pointer-events-none z-[100] mix-blend-difference transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${isHoveringLink ? 'scale-[2.5] bg-white/10' : 'scale-100'}`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />
      <div 
        className={`fixed top-0 left-0 w-2 h-2 bg-red-600 rounded-full pointer-events-none z-[100] transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${isHoveringLink ? 'opacity-0' : 'opacity-100'}`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />

      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-1 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-red-900/10 blur-[120px] rounded-full animate-pulse-slow"></div>

      {/* LOGIN CARD CONTAINER */}
      <main className={`relative z-10 w-full max-w-md px-6 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* HEADER AREA */}
        <div className="mb-10 flex items-center gap-4">
          <div className="w-1.5 h-12 bg-red-800 animate-pulse shadow-[0_0_15px_rgba(153,27,27,0.5)]"></div>
          <div>
            <h1 className="text-white text-4xl font-black italic uppercase tracking-tighter">
              Jarne <span className="text-transparent stroke-text">Waterschoot</span>
            </h1>
            <p className="text-red-700 font-mono text-[10px] uppercase tracking-[0.2em] mt-1">Access 2025/2026 Portal</p>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-zinc-900/40 border border-zinc-800/50 p-1 rounded-none">
            <TabsTrigger 
              value="login" 
              className="rounded-none data-[state=active]:bg-red-800 data-[state=active]:text-white text-zinc-500 font-mono text-[10px] uppercase transition-all"
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
            >
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="rounded-none data-[state=active]:bg-red-800 data-[state=active]:text-white text-zinc-500 font-mono text-[10px] uppercase transition-all"
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
            >
              Join
            </TabsTrigger>
            <TabsTrigger 
              value="forgot" 
              className="rounded-none data-[state=active]:bg-red-800 data-[state=active]:text-white text-zinc-500 font-mono text-[10px] uppercase transition-all"
              onMouseEnter={() => setIsHoveringLink(true)}
              onMouseLeave={() => setIsHoveringLink(false)}
            >
              Reset
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 bg-zinc-900/20 backdrop-blur-md border border-zinc-800/50 p-8">
            {/* LOGIN CONTENT */}
            <TabsContent value="login" className="mt-0 outline-none">
              <form onSubmit={(e) => mockSubmit(e, 'Login')} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-zinc-500 uppercase tracking-widest text-[10px]">Email Address</Label>
                  <Input 
                    type="email" 
                    required 
                    className="bg-black/40 border-zinc-800 focus:border-red-800 text-white rounded-none transition-all h-12"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label className="text-zinc-500 uppercase tracking-widest text-[10px]">Password</Label>
                  </div>
                  <Input 
                    type="password" 
                    required 
                    className="bg-black/40 border-zinc-800 focus:border-red-800 text-white rounded-none transition-all h-12"
                  />
                </div>
                <Button 
                  onMouseEnter={() => setIsHoveringLink(true)}
                  onMouseLeave={() => setIsHoveringLink(false)}
                  className="w-full bg-red-800 hover:bg-red-700 text-white font-bold uppercase tracking-widest py-6 transition-all duration-300 rounded-none relative overflow-hidden group"
                  disabled={loading}
                >
                  <span className="relative z-10">{loading ? "Wait..." : "Sign In"}</span>
                  <div className="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 opacity-10"></div>
                </Button>
              </form>
            </TabsContent>

            {/* REGISTER CONTENT */}
            <TabsContent value="register" className="mt-0 outline-none">
              <form onSubmit={(e) => mockSubmit(e, 'Register')} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-zinc-500 uppercase tracking-widest text-[10px]">Email Address</Label>
                  <Input type="email" required className="bg-black/40 border-zinc-800 focus:border-red-800 text-white rounded-none h-12" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-500 uppercase tracking-widest text-[10px]">Create Password</Label>
                  <Input type="password" required className="bg-black/40 border-zinc-800 focus:border-red-800 text-white rounded-none h-12" />
                </div>
                <Button 
                  onMouseEnter={() => setIsHoveringLink(true)}
                  onMouseLeave={() => setIsHoveringLink(false)}
                  className="w-full bg-zinc-100 hover:bg-white text-black font-bold uppercase tracking-widest py-6 transition-all duration-300 rounded-none"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>

            {/* FORGOT PASSWORD CONTENT */}
            <TabsContent value="forgot" className="mt-0 outline-none">
              <form onSubmit={(e) => mockSubmit(e, 'Reset')} className="space-y-6">
                <p className="text-zinc-400 text-xs font-light leading-relaxed">Voer je email in om een link te ontvangen voor een nieuw wachtwoord.</p>
                <div className="space-y-2">
                  <Label className="text-zinc-500 uppercase tracking-widest text-[10px]">Email Address</Label>
                  <Input type="email" required className="bg-black/40 border-zinc-800 focus:border-red-800 text-white rounded-none h-12" />
                </div>
                <Button 
                  onMouseEnter={() => setIsHoveringLink(true)}
                  onMouseLeave={() => setIsHoveringLink(false)}
                  className="w-full bg-transparent border border-red-800 text-red-600 hover:bg-red-800 hover:text-white font-bold uppercase tracking-widest py-6 transition-all duration-300 rounded-none"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Request Reset"}
                </Button>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      <style jsx>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.1; }
          50% { transform: scale(1.05); opacity: 0.15; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        :global(body) {
          cursor: none;
          background-color: #0a0a0a;
        }
      `}</style>
    </div>
  )
}
