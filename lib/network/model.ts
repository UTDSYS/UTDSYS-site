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
