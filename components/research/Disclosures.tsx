import Link from "next/link";
import content from "@/lib/content";
import RatingBadge from "@/components/research/RatingBadge";

const { ratings, disclaimer } = content.fundamentalResearch;

/** Rating scale and legal note, shared by the index and every report page. */
export default function Disclosures() {
  return (
    <footer className="mt-24 grid gap-10 border-t border-navy/12 pt-10 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <h2 className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-navy/50">
          Rating definitions
        </h2>
        <dl className="mt-4 space-y-3">
          {ratings.map((r) => (
            <div key={r.rating} className="flex items-center gap-4">
              <dt className="w-16 shrink-0">
                <RatingBadge rating={r.rating} />
              </dt>
              <dd className="text-sm text-navy/65">{r.definition}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div>
        <h2 className="font-mono text-[0.75rem] uppercase tracking-[0.08em] text-navy/50">
          Disclosures
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-navy/55">{disclaimer}</p>
        <p className="mt-4 text-sm text-navy/55">
          Want to cover a name with us?{" "}
          <Link
            href="/get-involved"
            className="font-medium text-signal-deep underline decoration-signal-deep/30 underline-offset-4 transition hover:decoration-signal-deep"
          >
            Get involved
          </Link>
          .
        </p>
      </div>
    </footer>
  );
}
