# UofT Decision Systems — Site Design

**Date:** 2026-07-01
**Status:** Approved

## Overview

A marketing/landing site for **UofT Decision Systems** (DSys), a student design
team at the University of Toronto. The site mirrors the flow of
[uwhpc.com](https://www.uwhpc.com): a bold mission-statement hero with clear
CTAs and a minimal structure. Its signature moment is a **neural-network
transition** — an animated node graph on the landing screen that reorganizes
into the main page as the visitor scrolls.

Aesthetic: **light and clean** — brand navy on off-white, matching the DSys
logo. The network is rendered as navy nodes/edges with subtle signal pulses.

## Goals

- A distinctive, memorable landing → main-page transition built on a neural
  network motif (ties to the logo's node-graph mark and the "Decision Systems"
  identity).
- Lean, focused content: hero/mission + get-involved/contact. No projects or
  team sections for now (YAGNI — easy to add later).
- Fast, accessible, and easy to edit (all copy in one config file).

## Non-Goals

- Projects showcase, team profiles, blog — explicitly deferred.
- CMS / backend. Static content only for now.
- WebGL/3D. The network is Canvas 2D for performance and simplicity.

## Experience & Flow

1. **Landing** (full viewport, `progress = 0`)
   - Off-white background with an animated neural network: navy nodes connected
     by edges, gently drifting; signal pulses travel along edges.
   - Centered **DSys** wordmark + tagline.
   - Scroll cue at the bottom.

2. **Transition** (`progress` 0 → 1, driven by scroll)
   - As the visitor scrolls (or clicks the scroll cue), the network's nodes
     ease from their dispersed landing positions toward "settled" target
     positions that frame the main content.
   - Landing text fades out; hero content fades in. The transition is
     continuous and scrubbable with scroll position.

3. **Main page** (`progress = 1`)
   - **Hero + mission** — bold statement ("A student design team at UofT
     building intelligent decision systems."), a subhead, and two CTAs
     (**Join the Team**, **Contact**). The network persists subtly in the
     background.
   - **Get Involved + Contact** — recruitment copy, a primary CTA (interest
     form link / email), contact info, and footer.

## Architecture

- **Framework:** Next.js (App Router, TypeScript).
- **Styling:** Tailwind CSS.
- **Animation/scroll:** Framer Motion (`useScroll` / `useMotionValue`) to derive
  a normalized `progress` value from scroll position.
- **Network rendering:** Plain Canvas 2D via a client component and
  `requestAnimationFrame` loop.

### Scroll orchestration

`page.tsx` (client) is the orchestrator. It uses Framer Motion's `useScroll` over
a tall scroll container to produce `progress` (0→1) across the transition zone.
`progress` is passed to `NeuralNetwork` (to interpolate node positions) and used
to drive opacity/position of `Landing` vs `Hero`.

## Components

Each component is a single-purpose, independently understandable unit.

- **`NeuralNetwork`** (`components/NeuralNetwork.tsx`, client)
  - Owns the node/edge model and the `requestAnimationFrame` animation loop on a
    `<canvas>`.
  - **Props:** `progress: MotionValue<number>` (or number) — 0 = dispersed
    landing layout, 1 = settled main layout.
  - Each node has a landing position and a target position; the render
    interpolates between them by `progress`. A gentle idle drift is layered on
    top. Signal pulses animate along edges.
  - **Depends on:** canvas API, `prefers-reduced-motion`, container size.

- **`Landing`** (`components/Landing.tsx`)
  - DSys wordmark, tagline, scroll cue. Fades out as `progress` increases.
  - **Depends on:** brand assets, `progress`.

- **`Hero`** (`components/Hero.tsx`)
  - Mission headline, subhead, two CTAs. Fades/rises in as `progress` increases.
  - **Depends on:** `content.ts`.

- **`GetInvolved`** (`components/GetInvolved.tsx`)
  - Recruitment copy, primary CTA, contact info, footer.
  - **Depends on:** `content.ts`.

- **`Nav`** (`components/Nav.tsx`)
  - Minimal sticky bar: logo + links (Get Involved, Contact). Appears after the
    landing (fades in with `progress`).
  - **Depends on:** `content.ts`.

- **`page.tsx`** — orchestrates scroll `progress` and composes the above.

- **`content.ts`** (`lib/content.ts`)
  - Single source of truth for all copy, CTA labels/links, and contact details.
    Placeholder but on-brand; trivial to edit.

## Design tokens

- Off-white background: `#F7F8FA`
- Brand navy: `#1B2A4A` (from logo)
- Navy node/edge colors derive from brand navy with varying opacity; subtle glow
  on nodes.
- Typography: a clean modern sans (system stack or a single Google font); large,
  confident hero type.

## Accessibility & Performance

- **`prefers-reduced-motion`:** render a static (non-animated) network; the
  transition becomes an instant/near-instant state change instead of scrubbed
  animation.
- Cap node count (target ~60–90 nodes) for smooth 60fps on laptops.
- Pause the animation loop when the canvas is offscreen (IntersectionObserver)
  or the tab is hidden.
- Canvas sized to `devicePixelRatio` for crispness; debounced resize handling.
- Semantic HTML for hero/get-involved content so the site is usable and
  indexable without JS/canvas.

## Content (placeholder, editable in `content.ts`)

- **Hero headline:** "A student design team at UofT building intelligent
  decision systems."
- **Hero subhead:** short line on what the team does / who it's for.
- **CTAs:** "Join the Team" (→ interest form/email), "Contact" (→ email/anchor).
- **Get Involved:** 1–2 short paragraphs on joining, no experience required, etc.
- **Contact:** email + optional social links.

## Testing

Pragmatic, scaled to a visual/marketing site:

- Build passes (`next build`) with no type errors.
- Smoke test: components render without crashing (React Testing Library) and
  key copy from `content.ts` appears.
- Manual/visual check of the landing → main transition in the browser
  (including a `prefers-reduced-motion` pass).

## Deliverables

- Runnable Next.js app (`npm run dev`) with the landing, transition, hero, and
  get-involved/contact sections.
- All copy centralized in `content.ts`.
- README with run instructions and where to edit content.
