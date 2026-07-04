/**
 * Shared shell for centered sub-pages (Team, Blog, Contact, Get Involved).
 * The nav is rendered globally in the root layout; this just centers content
 * on the plain offwhite surface.
 */
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-svh">
      <div className="relative mx-auto flex min-h-svh max-w-2xl flex-col items-center justify-center px-6 py-28 pt-32 text-center sm:py-32">
        {children}
      </div>
    </main>
  );
}
