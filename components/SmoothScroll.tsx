"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";

/** Mounts the momentum wheel-scroll behavior. Renders nothing. */
export default function SmoothScroll() {
  useSmoothScroll();
  return null;
}
