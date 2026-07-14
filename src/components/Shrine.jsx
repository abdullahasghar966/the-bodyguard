import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { relics } from '../data.js'
import { whistle, slam, crowd, pop } from '../audio.js'

/**
 * Shrine — the floating relic field + the TECH FOUL easter egg.
 *
 * Desktop (fine pointer + motion OK) gets the full toy: each relic is an SVG
 * cut-out that bobs, is draggable, and pops a colored blob + stat chip on hover.
 * The TECH FOUL button runs the ejection sequence — whistle, field shake, every
 * relic flung off-screen, a "SHE'D DO IT AGAIN." stamp, and a PLAY ON reset.
 * Touch / reduced-motion get a clean static field and a motion-free version of
 * the ejection (fade out → stamp).
 *
 * The drag + eject are hand-rolled on pointer events and CSS transforms rather
 * than a physics library: each relic lives inside a `.relic-anchor` (owns the
 * -50% centering) → `.relic-eject` (owns the drag + fling transform) → `.relic`
 * (owns hover). Splitting those transforms across elements keeps them from
 * clobbering each other. Framer is used only for the stamp entrance.
 */
function canEnhance() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function RelicArt({ name }) {
  const common = { viewBox: '0 0 100 100', className: 'relic__svg' }
  switch (name) {
    case 'boot': // cowboy boot
      return (
        <svg {...common}>
          <path d="M35 16h14a4 4 0 0 1 4 4l2 27c.3 4 2 6 6 7l17 5c7 2 11 6 11 13v5a3 3 0 0 1-3 3H31a5 5 0 0 1-5-5l3-55a4 4 0 0 1 4-4z" />
        </svg>
      )
    case 'mouthguard': // gum-shield arch
      return (
        <svg {...common}>
          <path d="M50 28c-21 0-34 13-34 32a7 7 0 0 0 14 0c0-12 8-18 20-18s20 6 20 18a7 7 0 0 0 14 0c0-19-13-32-34-32z" />
        </svg>
      )
    case 'mic': // podcast mic
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
          <rect x="38" y="12" width="24" height="44" rx="12" fill="currentColor" stroke="none" />
          <path d="M30 46a20 20 0 0 0 40 0" />
          <path d="M50 66v15M38 84h24" />
        </svg>
      )
    case 'jersey': // singlet with №8
      return (
        <svg {...common}>
          <path d="M35 22 18 32l7 15 8-4v37h34V43l8 4 7-15-17-10c-3 7-9 9-14 9s-11-2-14-9z" />
          <text x="50" y="72" textAnchor="middle" fontFamily="Anton, sans-serif" fontSize="34" fill="var(--blob)">8</text>
        </svg>
      )
    case 'ball': // basketball
      return (
        <svg {...common}>
          <circle cx="50" cy="50" r="34" fill="currentColor" />
          <g fill="none" stroke="var(--ink)" strokeWidth="4">
            <path d="M50 16v68M16 50h68M27 27q23 23 0 46M73 27q-23 23 0 46" />
          </g>
        </svg>
      )
    case 'chain': // interlocking links
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round">
          <ellipse cx="37" cy="50" rx="20" ry="13" />
          <ellipse cx="63" cy="50" rx="20" ry="13" />
        </svg>
      )
    default:
      return null
  }
}

/* Where each relic flies when the whistle blows — out toward its own side and
 * up off the top edge, spinning. */
function ejectTarget(relic, index) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 800
  const dir = relic.x < 50 ? -1 : 1
  return {
    x: dir * vw * 0.62 + (relic.x - 50) * 6,
    y: -vh * (0.72 + index * 0.05),
    rotate: (index % 2 ? 1 : -1) * (420 + index * 45),
  }
}

function Relic({ relic, index, phase, fieldRef, enhanced }) {
  const wrapRef = useRef(null) // .relic-eject — owns the drag + fling transform
  const pos = useRef({ x: 0, y: 0 }) // committed drag offset (px)
  const drag = useRef(null) // live drag session

  const applyRest = (el) => {
    el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
    el.style.opacity = '1'
  }

  // React to the whistle: fling out on eject, spring home on reset.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    if (phase === 'ejected') {
      if (enhanced) {
        const t = ejectTarget(relic, index)
        el.style.transition = 'transform 0.85s cubic-bezier(0.4,0,1,1), opacity 0.85s cubic-bezier(0.4,0,1,1)'
        el.style.transform = `translate(${t.x}px, ${t.y}px) rotate(${t.rotate}deg)`
        el.style.opacity = '0'
      } else {
        el.style.transition = 'opacity 0.5s ease'
        el.style.opacity = '0'
      }
    } else {
      el.style.transition = enhanced
        ? 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease'
        : 'opacity 0.4s ease'
      applyRest(el)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, enhanced])

  const onPointerDown = (e) => {
    if (!enhanced || phase === 'ejected') return
    const el = wrapRef.current
    el.style.transition = 'none'
    drag.current = { px: e.clientX, py: e.clientY, baseX: pos.current.x, baseY: pos.current.y }
    el.setPointerCapture?.(e.pointerId)
  }

  const onPointerMove = (e) => {
    if (!drag.current) return
    const field = fieldRef.current?.getBoundingClientRect()
    let nx = drag.current.baseX + (e.clientX - drag.current.px)
    let ny = drag.current.baseY + (e.clientY - drag.current.py)
    // Keep the disc inside the dashed field.
    if (field) {
      const homeX = field.left + (field.width * relic.x) / 100
      const homeY = field.top + (field.height * relic.y) / 100
      const pad = relic.w / 2
      nx = Math.max(field.left + pad - homeX, Math.min(field.right - pad - homeX, nx))
      ny = Math.max(field.top + pad - homeY, Math.min(field.bottom - pad - homeY, ny))
    }
    wrapRef.current.style.transform = `translate(${nx}px, ${ny}px)`
    drag.current.lastX = nx
    drag.current.lastY = ny
  }

  const onPointerUp = () => {
    if (!drag.current) return
    if (drag.current.lastX != null) {
      pos.current = { x: drag.current.lastX, y: drag.current.lastY }
    }
    drag.current = null
  }

  const inner = (
    <>
      <div className="relic__disc">
        <span className="relic__art" aria-hidden="true">
          <RelicArt name={relic.svg} />
        </span>
      </div>
      <div className="relic__label">{relic.label}</div>
      <div className="relic__chip">{relic.chip}</div>
    </>
  )

  return (
    <div
      className="relic-anchor"
      style={{
        left: `${relic.x}%`,
        top: `${relic.y}%`,
        '--blob': relic.blob,
        '--w': `${relic.w}px`,
      }}
    >
      <div className="relic-eject" ref={wrapRef}>
        <div
          className={`relic${enhanced ? ' relic--draggable' : ''}`}
          data-cursor={enhanced ? 'DRAG' : ''}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerEnter={enhanced ? () => pop() : undefined}
        >
          {inner}
        </div>
      </div>
    </div>
  )
}

export default function Shrine() {
  const [enhanced] = useState(canEnhance)
  const [phase, setPhase] = useState('idle') // 'idle' | 'ejected'
  const [shaking, setShaking] = useState(false)
  const fieldRef = useRef(null)

  const eject = () => {
    if (phase === 'ejected') return
    whistle()
    setPhase('ejected')
    if (enhanced) {
      setShaking(true)
      setTimeout(() => setShaking(false), 520)
    }
    setTimeout(() => slam(), 460)
  }

  const playOn = () => {
    crowd()
    setPhase('idle')
  }

  return (
    <section className="shrine" id="shrine">
      <p className="shrine__kicker">THE SHRINE — DRAG THE RELICS</p>

      <div className={`shrine__field${shaking ? ' is-shaking' : ''}`} ref={fieldRef}>
        {relics.map((relic, i) => (
          <Relic
            key={relic.id}
            relic={relic}
            index={i}
            phase={phase}
            fieldRef={fieldRef}
            enhanced={enhanced}
          />
        ))}
      </div>

      <button
        className="techfoul"
        type="button"
        data-cursor="EJECT"
        onClick={eject}
        aria-label="Call a tech foul — eject the relics"
      >
        <span className="techfoul__t">TECH</span>
        <span className="techfoul__f">FOUL</span>
        <span className="techfoul__hint">{phase === 'ejected' ? 'ejected ✦' : 'press it ↗'}</span>
      </button>

      <AnimatePresence>
        {phase === 'ejected' && (
          <motion.div
            className="shrine__stamp"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="shrine__stamp-inner">
              <motion.h3
                className="shrine__stamp-title"
                initial={enhanced ? { scale: 2.4, rotate: -14, opacity: 0 } : { opacity: 0 }}
                animate={enhanced ? { scale: 1, rotate: -6, opacity: 1 } : { opacity: 1 }}
                transition={
                  enhanced
                    ? { type: 'spring', stiffness: 260, damping: 17, delay: 0.42 }
                    : { duration: 0.3, delay: 0.2 }
                }
              >
                SHE&rsquo;D DO IT
                <br />
                AGAIN.
              </motion.h3>
              <button className="shrine__playon" type="button" onClick={playOn} data-cursor="TAP">
                PLAY ON ↻
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
