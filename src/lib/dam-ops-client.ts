"use client";

// Client-side DAM Ops utilities — reads sessionStorage written by attribution.js

export interface Attribution {
  source_utm_source?: string;
  source_utm_medium?: string;
  source_utm_campaign?: string;
  source_utm_term?: string;
  source_utm_content?: string;
  source_referrer?: string;
  source_raw?: string;
  source_gclid?: string;
}

export function getAttribution(): Attribution {
  if (typeof window === "undefined") return {};

  try {
    const raw = sessionStorage.getItem("dam_attribution");
    const data = raw ? JSON.parse(raw) : {};

    return {
      source_utm_source: data.utm_source || undefined,
      source_utm_medium: data.utm_medium || undefined,
      source_utm_campaign: data.utm_campaign || undefined,
      source_utm_term: data.utm_term || undefined,
      source_utm_content: data.utm_content || undefined,
      source_referrer: data.referrer || undefined,
      source_raw: data.referrer || undefined,
      source_gclid: data.gclid || undefined,
    };
  } catch {
    return {};
  }
}

const UNLOCK_KEY = "metroparc_media_unlocked";
const CONTACT_KEY = "metroparc_visitor_contact";
const LEGACY_KEY = "metroparc_media_gated";

type VisitorContact = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
};

let acceptedContact: VisitorContact | undefined;

export function getVisitorContact(): VisitorContact | undefined {
  if (acceptedContact) return acceptedContact;
  try {
    const saved = sessionStorage.getItem(CONTACT_KEY) ?? sessionStorage.getItem(LEGACY_KEY);
    if (!saved) return;
    const { firstName, lastName, email, phone } = JSON.parse(saved);
    if (typeof firstName === "string" && typeof lastName === "string" &&
        typeof email === "string" && email.trim() && typeof phone === "string") {
      return { firstName, lastName, email, phone };
    }
  } catch {
    // Session storage may be unavailable.
  }
}

export function isListingMediaUnlocked() {
  if (acceptedContact) return true;
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === "true" ||
      (sessionStorage.getItem(LEGACY_KEY) !== null && Boolean(getVisitorContact()));
  } catch {
    return false;
  }
}

export function rememberAcceptedContact({ firstName, lastName, email, phone }: VisitorContact) {
  acceptedContact = {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.trim(),
    phone: phone.trim(),
  };
  try {
    sessionStorage.setItem(UNLOCK_KEY, "true");
    sessionStorage.setItem(CONTACT_KEY, JSON.stringify(acceptedContact));
  } catch {
    // Keep the accepted details in memory when storage is unavailable.
  }
}

export async function submitWebsiteForm(
  route: "/api/lead" | "/api/booking",
  payload: Record<string, unknown>,
) {
  const response = await fetch(route, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, ...getAttribution() }),
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || data?.accepted !== true) {
    throw new Error(data?.error || "Something went wrong. Please try again.");
  }
  return data;
}
