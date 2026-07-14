import { useState } from 'react'
import useSmoothScroll from './hooks/useSmoothScroll.js'
import Loader from './components/Loader.jsx'
import Frame from './components/Frame.jsx'
import Grain from './components/Grain.jsx'
import Cursor from './components/Cursor.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Manifesto from './components/Manifesto.jsx'
import Ledger from './components/Ledger.jsx'
import Uniforms from './components/Uniforms.jsx'
import Fits from './components/Fits.jsx'
import Footer from './components/Footer.jsx'
import { marqueeItems } from './data.js'

/**
 * THE BODYGUARD — Sophie Cunningham, №8, Indiana Fever.
 *
 * A Buttermax-school single-athlete experience: one loud flat gold, giant
 * kinetic type, an ink-smear hero, an enforcer↔diva reveal, and an off-court
 * diva strip. Fronted by a "NOW ENTERING" tip-off loader.
 */
export default function App() {
  const [loaded, setLoaded] = useState(false)
  useSmoothScroll()

  return (
    <div className="bg" id="top">
      {!loaded && <Loader onDone={() => setLoaded(true)} />}
      <Grain />
      <Cursor />
      <Frame />

      <main>
        <Hero />
        <Marquee items={marqueeItems} theme="ink" />
        <Manifesto />
        <Ledger />
        <Marquee items={marqueeItems} theme="ink" reverse />
        <Uniforms />
        <Fits />
        <Footer />
      </main>
    </div>
  )
}
