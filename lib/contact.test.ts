import { describe, it, expect } from "vitest";
import { LIMITS, TOPICS, validateContact } from "./contact";

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
      data: { name: "Ada", email: "ada@utoronto.ca", topic: "General question", message: "hello there" },
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

  it("keeps a known topic and defaults an unknown one", () => {
    const known = validateContact({ ...valid, topic: "Sponsorship or partnership" });
    expect(known.ok && known.data.topic).toBe("Sponsorship or partnership");
    const unknown = validateContact({ ...valid, topic: "<script>" });
    expect(unknown.ok && unknown.data.topic).toBe(TOPICS[0]);
  });

  it("rejects fields over their length caps", () => {
    expect(validateContact({ ...valid, name: "a".repeat(LIMITS.name + 1) }).ok).toBe(false);
    expect(validateContact({ ...valid, email: `${"a".repeat(LIMITS.email)}@x.ca` }).ok).toBe(false);
    expect(validateContact({ ...valid, message: "a".repeat(LIMITS.message + 1) }).ok).toBe(false);
    expect(validateContact({ ...valid, message: "a".repeat(LIMITS.message) }).ok).toBe(true);
  });

  it("rejects non-object / missing input", () => {
    expect(validateContact(null).ok).toBe(false);
    expect(validateContact(undefined).ok).toBe(false);
    expect(validateContact("nope").ok).toBe(false);
  });
});
