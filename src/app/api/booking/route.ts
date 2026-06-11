import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { captureLead } from "@/lib/dam-ops";
import { bookTour, FunnelApiError } from "@/lib/funnel-api";
import { normalizeFunnelLeadSource } from "@/lib/funnel-lead-source";

/** First 12 chars of sha256(email) — correlatable across logs without leaking PII. */
function hashEmail(email: string): string {
  return createHash("sha256").update(email.toLowerCase().trim()).digest("hex").slice(0, 12);
}

/** Pull a human-readable rejection reason out of Funnel's error response. */
function extractFunnelReason(err: unknown): string | null {
  if (!(err instanceof FunnelApiError)) return null;
  const body = err.parsedBody as Record<string, unknown> | null;
  const reason =
    (body?.message as string) ||
    (body?.error as string) ||
    (body?.detail as string) ||
    (body ? JSON.stringify(body) : null) ||
    `HTTP ${err.status}`;
  return reason.slice(0, 300);
}

/**
 * Detect Funnel's per-prospect time-conflict error so we can show a
 * specific, user-actionable message instead of the generic "we couldn't
 * schedule" fallback. Funnel's shape:
 * { errors: { appointment: { start: ["Prospect has a conflicting appointment at the same time."] } } }
 */
function isTimeConflictError(err: unknown): boolean {
  if (!(err instanceof FunnelApiError)) return false;
  const body = err.parsedBody as
    | { errors?: { appointment?: { start?: unknown } } }
    | null;
  const startErrors = body?.errors?.appointment?.start;
  if (!Array.isArray(startErrors)) return false;
  return startErrors.some(
    (s) => typeof s === "string" && s.toLowerCase().includes("conflicting")
  );
}

/**
 * Funnel returns naive datetime strings (e.g. "2026-04-30T11:45:00") that
 * already represent property-local (US/Eastern) wall-clock time. Passing
 * those through `new Date()` on a server running in UTC misinterprets them
 * as UTC and shifts the displayed time by 4–5 hours. Format the wall-clock
 * components directly instead.
 */
function formatEasternWallTime(naiveIso: string): string {
  const match = naiveIso.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return naiveIso;
  const [, y, mo, d, h, mi] = match;
  // Build a UTC date from the parsed components, then format in UTC so the
  // wall-clock numbers come out unchanged.
  const dt = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi));
  return dt.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, phone, start, bedrooms, budgetMin, budgetMax } = body;
    const funnelLeadSource = normalizeFunnelLeadSource(body);

    if (!email || !firstName) {
      return NextResponse.json(
        { error: "First name and email are required." },
        { status: 400 }
      );
    }

    if (!start) {
      return NextResponse.json(
        { error: "Appointment start time is required." },
        { status: 400 }
      );
    }

    // 1. Forward to Funnel CRM to book the appointment
    let funnelClientId: number | null = null;
    let funnelFailed = false;
    let funnelFailureReason: string | null = null;
    let funnelFailureType: "time_conflict" | "other" | null = null;
    const funnelEnabled = process.env.FUNNEL_ENABLED === "true";
    if (funnelEnabled) {
      try {
        const funnelResult = await bookTour({
          firstName,
          lastName: lastName || "",
          email,
          phone: phone || undefined,
          start,
          bedrooms: bedrooms != null ? Number(bedrooms) : undefined,
          moveInDate: body.moveInDate,
          priceFloor: budgetMin,
          priceCeiling: budgetMax,
          notes: typeof body.notes === "string" && body.notes.trim() ? body.notes.trim() : undefined,
          leadSource: funnelLeadSource,
        });
        funnelClientId = funnelResult?.data?.client?.id || null;

        // Diagnostic: log success shape so we can verify appointments persist
        // and answer the open question about expiration_date behavior.
        // Safe to remove once we have confidence.
        console.log(JSON.stringify({
          level: "info",
          event: "funnel_booking_success",
          funnel_client_id: funnelClientId,
          funnel_appointment_id: funnelResult?.data?.appointment?.id ?? null,
          funnel_appointment_status: funnelResult?.data?.appointment?.status ?? null,
          funnel_expiration_date: funnelResult?.data?.appointment?.expiration_date ?? null,
          email_hash: hashEmail(email),
          start,
        }));
      } catch (funnelError) {
        funnelFailureReason = extractFunnelReason(funnelError);
        funnelFailureType = isTimeConflictError(funnelError) ? "time_conflict" : "other";
        console.error(JSON.stringify({
          level: "error",
          event: "funnel_booking_failed",
          funnel_status: funnelError instanceof FunnelApiError ? funnelError.status : null,
          funnel_endpoint: funnelError instanceof FunnelApiError ? funnelError.endpoint : null,
          funnel_response: funnelError instanceof FunnelApiError ? funnelError.parsedBody : null,
          funnel_message: funnelError instanceof Error ? funnelError.message : String(funnelError),
          email_hash: hashEmail(email),
          start,
        }));
        funnelFailed = true;
      }
    }

    // 2. Always capture in DAM Ops (don't lose the lead even if Funnel failed)
    const damResult = await captureLead({
      organization_id: process.env.METROPARC_ORGANIZATION_ID!,
      building_id: process.env.METROPARC_BUILDING_ID!,
      first_name: firstName,
      last_name: lastName || "",
      email,
      phone: phone || undefined,
      form_type: "book_tour",
      source: "website",
      bedrooms: bedrooms != null ? Number(bedrooms) : undefined,
      budget_min: budgetMin != null ? Number(budgetMin) : undefined,
      budget_max: budgetMax != null ? Number(budgetMax) : undefined,
      funnel_client_id: funnelClientId,
      source_utm_source: body.source_utm_source,
      source_utm_medium: body.source_utm_medium,
      source_utm_campaign: body.source_utm_campaign,
      source_utm_term: body.source_utm_term,
      source_utm_content: body.source_utm_content,
      source_referrer: body.source_referrer,
      source_raw: body.source_raw,
      source_gclid: body.source_gclid,
      notes: [
        `Tour requested for ${formatEasternWallTime(start)}`,
        funnelFailureReason ? `[Funnel rejected: ${funnelFailureReason}]` : null,
      ].filter(Boolean).join(" "),
    });

    // 3. If Funnel booking failed, tell the client the tour was not scheduled
    if (funnelFailed) {
      const errorMessage =
        funnelFailureType === "time_conflict"
          ? "You already have a tour scheduled near this time. Please pick a different slot."
          : "We couldn't schedule your tour right now. Our leasing team has your info and will reach out to confirm.";
      return NextResponse.json(
        {
          ...damResult,
          tour_booked: false,
          error: errorMessage,
          error_type: funnelFailureType,
        },
        { status: 207 }
      );
    }

    // 4. Return success
    return NextResponse.json({ ...damResult, tour_booked: true }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to book tour" },
      { status: 500 }
    );
  }
}
