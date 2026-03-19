"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { MOVE_IN_OPTIONS, BEDROOM_OPTIONS, PRICE_RANGE_OPTIONS, GTM_EVENTS } from "@/lib/constants";
import { getAttribution } from "@/lib/dam-ops-client";

interface BookTourModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TimeSlot {
  time: string;
  display: string;
}

export default function BookTourModal({ isOpen, onClose }: BookTourModalProps) {
  const [step, setStep] = useState<"form" | "confirmation">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableTimes, setAvailableTimes] = useState<TimeSlot[]>([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    moveIn: "",
    priceRange: "",
    bedrooms: "",
    message: "",
  });

  // Lock body scroll when open
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

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    }
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Fetch available times when date changes
  const fetchAvailableTimes = useCallback(async (date: string) => {
    if (!date) return;
    setIsLoadingTimes(true);
    setAvailableTimes([]);

    try {
      // Get a 1-day window for the selected date
      const res = await fetch(
        `/api/availability?from_date=${date}&to_date=${date}`
      );
      const data = await res.json();

      if (data.available_times) {
        const now = new Date();
        const twoHoursFromNow = new Date(now.getTime() + 120 * 60 * 1000);

        const slots: TimeSlot[] = data.available_times
          .filter((time: string) => {
            const slotDate = new Date(time);
            return slotDate > twoHoursFromNow;
          })
          .map((time: string) => {
            const d = new Date(time);
            return {
              time,
              display: d.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: "America/New_York",
              }),
            };
          });

        setAvailableTimes(slots);
      }
    } catch {
      console.error("Failed to fetch available times");
    } finally {
      setIsLoadingTimes(false);
    }
  }, []);

  useEffect(() => {
    if (formData.date) {
      fetchAvailableTimes(formData.date);
    }
  }, [formData.date, fetchAvailableTimes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!formData.date || !formData.time) {
      setError("Please select a date and time for your tour.");
      return;
    }

    setIsSubmitting(true);

    try {
      const attribution = getAttribution();

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          start: formData.time,
          moveInDate: formData.moveIn,
          budgetMin: formData.priceRange ? Number(formData.priceRange.split("-")[0]) : undefined,
          budgetMax: formData.priceRange ? Number(formData.priceRange.split("-")[1]) : undefined,
          bedrooms: formData.bedrooms !== "" ? Number(formData.bedrooms) : undefined,
          notes: formData.message,
          ...attribution,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to book tour");
      }

      const data = await res.json();

      // Fire dam_tour_lead event with enriched data
      if (typeof window !== "undefined") {
        const eventName = GTM_EVENTS.tourLead.event;

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
          form_type: "book_tour",
          lead_id: data.lead_id,
          customer_id: data.customer_id,
          is_new_customer: data.is_new_customer,
        });
      }

      setStep("confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("form");
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      moveIn: "",
      priceRange: "",
      bedrooms: "",
      message: "",
    });
    setError(null);
    setAvailableTimes([]);
    onClose();
  };

  // Get min date (today)
  const today = new Date().toISOString().split("T")[0];
  // Get max date (7 days out)
  const maxDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-[fadeInUp_0.3s_ease]"
        role="dialog"
        aria-modal="true"
        aria-label="Book a Tour"
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-city-night/60 hover:text-city-night transition-colors cursor-pointer bg-transparent border-none text-xl"
          aria-label="Close modal"
        >
          &times;
        </button>

        {step === "form" ? (
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <p className="font-decorative text-xs text-calm-waves mb-1">
                Schedule Your Visit
              </p>
              <h2 className="text-2xl font-semibold text-city-night">
                Book a Tour
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tour-firstName" className="block text-xs font-medium text-city-night mb-1">
                    First Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="tour-firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="tour-lastName" className="block text-xs font-medium text-city-night mb-1">
                    Last Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="tour-lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="tour-email" className="block text-xs font-medium text-city-night mb-1">
                  Email <span className="text-error">*</span>
                </label>
                <input
                  id="tour-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="tour-phone" className="block text-xs font-medium text-city-night mb-1">
                  Phone
                </label>
                <input
                  id="tour-phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
                  placeholder="(305) 555-0123"
                />
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tour-date" className="block text-xs font-medium text-city-night mb-1">
                    Preferred Date <span className="text-error">*</span>
                  </label>
                  <input
                    id="tour-date"
                    name="date"
                    type="date"
                    required
                    min={today}
                    max={maxDate}
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="tour-time" className="block text-xs font-medium text-city-night mb-1">
                    Preferred Time <span className="text-error">*</span>
                  </label>
                  {isLoadingTimes ? (
                    <div className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-calm-waves">
                      Loading times...
                    </div>
                  ) : (
                    <select
                      id="tour-time"
                      name="time"
                      required
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
                    >
                      <option value="">
                        {formData.date
                          ? availableTimes.length > 0
                            ? "Select a time"
                            : "No times available"
                          : "Select date first"}
                      </option>
                      {availableTimes.map((slot) => (
                        <option key={slot.time} value={slot.time}>
                          {slot.display}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              {/* Move-in Timeline */}
              <div>
                <label htmlFor="tour-moveIn" className="block text-xs font-medium text-city-night mb-1">
                  Move-in Timeline
                </label>
                <select
                  id="tour-moveIn"
                  name="moveIn"
                  value={formData.moveIn}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
                >
                  <option value="">Select timeline</option>
                  {MOVE_IN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Bedrooms & Price Range Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="tour-bedrooms" className="block text-xs font-medium text-city-night mb-1">
                    Bedrooms
                  </label>
                  <select
                    id="tour-bedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
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
                  <label htmlFor="tour-priceRange" className="block text-xs font-medium text-city-night mb-1">
                    Price Range
                  </label>
                  <select
                    id="tour-priceRange"
                    name="priceRange"
                    value={formData.priceRange}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors"
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

              {/* Message */}
              <div>
                <label htmlFor="tour-message" className="block text-xs font-medium text-city-night mb-1">
                  Message
                </label>
                <textarea
                  id="tour-message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-calm-waves-lighter rounded-md text-sm text-city-night bg-white focus:outline-none focus:border-deep-ocean focus:ring-1 focus:ring-deep-ocean transition-colors resize-y"
                  placeholder="Any questions or preferences..."
                />
              </div>

              {/* Error */}
              {error && (
                <p className="text-error text-sm">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-deep-ocean text-clouds py-3 rounded-md font-decorative text-sm uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 hover:bg-deep-ocean-hover disabled:opacity-60 disabled:cursor-not-allowed border-none"
              >
                {isSubmitting ? "Booking..." : "Schedule Tour"}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Step */
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-avocado/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-avocado text-3xl">&#10003;</span>
            </div>
            <h2 className="text-2xl font-semibold text-city-night mb-3">
              Tour Booked!
            </h2>
            <p className="text-calm-waves-muted mb-2">
              We&apos;ve scheduled your tour for:
            </p>
            <p className="text-lg font-semibold text-deep-ocean mb-6">
              {formData.date &&
                new Date(formData.date + "T12:00:00").toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              {formData.time && (
                <>
                  {" at "}
                  {new Date(formData.time).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: "America/New_York",
                  })}
                </>
              )}
            </p>
            <p className="text-sm text-calm-waves mb-8">
              A confirmation will be sent to {formData.email}
            </p>
            <button
              onClick={handleClose}
              className="bg-deep-ocean text-clouds px-8 py-3 rounded-md font-decorative text-sm uppercase tracking-[0.1em] cursor-pointer transition-all duration-300 hover:bg-deep-ocean-hover border-none"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
