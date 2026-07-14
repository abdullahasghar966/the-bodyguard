/**
 * THE BODYGUARD — content model.
 *
 * Stats are coarse, verifiable career facts only (draft slot, schools,
 * numbers worn). There is no official public WNBA stats API, so anything
 * per-season lives here as hand-maintained data. Update once a year.
 */

export const marqueeItems = [
  'THE BODYGUARD',
  '№8',
  'SHOW-ME STATE',
  'INDIANA FEVER',
  'COLUMBIA, MO',
  'MIZZOU MADE',
  'SHARPSHOOTER',
  'ZERO BACKDOWN',
]

export const manifesto = {
  lines: [
    { parts: [{ text: 'THE GOLD', kind: 'display' }] },
    {
      parts: [
        { text: 'STANDARD', kind: 'display' },
        { text: 'in', kind: 'serif' },
      ],
    },
    {
      parts: [
        { text: 'SHOWING', kind: 'display' },
        { text: 'UP', kind: 'display-red' },
      ],
    },
    {
      parts: [
        { text: 'for your', kind: 'serif' },
        { text: 'PHOTO', kind: 'chip' },
        { text: 'TEAMMATES.', kind: 'display' },
      ],
    },
  ],
  aside:
    'Some players are the star. Some are the glue. Sophie is the third thing — the one who makes sure nobody lays a finger on either.',
}

export const ledger = [
  { label: 'DRAFTED', value: 2019, suffix: '', note: 'Round 2 · Pick 13 · Phoenix' },
  { label: 'THE PICK', value: 13, suffix: 'th', note: 'they let her fall. mistake.' },
  { label: 'LISTED AT', value: 6, suffix: '′1″', note: 'guard, allegedly. enforcer, actually.' },
  { label: 'WORE', value: 9, suffix: '', note: 'Phoenix Mercury · 2019–24' },
  { label: 'WEARS', value: 8, suffix: '', note: 'Indiana Fever · 2025–' },
  { label: 'PRO SEASON', value: 8, suffix: 'th', note: 'and counting · 2026' },
]

export const timeline = [
  {
    year: '1996',
    place: 'COLUMBIA, MISSOURI',
    stamp: 'BORN HERE',
    note: 'Show-Me State issue. Non-refundable.',
  },
  {
    year: '2015',
    place: 'MIZZOU TIGERS',
    stamp: 'HOMETOWN KID',
    note: 'Stayed home. Became the program.',
  },
  {
    year: '2019',
    place: 'PHOENIX MERCURY',
    stamp: 'THE VALLEY',
    note: 'Six seasons of doing the dirty work.',
  },
  {
    year: '2025',
    place: 'INDIANA FEVER',
    stamp: 'THE BODYGUARD',
    note: 'One trade. A folk hero overnight.',
  },
  {
    year: 'NOW',
    place: 'EVERYWHERE',
    stamp: 'FOLK HERO',
    note: 'Boots on. Mouthguard in. Try her.',
  },
]

// Shrine relics: positions are % of the field, sizes in px (desktop; CSS
// scales them down on small screens).
export const relics = [
  {
    id: 'boots',
    svg: 'boot',
    label: 'THE BOOTS',
    chip: 'game-day entrance, worn unironically',
    blob: '#C8102E',
    x: 8,
    y: 12,
    w: 170,
  },
  {
    id: 'mouthguard',
    svg: 'mouthguard',
    label: 'THE MOUTHGUARD',
    chip: 'always in. especially in the fourth.',
    blob: '#041E42',
    x: 40,
    y: 6,
    w: 150,
  },
  {
    id: 'mic',
    svg: 'mic',
    label: 'THE MIC',
    chip: 'show me something — the podcast',
    blob: '#F6F1E3',
    x: 70,
    y: 14,
    w: 120,
  },
  {
    id: 'jersey',
    svg: 'jersey',
    label: '№8',
    chip: 'new number, new era, same energy',
    blob: '#C8102E',
    x: 14,
    y: 55,
    w: 180,
  },
  {
    id: 'ball',
    svg: 'ball',
    label: 'TIGER BALL',
    chip: 'mizzou made, columbia forged',
    blob: '#041E42',
    x: 47,
    y: 52,
    w: 150,
  },
  {
    id: 'chain',
    svg: 'chain',
    label: 'THE CHAIN',
    chip: 'earned, not given',
    blob: '#F6F1E3',
    x: 76,
    y: 58,
    w: 140,
  },
]

// TWO UNIFORMS — the enforcer↔diva split. `img` keys map to imports in the
// component (see Uniforms.jsx). Left of the slider = on the clock, right = off.
export const uniforms = {
  kicker: 'TWO SIDES · ONE №8',
  title: 'TWO UNIFORMS.',
  sub: 'One problem for you.',
  hint: '◀ DRAG ▶',
  // `focus` = object-position; biased toward the top so faces (and a bit of the
  // fit) stay in frame when the wide stage crops a tall portrait.
  onClock: { img: 'scream', label: 'ON THE CLOCK', tag: 'game face', focus: '50% 30%' },
  offClock: { img: 'carpet', label: 'OFF THE CLOCK', tag: 'off-duty enforcer', focus: '50% 12%' },
}

// THE FITS — off-court diva strip. `img` keys map to imports in Fits.jsx.
export const fits = [
  { id: 'carpet', img: 'carpet', label: 'GOLD CARPET', chip: 'same gold, different fit' },
  { id: 'arbys', img: 'arbys', label: "HOT GIRLS EAT ARBY'S", chip: 'off the clock, on brand' },
  { id: 'fever', img: 'fever', label: 'FEVER, OFF DUTY', chip: 'home team red carpet' },
  { id: 'moto', img: 'moto', label: 'THE MOTO FIT', chip: 'leathered up, tunnel walk' },
  { id: 'brown', img: 'brown', label: 'THE ARRIVAL', chip: 'brown dress, red bag' },
]

// Handles confirmed by the owner (2026-07-14). Canonical URLs only — no
// tracking query params.
export const socials = [
  { platform: 'INSTAGRAM', handle: '@sophie_cham', href: 'https://www.instagram.com/sophie_cham', drop: 90 },
  { platform: 'TIKTOK', handle: '@sophiecham', href: 'https://www.tiktok.com/@sophiecham', drop: 150 },
  { platform: 'X / TWITTER', handle: '@sophaller', href: 'https://x.com/sophaller', drop: 60 },
]
