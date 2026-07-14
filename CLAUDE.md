# CLAUDE.md — project context for Claude Code

> This file is auto-loaded at the start of every session in this directory.
> It is the handoff so a fresh session picks up without losing context.
> For the full brief, design rationale, and the 3-concept master plan, read
> **[README.md](README.md)**.

## What this is

**THE BODYGUARD** — an interactive single-player web experience for **Sophie
Cunningham** (№8, Indiana Fever), built in the "award-site" style of
buttermax.net: one loud flat **Fever gold**, giant kinetic typography, an
ink-smear hero, draggable physics relics, and a **TECH FOUL** easter egg.

Standalone **Vite + React 18** project. Deliberately separate from the
league-wide "THE W" showcase (which lives at `D:\WNBA Website`).

## Run / build

```bash
npm install      # first time only
npm run dev      # dev server (a .claude/launch.json config named "sophie" exists)
npm run build    # production build — currently compiles clean, 48 modules
```

## Current state (as of the last session)

Scaffold complete and compiles clean. Section status:

| Component | State |
|-----------|-------|
| `Loader` (loading page) | ✅ done — gold "NOW ENTERING" tip-off: count 0→100 while imagery preloads, whistle, panel lifts to reveal the site |
| `Frame`, `Grain`, `Cursor`, `Marquee` | ✅ done |
| `Hero` + `useInkSmear` hook | ✅ done — ink-smear reveal; portrait is `sophie-scream.jpg` (landscape → frames without over-zoom) |
| `Manifesto` | ◻ static stub — renders real copy + real photo chip; needs GSAP scroll-scrub |
| `Ledger` | ◻ static stub — renders real stats; needs count-up + stamp slam |
| `Shrine` | ✅ done — SVG relic cut-outs, pointer drag (field-clamped), hover blob + chip |
| TECH FOUL button | ✅ done — whistle + shake + relics flung off-screen + "SHE'D DO IT AGAIN." stamp + PLAY ON reset |
| `Uniforms` | ✅ done — enforcer↔diva before/after slider (pointer drag). "TWO UNIFORMS." |
| `Fits` | ✅ done — 5 real off-court "diva" cards (carpet, arby's, fever, moto, brown) |
| `Footer` | ◻ static stub — needs pendulum-swing polish |

**Build order for what's left:** Manifesto → Ledger → Footer/polish → full verify.

**`Loader` gotcha:** it drives its count with `setInterval`, NOT `requestAnimationFrame`
— rAF is paused while the tab/pane is hidden, which froze the count and hung the whole
loader (caught in the in-app pane). Keep it on a timer. It sits at z-index 80 (over
frame/grain, under the custom cursor at 90) and locks `body` overflow while up.

## Real imagery (as of 2026-07-14)

Real Sophie photos live in `src/assets/` and every "drop file" slot is now filled:
- `sophie-scream.jpg` — hero smear (white-jersey game scream, landscape)
- `sophie-action.avif` — Manifesto chip + Uniforms "on the clock"
- `sophie-carpet.webp` — Uniforms "off the clock" + Fits "gold carpet"
- `sophie-arbys.jpg`, `sophie-fever.jpg`, `sophie-moto.jpg`, `sophie-brown.jpg` — Fits
- `sophie-wave.webp` — preloaded; spare (was the earlier hero pick)

The old `sophie-cunningham.jpeg` placeholder is no longer imported. **Rights:** the
AP/SI/Getty press shots are still placeholders — clear rights or lean harder on
duotone before any public launch (README "Content & data notes").

## How the code is organized (conventions — follow these)

- **All content/copy/stats live in `src/data.js`.** Components render it; never
  hard-code copy in a component. Stats are coarse verifiable facts only (no live
  WNBA API exists — hand-maintained).
- **All sound is synthesized in `src/audio.js`** (WebAudio, no audio assets):
  `whistle()`, `slam()`, `pop()`, `crowd()`, plus sound on/off state.
- **Palette tokens** (`src/styles.css` `:root`): `--gold #FFCD00`, `--ink
  #0B0B0C`, `--red #C8102E`, `--navy #041E42`, `--cream #F6F1E3`.
  Fonts: **Anton** (display) · **Instrument Serif** italic (accent) ·
  **Martian Mono** (labels).
- **Progressive enhancement pattern** (see `Hero.jsx` `canEnhance()`): heavy
  interactions run only on `(pointer: fine)` + no `prefers-reduced-motion`;
  otherwise a clean static fallback. Apply this to the Shrine drag + TECH FOUL.
- Custom cursor reads `data-cursor="VERB"` off the hovered element to print a
  verb label (SMEAR/DRAG/EJECT/TAP). Add it to new interactive zones.
- GSAP + its plugins (ScrollTrigger, Physics2D, SplitText) are installed and all
  free; registered in `App.jsx`.

## Known issues / gotchas

- **Verify the hero in a REAL browser.** The in-app browser pane was flaky last
  session: it desynced scroll position and stalled screenshots when compositing
  the large hero canvas. The code was confirmed healthy (console 100% clean,
  canvas erase/reveal verified by direct inspection) — but a human eyeball on the
  smear in Chrome/Firefox is still owed.
- The full-viewport SVG grain was recently changed from a live turbulence filter
  to a **pre-rasterized tiled texture** (`Grain.jsx` + `.grain` in styles.css)
  because the live filter stalled the compositor. Keep it tiled.
- `useInkSmear` sizes its canvases via a **ResizeObserver** (not the window
  `resize` event) — that was a real bug fix; don't regress it.
- **Shrine drag + TECH FOUL eject are hand-rolled** (native pointer events +
  CSS transitions in `Shrine.jsx`), NOT framer-motion. framer's motion-value
  layer would not animate the mapped/nested relics here (drag, `animate` prop,
  and `useAnimate` all silently no-opped), while it works fine for the
  freshly-mounted stamp. Keep the relic transforms plain-CSS/pointer-driven;
  only the `.shrine__stamp` entrance uses framer. Structure is
  `.relic-anchor` (centering) → `.relic-eject` (drag+fling transform) →
  `.relic` (hover) so the transforms never clobber each other.
- **In-app browser pane can't screenshot this site** (stalls compositing the
  hero canvas) and drops/desyncs often. Verify via DOM/computed-style reads
  (`read_page`, `javascript_tool`), and do a hard server+pane restart if framer
  Fast-Refresh state ever goes stale (a zombie module kept resetting inline
  transforms every frame until a clean restart).

## The bigger plan

Three concepts total; build all three over time. This is **Concept 1**.
Concept 2 = "WANTED: Sheriff of the Paint" (western tabloid). Concept 3 = "The
Film Room" (full 3D walkthrough) — earmarked for a future **Caitlin Clark**
site, its own standalone project. Details in README.

## Working style for this project

The user (a Fable-5 user building this for fun/portfolio) will bring a list of
problems and missing pieces each session — expect iteration and direct feedback.
Keep the Buttermax energy: bold, loud, physical, a little unhinged.
