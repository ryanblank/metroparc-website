import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import PhotoGallery from "@/components/shared/PhotoGallery";
import AmenitiesGrid from "@/components/amenities/AmenitiesGrid";
import { BreadcrumbSchema } from "../structured-data";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Pet-Friendly Apartments with Pool & Fitness Center in Hialeah",
  description:
    "Resort-style pool, Peloton fitness center, co-working space, 24-hr concierge & pet-friendly living at Metro Parc apartments in Hialeah, FL.",
};

const FEATURED_AMENITIES = [
  {
    image: "/images/amenities/pool.jpg",
    alt: "Resort-style pool deck with cabanas at Metro Parc apartments in Hialeah FL",
    name: "Resort-Style Pool",
    description: "Private cabanas and sun deck with stunning pool views",
  },
  {
    image: "/images/amenities/gym.jpg",
    alt: "Modern fitness center with Matrix gear and Peloton bikes at Metro Parc Hialeah",
    name: "Modern Fitness Center",
    description: "State-of-the-art equipment including Matrix gear and Peloton bikes",
  },
  {
    image: "/images/amenities/coworking.jpg",
    alt: "Co-working space with private offices at Metro Parc Hialeah",
    name: "Co-Working Space",
    description: "Private booths and shared workspace with high-speed Wi-Fi",
  },
  {
    image: "/images/amenities/clubhouse.jpg",
    alt: "Clubroom lounge with floor-to-ceiling windows at Metro Parc Hialeah",
    name: "Clubroom",
    description: "Upper-floor lounge with terrace views for gatherings and events",
  },
  {
    image: "/images/amenities/grilling.jpg",
    alt: "Outdoor grilling station with Coyote grill at Metro Parc apartments Hialeah",
    name: "Outdoor Grilling",
    description: "Grilling stations and outdoor kitchen for entertaining",
  },
  {
    image: "/images/amenities/game-room.jpg",
    alt: "Game room with pool table and foosball at Metro Parc Hialeah",
    name: "Game Room",
    description: "Recreation area with pool table, foosball, and social seating",
  },
];

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

const GALLERY_IMAGES = [
  { src: "/images/amenities/cabanas.jpg", alt: "Private cabana seating by the pool at Metro Parc Hialeah" },
  { src: "/images/amenities/lobby.jpg", alt: "Main lobby with ring lights and teal seating at Metro Parc" },
  { src: "/images/amenities/lobby-mural.jpg", alt: "Colorful mural behind reception desk at Metro Parc Hialeah" },
  { src: "/images/amenities/clubhouse.jpg", alt: "Upper floor lounge with terrace at Metro Parc apartments" },
  { src: "/images/amenities/gym.jpg", alt: "Fitness center with free weights and treadmills at Metro Parc" },
  { src: "/images/amenities/pool.jpg", alt: "Resort-style pool with loungers and palm trees at Metro Parc Hialeah FL" },
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
        imageSrc="/images/amenities/hero.jpg"
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

      {/* Photo Gallery */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1200px] mx-auto">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 text-center">
            Gallery
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-8 text-center leading-[1.2]">
            Experience Our Community
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
