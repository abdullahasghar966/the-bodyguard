import { useEffect, useRef, useState } from 'react'
import { whistle } from '../audio.js'
import scream from '../assets/sophie-scream.jpg'
import carpet from '../assets/sophie-carpet.webp'
import wave from '../assets/sophie-wave.webp'
import action from '../assets/sophie-action.avif'
import arbys from '../assets/sophie-arbys.jpg'
import fever from '../assets/sophie-fever.jpg'
import moto from '../assets/sophie-moto.jpg'
import brown from '../assets/sophie-brown.jpg'

/**
 * Loader — the tip-off. A full-screen gold pre-roll that plays first: the
 * count climbs while the heavy imagery preloads, a status line ticks through
 * the pre-game checklist, then the whistle blows and the whole panel lifts off
 * the top to reveal the site underneath.
 *
 * It sits at z-index 80 — over the frame + grain, under the custom cursor (90),
 * so the cursor keeps floating on top. Scroll is locked while it's up.
 * Reduced-motion gets a short, still version.
 */
const ASSETS = [scream, carpet, wave, action, arbys, fever, moto, brown]

const STATUS = [
  [0, 'LACING THE BOOTS'],
  [30, 'MOUTHGUARD IN'],
  [60, 'CHALK ON THE HANDS'],
  [85, 'CUEING THE WHISTLE'],
  [100, 'TIP-OFF'],
]
function statusFor(p) {
  let label = STATUS[0][1]
  for (const [threshold, text] of STATUS) if (p >= threshold) label = text
  return label
}

function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const loaded = useRef(0)
  const finished = useRef(false)

  useEffect(() => {
    const reduced = prefersReduced()
    document.body.style.overflow = 'hidden'

    // Kick off real image preloads; every settle (ok or error) bumps the count.
    ASSETS.forEach((src) => {
      const im = new Image()
      const bump = () => {
        loaded.current += 1
      }
      im.onload = bump
      im.onerror = bump
      im.src = src
    })

    const MIN = reduced ? 600 : 2600
    const start = performance.now()

    const finish = () => {
      if (finished.current) return
      finished.current = true
      window.clearInterval(id)
      setPct(100)
      setLeaving(true)
      try {
        whistle()
      } catch {
        /* audio may be blocked pre-gesture — fine */
      }
      window.setTimeout(() => {
        document.body.style.overflow = ''
        onDone()
      }, reduced ? 380 : 980)
    }

    // A timer, not rAF: rAF is paused while the tab/pane is hidden, which would
    // freeze the count and hang the whole loader. setInterval keeps advancing.
    const id = window.setInterval(() => {
      const elapsed = performance.now() - start
      const t = Math.min(elapsed / MIN, 1)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      let value = Math.round(eased * 100)
      const ready = loaded.current >= ASSETS.length
      if (value >= 100 && !ready) value = 99 // hold at 99 until images are in
      setPct(value)
      if ((value >= 100 && ready) || elapsed > 6500) finish()
    }, 30)

    return () => {
      window.clearInterval(id)
      document.body.style.overflow = ''
    }
  }, [onDone])

  return (
    <div
      className={`loader${leaving ? ' is-leaving' : ''}`}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Loading Sophie Cunningham — The Bodyguard"
    >
      <div className="loader__panel">
        <div className="loader__badge" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <defs>
              <path id="loader-arc" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
            </defs>
            <text className="loader__badge-text">
              <textPath href="#loader-arc" startOffset="0">
                THE BODYGUARD · №8 · INDIANA FEVER · SHOW-ME STATE ·
              </textPath>
            </text>
          </svg>
          <span className="loader__badge-core">№8</span>
        </div>

        <div className="loader__inner">
          <p className="loader__kicker">NOW ENTERING</p>
          <h1 className="loader__word">
            <span className="loader__word-top">SOPHIE</span>
            <span className="loader__word-big">
              CUNNING<em>ham</em>
            </span>
          </h1>

          <div className="loader__meter" aria-hidden="true">
            <span className="loader__count">{String(pct).padStart(3, '0')}</span>
            <span className="loader__pct">%</span>
          </div>
          <div className="loader__bar">
            <span className="loader__fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="loader__status">{statusFor(pct)}</p>
        </div>
      </div>
    </div>
  )
}
