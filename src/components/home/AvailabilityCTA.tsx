"use client";

import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import { useBookTour } from "@/context/BookTourContext";

export default function AvailabilityCTA() {
  const { ref, inView } = useInView();
  const { openBookTour } = useBookTour();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative bg-gradient-to-br from-avocado to-avocado-light text-clouds py-[clamp(4rem,15vw,8rem)] px-8 text-center overflow-hidden"
    >
      {/* Pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "url('/images/patterns/geo1-dark-blue.jpg')" }}
      />

      <div className="relative z-[1] max-w-[700px] mx-auto">
        <h2
          className={`text-[clamp(2rem,6vw,3.5rem)] font-bold mb-6 transition-all duration-800 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Find Your Home
        </h2>

        <p
          className={`text-[1.125rem] mb-10 transition-all duration-800 delay-200 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Browse available floor plans and discover the perfect space for your next chapter. Schedule your tour today and experience Metro Parc firsthand.
        </p>

        <div
          className={`flex flex-wrap gap-6 justify-center transition-all duration-800 delay-400 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <Link
            href="/availability"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-avocado rounded-[4px] font-decorative text-[0.875rem] uppercase tracking-[0.1em] no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            View Availability
          </Link>

          <button
            onClick={openBookTour}
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-[4px] font-decorative text-[0.875rem] uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 hover:bg-white hover:text-avocado"
          >
            Book a Tour
          </button>
        </div>
      </div>
    </section>
  );
}
