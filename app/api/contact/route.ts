import { NextResponse } from "next/server";
import { Resend } from "resend";
import content from "@/lib/content";
import { validateContact } from "@/lib/contact";
import { CONTACT_FORM_ENABLED } from "@/lib/flags";

/**
 * The address the website sends from. It must be on a domain verified in
 * Resend; set RESEND_FROM to override (e.g. for a subdomain).
 */
const FROM = process.env.RESEND_FROM || "UTDSYS Website <website@utdsys.com>";

/** Name of the hidden field real visitors never see or fill in. */
const HONEYPOT = "website";

/*
 * A small per-IP limit so a script can't burn the Resend quota. It lives in
 * memory, so on serverless hosting each instance keeps its own count: it
 * stops casual abuse, not a determined attacker.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // keep memory bounded
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  // Contact form is disabled — don't attempt to send (see lib/flags.ts).
  if (!CONTACT_FORM_ENABLED) {
    return NextResponse.json(
      { error: "The contact form is currently unavailable." },
      { status: 503 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages from this connection. Please try again in a few minutes, or email us directly." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // A filled honeypot means a bot. Answer as if it worked so it moves on.
  const trap = (body as Record<string, unknown> | null)?.[HONEYPOT];
  if (typeof trap === "string" && trap.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const result = validateContact(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set; cannot send contact message.");
    return NextResponse.json(
      { error: "Email isn't configured yet." },
      { status: 500 },
    );
  }

  const { name, email, topic, message } = result.data;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: [content.contact.email],
      // Replying in the inbox goes straight to the visitor.
      replyTo: email,
      // the topic leads, so the inbox sorts itself at a glance
      subject: `[${topic}] Website message from ${name}`,
      text: `Topic: ${topic}\nName: ${name}\nEmail: ${email}\n\n${message}`,
    });
    if (error) {
      console.error("Resend send error:", error);
      return NextResponse.json(
        { error: "Could not send your message." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json(
      { error: "Could not send your message." },
      { status: 502 },
    );
  }
}
