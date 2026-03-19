import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import TransitSection from "@/components/home/TransitSection";
import AmenitiesTeaser from "@/components/home/AmenitiesTeaser";
import ResidencesTeaser from "@/components/home/ResidencesTeaser";
import UnitTeaserSection from "@/components/home/UnitTeaserSection";
import type { UnitGroup } from "@/components/home/UnitTeaserSection";
import AvailabilityCTA from "@/components/home/AvailabilityCTA";
import { getListings } from "@/lib/dam-ops";

const UNIT_CONFIG: Array<{
  beds: number;
  label: string;
  video: string;
  poster: string;
}> = [
  {
    beds: 0,
    label: "Studios",
    video: "/videos/units/studio.mp4",
    poster: "/images/interiors/studio-furnished.jpg",
  },
  {
    beds: 1,
    label: "1 Bedrooms",
    video: "/videos/units/one-bed.mp4",
    poster: "/images/interiors/one-bed-furnished.jpg",
  },
  {
    beds: 2,
    label: "2 Bedrooms",
    video: "/videos/units/two-bed.mp4",
    poster: "/images/interiors/two-bed-furnished.jpg",
  },
];

function deriveUnitGroups(units: Awaited<ReturnType<typeof getListings>>[0]["units"]): UnitGroup[] {
  return UNIT_CONFIG.map((config) => {
    const matching = units.filter(
      (u) => (u.bedrooms ?? -1) === config.beds && u.price_gross != null
    );
    const prices = matching.map((u) => u.price_gross as number);
    const fromPrice = prices.length > 0 ? Math.min(...prices) : null;
    return {
      label: config.label,
      video: config.video,
      poster: config.poster,
      fromPrice,
    };
  });
}

export default async function Home() {
  const organizationId = process.env.METROPARC_ORGANIZATION_ID!;
  const buildingId = process.env.METROPARC_BUILDING_ID!;

  const buildings = await getListings(organizationId, buildingId);
  const units = buildings[0]?.units ?? [];
  const unitGroups = deriveUnitGroups(units);

  return (
    <>
      <HeroSection />
      <IntroSection />
      <TransitSection />
      <AmenitiesTeaser />
      <ResidencesTeaser />
      <UnitTeaserSection units={unitGroups} />
      <AvailabilityCTA />
    </>
  );
}
