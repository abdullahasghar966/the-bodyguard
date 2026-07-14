/**
 * Synthesized sound design — no audio assets, everything is WebAudio.
 *
 * The AudioContext is created lazily on the first user-gesture-triggered
 * sound so we never hit autoplay policy. Every function is a safe no-op if
 * sound is toggled off or the context can't start.
 */

const STORAGE_KEY = 'sophie-sound'

let ctx = null
let muted = false
try {
  muted = localStorage.getItem(STORAGE_KEY) === 'off'
} catch {
  /* private mode — default to sound on */
}

export function soundEnabled() {
  return !muted
}

export function setSoundEnabled(on) {
  muted = !on
  try {
    localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off')
  } catch {
    /* ignore */
  }
}

function ac() {
  if (muted) return null
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function noiseBuffer(c, seconds = 1) {
  const buf = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buf
}

/** Referee pea-whistle: two beating squares + 30Hz warble + breath noise. */
export function whistle(duration = 0.75) {
  const c = ac()
  if (!c) return
  const t = c.currentTime
  const out = c.createGain()
  out.gain.setValueAtTime(0.0001, t)
  out.gain.exponentialRampToValueAtTime(0.3, t + 0.015)
  out.gain.setValueAtTime(0.3, t + duration - 0.12)
  out.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  out.connect(c.destination)

  // Warble (the "pea") — amplitude modulation around 30Hz.
  const warble = c.createGain()
  warble.gain.value = 0.6
  const lfo = c.createOscillator()
  lfo.frequency.value = 31
  const lfoGain = c.createGain()
  lfoGain.gain.value = 0.4
  lfo.connect(lfoGain)
  lfoGain.connect(warble.gain)
  warble.connect(out)

  for (const freq of [2350, 2489]) {
    const osc = c.createOscillator()
    osc.type = 'square'
    osc.frequency.value = freq
    const g = c.createGain()
    g.gain.value = 0.5
    osc.connect(g)
    g.connect(warble)
    osc.start(t)
    osc.stop(t + duration)
  }

  const noise = c.createBufferSource()
  noise.buffer = noiseBuffer(c, duration)
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 2500
  bp.Q.value = 2
  const ng = c.createGain()
  ng.gain.value = 0.12
  noise.connect(bp)
  bp.connect(ng)
  ng.connect(warble)
  noise.start(t)
  noise.stop(t + duration)

  lfo.start(t)
  lfo.stop(t + duration)
}

/** Body-hits-floor impact for the EJECTED stamp. */
export function slam() {
  const c = ac()
  if (!c) return
  const t = c.currentTime

  const osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(140, t)
  osc.frequency.exponentialRampToValueAtTime(38, t + 0.22)
  const og = c.createGain()
  og.gain.setValueAtTime(0.7, t)
  og.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
  osc.connect(og)
  og.connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.32)

  const noise = c.createBufferSource()
  noise.buffer = noiseBuffer(c, 0.2)
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 900
  const ng = c.createGain()
  ng.gain.setValueAtTime(0.35, t)
  ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
  noise.connect(lp)
  lp.connect(ng)
  ng.connect(c.destination)
  noise.start(t)
  noise.stop(t + 0.2)
}

/** Tiny tick for hovers/toggles. */
export function pop() {
  const c = ac()
  if (!c) return
  const t = c.currentTime
  const osc = c.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(620, t)
  osc.frequency.exponentialRampToValueAtTime(880, t + 0.05)
  const g = c.createGain()
  g.gain.setValueAtTime(0.12, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.08)
}

/** Short crowd swell (filtered noise) for the reset. */
export function crowd(duration = 1.4) {
  const c = ac()
  if (!c) return
  const t = c.currentTime
  const noise = c.createBufferSource()
  noise.buffer = noiseBuffer(c, duration)
  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.setValueAtTime(700, t)
  bp.frequency.linearRampToValueAtTime(1400, t + duration * 0.5)
  bp.Q.value = 0.6
  const g = c.createGain()
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.22, t + duration * 0.35)
  g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  noise.connect(bp)
  bp.connect(g)
  g.connect(c.destination)
  noise.start(t)
  noise.stop(t + duration)
}
