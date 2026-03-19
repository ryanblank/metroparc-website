import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/shared/PageHero";
import ContactForm from "@/components/contact/ContactForm";
import FAQAccordion from "@/components/shared/FAQAccordion";
import { BreadcrumbSchema, FAQPageSchema } from "../structured-data";
import { ADDRESS, PHONE, EMAIL, OFFICE_HOURS, DIRECTIONS_URL, SITE_URL } from "@/lib/constants";
import type { FAQItem } from "@/types";

export const metadata: Metadata = {
  title: "Schedule a Tour at Metro Parc Hialeah FL",
  description:
    "Contact Metro Parc at 952 E 26th St, Hialeah FL 33013. Office hours, directions, FAQs & schedule your apartment tour today.",
};

const FAQ_ITEMS: FAQItem[] = [
  // General Community
  {
    question: "What floor plan options are available at Metro Parc?",
    answer: "Metro Parc offers studio, 1-bedroom, 2-bedroom, and penthouse apartments in Hialeah, FL. Studios start at approximately 470 sq ft, and 2-bedrooms go up to 1,020 sq ft. View our availability page for current pricing.",
    category: "General Community",
  },
  {
    question: "Is Metro Parc a pet-friendly community?",
    answer: "Yes, Metro Parc is a pet-friendly community welcoming both cats and dogs.",
    category: "General Community",
  },
  // Community Amenities
  {
    question: "What fitness options are available at Metro Parc?",
    answer: "Our community features a modern fitness center equipped with Matrix gear and Peloton bikes.",
    category: "Community Amenities",
  },
  {
    question: "What work-from-home amenities does Metro Parc provide?",
    answer: "Our community offers a co-working space with private booths, a conference room, and high-speed Wi-Fi throughout the entire property.",
    category: "Community Amenities",
  },
  {
    question: "How does Metro Parc handle package deliveries?",
    answer: "Metro Parc uses Amazon Lockers for hassle-free package receiving, available to all residents.",
    category: "Community Amenities",
  },
  // Apartment Amenities
  {
    question: "Do the apartments include in-unit laundry?",
    answer: "Yes, every apartment comes with a full-size in-unit washer and dryer.",
    category: "Apartment Amenities",
  },
  {
    question: "What storage options are available inside the apartments?",
    answer: "Apartments include spacious closets with ample storage to accommodate residents' needs.",
    category: "Apartment Amenities",
  },
  // Location
  {
    question: "How close is Metro Parc to Downtown Miami and Brickell?",
    answer: "Metro Parc is near the Hialeah Metrorail and Tri-Rail Station, providing a direct and seamless commute to Downtown Miami, Brickell, and other destinations throughout the Miami metro area.",
    category: "Location",
  },
  {
    question: "How close is Metro Parc to Miami International Airport?",
    answer: "Miami International Airport is approximately 7.1 miles away, about an 18-minute drive. The airport's ground-level transit stop is even closer at just 4.6 miles. Fort Lauderdale/Hollywood International Airport is roughly a 33-minute drive.",
    category: "Location",
  },
  {
    question: "What colleges and universities are near Metro Parc?",
    answer: "Miami Dade College's North Campus is about an 8-minute drive. Miami Dade College's Hialeah Campus and Florida National College are also located nearby.",
    category: "Location",
  },
  // AI-Optimized
  {
    question: "What apartments in Hialeah are near the Metrorail?",
    answer: "Metro Parc is just 2 blocks from the Hialeah Metrorail and Tri-Rail transfer station, making it one of the closest apartment communities to public transit in Hialeah. The station provides direct service to Downtown Miami, Brickell, and connections throughout the Miami metro area.",
    category: "Location",
  },
  {
    question: "Are there pet-friendly apartments in Hialeah with a pool?",
    answer: "Yes, Metro Parc is a pet-friendly apartment community in Hialeah that welcomes both cats and dogs. The community also features a resort-style pool with private cabanas, along with a fitness center, co-working space, and 24-hour concierge service.",
    category: "General Community",
  },
  {
    question: "How much is rent at Metro Parc Hialeah?",
    answer: "Rent at Metro Parc starts at approximately $1,976 for studios, $2,098 for 1-bedrooms, and $2,616 for 2-bedrooms. Visit our availability page for the most current pricing and move-in specials.",
    category: "General Community",
  },
  {
    question: "Is Metro Parc a good place to live?",
    answer: "Metro Parc is a 559-unit luxury apartment community featuring resort-style amenities, a Peloton-equipped fitness center, co-working space, and 24-hour concierge service. Its location 2 blocks from Metrorail/Tri-Rail provides easy access to all of South Florida, while the surrounding Hialeah neighborhood offers dining, shopping, parks, and cultural attractions.",
    category: "General Community",
  },
  {
    question: "Are there luxury apartments in Hialeah with in-unit washer and dryer?",
    answer: "Yes, every apartment at Metro Parc comes standard with a full-size in-unit washer and dryer, along with luxury vinyl-wood flooring, stainless steel appliances, and 11-foot ceilings in select units.",
    category: "Apartment Amenities",
  },
];

export default function ContactPage() {
  const faqsForSchema = FAQ_ITEMS.map((faq) => ({
    question: faq.question,
    answer: faq.answer,
  }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Contact", url: `${SITE_URL}/contact` },
        ]}
      />
      <FAQPageSchema faqs={faqsForSchema} />
      <PageHero
        title="Contact Metro Parc — Schedule a Tour in Hialeah, FL"
        subtitle="We'd Love to Hear from You"
        imageSrc="/images/amenities/lobby.jpg"
        imageAlt="Metro Parc lobby and concierge area in Hialeah FL"
      />

      {/* Contact Info + Form */}
      <section className="bg-clouds py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4">
              Visit Us
            </p>
            <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-4 leading-[1.2]">
              Metro Parc Leasing Office
            </h2>
            <p className="text-city-night-light leading-[1.8] mb-8">
              <Link href="/availability" className="text-deep-ocean hover:underline">Browse available apartments</Link> before your visit, or stop by our leasing office to tour our community in person.
            </p>

            <div className="space-y-6 text-city-night">
              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-2">Address</h3>
                <p className="text-city-night-light">
                  {ADDRESS.street}<br />
                  {ADDRESS.city}, {ADDRESS.state} {ADDRESS.zip}
                </p>
                <Link
                  href={DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-deep-ocean text-sm font-medium mt-1 inline-block hover:underline"
                >
                  Get Directions →
                </Link>
              </div>

              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-2">Phone</h3>
                <a href={`tel:${PHONE.replace(/[^0-9]/g, "")}`} className="text-deep-ocean hover:underline">
                  {PHONE}
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-2">Email</h3>
                <a href={`mailto:${EMAIL}`} className="text-deep-ocean hover:underline">
                  {EMAIL}
                </a>
              </div>

              <div>
                <h3 className="font-semibold text-sm uppercase tracking-wider mb-2">Office Hours</h3>
                {OFFICE_HOURS.map((oh) => (
                  <p key={oh.days} className="text-city-night-light text-sm">
                    <span className="font-medium text-city-night">{oh.days}:</span> {oh.hours}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="bg-white py-[clamp(3rem,10vw,6rem)] px-8">
        <div className="max-w-[800px] mx-auto">
          <p className="font-decorative text-[0.875rem] tracking-[0.15em] text-avocado uppercase mb-4 text-center">
            FAQs
          </p>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-city-night mb-8 text-center leading-[1.2]">
            Frequently Asked Questions
          </h2>
          <FAQAccordion items={FAQ_ITEMS} />
        </div>
      </section>
    </>
  );
}
