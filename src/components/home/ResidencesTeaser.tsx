"use client";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";

export default function ResidencesTeaser() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] bg-clouds"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-city-night order-2 lg:order-1 min-h-[300px]">
        <Image
          src="/images/interiors/unit-a1-living.jpg"
          alt="Modern apartment living room at Metro Parc"
          fill
          className={`object-cover transition-all duration-800 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
          }`}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center py-[clamp(2rem,8vw,4rem)] px-[clamp(1.5rem,5vw,4rem)] order-1 lg:order-2">
        <div
          className={`font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 transition-all duration-600 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Residences
        </div>

        <h2
          className={`text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-6 leading-[1.2] transition-all duration-600 delay-100 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          Trend-Setting Spaces
        </h2>

        <p
          className={`text-base text-city-night-light leading-[1.8] mb-8 transition-all duration-600 delay-200 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          Each residence at Metro Parc is carefully crafted with premium finishes, expansive windows flooding natural light, and open-concept layouts. From luxury vinyl-wood flooring to spa-inspired bathrooms, our floor plans adapt to your lifestyle. Engineered for comfort, designed for living.
        </p>

        <Link
          href="/residences"
          className={`inline-flex items-center gap-2 text-avocado font-semibold no-underline transition-all duration-600 delay-300 hover:gap-4 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          Explore Residences <span>→</span>
        </Link>
      </div>
    </section>
  );
}
