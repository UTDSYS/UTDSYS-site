"use client";

import { useEffect, useRef, useState } from "react";

// Annualised covariance of XLE, XLF and XLK, monthly excess returns
// Sep 2021 – Aug 2026 (the research repo's ETF panel).
const S = [
  [0.06876, 0.0218, -0.00032],
  [0.0218, 0.03109, 0.01922],
  [-0.00032, 0.01922, 0.05824],
];

// Two free weights x = (Energy, Financials); Technology takes the rest, so
// w = a + Bx with a = (0, 0, 1) and B = [[1, 0], [0, 1], [-1, -1]].
const weights = (x: number[]) => [x[0], x[1], 1 - x[0] - x[1]];
const variance = (x: number[]) => {
  const w = weights(x);
  return w.reduce((s, wi, i) => s + wi * w.reduce((t, wj, j) => t + S[i][j] * wj, 0), 0);
};

// The quadratic form in x: f(x) = f* + (x − x*)ᵀ M (x − x*), with M = BᵀΣB.
const M = [
  [S[0][0] - 2 * S[0][2] + S[2][2], S[0][1] - S[0][2] - S[1][2] + S[2][2]],
  [S[0][1] - S[0][2] - S[1][2] + S[2][2], S[1][1] - 2 * S[1][2] + S[2][2]],
];
const det = M[0][0] * M[1][1] - M[0][1] ** 2;
// minimiser: M x* = −Bᵀ Σ a
const c = [S[0][2] - S[2][2], S[1][2] - S[2][2]];
const XS = [-(M[1][1] * c[0] - M[0][1] * c[1]) / det, -(-M[0][1] * c[0] + M[0][0] * c[1]) / det];
const FMIN = variance(XS);
const grad = (x: number[]) => {
  const d = [x[0] - XS[0], x[1] - XS[1]];
  return [2 * (M[0][0] * d[0] + M[0][1] * d[1]), 2 * (M[0][1] * d[0] + M[1][1] * d[1])];
};
const tr = M[0][0] + M[1][1];
const LMAX = tr / 2 + Math.sqrt(tr ** 2 / 4 - det);
// A step just short of the stable limit, so the descent zigzags across the valley.
const ETA = 0.9 / LMAX;

// Cholesky of M, for drawing level sets: x − x* = √c · L⁻ᵀu.
const L11 = Math.sqrt(M[0][0]);
const L21 = M[0][1] / L11;
const L22 = Math.sqrt(M[1][1] - L21 ** 2);
const level = (cc: number, t: number) => {
  const u = [Math.cos(t) * Math.sqrt(cc), Math.sin(t) * Math.sqrt(cc)];
  const y1 = u[1] / L22;
  return [XS[0] + (u[0] - L21 * y1) / L11, XS[1] + y1];
};

// The plotted square: x* ± SPAN in each weight.
const SPAN = 0.6;
const FMAX = Math.max(
  ...[-1, 1].flatMap((i) => [-1, 1].map((j) => variance([XS[0] + i * SPAN, XS[1] + j * SPAN]))),
);
const height = (x: number[]) => (variance(x) - FMIN) / (FMAX - FMIN);
const toUnit = (x: number[]) => [(x[0] - XS[0]) / SPAN, (x[1] - XS[1]) / SPAN];
const fromUnit = (u: number[]) => [XS[0] + u[0] * SPAN, XS[1] + u[1] * SPAN];

const GRID = 24;
const FLOOR = -0.28;
const LEVELS = [0.02, 0.07, 0.16, 0.3, 0.5, 0.76];
// On the blue band: white wireframe, lighter blue for the contours and the path.
const LINE = "255 255 255";
const SIGNAL = "122 162 255";

/** The variance surface of three sector ETFs, with gradient descent rolling to the lowest-volatility mix. */
export default function VarianceSurface({ label }: { label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const el = wrap.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0;
    let H = 0;
    const size = () => {
      const r = el.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width;
      H = r.height;
      cv.width = W * dpr;
      cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);

    // view: yaw drifts slowly; the pointer leans it a little
    const view = { yaw: 0.75, pitch: 0.55, tx: 0, ty: 0, px: 0, py: 0 };
    const project = (u: number[], y: number) => {
      const s = Math.min(W * 0.36, H * 0.5);
      const yaw = view.yaw + view.px * 0.35;
      const pitch = view.pitch + view.py * 0.12;
      const X = u[0] * Math.cos(yaw) - u[1] * Math.sin(yaw);
      const Z = u[0] * Math.sin(yaw) + u[1] * Math.cos(yaw);
      return {
        x: W / 2 + X * s,
        y: H * 0.6 - (Z * Math.sin(pitch) + y * 0.8 * Math.cos(pitch)) * s,
        depth: Z * Math.cos(pitch) - y * Math.sin(pitch),
      };
    };

    // the descent: a start on the rim, then one gradient step at a time
    const start = (k: number) => {
      const t = k * 2.39996 + 0.6; // golden angle, so starts never repeat
      return fromUnit([Math.cos(t) * 0.92, Math.sin(t) * 0.92]);
    };
    const descend = (x0: number[]) => {
      const p = [x0];
      for (let i = 0; i < 80; i++) {
        const x = p[p.length - 1];
        const g = grad(x);
        const nx = [x[0] - ETA * g[0], x[1] - ETA * g[1]];
        p.push(nx);
        const u = toUnit(nx);
        if (Math.hypot(u[0], u[1]) < 0.004) break;
      }
      return p;
    };
    let run = 0;
    let path = descend(start(run));
    let clock = 0; // steps along the path, fractional
    let hold = 0;

    const line = (pts: { x: number; y: number }[], stroke: string, width = 1, dash: number[] = []) => {
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.setLineDash(dash);
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.setLineDash([]);
    };
    const at = (k: number) => {
      const i = Math.min(Math.floor(k), path.length - 1);
      const j = Math.min(i + 1, path.length - 1);
      const f = k - Math.floor(k);
      // ease within each step so the point visibly lands on each iterate
      const e = f < 1 ? 1 - (1 - f) ** 3 : 1;
      return [path[i][0] + (path[j][0] - path[i][0]) * e, path[i][1] + (path[j][1] - path[i][1]) * e];
    };

    const draw = (fade: number) => {
      ctx.clearRect(0, 0, W, H);

      // floor: the square and its level sets
      const corners = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
        [-1, -1],
      ].map((u) => project(u, FLOOR));
      line(corners, `rgb(${LINE} / 0.12)`);
      for (const h of LEVELS) {
        const cc = h * (FMAX - FMIN);
        const pts = [];
        for (let t = 0; t <= 96; t++) {
          const u = toUnit(level(cc, (t / 96) * Math.PI * 2));
          if (Math.abs(u[0]) > 1 || Math.abs(u[1]) > 1) {
            if (pts.length > 1) line(pts, `rgb(${SIGNAL} / 0.35)`);
            pts.length = 0;
            continue;
          }
          pts.push(project(u, FLOOR));
        }
        if (pts.length > 1) line(pts, `rgb(${SIGNAL} / 0.35)`);
      }

      // surface: a wireframe of σ²(w), far lines fainter
      for (let dir = 0; dir < 2; dir++) {
        for (let i = 0; i <= GRID; i++) {
          const a = -1 + (2 * i) / GRID;
          const pts = [];
          let depth = 0;
          for (let j = 0; j <= 40; j++) {
            const b = -1 + (2 * j) / 40;
            const u = dir ? [a, b] : [b, a];
            const p = project(u, height(fromUnit(u)));
            depth += p.depth;
            pts.push(p);
          }
          const front = 0.5 - depth / 41 / 2.4;
          line(pts, `rgb(${LINE} / ${(0.06 + 0.2 * Math.max(0, Math.min(1, front))).toFixed(3)})`, 0.9);
        }
      }

      // the minimiser, on the floor and on the surface
      const m0 = project([0, 0], FLOOR);
      const m1 = project([0, 0], 0);
      line([m0, m1], `rgb(${SIGNAL} / 0.35)`, 1, [2, 3]);
      ctx.beginPath();
      ctx.arc(m0.x, m0.y, 3, 0, Math.PI * 2);
      ctx.strokeStyle = `rgb(${SIGNAL} / 0.8)`;
      ctx.stroke();

      // the descent so far: its shadow on the floor, then the path itself
      const n = Math.floor(clock);
      const trail = [...path.slice(0, n + 1), at(clock)];
      line(
        trail.map((x) => project(toUnit(x), FLOOR)),
        `rgb(${SIGNAL} / ${0.35 * fade})`,
        1,
        [3, 3],
      );
      line(
        trail.map((x) => project(toUnit(x), height(x))),
        `rgb(${SIGNAL} / ${0.95 * fade})`,
        1.8,
      );
      for (const x of path.slice(0, n + 1)) {
        const p = project(toUnit(x), height(x));
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${SIGNAL} / ${0.8 * fade})`;
        ctx.fill();
      }
      const x = at(clock);
      const head = project(toUnit(x), height(x));
      const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 14);
      glow.addColorStop(0, `rgb(${SIGNAL} / ${0.45 * fade})`);
      glow.addColorStop(1, `rgb(${SIGNAL} / 0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(head.x - 14, head.y - 14, 28, 28);
      ctx.beginPath();
      ctx.arc(head.x, head.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${SIGNAL} / ${fade})`;
      ctx.fill();
      ctx.strokeStyle = `rgb(${LINE} / ${fade})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    if (reduce) {
      clock = path.length - 1;
      draw(1);
      return () => ro.disconnect();
    }

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      view.tx = (e.clientX - r.left) / r.width - 0.5;
      view.ty = (e.clientY - r.top) / r.height - 0.5;
    };
    const leave = () => {
      view.tx = 0;
      view.ty = 0;
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);

    let raf = 0;
    let last = performance.now();
    let t = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden || pausedRef.current) return;
      t += dt;
      view.yaw = 0.75 + 0.22 * Math.sin(t * 0.18);
      view.px += (view.tx - view.px) * 0.05;
      view.py += (view.ty - view.py) * 0.05;

      let fade = 1;
      if (clock < path.length - 1) {
        clock = Math.min(path.length - 1, clock + dt * 3.2);
      } else {
        hold += dt;
        fade = Math.max(0, 1 - Math.max(0, hold - 1.6) / 0.6);
        if (hold > 2.3) {
          run += 1;
          path = descend(start(run));
          clock = 0;
          hold = 0;
        }
      }
      draw(fade);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={wrap} className="relative aspect-[5/4] w-full">
      <canvas
        ref={canvas}
        role="img"
        aria-label={label}
        className="absolute inset-0 h-full w-full"
      />
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Play animation" : "Pause animation"}
        className="absolute bottom-0 right-0 inline-flex h-7 w-7 items-center justify-center border border-white/15 text-white/50 transition hover:border-white/40 hover:text-white motion-reduce:hidden"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" fill="currentColor">
          {paused ? <path d="M2 1l7 4-7 4z" /> : <path d="M2 1h2v8H2zM6 1h2v8H6z" />}
        </svg>
      </button>
    </div>
  );
}
