import { useState, useEffect } from 'react'
import { fits } from '../data.js'
import { pop } from '../audio.js'
import carpetImg from '../assets/sophie-carpet.webp'
import arbysImg from '../assets/sophie-arbys.jpg'
import feverImg from '../assets/sophie-fever.jpg'
import motoImg from '../assets/sophie-moto.jpg'
import brownImg from '../assets/sophie-brown.jpg'

/**
 * THE FITS — the off-court diva strip.
 *
 * A row of fashion "cards" tilted like a contact sheet. Tapping a card opens a
 * lightbox with the full, uncropped shot. Copy per card lives in data.js
 * (`fits`); `img` keys map to the imports below.
 */
const IMAGES = {
  carpet: carpetImg,
  arbys: arbysImg,
  fever: feverImg,
  moto: motoImg,
  brown: brownImg,
}

export default function Fits() {
  const [active, setActive] = useState(null)

  // Lock scroll + wire Escape while the lightbox is open.
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active])

  const open = (fit) => {
    pop()
    setActive(fit)
  }

  return (
    <section className="fits" id="fits">
      <div className="fits__head">
        <p className="fits__kicker">OFF THE CLOCK</p>
        <h2 className="fits__title">
          THE <em>fits.</em>
        </h2>
        <p className="fits__aside">Boots off. Heels on. Still №8. — tap a look.</p>
      </div>

      <div className="fits__row">
        {fits.map((fit) => (
          <figure className="fitcard" key={fit.id}>
            <button
              className="fitcard__frame"
              type="button"
              data-cursor="TAP"
              onClick={() => open(fit)}
              aria-label={`View ${fit.label}`}
            >
              <img className="fitcard__img" src={IMAGES[fit.img]} alt={fit.label} loading="lazy" />
              <span className="fitcard__view" aria-hidden="true">VIEW ↗</span>
            </button>
            <figcaption className="fitcard__cap">
              <span className="fitcard__label">{fit.label}</span>
              <span className="fitcard__chip">{fit.chip}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {active && (
        <div className="fitlens" onClick={() => setActive(null)} data-cursor="TAP">
          <figure className="fitlens__inner" onClick={(e) => e.stopPropagation()}>
            <img className="fitlens__img" src={IMAGES[active.img]} alt={active.label} />
            <figcaption className="fitlens__cap">
              <span className="fitlens__label">{active.label}</span>
              <span className="fitlens__chip">{active.chip}</span>
            </figcaption>
          </figure>
          <button
            className="fitlens__close"
            type="button"
            onClick={() => setActive(null)}
            data-cursor="TAP"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </section>
  )
}
