"use client";

import { useState } from "react";
import GatedMediaModal from "@/components/shared/GatedMediaModal";
import type { DamUnit } from "@/lib/dam-ops";

interface ListingsSectionProps {
  units: DamUnit[];
}

type MediaType = "floorplan" | "3dtour" | "video";
type FormType = "floor_plan" | "video_tour" | "3d_tour" | "contact";

const MEDIA_TO_FORM_TYPE: Record<MediaType, FormType> = {
  floorplan: "floor_plan",
  "3dtour": "3d_tour",
  video: "video_tour",
};

function formatPrice(price: number | null): string {
  if (price == null) return "—";
  return `$${price.toLocaleString("en-US")}`;
}

function bedroomLabel(bedrooms: number | null): string {
  if (bedrooms == null) return "—";
  if (bedrooms === 0) return "Studio";
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
  const hasFloorPlan = units.some((u) => u.floor_plan_url);
  const hasVideoTour = units.some((u) => u.video_tour_url);
  const has3DTour = units.some((u) => u.tour_3d_url);
  const hasNetPrice = units.some((u) => u.price_net != null);

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
    } else if (type === "floorplan" && unit.floor_plan_url) {
      content = (
        <img
          src={unit.floor_plan_url}
          alt={`${unit.unit_number} Floor Plan`}
          className="max-w-full max-h-[500px] mx-auto"
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
      content: undefined,
    });
    setModalOpen(true);
  };

  if (units.length === 0) {
    return (
      <p className="text-center text-city-night-light py-8">
        Listings are temporarily unavailable. Please contact us at{" "}
        <a href="tel:+13056149674" className="text-deep-ocean hover:underline">
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
              <th className="py-3 px-4 font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Gross Price</th>
              {hasNetPrice && (
                <th className="py-3 px-4 font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Net Price</th>
              )}
              {hasFloorPlan && (
                <th className="py-3 px-4 font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Floorplan</th>
              )}
              {hasVideoTour && (
                <th className="py-3 px-4 font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Video Tour</th>
              )}
              {has3DTour && (
                <th className="py-3 px-4 font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">3D Tour</th>
              )}
              <th className="py-3 px-4 font-decorative text-xs uppercase tracking-[0.1em] text-deep-ocean">Inquire</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((unit) => (
              <tr key={unit.id} className="border-b border-calm-waves-lighter hover:bg-white transition-colors">
                <td className="py-4 px-4 font-semibold text-city-night">{unit.unit_number}</td>
                <td className="py-4 px-4 text-city-night-light">{bedroomLabel(unit.bedrooms)}</td>
                <td className="py-4 px-4 text-city-night-light">{unit.bathrooms ?? "—"}</td>
                <td className="py-4 px-4 font-semibold text-deep-ocean">{formatPrice(unit.price_gross)}</td>
                {hasNetPrice && (
                  <td className="py-4 px-4 text-city-night-light">{formatPrice(unit.price_net)}</td>
                )}
                {hasFloorPlan && (
                  <td className="py-4 px-4">
                    {unit.floor_plan_url ? (
                      <button
                        onClick={() => openMedia("floorplan", unit)}
                        className="text-xs px-3 py-1.5 rounded border border-deep-ocean text-deep-ocean bg-transparent cursor-pointer hover:bg-deep-ocean hover:text-white transition-colors font-decorative uppercase tracking-wider"
                      >
                        View
                      </button>
                    ) : (
                      <span className="text-city-night-light">—</span>
                    )}
                  </td>
                )}
                {hasVideoTour && (
                  <td className="py-4 px-4">
                    {unit.video_tour_url ? (
                      <button
                        onClick={() => openMedia("video", unit)}
                        className="text-xs px-3 py-1.5 rounded border border-deep-ocean text-deep-ocean bg-transparent cursor-pointer hover:bg-deep-ocean hover:text-white transition-colors font-decorative uppercase tracking-wider"
                      >
                        Watch
                      </button>
                    ) : (
                      <span className="text-city-night-light">—</span>
                    )}
                  </td>
                )}
                {has3DTour && (
                  <td className="py-4 px-4">
                    {unit.tour_3d_url ? (
                      <button
                        onClick={() => openMedia("3dtour", unit)}
                        className="text-xs px-3 py-1.5 rounded border border-avocado text-avocado-muted bg-transparent cursor-pointer hover:bg-avocado hover:text-city-night transition-colors font-decorative uppercase tracking-wider"
                      >
                        Explore
                      </button>
                    ) : (
                      <span className="text-city-night-light">—</span>
                    )}
                  </td>
                )}
                <td className="py-4 px-4">
                  <button
                    onClick={() => openInquiry(unit)}
                    className="text-xs px-3 py-1.5 rounded bg-deep-ocean text-white cursor-pointer hover:bg-deep-ocean-hover transition-colors font-decorative uppercase tracking-wider border-none"
                  >
                    Inquire
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
                  {bedroomLabel(unit.bedrooms)} Bed &middot; {unit.bathrooms ?? "—"} Bath
                </p>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <div>
                <p className="text-xs text-city-night-light">Gross</p>
                <p className="text-lg font-semibold text-deep-ocean">{formatPrice(unit.price_gross)}</p>
              </div>
              {hasNetPrice && unit.price_net != null && (
                <div>
                  <p className="text-xs text-city-night-light">Net</p>
                  <p className="text-lg font-semibold text-city-night">{formatPrice(unit.price_net)}</p>
                </div>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {unit.floor_plan_url && (
                <button
                  onClick={() => openMedia("floorplan", unit)}
                  className="text-xs py-2 px-3 rounded border border-deep-ocean text-deep-ocean bg-transparent cursor-pointer hover:bg-deep-ocean hover:text-white transition-colors font-decorative uppercase tracking-wider"
                >
                  Floor Plan
                </button>
              )}
              {unit.video_tour_url && (
                <button
                  onClick={() => openMedia("video", unit)}
                  className="text-xs py-2 px-3 rounded border border-deep-ocean text-deep-ocean bg-transparent cursor-pointer hover:bg-deep-ocean hover:text-white transition-colors font-decorative uppercase tracking-wider"
                >
                  Video
                </button>
              )}
              {unit.tour_3d_url && (
                <button
                  onClick={() => openMedia("3dtour", unit)}
                  className="text-xs py-2 px-3 rounded border border-avocado text-avocado-muted bg-transparent cursor-pointer hover:bg-avocado hover:text-city-night transition-colors font-decorative uppercase tracking-wider"
                >
                  3D Tour
                </button>
              )}
              <button
                onClick={() => openInquiry(unit)}
                className="text-xs py-2 px-3 rounded bg-deep-ocean text-white cursor-pointer hover:bg-deep-ocean-hover transition-colors font-decorative uppercase tracking-wider border-none"
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
          mediaContent={modalMedia.content}
        />
      )}
    </>
  );
}
