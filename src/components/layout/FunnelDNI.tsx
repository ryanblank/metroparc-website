"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    FunnelDNI?: (config: {
      apiKey: string;
      communityId: number;
      phoneNumberSelector?: string;
      phoneNumberCTCSelector?: string;
      campaignInfoParameters?: string[];
      onPhoneNumberReady?: (data: { phone_number?: string }) => void;
    }) => void;
  }
}

const apiKey = process.env.NEXT_PUBLIC_FUNNEL_DNI_API_KEY;
const communityId = Number(process.env.NEXT_PUBLIC_FUNNEL_DNI_COMMUNITY_ID || "6886");

function phoneDigits(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

function formatPhoneNumber(phoneNumber: string): string {
  const digits = phoneDigits(phoneNumber);
  if (digits.length !== 10) return phoneNumber;

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function phoneHref(phoneNumber: string): string {
  const digits = phoneDigits(phoneNumber);
  return digits.length === 10 ? `tel:+1${digits}` : `tel:${phoneNumber}`;
}

export default function FunnelDNI() {
  const initialized = useRef(false);
  const activePhoneNumber = useRef<string | null>(null);

  const applyPhoneNumber = useCallback((phoneNumber: string) => {
    activePhoneNumber.current = phoneNumber;
    const displayPhoneNumber = formatPhoneNumber(phoneNumber);
    const href = phoneHref(phoneNumber);

    document.querySelectorAll<HTMLElement>(".DCRPhone").forEach((element) => {
      if (element.textContent !== displayPhoneNumber) {
        element.textContent = displayPhoneNumber;
      }
    });

    document.querySelectorAll<HTMLAnchorElement>(".DCRPhoneHref").forEach((element) => {
      if (element.getAttribute("href") !== href) {
        element.setAttribute("href", href);
      }
    });
  }, []);

  useEffect(() => {
    if (!apiKey || !Number.isFinite(communityId)) return;

    const observer = new MutationObserver(() => {
      if (activePhoneNumber.current) applyPhoneNumber(activePhoneNumber.current);
    });

    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [applyPhoneNumber]);

  if (!apiKey || !Number.isFinite(communityId)) return null;

  return (
    <Script
      id="funnel-dni"
      src="https://integrations.funnelleasing.com/dni/v1/dni.js"
      strategy="afterInteractive"
      onReady={() => {
        if (initialized.current || !window.FunnelDNI) return;
        initialized.current = true;

        window.FunnelDNI({
          apiKey,
          communityId,
          phoneNumberSelector: ".DCRPhone",
          phoneNumberCTCSelector: ".DCRPhoneHref",
          campaignInfoParameters: [
            "gclid",
            "utm_source",
            "utm_medium",
            "utm_campaign",
            "utm_term",
            "utm_content",
          ],
          onPhoneNumberReady: (data) => {
            if (data.phone_number) applyPhoneNumber(data.phone_number);
          },
        });
      }}
    />
  );
}
