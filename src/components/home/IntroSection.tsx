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

      {/* Stats row — 2×2 grid on mobile, single row on desktop */}
      <div
        className={`grid grid-cols-2 md:flex md:flex-wrap md:justify-center md:items-center mt-8 gap-y-6 md:gap-y-0 transition-all duration-600 delay-300 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {STATS.map((stat, i) => (
          <div key={stat.label} className="flex items-center justify-center md:justify-start">
            <div className="flex flex-col items-center px-6 md:px-8 py-2">
              {stat.href ? (
                <Link
                  href={stat.href}
                  className="flex flex-col items-center group no-underline"
                >
                  <span className="text-[1.5rem] font-bold text-avocado leading-none mb-1 group-hover:text-avocado/70 transition-colors duration-200">
                    {stat.value}
                  </span>
                  <span className="font-decorative text-[0.7rem] uppercase tracking-[0.14em] text-city-night-light group-hover:text-avocado/70 transition-colors duration-200">
                    {stat.label}
                  </span>
                </Link>
              ) : (
                <>
                  <span className="text-[1.5rem] font-bold text-avocado leading-none mb-1">
                    {stat.value}
                  </span>
                  <span className="font-decorative text-[0.7rem] uppercase tracking-[0.14em] text-city-night-light">
                    {stat.label}
                  </span>
                </>
              )}
            </div>
            {i < STATS.length - 1 && (
              <div className="hidden md:block w-px h-8 bg-city-night/20" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
