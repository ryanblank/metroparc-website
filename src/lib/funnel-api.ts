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
 * Submit a lead/prospect to Funnel CRM.
 * POST /api/v2/clients
 */
export async function submitLead(data: {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  moveInDate?: string;
  notes?: string;
  campaignId?: string;
  campaignInfo?: string;
}) {
  const payload = {
    client: {
      people: [
        {
          first_name: data.firstName,
          last_name: data.lastName || "",
          email: data.email,
          phone_1: data.phone || "",
          is_primary: true,
        },
      ],
      group: FUNNEL_GROUP_ID,
      move_in_date: data.moveInDate || "",
      notes: data.notes || "",
      client_referral: "Metroparc Website",
      discovery_source: 20, // Property Website
      campaign_id: data.campaignId || "",
      campaign_info: data.campaignInfo || "",
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
    throw new Error(`Funnel API error (${res.status}): ${errorBody}`);
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
    throw new Error(`Funnel API error (${res.status}): ${errorBody}`);
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
  moveInDate?: string;
  priceFloor?: string;
  priceCeiling?: string;
  notes?: string;
}) {
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
      move_in_date: data.moveInDate || "",
      price_floor: data.priceFloor || "",
      price_ceiling: data.priceCeiling || "",
      notes: data.notes || "",
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
    throw new Error(`Funnel API error (${res.status}): ${errorBody}`);
  }

  return res.json();
}
