import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "signal";

const base =
  "inline-flex items-center justify-center rounded-full px-7 py-3 text-sm font-medium tracking-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-offwhite disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-offwhite hover:bg-signal",
  secondary:
    "border border-navy/25 text-navy hover:border-signal hover:text-signal",
  signal: "bg-signal text-white hover:brightness-110",
};

type Props = {
  variant?: Variant;
  href?: string;
  children: React.ReactNode;
  className?: string;
} & Omit<ComponentProps<"button">, "className" | "children">;

/** Shared CTA. Renders a Link when `href` is given, a button otherwise. */
export default function Button({
  variant = "primary",
  href,
  children,
  className = "",
  ...rest
}: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}
