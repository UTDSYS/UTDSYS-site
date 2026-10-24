/** What a message is about. It leads the email's subject line. */
export const TOPICS = [
  "General question",
  "Sponsorship or partnership",
  "Joining the group",
  "Other",
] as const;
export type Topic = (typeof TOPICS)[number];

export interface ContactData {
  name: string;
  email: string;
  topic: Topic;
  message: string;
}

export type ValidationResult =
  | { ok: true; data: ContactData }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Field caps, shared by the form's maxLength and the server check. */
export const LIMITS = { name: 100, email: 254, message: 5000 } as const;

/**
 * Validate + normalize a contact submission. Pure and shared by the client
 * form and the API route so both agree on what's acceptable.
 */
export function validateContact(input: unknown): ValidationResult {
  const obj = (input ?? {}) as Record<string, unknown>;
  const name = typeof obj.name === "string" ? obj.name.trim() : "";
  const email = typeof obj.email === "string" ? obj.email.trim() : "";
  const message = typeof obj.message === "string" ? obj.message.trim() : "";
  // Unknown or missing topics fall back to the first, rather than failing.
  const topic: Topic = (TOPICS as readonly string[]).includes(obj.topic as string)
    ? (obj.topic as Topic)
    : TOPICS[0];

  if (!name) return { ok: false, error: "Please enter your name." };
  if (name.length > LIMITS.name) {
    return { ok: false, error: `Please keep your name under ${LIMITS.name} characters.` };
  }
  if (email.length > LIMITS.email) {
    return { ok: false, error: "That email address is too long." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (message.length < 5) {
    return { ok: false, error: "Please enter a longer message." };
  }
  if (message.length > LIMITS.message) {
    return {
      ok: false,
      error: `Please keep your message under ${LIMITS.message.toLocaleString("en-US")} characters.`,
    };
  }
  return { ok: true, data: { name, email, topic, message } };
}
