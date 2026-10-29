"use client";

import { useEffect, useRef } from "react";
import etf from "@/lib/data/etf-daily-returns.json";

type V = [number, number, number];
type Mat = number[][]; // 3×3, row-major

// Daily returns of XLE, XLF and XLK, Sep 2021 – Aug 2026 (the research repo's
// ETF panel), demeaned, with their covariance and its eigendecomposition.
const raw = etf.returns as V[];
const mean = [0, 1, 2].map((i) => raw.reduce((s, r) => s + r[i], 0) / raw.length);
const X = raw.map((r) => r.map((v, i) => v - mean[i]) as V);
const COV = [0, 1, 2].map((i) => [0, 1, 2].map((j) => X.reduce((s, r) => s + r[i] * r[j], 0) / (X.length - 1)));

const mul = (A: Mat, B: Mat) => A.map((r) => B[0].map((_, j) => r.reduce((s, v, k) => s + v * B[k][j], 0)));
const T = (A: Mat) => A[0].map((_, j) => A.map((r) => r[j]));
const app = (A: Mat, v: number[]) => A.map((r) => r[0] * v[0] + r[1] * v[1] + r[2] * v[2]) as V;
const I3: Mat = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];
const det = (A: Mat) =>
  A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
  A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
  A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);

// Jacobi eigendecomposition: COV = V diag(λ) Vᵀ.
const eig = (S: Mat) => {
  const A = S.map((r) => [...r]);
  let V = I3.map((r) => [...r]);
  for (let sweep = 0; sweep < 30; sweep++) {
    for (const [p, q] of [
      [0, 1],
      [0, 2],
      [1, 2],
    ]) {
      if (Math.abs(A[p][q]) < 1e-14) continue;
      const th = 0.5 * Math.atan2(2 * A[p][q], A[q][q] - A[p][p]);
      const c = Math.cos(th);
      const s = Math.sin(th);
      const J = I3.map((r) => [...r]);
      J[p][p] = c;
      J[q][q] = c;
      J[p][q] = s;
      J[q][p] = -s;
      const B = mul(mul(T(J), A), J);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) A[i][j] = B[i][j];
      V = mul(V, J);
    }
  }
  return { values: [0, 1, 2].map((i) => A[i][i]), vectors: V };
};
const { values: LAM0, vectors: V0 } = eig(COV);

// Order and sign the eigenvectors so the rotation onto them is proper and as
// short as possible; each principal component then lands on the nearest axis.
const PERMS = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];
const angleOf = (R: Mat) => Math.acos(Math.max(-1, Math.min(1, (R[0][0] + R[1][1] + R[2][2] - 1) / 2)));
let best = { Q: I3, lam: LAM0, angle: Infinity };
for (const perm of PERMS) {
  for (let m = 0; m < 8; m++) {
    const Q = [0, 1, 2].map((i) => perm.map((k, c) => V0[i][k] * ((m >> c) & 1 ? -1 : 1)));
    if (det(Q) < 0) continue;
    const angle = angleOf(T(Q));
    if (angle < best.angle) best = { Q, lam: perm.map((k) => LAM0[k]), angle };
  }
}
const { Q, lam: LAM, angle: THETA } = best;
const R1 = T(Q); // into principal components
// axis of R1, for turning by a fraction of it (Rodrigues)
const AXIS = (() => {
  const v = [R1[2][1] - R1[1][2], R1[0][2] - R1[2][0], R1[1][0] - R1[0][1]];
  const n = Math.hypot(...v) || 1;
  return v.map((x) => x / n);
})();
const turn = (t: number): Mat => {
  const [x, y, z] = AXIS;
  const K = [
    [0, -z, y],
    [z, 0, -x],
    [-y, x, 0],
  ];
  const K2 = mul(K, K);
  const a = Math.sin(t * THETA);
  const b = 1 - Math.cos(t * THETA);
  return I3.map((r, i) => r.map((v, j) => v + a * K[i][j] + b * K2[i][j]));
};

// Scaled so the widest direction has unit standard deviation; whitening then
// takes every direction to unit standard deviation.
const LMAX = Math.max(...LAM);
const Y = X.map((r) => r.map((v) => v / Math.sqrt(LMAX)) as V);
const D = LAM.map((l) => Math.sqrt(LMAX / l));
// The few days beyond 4.5σ (Mahalanobis) are left out of the picture.
const POINTS = Y.filter((y) => {
  const z = app(R1, y);
  return Math.hypot(z[0] * D[0], z[1] * D[1], z[2] * D[2]) < 4.5;
});

const scale = (t: number): Mat => I3.map((r, i) => r.map((v) => v * (1 + (D[i] - 1) * t)));
const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

// The cycle: returns as they are → turned onto their principal components →
// whitened into a sphere → and back. Seconds per phase.
const PHASES: [number, (t: number) => Mat][] = [
  [1.8, () => I3],
  [2.6, (t) => turn(ease(t))],
  [1.0, () => R1],
  [2.2, (t) => mul(scale(ease(t)), R1)],
  [2.2, () => mul(scale(1), R1)],
  [1.8, (t) => mul(scale(1 - ease(t)), R1)],
  [2.2, (t) => turn(1 - ease(t))],
];
const CYCLE = PHASES.reduce((s, [d]) => s + d, 0);
const at = (time: number) => {
  let t = time % CYCLE;
  for (const [d, f] of PHASES) {
    if (t < d) return f(t / d);
    t -= d;
  }
  return I3;
};

// the asset lattice: a cube on the ETF axes, 2σ of the widest direction
const C = 2;
const LATTICE: [V, V][] = [];
for (const u of [-C, 0, C])
  for (const v of [-C, 0, C]) {
    LATTICE.push([[-C, u, v], [C, u, v]]);
    LATTICE.push([[u, -C, v], [u, C, v]]);
    LATTICE.push([[u, v, -C], [u, v, C]]);
  }
// the 2σ covariance ellipsoid, as its three principal sections
const RINGS = [
  [0, 1],
  [0, 2],
  [1, 2],
].map(([i, j]) =>
  Array.from({ length: 97 }, (_, k) => {
    const t = (k / 96) * Math.PI * 2;
    const z = [0, 0, 0];
    z[i] = Math.cos(t) * 2 * Math.sqrt(LAM[i] / LMAX);
    z[j] = Math.sin(t) * 2 * Math.sqrt(LAM[j] / LMAX);
    return app(Q, z);
  }),
);

// On the blue band: white lattice and axes, lighter blue for the data.
const LINE = "255 255 255";
const SIGNAL = "122 162 255";

/** Five years of daily ETF returns, turned onto their principal components and whitened into a sphere. */
export default function MatrixTransform({ label }: { label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

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

    // view: yaw turns slowly
    const view = { yaw: 0.6, pitch: 0.42 };
    const project = (v: number[]) => {
      const s = Math.min(W, H) * 0.13;
      const { yaw, pitch } = view;
      const X = v[0] * Math.cos(yaw) - v[1] * Math.sin(yaw);
      const Dp = v[0] * Math.sin(yaw) + v[1] * Math.cos(yaw);
      return {
        x: W / 2 + X * s,
        y: H / 2 - (v[2] * Math.cos(pitch) + Dp * Math.sin(pitch)) * s,
        depth: Dp * Math.cos(pitch) - v[2] * Math.sin(pitch),
      };
    };
    const path = (pts: number[][], stroke: string, width = 1) => {
      ctx.beginPath();
      pts.forEach((v, i) => {
        const p = project(v);
        if (i) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
      });
      ctx.strokeStyle = stroke;
      ctx.lineWidth = width;
      ctx.stroke();
    };

    const draw = (A: Mat) => {
      ctx.clearRect(0, 0, W, H);

      // the lattice, carried along by the transformation
      for (const [a, b] of LATTICE) {
        const edge = Math.abs(a[0]) + Math.abs(a[1]) + Math.abs(a[2]) === 3 * C ? 0.2 : 0.08;
        path([app(A, a), app(A, b)], `rgb(${LINE} / ${edge})`);
      }

      // the returns, one point a day, nearer points brighter
      for (const y of POINTS) {
        const p = project(app(A, y));
        const a = 0.28 + 0.5 * Math.max(0, Math.min(1, 0.5 - p.depth / 6));
        ctx.fillStyle = `rgb(${SIGNAL} / ${a.toFixed(2)})`;
        ctx.fillRect(p.x - 0.9, p.y - 0.9, 1.8, 1.8);
      }

      // the covariance ellipsoid, which whitening makes a sphere
      for (const ring of RINGS) path(ring.map((v) => app(A, v)), `rgb(${SIGNAL} / 0.85)`, 1.4);

      // the three ETF directions: the matrix's columns
      const o = project([0, 0, 0]);
      for (let i = 0; i < 3; i++) {
        const e = [0, 0, 0];
        e[i] = C;
        const p = project(app(A, e));
        ctx.beginPath();
        ctx.moveTo(o.x, o.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgb(${LINE} / 0.9)`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${LINE})`;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(o.x, o.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${LINE})`;
      ctx.fill();
    };

    if (reduce) {
      draw(R1);
      const redraw = new ResizeObserver(() => draw(R1));
      redraw.observe(el);
      return () => {
        ro.disconnect();
        redraw.disconnect();
      };
    }

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    let raf = 0;
    let last = performance.now();
    let time = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!visible || document.hidden) return;
      time += dt;
      view.yaw = 0.6 + time * 0.12;
      draw(at(time));
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  return (
    <div ref={wrap} className="relative aspect-[5/4] w-full overflow-hidden">
      <canvas
        ref={canvas}
        role="img"
        aria-label={label}
        className="absolute inset-0 h-full w-full [mask-image:radial-gradient(closest-side,black_72%,transparent)]"
      />
    </div>
  );
}
