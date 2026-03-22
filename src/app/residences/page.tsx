import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import BookTourButton from "@/components/residences/BookTourButton";
import { BreadcrumbSchema } from "../structured-data";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Studio, 1 & 2 Bedroom Apartments Hialeah FL",
  description:
    "Explore studio, 1 & 2-bedroom floor plans plus The Heights penthouse residences at Metro Parc. 11-ft ceilings, in-unit laundry & luxury finishes.",
};

const UNIT_FEATURES = [
  "Open-Concept Floor Plans",
  "Luxury Vinyl-Wood Flooring",
  "Stainless Steel Appliances",
  "Ceramic Tile Backsplash",
  "Full-Size Washer & Dryer",
  "LED Lighting Throughout",
  "11' Foot Ceilings *",
  "Spacious Closets with Ample Storage",
  "Large Windows with Natural Light",
];


const HEIGHTS_FEATURES = [
  "Top-floor perspectives of Hialeah & Miami's skyline",
  "Ring Video Doorbell",
  "Modern Chandelier Fixture",
  "Era 100 Wireless Speaker",
  "Ecobee Smart Thermostat",
  "Electric Fireplace",
  "Credit toward move-in expenses",
  "Waived administrative & application fees (up to $725)",
];


const INTERIOR_PHOTOS = [
  { src: "/images/interiors/living-room-reading.jpg", alt: "Relaxing in a styled living room at Metro Parc Hialeah", span: "col-span-2 row-span-2" },
  { src: "/images/interiors/kitchen-dining.jpg",      alt: "Kitchen and dining area at Metro Parc",               span: "" },
  { src: "/images/interiors/living-open.jpg",         alt: "Open-concept living at Metro Parc Hialeah",           span: "" },
  { src: "/images/interiors/kitchen-lifestyle.jpg",   alt: "Modern kitchen at Metro Parc",                        span: "" },
  { src: "/images/interiors/bedroom-furnished.jpg",   alt: "Furnished bedroom at Metro Parc",                     span: "" },
  { src: "/images/interiors/bathroom-laundry.jpg",    alt: "Bathroom with in-unit laundry at Metro Parc",         span: "" },
];

export default function ResidencesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Residences", url: `${SITE_URL}/residences` },
        ]}
      />

      {/* Hero */}
      <PageHero
        title="Designed Around You"
        subtitle="Discover a New Kind of Vida"
        imageSrc="/images/interiors/residences-hero.jpg"
        imageAlt="Luxury apartment living room at Metro Parc in Hialeah FL"
      />

      {/* Residences overview */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1200px] mx-auto">

          {/* Centered header */}
          <div className="text-center mb-10">
            <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4">
              Residences
            </p>
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-6 leading-[1.2]">
              Studio, 1 &amp; 2-Bedrooms
            </h2>
            <p className="text-city-night-light leading-[1.8] max-w-2xl mx-auto">
              Premium finishes, expansive windows, and open-concept layouts built for real living.
              From luxury vinyl-wood flooring to spa-inspired bathrooms with in-unit laundry, every
              detail is considered. Residents also enjoy{" "}
              <Link href="/amenities" className="text-deep-ocean hover:underline">
                resort-style amenities
              </Link>{" "}
              including a pool, fitness center, and co-working space.
            </p>
          </div>

          {/* Asymmetric photo grid — stacks on mobile, asymmetric at md+ */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:grid-rows-[280px_280px_240px]">
            {/* Large anchor image — full width on mobile, spans 2 cols × 2 rows on desktop */}
            <div className="relative h-[320px] md:h-auto md:col-span-2 md:row-span-2 overflow-hidden">
              <Image
                src={INTERIOR_PHOTOS[0].src}
                alt={INTERIOR_PHOTOS[0].alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 66vw"
                priority
              />
            </div>
            {/* Stacked right column */}
            {INTERIOR_PHOTOS.slice(1, 3).map((img) => (
              <div key={img.src} className="relative h-[260px] md:h-auto overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
            {/* Bottom row — 3 equal images */}
            {INTERIOR_PHOTOS.slice(3).map((img) => (
              <div key={img.src} className="relative h-[260px] md:h-auto overflow-hidden">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            ))}
          </div>

          {/* Feature list — 3-column compact grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 mt-10">
            {UNIT_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-2 text-city-night text-[0.9rem]">
                <span className="text-avocado shrink-0">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* The Heights — Penthouses */}
      <section id="the-heights" className="bg-deep-ocean text-clouds overflow-hidden">

        {/* Header */}
        <div className="pt-[clamp(3rem,10vw,6rem)] pb-12 px-8 text-center">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4">
            Premium Penthouse Collection
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold mb-6 leading-[1.2]">
            The Heights at Metro Parc
          </h2>
          <p className="text-clouds/75 leading-[1.9] text-[1.05rem] max-w-2xl mx-auto">
            Live at the heart of Hialeah. These select top-floor residences offer more than a
            place to live — they immerse you in Hialeah&apos;s vibrant cultural energy while
            keeping you seamlessly connected to all of South Florida via the nearby Metrorail
            and Tri-Rail.
          </p>
        </div>

        {/* Full-width video */}
        <div className="w-full" style={{ height: "60vh" }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            className="w-full h-full object-cover"
          >
            <source src={process.env.NEXT_PUBLIC_RESIDENCES_VIDEO_URL} type="video/mp4" />
          </video>
        </div>

        {/* Body copy + feature grid */}
        <div className="px-8 py-[clamp(3rem,8vw,5rem)]">
          <div className="max-w-[1200px] mx-auto">

            {/* Cursive tagline */}
            <p className="font-display text-[clamp(1.1rem,2.5vw,1.5rem)] text-avocado-light text-center mb-10">
              Where the Skyline Meets the Rail Line.
            </p>

            {/* 3-col feature grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-3 mb-12">
              {HEIGHTS_FEATURES.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-clouds/80 text-[0.9rem]">
                  <span className="text-avocado shrink-0">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </section>


      {/* CTA */}
      <section className="bg-deep-ocean text-clouds py-16 px-8 text-center">
        <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold mb-6">
          Ready to See Your New Home?
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <BookTourButton />
        </div>
      </section>
    </>
  );
}
