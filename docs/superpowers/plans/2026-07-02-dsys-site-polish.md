# DSys Site Polish & Signature Scroll Animation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the light/navy DSys site a cohesive design system, deliberate spacing/typography, designed empty states, and an elevated multi-stage neural-network scroll animation — a visual-polish pass, no IA restructure.

**Architecture:** Next.js App Router (client `page.tsx` orchestrates a `300vh` pinned scroll via Framer Motion `useScroll` → `progress`). A full-bleed Canvas 2D `NeuralNetwork` reads `progress`; `Landing`/`Intro`/`Nav` cross-fade via imperative style writes (`lib/scroll.ts`). We add shared tokens + primitives (`Button`, `Section`), a distinctive font pairing, a third network formation with depth layers, mouse parallax, and designed empty states — all reusing existing patterns.

**Tech Stack:** Next 16, React 19, TypeScript 5, Tailwind CSS v4 (`@theme` in `app/globals.css`), Framer Motion 12, Canvas 2D, Vitest 4 + Testing Library, `next/font/google`.

## Global Constraints

- Brand palette stays **light/navy**: off-white `#F7F8FA`, navy `#1B2A4A`. No dark theme.
- All copy stays centralized in `lib/content.ts`; components read from it — no hardcoded strings in JSX.
- `prefers-reduced-motion: reduce` must render a single static network formation with no scrubbed/rAF motion (preserve existing `reduce` branch in `NeuralNetwork`).
- Animation stays **Canvas 2D** (no WebGL/3D). Node count capped ~60–90. rAF loop pauses on tab-hidden.
- Network model functions stay **pure and deterministic** (seeded `mulberry32`) so SSR and client renders match.
- Every code step: `npm test` (Vitest) and `npm run build` must pass before commit.
- Tailwind v4: design tokens are declared in the `@theme { }` block of `app/globals.css`, consumed as utility classes (e.g. `--color-accent` → `text-accent`, `bg-accent`).

---

## File Structure

**Create:**
- `components/ui/Button.tsx` — shared button/link primitive (`primary` | `secondary`).
- `components/ui/Section.tsx` — standardized max-width + horizontal padding container.
- `components/ui/Button.test.tsx`, `components/ui/Section.test.tsx` — smoke tests.
- `lib/network/formations.ts` — pure functions for the third formation + depth; unit-tested.
- `lib/network/formations.test.ts`.

**Modify:**
- `app/globals.css` — token system (accent, spacing already via Tailwind, radii, type scale, navy tints).
- `app/layout.tsx` — swap Geist for the Space Grotesk (display) + Inter (body) pairing.
- `lib/network/model.ts` — add `lattice` formation + `depth` per node; three-stage `nodePosition`.
- `components/NeuralNetwork.tsx` — consume three-stage positions, depth parallax, mouse parallax.
- `components/Intro.tsx`, `components/ContactForm.tsx`, `app/get-involved/page.tsx` — use `Button`.
- `components/Landing.tsx`, `components/Footer.tsx`, `components/Nav.tsx`, `components/PageShell.tsx` — use `Section`, apply type/spacing rhythm.
- `components/ComingSoon.tsx` — designed empty state.
- `lib/content.ts` — dedupe nav links; add optional `home.values` (Task 9).
- `app/page.tsx` — mount optional value-strip (Task 9).

---

## Task 1: Design tokens

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: Tailwind utility classes backed by tokens — `--color-navy`, `--color-offwhite`, `--color-accent` (→ `text-accent`, `bg-accent`, `border-accent`), and `--radius-card`. Navy alpha tints keep using Tailwind's `navy/NN` opacity syntax.

- [ ] **Step 1: Add tokens to the `@theme` block**

Replace the current `@theme` block in `app/globals.css`:

```css
@theme {
  --color-navy: #1b2a4a;
  --color-offwhite: #f7f8fa;
  /* One considered accent derived from the navy brand — used for CTAs,
     links, and pulse highlights. */
  --color-accent: #3b5bdb;
  --radius-card: 1.25rem;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: build completes, no CSS/type errors.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat: add accent + radius design tokens"
```

---

## Task 2: Distinctive font pairing

**Files:**
- Modify: `app/layout.tsx`, `app/globals.css`

**Interfaces:**
- Produces: CSS vars `--font-display` (Space Grotesk) and `--font-body` (Inter); `body` uses body font, `--font-display` available for headings via a `font-display` utility.

- [ ] **Step 1: Swap the font imports in `app/layout.tsx`**

Replace the Geist imports and the `<html>` className:

```tsx
import { Space_Grotesk, Inter } from "next/font/google";

// Distinct var names (`--ff-*`) so the Tailwind `@theme` tokens can reference
// them without a circular `--font-display: var(--font-display)` definition.
const display = Space_Grotesk({
  variable: "--ff-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Inter({
  variable: "--ff-body",
  subsets: ["latin"],
});
```

Then update the `<html>` element:

```tsx
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
```

- [ ] **Step 2: Wire fonts into `app/globals.css`**

Add inside `@theme` (so `font-display` / default body font resolve):

```css
  --font-sans: var(--font-body);
  --font-display: var(--font-display);
```

And set the body font in the `body` rule (keep existing color rules):

```css
body {
  background-color: var(--color-offwhite);
  color: var(--color-navy);
  font-family: var(--font-body), system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build passes; no unused-import errors (Geist fully removed).

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat: switch to Space Grotesk + Inter font pairing"
```

---

## Task 3: `Button` primitive

**Files:**
- Create: `components/ui/Button.tsx`, `components/ui/Button.test.tsx`

**Interfaces:**
- Produces: `Button({ href, variant, children, type, disabled, className })` where `variant: "primary" | "secondary"` (default `"primary"`). If `href` is set it renders a Next `Link`; otherwise a `<button type=...>`. Primary = filled navy; secondary = navy outline.

- [ ] **Step 1: Write the failing test**

`components/ui/Button.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Button from "./Button";

describe("Button", () => {
  it("renders a link when href is given", () => {
    render(<Button href="/get-involved">Join</Button>);
    const el = screen.getByRole("link", { name: "Join" });
    expect(el).toHaveAttribute("href", "/get-involved");
  });

  it("renders a button element when no href is given", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("applies secondary variant styles", () => {
    render(<Button variant="secondary" href="/x">Learn</Button>);
    expect(screen.getByRole("link", { name: "Learn" }).className).toContain(
      "border",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Button`
Expected: FAIL — cannot find module `./Button`.

- [ ] **Step 3: Implement `components/ui/Button.tsx`**

```tsx
import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";

const base =
  "inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-accent",
  secondary: "border border-navy/25 text-navy hover:border-navy hover:bg-navy/5",
};

type Props = {
  variant?: Variant;
  href?: string;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<"button">, "className" | "children">;

export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...rest
}: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Button`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/Button.tsx components/ui/Button.test.tsx
git commit -m "feat: add Button primitive with primary/secondary variants"
```

---

## Task 4: `Section` container primitive

**Files:**
- Create: `components/ui/Section.tsx`, `components/ui/Section.test.tsx`

**Interfaces:**
- Produces: `Section({ children, className, as })` rendering `<as>` (default `"div"`) with `mx-auto w-full max-w-6xl px-6`. `className` appends. Standard container used by Nav, Footer, PageShell, value-strip.

- [ ] **Step 1: Write the failing test**

`components/ui/Section.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Section from "./Section";

describe("Section", () => {
  it("applies the standard container width and padding", () => {
    render(<Section>hi</Section>);
    const el = screen.getByText("hi");
    expect(el.className).toContain("max-w-6xl");
    expect(el.className).toContain("px-6");
  });

  it("merges extra className", () => {
    render(<Section className="py-10">hi</Section>);
    expect(screen.getByText("hi").className).toContain("py-10");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Section`
Expected: FAIL — cannot find module `./Section`.

- [ ] **Step 3: Implement `components/ui/Section.tsx`**

```tsx
import type { ElementType } from "react";

export default function Section({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={`mx-auto w-full max-w-6xl px-6 ${className}`}>
      {children}
    </Tag>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- Section`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add components/ui/Section.tsx components/ui/Section.test.tsx
git commit -m "feat: add Section container primitive"
```

---

## Task 5: Adopt `Button` across the site

**Files:**
- Modify: `components/Intro.tsx`, `components/ContactForm.tsx`, `app/get-involved/page.tsx`

**Interfaces:**
- Consumes: `Button` from Task 3 (`@/components/ui/Button`).

- [ ] **Step 1: Replace the Intro CTA**

In `components/Intro.tsx`, replace the `<Link ...>` CTA block with:

```tsx
      <Button href={content.intro.cta.href} className="mt-10">
        {content.intro.cta.label}
      </Button>
```

Add the import (and drop the now-unused `Link` import if nothing else uses it):

```tsx
import Button from "@/components/ui/Button";
```

- [ ] **Step 2: Replace the get-involved email CTA**

In `app/get-involved/page.tsx`, the `mailto:` link stays a plain styled `<a>` (it is a text link, not a button) — no change needed there. Confirm no button-styled `<a>`/`<Link>` remains that should be a `Button`.

- [ ] **Step 3: Route the ContactForm submit through `Button`**

Open `components/ContactForm.tsx`. Locate the submit `<button type="submit" ...>` and replace its className-heavy markup with:

```tsx
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending"
            ? content.getInvolved.form.sending
            : content.getInvolved.form.submit}
        </Button>
```

Add `import Button from "@/components/ui/Button";`. (Match the exact `status` variable name already used in the file; if it differs, use the existing one.)

- [ ] **Step 4: Run tests + build**

Run: `npm test && npm run build`
Expected: all tests pass (including existing `ContactForm.test.tsx`); build clean. If `ContactForm.test.tsx` queries the submit control by role/name, it still resolves because `Button type="submit"` renders a `<button>`.

- [ ] **Step 5: Commit**

```bash
git add components/Intro.tsx components/ContactForm.tsx app/get-involved/page.tsx
git commit -m "refactor: use Button primitive for all CTAs"
```

---

## Task 6: Spacing & typography rhythm

**Files:**
- Modify: `components/Landing.tsx`, `components/Intro.tsx`, `components/Nav.tsx`, `components/Footer.tsx`, `components/PageShell.tsx`, `components/ComingSoon.tsx`

**Interfaces:**
- Consumes: `Section` (Task 4), `--font-display` (Task 2).

- [ ] **Step 1: Apply display font + tightened scale to headings**

Add `font-display` to the hero-scale headings. In `components/Landing.tsx` the wordmark `<h1>`:

```tsx
      <h1 className="font-display text-7xl font-bold tracking-tight text-navy md:text-9xl">
        {content.brand.name}
      </h1>
```

In `components/Intro.tsx` the headline `<h1>`:

```tsx
      <h1 className="font-display max-w-4xl text-4xl font-semibold leading-[1.1] tracking-tight text-navy md:text-6xl">
        {content.intro.headline}
      </h1>
```

- [ ] **Step 2: Standardize Nav + Footer to the `Section` container**

In `components/Nav.tsx`, replace the inner `<div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">` with a `Section` (import it):

```tsx
      <Section as="div" className="flex items-center justify-between py-5">
```

In `components/Footer.tsx`, replace `<div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 ...">` with:

```tsx
      <Section as="div" className="flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between">
```

Add `import Section from "@/components/ui/Section";` to both.

- [ ] **Step 3: Normalize sub-page vertical rhythm**

In `components/PageShell.tsx`, keep `max-w-2xl` for reading measure but standardize padding to the shared rhythm:

```tsx
      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-28 text-center">
```

- [ ] **Step 4: Verify build + visual**

Run: `npm run build`
Expected: passes. Then `npm run dev` and confirm hero, nav, footer, and sub-pages share consistent gutters and the display font renders on headings.

- [ ] **Step 5: Commit**

```bash
git add components/Landing.tsx components/Intro.tsx components/Nav.tsx components/Footer.tsx components/PageShell.tsx
git commit -m "style: consistent type scale and container rhythm"
```

---

## Task 7: Third network formation + depth (model)

**Files:**
- Modify: `lib/network/model.ts`
- Create: `lib/network/formations.test.ts`

**Interfaces:**
- Produces:
  - `NetNode` gains `lattice: Vec2` and `depth: number` (0.4–1.0; smaller = further back).
  - `nodePosition(node, progress)` now interpolates across **three** stages: `landing` (p=0) → `lattice` (p=0.5) → `settled` (p=1), each leg eased with `easeInOut`.
- Consumes: existing `mulberry32`, `clamp01`, `lerp`, `easeInOut`.

- [ ] **Step 1: Write the failing test**

`lib/network/formations.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { createNodes, nodePosition } from "./model";

describe("three-stage nodePosition", () => {
  const [n] = createNodes(1, 42);

  it("assigns a lattice formation and a depth to each node", () => {
    expect(n.lattice).toBeDefined();
    expect(n.depth).toBeGreaterThanOrEqual(0.4);
    expect(n.depth).toBeLessThanOrEqual(1);
  });

  it("sits at landing at p=0", () => {
    const pos = nodePosition(n, 0);
    expect(pos.x).toBeCloseTo(n.landing.x, 5);
    expect(pos.y).toBeCloseTo(n.landing.y, 5);
  });

  it("passes through the lattice formation at p=0.5", () => {
    const pos = nodePosition(n, 0.5);
    expect(pos.x).toBeCloseTo(n.lattice.x, 5);
    expect(pos.y).toBeCloseTo(n.lattice.y, 5);
  });

  it("reaches settled at p=1", () => {
    const pos = nodePosition(n, 1);
    expect(pos.x).toBeCloseTo(n.settled.x, 5);
    expect(pos.y).toBeCloseTo(n.settled.y, 5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- formations`
Expected: FAIL — `n.lattice` undefined / lattice assertion fails.

- [ ] **Step 3: Extend the model**

In `lib/network/model.ts`, add to `NetNode`:

```ts
export interface NetNode {
  id: number;
  landing: Vec2;
  lattice: Vec2;
  settled: Vec2;
  driftPhase: number;
  radius: number;
  depth: number;
}
```

In `createNodes`, compute a structured lattice position and a depth. Replace the `nodes.push({...})` with:

```ts
    // Lattice: snap toward a centered grid so the mid-scroll formation reads
    // as an intentional structure before it relaxes into `settled`.
    const cols = Math.ceil(Math.sqrt(count));
    const gx = (i % cols) / (cols - 1 || 1);
    const gy = Math.floor(i / cols) / (cols - 1 || 1);
    const latticeX = lerp(0.28, 0.72, gx);
    const latticeY = lerp(0.28, 0.72, gy);
    nodes.push({
      id: i,
      landing: { x: lx, y: ly },
      lattice: { x: latticeX, y: latticeY },
      settled: { x: sx, y: sy },
      driftPhase: rand() * Math.PI * 2,
      radius: 1.5 + rand() * 2,
      depth: 0.4 + rand() * 0.6,
    });
```

Replace `nodePosition` with a three-stage version:

```ts
export function nodePosition(node: NetNode, progress: number): Vec2 {
  const p = clamp01(progress);
  if (p <= 0.5) {
    const t = easeInOut(p / 0.5);
    return {
      x: lerp(node.landing.x, node.lattice.x, t),
      y: lerp(node.landing.y, node.lattice.y, t),
    };
  }
  const t = easeInOut((p - 0.5) / 0.5);
  return {
    x: lerp(node.lattice.x, node.settled.x, t),
    y: lerp(node.lattice.y, node.settled.y, t),
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- formations model`
Expected: PASS. Existing `lib/network/model.test.ts` still passes (if it asserted the old two-stage `nodePosition` at p=0/1, those endpoints are unchanged; if it asserted a specific p=0.5 midpoint value, update that assertion to `n.lattice` in the same commit).

- [ ] **Step 5: Commit**

```bash
git add lib/network/model.ts lib/network/formations.test.ts
git commit -m "feat: add lattice formation and depth to network model"
```

---

## Task 8: Depth + mouse parallax rendering

**Files:**
- Modify: `components/NeuralNetwork.tsx`

**Interfaces:**
- Consumes: three-stage `nodePosition`, `NetNode.depth` (Task 7).
- Produces: nodes render with depth-scaled parallax offset from pointer + scroll; reduced-motion and tab-hidden-pause behavior preserved.

- [ ] **Step 1: Track pointer offset (full-motion path only)**

In `components/NeuralNetwork.tsx`, inside the `useEffect` after `let paused = false;`, add a pointer offset the render reads:

```tsx
    // Normalized pointer offset from viewport center, for depth parallax.
    let px = 0;
    let py = 0;
    const onPointer = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
    };
```

- [ ] **Step 2: Apply depth parallax in `point`**

Update the `point` helper so deeper nodes shift more with the pointer (guard with `reduce` so reduced-motion stays static):

```tsx
    const point = (n: NetNode, p: number, t: number, surge: number) => {
      const base = nodePosition(n, p);
      const amp = reduce ? 0 : 0.006;
      const conv = surge * 0.06;
      const par = reduce ? 0 : n.depth * 0.02;
      const x = base.x + (0.5 - base.x) * conv + px * par;
      const y = base.y + (0.5 - base.y) * conv + py * par;
      return {
        x: (x + Math.cos(t * 0.4 + n.driftPhase) * amp) * w,
        y: (y + Math.sin(t * 0.4 + n.driftPhase) * amp) * h,
      };
    };
```

- [ ] **Step 3: Register/cleanup the pointer listener**

In the full-motion branch, add alongside the existing `resize`/`visibilitychange` registrations:

```tsx
    window.addEventListener("pointermove", onPointer);
```

And in that branch's cleanup `return`:

```tsx
      window.removeEventListener("pointermove", onPointer);
```

(Do **not** add the pointer listener in the `reduce` branch — parallax must stay off under reduced motion.)

- [ ] **Step 4: Scale node draw by depth**

In the node-drawing loop, multiply the node radii by depth so far nodes read smaller/dimmer. Replace the two node `arc` radii:

```tsx
        ctx.arc(q.x, q.y, n.radius * (3 + surge * 4) * n.depth, 0, Math.PI * 2);
```
and
```tsx
        ctx.arc(q.x, q.y, n.radius * (1 + surge * 0.5) * n.depth, 0, Math.PI * 2);
```

- [ ] **Step 5: Verify build + reduced-motion**

Run: `npm run build`
Expected: passes. Then `npm run dev`: scrolling shows disperse → lattice (~mid) → settled with subtle mouse parallax and depth. Toggle OS "Reduce motion" and reload: static formation, no pointer response.

- [ ] **Step 6: Commit**

```bash
git add components/NeuralNetwork.tsx
git commit -m "feat: depth and mouse parallax in network render"
```

---

## Task 9: Nav dedupe + designed empty states

**Files:**
- Modify: `lib/content.ts`, `components/ComingSoon.tsx`

**Interfaces:**
- Consumes: `Button` (Task 3), `Section` (Task 4).
- Produces: `content.nav.links` with no duplicate destinations.

- [ ] **Step 1: Dedupe nav links in `lib/content.ts`**

Replace the `nav.links` array so no two links point to the same place and every link leads somewhere real:

```ts
  nav: {
    links: [
      { label: "Team", href: "/team" },
      { label: "Blog", href: "/blog" },
      { label: "Get Involved", href: "/get-involved" },
    ],
  },
```

(`Contact` was a duplicate of `/get-involved`; the footer already surfaces the email, so it is removed from the primary nav.)

- [ ] **Step 2: Redesign the empty state**

Replace `components/ComingSoon.tsx` body so "coming soon" reads as deliberate — a labeled eyebrow, display headline, body, and a real way out (back to home) via `Button`:

```tsx
import PageShell from "@/components/PageShell";
import Button from "@/components/ui/Button";

/** Designed empty state for sections that aren't built yet (Team, Blog). */
export default function ComingSoon({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <PageShell>
      <p className="text-xs font-medium uppercase tracking-[0.35em] text-accent">
        Coming soon
      </p>
      <h1 className="font-display mt-5 text-5xl font-semibold tracking-tight text-navy md:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-navy/70">
        {body}
      </p>
      <Button href="/get-involved" variant="secondary" className="mt-10">
        Get involved instead
      </Button>
    </PageShell>
  );
}
```

- [ ] **Step 3: Verify tests + build**

Run: `npm test && npm run build`
Expected: pass. If any test asserts the old 4-item nav or a `Contact` nav link, update it to the new 3-item set in this commit.

- [ ] **Step 4: Commit**

```bash
git add lib/content.ts components/ComingSoon.tsx
git commit -m "feat: dedupe nav and add designed empty state"
```

---

## Task 10 (OPTIONAL): Homepage "what we do" value-strip

Build this only if the light-content addition is wanted (see spec — default: build it).

**Files:**
- Modify: `lib/content.ts`, `app/page.tsx`
- Create: `components/ValueStrip.tsx`

**Interfaces:**
- Consumes: `Section` (Task 4), `content.home.values`.

- [ ] **Step 1: Add copy to `lib/content.ts`**

Add a `home` key (place near `intro`):

```ts
  home: {
    values: [
      {
        title: "Design",
        body: "We turn messy decision problems into clear, usable interfaces.",
      },
      {
        title: "Build",
        body: "We prototype and ship data-driven systems end to end.",
      },
      {
        title: "Teach",
        body: "We learn in the open and bring new members up to speed fast.",
      },
    ],
  },
```

- [ ] **Step 2: Create `components/ValueStrip.tsx`**

```tsx
import Section from "@/components/ui/Section";
import content from "@/lib/content";

export default function ValueStrip() {
  return (
    <Section
      as="section"
      className="grid gap-8 border-t border-navy/10 bg-offwhite/85 py-16 backdrop-blur-sm md:grid-cols-3 md:py-20"
    >
      {content.home.values.map((v) => (
        <div key={v.title}>
          <h3 className="font-display text-lg font-semibold tracking-tight text-navy">
            {v.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-navy/70">{v.body}</p>
        </div>
      ))}
    </Section>
  );
}
```

- [ ] **Step 3: Mount it in `app/page.tsx`**

Import and place `<ValueStrip />` between the pinned scroll `</div>` and `<Footer />`:

```tsx
import ValueStrip from "@/components/ValueStrip";
```
```tsx
      </div>

      <ValueStrip />
      <Footer />
```

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: passes; the strip appears after the scroll transition, above the footer, sharing the standard container.

- [ ] **Step 5: Commit**

```bash
git add lib/content.ts components/ValueStrip.tsx app/page.tsx
git commit -m "feat: add homepage what-we-do value strip"
```

---

## Final verification

- [ ] `npm test` — all Vitest suites pass.
- [ ] `npm run build` — clean production build, no type errors.
- [ ] `npm run dev` — manual pass: hero → lattice → settled scroll reads as a deliberate multi-stage sequence with depth + mouse parallax; consistent gutters/type; nav links all resolve; empty states look intentional.
- [ ] OS "Reduce motion" on → reload: single static formation, no scrub, no pointer parallax.
- [ ] Mobile width (~375px): headings scale down, containers keep gutters, value-strip stacks.

## Spec Coverage Map

- Work Area 1 (design system) → Tasks 1, 2, 3, 4, 5.
- Work Area 2 (spacing/type rhythm) → Task 6.
- Work Area 3 (signature scroll animation) → Tasks 7, 8.
- Work Area 4 (empty feeling / nav dedupe / optional value-strip) → Tasks 9, 10.
