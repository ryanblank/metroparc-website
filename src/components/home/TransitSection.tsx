"use client";

import Link from "next/link";
import Image from "next/image";

export default function TransitSection() {
  return (
    <section className="relative h-[70vh] min-h-[480px] flex items-center justify-center overflow-hidden">
      {/* Full-bleed background image */}
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/neighborhood/transit-lifestyle.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Dark gradient overlay — heavier at bottom where text sits */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(4,85,113,0.25) 0%, rgba(4,85,113,0.55) 60%, rgba(4,85,113,0.75) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-[2] text-center text-white px-8 max-w-[800px] mx-auto">
        <div className="font-decorative text-[0.8rem] tracking-[0.2em] text-avocado-light uppercase mb-4 opacity-90">
          5 min to Metrorail · 20 min to Downtown Miami
        </div>

        <h2 className="text-[clamp(2rem,6vw,3.5rem)] font-bold leading-[1.15] mb-6 text-white">
          Effortless Commutes,<br />Endless Connections
        </h2>

        <p className="text-[1.0625rem] leading-[1.8] mb-8 opacity-90 max-w-[560px] mx-auto">
          Step out your door and onto the Metrorail in minutes. Downtown Miami,
          Brickell, Coconut Grove — your entire city is seamlessly within reach.
        </p>

        <Link
          href="/neighborhood"
          className="inline-flex items-center gap-2 text-white font-decorative text-[0.85rem] uppercase tracking-[0.12em] border-b border-white/60 pb-1 no-underline transition-all duration-300 hover:gap-4 hover:border-white"
        >
          View Neighborhood <span>→</span>
        </Link>
      </div>
    </section>
  );
}
