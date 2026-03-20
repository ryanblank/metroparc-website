"use client";

import { useBookTour } from "@/context/BookTourContext";

export default function BookTourButton() {
  const { openBookTour } = useBookTour();

  return (
    <button
      onClick={openBookTour}
      className="inline-flex items-center gap-2 px-8 py-4 bg-avocado text-city-night rounded-full font-decorative text-[0.875rem] uppercase tracking-[0.1em] transition-all duration-300 hover:bg-avocado-hover"
    >
      Book a Tour
    </button>
  );
}
