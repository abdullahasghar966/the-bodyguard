# THE BODYGUARD — Sophie Cunningham

**🔗 Live site:** [08-sophie-cunningham.vercel.app](https://08-sophie-cunningham.vercel.app)

An interactive, single-player tribute site for **Sophie Cunningham** (№8, Indiana Fever), built in the "award-site" style: one loud flat color, giant kinetic typography, an ink-smear hero you paint away with the cursor, a drag-to-compare "two uniforms" reveal, and synthesized sound.

It is a standalone Vite + React project, kept separate from the league-wide [THE W](https://github.com/abdullahasghar966/the-w-wnba-showcase) showcase so it can have its own loud identity and its own URL.

---

## What's on the page

In scroll order:

1. **Loader: "NOW ENTERING"**. A full-screen gold tip-off. The counter climbs while the heavy images preload, a status line ticks through a pre-game checklist, then a whistle blows and the panel lifts away.
2. **Hero**. Flat Fever gold, a split `CUNNING` + *ham* wordmark (Anton + Instrument Serif italic), and a rotating badge. On desktop, the cursor erases the gold like wet paint to reveal a duotone photo underneath, which slowly heals back over. Touch and reduced-motion users get a clean static duotone portrait instead.
3. **Marquee**. Infinite strips of tags (`THE BODYGUARD · №8 · SHOW-ME STATE · …`).
4. **Manifesto: "THE CREED"**. Ink-dark section with viewport-filling kinetic lines and a photo chip set into the type.
5. **Ledger**. Gold stat blocks and a stamped career timeline: Columbia MO → Mizzou → Phoenix → Indiana.
6. **Two Uniforms**. A before/after slider. Drag the handle to wipe between the on-court enforcer and the off-court gold-carpet look.
7. **The Fits**. Off-court fashion cards tilted like a contact sheet. Tap one to open the full shot in a lightbox.
8. **Footer: "GET BEHIND HER."** Dark closer with socials hanging on strings, plus the fan-tribute disclaimer.

A custom ink cursor with verb labels, SVG film grain, Lenis momentum scrolling and a sound on/off toggle run across the whole page.

---

## Tech stack

| Concern | Choice | Why |
|---------|--------|-----|
| Build / dev | **Vite 6** + React 18 | Fast HMR, tiny config |
| Smooth scroll | **Lenis** | Momentum scroll; auto-disabled on touch and reduced-motion |
| Ink smear | **2D canvas** (`destination-out` brush) | Simpler and more reliable than a WebGL shader for a paint-reveal |
| Drag interactions | Native pointer events | The compare slider needs no physics library |
| Sound | **WebAudio**, synthesized | Whistle, slam and crowd are generated in code, so there are no audio files (`src/audio.js`) |
| Grain / cursor | Pure SVG + a `requestAnimationFrame` loop | No libraries, no assets |

**Accessibility:** `prefers-reduced-motion` gets a short, still loader, a static hero and no smooth scroll. Touch devices skip the canvas entirely.

**Deploy:** static build (`npm run build`) on Vercel.

---

## Getting started

```bash
npm install
npm run dev
```

Open the printed localhost URL. Build with `npm run build` and preview the production build with `npm run preview`.

---

## Project structure

```
├─ index.html                 # entry, Google Fonts (Anton / Instrument Serif / Martian Mono)
├─ vite.config.js
└─ src/
   ├─ main.jsx                # React root
   ├─ App.jsx                 # composes all sections
   ├─ styles.css              # design tokens + every section's styles
   ├─ data.js                 # ALL copy, stats and card content (edit here, not in components)
   ├─ audio.js                # synthesized WebAudio SFX + sound on/off state
   ├─ assets/                 # photography
   ├─ hooks/
   │  ├─ useSmoothScroll.js   # Lenis, degrades on touch / reduced-motion
   │  └─ useInkSmear.js       # the hero's canvas paint-reveal
   └─ components/
      ├─ Loader.jsx           # "NOW ENTERING" tip-off
      ├─ Frame.jsx            # fixed top bar, nav, sound toggle
      ├─ Grain.jsx            # SVG film grain
      ├─ Cursor.jsx           # custom ink cursor with verb labels
      ├─ Marquee.jsx          # infinite scrolling strip
      ├─ Hero.jsx             # wordmark + ink-smear reveal
      ├─ Manifesto.jsx        # "THE CREED" kinetic lines
      ├─ Ledger.jsx           # stats + career timeline
      ├─ Uniforms.jsx         # enforcer ↔ diva compare slider
      ├─ Fits.jsx             # fashion strip + lightbox
      └─ Footer.jsx           # "GET BEHIND HER." closer
```

### Design tokens (`src/styles.css`)

```
--gold  #FFCD00   --ink   #0B0B0C   --red  #C8102E
--navy  #041E42   --cream #F6F1E3
Anton (display) · Instrument Serif italic (accent) · Martian Mono (labels)
```

---

## Possible enhancements

- Scroll-scrub the Manifesto lines in with GSAP ScrollTrigger.
- Count the Ledger numbers up on scroll-in and slam the timeline stamps down with an audio tick.
- Swing the footer's hanging socials on a spring pendulum.

---

## Content & data notes

- **All copy and stats live in `src/data.js`.** Components only render it.
- **Stats are coarse, verifiable career facts** (draft slot, schools, numbers worn). There is no official public WNBA stats API, so they are hand-maintained on purpose.
- **Photography** belongs to its respective rights holders and is used here for a non-commercial fan tribute.

---

*A fan-built tribute. Not affiliated with the WNBA or the Indiana Fever.*
