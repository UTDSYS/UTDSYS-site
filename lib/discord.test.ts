import { describe, it, expect } from "vitest";
import { discordPayload } from "./discord";

const data = {
  name: "Ada",
  email: "ada@utoronto.ca",
  topic: "Sponsorship or partnership" as const,
  message: "Hello @everyone <@123> — we'd like to sponsor.",
};

describe("discordPayload", () => {
  it("never lets form text ping anyone", () => {
    expect(discordPayload(data).allowed_mentions).toEqual({ parse: [] });
  });

  it("carries the topic, sender and reply address", () => {
    const [embed] = discordPayload(data, new Date("2026-10-24T12:00:00Z")).embeds;
    expect(embed.title).toBe("Sponsorship or partnership: Ada");
    expect(embed.description).toBe(data.message);
    expect(embed.fields.map((f) => f.value)).toEqual(["Ada", "ada@utoronto.ca", "Sponsorship or partnership"]);
    expect(embed.timestamp).toBe("2026-10-24T12:00:00.000Z");
  });

  it("clips a long message to Discord's embed limit", () => {
    const [embed] = discordPayload({ ...data, message: "a".repeat(5000) }).embeds;
    expect(embed.description.length).toBe(4000);
    expect(embed.description.endsWith("…")).toBe(true);
  });
});
