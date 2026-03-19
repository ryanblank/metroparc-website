import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import TransitSection from "@/components/home/TransitSection";
import AmenitiesTeaser from "@/components/home/AmenitiesTeaser";
import ResidencesTeaser from "@/components/home/ResidencesTeaser";
import NeighborhoodTeaser from "@/components/home/NeighborhoodTeaser";
import AvailabilityCTA from "@/components/home/AvailabilityCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <TransitSection />
      <AmenitiesTeaser />
      <ResidencesTeaser />
      <NeighborhoodTeaser />
      <AvailabilityCTA />
    </>
  );
}
