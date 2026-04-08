"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function FixedCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[900] md:hidden px-4 py-3 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="flex justify-center">
        <Link
          href="/availability"
          className="bg-avocado text-city-night px-8 py-2.5 rounded-full font-decorative text-[0.75rem] uppercase tracking-[0.1em] no-underline transition-colors hover:bg-avocado-hover"
        >
          Availability
        </Link>
      </div>
    </div>
  );
}
