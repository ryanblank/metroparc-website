"use client";

import { useState, useEffect } from "react";
import { GTM_EVENTS } from "@/lib/constants";
import { getAttribution } from "@/lib/dam-ops-client";

type FormType = "floor_plan" | "video_tour" | "3d_tour" | "contact";

interface GatedMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaType: "floorplan" | "3dtour" | "video";
  formType: FormType;
  unitId?: string;
  mediaContent?: React.ReactNode;
  unitName?: string;
  unitBedrooms?: number | null;
}

const SESSION_KEY = "metroparc_media_gated";

export default function GatedMediaModal({
  isOpen,
  onClose,
  mediaType,
  formType,
  unitId,
  mediaContent,
  unitName,
  unitBedrooms,
}: GatedMediaModalProps) {
  const [isGated, setIsGated] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Check session for existing submission
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) setIsGated(false);
    }
  }, []);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const attribution = getAttribution();

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          formType,
          unitId,
          bedrooms: unitBedrooms ?? undefined,
          ...attribution,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      const data = await res.json();

      // Fire GTM event with enriched data from capture-lead response
      if (typeof window !== "undefined") {
        const eventName = GTM_EVENTS.listingsLead.event;

        window.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              lead_id: data.lead_id,
              customer_id: data.customer_id,
              activity_id: data.activity_id,
              is_new_customer: data.is_new_customer,
              is_new_lead: data.is_new_lead,
              email: formData.email,
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
          })
        );

        const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
        w.dataLayer = w.dataLayer || [];
        w.dataLayer.push({
          event: eventName,
          form_type: formType,
          lead_id: data.lead_id,
          customer_id: data.customer_id,
          is_new_customer: data.is_new_customer,
        });

        // Store in session to skip gate for rest of session
        sessionStorage.setItem(SESSION_KEY, "true");
      }

      setIsGated(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const mediaLabel = {
    floorplan: "Floor Plan",
    "3dtour": "3D Tour",
    video: "Video Tour",
  }[mediaType];

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-[fadeInUp_0.3s_ease]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-city-night/60 hover:text-city-night transition-colors cursor-pointer bg-transparent border-none text-xl z-10"
          aria-label="Close"
        >
          &times;
        </button>

        {isGated ? (
          /* Lead Capture Form */
          <div className="p-8">
            <div className="mb-6">
              <p className="font-decorative text-xs text-calm-waves mb-1">
                {unitName ? `${unitName} — ${mediaLabel}` : mediaLabel}
              </p>
              <h2 className="text-2xl font-semibold text-city-night">
                Enter your info to view
              </h2>
              <p className="text-sm text-calm-waves-muted mt-2">
                Get instant access to floor plans, 3D tours, and videos.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gate-firstName" className="block text-xs font-medium text-city-night mb-1">
                    First Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="gate-firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="gate-lastName" className="block text-xs font-medium text-city-night mb-1">
                    Last Name
                  </label>
                  <input
                    id="gate-lastName"
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="gate-email" className="block text-xs font-medium text-city-night mb-1">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  id="gate-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
                />
              </div>

              {error && <p className="text-error text-sm">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-deep-ocean text-clouds py-3 rounded-md font-decorative text-sm uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 hover:bg-deep-ocean-hover disabled:opacity-60 disabled:cursor-not-allowed border-none"
              >
                {isSubmitting ? "Submitting..." : `View ${mediaLabel}`}
              </button>
            </form>
          </div>
        ) : (
          /* Media Content */
          <div className="p-4">
            {unitName && (
              <p className="font-decorative text-xs text-calm-waves mb-2 px-4 pt-4">
                {unitName} — {mediaLabel}
              </p>
            )}
            <div className="min-h-[400px] flex items-center justify-center">
              {mediaContent || (
                <p className="text-calm-waves text-sm">
                  Media content will be displayed here.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
