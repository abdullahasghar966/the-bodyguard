import { socials } from '../data.js'

/**
 * Footer — dark "GET BEHIND HER." closer with socials hanging on strings.
 *
 * NEXT (README → Roadmap, phase "Footer + polish"): swing each hanging social
 * on a pendulum (framer-motion) and nudge on hover. Static version sets the
 * layout, drop lengths, and copy.
 */
export default function Footer() {
  return (
    <footer className="reach" id="reach">
      <h2 className="reach__headline">
        GET
        <br />
        BEHIND
        <br />
        <em>her.</em>
      </h2>

      <div className="reach__strings">
        {socials.map((s) => (
          <a
            className="reach__string"
            key={s.platform}
            href={s.href}
            target="_blank"
            rel="noreferrer noopener"
            style={{ '--drop': `${s.drop}px` }}
            data-cursor="TAP"
          >
            <span className="reach__pill">
              <span className="reach__platform">{s.platform}</span>
              <span className="reach__handle">{s.handle}</span>
            </span>
          </a>
        ))}
      </div>

      <p className="reach__fine">
        THE BODYGUARD · A FAN-BUILT TRIBUTE · NOT AFFILIATED WITH THE WNBA OR THE
        INDIANA FEVER
      </p>
    </footer>
  )
}
