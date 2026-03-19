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

  return {
    source_utm_source: sessionStorage.getItem("dam_utm_source") || undefined,
    source_utm_medium: sessionStorage.getItem("dam_utm_medium") || undefined,
    source_utm_campaign: sessionStorage.getItem("dam_utm_campaign") || undefined,
    source_utm_term: sessionStorage.getItem("dam_utm_term") || undefined,
    source_utm_content: sessionStorage.getItem("dam_utm_content") || undefined,
    source_referrer: sessionStorage.getItem("dam_referrer") || undefined,
    source_raw: sessionStorage.getItem("dam_landing_page") || undefined,
    source_gclid: sessionStorage.getItem("dam_gclid") || undefined,
  };
}
