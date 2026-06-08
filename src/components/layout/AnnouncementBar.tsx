"use client";

import { useState, useEffect } from "react";
import { useBookTour } from "@/context/BookTourContext";

type Message =
  | { id: string; copy: string }
  | { id: string; copy: string; hasTerms: true };

const MESSAGES: Message[] = [
  { id: "es-prices", copy: "Hablamos Español · Desde Los $1,700's" },
  { id: "starting-prices", copy: "Starting Prices in the $1,700's" },
  {
    id: "vehicle-offer",
    copy: "2nd Vehicle Parking Free —",
    hasTerms: true,
  },
];

export default function AnnouncementBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [index, setIndex] = useState(0);
  const [showTerms, setShowTerms] = useState(false);
  const { openBookTour } = useBookTour();

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

  useEffect(() => {
    if (!showTerms) return;
    document.body.style.overflow = "hidden";
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowTerms(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEsc);
    };
  }, [showTerms]);

  const current = MESSAGES[index];
  const hasTerms = "hasTerms" in current && current.hasTerms;

  return (
    <>
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
          {hasTerms && (
            <>
              {" "}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className={`underline underline-offset-2 cursor-pointer bg-transparent border-none p-0 font-decorative text-[0.72rem] uppercase tracking-[0.15em] leading-none transition-colors duration-300 ${
                  isScrolled ? "text-city-night" : "text-clouds"
                }`}
                aria-label="See full terms for 2nd vehicle parking offer"
              >
                See Terms
              </button>
            </>
          )}
        </p>
      </div>

      {showTerms && (
        <div
          className="fixed inset-0 z-[1200] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowTerms(false);
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-xl max-w-md w-full shadow-2xl animate-[fadeInUp_0.3s_ease]"
            role="dialog"
            aria-modal="true"
            aria-label="2nd Vehicle Offer Terms"
          >
            <button
              onClick={() => setShowTerms(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-city-night/60 hover:text-city-night transition-colors cursor-pointer bg-transparent border-none text-xl"
              aria-label="Close terms"
            >
              &times;
            </button>
            <div className="p-8">
              <p className="font-decorative text-xs text-calm-waves mb-1 uppercase tracking-[0.15em]">
                Limited-Time Offer
              </p>
              <h2 className="text-2xl font-semibold text-city-night mb-4">
                2nd Vehicle Parking Free
              </h2>
              <p className="text-base text-city-night mb-6 leading-relaxed">
                Apply within 24 hours of your tour and your second parking spot
                is on us — a $125 value.
              </p>
              <p className="text-sm text-calm-waves-muted leading-relaxed mb-8">
                *2nd vehicle offer valid for 1- and 2-bedroom residences on
                floors 6–10 only. Must apply within 24 hours of your tour. A
                $125 value. Subject to availability.
              </p>
              <button
                onClick={() => {
                  setShowTerms(false);
                  openBookTour();
                }}
                className="w-full bg-deep-ocean text-clouds py-3 rounded-md font-decorative text-sm uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 hover:bg-deep-ocean-hover border-none"
              >
                Book a Tour
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
