/**
 * Funnel Leasing API helper — server-side only.
 * All requests use HTTP Basic Auth (API key as username, empty password).
 */

const FUNNEL_BASE_URL = "https://api.funnelleasing.com";
const FUNNEL_API_KEY = process.env.FUNNEL_API_KEY || "";
const FUNNEL_GROUP_ID = parseInt(process.env.FUNNEL_GROUP_ID || "7380", 10);

function getAuthHeader(): string {
  // Basic Auth: base64(apiKey + ":")
  return "Basic " + Buffer.from(`${FUNNEL_API_KEY}:`).toString("base64");
}

/**
 * Structured error thrown when the Funnel API returns a non-2xx response.
 * Callers can read `status`, `parsedBody`, and `endpoint` to surface
 * meaningful failure reasons instead of a stringified message.
 */
export class FunnelApiError extends Error {
  status: number;
  responseBody: string;
  parsedBody: unknown;
  endpoint: string;

  constructor(opts: { status: number; responseBody: string; endpoint: string }) {
    super(`Funnel API error (${opts.status}) at ${opts.endpoint}`);
    this.name = "FunnelApiError";
    this.status = opts.status;
    this.responseBody = opts.responseBody;
    this.endpoint = opts.endpoint;
    try {
      this.parsedBody = JSON.parse(opts.responseBody);
    } catch {
      this.parsedBody = null;
    }
  }
}

/**
 * Map a numeric bedroom count to Funnel's `layout` enum slug array.
 * Funnel's `layout` field is a "choice" enum that accepts lowercase slugs
 * (verified via probe: "studio", "1br", "2br" → stored as "Studio",
 * "1 Bedroom", "2 Bedroom" in the CRM). Returns undefined for unknown
 * counts so the field gets omitted entirely from the payload.
 */
function bedroomsToLayout(bedrooms?: number): string[] | undefined {
  if (bedrooms === 0) return ["studio"];
  if (bedrooms === 1) return ["1br"];
  if (bedrooms === 2) return ["2br"];
  return undefined;
}

/**
 * Submit a lead/prospect to Funnel CRM.
 * POST /api/v2/clients
 */
export async function submitLead(data: {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  bedrooms?: number;
  priceFloor?: string;
  priceCeiling?: string;
  moveInDate?: string;
  notes?: string;
  campaignId?: string;
  campaignInfo?: string;
}) {
  const layout = bedroomsToLayout(data.bedrooms);
  // Only include optional fields if we actually have a value. Sending "" for
  // date-typed fields like move_in_date causes a 400 ("Not a valid date.").
  // Omitting is safer than guessing what Funnel tolerates.
  const payload = {
    client: {
      people: [
        {
          first_name: data.firstName,
          last_name: data.lastName || "",
          email: data.email,
          ...(data.phone ? { phone_1: data.phone } : {}),
          is_primary: true,
        },
      ],
      group: FUNNEL_GROUP_ID,
      ...(data.moveInDate ? { move_in_date: data.moveInDate } : {}),
      ...(data.priceFloor ? { price_floor: data.priceFloor } : {}),
      ...(data.priceCeiling ? { price_ceiling: data.priceCeiling } : {}),
      ...(layout ? { layout } : {}),
      ...(data.notes ? { notes: data.notes } : {}),
      client_referral: "Metroparc Website",
      discovery_source: 20, // Property Website
      ...(data.campaignId ? { campaign_id: data.campaignId } : {}),
      ...(data.campaignInfo ? { campaign_info: data.campaignInfo } : {}),
    },
  };

  const res = await fetch(`${FUNNEL_BASE_URL}/api/v2/clients`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new FunnelApiError({
      status: res.status,
      responseBody: errorBody,
      endpoint: "POST /api/v2/clients",
    });
  }

  return res.json();
}

/**
 * Get available tour times for a date range.
 * GET /api/v2/appointments/group/:id/available-times
 */
export async function getAvailableTimes(fromDate: string, toDate: string) {
  const params = new URLSearchParams({
    from_date: fromDate,
    to_date: toDate,
  });

  const res = await fetch(
    `${FUNNEL_BASE_URL}/api/v2/appointments/group/${FUNNEL_GROUP_ID}/available-times?${params}`,
    {
      headers: {
        Authorization: getAuthHeader(),
      },
    }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    throw new FunnelApiError({
      status: res.status,
      responseBody: errorBody,
      endpoint: "GET /api/v2/appointments/group/:id/available-times",
    });
  }

  return res.json();
}

/**
 * Book a tour appointment.
 * POST /api/v2/appointments/group/:id/book
 * Creates prospect AND books appointment in one call.
 */
export async function bookTour(data: {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  start: string; // ISO datetime from available-times
  bedrooms?: number;
  moveInDate?: string;
  priceFloor?: string;
  priceCeiling?: string;
  notes?: string;
}) {
  // Only include optional fields if we actually have a value. Sending "" for
  // typed fields like move_in_date / price_floor / price_ceiling risks 400s
  // (confirmed for move_in_date) — omit instead of guessing what Funnel tolerates.
  const layout = bedroomsToLayout(data.bedrooms);
  const payload = {
    appointment: {
      start: data.start,
      tour_type: "guided",
    },
    client: {
      people: [
        {
          first_name: data.firstName,
          last_name: data.lastName || "",
          email: data.email,
          phone_1: data.phone || "",
        },
      ],
      group: FUNNEL_GROUP_ID,
      ...(data.moveInDate ? { move_in_date: data.moveInDate } : {}),
      ...(data.priceFloor ? { price_floor: data.priceFloor } : {}),
      ...(data.priceCeiling ? { price_ceiling: data.priceCeiling } : {}),
      ...(layout ? { layout } : {}),
      ...(data.notes ? { notes: data.notes } : {}),
      discovery_source: 20,
      client_referral: "Metroparc Website",
    },
  };

  const res = await fetch(
    `${FUNNEL_BASE_URL}/api/v2/appointments/group/${FUNNEL_GROUP_ID}/book`,
    {
      method: "POST",
      headers: {
        Authorization: getAuthHeader(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    const errorBody = await res.text();
    throw new FunnelApiError({
      status: res.status,
      responseBody: errorBody,
      endpoint: "POST /api/v2/appointments/group/:id/book",
    });
  }

  return res.json();
}
