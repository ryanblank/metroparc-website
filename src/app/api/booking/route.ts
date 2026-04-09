import { NextRequest, NextResponse } from "next/server";
import { captureLead } from "@/lib/dam-ops";
import { bookTour } from "@/lib/funnel-api";

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
    const funnelEnabled = process.env.FUNNEL_ENABLED === "true";
    if (funnelEnabled) {
      try {
        const funnelResult = await bookTour({
          firstName,
          lastName: lastName || "",
          email,
          phone: phone || undefined,
          start,
          moveInDate: body.moveInDate,
          priceFloor: budgetMin,
          priceCeiling: budgetMax,
          notes: body.notes,
        });
        funnelClientId = funnelResult?.data?.client?.id || null;
      } catch (funnelError) {
        console.error("[Funnel] Tour booking failed:", funnelError);
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
      notes: `Tour requested for ${formatEasternWallTime(start)}`,
    });

    // 3. If Funnel booking failed, tell the client the tour was not scheduled
    if (funnelFailed) {
      return NextResponse.json(
        { ...damResult, tour_booked: false, error: "We couldn't schedule your tour right now. Our leasing team has your info and will reach out to confirm." },
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
