"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PLANS = [
  // Studios
  { code: "S2B", type: "Studio",    baths: "1 Bath", sqft: "~550 sq ft", plan: "/images/floorplans/s2b.svg" },
  { code: "S2",  type: "Studio",    baths: "1 Bath", sqft: "~530 sq ft", plan: "/images/floorplans/s2.svg"  },
  { code: "S5",  type: "Studio",    baths: "1 Bath", sqft: "~575 sq ft", plan: "/images/floorplans/s5.svg"  },
  // 1 Bedrooms
  { code: "A1B", type: "1 Bedroom", baths: "1 Bath", sqft: "~710 sq ft", plan: "/images/floorplans/a1b.svg" },
  { code: "A2",  type: "1 Bedroom", baths: "1 Bath", sqft: "~740 sq ft", plan: "/images/floorplans/a2.svg"  },
  { code: "A5",  type: "1 Bedroom", baths: "1 Bath", sqft: "~790 sq ft", plan: "/images/floorplans/a5.svg"  },
  // 2 Bedrooms
  { code: "B1",  type: "2 Bedroom", baths: "2 Bath", sqft: "~990 sq ft",   plan: "/images/floorplans/b1.svg" },
  { code: "B4",  type: "2 Bedroom", baths: "2 Bath", sqft: "~1,080 sq ft", plan: "/images/floorplans/b4.svg" },
  { code: "B6",  type: "2 Bedroom", baths: "2 Bath", sqft: "~1,150 sq ft", plan: "/images/floorplans/b6.svg" },
];

const GROUPS = [
  { label: "Studios",    start: 0 },
  { label: "1 Bedrooms", start: 3 },
  { label: "2 Bedrooms", start: 7 },
];

type Plan = typeof PLANS[0];

export default function FloorPlanScroll() {
  const [open, setOpen] = useState<Plan | null>(null);

  const items: ({ kind: "label"; label: string } | { kind: "plan"; plan: Plan })[] = [];
  PLANS.forEach((plan, i) => {
    const group = GROUPS.find((g) => g.start === i);
    if (group) items.push({ kind: "label", label: group.label });
    items.push({ kind: "plan", plan });
  });

  return (
    <>
      {/* Scroll strip */}
      <div className="flex overflow-x-auto scroll-smooth [scroll-snap-type:x_mandatory] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pl-8 pr-8 gap-0">
        {items.map((item) => {
          if (item.kind === "label") {
            return (
              <div
                key={`label-${item.label}`}
                className="flex-shrink-0 flex items-end pb-6 pr-5 [scroll-snap-align:start]"
              >
                <p className="font-decorative text-[0.65rem] uppercase tracking-[0.2em] text-avocado [writing-mode:vertical-rl] rotate-180">
                  {item.label}
                </p>
              </div>
            );
          }

          const { plan } = item;
          return (
            <button
              key={plan.code}
              onClick={() => setOpen(plan)}
              className="flex-shrink-0 w-[200px] mr-4 [scroll-snap-align:start] text-left group cursor-pointer bg-transparent border-0 p-0"
            >
              <div className="relative w-full h-[220px] bg-white mb-3 overflow-hidden">
                <Image
                  src={plan.plan}
                  alt={`${plan.code} floor plan — ${plan.type} at Metro Parc`}
                  fill
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                  sizes="200px"
                />
              </div>
              <p className="font-decorative text-[0.65rem] uppercase tracking-[0.18em] text-avocado mb-1">
                {plan.code}
              </p>
              <p className="text-clouds font-bold text-[0.95rem] mb-1 leading-none">{plan.type}</p>
              <p className="text-clouds/60 text-[0.75rem]">{plan.baths} · {plan.sqft}</p>
            </button>
          );
        })}

        {/* CTA card */}
        <div className="flex-shrink-0 w-[220px] flex flex-col items-start justify-center pl-8 [scroll-snap-align:start]">
          <p className="text-clouds/60 text-[0.875rem] leading-[1.6] mb-6">
            Ready to find your floor plan?
          </p>
          <Link
            href="/availability"
            className="inline-flex items-center gap-2 px-6 py-3 bg-avocado text-city-night rounded-full font-decorative text-[0.8rem] uppercase tracking-[0.1em] no-underline transition-all duration-300 hover:bg-avocado-hover whitespace-nowrap"
          >
            View Availability
          </Link>
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-city-night/90 backdrop-blur-sm p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="relative bg-clouds w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-city-night/10">
              <div>
                <p className="font-decorative text-[0.7rem] uppercase tracking-[0.18em] text-avocado mb-0.5">
                  {open.code}
                </p>
                <p className="font-bold text-city-night text-[1.1rem] leading-none">{open.type}</p>
                <p className="text-city-night-light text-[0.8rem] mt-1">{open.baths} · {open.sqft}</p>
              </div>
              <button
                onClick={() => setOpen(null)}
                className="text-city-night/50 hover:text-city-night text-[1.5rem] leading-none transition-colors cursor-pointer bg-transparent border-0 p-2"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Plan image */}
            <div className="relative h-[55vh] bg-white">
              <Image
                src={open.plan}
                alt={`${open.code} floor plan — ${open.type} at Metro Parc`}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>

          </div>
        </div>
      )}
    </>
  );
}
