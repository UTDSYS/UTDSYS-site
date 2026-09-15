import type { CSSProperties } from "react";
import content from "@/lib/content";
import { FEATURE_COUNT, HIDDEN_COUNT, W1, W2 } from "@/lib/quoting";

/**
 * The hero's inline network: a compact feed-forward graph that reads left to
 * right as a sentence — a rail of live market features flows through a hidden
 * layer and converges, thickening, onto a single glowing DECISION node that
 * sits flush against the wordmark.
 *
 * Two things drive it, and they compose:
 *
 *   `--build`  0..1 progress of the network's own assembly, derived from the
 *          intro's `--p` in CSS so the whole choreography stays on the
 *          compositor. Each node and edge below carries its own start (`--d`
 *          / `--td`) and span (`--w` / `--tw`) inside that window, so the
 *          graph builds in reading order rather than cross-fading in:
 *            0.00+  input nodes fire top-to-bottom
 *            0.16+  edges draw input → hidden (signals propagate)
 *            0.30+  the hidden layer lights
 *            0.52+  the convergence: hidden → the single node draws thick
 *            0.72+  the DECISION node lands, last
 *
 *          Edges carry `pathLength={1}`, which normalises every one of them
 *          to a single unit so one `stroke-dashoffset` value draws them all
 *          on at the same rate no matter how long they actually are.
 *
 *   `--a`  0..1 activation, written every frame by useQuotingNet from the
 *          real model in lib/quoting. It sets how brightly each node burns
 *          and how thickly each edge carries, so you can watch the decision
 *          route itself. Node positions follow their own activation too — the
 *          graph breathes with the data.
 *
 * This file is only the structure. Nothing here is stateful; the hook finds
 * these elements by their `data-qn` attributes.
 */

export const VB_W = 470;
export const VB_H = 232;

export const IN_X = 128;
export const HID_X = 288;
export const DEC_X = 416;
export const DEC_Y = 116;

export const IN_Y = [28, 72, 116, 160, 204];
export const HID_Y = [70, 116, 162];

/** How far a node travels across the full range of its activation. */
export const IN_SWING = 13;
export const HID_SWING = 8;

const line = (ax: number, ay: number, bx: number, by: number) =>
  `M ${ax} ${ay} L ${bx} ${by}`;

function varStyle(vars: Record<string, string | number>) {
  return vars as CSSProperties;
}

export default function NeuralNet() {
  const { features, hint } = content.hero.net;

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className="nn-svg"
      role="img"
      aria-label={content.hero.net.description}
    >
      <defs>
        {/* The bloom lives in the SVG rather than on the stage so it is
            anchored to the decision node itself — it lands in the right place
            and at the right size on every breakpoint, instead of a viewport
            radial that reads as a local glow on desktop and floods the whole
            screen on a phone. */}
        <radialGradient id="nn-bloom-grad">
          <stop offset="0%" stopColor="rgb(45 91 255)" stopOpacity="0.2" />
          <stop offset="45%" stopColor="rgb(45 91 255)" stopOpacity="0.07" />
          <stop offset="100%" stopColor="rgb(45 91 255)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle
        className="nn-bloom"
        cx={DEC_X}
        cy={DEC_Y}
        r={190}
        fill="url(#nn-bloom-grad)"
      />

      {/* edges under the nodes */}
      <g className="nn-edges">
        {/* input → hidden: signals propagate, drawing in top-to-bottom */}
        {Array.from({ length: FEATURE_COUNT }, (_, i) =>
          Array.from({ length: HIDDEN_COUNT }, (_, j) => {
            const d = line(IN_X, IN_Y[i], HID_X, HID_Y[j]);
            return (
              <g
                key={`ih-${i}-${j}`}
                className="nn-edge-group"
                style={varStyle({ "--td": 0.16 + i * 0.045, "--tw": 0.2, "--sw": 1.3 })}
              >
                <path className="nn-edge-base" d={d} data-qn="edge-base" />
                <path
                  className={`nn-edge${W1[j][i] < 0 ? " is-neg" : ""}`}
                  d={d}
                  pathLength={1}
                  data-qn="edge-ih"
                  data-i={i}
                  data-j={j}
                />
              </g>
            );
          }),
        )}

        {/* hidden → decision: the convergence — thick, emphatic, into one node */}
        {Array.from({ length: HIDDEN_COUNT }, (_, j) => {
          const d = line(HID_X, HID_Y[j], DEC_X, DEC_Y);
          return (
            <g
              key={`hd-${j}`}
              className="nn-edge-group"
              style={varStyle({ "--td": 0.52 + j * 0.05, "--tw": 0.22, "--sw": 3.5 })}
            >
              <path className="nn-edge-base" d={d} data-qn="edge-base" />
              <path
                className={`nn-edge${W2[j] < 0 ? " is-neg" : ""}`}
                d={d}
                pathLength={1}
                data-qn="edge-hd"
                data-j={j}
              />
              <path
                className="nn-edge-pulse"
                d={d}
                pathLength={1}
                data-qn="edge-hd-pulse"
                data-j={j}
              />
            </g>
          );
        })}
      </g>

      {/* input layer: each node is a live feature you can grab */}
      <g className="nn-nodes">
        {features.map((label, i) => (
          <g
            key={`in-${i}`}
            className="nn-input"
            data-qn="input"
            data-index={i}
            style={varStyle({ "--d": i * 0.06, "--w": 0.16 })}
            role="slider"
            tabIndex={0}
            aria-label={label}
            aria-valuemin={-100}
            aria-valuemax={100}
          >
            <line
              className="nn-track"
              x1={IN_X}
              x2={IN_X}
              y1={IN_Y[i] - IN_SWING - 4}
              y2={IN_Y[i] + IN_SWING + 4}
            />
            <text className="nn-rail-label" x={6} y={IN_Y[i] + 3}>
              {label}
            </text>
            <text
              className="nn-rail-value"
              x={IN_X - 22}
              y={IN_Y[i] + 3}
              textAnchor="end"
              data-qn="value"
            >
              &nbsp;
            </text>
            <circle className="nn-node-base" cx={IN_X} cy={IN_Y[i]} r={7} data-qn="node" />
            <circle className="nn-node-lit" cx={IN_X} cy={IN_Y[i]} r={7} data-qn="node" />
            <line
              className="nn-grip"
              x1={IN_X - 3.5}
              x2={IN_X + 3.5}
              y1={IN_Y[i]}
              y2={IN_Y[i]}
              data-qn="grip"
            />
            {/* a generous, invisible target so the whole row is grabbable */}
            <rect
              className="nn-hit"
              x={4}
              y={IN_Y[i] - 17}
              width={IN_X + 14}
              height={34}
              rx={6}
            />
          </g>
        ))}

        {/* hidden layer */}
        {HID_Y.map((y, j) => (
          <g
            key={`hd-${j}`}
            className="nn-hidden"
            data-qn="hidden"
            data-index={j}
            style={varStyle({ "--d": 0.3 + j * 0.05, "--w": 0.16 })}
          >
            <circle className="nn-node-base" cx={HID_X} cy={y} r={9} data-qn="node" />
            <circle className="nn-node-lit" cx={HID_X} cy={y} r={9} data-qn="node" />
          </g>
        ))}

        {/* the decision */}
        <g
          className="nn-decision"
          data-qn="decision"
          style={varStyle({ "--d": 0.72, "--w": 0.26 })}
        >
          <g className="nn-ping-wrap">
            <circle className="nn-ping" cx={DEC_X} cy={DEC_Y} r={17} />
          </g>
          <circle className="nn-node-base" cx={DEC_X} cy={DEC_Y} r={17} />
          <circle className="nn-node-lit" cx={DEC_X} cy={DEC_Y} r={17} data-qn="decision-lit" />
        </g>
      </g>

      <text className="nn-hint" x={6} y={VB_H - 2} data-qn="hint">
        {hint.pointer}
      </text>
    </svg>
  );
}
