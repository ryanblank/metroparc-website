"use client";

import { useState } from "react";
import type { FAQItem } from "@/types";

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export default function FAQAccordion({ items, className = "" }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Group by category
  const categories = items.reduce<Record<string, FAQItem[]>>((acc, item) => {
    const cat = item.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  let globalIndex = 0;

  return (
    <div className={`space-y-8 ${className}`}>
      {Object.entries(categories).map(([category, categoryItems]) => (
        <div key={category}>
          {Object.keys(categories).length > 1 && (
            <h3 className="font-decorative text-xs tracking-[0.2em] text-calm-waves mb-4 uppercase">
              {category}
            </h3>
          )}
          <div className="space-y-0 border-t border-calm-waves-lighter">
            {categoryItems.map((item) => {
              const idx = globalIndex++;
              const isOpen = openIndex === idx;

              return (
                <div key={idx} className="border-b border-calm-waves-lighter">
                  <button
                    onClick={() => toggle(idx)}
                    className="w-full flex justify-between items-center py-5 px-0 text-left bg-transparent border-none cursor-pointer group"
                    aria-expanded={isOpen}
                  >
                    <span className="text-city-night font-medium text-base pr-4 group-hover:text-deep-ocean transition-colors">
                      {item.question}
                    </span>
                    <span
                      className={`text-calm-waves text-xl flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isOpen ? "max-h-96 opacity-100 pb-5" : "max-h-0 opacity-0"
                    }`}
                  >
                    <p className="text-calm-waves-muted text-sm leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
