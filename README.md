# THE BODYGUARD — Sophie Cunningham

An interactive, single-player web experience for **Sophie Cunningham** (№8, Indiana Fever) — built in the "award-site" style of studio pieces like [buttermax.net](https://buttermax.net): one loud flat color, giant kinetic typography, an ink-smear hero, draggable physics objects, and a big red button you should absolutely press.

This is **Concept 1 of a three-concept plan** (see [The bigger plan](#the-bigger-plan)). It is a standalone Vite + React project, deliberately separated from the league-wide "THE W" showcase so it can have its own loud identity and ship on its own URL.

> **Status:** scaffolded and runnable. The structure, copy, palette, type system, and static layout of every section are in place. The Hero ink-smear, the **Shrine** (draggable relics), and the **TECH FOUL** ejection are live; the scroll-scrubbed Manifesto, the Ledger counters, and the Footer pendulum polish are still stubbed and clearly marked. See [Roadmap](#roadmap).

---

## Where this idea came from

The brief started from a screen-recording (a Reel of **buttermax.net**, the Butter studio site, captioned "POV: client paid $67,000 — Claude + Figma"). Frame-by-frame, its "crazy factor" comes down to six repeatable tricks — all of which this project adapts for Sophie:

| # | Buttermax trick | How it maps to THE BODYGUARD |
|---|-----------------|------------------------------|
| 1 | One loud flat color, no gradients | **Indiana Fever gold** (`#FFCD00`) — reads almost identical to Buttermax's yellow |
| 2 | Viewport-filling kinetic type, grotesk + script italic mid-word | `CUNNING` (Anton) + `ham` (Instrument Serif italic) — her name splits into a two-font wordmark for free |
| 3 | Ink-smear cursor that reveals imagery | Cursor erases gold paint to reveal a duotone action photo underneath |
| 4 | Floating, throwable physics objects | The **Shrine** — draggable relics (boots, mouthguard, mic, №8 jersey, tiger ball, chain) |
| 5 | Buttery scroll, pinned sections | Lenis momentum scroll + GSAP ScrollTrigger scrubbing |
| 6 | Sound + micro-details (rotating badge, marquees, dark footer) | Synth WebAudio whistle/slam/crowd, spinning badge, marquee strips, "GET BEHIND HER." footer |

---

## The concept: "THE BODYGUARD"

Sophie's public persona — the loyal enforcer, the Missouri cowboy-boots folk hero, the teammate who makes sure nobody touches the stars — drives the whole design. Fever gold makes the palette decision for us; the rest leans into *enforcer energy*.

**Sections, in scroll order:**

1. **Hero** — flat gold, `CUNNINGham` split wordmark, rotating text badge, and the portrait. The cursor smears court-paint ink across the gold to reveal a duotone photo underneath, healing slowly back.
2. **Marquee** — infinite scrolling strip of tags (`THE BODYGUARD · №8 · SHOW-ME STATE · …`).
3. **Manifesto / "THE CREED"** — ink-dark section, viewport-filling lines that scrub in on scroll: *"THE GOLD STANDARD IN SHOWING **UP** FOR YOUR TEAMMATES."* with a photo chip punching through a word.
4. **Ledger** — gold stat blocks (counters) + a stamped career timeline: Columbia MO → Mizzou → Phoenix → Indiana.
5. **Shrine** — the floating relic field. Draggable cut-out objects that bob, fling with inertia, and pop a colored blob + stat chip on hover.
6. **TECH FOUL** — the easter egg. A red button → referee whistle, screen shake, every relic + letter physically **ejected** (GSAP Physics2D scatter), then a slow type-slam: *"SHE'D DO IT AGAIN."* and a PLAY ON reset. This is the "screen-record and share" moment — the same thing that made us notice Buttermax.
7. **Footer / "REACH"** — dark closer, "GET BEHIND HER.", socials hanging on swinging strings.

---

## Tech stack

| Concern | Choice | Why |
|---------|--------|-----|
| Build / dev | **Vite 6** + React 18 | fast HMR, tiny config, already the house stack |
| Smooth scroll | **Lenis** | momentum scroll; auto-disabled on touch + reduced-motion |
| Scroll animation | **GSAP** (ScrollTrigger, Physics2D, SplitText) | all plugins are free since the Webflow acquisition; Physics2D powers the ejection |
| Drag / inertia / springs | **Framer Motion** | relic dragging, pendulum swings, spring micro-interactions |
| Ink smear | **2D canvas** (`destination-out` brush) | simpler and more reliable than a WebGL shader; matches Buttermax's actual 2D reveal |
| Sound | **WebAudio** (synthesized) | whistle/slam/pop/crowd generated in code — zero audio assets, see `src/audio.js` |
| Grain / cursor | pure SVG + a rAF loop | no libraries, no assets |

**Deploy:** static build (`npm run build`) → any static host (Vercel/Netlify/GitHub Pages).

---

## Getting started

```bash
cd "D:\Sophie Cunningham Website"
npm install
npm run dev
```

Then open the printed localhost URL. Build with `npm run build`, preview the production build with `npm run preview`.

---

## Project structure

```
Sophie Cunningham Website/
├─ index.html                 # entry, Google Fonts (Anton / Instrument Serif / Martian Mono)
├─ vite.config.js
├─ package.json
├─ README.md                  # you are here
└─ src/
   ├─ main.jsx                # React root
   ├─ App.jsx                 # composes all sections; registers GSAP plugins
   ├─ styles.css              # design tokens + every section's styles
   ├─ data.js                 # ALL content/copy/stats (edit here, not in components)
   ├─ audio.js                # synthesized WebAudio SFX + sound on/off state
   ├─ assets/
   │  └─ sophie-cunningham.jpeg
   ├─ hooks/
   │  └─ useSmoothScroll.js   # Lenis, degrades on touch / reduced-motion
   └─ components/
      ├─ Loader.jsx           # ✅ "NOW ENTERING" loading page (preload → whistle → reveal)
      ├─ Frame.jsx            # ✅ fixed top bar, nav, sound toggle
      ├─ Grain.jsx            # ✅ SVG film grain
      ├─ Cursor.jsx           # ✅ custom ink cursor w/ verb labels
      ├─ Marquee.jsx          # ✅ infinite scrolling strip
      ├─ Hero.jsx             # ✅ ink-smear reveal (sophie-scream)
      ├─ Manifesto.jsx        # ◻ static — scroll-scrub is next
      ├─ Ledger.jsx           # ◻ static — counters + stamp slam are next
      ├─ Shrine.jsx           # ✅ drag relics + TECH FOUL ejection sequence
      ├─ Uniforms.jsx         # ✅ enforcer↔diva before/after slider
      ├─ Fits.jsx             # ✅ off-court "diva" fashion strip
      └─ Footer.jsx           # ◻ static — pendulum swing polish is next
```

✅ = interactive/final · ◻ = static placeholder rendering real content, interactivity pending.

### Design tokens (`src/styles.css`)

```
--gold  #FFCD00   --ink   #0B0B0C   --red  #C8102E
--navy  #041E42   --cream #F6F1E3
Anton (display) · Instrument Serif italic (accent) · Martian Mono (labels)
```

---

## Roadmap

Build order for the interactive layer. Each phase replaces one static stub.

- [x] **Scaffold** — standalone project, entry, config, tokens, frame, grain, cursor, marquee.
- [ ] **Hero** — ink-smear reveal: gold canvas the cursor erases (`destination-out` brush) to reveal a duotone photo, healing back over time.
- [ ] **Manifesto** — GSAP ScrollTrigger scrubs each line in; photo chip masks an image through a word.
- [ ] **Ledger** — count-up stat numbers on scroll-in; timeline stamps slam down with rotation + audio tick.
- [x] **Shrine** — SVG relic cut-outs, pointer drag (clamped to the field), hover blob + stat chip. *(Drag is hand-rolled on pointer events, not a physics lib — see CLAUDE.md gotchas.)*
- [x] **TECH FOUL** — whistle → field shake → relics flung off-screen (CSS transition) → "SHE'D DO IT AGAIN." stamp → PLAY ON reset.
- [ ] **Footer + polish** — pendulum social strings, reduced-motion audit, mobile pass.
- [ ] **Verify** — browser check (console/network), exercise every interaction, desktop + mobile screenshots.

---

## Content & data notes

- **All copy and stats live in `src/data.js`.** Edit there; components just render it.
- **Stats are coarse, verifiable career facts only** (draft slot, schools, numbers worn). There is **no official public WNBA stats API**, so per-season numbers are intentionally hand-maintained — don't wire this to a live feed. Update once a year.
- **Photo rights:** the current portrait is a placeholder carried over from the showcase project. For a public launch, use rights-cleared imagery or lean fully into the halftone/duotone stylization (which is on-brand anyway and sidesteps the issue).
- **Social handles** in `data.js` are marked to verify before shipping publicly.
- The footer carries a **"fan-built tribute, not affiliated"** disclaimer. Keep it.

---

## The bigger plan

Three concepts total; build all three over time.

1. **Concept 1 — "THE BODYGUARD" (this project).** Buttermax-energy, Fever gold, ink smear, physics shrine, TECH FOUL. *In progress.*
2. **Concept 2 — "WANTED: THE SHERIFF OF THE PAINT."** Western tabloid / wanted-poster aesthetic, aged paper, letterpress, an Apple-style scroll-scrubbed highlight-tape image sequence with rubber-stamp slams. The easiest of the three to make flawless (no WebGL). Also a Sophie fit — a second, different take.
3. **Concept 3 — "THE FILM ROOM."** A full continuous 3D camera dolly through a stylized locker/film room (R3F + drei + Theatre.js + Rapier). The heaviest flex.

**Caitlin Clark → Concept 3.** The cinematic 3D "Film Room" walkthrough is the natural fit for the franchise-player flex, and will be its own standalone project when we get to it (same separation as this one).

---

*A fan-built tribute. Not affiliated with the WNBA or the Indiana Fever.*
