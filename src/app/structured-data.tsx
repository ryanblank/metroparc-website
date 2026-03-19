import { SITE_URL, ADDRESS, PHONE, EMAIL, OFFICE_HOURS } from "@/lib/constants";

export function ApartmentComplexSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    name: "Metro Parc",
    description:
      "559-unit luxury apartment community in Hialeah, FL, two blocks from the Metrorail/Tri-Rail transfer station. Studios, 1 & 2-bedroom apartments with resort-style pool, fitness center, co-working space, and 24-hour concierge.",
    url: SITE_URL,
    image: `${SITE_URL}/images/exterior/exterior-render.jpg`,
    logo: `${SITE_URL}/images/logos/MetroParc__Horizontal.png`,
    telephone: PHONE,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: ADDRESS.street,
      addressLocality: ADDRESS.city,
      addressRegion: ADDRESS.state,
      postalCode: ADDRESS.zip,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.846063,
      longitude: -80.263033,
    },
    numberOfAvailableAccommodation: 559,
    petsAllowed: true,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Resort-Style Pool with Private Cabanas", value: true },
      { "@type": "LocationFeatureSpecification", name: "Modern Fitness Center with Matrix Gear & Peloton Bikes", value: true },
      { "@type": "LocationFeatureSpecification", name: "Co-Working Space with Private Booths", value: true },
      { "@type": "LocationFeatureSpecification", name: "24-Hour Concierge Service", value: true },
      { "@type": "LocationFeatureSpecification", name: "Clubroom with Entertainment Space", value: true },
      { "@type": "LocationFeatureSpecification", name: "Outdoor Courtyard with Grills", value: true },
      { "@type": "LocationFeatureSpecification", name: "High-Speed Wi-Fi Throughout Property", value: true },
      { "@type": "LocationFeatureSpecification", name: "Controlled Access Bike Storage", value: true },
      { "@type": "LocationFeatureSpecification", name: "Amazon Lockers for Package Delivery", value: true },
      { "@type": "LocationFeatureSpecification", name: "In-Unit Washer & Dryer", value: true },
      { "@type": "LocationFeatureSpecification", name: "Controlled-Access Parking", value: true },
      { "@type": "LocationFeatureSpecification", name: "Ground-Floor Retail", value: true },
    ],
    containsPlace: [
      { "@type": "Apartment", name: "Studio", numberOfRooms: 1 },
      { "@type": "Apartment", name: "1 Bedroom", numberOfRooms: 2 },
      { "@type": "Apartment", name: "2 Bedroom", numberOfRooms: 3 },
      { "@type": "Apartment", name: "Penthouse (The Heights)", numberOfRooms: 3 },
    ],
    openingHoursSpecification: OFFICE_HOURS.map((oh) => {
      const allDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      let dayOfWeek: string[];
      if (oh.days.includes(" - ")) {
        const [startDay, endDay] = oh.days.split(" - ");
        const startIdx = allDays.indexOf(startDay);
        const endIdx = allDays.indexOf(endDay);
        dayOfWeek = startIdx >= 0 && endIdx >= 0
          ? allDays.slice(startIdx, endIdx + 1)
          : [oh.days];
      } else {
        dayOfWeek = [oh.days];
      }
      const [opens, closes] = oh.hours.split(" - ");
      return {
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek,
        opens,
        closes,
      };
    }),
    areaServed: [
      { "@type": "City", name: "Hialeah" },
      { "@type": "City", name: "Miami" },
    ],
    dateModified: new Date().toISOString().split("T")[0],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function FAQPageSchema({ faqs }: { faqs: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
