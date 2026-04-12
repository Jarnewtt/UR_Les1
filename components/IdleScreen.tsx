"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import * as d3 from "d3"

const IDLE_TIMEOUT = 3 * 60 * 1000

export default function IdleScreen() {
  const [isIdle, setIsIdle] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animFrameRef = useRef<number>(0)

  useEffect(() => {
    if (!isIdle || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")!
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", resize)

    const NUM = 120
    const particles = d3.range(NUM).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(200,200,200,${0.12 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,180,180,${p.opacity})`
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1
      })

      animFrameRef.current = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animFrameRef.current)
      window.removeEventListener("resize", resize)
    }
  }, [isIdle])

  const resetTimer = useCallback(() => {
    if (isIdle) setIsIdle(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT)
  }, [isIdle])

  useEffect(() => {
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "wheel", "click"]
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }))
    timerRef.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT)

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer))
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [resetTimer])

  const handleWake = () => {
    setIsIdle(false)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setIsIdle(true), IDLE_TIMEOUT)
  }

  return (
    <AnimatePresence>
      {isIdle && (
        <motion.div
          key="idle-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          onClick={handleWake}
          onKeyDown={handleWake}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden select-none"
          style={{ background: "radial-gradient(ellipse at center, #0a0a0a 0%, #000000 100%)" }}
        >
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Ambient glow rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{
                  width: `${i * 220}px`,
                  height: `${i * 220}px`,
                  borderColor: `rgba(255,255,255,${0.04 / i})`,
                }}
                animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{
                  duration: 4 + i * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.8,
                }}
              />
            ))}
          </div>

          {/* Logo */}
          <motion.div
            className="relative z-10 flex items-center justify-center"
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            {/* Outer glow */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: "180px",
                height: "180px",
                background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
                filter: "blur(20px)",
              }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Floating wrapper */}
            <motion.div
              animate={{ y: ["0px", "-18px", "0px"] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Drop shadow onder logo */}
              <motion.div
                className="absolute pointer-events-none"
                style={{
                  bottom: "-24px",
                  left: "50%",
                  translateX: "-50%",
                  width: "60px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  filter: "blur(6px)",
                }}
                animate={{ scaleX: [1, 0.65, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Logo */}
              <motion.img
                src="/img/logo.png"
                alt="Jarne Waterschoot logo"
                animate={{
                  filter: [
                    "brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.3))",
                    "brightness(0) invert(1) drop-shadow(0 0 24px rgba(255,255,255,0.75))",
                    "brightness(0) invert(1) drop-shadow(0 0 10px rgba(255,255,255,0.3))",
                  ],
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}