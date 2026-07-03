import Hero from "@/components/Hero";

/**
 * The home page is a single immersive screen: the neural network builds
 * itself on load and converges into the wordmark (Nav is rendered globally
 * in the root layout). There is deliberately nothing to scroll to past it.
 */
export default function Home() {
  return (
    <main className="relative">
      <Hero />
    </main>
  );
}
