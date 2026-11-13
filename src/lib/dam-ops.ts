// Server-side DAM Ops helpers — calls Supabase Edge Functions
// Do NOT import this file from client components.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ===== Types (mirroring get-listings Edge Function) =====

export interface DamUnit {
  id: string;
  unit_number: string;
  bedrooms: number | null;
  bathrooms: number | null;
  price_gross: number | null;
  price_net: number | null;
  square_feet: number | null;
  status: string | null;
  available_date: string | null;
  floor_plans: string[] | null;
  video_tour_url: string | null;
  tour_3d_url: string | null;
  photos: unknown;
  features: unknown;
}

export interface DamBuilding {
  id: string;
  building_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  units: DamUnit[];
}

interface GetListingsResponse {
  buildings: DamBuilding[];
}

// ===== Types (mirroring capture-lead Edge Function) =====

export interface CaptureLeadPayload {
  organization_id: string;
  building_id: string;
  unit_id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  form_type: string;
  source?: string;
  source_utm_source?: string;
  source_utm_medium?: string;
  source_utm_campaign?: string;
  source_utm_term?: string;
  source_utm_content?: string;
  source_referrer?: string;
  source_raw?: string;
  source_gclid?: string;
  notes?: string;
  bedrooms?: number;
  budget_min?: number;
  budget_max?: number;
  funnel_client_id?: number | null;
}

export interface CaptureLeadResponse {
  lead_id: string;
  activity_id: string;
  customer_id: string;
  is_new_customer: boolean;
  is_new_lead: boolean;
}

// ===== Functions =====

export async function getListings(
  organizationId: string,
  buildingId: string
): Promise<DamBuilding[]> {
  const url = new URL(`${SUPABASE_URL}/functions/v1/get-listings`);
  url.searchParams.set("organization_id", organizationId);
  url.searchParams.set("building_id", buildingId);

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    // Revalidate every 60 seconds — units don't change minute-to-minute
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("[DAM Ops] get-listings failed:", res.status);
    return [];
  }

  const data: GetListingsResponse = await res.json();
  return data.buildings ?? [];
}

export async function captureLead(
  payload: CaptureLeadPayload,
  requestId: string,
): Promise<CaptureLeadResponse> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/capture-lead`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      "X-Request-ID": requestId,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8_000),
  });

  if (!res.ok) {
    throw new Error(`capture-lead failed: ${res.status}`);
  }

  const result = await res.json();
  if (typeof result?.activity_id !== "string" || !result.activity_id) {
    throw new Error("DAM Ops did not confirm a saved activity");
  }
  return result;
}
