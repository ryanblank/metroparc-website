"use client";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";

const AMENITY_CARDS = [
  {
    image: "/images/amenities/pool.jpg",
    alt: "Resort-style pool deck with loungers and palm trees at Metro Parc Hialeah",
    label: "Resort-Style Pool",
  },
  {
    image: "/images/amenities/gym.jpg",
    alt: "Modern fitness center with free weights and treadmills at Metro Parc",
    label: "Fitness Center",
  },
  {
    image: "/images/amenities/coworking.jpg",
    alt: "Co-working space with private offices at Metro Parc Hialeah",
    label: "Co-Working Space",
  },
  {
    image: "/images/amenities/cabanas.jpg",
    alt: "Private cabana seating by the pool at Metro Parc apartments",
    label: "Pool & Cabanas",
  },
];

const MARQUEE_ITEMS = [
  "Resort-Style Pool & Cabanas",
  "Fitness Center with Peloton",
  "Co-Working Space & Private Booths",
  "24-Hour Concierge",
  "Clubroom & Entertainment",
  "Outdoor Courtyard with Grills",
  "Tri-Rail & Metrorail Access",
  "Controlled-Access Bike Storage",
  "Amazon Lockers",
  "High-Speed Wi-Fi",
  "Ground-Floor Retail",
];

export default function AmenitiesTeaser() {
  const { ref, inView } = useInView();

  // Double the marquee items for seamless loop
  const doubledMarquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-city-night text-clouds py-[clamp(3rem,12vw,6rem)] px-8"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div
          className={`font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 transition-all duration-600 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Amenities
        </div>
        <h2
          className={`text-[clamp(1.75rem,5vw,2.75rem)] font-bold mb-8 transition-all duration-600 delay-100 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Vida Beyond Your Door
        </h2>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1200px] mx-auto mb-12">
        {AMENITY_CARDS.map((card, i) => (
          <div
            key={card.label}
            className={`relative h-[300px] rounded-lg overflow-hidden cursor-pointer group transition-all duration-600 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
            style={{ transitionDelay: inView ? `${200 + i * 100}ms` : "0ms" }}
          >
            <Image
              src={card.image}
              alt={card.alt}
              fill
              className="object-cover transition-transform duration-400 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <div className="absolute inset-0 overlay-city-night flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
              <span className="font-decorative text-xl font-semibold uppercase tracking-[0.1em] text-center text-clouds">
                {card.label}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden my-12">
        {/* Fade edges */}
        <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-city-night to-transparent z-[2] pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-city-night to-transparent z-[2] pointer-events-none" />

        <div className="flex items-center gap-0 w-max animate-[marquee_30s_linear_infinite] hover:[animation-play-state:paused]">
          {doubledMarquee.map((item, i) => (
            <span key={`${item}-${i}`} className="flex items-center">
              <span className="font-decorative text-[0.85rem] font-normal tracking-[0.15em] uppercase text-clouds opacity-70 whitespace-nowrap py-3">
                {item}
              </span>
              <span className="w-1 h-1 rounded-full bg-avocado shrink-0 mx-8" />
            </span>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        className={`text-center mt-8 transition-all duration-600 delay-400 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <Link
          href="/amenities"
          className="inline-flex items-center gap-2 text-avocado font-semibold no-underline transition-all duration-300 hover:gap-4"
        >
          View All Amenities <span>→</span>
        </Link>
      </div>
    </section>
  );
}
