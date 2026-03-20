import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/shared/PageHero";
import NeighborhoodMap from "@/components/neighborhood/NeighborhoodMap";
import BookTourButton from "@/components/residences/BookTourButton";
import { BreadcrumbSchema } from "../structured-data";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Metro Parc Neighborhood | Hialeah Apartments Near Metrorail & Downtown Miami",
  description:
    "Metro Parc is 2 blocks from the Metrorail/Tri-Rail station in Hialeah — 20 min to Downtown Miami, 25 min to Brickell, 15 min to the Health District, 13 min to Miami Airport. Studios from $1,976.",
};

const TRANSIT_STATS = [
  { number: "5 min", label: "To Metrorail / Tri-Rail" },
  { number: "15 min", label: "To Health District" },
  { number: "20 min", label: "To Downtown Miami" },
  { number: "25 min", label: "To Brickell" },
  { number: "13 min", label: "To Miami Airport" },
];

const COMMUTE_DESTINATIONS = [
  {
    place: "Health District",
    time: "15 min",
    via: "Metrorail",
    desc: "Jackson Memorial, UM Medical, Civic Center — Florida's largest healthcare corridor.",
  },
  {
    place: "Downtown Miami",
    time: "20 min",
    via: "Metrorail",
    desc: "Government Center, office towers, courthouse. Direct Green Line ride.",
  },
  {
    place: "Brickell",
    time: "25 min",
    via: "Metrorail",
    desc: "Miami's financial district. Avg studio $2,373/mo there. Metro Parc studios from $1,976.",
  },
  {
    place: "Miami Airport",
    time: "13 min",
    via: "by car",
    desc: "4 miles via Okeechobee Rd. Ideal for airline crews and frequent travelers.",
  },
  {
    place: "Doral",
    time: "10 min",
    via: "by car",
    desc: "Corporate parks, logistics hubs, and some of Miami's best restaurants.",
  },
  {
    place: "Broward County",
    time: "45 min",
    via: "Tri-Rail",
    desc: "Reverse-commute north. Tri-Rail connects directly from the transfer station.",
  },
];

const NEARBY_NEIGHBORHOODS = [
  { name: "Doral", time: "10 min drive", desc: "Corporate corridor, top-rated dining, strong job market." },
  { name: "Miami Springs", time: "8 min drive", desc: "Quiet, walkable residential neighborhood right next to MIA." },
  { name: "Miami Lakes", time: "12 min drive", desc: "Suburban charm, excellent schools, local shopping." },
  { name: "Downtown Miami", time: "20 min by rail", desc: "Business, culture, nightlife — no parking required." },
  { name: "Brickell", time: "25 min by rail", desc: "Finance district, waterfront restaurants, Mary Brickell Village." },
  { name: "Coconut Grove", time: "30 min by rail", desc: "Arts, dining, Peacock Park, and bayside living." },
];

const EMPLOYMENT_CENTERS = [
  {
    name: "Health District & Jackson Memorial",
    time: "15 min",
    via: "Metrorail",
    desc: "Florida's largest hospital and UM Medical campus. Direct Metrorail ride — no car, no parking, no stress. The Civic Center station puts you steps from the entrance.",
  },
  {
    name: "Downtown Miami",
    time: "20 min",
    via: "Metrorail",
    desc: "Government Center, courthouse, major office towers. One of Miami's largest employment corridors and a straight shot on the Green Line.",
  },
  {
    name: "Brickell Financial District",
    time: "25 min",
    via: "Metrorail",
    desc: "Finance, tech, hospitality. Average 1-bedroom in Brickell runs $3,201/mo. Metro Parc 1-bedrooms start at $2,205 — same commute, significant savings.",
  },
  {
    name: "Miami International Airport",
    time: "13 min",
    via: "by car",
    desc: "4 miles via Okeechobee Rd. One of the busiest airports in the country. Ideal for airline crews, travel industry, and anyone who flies frequently.",
  },
  {
    name: "Doral Business Parks",
    time: "10 min",
    via: "by car",
    desc: "Miami's corporate west side — logistics, pharmaceuticals, retail headquarters, and more. Some of the best office inventory in the metro area.",
  },
];

const POI_GROUPS = [
  {
    category: "Restaurants & Cafes",
    icon: "🍽",
    items: [
      "Kush by Stephens",
      "La Fresa Francesa",
      "Trigo Café Tapas Wine",
      "La Bodeguita",
      "Breadman Bakery",
      "Vicky Bakery",
    ],
  },
  {
    category: "Shopping & Services",
    icon: "🛒",
    items: [
      "Publix Super Market",
      "Hialeah Hospital",
      "Westland Mall",
      "Target",
      "Presidente Supermarket",
      "Fresco Y Mas",
    ],
  },
  {
    category: "Parks & Entertainment",
    icon: "🌳",
    items: [
      "McDonald Water Park",
      "Amelia Earhart Park",
      "AMC Hialeah 12",
      "Milander Park",
      "Babcock Park",
      "K1 Speed Indoor Go-Karts",
    ],
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

      {/* Hero */}
      <PageHero
        title="Culture and Connection"
        subtitle="filler here"
        imageSrc="/images/neighborhood/street-2.jpg"
        imageAlt="Metro Parc apartments near Metrorail and Tri-Rail station in Hialeah FL"
      />

      {/* Intro */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[800px] mx-auto text-center">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4">
            Your Neighborhood
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-6 leading-[1.2]">
            Living in Hialeah Means Being Connected to All of Miami
          </h2>
          <p className="text-city-night-light leading-[1.8]">
            Metro Parc sits two blocks from the Hialeah Metrorail and Tri-Rail Transfer Station — the only apartment community in Hialeah with this level of direct rail access. Brickell is 25 minutes away. Downtown Miami is 20. The Health District is 15. The airport is 13 minutes by car. All without touching I-95. Below that connectivity is Hialeah itself: a neighborhood with deep Cuban roots, an emerging food scene, great parks, and a Walk Score of 73. This is a place people are discovering — and Metro Parc puts you at the center of it.
          </p>
        </div>
      </section>

      {/* Full-width image break — transit */}
      <div className="relative w-full h-[320px] md:h-[420px] overflow-hidden">
        <Image
          src="/images/neighborhood/transit-rail-wide.jpg"
          alt="Hialeah Metrorail station near Metro Parc apartments"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-city-night/40" />
      </div>

      {/* Transit Stats */}
      <section className="bg-city-night text-clouds py-16 px-8">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {TRANSIT_STATS.map((stat) => (
            <div key={stat.label} className="text-center p-6">
              <div className="text-[clamp(1.5rem,4vw,2.5rem)] font-[800] text-avocado mb-2 leading-none">
                {stat.number}
              </div>
              <div className="font-decorative text-xs uppercase tracking-[0.1em] text-clouds/60 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Commute Times — image-backed */}
      <section className="relative py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="absolute inset-0">
          <Image
            src="/images/neighborhood/transit-rail.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-deep-ocean/88" />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 text-center">
            Metrorail &amp; Tri-Rail Access
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-clouds mb-4 text-center leading-[1.2]">
            Your Commute. Without the Traffic.
          </h2>
          <p className="text-clouds/60 text-center max-w-[600px] mx-auto mb-12 leading-[1.8]">
            Step out the door, walk two blocks, and board the train. Here&apos;s where it takes you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMMUTE_DESTINATIONS.map((dest) => (
              <div
                key={dest.place}
                className="border border-clouds/10 rounded-lg p-6 hover:border-avocado/40 transition-colors duration-300"
              >
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-[clamp(1.75rem,3vw,2.25rem)] font-[800] text-avocado leading-none">
                    {dest.time}
                  </span>
                  <span className="font-decorative text-[0.7rem] uppercase tracking-[0.12em] text-clouds/40">
                    {dest.via}
                  </span>
                </div>
                <p className="text-clouds font-bold text-[1rem] mb-2">{dest.place}</p>
                <p className="text-clouds/50 text-[0.85rem] leading-[1.7]">{dest.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map — full bleed */}
      <section className="bg-white py-[clamp(3rem,10vw,6rem)]">
        <div className="max-w-[1200px] mx-auto px-8 mb-8">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 text-center">
            Explore Nearby
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night text-center leading-[1.2]">
            Everything Within Reach
          </h2>
        </div>
        <NeighborhoodMap />
      </section>

      {/* Full-width image break */}
      <div className="relative w-full h-[280px] md:h-[380px] overflow-hidden">
        <Image
          src="/images/neighborhood/street-1.jpg"
          alt="Hialeah neighborhood near Metro Parc apartments"
          fill
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-city-night/30" />
      </div>

      {/* Nearby Neighborhoods */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1200px] mx-auto">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 text-center">
            Well-Connected
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-4 text-center leading-[1.2]">
            Neighboring Communities
          </h2>
          <p className="text-city-night-light text-center max-w-[600px] mx-auto mb-12 leading-[1.8]">
            Metro Parc sits at the intersection of Hialeah, Doral, and Miami Springs — with Metrorail access none of them have.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {NEARBY_NEIGHBORHOODS.map((n) => (
              <div key={n.name} className="bg-white rounded-lg p-6 border border-city-night/8">
                <p className="font-bold text-city-night text-[1.1rem] mb-1">{n.name}</p>
                <p className="font-decorative text-[0.7rem] uppercase tracking-[0.12em] text-avocado mb-3">
                  {n.time}
                </p>
                <p className="text-city-night-light text-[0.875rem] leading-[1.7]">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employment Centers */}
      <section className="bg-city-night py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1200px] mx-auto">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 text-center">
            Work From Here
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-clouds mb-4 text-center leading-[1.2]">
            Major Employment Centers Nearby
          </h2>
          <p className="text-clouds/60 text-center max-w-[600px] mx-auto mb-12 leading-[1.8]">
            Whether you work in healthcare, finance, aviation, or business — Metro Parc puts you close.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {EMPLOYMENT_CENTERS.map((emp) => (
              <div
                key={emp.name}
                className="border border-clouds/10 rounded-lg p-6 hover:border-avocado/30 transition-colors duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="font-bold text-clouds text-[1rem] leading-[1.3]">{emp.name}</p>
                  <div className="text-right shrink-0">
                    <span className="block text-avocado font-[800] text-[1.1rem] leading-none">
                      {emp.time}
                    </span>
                    <span className="font-decorative text-[0.65rem] uppercase tracking-[0.1em] text-clouds/40">
                      {emp.via}
                    </span>
                  </div>
                </div>
                <p className="text-clouds/50 text-[0.85rem] leading-[1.7]">{emp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Points of Interest */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1100px] mx-auto">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 text-center">
            Around the Corner
          </p>
          <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-city-night mb-12 text-center">
            Points of Interest Near Metro Parc
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {POI_GROUPS.map((group) => (
              <div key={group.category} className="bg-white rounded-lg p-6 border border-city-night/8">
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xl">{group.icon}</span>
                  <h3 className="font-decorative text-sm uppercase tracking-[0.12em] text-deep-ocean">
                    {group.category}
                  </h3>
                </div>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="text-[0.875rem] text-city-night-light leading-[1.6] pl-3 border-l-2 border-avocado/30"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price-Value Callout — image-backed */}
      <section className="relative py-[clamp(3rem,8vw,5rem)] px-8 text-center">
        <div className="absolute inset-0">
          <Image
            src="/images/neighborhood/street-3.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-avocado/90" />
        </div>
        <div className="relative z-10 max-w-[800px] mx-auto">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-city-night/60 uppercase mb-4">
            The Math Is Simple
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-city-night mb-6 leading-[1.2]">
            Brickell Commute. Hialeah Rent.
          </h2>
          <p className="text-city-night/70 leading-[1.8] max-w-[600px] mx-auto mb-8">
            Brickell studios average $2,373/mo. One-bedrooms average $3,201/mo. Metro Parc studios start at $1,976 — with a 25-minute Metrorail ride to the same office. That&apos;s up to $1,200/mo back in your pocket.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/availability"
              className="inline-flex items-center gap-2 px-8 py-4 bg-city-night text-clouds rounded-full font-decorative text-[0.875rem] uppercase tracking-[0.1em] no-underline transition-all duration-300 hover:bg-city-night/80"
            >
              See Available Apartments
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-deep-ocean text-clouds py-16 px-8 text-center">
        <h2 className="text-[clamp(1.5rem,4vw,2.25rem)] font-bold mb-3">
          Make Hialeah Your Home
        </h2>
        <p className="text-clouds/60 mb-8 font-body">
          Come see the neighborhood — and the apartment — for yourself.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <BookTourButton />
          <Link
            href="/availability"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent text-clouds border border-clouds/40 rounded-full font-decorative text-[0.875rem] uppercase tracking-[0.1em] no-underline transition-all duration-300 hover:border-clouds/80 hover:bg-clouds/[0.08]"
          >
            View Availability
          </Link>
        </div>
      </section>
    </>
  );
}
