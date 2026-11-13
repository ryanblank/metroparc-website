import { captureLead } from "@/lib/dam-ops";
import { submitLead, FunnelApiError } from "@/lib/funnel-api";
import { buildCampaignInfo, buildSourceNote, normalizeFunnelLeadSource } from "@/lib/funnel-lead-source";
import { guardForm, validateUnit, websiteRequest } from "@/lib/website-form-guard";
import { LeadInputError, readWebsiteForm } from "@/lib/website-form-input";

export async function POST(request: Request) {
  const context = websiteRequest();
  try {
    const form = await readWebsiteForm(request);
    const { firstName, lastName, email, phone, formType, unitId, bedrooms, budgetMin, budgetMax, notes, attribution } = form;
    context.setAction(formType);
    await validateUnit(unitId);
    const rejection = await guardForm(request, context, form);
    if (rejection) return rejection;

    let funnelClientId: number | null = null;
    if (process.env.FUNNEL_ENABLED === "true") {
      try {
        const result = await submitLead({
          firstName,
          lastName,
          email,
          phone,
          bedrooms,
          priceFloor: budgetMin?.toString(),
          priceCeiling: budgetMax?.toString(),
          notes: [notes, buildSourceNote(attribution)].filter(Boolean).join("\n") || undefined,
          leadSource: normalizeFunnelLeadSource(attribution),
          campaignInfo: buildCampaignInfo(attribution),
        });
        funnelClientId = result?.data?.client?.id ?? null;
        context.log("funnel_lead_accepted");
      } catch (error) {
        context.log("funnel_lead_failed", error instanceof FunnelApiError ? error.status : undefined);
      }
    }

    const result = await captureLead({
      organization_id: process.env.METROPARC_ORGANIZATION_ID!,
      building_id: process.env.METROPARC_BUILDING_ID!,
      unit_id: unitId,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      form_type: formType,
      source: "website",
      bedrooms,
      budget_min: budgetMin,
      budget_max: budgetMax,
      notes,
      funnel_client_id: funnelClientId,
      ...attribution,
    }, context.id);
    context.log("intake_saved");
    return context.respond({ ...result, accepted: true }, 201);
  } catch (error) {
    if (error instanceof LeadInputError) {
      context.log("invalid_input", error.status);
      return context.respond({ error: error.message }, error.status);
    }
    context.log("lead_submission_failed");
    return context.respond({ error: "We couldn’t save your submission. Please try again." }, 502);
  }
}
