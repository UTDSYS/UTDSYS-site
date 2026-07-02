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
