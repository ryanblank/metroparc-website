import HeroSection from "@/components/home/HeroSection";
import IntroSection from "@/components/home/IntroSection";
import ResidencesTeaser from "@/components/home/ResidencesTeaser";
import AmenitiesTeaser from "@/components/home/AmenitiesTeaser";
import NeighborhoodTeaser from "@/components/home/NeighborhoodTeaser";
import AvailabilityCTA from "@/components/home/AvailabilityCTA";

export default function Home() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <ResidencesTeaser />
      <AmenitiesTeaser />
      <NeighborhoodTeaser />
      <AvailabilityCTA />
    </>
  );
}
