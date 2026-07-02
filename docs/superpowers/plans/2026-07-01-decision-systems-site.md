# UofT Decision Systems Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js marketing site for UofT Decision Systems with an animated neural-network landing screen that reorganizes into the main page as the visitor scrolls.

**Architecture:** Next.js App Router (single page). A fixed full-viewport Canvas 2D "neural network" renders behind all content. Framer Motion `useScroll` produces a normalized `progress` (0→1) across a 220vh transition zone; that value morphs node positions and cross-fades the Landing overlay into the Hero. A pure, unit-tested geometry module (`lib/network/model.ts`) owns node/edge math; the canvas component only draws.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS v4, Framer Motion, Vitest + @testing-library/react for tests.

## Global Constraints

- Package manager: **npm**. Node 22.
- Brand navy: **#1B2A4A**. Off-white background: **#F7F8FA**. Exposed as Tailwind theme colors `navy` and `offwhite` via `@theme` in `app/globals.css`.
- No `src/` directory. Path alias `@/*` → `./*` (create-next-app default).
- Org name is **"UofT Decision Systems"**, wordmark **"DSys"**. Never "Design Systems".
- All user-facing copy lives in `lib/content.ts` — components import from it, never hardcode strings.
- Respect `prefers-reduced-motion`: no idle drift / pulses when set (scroll morph may still apply).
- Commit after each task with the exact message shown.

---

### Task 1: Scaffold app, brand tokens, content, layout

**Files:**
- Create (scaffold): Next.js app in repo root via create-next-app
- Create: `lib/content.ts`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

**Interfaces:**
- Produces: `content` object (default of `lib/content.ts`) with shape used by all components:
  ```ts
  content.brand.name: string          // "DSys"
  content.brand.full: string          // "UofT Decision Systems"
  content.landing.tagline: string
  content.hero.headline: string
  content.hero.subhead: string
  content.hero.ctas: { label: string; href: string }[]   // exactly 2
  content.getInvolved.heading: string
  content.getInvolved.paragraphs: string[]
  content.getInvolved.cta: { label: string; href: string }
  content.contact.email: string
  content.contact.socials: { label: string; href: string }[]
  content.nav.links: { label: string; href: string }[]
  ```

- [ ] **Step 1: Scaffold the app**

Run (in repo root `/Users/ricedevice/Code/UTDSYS-Site`, which already contains `docs/` and `.git`):
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-npm --yes
```
Expected: scaffolds `app/`, `package.json`, `tsconfig.json`, `next.config.*`, Tailwind v4 wired via `app/globals.css`. If it warns the directory is not empty, allow it to proceed (it keeps `docs/`, `.git`, `.gitignore`).

- [ ] **Step 2: Add Framer Motion**

Run:
```bash
npm install framer-motion
```
Expected: `framer-motion` added to `package.json` dependencies.

- [ ] **Step 3: Write the content config**

Create `lib/content.ts`:
```ts
const content = {
  brand: {
    name: "DSys",
    full: "UofT Decision Systems",
  },
  landing: {
    tagline: "UofT · Decision Systems",
  },
  hero: {
    headline:
      "A student design team at UofT building intelligent decision systems.",
    subhead:
      "We design, prototype, and ship data-driven systems that help people make better decisions — and we teach each other how along the way.",
    ctas: [
      { label: "Join the Team", href: "#get-involved" },
      { label: "Contact", href: "#contact" },
    ],
  },
  getInvolved: {
    heading: "Get involved",
    paragraphs: [
      "Decision Systems is open to students across every faculty. Whether you build models, design interfaces, or just like hard problems, there's a place for you.",
      "No prior experience required — we run onboarding projects each term and pair newcomers with mentors. Applications open at the start of every semester.",
    ],
    cta: { label: "Apply to join", href: "mailto:hello@utdsys.ca" },
  },
  contact: {
    email: "hello@utdsys.ca",
    socials: [
      { label: "Instagram", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  nav: {
    links: [
      { label: "Get Involved", href: "#get-involved" },
      { label: "Contact", href: "#contact" },
    ],
  },
} as const;

export default content;
```

- [ ] **Step 4: Configure brand theme + globals**

Replace the entire contents of `app/globals.css` with:
```css
@import "tailwindcss";

@theme {
  --color-navy: #1b2a4a;
  --color-offwhite: #f7f8fa;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-offwhite);
  color: var(--color-navy);
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 5: Set metadata in layout**

In `app/layout.tsx`, replace the exported `metadata` object with:
```ts
export const metadata = {
  title: "UofT Decision Systems",
  description:
    "A student design team at the University of Toronto building intelligent decision systems.",
};
```
Leave the rest of `layout.tsx` as scaffolded (it already imports `./globals.css` and renders `{children}`).

- [ ] **Step 6: Minimal placeholder home**

Replace the entire contents of `app/page.tsx` with:
```tsx
import content from "@/lib/content";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-6xl font-semibold tracking-tight text-navy">
        {content.brand.name}
      </h1>
    </main>
  );
}
```

- [ ] **Step 7: Verify build passes**

Run:
```bash
npm run build
```
Expected: build completes with no type errors and no ESLint errors. The route `/` compiles.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with brand tokens and content config"
```

---

### Task 2: Neural-network geometry model (TDD)

**Files:**
- Create: `lib/network/model.ts`
- Create: `lib/network/model.test.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Produces (all exported from `lib/network/model.ts`):
  ```ts
  export interface Vec2 { x: number; y: number }
  export interface NetNode {
    id: number;
    landing: Vec2;   // normalized 0..1, dispersed layout
    settled: Vec2;   // normalized 0..1, main-page layout (center cleared)
    driftPhase: number; // 0..2π
    radius: number;     // px
  }
  export interface NetEdge { a: number; b: number } // node indices, a < b
  export function mulberry32(seed: number): () => number;
  export function clamp01(v: number): number;
  export function lerp(a: number, b: number, t: number): number;
  export function easeInOut(t: number): number;
  export function createNodes(count: number, seed: number): NetNode[];
  export function createEdges(nodes: NetNode[], neighbors: number): NetEdge[];
  export function nodePosition(node: NetNode, progress: number): Vec2;
  ```

- [ ] **Step 1: Install test tooling**

Run:
```bash
npm install -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom @testing-library/dom
```
Expected: devDependencies added.

- [ ] **Step 2: Add Vitest config and setup**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

Create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom";
```

Add a `test` script to `package.json` `"scripts"`:
```json
"test": "vitest run"
```

- [ ] **Step 3: Write the failing tests**

Create `lib/network/model.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  mulberry32,
  clamp01,
  lerp,
  easeInOut,
  createNodes,
  createEdges,
  nodePosition,
} from "./model";

describe("mulberry32", () => {
  it("is deterministic for a given seed", () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });
  it("returns values in [0,1)", () => {
    const r = mulberry32(7);
    for (let i = 0; i < 100; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("clamp01 / lerp / easeInOut", () => {
  it("clamp01 clamps to [0,1]", () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(clamp01(0.4)).toBe(0.4);
  });
  it("lerp interpolates", () => {
    expect(lerp(0, 10, 0)).toBe(0);
    expect(lerp(0, 10, 1)).toBe(10);
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
  it("easeInOut pins ends and passes midpoint", () => {
    expect(easeInOut(0)).toBe(0);
    expect(easeInOut(1)).toBe(1);
    expect(easeInOut(0.5)).toBeCloseTo(0.5, 5);
  });
});

describe("createNodes", () => {
  it("returns the requested count", () => {
    expect(createNodes(50, 1)).toHaveLength(50);
  });
  it("is deterministic per seed", () => {
    expect(createNodes(20, 99)).toEqual(createNodes(20, 99));
  });
  it("keeps positions within [0,1]", () => {
    for (const n of createNodes(80, 3)) {
      for (const p of [n.landing, n.settled]) {
        expect(p.x).toBeGreaterThanOrEqual(0);
        expect(p.x).toBeLessThanOrEqual(1);
        expect(p.y).toBeGreaterThanOrEqual(0);
        expect(p.y).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe("createEdges", () => {
  it("produces normalized, self-free edges", () => {
    const nodes = createNodes(30, 5);
    const edges = createEdges(nodes, 3);
    expect(edges.length).toBeGreaterThan(0);
    for (const e of edges) {
      expect(e.a).toBeLessThan(e.b);
      expect(e.a).toBeGreaterThanOrEqual(0);
      expect(e.b).toBeLessThan(nodes.length);
    }
  });
  it("has no duplicate edges", () => {
    const nodes = createNodes(30, 5);
    const edges = createEdges(nodes, 3);
    const keys = edges.map((e) => `${e.a}-${e.b}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("nodePosition", () => {
  const [node] = createNodes(1, 42);
  it("equals landing at progress 0", () => {
    expect(nodePosition(node, 0)).toEqual(node.landing);
  });
  it("equals settled at progress 1", () => {
    expect(nodePosition(node, 1)).toEqual(node.settled);
  });
  it("clamps out-of-range progress", () => {
    expect(nodePosition(node, -5)).toEqual(node.landing);
    expect(nodePosition(node, 5)).toEqual(node.settled);
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run:
```bash
npm test
```
Expected: FAIL — `Failed to resolve import "./model"` / functions not defined.

- [ ] **Step 5: Implement the model**

Create `lib/network/model.ts`:
```ts
export interface Vec2 {
  x: number;
  y: number;
}

export interface NetNode {
  id: number;
  landing: Vec2;
  settled: Vec2;
  driftPhase: number;
  radius: number;
}

export interface NetEdge {
  a: number;
  b: number;
}

// Deterministic PRNG so the network is identical across renders/SSR.
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Smoothstep easing.
export function easeInOut(t: number): number {
  return t * t * (3 - 2 * t);
}

export function createNodes(count: number, seed: number): NetNode[] {
  const rand = mulberry32(seed);
  const nodes: NetNode[] = [];
  for (let i = 0; i < count; i++) {
    // Landing: dispersed across the whole viewport.
    const lx = rand();
    const ly = rand();
    // Settled: pushed outward from center so the middle clears for text.
    const push = 1.28;
    const sx = clamp01(0.5 + (lx - 0.5) * push);
    const sy = clamp01(0.5 + (ly - 0.5) * push);
    nodes.push({
      id: i,
      landing: { x: lx, y: ly },
      settled: { x: sx, y: sy },
      driftPhase: rand() * Math.PI * 2,
      radius: 1.5 + rand() * 2,
    });
  }
  return nodes;
}

export function createEdges(nodes: NetNode[], neighbors: number): NetEdge[] {
  const seen = new Set<string>();
  const edges: NetEdge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const dists = nodes
      .map((n, j) => ({
        j,
        d:
          (n.settled.x - nodes[i].settled.x) ** 2 +
          (n.settled.y - nodes[i].settled.y) ** 2,
      }))
      .filter((o) => o.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, neighbors);
    for (const { j } of dists) {
      const a = Math.min(i, j);
      const b = Math.max(i, j);
      const key = `${a}-${b}`;
      if (!seen.has(key)) {
        seen.add(key);
        edges.push({ a, b });
      }
    }
  }
  return edges;
}

export function nodePosition(node: NetNode, progress: number): Vec2 {
  const t = easeInOut(clamp01(progress));
  return {
    x: lerp(node.landing.x, node.settled.x, t),
    y: lerp(node.landing.y, node.settled.y, t),
  };
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run:
```bash
npm test
```
Expected: PASS — all model tests green.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add tested neural-network geometry model"
```

---

### Task 3: NeuralNetwork canvas component

**Files:**
- Create: `components/NeuralNetwork.tsx`
- Create: `components/NeuralNetwork.test.tsx`

**Interfaces:**
- Consumes: `createNodes`, `createEdges`, `nodePosition`, `NetNode` from `@/lib/network/model`.
- Produces: `export default function NeuralNetwork({ progress }: { progress: MotionValue<number> }): JSX.Element` — renders a `<canvas aria-hidden>` fixed behind content.

- [ ] **Step 1: Write the failing smoke test**

Create `components/NeuralNetwork.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { motionValue } from "framer-motion";
import NeuralNetwork from "./NeuralNetwork";

describe("NeuralNetwork", () => {
  it("renders a decorative canvas without crashing", () => {
    const { container } = render(
      <NeuralNetwork progress={motionValue(0)} />,
    );
    const canvas = container.querySelector("canvas");
    expect(canvas).not.toBeNull();
    expect(canvas).toHaveAttribute("aria-hidden", "true");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- NeuralNetwork
```
Expected: FAIL — cannot resolve `./NeuralNetwork`.

- [ ] **Step 3: Implement the component**

Create `components/NeuralNetwork.tsx`:
```tsx
"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import {
  createNodes,
  createEdges,
  nodePosition,
  type NetNode,
} from "@/lib/network/model";

const NODE_COUNT = 78;
const SEED = 20260701;
const NEIGHBORS = 3;
const NAVY = "27, 42, 74"; // #1B2A4A as rgb channels

export default function NeuralNetwork({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const nodes = createNodes(NODE_COUNT, SEED);
    const edges = createEdges(nodes, NEIGHBORS);

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let paused = false;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
    };
    resize();
    window.addEventListener("resize", onResize);

    const point = (n: NetNode, p: number, t: number) => {
      const base = nodePosition(n, p);
      const amp = reduce ? 0 : 0.006;
      return {
        x: (base.x + Math.cos(t * 0.4 + n.driftPhase) * amp) * w,
        y: (base.y + Math.sin(t * 0.4 + n.driftPhase) * amp) * h,
      };
    };

    const frame = (ms: number) => {
      if (paused) return;
      const t = ms / 1000;
      const p = progress.get();
      ctx.clearRect(0, 0, w, h);

      ctx.lineWidth = 1;
      for (const e of edges) {
        const a = point(nodes[e.a], p, t);
        const b = point(nodes[e.b], p, t);
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const alpha = Math.max(0, 0.2 - dist / (Math.max(w, h) * 4));
        if (alpha <= 0) continue;
        ctx.strokeStyle = `rgba(${NAVY}, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        if (!reduce) {
          const pulse = (t * 0.25 + (e.a + e.b) * 0.11) % 1;
          const px = a.x + (b.x - a.x) * pulse;
          const py = a.y + (b.y - a.y) * pulse;
          ctx.fillStyle = `rgba(${NAVY}, ${Math.min(0.5, alpha * 3)})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (const n of nodes) {
        const q = point(n, p, t);
        ctx.fillStyle = `rgba(${NAVY}, 0.12)`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, n.radius * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${NAVY}, 0.9)`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    const onVisibility = () => {
      paused = document.hidden;
      if (!paused) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm test -- NeuralNetwork
```
Expected: PASS. (jsdom stubs canvas methods; the RAF loop is a no-op there but the component mounts and unmounts cleanly.)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add canvas neural-network background component"
```

---

### Task 4: Landing and Hero overlays

**Files:**
- Create: `components/Landing.tsx`
- Create: `components/Hero.tsx`

**Interfaces:**
- Consumes: `content` from `@/lib/content`; `MotionValue` from framer-motion.
- Produces:
  - `export default function Landing({ progress }: { progress: MotionValue<number> }): JSX.Element`
  - `export default function Hero({ progress }: { progress: MotionValue<number> }): JSX.Element`

- [ ] **Step 1: Implement Landing**

Create `components/Landing.tsx`:
```tsx
"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import content from "@/lib/content";

export default function Landing({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [0, 0.35], [1, 0]);
  const y = useTransform(progress, [0, 0.35], [0, -40]);
  const cueOpacity = useTransform(progress, [0, 0.15], [1, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      <h1 className="text-7xl font-semibold tracking-tight text-navy md:text-9xl">
        {content.brand.name}
      </h1>
      <p className="mt-5 text-xs uppercase tracking-[0.35em] text-navy/70 md:text-sm">
        {content.landing.tagline}
      </p>
      <motion.div
        style={{ opacity: cueOpacity }}
        className="absolute bottom-10 text-[0.7rem] uppercase tracking-[0.3em] text-navy/60"
      >
        Scroll ↓
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Implement Hero**

Create `components/Hero.tsx`:
```tsx
"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import content from "@/lib/content";

export default function Hero({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [0.45, 0.85], [0, 1]);
  const y = useTransform(progress, [0.45, 0.85], [40, 0]);
  const pointerEvents = useTransform(progress, (v) =>
    v > 0.6 ? "auto" : "none",
  );

  return (
    <motion.div
      style={{ opacity, y, pointerEvents }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
    >
      <h2 className="max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-navy md:text-5xl">
        {content.hero.headline}
      </h2>
      <p className="mt-6 max-w-xl text-base text-navy/70 md:text-lg">
        {content.hero.subhead}
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        {content.hero.ctas.map((cta, i) => (
          <a
            key={cta.label}
            href={cta.href}
            className={
              i === 0
                ? "rounded-full bg-navy px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
                : "rounded-full border border-navy/30 px-7 py-3 text-sm font-medium text-navy transition hover:border-navy"
            }
          >
            {cta.label}
          </a>
        ))}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 3: Verify build compiles**

Run:
```bash
npm run build
```
Expected: build succeeds (components are not yet mounted anywhere, but must type-check).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add Landing and Hero overlay components"
```

---

### Task 5: Nav, GetInvolved, and content smoke test

**Files:**
- Create: `components/Nav.tsx`
- Create: `components/GetInvolved.tsx`
- Create: `components/GetInvolved.test.tsx`

**Interfaces:**
- Consumes: `content` from `@/lib/content`; `MotionValue` from framer-motion.
- Produces:
  - `export default function Nav({ progress }: { progress: MotionValue<number> }): JSX.Element`
  - `export default function GetInvolved(): JSX.Element` — renders `#get-involved` section and `#contact` footer.

- [ ] **Step 1: Write the failing content test**

Create `components/GetInvolved.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GetInvolved from "./GetInvolved";
import content from "@/lib/content";

describe("GetInvolved", () => {
  it("renders the heading and CTA from content", () => {
    render(<GetInvolved />);
    expect(
      screen.getByRole("heading", { name: content.getInvolved.heading }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: content.getInvolved.cta.label }),
    ).toBeInTheDocument();
  });

  it("exposes get-involved and contact anchors", () => {
    const { container } = render(<GetInvolved />);
    expect(container.querySelector("#get-involved")).not.toBeNull();
    expect(container.querySelector("#contact")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:
```bash
npm test -- GetInvolved
```
Expected: FAIL — cannot resolve `./GetInvolved`.

- [ ] **Step 3: Implement GetInvolved**

Create `components/GetInvolved.tsx`:
```tsx
import content from "@/lib/content";

export default function GetInvolved() {
  return (
    <section className="relative bg-offwhite/85 backdrop-blur-sm">
      <div
        id="get-involved"
        className="mx-auto max-w-3xl px-6 py-28 md:py-36"
      >
        <h2 className="text-3xl font-semibold tracking-tight text-navy md:text-4xl">
          {content.getInvolved.heading}
        </h2>
        {content.getInvolved.paragraphs.map((p, i) => (
          <p
            key={i}
            className="mt-5 text-base leading-relaxed text-navy/75 md:text-lg"
          >
            {p}
          </p>
        ))}
        <a
          href={content.getInvolved.cta.href}
          className="mt-8 inline-block rounded-full bg-navy px-7 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {content.getInvolved.cta.label}
        </a>
      </div>

      <footer id="contact" className="border-t border-navy/10">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-navy">{content.brand.full}</p>
            <a
              href={`mailto:${content.contact.email}`}
              className="text-sm text-navy/70 transition hover:text-navy"
            >
              {content.contact.email}
            </a>
          </div>
          <div className="flex gap-5">
            {content.contact.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="text-sm text-navy/70 transition hover:text-navy"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run:
```bash
npm test -- GetInvolved
```
Expected: PASS.

- [ ] **Step 5: Implement Nav**

Create `components/Nav.tsx`:
```tsx
"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";
import content from "@/lib/content";

export default function Nav({
  progress,
}: {
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, [0.5, 0.9], [0, 1]);
  const pointerEvents = useTransform(progress, (v) =>
    v > 0.6 ? "auto" : "none",
  );

  return (
    <motion.nav
      style={{ opacity, pointerEvents }}
      className="fixed inset-x-0 top-0 z-20"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-semibold tracking-tight text-navy">
          {content.brand.name}
        </span>
        <div className="flex gap-6">
          {content.nav.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-navy/70 transition hover:text-navy"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Nav and GetInvolved sections with content test"
```

---

### Task 6: Compose the page, verify, document

**Files:**
- Modify: `app/page.tsx`
- Create: `README.md`

**Interfaces:**
- Consumes: `NeuralNetwork`, `Nav`, `Landing`, `Hero`, `GetInvolved` components; `useScroll` from framer-motion.

- [ ] **Step 1: Implement the page orchestration**

Replace the entire contents of `app/page.tsx` with:
```tsx
"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import NeuralNetwork from "@/components/NeuralNetwork";
import Nav from "@/components/Nav";
import Landing from "@/components/Landing";
import Hero from "@/components/Hero";
import GetInvolved from "@/components/GetInvolved";

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <main className="relative">
      <NeuralNetwork progress={scrollYProgress} />
      <Nav progress={scrollYProgress} />

      {/* Transition zone: 220vh of scroll morphs Landing → Hero */}
      <div ref={ref} className="relative h-[220vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <Landing progress={scrollYProgress} />
          <Hero progress={scrollYProgress} />
        </div>
      </div>

      <GetInvolved />
    </main>
  );
}
```

- [ ] **Step 2: Run the full test suite**

Run:
```bash
npm test
```
Expected: PASS — all model, NeuralNetwork, and GetInvolved tests green.

- [ ] **Step 3: Verify production build**

Run:
```bash
npm run build
```
Expected: build succeeds with no type or lint errors.

- [ ] **Step 4: Manual verification in the browser**

Run:
```bash
npm run dev
```
Then open http://localhost:3000 and confirm:
- Landing shows animated navy node network on off-white with "DSys" wordmark + "Scroll ↓" cue.
- Scrolling morphs the network (nodes spread outward, center clears) while "DSys" fades and the mission Hero fades in.
- Nav fades in during the transition; its links and the Hero CTAs scroll to `#get-involved` / `#contact`.
- The Get Involved section and contact footer render below with placeholder copy.
- With OS "Reduce Motion" enabled, pulses/drift stop but the scroll morph still works.

Stop the dev server when done (Ctrl-C).

- [ ] **Step 5: Write the README**

Create `README.md`:
```markdown
# UofT Decision Systems

Marketing site for UofT Decision Systems (DSys) — a student design team.
Built with Next.js (App Router), Tailwind CSS v4, and Framer Motion. The
landing screen renders an animated neural network (Canvas 2D) that
reorganizes into the main page as you scroll.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # Vitest unit + component tests
npm run build    # production build
```

## Editing content

All user-facing copy — headline, CTAs, get-involved text, contact details,
nav links — lives in `lib/content.ts`. Edit that one file; no component
changes needed.

## How it works

- `lib/network/model.ts` — pure, unit-tested node/edge geometry.
- `components/NeuralNetwork.tsx` — draws the network on a fixed canvas; reads
  scroll `progress` each frame to interpolate node positions.
- `app/page.tsx` — derives `progress` (0→1) from scroll via Framer Motion
  `useScroll` over a 220vh zone and cross-fades Landing → Hero.

Accessibility: respects `prefers-reduced-motion` (disables drift/pulses),
caps node count, and pauses the animation when the tab is hidden.
```

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: compose landing→main transition page and add README"
```

---

## Self-Review Notes

- **Spec coverage:** Landing/transition/Hero → Tasks 3–4, 6. Get-involved + contact → Task 5. Canvas 2D network + morph → Tasks 2–3. Scroll orchestration → Task 6. Brand tokens + content.ts → Task 1. Accessibility (reduced-motion, offscreen pause, node cap, dpr) → Task 3. Testing (model unit tests, component smoke, build) → Tasks 2, 3, 5, 6. All covered.
- **Type consistency:** `progress: MotionValue<number>` used consistently across NeuralNetwork/Landing/Hero/Nav; `nodePosition`/`createNodes`/`createEdges` signatures match between model, tests, and canvas component; `content` default-export shape defined in Task 1 matches all consumer usages.
- **No placeholders:** every code step contains full, runnable code; every command lists expected output.
