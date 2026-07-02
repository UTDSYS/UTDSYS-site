"use client";

import { useEffect, useRef } from "react";
import type { MotionValue } from "framer-motion";
import {
  createNodes,
  createEdges,
  nodePosition,
  clamp01,
  type NetNode,
} from "@/lib/network/model";

const NODE_COUNT = 78;
const SEED = 20260701;
const NEIGHBORS = 3;
const NAVY = "27, 42, 74"; // #1B2A4A as rgb channels

export default function NeuralNetwork({
  progress,
}: {
  // Optional: the home page drives the scroll morph; sub-pages omit it and get
  // a calm, settled animated backdrop (progress pinned at 1).
  progress?: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const getProgress = () => (progress ? progress.get() : 1);
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
    resize();

    // Position of a node in px, with idle drift and a mid-transition pull
    // toward the center (`surge` peaks at progress 0.5).
    const point = (n: NetNode, p: number, t: number, surge: number) => {
      const base = nodePosition(n, p);
      const amp = reduce ? 0 : 0.006;
      const conv = surge * 0.06;
      const x = base.x + (0.5 - base.x) * conv;
      const y = base.y + (0.5 - base.y) * conv;
      return {
        x: (x + Math.cos(t * 0.4 + n.driftPhase) * amp) * w,
        y: (y + Math.sin(t * 0.4 + n.driftPhase) * amp) * h,
      };
    };

    // Render one frame. `surge` (0→1→0 across the scroll) intensifies the
    // network mid-transition: brighter edges, faster/multiplied signal pulses,
    // stronger node glow, and a gentle convergence — the "cool" moment.
    const draw = (t: number) => {
      const p = getProgress();
      const surge = reduce ? 0 : Math.sin(clamp01(p) * Math.PI);
      ctx.clearRect(0, 0, w, h);

      ctx.lineWidth = 1 + surge * 0.6;
      for (const e of edges) {
        const a = point(nodes[e.a], p, t, surge);
        const b = point(nodes[e.b], p, t, surge);
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const base = Math.max(0, 0.2 - dist / (Math.max(w, h) * 4));
        if (base <= 0) continue;
        const alpha = Math.min(0.75, base * (1 + surge * 1.8));
        ctx.strokeStyle = `rgba(${NAVY}, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        if (!reduce) {
          // One idle pulse; a second, faster pulse fades in during the surge.
          const pulses = surge > 0.15 ? 2 : 1;
          for (let k = 0; k < pulses; k++) {
            const speed = 0.25 + surge * 0.7;
            const offset = k * 0.5;
            const prog = (t * speed + (e.a + e.b) * 0.11 + offset) % 1;
            const px = a.x + (b.x - a.x) * prog;
            const py = a.y + (b.y - a.y) * prog;
            const pa = Math.min(0.7, base * 3 * (1 + surge * 1.5));
            ctx.fillStyle = `rgba(${NAVY}, ${k === 0 ? pa : pa * surge})`;
            ctx.beginPath();
            ctx.arc(px, py, 1.6 + surge * 1.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      for (const n of nodes) {
        const q = point(n, p, t, surge);
        ctx.fillStyle = `rgba(${NAVY}, ${0.12 + surge * 0.16})`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, n.radius * (3 + surge * 4), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${NAVY}, 0.9)`;
        ctx.beginPath();
        ctx.arc(q.x, q.y, n.radius * (1 + surge * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Reduced motion: no continuous animation. Draw a static frame and only
    // redraw when the scroll morph or the viewport size changes.
    if (reduce) {
      const redraw = () => draw(0);
      const onResizeStatic = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        resize();
        redraw();
      };
      redraw();
      const unsubscribe = progress?.on("change", redraw);
      window.addEventListener("resize", onResizeStatic);
      return () => {
        unsubscribe?.();
        window.removeEventListener("resize", onResizeStatic);
      };
    }

    // Full motion: animate on requestAnimationFrame, paused while the tab is
    // hidden.
    const frame = (ms: number) => {
      if (paused) return;
      draw(ms / 1000);
      raf = requestAnimationFrame(frame);
    };
    const onResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
    };
    const onVisibility = () => {
      paused = document.hidden;
      if (!paused) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(frame);
      }
    };
    window.addEventListener("resize", onResize);
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
