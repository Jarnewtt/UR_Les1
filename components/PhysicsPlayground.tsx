"use client"

import { useEffect, useRef, useState } from "react"

type Theme = { bg: string; surface: string; blue: string; border: string; isLight: boolean }

const PILLS = [
  { label: "Branding",           filled: true  },
  { label: "Verpakking",         filled: false },
  { label: "Fotografie",         filled: true  },
  { label: "UI / UX",            filled: false },
  { label: "Motion",             filled: true  },
  { label: "Art Direction",      filled: false },
  { label: "Visuele Identiteit", filled: true  },
  { label: "Digitaal Design",    filled: false },
  { label: "Typografie",         filled: true  },
  { label: "Illustratie",        filled: false },
  { label: "Print Design",       filled: true  },
  { label: "Logo Design",        filled: false },
  { label: "Animatie",           filled: true  },
  { label: "Campagne",           filled: false },
  { label: "Brand Identity",     filled: true  },
  { label: "Social Media",       filled: false },
  { label: "Layoutontwerp",      filled: true  },
  { label: "Kleurtheorie",       filled: false },
]

// On mobile only show a curated subset — less clutter, faster to settle
const PILLS_MOBILE = [
  { label: "Branding",       filled: true  },
  { label: "UI / UX",        filled: false },
  { label: "Motion",         filled: true  },
  { label: "Fotografie",     filled: false },
  { label: "Verpakking",     filled: true  },
  { label: "Typografie",     filled: false },
  { label: "Logo Design",    filled: true  },
  { label: "Animatie",       filled: false },
  { label: "Brand Identity", filled: true  },
  { label: "Campagne",       filled: false },
]

const CANVAS_H  = 480
const WALL      = 80
const MAX_SPEED = 28

export default function PhysicsPlayground({ theme }: { theme: Theme }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const themeRef  = useRef(theme)
  const [restartKey, setRestartKey] = useState(0)
  const [showHint,   setShowHint]   = useState(true)

  useEffect(() => { themeRef.current = theme }, [theme])

  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    let debounce: ReturnType<typeof setTimeout>
    let prevW = wrap.clientWidth
    const ro = new ResizeObserver(() => {
      clearTimeout(debounce)
      debounce = setTimeout(() => {
        if (Math.abs(wrap.clientWidth - prevW) > 40) {
          prevW = wrap.clientWidth
          setRestartKey(k => k + 1)
        }
      }, 350)
    })
    ro.observe(wrap)
    return () => { ro.disconnect(); clearTimeout(debounce) }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap   = wrapRef.current
    if (!canvas || !wrap) return

    let alive   = true
    let cleanFn = () => {}

    const W   = wrap.offsetWidth || 800
    const H   = CANVAS_H
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width  = W * dpr
    canvas.height = H * dpr

    const ctx = canvas.getContext("2d")!
    ctx.scale(dpr, dpr)

    const isMobile  = W < 600
    const PH        = isMobile ? 42 : 52
    const charW     = isMobile ? 7.4 : 8.6
    const fontSize  = isMobile ? 11 : 12
    const pillsToUse = isMobile ? PILLS_MOBILE : PILLS

    import("matter-js").then((Matter) => {
      if (!alive) return

      const engine = Matter.Engine.create({
        gravity: { y: 2.0 },
        positionIterations: 16,  // more passes → less overlap between stacked bodies
        velocityIterations: 12,
        enableSleeping: true,    // settled bodies go quasi-static → no more meshing
      })
      const world = engine.world

      // ── 4 flush walls ─────────────────────────────────────────────────────
      const wo = { isStatic: true, label: "__wall", friction: 0.5, restitution: 0.35 }
      Matter.Composite.add(world, [
        Matter.Bodies.rectangle(W / 2,        H + WALL / 2,  W + WALL * 2, WALL,         wo), // floor
        Matter.Bodies.rectangle(W / 2,        -WALL / 2,     W + WALL * 2, WALL,         wo), // ceiling
        Matter.Bodies.rectangle(-WALL / 2,    H / 2,         WALL,         H + WALL * 2, wo), // left
        Matter.Bodies.rectangle(W + WALL / 2, H / 2,         WALL,         H + WALL * 2, wo), // right
      ])

      // ── Per-tick corrections ───────────────────────────────────────────────
      const afterUpdate = () => {
        for (const b of Matter.Composite.allBodies(world)) {
          if (b.isStatic) continue

          // 1. Speed cap — prevents tunnelling through walls
          const speed = Math.sqrt(b.velocity.x ** 2 + b.velocity.y ** 2)
          if (speed > MAX_SPEED) {
            const s = MAX_SPEED / speed
            Matter.Body.setVelocity(b, { x: b.velocity.x * s, y: b.velocity.y * s })
          }

          // 2. Position safety net — hard-push if a body clips outside canvas
          const bnd = b.bounds
          const hw  = b.position.x - bnd.min.x
          const hh  = b.position.y - bnd.min.y
          let nx = b.position.x
          let ny = b.position.y
          if (bnd.min.x < 1)     nx = 1 + hw
          if (bnd.max.x > W - 1) nx = W - 1 - (bnd.max.x - b.position.x)
          if (bnd.min.y < 1)     ny = 1 + hh
          if (bnd.max.y > H - 1) ny = H - 1 - (bnd.max.y - b.position.y)
          if (nx !== b.position.x || ny !== b.position.y) {
            Matter.Body.setPosition(b, { x: nx, y: ny })
            Matter.Body.setVelocity(b, { x: b.velocity.x * -0.4, y: b.velocity.y * -0.4 })
          }

          // 3. Flatten on settle — skip sleeping bodies (already stable).
          //    Only correct angle when truly slow so it never fights the solver.
          const sleeping = (b as any).isSleeping
          if (!sleeping && speed < 0.8 && Math.abs(b.angularVelocity) < 0.04) {
            const nearestFlat = Math.round(b.angle / Math.PI) * Math.PI
            const diff        = nearestFlat - b.angle
            if (Math.abs(diff) < 0.025) {
              Matter.Body.setAngle(b, nearestFlat)
              Matter.Body.setAngularVelocity(b, 0)
            } else {
              Matter.Body.setAngularVelocity(b, b.angularVelocity + diff * 0.12)
            }
          }
        }
      }
      Matter.Events.on(engine, "afterUpdate", afterUpdate)

      // ── Staggered drop ────────────────────────────────────────────────────
      const timers = pillsToUse.map((p, i) =>
        setTimeout(() => {
          if (!alive) return
          const tw   = p.label.length * charW + 44
          const body = Matter.Bodies.rectangle(
            WALL + 20 + Math.random() * Math.max(W - WALL * 2 - 40, 10),
            -(PH / 2) - 8,
            tw, PH,
            {
              chamfer:        { radius: PH / 2 },
              restitution:    0.25,   // moderate bounce — fun but won't clip through neighbours
              friction:       0.55,   // high surface friction → grips when stacking
              frictionStatic: 0.6,    // extra grip once at rest → stable towers
              frictionAir:    0.015,  // light air drag — natural spin while airborne
              sleepThreshold: 30,     // go to sleep quickly once settled
              label:          p.label,
            }
          )
          ;(body as any)._filled = p.filled
          Matter.Composite.add(world, body)
        }, i * 160)
      )

      // ── Mouse / touch ─────────────────────────────────────────────────────
      const mouse = Matter.Mouse.create(canvas)
      mouse.pixelRatio = dpr
      const mc = Matter.MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.18, damping: 0.1, render: { visible: false } },
      })
      Matter.Composite.add(world, mc)

      // Remove Matter.js default touch listeners (they always call preventDefault)
      const m = mouse as any
      canvas.removeEventListener("touchstart", m.mousedown)
      canvas.removeEventListener("touchmove",  m.mousemove)
      canvas.removeEventListener("touchend",   m.mouseup)

      // ── Smart touch: only engage Matter.js when finger lands on a pill.
      //    If finger is on empty canvas → do nothing → browser scrolls freely.
      let touchHitPill = false

      const onTouchStart = (e: TouchEvent) => {
        const t    = e.touches[0]
        const rect = canvas.getBoundingClientRect()
        const pt   = { x: t.clientX - rect.left, y: t.clientY - rect.top }
        const hit  = Matter.Query.point(
          Matter.Composite.allBodies(world).filter(b => !b.isStatic), pt
        )
        touchHitPill = hit.length > 0
        if (!touchHitPill) return          // ← empty space: let browser handle scroll
        e.preventDefault()
        setShowHint(false)
        m.mousedown(e)
      }

      const onTouchMove = (e: TouchEvent) => {
        if (!touchHitPill) return          // ← not dragging a pill: let browser scroll
        e.preventDefault()
        m.mousemove(e)
      }

      const onTouchEnd = (e: TouchEvent) => {
        if (touchHitPill) m.mouseup(e)
        touchHitPill = false
      }

      canvas.addEventListener("touchstart", onTouchStart, { passive: false })
      canvas.addEventListener("touchmove",  onTouchMove,  { passive: false })
      canvas.addEventListener("touchend",   onTouchEnd,   { passive: true  })

      // Click on empty space → scatter nearby pills
      let dragActive = false
      Matter.Events.on(mc, "startdrag", () => { dragActive = true  })
      Matter.Events.on(mc, "enddrag",   () => { dragActive = false })

      const onPointerUp = (e: PointerEvent) => {
        if (e.pointerType === "touch" || dragActive) return
        setShowHint(false)
        const rect = canvas.getBoundingClientRect()
        const px   = e.clientX - rect.left
        const py   = e.clientY - rect.top
        for (const b of Matter.Composite.allBodies(world)) {
          if (b.isStatic) continue
          const dx   = b.position.x - px
          const dy   = b.position.y - py
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 300) {
            const f  = 0.06 * (1 - dist / 300)
            const nx = dist > 1 ? dx / dist : (Math.random() - 0.5)
            const ny = dist > 1 ? dy / dist : (Math.random() - 0.5)
            Matter.Body.applyForce(b, b.position, { x: nx * f, y: ny * f - 0.03 })
          }
        }
      }
      canvas.addEventListener("pointerup", onPointerUp)

      const runner = Matter.Runner.create()
      Matter.Runner.run(runner, engine)

      // ── Draw loop ─────────────────────────────────────────────────────────
      let raf: number
      const draw = () => {
        const C = themeRef.current
        ctx.clearRect(0, 0, W, H)

        for (const b of Matter.Composite.allBodies(world)) {
          if (b.label === "__wall") continue
          const verts  = b.vertices
          const filled = (b as any)._filled as boolean

          ctx.beginPath()
          ctx.moveTo(verts[0].x, verts[0].y)
          for (let k = 1; k < verts.length; k++) ctx.lineTo(verts[k].x, verts[k].y)
          ctx.closePath()

          if (filled) {
            ctx.fillStyle = C.blue
            ctx.fill()
          } else {
            ctx.fillStyle   = C.isLight ? "#FFFFFF" : "#181818"
            ctx.fill()
            ctx.strokeStyle = C.blue
            ctx.lineWidth   = 2
            ctx.stroke()
          }

          ctx.save()
          ctx.translate(b.position.x, b.position.y)
          ctx.rotate(b.angle)
          ctx.fillStyle    = filled ? "#FFFFFF" : C.blue
          ctx.font         = `600 ${fontSize}px Inter, system-ui, sans-serif`
          ctx.textAlign    = "center"
          ctx.textBaseline = "middle"
          ctx.fillText(b.label, 0, 0)
          ctx.restore()
        }

        raf = requestAnimationFrame(draw)
      }
      draw()

      cleanFn = () => {
        timers.forEach(clearTimeout)
        cancelAnimationFrame(raf)
        Matter.Runner.stop(runner)
        Matter.Events.off(engine, "afterUpdate", afterUpdate)
        Matter.Engine.clear(engine)
        canvas.removeEventListener("touchstart", onTouchStart)
        canvas.removeEventListener("touchmove",  onTouchMove)
        canvas.removeEventListener("touchend",   onTouchEnd)
        canvas.removeEventListener("pointerup",  onPointerUp)
      }
    })

    return () => {
      alive = false
      cleanFn()
    }
  }, [restartKey])

  return (
    <div
      ref={wrapRef}
      onPointerDown={() => setShowHint(false)}
      style={{ width: "100%", height: CANVAS_H, position: "relative", cursor: "grab", overflow: "hidden" }}
    >
      <canvas
        ref={canvasRef}
        // pan-y: vertical scroll is the browser's default.
        // Our non-passive handlers call preventDefault() only when dragging a pill.
        style={{ display: "block", width: "100%", height: "100%", touchAction: "pan-y", userSelect: "none" }}
      />

      {/* Fade-out hint */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
        pointerEvents: "none",
        opacity: showHint ? 1 : 0, transition: "opacity 0.8s ease",
      }}>
        <div style={{
          fontFamily: "Inter, sans-serif", fontSize: 16,
          letterSpacing: "0.32em", textTransform: "uppercase",
          color: theme.isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)",
        }}>
          Sleep &amp; gooi de vormen
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["←", "↑", "→"].map((a, i) => (
            <span key={i} style={{ fontSize: 16, color: "#1A1AFF", opacity: 0.7 }}>{a}</span>
          ))}
        </div>
      </div>
    </div>
  )
}


