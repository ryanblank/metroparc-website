// ===== SITE-WIDE CONSTANTS =====

export const SITE_NAME = "Metro Parc";
export const SITE_URL = "https://metroparchialeah.com";
export const SITE_TAGLINE = "Tu Vida, Connected.";

// ===== CONTACT INFO =====
export const ADDRESS = {
  street: "952 East 26th Street",
  city: "Hialeah",
  state: "FL",
  zip: "33013",
  full: "952 East 26th Street, Hialeah, FL 33013",
};

// Placeholder — Funnel DNI will replace dynamically
export const PHONE = "(305) 614-9674";
export const EMAIL = "info@metroparchialeah.com";

export const DIRECTIONS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=952+East+26th+Street+Hialeah+FL+33013";

// ===== OFFICE HOURS =====
export const OFFICE_HOURS = [
  { days: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
  { days: "Saturday", hours: "10:00 AM - 5:00 PM" },
  { days: "Sunday", hours: "12:00 PM - 5:00 PM" },
];

// ===== SOCIAL LINKS =====
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/metroparchialeah",
  instagram: "https://www.instagram.com/metroparchialeah",
};

// ===== NAVIGATION =====
export const NAV_ITEMS = [
  { label: "Residences", href: "/residences" },
  { label: "Amenities", href: "/amenities" },
  { label: "Neighborhood", href: "/neighborhood" },
  { label: "Availability", href: "/availability" },
  { label: "Contact", href: "/contact" },
] as const;

export const NAV_CTAS = {
  availability: { label: "Availability", href: "/availability" },
  bookTour: { label: "Book a Tour", href: "#book-tour" },
} as const;

// ===== FUNNEL API =====
export const FUNNEL_GROUP_ID = 7380;
export const FUNNEL_DISCOVERY_SOURCE = 20; // Property Website
export const FUNNEL_CLIENT_REFERRAL = "Metroparc Website";

// ===== MOVE-IN TIMELINE OPTIONS =====
export const MOVE_IN_OPTIONS = [
  { value: "immediately", label: "Immediately" },
  { value: "1-2-months", label: "1-2 Months" },
  { value: "3-6-months", label: "3-6 Months" },
  { value: "6-plus-months", label: "6+ Months" },
] as const;

// ===== BEDROOM OPTIONS =====
export const BEDROOM_OPTIONS = [
  { value: "0", label: "Studio" },
  { value: "1", label: "1 Bedroom" },
  { value: "2", label: "2 Bedrooms" },
  { value: "3", label: "3+ Bedrooms" },
] as const;

// ===== PRICE RANGE OPTIONS =====
export const PRICE_RANGE_OPTIONS = [
  { value: "0-2500", label: "Under $2,500" },
  { value: "2500-3000", label: "$2,500 - $3,000" },
  { value: "3000-3500", label: "$3,000 - $3,500" },
  { value: "3500-4000", label: "$3,500 - $4,000" },
  { value: "4000-4500", label: "$4,000 - $4,500" },
  { value: "4500-5000", label: "$4,500 - $5,000" },
  { value: "5000-5500", label: "$5,000 - $5,500" },
  { value: "5500-6000", label: "$5,500 - $6,000" },
  { value: "6000-99999", label: "$6,000+" },
] as const;

// ===== GTM EVENTS =====
export const GTM_EVENTS = {
  listingsLead: { event: "dam_listings_lead", conversion_value: 50 },
  tourLead: { event: "dam_tour_lead", conversion_value: 200 },
  registration: { event: "dam_registration", conversion_value: 100 },
} as const;

// ===== PROPERTY STATS =====
export const PROPERTY_STATS = {
  units: 559,
  stories: 10,
  walkScore: 73,
  metrorailDistance: "2 blocks",
  downtownMiamiTime: "20 min",
  airportDistance: "18 min",
} as const;

// ===== FOOTER LINKS =====
export const FOOTER_LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Pet Policy", href: "#" },
] as const;
