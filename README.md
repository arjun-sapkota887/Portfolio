# Solar Portfolio

A personal portfolio you explore like a solar system. A spiral galaxy greets the visitor; diving in reveals a
glowing Sun (**About**) orbited by planets — **Skills**, **Projects**, **Experience** and **Contact**. Click a
planet (or use the menu / keyboard) and the camera flies to it while a glass panel shows that section.

Everything is procedural: the Sun, planets, rings, starfield, Milky Way and galaxy are GLSL shaders — no
texture downloads.

Built with Vite, React 19, TypeScript, react-three-fiber, drei and zustand. Tested with Vitest,
Testing Library, @react-three/test-renderer, Playwright and axe.

## Quick start

```bash
npm install
npx playwright install chromium   # once, for e2e tests
npm run dev                       # http://localhost:5173
```

## Make it yours

All content lives in **`src/data/portfolio.ts`** — name, bio, skills, projects, experience, contact links and
each planet's look and orbit. Replace the placeholders, then run `npm test`: the schema validator
(`src/data/schema.ts`) fails the build on typos such as non-`https` links, a malformed email, overlapping
orbits or bad colours.

| Section    | Body                         |
| ---------- | ---------------------------- |
| About      | The Sun                      |
| Skills     | Small rocky planet           |
| Projects   | Earth-like world with clouds |
| Experience | Banded gas giant             |
| Contact    | Ringed planet                |

## Using the site

- **Mouse / touch:** click a planet or the Sun; click _Back to overview_ to return.
- **Keyboard:** `←` / `→` cycle sections, `Esc` returns to the overview, `Tab` reaches the menu.
- **Deep links:** `/#projects`, `/#contact`, … open a section directly (and skip the intro).
- **Reduced motion:** with `prefers-reduced-motion`, orbits freeze and the intro dive is instant.
- **No WebGL:** browsers without WebGL get a plain, fully readable page with the same content.
- **`?static=1`:** frozen, deterministic rendering (used by the screenshot tests).

## Scripts

| Command               | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `npm run dev`         | Development server                                        |
| `npm test`            | Unit, component and 3D scene-graph tests                  |
| `npm run test:e2e`    | Playwright end-to-end, visual and accessibility tests     |
| `npm run verify`      | Lint → typecheck → tests with coverage thresholds → build |
| `npm run verify:full` | `verify` plus the e2e suite                               |
| `npm run build`       | Production build in `dist/`                               |

## How it was built: phases, TDD and rollback

The site was built in phases. Each behaviour followed **red → green → refactor**: a failing test is committed
first (`… [red]`), then the code that makes it pass (`… [green]`). Every phase was developed on a
`phase/<n>-<slug>` branch, fast-forwarded into `main`, and tagged once `npm run verify` passed.

| Tag                      | Phase                                        |
| ------------------------ | -------------------------------------------- |
| `phase-0-scaffold`       | Tooling scaffold                             |
| `phase-1-rollback-tools` | Checkpoint / rollback tooling                |
| `phase-2-content`        | Typed content + schema validation            |
| `phase-3-orbit-math`     | Orbital mechanics, easing, seeded randomness |
| `phase-4-navigation`     | Navigation store, deep links, keyboard       |
| `phase-5-scene`          | Procedural 3D scene                          |
| `phase-6-camera`         | Camera fly-to, orbit pause, hover labels     |
| `phase-7-panels`         | Content panels, nav menu, HUD                |
| `phase-8-galaxy-intro`   | Galaxy intro and dive                        |
| `phase-9-polish`         | Fallback, accessibility, performance         |
| `phase-10-release`       | Journeys, docs, release (`v1.0.0`)           |

### Checkpoints and rollback

```bash
npm run phases                                   # list checkpoints
npm run checkpoint -- 11 dark-matter "Summary"   # verify, then tag HEAD as phase-11-dark-matter
npm run rollback -- phase-7-panels               # DRY RUN: show what would be undone
npm run rollback -- phase-7-panels --yes         # undo via revert commits (history kept; itself undoable)
npm run rollback -- phase-7-panels --hard        # reset to the tag; current state saved to backup/<timestamp>
npm run restore -- phase-5-scene                 # inspect an old phase on a new restore/<tag> branch
```

`checkpoint` refuses to tag a dirty working tree or a failing build, so every tag is a known-good state.
`rollback` is a dry run unless you pass `--yes` or `--hard`. The tooling lives in `scripts/` and is itself
covered by tests that run against throwaway git repositories.

## Project layout

```
src/
  data/      portfolio content, types, schema validator
  lib/       pure maths & helpers: orbits, camera poses, easing, RNG, galaxy, flags, WebGL check
  state/     zustand navigation store, URL-hash sync, keyboard navigation
  scene/     react-three-fiber scene: Sun, Planet, OrbitRing, Starfield, MilkyWay, Galaxy, CameraRig
             shaders/  procedural GLSL materials
  ui/        Intro, NavMenu, SectionPanel + panels, HoverLabel, Loader, Fallback
tests/e2e/   Playwright journeys, visual baselines, accessibility
scripts/     phase checkpoint / rollback CLI
```
