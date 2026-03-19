export interface MapPin {
  id: string;
  name: string;
  address: string;
  category: "property" | "transit" | "dining" | "shopping" | "parks";
  coordinates: [number, number]; // [lng, lat] — Mapbox order
}

export const MAP_CONFIG = {
  center: [-80.263033, 25.846063] as [number, number],
  zoom: 13.5,
  style: "mapbox://styles/mapbox/dark-v11",
  pitch: 0,
  bearing: 0,
  maxZoom: 16,
  minZoom: 11,
};

export const PIN_CATEGORIES = {
  transit: {
    label: "Transit",
    color: "#045571",
  },
  dining: {
    label: "Dining",
    color: "#a9ab36",
  },
  shopping: {
    label: "Shopping & Services",
    color: "#9b5529",
  },
  parks: {
    label: "Parks & Entertainment",
    color: "#7a97ac",
  },
  property: {
    label: "Metro Parc",
    color: "#f7f5f2",
  },
} as const;

export const MAP_PINS: MapPin[] = [
  // Property
  {
    id: "metro-parc",
    name: "Metro Parc",
    address: "952 E 26th St, Hialeah, FL 33013",
    category: "property",
    coordinates: [-80.263033, 25.846063],
  },

  // Transit
  {
    id: "metrorail-tri-rail",
    name: "Hialeah Metrorail / Tri-Rail Transfer Station",
    address: "1125 E 25th St, Hialeah, FL 33013",
    category: "transit",
    coordinates: [-80.259912, 25.84552],
  },

  // Dining
  {
    id: "kush",
    name: "Kush by Stephens",
    address: "1000 E 16th St, Hialeah, FL 33010",
    category: "dining",
    coordinates: [-80.261489, 25.836846],
  },
  {
    id: "la-fresa-francesa",
    name: "La Fresa Francesa",
    address: "59 W 3rd St, Hialeah, FL 33010",
    category: "dining",
    coordinates: [-80.281974, 25.824522],
  },
  {
    id: "trigo-cafe",
    name: "Trigo Café Tapas Wine",
    address: "839 W 49th St, Hialeah, FL 33012",
    category: "dining",
    coordinates: [-80.299787, 25.866929],
  },
  {
    id: "la-bodeguita",
    name: "La Bodeguita",
    address: "2005 W 4th Ave, Hialeah, FL 33010",
    category: "dining",
    coordinates: [-80.289495, 25.83997],
  },
  {
    id: "breadman-bakery",
    name: "Breadman Bakery",
    address: "5804 W 20th Ave, Hialeah, FL 33016",
    category: "dining",
    coordinates: [-80.324119, 25.875344],
  },
  {
    id: "vicky-bakery",
    name: "Vicky Bakery",
    address: "445 E 49th St, Hialeah, FL 33013",
    category: "dining",
    coordinates: [-80.273613, 25.867513],
  },

  // Shopping & Services
  {
    id: "publix",
    name: "Publix Super Market",
    address: "3251 E 2nd Ave, Hialeah, FL 33013",
    category: "shopping",
    coordinates: [-80.277365, 25.851891],
  },
  {
    id: "hialeah-hospital",
    name: "Hialeah Hospital",
    address: "651 E 25th St, Hialeah, FL 33013",
    category: "shopping",
    coordinates: [-80.268622, 25.845536],
  },
  {
    id: "westland-mall",
    name: "Westland Mall",
    address: "1675 W 49th St, Hialeah, FL 33012",
    category: "shopping",
    coordinates: [-80.317324, 25.868497],
  },
  {
    id: "target",
    name: "Target",
    address: "1750 W 37th St, Hialeah, FL 33012",
    category: "shopping",
    coordinates: [-80.317576, 25.853713],
  },
  {
    id: "presidente",
    name: "Presidente Supermarket",
    address: "495 W 29th St, Hialeah, FL 33012",
    category: "shopping",
    coordinates: [-80.292027, 25.848339],
  },
  {
    id: "fresco-y-mas",
    name: "Fresco Y Mas",
    address: "1201 E 10th Ave, Hialeah, FL 33010",
    category: "shopping",
    coordinates: [-80.261534, 25.834084],
  },

  // Parks & Entertainment
  {
    id: "mcdonald-water-park",
    name: "McDonald Water Park",
    address: "7505 W 12th Ave, Hialeah, FL 33014",
    category: "parks",
    coordinates: [-80.305802, 25.89077],
  },
  {
    id: "amelia-earhart-park",
    name: "Amelia Earhart Park",
    address: "401 E 65th St, Hialeah, FL 33012",
    category: "parks",
    coordinates: [-80.282033, 25.881539],
  },
  {
    id: "amc-hialeah-12",
    name: "AMC Hialeah 12",
    address: "780 W 49th St, Hialeah, FL 33012",
    category: "parks",
    coordinates: [-80.297817, 25.8652],
  },
  {
    id: "milander-park",
    name: "Milander Park",
    address: "4700 Palm Ave, Hialeah, FL 33012",
    category: "parks",
    coordinates: [-80.284407, 25.865416],
  },
  {
    id: "babcock-park",
    name: "Babcock Park",
    address: "651 E 4th Ave, Hialeah, FL 33010",
    category: "parks",
    coordinates: [-80.271533, 25.828181],
  },
  {
    id: "k1-speed",
    name: "K1 Speed",
    address: "8600 NW South River Dr, Medley, FL 33166",
    category: "parks",
    coordinates: [-80.320313, 25.851549],
  },
];
