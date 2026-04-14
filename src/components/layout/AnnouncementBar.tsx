"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "Hablamos Español · Hasta 2.5 Meses Gratis",
  "Now Offering Up to 2.5 Months Free",
];

export default function AnnouncementBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[1001] h-10 flex items-center justify-center px-4 overflow-hidden transition-colors duration-300 ${
        isScrolled ? "bg-avocado" : "bg-deep-ocean"
      }`}
    >
      <p
        key={index}
        className={`font-decorative text-[0.72rem] uppercase tracking-[0.15em] text-center leading-none transition-colors duration-300 ${
          isScrolled ? "text-city-night" : "text-clouds"
        }`}
        style={{ animation: "announcementSlideUp 0.5s ease-out" }}
      >
        {MESSAGES[index]}
      </p>
    </div>
  );
}
