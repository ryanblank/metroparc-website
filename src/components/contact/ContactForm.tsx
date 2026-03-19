"use client";

import { useState } from "react";
import { GTM_EVENTS, MOVE_IN_OPTIONS, BEDROOM_OPTIONS, PRICE_RANGE_OPTIONS } from "@/lib/constants";
import { getAttribution } from "@/lib/dam-ops-client";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    moveInDate: "",
    bedrooms: "",
    priceRange: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
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
          phone: formData.phone,
          moveInDate: formData.moveInDate,
          bedrooms: formData.bedrooms !== "" ? Number(formData.bedrooms) : undefined,
          budgetMin: formData.priceRange ? Number(formData.priceRange.split("-")[0]) : undefined,
          budgetMax: formData.priceRange ? Number(formData.priceRange.split("-")[1]) : undefined,
          message: formData.message,
          formType: "contact",
          ...attribution,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      const data = await res.json();

      // Fire dam_registration event with enriched data
      if (typeof window !== "undefined") {
        const eventName = GTM_EVENTS.registration.event;

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
          form_type: "contact",
          lead_id: data.lead_id,
          customer_id: data.customer_id,
          is_new_customer: data.is_new_customer,
        });
      }

      setIsSuccess(true);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", moveInDate: "", bedrooms: "", priceRange: "", message: "" });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-xl p-8 text-center">
        <div className="text-avocado text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-city-night mb-2">Thank You!</h3>
        <p className="text-city-night-light">
          We&apos;ve received your message and will be in touch shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="mt-6 text-sm text-deep-ocean underline cursor-pointer bg-transparent border-none"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-sm">
      <h3 className="text-xl font-semibold text-city-night mb-6">Get in Touch</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="contact-firstName" className="block text-xs font-medium text-city-night mb-1">
            First Name <span className="text-error">*</span>
          </label>
          <input
            id="contact-firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-clouds focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean focus:bg-white transition-colors"
          />
        </div>
        <div>
          <label htmlFor="contact-lastName" className="block text-xs font-medium text-city-night mb-1">
            Last Name
          </label>
          <input
            id="contact-lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-clouds focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="contact-email" className="block text-xs font-medium text-city-night mb-1">
          Email <span className="text-error">*</span>
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-clouds focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean focus:bg-white transition-colors"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="contact-phone" className="block text-xs font-medium text-city-night mb-1">
          Phone
        </label>
        <input
          id="contact-phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-clouds focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean focus:bg-white transition-colors"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="contact-moveIn" className="block text-xs font-medium text-city-night mb-1">
          Move-in Timeline
        </label>
        <select
          id="contact-moveIn"
          name="moveInDate"
          value={formData.moveInDate}
          onChange={handleChange}
          className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-clouds focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean focus:bg-white transition-colors"
        >
          <option value="">Select timeline...</option>
          {MOVE_IN_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="contact-bedrooms" className="block text-xs font-medium text-city-night mb-1">
            Bedrooms
          </label>
          <select
            id="contact-bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-clouds focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean focus:bg-white transition-colors"
          >
            <option value="">Any</option>
            {BEDROOM_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-priceRange" className="block text-xs font-medium text-city-night mb-1">
            Price Range
          </label>
          <select
            id="contact-priceRange"
            name="priceRange"
            value={formData.priceRange}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-clouds focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean focus:bg-white transition-colors"
          >
            <option value="">Any</option>
            {PRICE_RANGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="contact-message" className="block text-xs font-medium text-city-night mb-1">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us anything we should know..."
          className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-clouds focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean focus:bg-white transition-colors resize-vertical"
        />
      </div>

      {error && <p className="text-error text-sm mb-4">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-deep-ocean text-clouds py-3 rounded-md font-decorative text-sm uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 hover:bg-deep-ocean-hover disabled:opacity-60 disabled:cursor-not-allowed border-none"
      >
        {isSubmitting ? "Submitting..." : "Send Message"}
      </button>
    </form>
  );
}
