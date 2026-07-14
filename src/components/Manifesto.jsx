import { manifesto } from '../data.js'
import chipPhoto from '../assets/sophie-action.avif'

/**
 * Manifesto — ink-dark section, viewport-filling kinetic lines.
 *
 * NEXT (README → Roadmap, phase "Manifesto"): drive each line with GSAP
 * ScrollTrigger so words wipe/slide in as you scroll, and let the PHOTO chip
 * punch a masked image through the word. This static version renders the final
 * copy and layout so the type + rhythm are already locked.
 */
export default function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <p className="manifesto__kicker">THE CREED</p>

      <div className="manifesto__lines">
        {manifesto.lines.map((line, i) => (
          <p className="manifesto__line" key={i}>
            {line.parts.map((part, j) => {
              if (part.kind === 'chip') {
                return (
                  <span className="manifesto__chip" key={j}>
                    <img src={chipPhoto} alt="Sophie Cunningham on the court" loading="lazy" />
                  </span>
                )
              }
              const cls =
                part.kind === 'serif'
                  ? 'manifesto__serif'
                  : part.kind === 'display-red'
                    ? 'manifesto__word manifesto__word--red'
                    : 'manifesto__word'
              return (
                <span className={cls} key={j}>
                  {part.text}{' '}
                </span>
              )
            })}
          </p>
        ))}
      </div>

      <p className="manifesto__aside">{manifesto.aside}</p>
    </section>
  )
}
