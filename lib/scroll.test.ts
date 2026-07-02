import { describe, it, expect } from "vitest";
import { map } from "./scroll";

describe("map", () => {
  it("returns the start output before the input range", () => {
    expect(map(-1, 0, 0.25, 1, 0)).toBe(1);
    expect(map(0, 0, 0.25, 1, 0)).toBe(1);
  });

  it("returns the end output after the input range (clamped hold)", () => {
    expect(map(0.25, 0, 0.25, 1, 0)).toBe(0);
    expect(map(0.9, 0, 0.25, 1, 0)).toBe(0);
  });

  it("interpolates linearly within the input range", () => {
    expect(map(0.125, 0, 0.25, 1, 0)).toBeCloseTo(0.5, 5);
    expect(map(0.4, 0.3, 0.5, 40, 0)).toBeCloseTo(20, 5);
  });

  it("supports rising output ranges", () => {
    expect(map(0.25, 0.25, 0.5, 0, 1)).toBe(0);
    expect(map(0.5, 0.25, 0.5, 0, 1)).toBe(1);
    expect(map(0.375, 0.25, 0.5, 0, 1)).toBeCloseTo(0.5, 5);
  });
});
