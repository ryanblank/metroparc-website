import { NextRequest, NextResponse } from "next/server";
import { captureLead } from "@/lib/dam-ops";
import { bookTour } from "@/lib/funnel-api";

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

    // 1. Always capture in DAM Ops first
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
      source_utm_source: body.source_utm_source,
      source_utm_medium: body.source_utm_medium,
      source_utm_campaign: body.source_utm_campaign,
      source_utm_term: body.source_utm_term,
      source_utm_content: body.source_utm_content,
      source_referrer: body.source_referrer,
      source_raw: body.source_raw,
      source_gclid: body.source_gclid,
      notes: `Tour requested for ${start}`,
    });

    // 2. Forward to Funnel CRM if enabled (best-effort)
    const funnelEnabled = process.env.FUNNEL_ENABLED === "true";
    if (funnelEnabled) {
      try {
        await bookTour({
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
      } catch (funnelError) {
        console.error("[Funnel] Tour booking failed:", funnelError);
        // Do NOT throw — lead is safe in DAM Ops
      }
    }

    // 3. Return capture-lead response to client
    return NextResponse.json(damResult, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to book tour" },
      { status: 500 }
    );
  }
}
