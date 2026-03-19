"use client";

import { useState, useEffect } from "react";

interface FixedCTAProps {
  onBookTourClick: () => void;
}

export default function FixedCTA({ onBookTourClick }: FixedCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero (100vh)
      setIsVisible(window.scrollY > window.innerHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={onBookTourClick}
      className={`fixed bottom-6 right-6 z-[900] bg-avocado text-city-night px-6 py-3 rounded-full font-decorative text-[0.8rem] uppercase tracking-[0.1em] cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.2)] transition-all duration-300 hover:bg-avocado-hover hover:shadow-[0_6px_30px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      }`}
      aria-label="Book a Tour"
    >
      Book a Tour
    </button>
  );
}
