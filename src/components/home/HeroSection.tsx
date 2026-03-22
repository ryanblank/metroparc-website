"use client";

import { useBookTour } from "@/context/BookTourContext";

export default function HeroSection() {
  const { openBookTour } = useBookTour();

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-city-night to-deep-ocean">
      {/* Hero video with image fallback */}
      {process.env.NEXT_PUBLIC_HERO_VIDEO_URL ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/exterior/exterior-render.jpg"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={process.env.NEXT_PUBLIC_HERO_VIDEO_URL} type="video/mp4" />
        </video>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{ backgroundImage: "url('/images/exterior/exterior-render.jpg')" }}
        />
      )}

      {/* Gradient overlay — transparent top, brand teal bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-city-night/70 via-city-night/10 to-transparent z-[1]" />

      {/* Content */}
      <div className="relative z-[2] text-center text-clouds max-w-[90%]">
        <h1 className="font-decorative text-[clamp(2rem,8vw,4rem)] font-[800] tracking-[0.2em] uppercase mb-4 animate-[fadeInUp_0.8s_ease_forwards]">
          Metro Parc
        </h1>
        <p className="font-display text-[clamp(1.5rem,4vw,3rem)] text-avocado-light animate-[fadeInUp_0.8s_ease_forwards_0.2s] [animation-fill-mode:backwards]">
          Tu Vida, Connected.
        </p>
        <div className="mt-8">
          <button
            onClick={openBookTour}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-avocado text-city-night rounded-full font-decorative text-[0.85rem] uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 hover:bg-avocado-hover hover:-translate-y-0.5 border-none"
          >
            Book a Tour
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[2] animate-bounce">
        <div className="text-clouds text-2xl opacity-70">↓</div>
      </div>
    </section>
  );
}
