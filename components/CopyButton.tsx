"use client";

import { useState } from "react";

/**
 * Copies a value to the clipboard and says so. Useful next to an email
 * address, because a mailto link doesn't open a mail app for everyone.
 * If the clipboard is refused, it selects the text so it can be copied
 * by hand.
 */
export default function CopyButton({ value, targetId }: { value: string; targetId: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const el = document.getElementById(targetId);
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="relative z-10 rounded-full border border-navy/20 px-4 py-2 text-sm font-medium text-navy transition hover:border-signal-deep hover:text-signal-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-signal"
    >
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}
