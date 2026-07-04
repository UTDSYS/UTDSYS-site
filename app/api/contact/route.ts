import { NextResponse } from "next/server";
import { Resend } from "resend";
import content from "@/lib/content";
import { validateContact } from "@/lib/contact";
import { CONTACT_FORM_ENABLED } from "@/lib/flags";

export async function POST(request: Request) {
  // Contact form is disabled — don't attempt to send (see lib/flags.ts).
  if (!CONTACT_FORM_ENABLED) {
    return NextResponse.json(
      { error: "The contact form is currently unavailable." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
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

  const { name, email, message } = result.data;
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      // onboarding@resend.dev works without domain verification (good for
      // testing). Swap to an address on your verified domain in production.
      from: "DSys Website <onboarding@resend.dev>",
      to: [content.contact.email],
      replyTo: email,
      subject: `New Get Involved message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
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
