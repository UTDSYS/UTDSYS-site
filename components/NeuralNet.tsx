import type { CSSProperties, ReactNode } from "react";

/**
 * The hero's inline network: a compact feed-forward graph that reads left to
 * right as a sentence — a fan of input signals flows through a hidden layer
 * and converges, thickening, onto a single glowing DECISION node that sits
 * flush against the wordmark. It builds itself on load: nodes fire, edges
 * draw, the decision blooms.
 *
 * Everything derives from `--p` (0..1 build progress, played on a timed tween
 * by useIntroSequence) so all animation stays on the compositor:
 *   0.02+  the network fades up from faint
 *   0.10+  input nodes fire top-to-bottom
 *   0.20+  edges draw input → hidden (signals propagate)
 *   0.44+  the convergence: hidden → the single node draws thick
 *   0.56+  the DECISION node blooms and pulses
 *   0.64+  the wordmark resolves alongside it
 */

const VB_W = 320;
const VB_H = 210;

type Pt = { x: number; y: number };

const INPUTS: Pt[] = [24, 66, 108, 150, 186].map((y) => ({ x: 26, y }));
const HIDDEN: Pt[] = [62, 105, 148].map((y) => ({ x: 165, y }));
const DECISION: Pt = { x: 286, y: 105 };

function varStyle(vars: Record<string, string | number>) {
  return vars as CSSProperties;
}

/** A node: faint drafted circle + signal-lit overlay, gated by --d/--w. */
function Node({
  p,
  r,
  d,
  w,
  decision,
}: {
  p: Pt;
  r: number;
  d: number;
  w?: number;
  decision?: boolean;
}) {
  return (
    <g
      className={`nn-node${decision ? " is-decision" : ""}`}
      style={varStyle(w ? { "--d": d, "--w": w } : { "--d": d })}
    >
      <circle className="nn-node-base" cx={p.x} cy={p.y} r={r} />
      {decision && (
        <g className="nn-ping-wrap">
          <circle className="nn-ping" cx={p.x} cy={p.y} r={r} />
        </g>
      )}
      <circle className="nn-node-lit" cx={p.x} cy={p.y} r={r} />
    </g>
  );
}

/** An edge: faint drafted line + signal flood + optional running pulse. */
function Edge({
  a,
  b,
  td,
  tw,
  sw,
  pulse,
}: {
  a: Pt;
  b: Pt;
  td: number;
  tw?: number;
  sw?: number;
  pulse?: boolean;
}) {
  const d = `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  const vars: Record<string, string | number> = { "--td": td };
  if (tw) vars["--tw"] = tw;
  if (sw) vars["--sw"] = sw;
  return (
    <g className="nn-edge-group" style={varStyle(vars)}>
      <path className="nn-edge-base" d={d} />
      <path className="nn-edge" pathLength={1} d={d} />
      {pulse && <path className="nn-edge-pulse" pathLength={1} d={d} />}
    </g>
  );
}

export default function NeuralNet() {
  const edges: ReactNode[] = [];

  // input → hidden: signals propagate, drawing in top-to-bottom
  INPUTS.forEach((a, i) =>
    HIDDEN.forEach((b, j) =>
      edges.push(
        <Edge
          key={`ih-${i}-${j}`}
          a={a}
          b={b}
          td={0.2 + i * 0.014}
          tw={0.12}
          sw={1.3}
        />,
      ),
    ),
  );

  // hidden → decision: the convergence — thick, emphatic, into one node
  HIDDEN.forEach((a, i) =>
    edges.push(
      <Edge
        key={`hd-${i}`}
        a={a}
        b={DECISION}
        td={0.44 + i * 0.03}
        tw={0.13}
        sw={3.5}
        pulse
      />,
    ),
  );

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="nn-svg"
      role="img"
      aria-label="A feed-forward neural network: a fan of input signals flows through a hidden layer and converges on a single glowing decision node."
    >
      {/* edges under the nodes */}
      <g className="nn-edges">{edges}</g>

      {/* input layer */}
      {INPUTS.map((p, i) => (
        <Node key={`in-${i}`} p={p} r={7} d={0.1 + i * 0.02} w={0.05} />
      ))}

      {/* hidden layer */}
      {HIDDEN.map((p, i) => (
        <Node key={`hd-${i}`} p={p} r={9} d={0.3 + i * 0.02} w={0.05} />
      ))}

      {/* the decision */}
      <Node p={DECISION} r={17} d={0.56} w={0.08} decision />
    </svg>
  );
}
