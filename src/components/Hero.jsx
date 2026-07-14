import { useRef, useState } from 'react'
import portrait from '../assets/sophie-scream.jpg'
import useInkSmear from '../hooks/useInkSmear.js'

/**
 * Hero — flat gold, giant split wordmark (CUNNING + script "ham"), rotating
 * badge, and the ink-smear reveal.
 *
 * Desktop (fine pointer + motion OK) gets the interactive smear: move the
 * cursor to erase gold and reveal a duotone Sophie underneath. Touch and
 * reduced-motion fall back to a clean, static duotone portrait — no canvas,
 * no listeners.
 */
function canEnhance() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export default function Hero() {
  const [enhanced] = useState(canEnhance)
  const revealRef = useRef(null)
  const photoRef = useRef(null)
  const goldRef = useRef(null)

  useInkSmear(revealRef, photoRef, goldRef, portrait, enhanced)

  return (
    <section className="hero" data-cursor={enhanced ? 'SMEAR' : ''}>
      {enhanced ? (
        <div className="hero__reveal" ref={revealRef} aria-hidden="true">
          <canvas ref={photoRef} className="hero__canvas" />
          <canvas ref={goldRef} className="hero__canvas hero__canvas--gold" />
        </div>
      ) : (
        <figure className="hero__portrait hero__portrait--fallback">
          <img src={portrait} alt="Sophie Cunningham on the court" loading="eager" />
        </figure>
      )}

      <p className="sr-only">Portrait of Sophie Cunningham, №8 of the Indiana Fever.</p>

      <div className="hero__badge" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <defs>
            <path id="badge-arc" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
          </defs>
          <text className="hero__badge-text">
            <textPath href="#badge-arc" startOffset="0">
              THE BODYGUARD · №8 · INDIANA FEVER · SHOW-ME STATE ·
            </textPath>
          </text>
        </svg>
        <span className="hero__badge-core">SC</span>
      </div>

      <div className="hero__wordmark">
        <h1 className="hero__name">
          <span className="hero__name-top">SOPHIE</span>
          <span className="hero__name-big">
            CUNNING<em>ham</em>
          </span>
        </h1>
        <p className="hero__tag">
          THE BODYGUARD — <span>№8</span>, INDIANA FEVER. She doesn't guard the
          ball. She guards <em>her</em>.
        </p>
      </div>

      {enhanced && (
        <span className="hero__hint" aria-hidden="true">
          MOVE TO REVEAL HER ✦
        </span>
      )}

      <a className="hero__cue" href="#manifesto" aria-label="Scroll to the creed">
        SCROLL ↓
      </a>
    </section>
  )
}
