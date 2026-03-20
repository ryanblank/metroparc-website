import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import ListingsSection from "@/components/availability/ListingsSection";
import { BreadcrumbSchema } from "../structured-data";
import { SITE_URL } from "@/lib/constants";
import { getListings } from "@/lib/dam-ops";

export const metadata: Metadata = {
  title: "Apartments for Rent in Hialeah FL \u2014 Pricing & Availability",
  description:
    "View available apartments at Metro Parc Hialeah. Studios from ~$1,976, 1-beds from ~$2,098, 2-beds from ~$2,616. Floor plans, 3D tours & move-in specials.",
};

export default async function AvailabilityPage() {
  const organizationId = process.env.METROPARC_ORGANIZATION_ID!;
  const buildingId = process.env.METROPARC_BUILDING_ID!;

  const buildings = await getListings(organizationId, buildingId);
  const units = buildings[0]?.units ?? [];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Availability", url: `${SITE_URL}/availability` },
        ]}
      />
      <PageHero
        title="See What's Available"
        subtitle="Find Your Perfect Fit"
        imageSrc="/images/exterior/exterior-render.jpg"
        imageAlt="Metro Parc apartments for rent in Hialeah FL with pricing and availability"
        showScrollIndicator
      />

      {/* Listings */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1200px] mx-auto">
          <ListingsSection units={units} />
          <p className="text-city-night-light/60 text-center text-sm mt-8 max-w-[600px] mx-auto">
            Floor plans are artist&apos;s rendering. All dimensions are approximate. Prices and availability are subject to change.
          </p>
        </div>
      </section>
    </>
  );
}
