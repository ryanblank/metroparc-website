// ===== FUNNEL API TYPES =====

export interface FunnelPerson {
  first_name: string;
  last_name: string;
  email: string;
  phone_1?: string;
  phone_2?: string;
  is_primary?: boolean;
}

export interface FunnelLeadPayload {
  client: {
    people: FunnelPerson[];
    group: number;
    move_in_date?: string;
    notes?: string;
    client_referral?: string;
    discovery_source?: number;
    price_floor?: number;
    price_ceiling?: number;
    campaign_id?: string;
    campaign_info?: string;
  };
}

export interface FunnelBookingPayload {
  appointment: {
    start: string;
    tour_type?: string;
    location?: string;
    broker_booked?: boolean;
    is_video_tour?: boolean;
  };
  client: {
    people: FunnelPerson[];
    group: number;
    move_in_date?: string;
    price_floor?: string;
    price_ceiling?: string;
    notes?: string;
    sms_opted_in?: string;
    discovery_source?: number;
    client_referral?: string;
  };
}

export interface FunnelAvailableTimesResponse {
  available_times: string[];
  interval: number;
  duration: number;
  timezone: string;
  next_available_date: string | null;
}

export interface FunnelClientResponse {
  data: {
    client: {
      id: number;
      group: {
        id: number;
        name: string;
      };
      people: Array<{
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        phone_1: string;
        is_primary: boolean;
      }>;
      status: string;
    };
  };
}

// ===== MAP TYPES =====

export interface MapPin {
  id: string;
  name: string;
  address: string;
  category: "property" | "transit" | "dining" | "shopping" | "parks";
  coordinates: [number, number]; // [lng, lat] — Mapbox order
}

// ===== COMPONENT TYPES =====

export interface NavItem {
  label: string;
  href: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  category?: string;
  width?: number;
  height?: number;
}

export interface AmenityItem {
  name: string;
  description?: string;
  image?: string;
  icon?: string;
}
