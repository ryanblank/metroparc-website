"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";

export interface UnitGroup {
  label: string;
  video: string;
  poster: string;
  image?: string;
  fromPrice: number | null;
}

interface UnitTeaserSectionProps {
  units: UnitGroup[];
}

interface VideoCardProps {
  unit: UnitGroup;
  delay: number;
  sectionInView: boolean;
}

function formatPrice(price: number): string {
  return `$${price.toLocaleString("en-US")}`;
}

function VideoCard({ unit, delay, sectionInView }: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      href="/availability"
      className={`group relative overflow-hidden rounded-lg no-underline transition-all duration-600 ${
        sectionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
      style={{ transitionDelay: sectionInView ? `${delay}ms` : "0ms" }}
    >
      {/* Image or Video */}
      <div className="relative h-[260px] overflow-hidden bg-city-night">
        {unit.image ? (
          <Image
            src={unit.image}
            alt={unit.label}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 33vw"
          />
        ) : (
          <video
            ref={videoRef}
            src={unit.video}
            poster={unit.poster}
            muted
            loop
            playsInline
            preload="none"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-city-night/80 via-transparent to-transparent" />
      </div>

      {/* Card content */}
      <div className="bg-city-night-muted px-5 py-4">
        <h3 className="text-clouds font-bold text-lg leading-tight mb-1">
          {unit.label}
        </h3>
        {unit.fromPrice ? (
          <p className="text-clouds/60 text-sm">
            Starting from{" "}
            <span className="text-avocado font-bold">
              {formatPrice(unit.fromPrice)}
            </span>
            <span className="text-clouds/50 text-xs">/mo</span>
          </p>
        ) : (
          <p className="text-clouds/50 text-sm">Contact us</p>
        )}

      </div>
    </Link>
  );
}

export default function UnitTeaserSection({ units }: UnitTeaserSectionProps) {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-city-night py-[clamp(3rem,10vw,6rem)] px-8"
    >
      {/* Header */}
      <div className="text-center mb-12">
        <div
          className={`font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 transition-all duration-600 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Now Leasing
        </div>
        <h2
          className={`text-[clamp(1.75rem,5vw,2.75rem)] font-bold text-clouds mb-3 transition-all duration-600 delay-100 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          Find Your Home
        </h2>
      </div>

      {/* Unit cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[1100px] mx-auto mb-10">
        {units.map((unit, i) => (
          <VideoCard
            key={unit.label}
            unit={unit}
            delay={200 + i * 100}
            sectionInView={inView}
          />
        ))}
      </div>

      {/* CTA */}
      <div
        className={`text-center transition-all duration-600 delay-500 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        <Link
          href="/availability"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-avocado text-city-night rounded-full font-decorative text-[0.85rem] uppercase tracking-[0.1em] no-underline transition-all duration-300 hover:bg-avocado-hover hover:-translate-y-0.5"
        >
          View Live Availability <span>→</span>
        </Link>
      </div>
    </section>
  );
}
