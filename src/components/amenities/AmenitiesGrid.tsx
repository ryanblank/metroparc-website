"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const SLOTS = [
  {
    id: "hero",
    images: [
      { src: "/images/amenities/pool-aerial-wide.jpg", alt: "Aerial view of resort-style pool at Metro Parc Hialeah" },
      { src: "/images/amenities/pool-floating.jpg", alt: "Resident floating in the pool at Metro Parc Hialeah" },
      { src: "/images/amenities/pool-deck-walk.jpg", alt: "Pool deck and cabanas at Metro Parc Hialeah" },
      { src: "/images/amenities/pool-swimming.jpg", alt: "Swimming in the resort-style pool at Metro Parc" },
      { src: "/images/amenities/pool-lifestyle-towel.jpg", alt: "Poolside lifestyle at Metro Parc Hialeah" },
      { src: "/images/amenities/pool-lounging.jpg", alt: "Lounging by the pool at Metro Parc Hialeah" },
    ],
    name: "Resort-Style Living",
    desc: "Pool, cabanas & resort-style amenities",
    large: true,
    interval: 5000,
    offset: 0,
  },
  {
    id: "fitness",
    images: [
      { src: "/images/amenities/gym-spin-bikes.jpg", alt: "Spin bikes at the fitness center at Metro Parc" },
      { src: "/images/amenities/gym-cable-wide.jpg", alt: "Full fitness center with cable machines at Metro Parc" },
      { src: "/images/amenities/gym-cable-action.jpg", alt: "Working out at the cable machine at Metro Parc" },
      { src: "/images/amenities/gym-barbell-wide.jpg", alt: "Free weights area at Metro Parc fitness center" },
      { src: "/images/amenities/gym-barbell-rear.jpg", alt: "Barbell workout at Metro Parc Hialeah" },
      { src: "/images/amenities/gym-squats.jpg", alt: "Squat rack at Metro Parc fitness center" },
    ],
    name: "Fitness Center",
    desc: "Matrix gear & Peloton bikes",
    large: false,
    interval: 5000,
    offset: 1200,
  },
  {
    id: "coworking",
    images: [
      { src: "/images/amenities/cowork-pods-walk.jpg", alt: "Co-working pods at Metro Parc Hialeah" },
      { src: "/images/amenities/cowork-pod-laptop.jpg", alt: "Working from a private pod at Metro Parc" },
      { src: "/images/amenities/cowork-pod-closeup.jpg", alt: "Private work pod at Metro Parc Hialeah" },
      { src: "/images/amenities/cowork-terrace-phone.jpg", alt: "Phone call in co-working space at Metro Parc" },
      { src: "/images/amenities/cowork-outdoor-call.jpg", alt: "Outdoor work area at Metro Parc Hialeah" },
    ],
    name: "Co-Working Space",
    desc: "Private booths & high-speed Wi-Fi",
    large: false,
    interval: 5000,
    offset: 2400,
  },
  {
    id: "clubhouse",
    images: [
      { src: "/images/amenities/club-overview.jpg", alt: "Clubroom overview at Metro Parc Hialeah" },
      { src: "/images/amenities/club-pool-table.jpg", alt: "Pool table in the clubroom at Metro Parc" },
      { src: "/images/amenities/club-foosball-tv.jpg", alt: "Foosball and TV lounge at Metro Parc" },
      { src: "/images/amenities/club-lounge.jpg", alt: "Lounge seating in the clubroom at Metro Parc" },
      { src: "/images/amenities/club-terrace-chairs.jpg", alt: "Terrace seating at Metro Parc clubroom" },
    ],
    name: "Clubroom",
    desc: "Game room, lounge & terrace views",
    large: false,
    interval: 5000,
    offset: 800,
  },
  {
    id: "grilling",
    images: [
      { src: "/images/amenities/grill-setup.jpg", alt: "Outdoor grilling station at Metro Parc Hialeah" },
      { src: "/images/amenities/grill-action.jpg", alt: "Grilling at the outdoor kitchen at Metro Parc" },
      { src: "/images/amenities/grill-couple-wide.jpg", alt: "Couple at the outdoor grill at Metro Parc" },
      { src: "/images/amenities/grill-serving.jpg", alt: "Serving grilled food at Metro Parc" },
      { src: "/images/amenities/grill-laughing.jpg", alt: "Enjoying the outdoor dining at Metro Parc" },
      { src: "/images/amenities/grill-dining.jpg", alt: "Outdoor dining at Metro Parc Hialeah" },
    ],
    name: "Outdoor Grilling",
    desc: "Grilling stations & outdoor kitchen",
    large: false,
    interval: 5000,
    offset: 2000,
  },
  {
    id: "services",
    images: [
      { src: "/images/amenities/lobby-wide.jpg", alt: "Lobby and concierge at Metro Parc Hialeah" },
      { src: "/images/amenities/concierge-interaction.jpg", alt: "24-hour concierge service at Metro Parc" },
      { src: "/images/amenities/concierge-laughing.jpg", alt: "Friendly concierge at Metro Parc Hialeah" },
      { src: "/images/amenities/lobby-seating.jpg", alt: "Lobby lounge seating at Metro Parc" },
      { src: "/images/amenities/lobby-dog-wide.jpg", alt: "Pet-friendly lobby at Metro Parc Hialeah" },
      { src: "/images/amenities/lobby-dog-closeup.jpg", alt: "Dog-friendly community at Metro Parc" },
    ],
    name: "24-Hour Services",
    desc: "Concierge, lobby & pet-friendly living",
    large: false,
    interval: 5000,
    offset: 1600,
  },
];

function AmenityCard({ slot }: { slot: typeof SLOTS[0] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slot.images.length <= 1) return;
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % slot.images.length);
      }, slot.interval);
      return () => clearInterval(timer);
    }, slot.offset);
    return () => clearTimeout(timeout);
  }, [slot]);

  return (
    <div
      className={`relative overflow-hidden group ${
        slot.large
          ? "h-[320px] md:h-auto md:col-span-2 md:row-span-2"
          : "h-[260px] md:h-auto"
      }`}
    >
      {/* All images stacked — only the active one is visible */}
      {slot.images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt}
          fill
          className="object-cover transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: i === index ? 1 : 0 }}
          sizes={slot.large ? "(max-width: 768px) 100vw, 66vw" : "33vw"}
          priority={slot.large && i === 0}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-city-night/80 via-transparent to-transparent" />
      <div className={`absolute bottom-0 left-0 ${slot.large ? "p-6" : "p-4"}`}>
        <p className={`font-decorative uppercase tracking-[0.18em] text-avocado mb-1 ${slot.large ? "text-[0.75rem]" : "text-[0.7rem]"}`}>
          {slot.name}
        </p>
        <p className={`text-clouds leading-[1.4] ${slot.large ? "text-[0.9rem]" : "text-[0.8rem]"}`}>
          {slot.desc}
        </p>
      </div>
      {/* Dot indicators */}
      {slot.images.length > 1 && (
        <div className="absolute bottom-0 right-0 p-3 flex gap-1">
          {slot.images.map((_, i) => (
            <span
              key={i}
              className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "bg-avocado" : "bg-clouds/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function AmenitiesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[320px_300px_280px] gap-3">
      {SLOTS.map((slot) => (
        <AmenityCard key={slot.id} slot={slot} />
      ))}
    </div>
  );
}
