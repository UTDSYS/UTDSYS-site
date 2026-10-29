"use client";

import { useState } from "react";
import content from "@/lib/content";
import Button from "@/components/ui/Button";
import TopicSelect from "@/components/TopicSelect";
import { CONTACT_FORM_ENABLED } from "@/lib/flags";
import { LIMITS, TOPICS, type Topic } from "@/lib/contact";

type Status = "idle" | "sending" | "success" | "error";
type Tone = "light" | "dark";

const f = content.getInvolved.form;

/**
 * The site's message form, sent through /api/contact to the team inbox.
 * `tone` matches the ground it sits on: "light" for Contact, "dark" for the
 * navy Get involved page. Square fields, to match the site's cards.
 */
const styles = {
  light: {
    label: "text-sm font-medium text-navy",
    field:
      "w-full border border-navy/20 bg-white px-3.5 py-2.5 text-base text-ink outline-none transition focus:border-signal-deep focus:ring-2 focus:ring-signal/20",
    submit: "deep" as const,
    success: "border border-navy/20 bg-white text-ink",
    error: "text-red-700",
  },
  dark: {
    label: "text-sm font-medium text-white/85",
    field:
      "w-full border border-white/20 bg-white/[0.06] px-3.5 py-2.5 text-base text-white outline-none transition focus:border-[#9db3ff] focus:ring-2 focus:ring-[#9db3ff]/25",
    // quiet on purpose: on Get involved, "Join the Discord" is the one bright button
    submit: "outline-light" as const,
    success: "border border-white/20 bg-white/[0.06] text-white",
    error: "text-[#ffb4b4]",
  },
};

/** Shown in place of the form while CONTACT_FORM_ENABLED is off. */
function ContactDisabled() {
  const { discord } = f.disabled;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full flex-col items-stretch gap-3">
        <Button href={discord.href}>{discord.label}</Button>
        <Button href={`mailto:${content.contact.email}`} variant="secondary">
          {content.contact.email}
        </Button>
      </div>
    </div>
  );
}

export default function ContactForm(props: {
  tone?: Tone;
  defaultTopic?: Topic;
  idPrefix?: string;
}) {
  return CONTACT_FORM_ENABLED ? (
    <ContactFormActive {...props} />
  ) : (
    <ContactDisabled />
  );
}

export function ContactFormActive({
  tone = "light",
  defaultTopic = TOPICS[0],
  idPrefix = "contact",
}: {
  tone?: Tone;
  defaultTopic?: Topic;
  /** keeps field ids unique if a page ever holds two forms */
  idPrefix?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const s = styles[tone];
  const id = (name: string) => `${idPrefix}-${name}`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      topic: String(fd.get("topic") ?? ""),
      message: String(fd.get("message") ?? ""),
      // the hidden honeypot; a person never fills it in
      website: String(fd.get("website") ?? ""),
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
      <div role="status" className={`${s.success} px-6 py-8`}>
        <p className="font-display text-xl font-semibold tracking-tight">
          {f.successHeading}
        </p>
        <p className="mt-2 text-base opacity-80">{f.success}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-sm font-semibold underline underline-offset-4"
        >
          {f.another}
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form
      onSubmit={onSubmit}
      className="relative flex flex-col gap-5 text-left"
    >
      {/* Honeypot: off-screen and skipped by keyboard and screen readers, so
          only bots fill it in. The server drops anything that does. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden"
      >
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id("name")} className={s.label}>
            {f.name.label}
          </label>
          <input
            id={id("name")}
            name="name"
            type="text"
            required
            maxLength={LIMITS.name}
            autoComplete="name"
            className={s.field}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={id("email")} className={s.label}>
            {f.email.label}
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            required
            maxLength={LIMITS.email}
            autoComplete="email"
            className={s.field}
          />
        </div>
      </div>

      <TopicSelect
        id={id("topic")}
        name="topic"
        label={f.topic.label}
        options={TOPICS}
        defaultValue={defaultTopic}
        tone={tone}
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor={id("message")} className={s.label}>
          {f.message.label}
        </label>
        <textarea
          id={id("message")}
          name="message"
          required
          rows={6}
          maxLength={LIMITS.message}
          className={`${s.field} resize-y`}
        />
      </div>

      {status === "error" && (
        <p role="alert" className={`text-sm ${s.error}`}>
          {error}
        </p>
      )}

      <div className="pt-1">
        <Button
          type="submit"
          variant={s.submit}
          disabled={sending}
          className="w-full sm:w-auto"
        >
          {sending ? f.sending : f.submit}
        </Button>
      </div>
    </form>
  );
}
