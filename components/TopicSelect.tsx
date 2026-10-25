"use client";

import { useEffect, useId, useRef, useState } from "react";

/**
 * A styled single-choice dropdown, so the menu matches the site instead of
 * the browser's default. Follows the ARIA "select-only combobox" pattern:
 * a button that opens a listbox, with arrow keys, Home/End, Enter/Space to
 * pick and Escape to close. A hidden input carries the value into the form.
 */
export default function TopicSelect<T extends string>({
  id,
  name,
  label,
  options,
  defaultValue,
  tone,
}: {
  id: string;
  name: string;
  label: string;
  options: readonly T[];
  defaultValue: T;
  tone: "light" | "dark";
}) {
  const [value, setValue] = useState<T>(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() =>
    Math.max(0, options.indexOf(defaultValue)),
  );
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();
  const labelId = `${id}-label`;

  // close on a click anywhere else
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // a form reset puts the default back
  useEffect(() => {
    const form = root.current?.closest("form");
    if (!form) return;
    const onReset = () => {
      setValue(defaultValue);
      setActive(Math.max(0, options.indexOf(defaultValue)));
    };
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, [defaultValue, options]);

  const choose = (i: number) => {
    setValue(options[i]);
    setActive(i);
    setOpen(false);
    button.current?.focus();
  };

  const openAt = (i: number) => {
    setActive(i);
    setOpen(true);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    const current = options.indexOf(value);
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) openAt(current);
        else setActive((a) => Math.min(last, a + 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!open) openAt(current);
        else setActive((a) => Math.max(0, a - 1));
        break;
      case "Home":
        if (open) {
          e.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          e.preventDefault();
          setActive(last);
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(active);
        else openAt(current);
        break;
      case "Escape":
        if (open) {
          e.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  const dark = tone === "dark";
  const fieldCls = dark
    ? "border-white/20 bg-white/[0.06] text-white focus-visible:border-[#9db3ff] focus-visible:ring-[#9db3ff]/25"
    : "border-navy/20 bg-white text-ink focus-visible:border-signal-deep focus-visible:ring-signal/20";
  const panelCls = dark
    ? "border-white/20 bg-[#13234a] text-white shadow-[0_24px_48px_-20px_rgb(0_0_0/0.7)]"
    : "border-navy/20 bg-white text-ink shadow-[0_24px_48px_-24px_rgb(14_24_48/0.4)]";
  const activeCls = dark ? "bg-white/10" : "bg-navy/[0.06]";
  const checkCls = dark ? "text-[#9db3ff]" : "text-signal-deep";

  return (
    <div ref={root} className="relative flex flex-col gap-1.5">
      <span
        id={labelId}
        className={
          dark
            ? "text-sm font-medium text-white/85"
            : "text-sm font-medium text-navy"
        }
      >
        {label}
      </span>
      <input type="hidden" name={name} value={value} />

      <button
        ref={button}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-labelledby={`${labelId} ${id}`}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openAt(options.indexOf(value)))}
        onKeyDown={onKeyDown}
        className={`flex w-full items-center justify-between gap-3 border px-3.5 py-2.5 text-left text-base outline-none transition focus-visible:ring-2 ${fieldCls}`}
      >
        <span>{value}</span>
        <svg
          viewBox="0 0 12 8"
          aria-hidden="true"
          className={`h-2 w-3 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1.5 6 6.5l5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={labelId}
          className={`absolute inset-x-0 top-full z-20 mt-1 border py-1 ${panelCls}`}
        >
          {options.map((o, i) => (
            <li
              key={o}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={o === value}
              onPointerEnter={() => setActive(i)}
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => choose(i)}
              className={`flex cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-base ${i === active ? activeCls : ""}`}
            >
              {o}
              {o === value && (
                <svg
                  viewBox="0 0 14 10"
                  aria-hidden="true"
                  className={`h-2.5 w-3.5 shrink-0 ${checkCls}`}
                >
                  <path
                    d="M1 5.2 5 9l8-8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
