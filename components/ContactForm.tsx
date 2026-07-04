"use client";

import { useState } from "react";
import content from "@/lib/content";
import Button from "@/components/ui/Button";
import { CONTACT_FORM_ENABLED } from "@/lib/flags";

type Status = "idle" | "sending" | "success" | "error";

const f = content.getInvolved.form;

/** Shown in place of the form while CONTACT_FORM_ENABLED is off. */
function ContactDisabled() {
  const { discord } = f.disabled;
  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="flex w-full max-w-xs flex-col items-stretch gap-3">
        <Button href={discord.href}>{discord.label}</Button>
        <Button href={`mailto:${content.contact.email}`} variant="secondary">
          {content.contact.email}
        </Button>
      </div>
    </div>
  );
}

export default function ContactForm() {
  return CONTACT_FORM_ENABLED ? <ContactFormActive /> : <ContactDisabled />;
}

export function ContactFormActive() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    };

    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setError(json.error || f.error);
        setStatus("error");
        return;
      }
      form.reset();
      setStatus("success");
    } catch {
      setError(f.error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p
        role="status"
        className="rounded-2xl border border-navy/15 bg-white/60 px-6 py-8 text-center text-navy"
      >
        {f.success}
      </p>
    );
  }

  const sending = status === "sending";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 text-left">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-navy">{f.name.label}</span>
        <input
          name="name"
          type="text"
          required
          placeholder={f.name.placeholder}
          className="rounded-xl border border-navy/20 bg-white/70 px-4 py-2.5 text-navy outline-none transition focus:border-navy"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-navy">{f.email.label}</span>
        <input
          name="email"
          type="email"
          required
          placeholder={f.email.placeholder}
          className="rounded-xl border border-navy/20 bg-white/70 px-4 py-2.5 text-navy outline-none transition focus:border-navy"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-navy">{f.message.label}</span>
        <textarea
          name="message"
          required
          rows={5}
          placeholder={f.message.placeholder}
          className="resize-y rounded-xl border border-navy/20 bg-white/70 px-4 py-2.5 text-navy outline-none transition focus:border-navy"
        />
      </label>

      {status === "error" && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" disabled={sending} className="mt-2">
        {sending ? f.sending : f.submit}
      </Button>
    </form>
  );
}
