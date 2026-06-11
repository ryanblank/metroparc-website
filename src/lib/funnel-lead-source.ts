export type FunnelLeadSource =
  | "SEM Traffic"
  | "GMB"
  | "Email Marketing"
  | "Tracking Instagram"
  | "Tracking Facebook"
  | "Social Media Ads"
  | "Apartments.com Network"
  | "ApartmentList.com"
  | "Metro Rail Printed"
  | "Property Website";

interface AttributionInput {
  source_utm_source?: unknown;
  source_utm_medium?: unknown;
  source_utm_campaign?: unknown;
  source_utm_term?: unknown;
  source_utm_content?: unknown;
  source_referrer?: unknown;
  source_raw?: unknown;
  source_gclid?: unknown;
}

const PROPERTY_WEBSITE: FunnelLeadSource = "Property Website";

function clean(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function tokensFrom(...values: string[]): Set<string> {
  const tokens = new Set<string>();

  for (const value of values) {
    for (const token of value.split(/[^a-z0-9.]+/)) {
      if (token) tokens.add(token);
    }
  }

  return tokens;
}

function hostFrom(value: string): string {
  if (!value) return "";

  try {
    return new URL(value).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return value.replace(/^https?:\/\//, "").split("/")[0].replace(/^www\./, "").toLowerCase();
  }
}

function hasAny(haystack: string, needles: string[]): boolean {
  return needles.some((needle) => haystack.includes(needle));
}

function hasGooglePaidSearch(source: string, medium: string, hasGclid: boolean): boolean {
  if (hasGclid) return true;
  if (!source.includes("google")) return false;
  return hasAny(medium, ["cpc", "ppc", "paid_search", "paidsearch", "paid search"]);
}

/**
 * Funnel reports Lead Source only when it receives one of its exact configured
 * values. This maps our raw first-touch UTMs/referrer into that canonical set.
 */
export function normalizeFunnelLeadSource(
  attribution: AttributionInput
): FunnelLeadSource {
  const source = clean(attribution.source_utm_source);
  const medium = clean(attribution.source_utm_medium);
  const campaign = clean(attribution.source_utm_campaign);
  const term = clean(attribution.source_utm_term);
  const content = clean(attribution.source_utm_content);
  const referrer = clean(attribution.source_referrer) || clean(attribution.source_raw);
  const referrerHost = hostFrom(referrer);
  const hasGclid = Boolean(clean(attribution.source_gclid));

  const fieldText = [source, medium, campaign, term, content].join(" ");
  const allText = [fieldText, referrerHost].join(" ");
  const tokens = tokensFrom(source, medium, campaign, term, content, referrerHost);

  // First-match-wins. Keep paid Google above all other noisy source/campaign signals.
  if (hasGooglePaidSearch(source, medium, hasGclid)) return "SEM Traffic";

  if (
    (hasAny(fieldText, ["costar"]) || hasAny(referrerHost, ["costar.com", "apartments.com"])) &&
    (medium.includes("ils") || hasAny(referrerHost, ["costar.com", "apartments.com"]))
  ) {
    return "Apartments.com Network";
  }

  if (
    (hasAny(fieldText, ["apartmentlist"]) || referrerHost.includes("apartmentlist.com")) &&
    (medium.includes("ils") || referrerHost.includes("apartmentlist.com"))
  ) {
    return "ApartmentList.com";
  }

  if (
    hasAny(allText, ["instagram"]) ||
    tokens.has("ig") ||
    referrerHost === "l.instagram.com"
  ) {
    return "Tracking Instagram";
  }

  if (
    hasAny(allText, ["facebook"]) ||
    tokens.has("fb") ||
    tokens.has("meta") ||
    referrerHost === "fb.com"
  ) {
    return "Tracking Facebook";
  }

  if (hasAny(fieldText, ["paid_social", "paid social"])) return "Social Media Ads";

  if (hasAny(fieldText, ["email", "hyly", "emai", "mailchimp", "constantcontact"])) {
    return "Email Marketing";
  }

  if (
    hasAny(fieldText, ["metro_rail", "metro rail"]) &&
    hasAny(medium, ["printed", "printed_goverment", "printed_government"])
  ) {
    return "Metro Rail Printed";
  }

  if (
    tokens.has("gmb") ||
    tokens.has("local") ||
    hasAny(campaign, ["gmb"]) ||
    referrer.includes("google.com/maps")
  ) {
    return "GMB";
  }

  return PROPERTY_WEBSITE;
}
