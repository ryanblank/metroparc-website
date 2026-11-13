import { captureLead } from "@/lib/dam-ops";
import { bookTour, FunnelApiError, getAvailableTimes } from "@/lib/funnel-api";
import { buildCampaignInfo, buildSourceNote, normalizeFunnelLeadSource } from "@/lib/funnel-lead-source";
import { formatTourSlot, slotWallTime } from "@/lib/tour-slot";
import { guardForm, websiteRequest } from "@/lib/website-form-guard";
import { LeadInputError, readWebsiteForm } from "@/lib/website-form-input";

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

export async function POST(request: Request) {
  const context = websiteRequest();
  context.setAction("book_tour");
  try {
    const form = await readWebsiteForm(request, true);
    const { firstName, lastName, email, phone, start, bedrooms, budgetMin, budgetMax, notes, attribution } = form;
    if (!start) throw new LeadInputError("Select an available tour time.");

    const date = start.slice(0, 10);
    const availability = await getAvailableTimes(date, date);
    if (!availability.available_times?.some((slot: string) => slotWallTime(slot) === start)) {
      throw new LeadInputError("That tour time is no longer available. Please choose another time.");
    }
    const rejection = await guardForm(request, context, form);
    if (rejection) return rejection;

    let appointmentId: number | undefined;
    let tourBooked = false;
    let funnelClientId: number | null = null;
    let timeConflict = false;
    if (process.env.FUNNEL_ENABLED === "true") {
      try {
        const result = await bookTour({
          firstName,
          lastName,
          email,
          phone,
          start,
          bedrooms,
          priceFloor: budgetMin?.toString(),
          priceCeiling: budgetMax?.toString(),
          notes: [notes, buildSourceNote(attribution)].filter(Boolean).join("\n") || undefined,
          leadSource: normalizeFunnelLeadSource(attribution),
          campaignInfo: buildCampaignInfo(attribution),
        });
        const appointment = result?.data?.appointment;
        funnelClientId = result?.data?.client?.id ?? null;
        if (Number.isSafeInteger(appointment?.id) && appointment.id > 0) {
          appointmentId = appointment.id;
          // The live booking response omitted status. Its ID and slot matched
          // a confirmed appointment on read-back. Respect explicit statuses
          // when Funnel includes them.
          tourBooked = typeof appointment.start === "string" &&
            slotWallTime(appointment.start) === start &&
            (appointment.status === undefined || appointment.status === 30);
        }
        context.log(tourBooked ? "funnel_booking_confirmed" : "funnel_booking_unverified");
      } catch (error) {
        timeConflict = isTimeConflictError(error);
        context.log(
          timeConflict ? "funnel_booking_conflict" : "funnel_booking_failed",
          error instanceof FunnelApiError ? error.status : undefined,
        );
      }
    } else {
      context.log("funnel_booking_disabled");
    }

    let intake;
    try {
      intake = await captureLead({
        organization_id: process.env.METROPARC_ORGANIZATION_ID!,
        building_id: process.env.METROPARC_BUILDING_ID!,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        form_type: "book_tour",
        source: "website",
        bedrooms,
        budget_min: budgetMin,
        budget_max: budgetMax,
        funnel_client_id: funnelClientId,
        ...attribution,
        notes: [
          `Tour requested for ${formatTourSlot(start, true)} ET.`,
          tourBooked ? "Funnel appointment confirmed." : "Funnel appointment not confirmed. Check Funnel before booking.",
          appointmentId ? `Funnel appointment #${appointmentId}.` : null,
          notes,
        ].filter(Boolean).join(" "),
      }, context.id);
      context.log("intake_saved");
    } catch {
      context.log("intake_failed");
      if (!tourBooked) {
        return context.respond({ error: "We couldn’t verify your tour request. Please contact leasing before retrying." }, 502);
      }
    }

    if (tourBooked) {
      return context.respond({ ...intake, accepted: true, tour_booked: true, appointment_id: appointmentId }, 201);
    }

    return context.respond({
      ...intake,
      accepted: true,
      tour_booked: false,
      error_type: timeConflict ? "time_conflict" : "other",
      error: timeConflict
        ? "You already have a tour scheduled near this time. Please pick a different slot."
        : "Your request was saved for follow-up.",
    }, 207);
  } catch (error) {
    if (error instanceof LeadInputError) {
      context.log("invalid_input", error.status);
      return context.respond({ error: error.message }, error.status);
    }
    context.log("booking_submission_failed");
    return context.respond({ error: "We couldn’t submit your tour request. Please try again." }, 502);
  }
}
