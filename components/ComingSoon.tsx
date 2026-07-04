import PageShell from "@/components/PageShell";
import Button from "@/components/ui/Button";

/** Designed empty state for sections that aren't built yet (Team, Blog). */
export default function ComingSoon({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <PageShell>
      <p className="font-mono text-xs uppercase tracking-[0.35em] text-signal">
        Coming soon
      </p>
      <h1 className="font-display mt-5 text-5xl font-bold tracking-tight text-ink md:text-6xl">
        {title}
      </h1>
      <p className="mt-6 w-full max-w-md text-base leading-relaxed text-navy/70">
        {body}
      </p>
      <Button href="/get-involved" variant="secondary" className="mt-10">
        Get involved instead
      </Button>
    </PageShell>
  );
}
