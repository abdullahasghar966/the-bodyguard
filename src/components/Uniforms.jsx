import { useRef, useState } from 'react'
import { uniforms } from '../data.js'
import screamImg from '../assets/sophie-scream.jpg'
import carpetImg from '../assets/sophie-carpet.webp'

/**
 * TWO UNIFORMS — the enforcer↔diva reveal.
 *
 * A before/after comparison slider: the on-court game shot fills the stage; the
 * off-court gold-carpet shot is clipped to the right of a draggable handle. Drag
 * the handle to wipe between "on the clock" and "off the clock." Same №8 who
 * bodies you in the paint shows up to the party in lace — the contrast is the
 * point. Built on native pointer events (no physics lib) for the same reason the
 * Shrine drag is.
 */
const IMAGES = { scream: screamImg, carpet: carpetImg }

export default function Uniforms() {
  const [pos, setPos] = useState(52) // % from left where the wipe sits
  const stageRef = useRef(null)
  const dragging = useRef(false)

  const moveTo = (clientX) => {
    const rect = stageRef.current?.getBoundingClientRect()
    if (!rect) return
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(4, Math.min(96, pct)))
  }

  const onPointerDown = (e) => {
    dragging.current = true
    moveTo(e.clientX)
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } catch {
      /* capture is a nicety, not required for the drag to work */
    }
  }
  const onPointerMove = (e) => {
    if (dragging.current) moveTo(e.clientX)
  }
  const onPointerUp = () => {
    dragging.current = false
  }

  return (
    <section className="uniforms" id="uniforms">
      <div className="uniforms__head">
        <p className="uniforms__kicker">{uniforms.kicker}</p>
        <h2 className="uniforms__title">
          {uniforms.title}
          <em>{uniforms.sub}</em>
        </h2>
      </div>

      <div
        className="uniforms__stage"
        ref={stageRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        data-cursor="DRAG"
      >
        {/* base layer — on the clock */}
        <figure className="uniforms__layer">
          <img
            className="uniforms__img"
            src={IMAGES[uniforms.onClock.img]}
            alt="Sophie Cunningham in the game"
            style={{ objectPosition: uniforms.onClock.focus }}
          />
          <figcaption className="uniforms__badge uniforms__badge--left">
            {uniforms.onClock.label}
            <span>{uniforms.onClock.tag}</span>
          </figcaption>
        </figure>

        {/* top layer — off the clock, revealed right of the handle */}
        <figure className="uniforms__layer uniforms__layer--top" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
          <img
            className="uniforms__img"
            src={IMAGES[uniforms.offClock.img]}
            alt="Sophie Cunningham off the court"
            style={{ objectPosition: uniforms.offClock.focus }}
          />
          <figcaption className="uniforms__badge uniforms__badge--right">
            {uniforms.offClock.label}
            <span>{uniforms.offClock.tag}</span>
          </figcaption>
        </figure>

        {/* handle */}
        <div className="uniforms__handle" style={{ left: `${pos}%` }} aria-hidden="true">
          <span className="uniforms__grip">{uniforms.hint}</span>
        </div>
      </div>
    </section>
  )
}
