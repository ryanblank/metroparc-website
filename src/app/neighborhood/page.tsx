import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import NeighborhoodMap from "@/components/neighborhood/NeighborhoodMap";
import { BreadcrumbSchema } from "../structured-data";
import { PROPERTY_STATS, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Apartments Near Metrorail & Tri-Rail Hialeah FL",
  description:
    "Metro Parc is 2 blocks from the Metrorail/Tri-Rail station in Hialeah. 20 min to Downtown Miami & Brickell. Walk Score 73. Dining, parks & shopping steps away.",
};

const TRANSIT_STATS = [
  { number: "2 blocks", label: "To Metrorail / Tri-Rail" },
  { number: `${PROPERTY_STATS.downtownMiamiTime}`, label: "To Downtown Miami" },
  { number: `${PROPERTY_STATS.airportDistance}`, label: "To MIA Airport" },
  { number: `${PROPERTY_STATS.walkScore}`, label: "Walk Score — Very Walkable" },
];

const POI_GROUPS = [
  {
    category: "Restaurants & Cafes",
    items: ["Kush", "La Fresa Francesa", "Trigo Cafe Tapas Wine", "La Bodeguita", "Breadman Bakery", "Vicky Bakery"],
  },
  {
    category: "Shopping & Conveniences",
    items: ["Publix Super Market", "Hialeah Hospital", "Westland Mall", "Target", "Presidente Supermarket", "Fresco Y Mas"],
  },
  {
    category: "Parks & Entertainment",
    items: ["McDonald Water Park", "Amelia Earhart Park", "AMC 12", "Milander Park", "Babcock Park", "K1 Speed - Indoor Go Karts"],
  },
];

export default function NeighborhoodPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Neighborhood", url: `${SITE_URL}/neighborhood` },
        ]}
      />
      <PageHero
        title="Apartments 2 Blocks from Metrorail in Hialeah, FL"
        subtitle="At the Crossroads of Culture and Connection"
        imageSrc="/images/exterior/corner-view.jpg"
        imageAlt="Metro Parc apartments near Metrorail and Tri-Rail station in Hialeah FL"
      />

      {/* Intro */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4">
            Your Neighborhood
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-6 leading-[1.2]">
            At the Crossroads of Culture and Connection
          </h2>
          <p className="text-city-night-light leading-[1.8] mb-4">
            Metro Parc is a transit-connected apartment community just two blocks from the Hialeah Metrorail and Tri-Rail transfer station, placing you at the heart of it all. Hialeah&apos;s vibrant energy surrounds you, blending rich tradition with modern convenience. You&apos;re effortlessly connected to Downtown Miami and Brickell in about 20 minutes while staying rooted in a neighborhood full of charm and character. <Link href="/amenities" className="text-deep-ocean hover:underline">On-site amenities complement the neighborhood</Link> with resort-style living.
          </p>
          <p className="text-city-night-light leading-[1.8]">
            From mornings at local cafes to afternoons at Amelia Earhart Park, shopping at Westland Mall, or catching a thrill at K1 Speed - Indoor Go Karts, life here flows seamlessly. Whether you&apos;re savoring the area&apos;s iconic cuisine, exploring cultural landmarks like Hialeah Park Racetrack, or unwinding in your modern apartment, Metro Parc lets you experience a lifestyle that&apos;s as lively as it is convenient. <Link href="/availability" className="text-deep-ocean hover:underline">Find your apartment near Metrorail</Link>.
          </p>
        </div>
      </section>

      {/* Transit Stats */}
      <section className="bg-city-night text-clouds py-16 px-8">
        <div className="max-w-[1000px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {TRANSIT_STATS.map((stat) => (
            <div key={stat.label} className="text-center p-6">
              <div className="text-[clamp(1.5rem,4vw,2.5rem)] font-[800] text-avocado mb-2">
                {stat.number}
              </div>
              <div className="font-decorative text-xs uppercase tracking-[0.1em] text-calm-waves-light">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Map */}
      <section className="bg-white py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1200px] mx-auto">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 text-center">
            Explore Nearby
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-8 text-center leading-[1.2]">
            Everything Within Reach
          </h2>
          <NeighborhoodMap />
        </div>
      </section>

      {/* Points of Interest Text */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-city-night mb-8 text-center">
            Points of Interest Near Metro Parc
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {POI_GROUPS.map((group) => (
              <div key={group.category}>
                <h3 className="font-decorative text-sm uppercase tracking-[0.1em] text-deep-ocean mb-4">
                  {group.category}
                </h3>
                <ul className="space-y-2">
                  {group.items.map((item) => (
                    <li key={item} className="text-sm text-city-night-light">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAs */}
      <section className="bg-deep-ocean text-clouds py-16 px-8 text-center">
        <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold mb-6">
          Make Hialeah Your Home
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
