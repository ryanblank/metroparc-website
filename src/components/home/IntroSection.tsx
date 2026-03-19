"use client";

import { useInView } from "@/hooks/useInView";

export default function IntroSection() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-clouds py-[clamp(3rem,12vw,8rem)] px-8 text-center"
    >
      <div
        className={`font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 transition-all duration-600 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        Welcome to Metro Parc
      </div>

      <h2
        className={`text-[clamp(1.75rem,5vw,2.75rem)] font-bold text-city-night mb-6 max-w-[600px] mx-auto leading-[1.2] transition-all duration-600 delay-100 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        Discover a New Kind of Vida
      </h2>

      <div
        className={`text-[1.125rem] text-city-night-light max-w-[700px] mx-auto leading-[1.8] transition-all duration-600 delay-200 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <p className="mb-4">
          Metro Parc places you at the pulse of Hialeah&apos;s vibrant energy, offering a lifestyle that&apos;s as connected as it is convenient. With the Metrorail/Trirail moments from your door, your commute transforms into a seamless ride to Downtown Miami, Brickell, and beyond.
        </p>
        <p>
          Metro Parc isn&apos;t just where you live—it&apos;s where life happens. It&apos;s the best of Miami&apos;s urban lifestyle, surrounded by vibrant culture and designed for those who crave modern convenience, connection, and style. This is vida in the heart of Hialeah.
        </p>
      </div>
    </section>
  );
}
