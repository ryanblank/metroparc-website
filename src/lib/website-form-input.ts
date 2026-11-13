import { easternSlot, slotWallTime } from "./tour-slot";
import { isCompletePhone } from "./format-phone";

const MAX_BYTES = 64 * 1024;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MEDIA_FORMS = new Set(["floor_plan", "video_tour", "3d_tour"]);
const LEAD_FORMS = new Set([...MEDIA_FORMS, "contact", "general_inquiry"]);

const ATTRIBUTION_LIMITS = {
  source_utm_source: 255,
  source_utm_medium: 255,
  source_utm_campaign: 512,
  source_utm_term: 512,
  source_utm_content: 1024,
  source_referrer: 4096,
  source_raw: 4096,
  source_gclid: 512,
} as const;

export class LeadInputError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

async function readBody(request: Request): Promise<Record<string, unknown>> {
  if (Number(request.headers.get("content-length")) > MAX_BYTES) {
    throw new LeadInputError("Request body is too large.", 413);
  }

  const reader = request.body?.getReader();
  if (!reader) throw new LeadInputError("Invalid form submission.");

  const bytes = new Uint8Array(MAX_BYTES);
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value.length > MAX_BYTES - length) {
        void reader.cancel().catch(() => {});
        throw new LeadInputError("Request body is too large.", 413);
      }
      bytes.set(value, length);
      length += value.length;
    }
  } finally {
    reader.releaseLock();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(0, length)));
  } catch {
    throw new LeadInputError("Invalid form submission.");
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new LeadInputError("Invalid form submission.");
  }
  return parsed as Record<string, unknown>;
}

function optionalString(value: unknown, limit: number, message: string) {
  if (value == null) return undefined;
  if (typeof value !== "string" || value.length > limit) throw new LeadInputError(message);
  return value;
}

function optionalNumber(value: unknown, max: number, message: string) {
  if (value == null) return undefined;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > max) {
    throw new LeadInputError(message);
  }
  return value;
}

export async function readWebsiteForm(request: Request, booking = false) {
  const body = await readBody(request);
  const firstName = optionalString(body.firstName, 120, "Enter a valid first name.")?.trim();
  const lastName = optionalString(body.lastName, 120, "Enter a valid last name.")?.trim();
  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!firstName || !lastName) throw new LeadInputError("First and last name are required.");
  if (email.length > 320 || !EMAIL.test(email)) {
    throw new LeadInputError("Enter a valid email address.");
  }

  const formType = booking ? "book_tour" : body.formType;
  if (typeof formType !== "string" || (!booking && !LEAD_FORMS.has(formType))) {
    throw new LeadInputError("Invalid form type.");
  }

  const unitId = body.unitId ?? undefined;
  if ((unitId !== undefined || (MEDIA_FORMS.has(formType) || formType === "contact")) &&
      (typeof unitId !== "string" || !UUID.test(unitId))) {
    throw new LeadInputError("Select a valid unit.");
  }

  const budgetError = "Enter a valid budget range.";
  const budgetMin = optionalNumber(body.budget_min ?? body.budgetMin, 1_000_000, budgetError);
  const budgetMax = optionalNumber(body.budget_max ?? body.budgetMax, 1_000_000, budgetError);
  if (budgetMin !== undefined && budgetMax !== undefined && budgetMin > budgetMax) {
    throw new LeadInputError(budgetError);
  }

  const attribution = {
    source_utm_source: optionalString(body.source_utm_source, ATTRIBUTION_LIMITS.source_utm_source, "Invalid attribution."),
    source_utm_medium: optionalString(body.source_utm_medium, ATTRIBUTION_LIMITS.source_utm_medium, "Invalid attribution."),
    source_utm_campaign: optionalString(body.source_utm_campaign, ATTRIBUTION_LIMITS.source_utm_campaign, "Invalid attribution."),
    source_utm_term: optionalString(body.source_utm_term, ATTRIBUTION_LIMITS.source_utm_term, "Invalid attribution."),
    source_utm_content: optionalString(body.source_utm_content, ATTRIBUTION_LIMITS.source_utm_content, "Invalid attribution."),
    source_referrer: optionalString(body.source_referrer, ATTRIBUTION_LIMITS.source_referrer, "Invalid attribution."),
    source_raw: optionalString(body.source_raw, ATTRIBUTION_LIMITS.source_raw, "Invalid attribution."),
    source_gclid: optionalString(body.source_gclid, ATTRIBUTION_LIMITS.source_gclid, "Invalid attribution."),
  };
  const phone = optionalString(body.phone, 80, "Enter a valid phone number.")?.trim() || undefined;
  if ((phone || booking || formType === "general_inquiry") && !isCompletePhone(phone ?? "")) {
    throw new LeadInputError("Enter a valid 10-digit phone number.");
  }
  const bedrooms = optionalNumber(body.bedrooms, 20, "Select a valid bedroom count.");
  if (bedrooms !== undefined && !Number.isInteger(bedrooms)) {
    throw new LeadInputError("Select a valid bedroom count.");
  }
  const start = booking ? parseTourSlot(body.start) : undefined;

  return {
    firstName,
    lastName,
    email,
    phone,
    formType,
    unitId: typeof unitId === "string" ? unitId.toLowerCase() : undefined,
    notes: optionalString(booking ? body.notes : body.message, 5000, "The message is too long.")?.trim() || undefined,
    bedrooms,
    budgetMin,
    budgetMax,
    start,
    attribution,
  };
}


function parseTourSlot(value: unknown) {
  const slot = typeof value === "string" ? slotWallTime(value) : undefined;
  if (!slot || slot.length !== 19 ||
      slot <= easternSlot(new Date(Date.now() + 120 * 60_000)) ||
      slot.slice(0, 10) > easternSlot(new Date(Date.now() + 30 * 86_400_000)).slice(0, 10)) {
    throw new LeadInputError("Select an available tour time.");
  }
  return slot;
}
