import type { Metadata } from "next";
import PageHero from "@/components/shared/PageHero";
import { BreadcrumbSchema } from "../structured-data";
import { SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Workforce Housing Units",
  description:
    "Metro Parc participates in the Miami Dade County Workforce Housing Program. Learn about eligibility requirements and designated units available in Hialeah, FL.",
};

export default function WorkforceHousingPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Workforce Housing", url: `${SITE_URL}/workforce-housing` },
        ]}
      />

      <PageHero
        title="Workforce Housing Units"
        imageSrc="/images/exterior/workforce-housing-hero.jpg"
        imageAlt="Metro Parc apartments in Hialeah FL"
      />

      {/* Content */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[700px] mx-auto">

          {/* Program Overview */}
          <div className="mb-12">
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-city-night mb-4 leading-[1.2]">
              Workforce Housing Program
            </h2>
            <p className="text-city-night-light leading-[1.8]">
              Metro Parc participates in the Miami Dade County Workforce Housing Program. We offer designated units for this program subject to County requirements
            </p>
          </div>

          <hr className="border-city-night/10 mb-12" />

          {/* Eligibility */}
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2rem)] font-bold text-city-night mb-4 leading-[1.2]">
              Eligibility Requirements:
            </h2>
            <p className="text-city-night-light leading-[1.8] mb-6">
              To qualify for Metro Parc Workforce Housing Program, applicants must meet the following criteria:
            </p>
            <ul className="space-y-3 text-city-night-light leading-[1.8]">
              <li className="flex items-start gap-3">
                <span className="text-avocado mt-0.5 shrink-0">&#8226;</span>
                <span>At least one lease-holding resident must be employed within Palm Beach County.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-avocado mt-0.5 shrink-0">&#8226;</span>
                <span>Every household member aged 18 or older must submit an application.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-avocado mt-0.5 shrink-0">&#8226;</span>
                <span>Income verification documents are required for each applicant and may include:</span>
              </li>
            </ul>
            <ul className="space-y-2 text-city-night-light leading-[1.8] ml-10 mt-2">
              <li className="flex items-start gap-3">
                <span className="text-calm-waves mt-0.5 shrink-0">–</span>
                <span>W-2 forms</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-calm-waves mt-0.5 shrink-0">–</span>
                <span>Recent pay stubs</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-calm-waves mt-0.5 shrink-0">–</span>
                <span>Banking statements</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-calm-waves mt-0.5 shrink-0">–</span>
                <span>Other financial information deemed necessary by the landlord to verify eligibility</span>
              </li>
            </ul>
          </div>

        </div>
      </section>
    </>
  );
}
