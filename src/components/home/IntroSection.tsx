"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";

const STATS = [
  { value: "Pet", label: "Friendly" },
  { value: "2 Blocks", label: "to Metrorail" },
  { value: "Pool", label: "& Cabanas" },
  { value: "Penthouses", label: "Available", href: "/residences#the-heights" },
];

export default function IntroSection() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-clouds py-[clamp(3rem,10vw,7rem)] px-8 text-center"
    >
      {/* H2 — SEO keyword heading */}
      <h2
        className={`text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-city-night mb-4 leading-[1.2] transition-all duration-600 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        Studio, 1 &amp; 2-Bedroom Apartments for Rent
      </h2>

      {/* Punchy sentence */}
      <p
        className={`text-[1.0625rem] text-city-night-light leading-[1.8] mb-6 max-w-4xl mx-auto transition-all duration-600 delay-100 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        Metro Parc places you at the pulse of Hialeah&apos;s vibrant energy, offering a lifestyle that&apos;s as connected as it is convenient. Dining, culture, and transportation at your doorstep.
      </p>

    </section>
  );
}
