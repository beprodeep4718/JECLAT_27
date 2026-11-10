# JECLAT 2027

Website for JECLAT 2027, North Bengal's biggest socio-cultural fest at Jalpaiguri Government Engineering College.
Theme: **Mosphit: The Final Verse**.

Stack: Next.js 16 (App Router, Turbopack, Cache Components), React 19, GSAP + ScrollTrigger, Lenis, Three.js, Motion (Framer Motion).

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (the page prerenders fully static)
npm run lint
```

## Swapping in real data

All content lives in `src/data/`. Components only read from there.

| File | What it holds |
| --- | --- |
| `fest.ts` | Name, dates, countdown target, venue, theme copy, stats, how to reach, socials, notes. **`IS_DEMO`** shows the "Demo" badges; set it to `false` at launch. |
| `schedule.ts` | The three verses (days) and their tracks (events). |
| `lineup.ts` | Pro Night acts. `masked` hides the headliner behind the peel-off strip. Add `photo` when you have artist photos. |
| `events.ts` | Competitions. Add `registerUrl` to turn the toast button into a real link. |
| `passes.ts` | Pass tiers as record pressings. Add `buyUrl` for checkout. |
| `info.ts` | FAQ and sponsor slots (`name` / `logo`). |

Types for all of it are in `src/data/types.ts`.

## Where things are

```
src/app/                 layout (fonts, metadata), page, global tokens, icons, OG image
src/components/hero/     Hero, Countdown, MaskCanvas (Three.js layer, loaded client-side only)
src/components/sections/ Ticker, Theme, Verses, Lineup, Events, Passes, Rewind, Visit
src/components/layout/   Nav (+ mobile menu, beat button), Footer
src/components/providers Lenis smooth scroll, beat engine, toasts
src/lib/                 mask-scene (shatter shader), beat-engine (Web Audio), scramble, gsap setup
src/assets/              jeclat-mask.webp (logo art with the background removed)
design/                  source logo + the original single-file mockup
```

## Notes

- **The mask**: the logo is cut into ~420 triangles in a shader. Scrolling the hero away cracks it from the closed eye outward and drops the shards. With "Drop the beat" on, crack lines flash on every kick. Reduced-motion users get the static logo.
- **Placeholder buttons**: any element with `data-toast="..."` shows a toast on click (see `ToastProvider`). Replace with links as real URLs arrive.
- **OneDrive**: this folder syncs to OneDrive, including `node_modules` and `.next`. Consider excluding them or moving the project out of OneDrive if syncing gets slow.
