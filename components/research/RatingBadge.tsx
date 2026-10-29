import type { Rating } from "@/lib/content";
import { ratingClass } from "@/lib/research";

export default function RatingBadge({
  rating,
  size = "sm",
}: {
  rating: Rating;
  size?: "sm" | "lg";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono uppercase ${
        size === "lg"
          ? "px-4 py-1.5 text-xs tracking-[0.08em]"
          : "px-2.5 py-0.5 text-[0.7rem] tracking-[0.08em]"
      } ${ratingClass[rating]}`}
    >
      {rating}
    </span>
  );
}
