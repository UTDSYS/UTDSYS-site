# DSys Site — Visual Polish & Signature Scroll Animation

**Date:** 2026-07-02
**Status:** Approved (design direction)

## Overview

The DSys site already mirrors the structure of [uwhpc.com](https://www.uwhpc.com)
(mission-statement hero, minimal nav, a scroll-driven neural-network transition).
It currently reads as **messy and unpolished**. This effort is a focused **visual
polish** pass — no information-architecture restructure — that fixes the four
sources of that feeling and elevates the scroll animation into a genuine
signature moment on par with uwhpc.

**Brand direction:** keep the existing **light / navy** DSys palette (off-white
`#F7F8FA` background, navy `#1B2A4A`), refined and made intentional — not a switch
to uwhpc's dark theme.

## Goals

1. **A cohesive design system** — replace ad-hoc styling with shared tokens and
   reusable primitives so every screen draws from one system.
2. **Deliberate spacing & typography** — a real typeface, a confident type scale,
   and consistent vertical rhythm and containers.
3. **A signature scroll animation** — elevate the existing neural-network morph
   into a continuous, multi-stage, uwhpc-caliber scroll experience.
4. **Fix the "empty" feeling by design** — intentional whitespace, designed empty
   states for placeholder pages, and an honest, deduplicated nav.

## Non-Goals

- No dark theme (keeping the light/navy brand).
- No IA restructure or new top-level pages.
- No CMS/backend; content stays in `content.ts`.
- No large new written content. Emptiness is solved with design, not filler.
  (One *optional* lightweight homepage value-strip is called out explicitly.)
- No WebGL/3D. The animation stays Canvas 2D.

## Current State (what's being polished)

- `app/globals.css` — only two color tokens; no spacing/type/radius system.
- Buttons are one-off inline classes: `Intro`'s pill vs. the contact form's
  buttons are unrelated. No shared `Button`.
- No shared `Section`/`Container`; max-widths and padding are repeated ad hoc
  (`max-w-6xl` in Nav/Footer, `max-w-4xl`/`max-w-xl` in Intro).
- System font stack only — nothing that reads as "designed."
- `NeuralNetwork` morph is a single Landing→Intro fade over a `300vh` pinned
  region; the canvas is underused as a scroll actor.
- Nav is misleading: **Contact** and **Get Involved** both link to
  `/get-involved`; **Team** and **Blog** are "coming soon" placeholders.
- Team/Blog pages render bare "coming soon" copy that looks broken, not
  deliberate.

## Work Area 1 — Cohesive Design System

Root cause of "messiness." Establish one system everything draws from.

- **Tokens** (`globals.css` `@theme`):
  - Navy tint ramp formalized (e.g. navy, navy/70, navy/40, navy/10 as named
    steps used consistently).
  - **One accent color** — a considered blue/indigo derived from the logo — for
    CTAs, links, and pulse highlights. Adds life while staying in the navy brand.
  - Spacing scale, border-radius scale, and a type scale as tokens.
- **Typeface** via `next/font`: a clean geometric/grotesque pairing
  (e.g. Space Grotesk for headings + Inter for body). This alone reads as
  "designed."
- **Primitives**:
  - `Button` component with `primary` / `secondary` variants, replacing every
    one-off button/pill.
  - `Section` / `Container` wrapper standardizing max-width and horizontal
    padding across Nav, hero, Intro, Footer, and sub-pages.

**Success:** buttons, containers, colors, and type all come from named tokens /
shared components; no bespoke spacing or color values scattered in JSX.

## Work Area 2 — Spacing & Typography Rhythm

- Standardize section vertical padding and one container max-width.
- Confident, responsive type scale; tighter heading tracking; comfortable body
  measure (`max-w-prose`-style line length).
- Align hero, nav, and footer to the same horizontal grid so nothing feels loose.

**Success:** consistent rhythm top-to-bottom; headings and body have a clear,
repeatable scale at every breakpoint.

## Work Area 3 — Signature Scroll Animation (centerpiece)

Elevate the existing scroll morph into a continuous, multi-stage actor.
**Chosen approach: Option A — Multi-stage morph** (reuses the current canvas +
`useScroll` setup; maximum impact for minimum new architecture). Option B
(scene-based scrollytelling deck) was rejected as overkill for a lean site.

The full-bleed `NeuralNetwork` canvas persists across the whole pinned scroll and
passes through **staged formations** driven by `progress`:

- **0.0** — dispersed cloud drifting behind the DSys wordmark.
- **~0.4** — nodes converge into a structured lattice/constellation as the
  mission line resolves.
- **~0.8** — the lattice relaxes and flows to frame the CTAs; signal pulses
  intensify near them.

Enhancements:

- **Depth parallax** — nodes distributed across 2–3 depth layers scroll at
  different rates for a sense of dimension.
- **Mouse parallax** — subtle hero-only pointer response.
- **Eased scrubbing** — smooth the raw scroll `progress` so staging feels
  intentional, not linear/janky.

**Constraints (must hold):**

- `prefers-reduced-motion` → render a single static formation; no scrubbed
  motion.
- Pause the `requestAnimationFrame` loop when the canvas is offscreen
  (IntersectionObserver) or the tab is hidden.
- Canvas sized to `devicePixelRatio`; debounced resize.
- Node count capped (~60–90) for smooth 60fps on laptops.

**Success:** scrolling the homepage feels like a deliberate, impressive sequence;
smooth on a laptop; fully usable and non-distracting with reduced-motion on.

## Work Area 4 — Fix the "Empty" Feeling (by design)

- **Designed empty states** for Team/Blog: branded, centered, using the shared
  `Section`/`Container` and type system so "coming soon" looks intentional.
- **Nav dedupe** — resolve the misleading duplicate links. Target a clean, honest
  set (e.g. a single Contact/Get Involved entry; placeholder pages either clearly
  marked or removed from the primary nav). Final set decided during
  implementation, kept honest to what exists.
- **Homepage breathing room** — intentional whitespace and alignment so the
  single Intro section feels composed, not thin.
- **Optional:** a compact "what we do" value-strip on the homepage (2–3 short
  value points). Adds light content; included only if desired. *Default: build
  it, since it directly counters the empty feeling — easy to drop.*

**Success:** no screen looks broken or accidentally empty; nav links all lead
somewhere real and non-duplicative.

## Architecture (unchanged)

- **Framework:** Next.js (App Router, TypeScript).
- **Styling:** Tailwind CSS with `@theme` tokens.
- **Animation/scroll:** Framer Motion `useScroll` → normalized `progress`.
- **Network rendering:** Canvas 2D via a client component + `requestAnimationFrame`.

`page.tsx` remains the orchestrator: `useScroll` over the tall pinned container
produces `progress`, passed to `NeuralNetwork` and used to drive Landing/Intro/Nav.

## Testing

Scaled to a visual/marketing site:

- `next build` passes with no type errors.
- Existing component smoke tests still pass; key copy from `content.ts` renders.
- Manual/visual check of the multi-stage scroll on desktop and mobile widths.
- `prefers-reduced-motion` pass (static formation, no scrub).

## Deliverables

- Refined site on the light/navy brand with a shared token/primitive system.
- The elevated multi-stage scroll animation as the homepage centerpiece.
- Designed empty states and a deduplicated, honest nav.
- All copy still centralized in `content.ts`.
