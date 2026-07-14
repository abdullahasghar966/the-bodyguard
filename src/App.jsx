import { useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Physics2DPlugin } from 'gsap/Physics2DPlugin'
import useSmoothScroll from './hooks/useSmoothScroll.js'
import Loader from './components/Loader.jsx'
import Frame from './components/Frame.jsx'
import Grain from './components/Grain.jsx'
import Cursor from './components/Cursor.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Manifesto from './components/Manifesto.jsx'
import Ledger from './components/Ledger.jsx'
import Shrine from './components/Shrine.jsx'
import Uniforms from './components/Uniforms.jsx'
import Fits from './components/Fits.jsx'
import Footer from './components/Footer.jsx'
import { marqueeItems } from './data.js'

gsap.registerPlugin(ScrollTrigger, Physics2DPlugin)

/**
 * THE BODYGUARD — Sophie Cunningham, №8, Indiana Fever.
 *
 * A Buttermax-school single-athlete experience: one loud flat gold, giant
 * kinetic type, an ink-smear hero, draggable relics, and one red button
 * you should absolutely press.
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
        <Shrine />
        <Uniforms />
        <Fits />
        <Footer />
      </main>
    </div>
  )
}
