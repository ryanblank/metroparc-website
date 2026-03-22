"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";

const GALLERY = [
  {
    src: "/images/interiors/lifestyle-unit-walkthrough.jpg",
    alt: "Resident walking through open-concept living space at Metro Parc Hialeah",
  },
  {
    src: "/images/interiors/lifestyle-bedroom-mirror.jpg",
    alt: "Resident in styled bedroom with city view at Metro Parc Hialeah",
  },
  {
    src: "/images/interiors/lifestyle-living-room.jpg",
    alt: "Resident relaxing in living room at Metro Parc apartments Hialeah",
  },
];

export default function ResidencesTeaser() {
  const { ref, inView } = useInView();
  const [current, setCurrent] = useState(0);

  // Advance every 4.5 seconds once section is in view
  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % GALLERY.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px] bg-clouds"
    >
      {/* Crossfade image gallery */}
      <div className="relative overflow-hidden bg-city-night order-2 lg:order-1 min-h-[400px]">
        {GALLERY.map((img, i) => (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            fill
            className="object-cover transition-opacity duration-[1500ms] ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={i === 0}
          />
        ))}
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
          Each residence at Metro Parc is carefully crafted with premium
          finishes, expansive windows flooding natural light, and open-concept
          layouts. From luxury vinyl-wood flooring to spa-inspired bathrooms,
          our floor plans adapt to your lifestyle. Engineered for comfort,
          designed for living.
        </p>

        <Link
          href="/residences"
          className={`inline-flex items-center gap-2 text-avocado font-semibold no-underline transition-all duration-300 hover:gap-4 delay-300 ${
            inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
          }`}
        >
          Explore Residences <span>→</span>
        </Link>
      </div>
    </section>
  );
}
