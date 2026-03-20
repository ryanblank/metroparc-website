"use client";

import { useState, useEffect } from "react";

export default function AnnouncementBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[1001] h-10 flex items-center justify-center px-4 transition-colors duration-300 ${
        isScrolled ? "bg-avocado" : "bg-deep-ocean"
      }`}
    >
      <p
        className={`font-decorative text-[0.72rem] uppercase tracking-[0.15em] text-center leading-none transition-colors duration-300 ${
          isScrolled ? "text-city-night" : "text-clouds"
        }`}
      >
        2 Months Free on a 14-Month Lease
      </p>
    </div>
  );
}
