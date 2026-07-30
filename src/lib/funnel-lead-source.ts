export type FunnelLeadSource =
  | "SEM Traffic"
  | "Google Business Profile"
  | "Email Marketing"
  | "Tracking Instagram"
  | "Tracking Facebook"
  | "Social Media Ads"
  | "Apartments.com Network"
  | "ApartmentList.com"
  | "Zillow Network"
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

/**
 * Original casing, for text we show to the leasing team rather than match on.
 * Collapses whitespace and caps length — UTMs are attacker-controllable and
 * this text renders as a message on the prospect record, so a stray newline
 * would split the note into what looks like two messages.
 */
function raw(value: unknown, max = 80): string {
  if (typeof value !== "string") return "";
  const collapsed = value.replace(/\s+/g, " ").trim();
  return collapsed.length > max ? `${collapsed.slice(0, max - 1)}…` : collapsed;
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

/**
 * Paid search, engine-agnostic. Funnel's vocabulary has no per-engine paid
 * search value — "SEM Traffic" is the only one — so Google and Bing both land
 * here. Bing paid is included for completeness; we don't currently run
 * Microsoft Ads, so in practice this fires on Google.
 */
function hasPaidSearch(source: string, medium: string, hasGclid: boolean): boolean {
  if (hasGclid) return true;
  if (!(source.includes("google") || source.includes("bing"))) return false;
  return hasAny(medium, ["cpc", "ppc", "paid_search", "paidsearch", "paid search"]);
}

/**
 * Google Business Profile. Metro Parc's GBP "Website" button links to
 * `/?utm_campaign=gmb&utm_medium=organic&utm_source=local`, so any of those
 * three signals identifies it. Matched on exact source rather than a token
 * search because this rule runs early — a campaign named e.g. "local-lease-up"
 * should not be swept in.
 *
 * Note: ChatGPT surfaces the GBP-tagged URL, so AI-search visitors arrive with
 * `utm_campaign=gmb` and land here by design. Funnel has no AI-search value;
 * the source note records `chatgpt.com` so the distinction isn't lost.
 */
function isGoogleBusinessProfile(source: string, campaign: string, referrer: string): boolean {
  if (hasAny(campaign, ["gmb"])) return true;
  if (source === "local" || source === "gmb") return true;
  return referrer.includes("google.com/maps");
}

/**
 * Funnel reports Lead Source only when it receives one of its exact configured
 * values. This maps our raw first-touch UTMs/referrer into that canonical set.
 * Every value below is verified to persist on a Metro Parc prospect record.
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

  // First-match-wins. Paid search stays above everything; Google Business
  // Profile sits second so a social or ILS signal on the same visit can't
  // shadow it.
  if (hasPaidSearch(source, medium, hasGclid)) return "SEM Traffic";

  if (isGoogleBusinessProfile(source, campaign, referrer)) return "Google Business Profile";

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

  // Above the social rules: Zillow traffic often carries a social referrer,
  // which previously mislabeled it as Facebook.
  if (hasAny(fieldText, ["zillow"]) || referrerHost.includes("zillow.com")) {
    return "Zillow Network";
  }

  // Paid and organic social both keep channel identity — the property reports
  // by channel, not by paid-vs-organic.
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

  // Fallback for paid social where the platform can't be identified.
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

  return PROPERTY_WEBSITE;
}

/**
 * Channel label for the leasing team, e.g. "Source: google / cpc".
 *
 * Funnel's `campaign_info` stores fine but is not displayed anywhere on the
 * prospect record — `notes` is the only field that surfaces. It renders as a
 * message in the lead's thread, which Funnel's automated response also draws
 * from, so *the prospect can see this text*.
 *
 * That is why this is the channel only. Campaign ID and keyword deliberately
 * stay out: echoing someone's search term back at them in an auto-reply reads
 * as surveillance, and campaign IDs are noise to a customer. Both are still
 * captured in full in DAM Ops and sent to Funnel via `campaign_info` /
 * `campaign_id`, neither of which is ever displayed.
 *
 * Returns undefined when there's no attribution at all, so direct traffic
 * doesn't get a meaningless line.
 */
export function buildSourceNote(attribution: AttributionInput): string | undefined {
  const source = raw(attribution.source_utm_source);
  const medium = raw(attribution.source_utm_medium);
  const referrer = raw(attribution.source_referrer) || raw(attribution.source_raw);

  // Fall back to the referring host only when it actually parses as one —
  // otherwise a junk referrer would print verbatim.
  const referrerHost = hostFrom(referrer);
  const usableHost = /^[a-z0-9.-]+\.[a-z]{2,}$/.test(referrerHost) ? referrerHost : "";

  const channel = source
    ? medium
      ? `${source} / ${medium}`
      : source
    : usableHost;

  if (!channel) return undefined;

  return `Source: ${channel}`;
}

/**
 * Value for Funnel's `campaign_info`. Free text, no vocabulary — Funnel's own
 * documented example is "GooglePPC". Not visible on the prospect record, but it
 * populates a field that is otherwise empty on every lead and is available to
 * reports and exports.
 */
export function buildCampaignInfo(attribution: AttributionInput): string | undefined {
  const source = raw(attribution.source_utm_source);
  const medium = raw(attribution.source_utm_medium);

  if (source && medium) return `${source} / ${medium}`;
  return source || undefined;
}
