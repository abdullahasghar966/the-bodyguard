import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * useSmoothScroll — momentum smooth-scroll via Lenis.
 *
 * Intentional degradation:
 *  - `prefers-reduced-motion` → not initialized at all (native scroll).
 *  - `syncTouch: false` → touch devices keep native scrolling; no scroll-jacking
 *    on mobile.
 *
 * Also upgrades in-page anchor clicks (nav, scroll cue) to eased scrolls.
 */
export default function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
    })

    let rafId
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (!link) return
      const hash = link.getAttribute('href')
      if (!hash || hash.length < 2) return
      const target = document.querySelector(hash)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -64, duration: 1.1 })
    }
    document.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', onClick)
      lenis.destroy()
    }
  }, [])
}
