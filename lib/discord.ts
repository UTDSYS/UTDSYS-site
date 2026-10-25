import type { ContactData } from "@/lib/contact";

/**
 * Posts each website message to a private Discord channel through a channel
 * webhook (DISCORD_WEBHOOK_URL), so the execs see it as it arrives.
 *
 * Message text comes from the public, so the payload disables every mention:
 * typing "@everyone" or "<@id>" in the form can never ping anyone.
 */

// Discord's embed limits: 4096 for the description, 1024 per field value.
const DESCRIPTION_MAX = 4000;
const FIELD_MAX = 1000;

const clip = (text: string, max: number) => (text.length > max ? `${text.slice(0, max - 1)}…` : text);

/** Pure, so the shape (and the mention guard) can be tested without sending. */
export function discordPayload({ name, email, topic, message }: ContactData, sentAt = new Date()) {
  return {
    username: "UTDSYS Website",
    allowed_mentions: { parse: [] as string[] },
    embeds: [
      {
        title: clip(`${topic}: ${name}`, 256),
        description: clip(message, DESCRIPTION_MAX),
        color: 0x1d3fb8, // the site's signal-deep
        fields: [
          { name: "From", value: clip(name, FIELD_MAX), inline: true },
          { name: "Reply to", value: clip(email, FIELD_MAX), inline: true },
          { name: "Topic", value: topic, inline: true },
        ],
        footer: { text: "Sent from the website form. Reply by email to the address above." },
        timestamp: sentAt.toISOString(),
      },
    ],
  };
}

/** Resolves true if Discord accepted it; never throws. */
export async function notifyDiscord(data: ContactData): Promise<boolean> {
  const url = process.env.DISCORD_WEBHOOK_URL;
  if (!url) return false;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordPayload(data)),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error("Discord webhook error:", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (err) {
    console.error("Discord webhook failed:", err);
    return false;
  }
}
