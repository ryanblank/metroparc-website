"use client";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";

const STATS = [
  { number: "5 min", label: "To Metrorail" },
  { number: "20 min", label: "To Downtown Miami" },
];

export default function NeighborhoodTeaser() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-white py-[clamp(3rem,12vw,6rem)] px-8 relative overflow-hidden"
    >
      {/* Decorative background pattern */}
      <div
        className="absolute top-0 right-[-100px] w-[500px] h-[500px] opacity-15 pointer-events-none"
        style={{ backgroundImage: "url('/images/patterns/waves-cream.jpg')" }}
      />

      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Content */}
        <div className="relative z-[1]">
          <div
            className={`font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 transition-all duration-600 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Neighborhood
          </div>

          <h2
            className={`text-[clamp(1.75rem,5vw,2.75rem)] font-bold text-city-night mb-6 leading-[1.2] transition-all duration-600 delay-100 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Connected to Everything
          </h2>

          <p
            className={`text-base text-city-night-light leading-[1.8] mb-8 transition-all duration-600 delay-200 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            Metro Parc puts you steps from the Metrorail, minutes from Downtown Miami, and at the heart of Hialeah&apos;s vibrant culture. The neighborhood is alive with diverse dining, local businesses, and a community that values connection. Your commute becomes seamless. Your life becomes fuller.
          </p>

          <Link
            href="/neighborhood"
            className={`inline-flex items-center gap-2 text-avocado font-semibold no-underline transition-all duration-300 hover:gap-4 mb-8 ${
              inView ? "opacity-100" : "opacity-0"
            }`}
          >
            Explore the Neighborhood <span>→</span>
          </Link>

          {/* Stats grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`p-6 bg-clouds rounded-lg transition-all duration-600 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                }`}
                style={{ transitionDelay: inView ? `${300 + i * 100}ms` : "0ms" }}
              >
                <div className="text-[2rem] font-[800] text-avocado mb-2">
                  {stat.number}
                </div>
                <div className="font-decorative text-[0.875rem] uppercase tracking-[0.1em] text-city-night">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div
          className={`relative h-[400px] rounded-lg overflow-hidden transition-all duration-800 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          <Image
            src="/images/exterior/corner-view.jpg"
            alt="Metro Parc neighborhood views in Hialeah"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  );
}
