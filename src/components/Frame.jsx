import { useState } from 'react'
import { soundEnabled, setSoundEnabled, pop } from '../audio.js'

/**
 * Fixed site frame. Text uses mix-blend-mode: difference in gold so it
 * self-inverts: near-black over the gold sections, gold over the ink ones.
 */
export default function Frame() {
  const [sound, setSound] = useState(soundEnabled())

  const toggleSound = () => {
    const next = !sound
    setSoundEnabled(next)
    setSound(next)
    if (next) pop()
  }

  return (
    <header className="frame">
      <a className="frame__brand" href="#top" aria-label="Back to top">
        SC<span className="frame__brand-num">№8</span>
      </a>

      <nav className="frame__nav" aria-label="Sections">
        <a href="#manifesto">CREED</a>
        <a href="#ledger">LEDGER</a>
        <a href="#shrine">SHRINE</a>
        <a href="#reach">REACH</a>
      </nav>

      <div className="frame__right">
        <button className="frame__sound" type="button" onClick={toggleSound}>
          SND {sound ? 'ON' : 'OFF'}
        </button>
      </div>
    </header>
  )
}
