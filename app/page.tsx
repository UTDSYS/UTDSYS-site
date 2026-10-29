import Hero from "@/components/Hero";

/**
 * The home page is a single screen: the crest panel and the wordmark, with
 * the i-dots of "Decision" lit (Nav is rendered globally in the root
 * layout). There is deliberately nothing to scroll to past it.
 */
export default function Home() {
  return (
    <main className="relative">
      <Hero />
    </main>
  );
}
