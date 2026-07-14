import { useEffect } from 'react'

/**
 * useInkSmear — the hero's signature interaction.
 *
 * Two stacked canvases fill the reveal container:
 *   • photo  — a duotone (ink → deep-red → gold) render of the portrait
 *   • gold   — a solid flat-gold sheet on top, seamless against the hero bg
 *
 * The cursor erases the gold sheet with a feathered brush (destination-out),
 * revealing Sophie underneath. A low-alpha gold refill runs each frame so the
 * smear slowly "heals" back to flat gold ~2.5s after the last movement — then
 * the loop parks itself until the next move. Nothing runs while idle.
 *
 * Coordinates come from a cached viewport rect (refreshed on scroll/resize) so
 * we never call getBoundingClientRect on every pointer move.
 */

const GOLD = '#ffcd00'

// Luminance → colour ramp. Shadows ink, mids deep red, highlights gold — keeps
// the reveal inside the same three-colour world as the rest of the page.
const STOPS = [
  [0.0, [11, 11, 12]],
  [0.5, [122, 16, 32]],
  [1.0, [255, 205, 0]],
]

function buildLUT() {
  const lut = new Uint8ClampedArray(256 * 3)
  for (let i = 0; i < 256; i++) {
    const t = i / 255
    let a = STOPS[0]
    let b = STOPS[STOPS.length - 1]
    for (let s = 0; s < STOPS.length - 1; s++) {
      if (t >= STOPS[s][0] && t <= STOPS[s + 1][0]) {
        a = STOPS[s]
        b = STOPS[s + 1]
        break
      }
    }
    const f = (t - a[0]) / ((b[0] - a[0]) || 1)
    lut[i * 3] = a[1][0] + (b[1][0] - a[1][0]) * f
    lut[i * 3 + 1] = a[1][1] + (b[1][1] - a[1][1]) * f
    lut[i * 3 + 2] = a[1][2] + (b[1][2] - a[1][2]) * f
  }
  return lut
}

export default function useInkSmear(containerRef, photoRef, goldRef, src, enabled) {
  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    const photo = photoRef.current
    const gold = goldRef.current
    if (!container || !photo || !gold) return

    const pctx = photo.getContext('2d', { willReadFrequently: true })
    const gctx = gold.getContext('2d')
    const lut = buildLUT()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const BRUSH = 48 // CSS px
    const HEAL_ALPHA = 0.02 // per-frame gold refill
    const HEAL_TAIL = 2600 // ms of healing after the last move

    let W = 0
    let H = 0
    let img = null
    let last = null
    let lastMove = 0
    let raf = 0
    let running = false
    let bounds = { left: 0, top: 0 }
    let resizeTimer = 0

    const setDpr = (ctx) => ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const clearDpr = (ctx) => ctx.setTransform(1, 0, 0, 1, 0, 0)

    function drawDuotone() {
      if (!img || !img.complete || !img.naturalWidth || !W || !H) return
      const scale = Math.max(W / img.width, H / img.height)
      const dw = img.width * scale
      const dh = img.height * scale
      const dx = (W - dw) * 0.5 // horizontal focus
      const dy = (H - dh) * 0.14 // vertical focus — bias toward her face

      setDpr(pctx)
      pctx.clearRect(0, 0, W, H)
      pctx.drawImage(img, dx, dy, dw, dh)
      clearDpr(pctx)

      const frame = pctx.getImageData(0, 0, photo.width, photo.height)
      const d = frame.data
      for (let p = 0; p < d.length; p += 4) {
        const luma = (d[p] * 0.299 + d[p + 1] * 0.587 + d[p + 2] * 0.114) | 0
        const o = luma * 3
        d[p] = lut[o]
        d[p + 1] = lut[o + 1]
        d[p + 2] = lut[o + 2]
      }
      pctx.putImageData(frame, 0, 0)
    }

    function fillGold() {
      setDpr(gctx)
      gctx.globalCompositeOperation = 'source-over'
      gctx.globalAlpha = 1
      gctx.fillStyle = GOLD
      gctx.fillRect(0, 0, W, H)
      clearDpr(gctx)
    }

    function updateBounds() {
      const r = gold.getBoundingClientRect()
      bounds = { left: r.left, top: r.top }
    }

    function resize() {
      const r = container.getBoundingClientRect()
      W = Math.max(1, Math.round(r.width))
      H = Math.max(1, Math.round(r.height))
      for (const cv of [photo, gold]) {
        cv.width = Math.round(W * dpr)
        cv.height = Math.round(H * dpr)
        cv.style.width = `${W}px`
        cv.style.height = `${H}px`
      }
      drawDuotone()
      fillGold()
      updateBounds()
    }

    function eraseAt(x, y, r) {
      setDpr(gctx)
      gctx.globalCompositeOperation = 'destination-out'
      const g = gctx.createRadialGradient(x, y, 0, x, y, r)
      g.addColorStop(0, 'rgba(0,0,0,1)')
      g.addColorStop(0.55, 'rgba(0,0,0,0.55)')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      gctx.fillStyle = g
      gctx.beginPath()
      gctx.arc(x, y, r, 0, Math.PI * 2)
      gctx.fill()
      clearDpr(gctx)
    }

    function smear(x, y) {
      if (last) {
        const dx = x - last.x
        const dy = y - last.y
        const dist = Math.hypot(dx, dy)
        const steps = Math.max(1, Math.floor(dist / (BRUSH * 0.32)))
        for (let s = 1; s <= steps; s++) {
          eraseAt(last.x + (dx * s) / steps, last.y + (dy * s) / steps, BRUSH)
        }
      } else {
        eraseAt(x, y, BRUSH)
      }
      last = { x, y }
      lastMove = performance.now()
      if (!running) {
        running = true
        raf = requestAnimationFrame(loop)
      }
    }

    function loop() {
      setDpr(gctx)
      gctx.globalCompositeOperation = 'source-over'
      gctx.globalAlpha = HEAL_ALPHA
      gctx.fillStyle = GOLD
      gctx.fillRect(0, 0, W, H)
      gctx.globalAlpha = 1
      clearDpr(gctx)

      if (performance.now() - lastMove > HEAL_TAIL) {
        running = false
        fillGold() // seal any remaining ghost back to flat gold
        return
      }
      raf = requestAnimationFrame(loop)
    }

    function onMove(e) {
      const x = e.clientX - bounds.left
      const y = e.clientY - bounds.top
      if (x < -80 || y < -80 || x > W + 80 || y > H + 80) {
        last = null
        return
      }
      container.classList.add('is-touched')
      smear(x, y)
    }

    function onScroll() {
      updateBounds()
    }

    function onResize() {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(resize, 150)
    }

    function onVisibility() {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(raf)
      }
    }

    img = new Image()
    img.onload = resize
    img.src = src

    // A ResizeObserver on the container is the source of truth for sizing — it
    // fires on any box change (initial layout, 0→full, font reflow, viewport
    // changes) without depending on a window 'resize' event ever firing.
    const hero = container.closest('.hero') || window
    const ro = new ResizeObserver(onResize)
    ro.observe(container)
    hero.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)

    if (img.complete) resize()

    return () => {
      ro.disconnect()
      hero.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVisibility)
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
    }
  }, [enabled, src, containerRef, photoRef, goldRef])
}
