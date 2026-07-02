import { describe, it, expect } from "vitest";
import { validateContact } from "./contact";

describe("validateContact", () => {
  const valid = {
    name: "Ada Lovelace",
    email: "ada@utoronto.ca",
    message: "I'd love to join the team.",
  };

  it("accepts and trims a well-formed submission", () => {
    const r = validateContact({
      name: "  Ada  ",
      email: "  ada@utoronto.ca ",
      message: "  hello there  ",
    });
    expect(r).toEqual({
      ok: true,
      data: { name: "Ada", email: "ada@utoronto.ca", message: "hello there" },
    });
  });

  it("rejects a missing name", () => {
    const r = validateContact({ ...valid, name: "   " });
    expect(r.ok).toBe(false);
  });

  it("rejects an invalid email", () => {
    const r = validateContact({ ...valid, email: "not-an-email" });
    expect(r.ok).toBe(false);
  });

  it("rejects a too-short message", () => {
    const r = validateContact({ ...valid, message: "hi" });
    expect(r.ok).toBe(false);
  });

  it("rejects non-object / missing input", () => {
    expect(validateContact(null).ok).toBe(false);
    expect(validateContact(undefined).ok).toBe(false);
    expect(validateContact("nope").ok).toBe(false);
  });
});
