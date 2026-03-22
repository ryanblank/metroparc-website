import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import AmenitiesGrid from "@/components/amenities/AmenitiesGrid";
import { BreadcrumbSchema } from "../structured-data";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pet-Friendly Apartments with Pool & Fitness Center in Hialeah",
  description:
    "Resort-style pool, Peloton fitness center, co-working space, 24-hr concierge & pet-friendly living at Metro Parc apartments in Hialeah, FL.",
};


const ALL_COMMUNITY_AMENITIES = [
  "Modern Fitness Center with Matrix Gear & Peloton Bikes",
  "Resort-Style Pool with Private Cabanas",
  "Outdoor Grilling Stations",
  "Co-Working Space & Private Booths",
  "Clubroom with Entertainment Space",
  "24-Hour Concierge Service",
  "High-Speed Wi-Fi throughout the property",
  "Controlled Access Bike Storage",
  "Hassle-Free Package with Amazon Lockers",
  "24/7 Emergency Maintenance",
  "Controlled-Access Parking",
  "Ground-Floor Retail",
  "Resident App Powered by Alfred",
  "Easy Access to Tri-Rail & Metrorail",
  "Access to exclusive offers and perks via AlfredOS",
  "Free weekly virtual events through AlfredOS",
];


export default function AmenitiesPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Amenities", url: `${SITE_URL}/amenities` },
        ]}
      />
      <PageHero
        title="Every Detail Matters"
        subtitle="temporary filler"
        imageSrc="/images/amenities/hero-test4.jpg"
        imageAlt="Lobby and courtyard at Metro Parc apartments in Hialeah FL"
      />

      {/* Intro */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8 text-center">
        <div className="max-w-[700px] mx-auto">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4">
            Amenities
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-6 leading-[1.2]">
            Resort-Style Amenities in Hialeah
          </h2>
          <p className="text-city-night-light leading-[1.8]">
            At Metro Parc, we believe that every detail matters. That&apos;s why we&apos;ve designed a pet-friendly community that elevates your living experience with modern conveniences and stylish touches. From our resort-style pool and Peloton-equipped fitness center to the co-working space and 24-hour concierge, our amenities are tailored to meet your every need. <Link href="/residences" className="text-deep-ocean hover:underline">Browse apartment interiors and floor plans</Link> to see the full picture.
          </p>
        </div>
      </section>

      {/* Featured Amenities */}
      <section className="bg-city-night py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1200px] mx-auto">

          <div className="mb-16">
            <AmenitiesGrid />
          </div>

          {/* Full amenity list */}
          <div className="border-t border-clouds/10 pt-12">
            <h3 className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-8 text-center">
              All Community Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-[900px] mx-auto">
              {ALL_COMMUNITY_AMENITIES.map((amenity) => (
                <div key={amenity} className="flex items-start gap-3 text-clouds/80 text-sm">
                  <span className="text-avocado mt-0.5 shrink-0">✓</span>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTAs */}
      <section className="bg-deep-ocean text-clouds py-16 px-8 text-center">
        <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold mb-6">
          See It All for Yourself
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/residences"
            className="inline-flex items-center gap-2 px-8 py-4 bg-avocado text-city-night rounded-full font-decorative text-[0.875rem] uppercase tracking-[0.1em] no-underline transition-all duration-300 hover:bg-avocado-hover"
          >
            Explore Residences
          </Link>
        </div>
      </section>
    </>
  );
}
