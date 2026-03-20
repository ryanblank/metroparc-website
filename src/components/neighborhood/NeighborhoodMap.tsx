"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MAP_CONFIG, MAP_PINS, PIN_CATEGORIES, type MapPin } from "@/lib/map-data";

const FILTERABLE_CATEGORIES = ["transit", "dining", "shopping", "parks"] as const;

export default function NeighborhoodMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ pin: MapPin; marker: mapboxgl.Marker }[]>([]);
  const [activeCategories, setActiveCategories] = useState<string[]>([
    "transit", "dining", "shopping", "parks",
  ]);

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Fit map to bounds of all visible pins
  const fitToVisible = (map: mapboxgl.Map, categories: string[]) => {
    const visible = MAP_PINS.filter(
      (p) => p.category === "property" || categories.includes(p.category)
    );
    if (visible.length < 2) return;

    const bounds = new mapboxgl.LngLatBounds();
    visible.forEach((p) => bounds.extend(p.coordinates));
    map.fitBounds(bounds, {
      padding: { top: 80, bottom: 80, left: 80, right: 80 },
      maxZoom: 15,
      duration: 600,
    });
  };

  useEffect(() => {
    if (!mapContainer.current || !token || token === "pk.placeholder") return;

    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_CONFIG.style,
      center: MAP_CONFIG.center,
      zoom: MAP_CONFIG.zoom,
      pitch: MAP_CONFIG.pitch,
      bearing: MAP_CONFIG.bearing,
      maxZoom: MAP_CONFIG.maxZoom,
      minZoom: MAP_CONFIG.minZoom,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    MAP_PINS.forEach((pin) => {
      const cat = PIN_CATEGORIES[pin.category];
      const isProperty = pin.category === "property";
      const size = isProperty ? 16 : 10;

      const el = document.createElement("div");
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = "50%";
      el.style.backgroundColor = cat.color;
      el.style.border = isProperty ? "3px solid #a9ab36" : "2px solid rgba(255,255,255,0.6)";
      el.style.cursor = "pointer";
      el.style.boxShadow = "0 2px 6px rgba(0,0,0,0.4)";

      const popup = new mapboxgl.Popup({ offset: 15, closeButton: false })
        .setHTML(`
          <div style="font-family: Montserrat, sans-serif; padding: 4px 0;">
            <strong style="font-size: 13px; display: block; margin-bottom: 4px;">${pin.name}</strong>
            <span style="font-size: 11px; color: #666;">${pin.address}</span>
            <span style="display: inline-block; margin-top: 6px; font-size: 10px; padding: 2px 8px; border-radius: 20px; background: ${cat.color}20; color: ${cat.color}; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
              ${cat.label}
            </span>
          </div>
        `);

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat(pin.coordinates)
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push({ pin, marker });
    });

    // Fit to all visible pins on load
    map.on("load", () => {
      fitToVisible(map, [...FILTERABLE_CATEGORIES]);
    });

    return () => {
      map.remove();
      markersRef.current = [];
    };
  }, [token]);

  // Update visibility and fit bounds when filters change
  useEffect(() => {
    markersRef.current.forEach(({ pin, marker }) => {
      if (pin.category === "property") return;
      const el = marker.getElement();
      el.style.display = activeCategories.includes(pin.category) ? "block" : "none";
    });

    if (mapRef.current) {
      fitToVisible(mapRef.current, activeCategories);
    }
  }, [activeCategories]);

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  if (!token || token === "pk.placeholder") {
    return (
      <div className="w-full h-[500px] bg-city-night-muted flex items-center justify-center">
        <p className="text-calm-waves text-sm text-center px-4">
          Interactive map will be available once the Mapbox token is configured.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-3 mb-6 px-8">
        {FILTERABLE_CATEGORIES.map((cat) => {
          const config = PIN_CATEGORIES[cat];
          const isActive = activeCategories.includes(cat);
          return (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-decorative text-xs uppercase tracking-[0.1em] border transition-all duration-200 cursor-pointer ${
                isActive
                  ? "border-transparent text-white"
                  : "border-calm-waves-lighter text-calm-waves bg-transparent opacity-50"
              }`}
              style={isActive ? { backgroundColor: config.color } : {}}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: config.color }}
              />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Map container — full bleed */}
      <div
        ref={mapContainer}
        className="w-full h-[500px] lg:h-[600px] overflow-hidden"
      />
    </div>
  );
}
