import { ledger, timeline } from '../data.js'

/**
 * Ledger — gold stat blocks + a stamped career timeline.
 *
 * NEXT (README → Roadmap, phase "Ledger"): count the numbers up on scroll-in
 * and slam each timeline stamp down with a slight rotation + audio tick. This
 * static version renders the final numbers, notes, and timeline copy.
 */
export default function Ledger() {
  return (
    <section className="ledger" id="ledger">
      <p className="ledger__kicker">THE BOUNTY LEDGER</p>

      <div className="ledger__grid">
        {ledger.map((stat) => (
          <div className="stat" key={stat.label} data-cursor="">
            <div className="stat__value">
              {stat.value}
              <span className="stat__suffix">{stat.suffix}</span>
            </div>
            <div className="stat__label">{stat.label}</div>
            <div className="stat__note">{stat.note}</div>
          </div>
        ))}
      </div>

      <ol className="timeline">
        {timeline.map((stop) => (
          <li className="timeline__stop" key={stop.year}>
            <span className="timeline__year">{stop.year}</span>
            <span className="timeline__place">{stop.place}</span>
            <span className="timeline__stamp">{stop.stamp}</span>
            <span className="timeline__note">{stop.note}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
