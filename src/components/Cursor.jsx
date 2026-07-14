import { useEffect, useRef } from 'react'

/**
 * Custom cursor: ink dot + trailing ring. Elements opt into a verb via
 * data-cursor="SMEAR|DRAG|EJECT|…" — the label prints inside the ring.
 * Fine pointers only; touch devices never see it (CSS hides it too).
 */
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    let x = -100
    let y = -100
    let rx = -100
    let ry = -100
    let raf

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      dot.style.transform = `translate(${x}px, ${y}px)`
      const zone = e.target.closest?.('[data-cursor]')
      const verb = zone?.dataset.cursor || ''
      if (label.textContent !== verb) label.textContent = verb
      ring.classList.toggle('is-verb', Boolean(verb))
    }

    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      ring.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(loop)
    }

    document.documentElement.classList.add('has-cursor')
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <span ref={labelRef} className="cursor-ring__label" />
      </div>
    </>
  )
}
