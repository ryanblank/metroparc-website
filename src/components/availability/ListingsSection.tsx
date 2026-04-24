"use client";

import { useState } from "react";
import GatedMediaModal from "@/components/shared/GatedMediaModal";
import ZoomableImage from "@/components/shared/ZoomableImage";
import type { DamUnit } from "@/lib/dam-ops";

interface ListingsSectionProps {
  units: DamUnit[];
}

type MediaType = "floorplan" | "3dtour" | "video";
type FormType = "floor_plan" | "video_tour" | "3d_tour" | "contact";

/* ── Inline SVG icons for the desktop table ── */

function Icon3DTour({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {/* corner brackets */}
      <path d="M2 8V2h6M16 2h6v6M22 16v6h-6M8 22H2v-6" />
      {/* cube */}
      <path d="M12 6l5 3v6l-5 3-5-3V9z" />
      <path d="M12 6v6M12 12l5-3M12 12l-5-3" />
    </svg>
  );
}

function IconFloorPlan({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="1" />
      <path d="M3 12h8v9M14 3v8h7" />
    </svg>
  );
}

function IconVideo({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="4" width="15" height="16" rx="2" />
      <path d="M17 9l5-3v12l-5-3" />
    </svg>
  );
}

function IconInquire({ className = "" }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 4L12 13 2 4" />
    </svg>
  );
}

const MEDIA_TO_FORM_TYPE: Record<MediaType, FormType> = {
  floorplan: "floor_plan",
  "3dtour": "3d_tour",
  video: "video_tour",
};

function formatPrice(price: number | null): string {
  if (price == null) return "—";
  return `$${price.toLocaleString("en-US")}`;
}

function bedroomLabel(bedrooms: number | null, full = false): string {
  if (bedrooms == null) return "—";
  if (bedrooms === 0) return "Studio";
  if (full) return `${bedrooms} Bed`;
  return String(bedrooms);
}

export default function ListingsSection({ units }: ListingsSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMedia, setModalMedia] = useState<{
    type: MediaType;
    formType: FormType;
    unitId: string;
    unitName: string;
    unitBedrooms: number | null;
    unitBathrooms: number | null;
    unitPriceNet: number | null;
    content?: React.ReactNode;
  } | null>(null);

  // Sort: bedrooms ASC, price_gross ASC
  const sorted = [...units].sort((a, b) => {
    const bedA = a.bedrooms ?? 0;
    const bedB = b.bedrooms ?? 0;
    if (bedA !== bedB) return bedA - bedB;
    return (a.price_gross ?? 0) - (b.price_gross ?? 0);
  });

  // Auto-hide columns if ALL units lack the value
  const hasFloorPlan = units.some((u) => u.floor_plans && u.floor_plans.length > 0);
  const hasVideoTour = units.some((u) => u.video_tour_url);
  const has3DTour = units.some((u) => u.tour_3d_url);
  const hasNetPrice = units.some((u) => u.price_net != null);
  const hasGrossPrice = units.some((u) => u.price_gross != null);

  const openMedia = (type: MediaType, unit: DamUnit) => {
    let content: React.ReactNode;

    if (type === "3dtour" && unit.tour_3d_url) {
      content = (
        <iframe
          src={unit.tour_3d_url}
          className="w-full h-[500px] border-none rounded"
          title={`${unit.unit_number} 3D Tour`}
          allowFullScreen
        />
      );
    } else if (type === "floorplan" && unit.floor_plans?.[0]) {
      content = (
        <ZoomableImage
          src={unit.floor_plans[0]}
          alt={`${unit.unit_number} floor plan — apartments for rent in Hialeah FL`}
        />
      );
    } else if (type === "video" && unit.video_tour_url) {
      content = (
        <iframe
          src={unit.video_tour_url}
          className="w-full h-[500px] border-none rounded"
          title={`${unit.unit_number} Video Tour`}
          allowFullScreen
        />
      );
    }

    setModalMedia({
      type,
      formType: MEDIA_TO_FORM_TYPE[type],
      unitId: unit.id,
      unitName: unit.unit_number,
      unitBedrooms: unit.bedrooms,
      unitBathrooms: unit.bathrooms,
      unitPriceNet: unit.price_net,
      content,
    });
    setModalOpen(true);
  };

  const openInquiry = (unit: DamUnit) => {
    setModalMedia({
      type: "floorplan", // display type doesn't matter for inquiry
      formType: "contact",
      unitId: unit.id,
      unitName: unit.unit_number,
      unitBedrooms: unit.bedrooms,
      unitBathrooms: unit.bathrooms,
      unitPriceNet: unit.price_net,
      content: undefined,
    });
    setModalOpen(true);
  };

  if (units.length === 0) {
    return (
      <p className="text-center text-city-night-light py-8">
        Listings are temporarily unavailable. Please contact us at{" "}
        <a href="tel:+13056149674" className="DCRPhoneHref text-deep-ocean hover:underline">
          (305) 614-9674
        </a>
        .
      </p>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-deep-ocean">
              <th className="py-3 px-4 font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Unit</th>
              <th className="py-3 px-4 font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Bed</th>
              <th className="py-3 px-4 font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Bath</th>
              {hasNetPrice && (
                <th className="py-3 px-4 font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Net Price*</th>
              )}
              {hasGrossPrice && (
                <th className="py-3 px-4 font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Gross</th>
              )}
              {hasFloorPlan && (
                <th className="py-3 px-4 w-16 text-center font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Floorplan</th>
              )}
              {hasVideoTour && (
                <th className="py-3 px-4 w-16 text-center font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Video Tour</th>
              )}
              {has3DTour && (
                <th className="py-3 px-4 w-16 text-center font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">3D Tour</th>
              )}
              <th className="py-3 px-4 w-16 text-center font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Inquire</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((unit) => (
              <tr key={unit.id} className="border-b border-calm-waves-lighter hover:bg-white transition-colors">
                <td className="py-4 px-4 font-semibold text-city-night">{unit.unit_number}</td>
                <td className="py-4 px-4 text-city-night-light">{bedroomLabel(unit.bedrooms)}</td>
                <td className="py-4 px-4 text-city-night-light">{unit.bathrooms ?? "—"}</td>
                {hasNetPrice && (
                  <td className="py-4 px-4 text-city-night-light">{formatPrice(unit.price_net)}</td>
                )}
                {hasGrossPrice && (
                  <td className="py-4 px-4 text-city-night-light">{formatPrice(unit.price_gross)}</td>
                )}
                {hasFloorPlan && (
                  <td className="py-4 px-4 text-center">
                    {unit.floor_plans?.[0] ? (
                      <button
                        onClick={() => openMedia("floorplan", unit)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-deep-ocean bg-transparent cursor-pointer hover:bg-deep-ocean hover:text-white transition-colors border-none"
                        aria-label={`View floor plan for ${unit.unit_number}`}
                      >
                        <IconFloorPlan className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="text-city-night-light">—</span>
                    )}
                  </td>
                )}
                {hasVideoTour && (
                  <td className="py-4 px-4 text-center">
                    {unit.video_tour_url ? (
                      <button
                        onClick={() => openMedia("video", unit)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-deep-ocean bg-transparent cursor-pointer hover:bg-deep-ocean hover:text-white transition-colors border-none"
                        aria-label={`Watch video tour for ${unit.unit_number}`}
                      >
                        <IconVideo className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="text-city-night-light">—</span>
                    )}
                  </td>
                )}
                {has3DTour && (
                  <td className="py-4 px-4 text-center">
                    {unit.tour_3d_url ? (
                      <button
                        onClick={() => openMedia("3dtour", unit)}
                        className="inline-flex items-center justify-center w-9 h-9 rounded-full text-city-night bg-transparent cursor-pointer hover:bg-city-night hover:text-white transition-colors border-none"
                        aria-label={`Explore 3D tour for ${unit.unit_number}`}
                      >
                        <Icon3DTour className="w-5 h-5" />
                      </button>
                    ) : (
                      <span className="text-city-night-light">—</span>
                    )}
                  </td>
                )}
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => openInquiry(unit)}
                    className="inline-flex items-center justify-center w-9 h-9 rounded-full text-deep-ocean bg-transparent cursor-pointer hover:bg-deep-ocean hover:text-white transition-colors border-none"
                    aria-label={`Inquire about ${unit.unit_number}`}
                  >
                    <IconInquire className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-4">
        {sorted.map((unit) => (
          <div key={unit.id} className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-city-night text-lg">{unit.unit_number}</h3>
                <p className="text-sm text-city-night-light">
                  {bedroomLabel(unit.bedrooms, true)} &middot; {unit.bathrooms ?? "—"} Bath
                </p>
              </div>
            </div>
            {hasNetPrice && unit.price_net != null && (
              <div className="mb-4">
                <p className="text-xs text-city-night-light">Net Price*</p>
                <p className="text-lg font-semibold text-city-night">{formatPrice(unit.price_net)}</p>
              </div>
            )}
            {hasGrossPrice && unit.price_gross != null && (
              <div className="mb-4">
                <p className="text-xs text-city-night-light">Gross</p>
                <p className="text-lg font-semibold text-city-night">{formatPrice(unit.price_gross)}</p>
              </div>
            )}
            <div className="flex gap-2 flex-wrap">
              {unit.floor_plans?.[0] && (
                <button
                  onClick={() => openMedia("floorplan", unit)}
                  className="text-xs py-2 px-3 rounded bg-deep-ocean text-white border-none cursor-pointer hover:bg-deep-ocean-hover transition-colors font-decorative uppercase tracking-wider"
                >
                  Floor Plan
                </button>
              )}
              {unit.video_tour_url && (
                <button
                  onClick={() => openMedia("video", unit)}
                  className="text-xs py-2 px-3 rounded bg-deep-ocean text-white border-none cursor-pointer hover:bg-deep-ocean-hover transition-colors font-decorative uppercase tracking-wider"
                >
                  Video
                </button>
              )}
              {unit.tour_3d_url && (
                <button
                  onClick={() => openMedia("3dtour", unit)}
                  className="text-xs py-2 px-3 rounded border border-deep-ocean text-deep-ocean bg-transparent cursor-pointer hover:bg-deep-ocean hover:text-white transition-colors font-decorative uppercase tracking-wider"
                >
                  3D Tour
                </button>
              )}
              <button
                onClick={() => openInquiry(unit)}
                className="text-xs py-2 px-3 rounded border border-deep-ocean text-deep-ocean bg-transparent cursor-pointer hover:bg-deep-ocean hover:text-white transition-colors font-decorative uppercase tracking-wider"
              >
                Inquire
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Gated Media Modal */}
      {modalMedia && (
        <GatedMediaModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setModalMedia(null);
          }}
          mediaType={modalMedia.type}
          formType={modalMedia.formType}
          unitId={modalMedia.unitId}
          unitName={modalMedia.unitName}
          unitBedrooms={modalMedia.unitBedrooms}
          unitBathrooms={modalMedia.unitBathrooms}
          unitPriceNet={modalMedia.unitPriceNet}
          mediaContent={modalMedia.content}
        />
      )}
    </>
  );
}
