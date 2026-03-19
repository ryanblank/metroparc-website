import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import PhotoGallery from "@/components/shared/PhotoGallery";
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
  "LED Lighting Throughout Units",
  "11' Foot Ceilings *",
  "Spacious Closets with Ample Storage",
  "Large Windows with Natural Light",
];

const HEIGHTS_FEATURES = [
  "Stunning top-floor perspectives of Hialeah and Miami's iconic skyline",
  "Ring Camera",
  "Modern Chandelier Fixture",
  "Era 100 Wireless Speaker",
  "Ecobee Smart Thermostat",
  "Fireplace",
  "Credit toward move-in expenses",
  "Waived Administrative and application fees (Up to $725)",
];

const GALLERY_IMAGES = [
  { src: "/images/interiors/living-room-styled.jpg", alt: "Styled living room with dark accent wall and luxury vinyl flooring at Metro Parc Hialeah" },
  { src: "/images/interiors/kitchen-dining.jpg", alt: "Kitchen and dining area with stainless steel appliances at Metro Parc apartments" },
  { src: "/images/interiors/living-open.jpg", alt: "Open-concept floor plan with vinyl wood floors at Metro Parc Hialeah FL" },
  { src: "/images/interiors/kitchen-clean.jpg", alt: "Modern kitchen with wood cabinets and stainless appliances at Metro Parc" },
  { src: "/images/interiors/bedroom.jpg", alt: "Spacious bedroom with balcony access at Metro Parc apartments Hialeah" },
  { src: "/images/interiors/bathroom-laundry.jpg", alt: "Bathroom with in-unit washer and dryer at Metro Parc Hialeah FL" },
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
      <PageHero
        title="Studio, 1 & 2-Bedroom Apartments in Hialeah, FL"
        subtitle="A New Standard of Living"
        imageSrc="/images/interiors/living-room-styled.jpg"
        imageAlt="Styled luxury apartment living room at Metro Parc studio and 1 & 2-bedroom apartments in Hialeah FL"
        videoSrc={process.env.NEXT_PUBLIC_RESIDENCES_VIDEO_URL}
      />

      {/* Interiors Overview */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4">
              Your Apartment
            </p>
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-6 leading-[1.2]">
              A New Standard of Living
            </h2>
            <p className="text-city-night-light leading-[1.8] mb-8">
              Metro Parc offers studio, 1-bedroom, and 2-bedroom apartments in Hialeah, FL with premium finishes, expansive windows flooding natural light, and open-concept layouts. From luxury vinyl-wood flooring to spa-inspired bathrooms with in-unit laundry, our floor plans adapt to your lifestyle. Residents also enjoy <Link href="/amenities" className="text-deep-ocean hover:underline">resort-style amenities</Link> including a pool, fitness center, and co-working space.
            </p>

            <ul className="space-y-3">
              {UNIT_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-city-night">
                  <span className="text-avocado mt-1 shrink-0">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/images/interiors/kitchen-dining.jpg"
              alt="Kitchen and dining area with stainless steel appliances and balcony at Metro Parc Hialeah"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* The Heights at Metro Parc — Penthouses */}
      <section id="penthouses" className="bg-city-night text-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px] rounded-lg overflow-hidden order-2 lg:order-1">
              <Image
                src="/images/interiors/penthouse-banner.jpg"
                alt="The Heights penthouse residences with skyline views at Metro Parc Hialeah"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            <div className="order-1 lg:order-2">
              <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4">
                Premium Collection
              </p>
              <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold mb-2 leading-[1.2]">
                The Heights at Metro Parc
              </h2>
              <p className="font-display text-[clamp(1.25rem,2.5vw,1.75rem)] text-avocado-light mb-6">
                Where the Skyline Meets the Rail Line.
              </p>
              <p className="text-calm-waves-light leading-[1.8] mb-8">
                Live at the Heart of Hialeah. These select penthouse residences offer more than just a place to live — they immerse you in the vibrant rhythm of Hialeah&apos;s cultural core while keeping you seamlessly connected to all of South Florida via the nearby Metrorail and Tri-Rail. <Link href="/availability" className="text-avocado hover:underline">Check availability for penthouse units</Link>.
              </p>

              <ul className="space-y-3 mb-8">
                {HEIGHTS_FEATURES.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="text-avocado mt-1 shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/availability"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-avocado text-city-night rounded-full font-decorative text-[0.85rem] uppercase tracking-[0.1em] no-underline transition-all duration-300 hover:bg-avocado-hover"
                >
                  View Available Apartments
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1200px] mx-auto">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 text-center">
            Gallery
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-8 text-center leading-[1.2]">
            See Inside Metro Parc
          </h2>
          <PhotoGallery
            images={GALLERY_IMAGES}
            columns={3}
            initialCount={6}
          />
        </div>
      </section>

      {/* CTAs */}
      <section className="bg-deep-ocean text-clouds py-16 px-8 text-center">
        <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold mb-6">
          Ready to See Your New Home?
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/availability"
            className="inline-flex items-center gap-2 px-8 py-4 bg-avocado text-city-night rounded-full font-decorative text-[0.875rem] uppercase tracking-[0.1em] no-underline transition-all duration-300 hover:bg-avocado-hover"
          >
            View Available Apartments
          </Link>
        </div>
      </section>
    </>
  );
}
