"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { TeamDivision, TeamMember } from "@/lib/content";

/**
 * The org chart drawn as the network the club is named for. It's mirrored
 * around a single DECISION node: each research desk's people feed their
 * lead, and both leads converge on the one call in the middle.
 *
 *   members → lead → DECISION ← lead ← members
 *
 * It builds outside-in like the hero — members fire, edges draw on, the leads
 * light, the decision lands last — then signal keeps running along every
 * path. Hovering or focusing anyone traces their whole chain to the decision.
 *
 * Layout is measured, not flowed: the stage tracks its own pixel width and
 * every node and edge is placed from the same coordinates, so lines always
 * run centre to centre. Wide screens read left/right into the middle; narrow
 * ones rotate the same graph to read top/bottom into the middle.
 */

type Pt = { x: number; y: number };
type Edge = { from: string; to: string; a: Pt; b: Pt; sw: number; open: boolean; delay: number };

// Build timeline (seconds).
const T = { members: 0.1, e1: 0.35, leads: 0.75, e2: 0.95, out: 1.3, live: 1.8 };

/** Place item i of n evenly in [lo, hi]. */
const spread = (n: number, i: number, lo: number, hi: number) =>
  lo + ((i + 0.5) / n) * (hi - lo);

function layout(w: number, horizontal: boolean) {
  if (horizontal) {
    const h = 780;
    const mid = (h - 80) / 2;
    // main axis is x: members | lead | decision | lead | members
    const main = [0.09, 0.3, 0.5, 0.7, 0.91].map((t) => t * w);
    return {
      h,
      member: (side: 0 | 1, i: number, n: number) => ({
        x: side ? main[4] : main[0],
        y: spread(n, i, 0, h - 80),
      }),
      lead: (side: 0 | 1) => ({ x: side ? main[3] : main[1], y: mid }),
      out: { x: main[2], y: mid },
      memberSize: 116,
      leadSize: 168,
    };
  }

  // main axis is y: members / lead / decision / lead / members
  const h = 1300;
  return {
    h,
    member: (side: 0 | 1, i: number, n: number) => ({
      x: spread(n, i, 0, w),
      y: side ? 1140 : 60,
    }),
    lead: (side: 0 | 1) => ({ x: w / 2, y: side ? 830 : 320 }),
    out: { x: w / 2, y: 590 },
    memberSize: Math.min(84, w / 4),
    leadSize: 112,
  };
}

const style = (vars: Record<string, string | number>) => vars as CSSProperties;

function Avatar({ member, size }: { member: TeamMember; size: number }) {
  if (member.photo) {
    return (
      <Image
        src={member.photo}
        alt={member.name ?? member.role}
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    );
  }
  if (member.name === null) {
    // open seat: a thin plus
    return (
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <path
          d="M50 40v20M40 50h20"
          stroke="var(--color-signal-deep)"
          strokeOpacity="0.55"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  // no photo yet: a quiet silhouette
  return (
    <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <circle cx="50" cy="40" r="15" fill="rgb(29 63 184 / 0.08)" />
      <path d="M18 92c4-19 17-29 32-29s28 10 32 29" fill="rgb(29 63 184 / 0.08)" />
    </svg>
  );
}

export default function TeamNet({
  divisions,
  output,
  hint,
  openSeat,
}: {
  divisions: TeamDivision[];
  output: string;
  hint: string;
  openSeat: string;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const w = width || 1200;
  const horizontal = w >= 900;
  const L = layout(w, horizontal);
  const sides = divisions.slice(0, 2);

  type Node = {
    id: string;
    member: TeamMember;
    p: Pt;
    size: number;
    delay: number;
    lead: boolean;
    division: string;
  };
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  sides.forEach((d, s) => {
    const side = s as 0 | 1;
    const leadId = `d${s}-lead`;
    const leadPt = L.lead(side);
    nodes.push({
      id: leadId,
      member: d.lead,
      p: leadPt,
      size: L.leadSize,
      delay: T.leads,
      lead: true,
      division: d.name,
    });
    edges.push({
      from: leadId,
      to: "out",
      a: leadPt,
      b: L.out,
      sw: 2.4,
      open: false,
      delay: T.e2,
    });
    d.members.forEach((m, i) => {
      const id = `d${s}-m${i}`;
      const p = L.member(side, i, d.members.length);
      const open = m.name === null;
      nodes.push({
        id,
        member: m,
        p,
        size: L.memberSize,
        delay: T.members + i * 0.08,
        lead: false,
        division: d.name,
      });
      edges.push({
        from: id,
        to: leadId,
        a: p,
        b: leadPt,
        sw: open ? 1 : 1.4,
        open,
        delay: T.e1 + i * 0.06,
      });
    });
  });

  // Tracing: a member lights their edge to their lead and the lead's edge to
  // the decision; a lead lights their whole branch.
  const leadOf = (id: string) => id.replace(/-m\d+$/, "-lead");
  const isLit = (e: Edge) => {
    if (active === null) return false;
    if (active.endsWith("-lead")) return e.from === active || e.to === active;
    return e.from === active || (e.from === leadOf(active) && e.to === "out");
  };
  const litEdges = edges.filter(isLit);
  const isLinked = (id: string) => litEdges.some((e) => e.from === id || e.to === id);

  const hoverProps = (id: string) => ({
    onMouseEnter: () => setActive(id),
    onMouseLeave: () => setActive(null),
    onFocus: () => setActive(id),
    onBlur: () => setActive(null),
  });

  return (
    <div>
      <p className="hidden font-mono text-[0.65rem] uppercase tracking-[0.25em] text-navy/40 md:block">
        {hint}
      </p>

      <div
        ref={stageRef}
        className="team-stage relative mt-6 w-full"
        data-ready={width > 0}
        data-active={active !== null}
        style={{ height: L.h }}
      >
        <svg
          className="pointer-events-none absolute inset-0 overflow-visible"
          width="100%"
          height={L.h}
          viewBox={`0 0 ${w} ${L.h}`}
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="team-bloom">
              <stop offset="0%" stopColor="rgb(29 63 184)" stopOpacity="0.16" />
              <stop offset="45%" stopColor="rgb(29 63 184)" stopOpacity="0.05" />
              <stop offset="100%" stopColor="rgb(29 63 184)" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle
            className="team-bloom"
            cx={L.out.x}
            cy={L.out.y}
            r={horizontal ? 210 : 150}
            fill="url(#team-bloom)"
          />

          {edges.map((e, k) => {
            const d = `M ${e.a.x} ${e.a.y} L ${e.b.x} ${e.b.y}`;
            return (
              <g
                key={k}
                className="team-edge-group"
                data-lit={isLit(e)}
                data-open={e.open}
                style={style({
                  "--delay": `${e.delay}s`,
                  "--sw": e.sw,
                  "--pulse": `${3 + (k % 4) * 0.5}s`,
                  "--pulse-delay": `${T.live + (k % 5) * 0.45}s`,
                })}
              >
                <path className="team-edge" d={d} pathLength={1} />
                <path className="team-pulse" d={d} pathLength={1} />
              </g>
            );
          })}
        </svg>

        {nodes.map((n) => {
          const open = n.member.name === null;
          const state =
            active === n.id ? "active" : isLinked(n.id) ? "linked" : active ? "dim" : "idle";
          const className = `team-member absolute flex -translate-x-1/2 flex-col items-center outline-none ${
            n.lead ? "is-lead" : ""
          } ${open ? "is-open" : ""}`;
          const body = (
            <>
              <span
                className={`team-node relative block overflow-hidden rounded-full bg-white ${
                  open ? "border border-dashed" : n.lead ? "border-2" : "border-[1.5px]"
                }`}
                style={{ width: n.size, height: n.size }}
              >
                <Avatar member={n.member} size={n.size} />
              </span>
              <span
                className={`team-label mt-3.5 block px-2 text-center ${
                  horizontal ? "max-w-[13rem]" : "max-w-[7.5rem]"
                }`}
              >
                {n.lead && (
                  <span className="mb-1 block font-mono text-[0.6rem] uppercase tracking-[0.28em] text-signal-deep">
                    {n.division}
                  </span>
                )}
                <span
                  className={`font-display block font-semibold tracking-tight ${
                    open ? "text-signal-deep/70" : "text-ink"
                  } ${
                    n.lead
                      ? horizontal
                        ? "text-2xl"
                        : "text-lg"
                      : horizontal
                        ? "text-lg"
                        : "text-sm"
                  }`}
                >
                  {open ? openSeat : n.member.name}
                </span>
                <span className="mt-1 block font-mono text-[0.62rem] leading-snug tracking-[0.06em] text-navy/50">
                  {n.member.role}
                </span>
              </span>
            </>
          );
          const pos = style({
            left: n.p.x,
            top: n.p.y - n.size / 2,
            "--delay": `${n.delay}s`,
          });

          return open ? (
            <Link
              key={n.id}
              href="/get-involved"
              className={className}
              style={pos}
              data-state={state}
              aria-label={`${openSeat}: ${n.member.role}. Get involved`}
              {...hoverProps(n.id)}
            >
              {body}
            </Link>
          ) : (
            <div
              key={n.id}
              className={className}
              style={pos}
              data-state={state}
              tabIndex={0}
              {...hoverProps(n.id)}
            >
              {body}
            </div>
          );
        })}

        {/* the one call both desks converge on */}
        <div
          className="team-output absolute"
          style={style({ left: L.out.x, top: L.out.y, "--delay": `${T.out}s` })}
          data-hot={active !== null}
        >
          <span className="team-ping absolute -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <span className="team-decision absolute -translate-x-1/2 -translate-y-1/2 rounded-full" />
          <span
            className={`absolute whitespace-nowrap font-mono text-[0.65rem] font-medium uppercase tracking-[0.32em] text-signal-deep ${
              horizontal ? "top-9 -translate-x-1/2" : "left-9 -translate-y-1/2"
            }`}
          >
            {output}
          </span>
        </div>
      </div>
    </div>
  );
}
