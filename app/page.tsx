"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import NeuralNetwork from "@/components/NeuralNetwork";
import Nav from "@/components/Nav";
import Landing from "@/components/Landing";
import Intro from "@/components/Intro";
import Footer from "@/components/Footer";

export default function Home() {
  const ref = useRef<HTMLDivElement>(null);
  // ["start start", "end end"] maps progress 0→1 onto exactly the span during
  // which the sticky inner is pinned — keeping the whole Landing→Intro morph
  // on-screen and centered.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <main className="relative">
      <NeuralNetwork progress={scrollYProgress} />
      <Nav progress={scrollYProgress} />

      {/*
        The one section: scroll drives a neural-network transition from the
        DSys landing into the home/intro. 300vh gives ~200vh of pinned scrub
        for an unhurried, "cool" transition.
      */}
      <div ref={ref} className="relative h-[300vh]">
        <div className="sticky top-0 h-screen overflow-hidden">
          <Landing progress={scrollYProgress} />
          <Intro progress={scrollYProgress} />
        </div>
      </div>

      <Footer />
    </main>
  );
}
