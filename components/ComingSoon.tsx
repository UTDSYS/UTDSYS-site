import PageShell from "@/components/PageShell";

/** Placeholder page body for sections that aren't built yet (Team, Blog). */
export default function ComingSoon({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <PageShell>
      <p className="text-xs uppercase tracking-[0.3em] text-navy/50">
        Coming soon
      </p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight text-navy">
        {title}
      </h1>
      <p className="mt-6 max-w-md text-base leading-relaxed text-navy/70">
        {body}
      </p>
    </PageShell>
  );
}
