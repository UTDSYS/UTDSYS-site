import NeuralNetwork from "@/components/NeuralNetwork";
import Nav from "@/components/Nav";

/**
 * Shared shell for sub-pages: the settled neural-network backdrop, a
 * visible nav, and centered content.
 */
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen">
      <NeuralNetwork />
      <Nav />
      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-32 text-center">
        {children}
      </div>
    </main>
  );
}
