"use client";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";

const AMENITY_CARDS = [
  {
    image: "/images/amenities/pool-aerial-wide.jpg",
    alt: "Aerial view of resort-style pool at Metro Parc Hialeah",
    label: "Resort-Style Living",
    desc: "Pool, cabanas & resort-style amenities",
  },
  {
    image: "/images/amenities/gym-cable-wide.jpg",
    alt: "Full fitness center with cable machines at Metro Parc",
    label: "Fitness Center",
    desc: "Matrix gear & Peloton bikes",
  },
  {
    image: "/images/amenities/cowork-pods-walk.jpg",
    alt: "Co-working pods at Metro Parc Hialeah",
    label: "Co-Working",
    desc: "Private booths & high-speed Wi-Fi",
  },
  {
    image: "/images/amenities/club-overview.jpg",
    alt: "Clubroom overview at Metro Parc Hialeah",
    label: "Clubroom",
    desc: "Game room, lounge & terrace views",
  },
  {
    image: "/images/amenities/concierge-interaction.jpg",
    alt: "24-hour concierge service at Metro Parc Hialeah",
    label: "24-Hour Services",
    desc: "Concierge, lobby & pet-friendly living",
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

  const doubledMarquee = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-city-night text-clouds py-[clamp(3rem,12vw,6rem)]"
    >
      {/* Header */}
      <div className="text-center mb-10 px-8">
        <div
          className={`font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 transition-all duration-600 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Amenities
        </div>
        <h2
          className={`text-[clamp(1.75rem,5vw,2.75rem)] font-bold mb-3 transition-all duration-600 delay-100 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Every Detail Matters
        </h2>
        <p
          className={`text-clouds/60 text-[0.9375rem] max-w-[480px] mx-auto leading-[1.7] transition-all duration-600 delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          From the rooftop pool to the private Zoom booths — every space was designed to elevate your everyday.
        </p>
      </div>

      {/* Mobile: horizontal scroll carousel */}
      <div className="md:hidden overflow-x-auto scrollbar-hide px-6 pb-2">
        <div className="flex gap-4 w-max">
          {AMENITY_CARDS.map((card, i) => (
            <div
              key={card.label}
              className="relative w-[72vw] max-w-[300px] h-[380px] overflow-hidden shrink-0 group"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <Image
                src={card.image}
                alt={card.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="72vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-city-night/90 via-city-night/20 to-transparent" />
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-decorative text-[0.75rem] uppercase tracking-[0.15em] text-avocado mb-1">
                  {card.label}
                </p>
                <p className="text-clouds text-[0.875rem] leading-[1.5]">{card.desc}</p>
              </div>
            </div>
          ))}
          {/* CTA card at end of carousel */}
          <div className="relative w-[60vw] max-w-[240px] h-[380px] overflow-hidden shrink-0 bg-deep-ocean flex flex-col items-center justify-center gap-6 px-6 text-center border border-clouds/10">
            <p className="font-decorative text-[0.75rem] uppercase tracking-[0.15em] text-avocado">
              And much more
            </p>
            <p className="text-clouds text-[0.9rem] leading-[1.6]">
              11 amenities designed for the way you actually live.
            </p>
            <Link
              href="/amenities"
              className="inline-flex items-center justify-center px-6 py-3 bg-avocado text-city-night rounded-full font-decorative text-[0.8rem] uppercase tracking-[0.1em] no-underline transition-all duration-300 hover:bg-avocado/90"
            >
              Explore All
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop: asymmetric grid */}
      <div className="hidden md:grid grid-cols-3 grid-rows-2 gap-3 max-w-[1200px] mx-auto px-8 mb-12" style={{ gridTemplateRows: "320px 280px" }}>
        {/* Large card — Pool & Cabanas */}
        <div className="relative col-span-1 row-span-2 overflow-hidden group">
          <Image
            src={AMENITY_CARDS[0].image}
            alt={AMENITY_CARDS[0].alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-city-night/90 via-city-night/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="font-decorative text-[0.75rem] uppercase tracking-[0.15em] text-avocado mb-1">
              {AMENITY_CARDS[0].label}
            </p>
            <p className="text-clouds text-[0.875rem] leading-[1.5]">{AMENITY_CARDS[0].desc}</p>
          </div>
        </div>

        {/* Remaining 4 cards */}
        {AMENITY_CARDS.slice(1).map((card, i) => (
          <div
            key={card.label}
            className={`relative overflow-hidden group transition-all duration-600 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
            style={{ transitionDelay: inView ? `${200 + i * 100}ms` : "0ms" }}
          >
            <Image
              src={card.image}
              alt={card.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-city-night/90 via-city-night/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p className="font-decorative text-[0.75rem] uppercase tracking-[0.15em] text-avocado mb-1">
                {card.label}
              </p>
              <p className="text-clouds text-[0.8rem] leading-[1.5] opacity-80">{card.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Marquee */}
      <div className="relative overflow-hidden my-10">
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

      {/* Desktop CTA */}
      <div
        className={`hidden md:flex justify-center mt-4 transition-all duration-600 delay-500 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <Link
          href="/amenities"
          className="inline-flex items-center gap-2 px-8 py-4 bg-avocado text-city-night rounded-full font-decorative text-[0.875rem] uppercase tracking-[0.1em] no-underline transition-all duration-300 hover:bg-avocado/90"
        >
          Explore All Amenities
        </Link>
      </div>
    </section>
  );
}
