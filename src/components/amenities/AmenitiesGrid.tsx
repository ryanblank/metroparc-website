"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const SLOTS = [
  {
    id: "hero",
    images: [
      { src: "/images/amenities/lobby-alt.jpg",  alt: "Lobby and courtyard at Metro Parc Hialeah" },
      { src: "/images/amenities/pool.jpg",        alt: "Resort-style pool at Metro Parc Hialeah" },
      { src: "/images/amenities/cabanas.jpg",     alt: "Private cabanas at Metro Parc Hialeah" },
      { src: "/images/amenities/concierge.jpg",   alt: "Concierge service at Metro Parc Hialeah" },
    ],
    name: "Resort-Style Living",
    desc: "Pool, cabanas, 24-hr concierge & more",
    large: true,
    interval: 5000,
    offset: 0,
  },
  {
    id: "fitness",
    images: [
      { src: "/images/amenities/gym.jpg",          alt: "Fitness center at Metro Parc Hialeah" },
      { src: "/images/amenities/gym-lifestyle.jpg", alt: "Fitness lifestyle at Metro Parc Hialeah" },
      { src: "/images/amenities/peloton.jpg",       alt: "Peloton bikes at Metro Parc Hialeah" },
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
      { src: "/images/amenities/coworking.jpg",  alt: "Co-working space at Metro Parc Hialeah" },
      { src: "/images/amenities/lobby-mural.jpg", alt: "Lobby mural at Metro Parc Hialeah" },
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
      { src: "/images/amenities/clubhouse.jpg", alt: "Clubroom at Metro Parc Hialeah" },
      { src: "/images/amenities/lobby.jpg",     alt: "Lobby lounge at Metro Parc Hialeah" },
    ],
    name: "Clubroom",
    desc: "Upper-floor lounge with terrace views",
    large: false,
    interval: 5000,
    offset: 800,
  },
  {
    id: "grilling",
    images: [
      { src: "/images/amenities/grilling.jpg", alt: "Outdoor grilling at Metro Parc Hialeah" },
    ],
    name: "Outdoor Grilling",
    desc: "Grilling stations & outdoor kitchen",
    large: false,
    interval: 5000,
    offset: 2000,
  },
  {
    id: "gameroom",
    images: [
      { src: "/images/amenities/game-room.jpg",     alt: "Game room at Metro Parc Hialeah" },
      { src: "/images/amenities/game-room-alt.jpg", alt: "Game room alternate view at Metro Parc" },
    ],
    name: "Game Room",
    desc: "Pool table, foosball & social seating",
    large: false,
    interval: 5000,
    offset: 3200,
  },
];

function AmenityCard({ slot }: { slot: typeof SLOTS[0] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slot.images.length <= 1) return;
    const timeout = setTimeout(() => {
      const timer = setInterval(() => {
        setIndex((i) => (i + 1) % slot.images.length);
      }, slot.interval);
      return () => clearInterval(timer);
    }, slot.offset);
    return () => clearTimeout(timeout);
  }, [slot]);

  const current = slot.images[index];

  return (
    <div
      className={`relative overflow-hidden group ${
        slot.large ? "col-span-2 row-span-2" : ""
      }`}
    >
      <Image
        key={current.src}
        src={current.src}
        alt={current.alt}
        fill
        className="object-cover transition-all duration-700 group-hover:scale-105"
        sizes={slot.large ? "(max-width: 768px) 100vw, 66vw" : "33vw"}
        priority={slot.large}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-city-night/80 via-transparent to-transparent" />
      <div className={`absolute bottom-0 left-0 ${slot.large ? "p-6" : "p-4"}`}>
        <p className={`font-decorative uppercase tracking-[0.18em] text-avocado mb-1 ${slot.large ? "text-[0.75rem]" : "text-[0.7rem]"}`}>
          {slot.name}
        </p>
        <p className={`text-clouds leading-[1.4] ${slot.large ? "text-[0.9rem]" : "text-[0.8rem]"}`}>
          {slot.desc}
        </p>
      </div>
      {/* Dot indicators if multiple images */}
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
    <div className="grid grid-cols-2 md:grid-cols-3 grid-rows-[340px_280px] gap-3">
      {SLOTS.map((slot) => (
        <AmenityCard key={slot.id} slot={slot} />
      ))}
    </div>
  );
}
