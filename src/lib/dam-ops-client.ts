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
      source_raw: data.landing_page || undefined,
      source_gclid: data.gclid || undefined,
    };
  } catch {
    return {};
  }
}
