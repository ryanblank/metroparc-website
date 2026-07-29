import { NextRequest, NextResponse } from "next/server";
import { captureLead } from "@/lib/dam-ops";
import { submitLead } from "@/lib/funnel-api";
import {
  buildCampaignInfo,
  buildSourceNote,
  normalizeFunnelLeadSource,
} from "@/lib/funnel-lead-source";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, formType, unitId, bedrooms, budgetMin, budgetMax } = body;
    const funnelLeadSource = normalizeFunnelLeadSource(body);

    // Funnel's `notes` renders as the lead's first message and is the only
    // place source detail is visible to the leasing team. Append it after the
    // form's own context rather than replacing it.
    const funnelNotes = [
      typeof body.message === "string" && body.message.trim() ? body.message.trim() : null,
      buildSourceNote(body),
    ]
      .filter(Boolean)
      .join("\n");

    if (!email || !firstName) {
      return NextResponse.json(
        { error: "First name and email are required." },
        { status: 400 }
      );
    }

    // 1. Forward to Funnel CRM first to get funnel_client_id (best-effort)
    let funnelClientId: number | null = null;
    const funnelEnabled = process.env.FUNNEL_ENABLED === "true";
    if (funnelEnabled) {
      try {
        const funnelResult = await submitLead({
          firstName,
          lastName: lastName || "",
          email,
          phone: body.phone || undefined,
          bedrooms: bedrooms != null ? Number(bedrooms) : undefined,
          priceFloor: budgetMin != null ? String(budgetMin) : undefined,
          priceCeiling: budgetMax != null ? String(budgetMax) : undefined,
          notes: funnelNotes || undefined,
          leadSource: funnelLeadSource,
          campaignId: typeof body.source_utm_campaign === "string" && body.source_utm_campaign.trim()
            ? body.source_utm_campaign.trim()
            : undefined,
          campaignInfo: buildCampaignInfo(body),
        });
        funnelClientId = funnelResult?.data?.client?.id || null;
      } catch (funnelError) {
        console.error("[Funnel] Lead forward failed:", funnelError);
        // Do NOT throw — proceed to DAM Ops without funnel_client_id
      }
    }

    // 2. Capture in DAM Ops with funnel_client_id if available
    const damResult = await captureLead({
      organization_id: process.env.METROPARC_ORGANIZATION_ID!,
      building_id: process.env.METROPARC_BUILDING_ID!,
      unit_id: unitId || undefined,
      first_name: firstName,
      last_name: lastName || "",
      email,
      phone: body.phone || undefined,
      form_type: formType || "contact",
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
    });

    // 3. Return capture-lead response to client
    return NextResponse.json(damResult, { status: 201 });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit lead" },
      { status: 500 }
    );
  }
}
