"use client";

import { useState, useEffect } from "react";

type Message = { id: string; copy: string };

const MESSAGES: Message[] = [
  { id: "es-prices", copy: "Hablamos Español · Desde Los $1,700's" },
  { id: "starting-prices", copy: "Starting Prices in the $1,700's" },
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

  const current = MESSAGES[index];

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[1001] h-10 flex items-center justify-center px-4 overflow-hidden transition-colors duration-300 ${
        isScrolled ? "bg-avocado" : "bg-deep-ocean"
      }`}
    >
      <p
        key={current.id}
        className={`font-decorative text-[0.72rem] uppercase tracking-[0.15em] text-center leading-none whitespace-nowrap transition-colors duration-300 ${
          isScrolled ? "text-city-night" : "text-clouds"
        }`}
        style={{ animation: "announcementSlideUp 0.5s ease-out" }}
      >
        {current.id === "starting-prices" ? (
          <>
            Starting Prices in the{" "}
            <span className="normal-case">$1,700&apos;s</span>
          </>
        ) : current.id === "es-prices" ? (
          <>
            Hablamos Español · Desde Los{" "}
            <span className="normal-case">$1,700&apos;s</span>
          </>
        ) : (
          current.copy
        )}
      </p>
    </div>
  );
}
