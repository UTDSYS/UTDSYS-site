export interface ContactData {
  name: string;
  email: string;
  message: string;
}

export type ValidationResult =
  | { ok: true; data: ContactData }
  | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate + normalize a contact submission. Pure and shared by the client
 * form and the API route so both agree on what's acceptable.
 */
export function validateContact(input: unknown): ValidationResult {
  const obj = (input ?? {}) as Record<string, unknown>;
  const name = typeof obj.name === "string" ? obj.name.trim() : "";
  const email = typeof obj.email === "string" ? obj.email.trim() : "";
  const message = typeof obj.message === "string" ? obj.message.trim() : "";

  if (!name) return { ok: false, error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }
  if (message.length < 5) {
    return { ok: false, error: "Please enter a longer message." };
  }
  return { ok: true, data: { name, email, message } };
}
