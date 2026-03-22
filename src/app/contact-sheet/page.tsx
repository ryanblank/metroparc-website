/* eslint-disable @next/next/no-img-element */
"use client";

/**
 * DEV-ONLY contact sheet for reviewing amenity photos.
 * Visit /contact-sheet to see all images organized by grid category.
 * Delete this page before going to production.
 */

const CATEGORIES = [
  {
    name: "Resort-Style Living",
    note: "Hero card (2×2). 6 photos — aerial, swimming, deck, lifestyle, lounging.",
    photos: [
      "pool-aerial-wide.jpg",
      "pool-floating.jpg",
      "pool-deck-walk.jpg",
      "pool-swimming.jpg",
      "pool-lifestyle-towel.jpg",
      "pool-lounging.jpg",
    ],
  },
  {
    name: "Fitness Center",
    note: "6 photos — spin bikes, cable machine, barbell curls, squats.",
    photos: [
      "gym-spin-bikes.jpg",
      "gym-cable-wide.jpg",
      "gym-cable-action.jpg",
      "gym-barbell-wide.jpg",
      "gym-barbell-rear.jpg",
      "gym-squats.jpg",
    ],
  },
  {
    name: "Co-Working Space",
    note: "5 photos — pods, laptop work, phone calls, terrace.",
    photos: [
      "cowork-pods-walk.jpg",
      "cowork-pod-laptop.jpg",
      "cowork-pod-closeup.jpg",
      "cowork-terrace-phone.jpg",
      "cowork-outdoor-call.jpg",
    ],
  },
  {
    name: "Clubroom",
    note: "5 photos — pool table, foosball, lounge, terrace seating. (Empty interior shots.)",
    photos: [
      "club-overview.jpg",
      "club-pool-table.jpg",
      "club-foosball-tv.jpg",
      "club-lounge.jpg",
      "club-terrace-chairs.jpg",
    ],
  },
  {
    name: "Outdoor Grilling",
    note: "6 photos — setup, action, couple, serving, laughing, dining.",
    photos: [
      "grill-setup.jpg",
      "grill-action.jpg",
      "grill-couple-wide.jpg",
      "grill-serving.jpg",
      "grill-laughing.jpg",
      "grill-dining.jpg",
    ],
  },
  {
    name: "24-Hour Services",
    note: "6 photos — lobby, concierge desk, seating, dog/pet-friendly.",
    photos: [
      "lobby-wide.jpg",
      "concierge-interaction.jpg",
      "concierge-laughing.jpg",
      "lobby-seating.jpg",
      "lobby-dog-wide.jpg",
      "lobby-dog-closeup.jpg",
    ],
  },
];

function PhotoCard({ src, index }: { src: string; index: number }) {
  return (
    <div
      style={{
        display: "inline-block",
        width: 280,
        margin: 8,
        verticalAlign: "top",
        border: "3px solid #7fa83b",
        borderRadius: 8,
        overflow: "hidden",
        background: "#1a1a2e",
      }}
    >
      <img
        src={`/images/amenities/${src}`}
        alt={src}
        style={{ width: "100%", height: 190, objectFit: "cover" }}
      />
      <div style={{ padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ color: "#eee", fontSize: 13, margin: 0 }}>{src}</p>
        <span style={{ color: "#7fa83b", fontSize: 12, fontWeight: 700 }}>#{index + 1}</span>
      </div>
    </div>
  );
}

export default function ContactSheet() {
  return (
    <div
      style={{
        background: "#111",
        minHeight: "100vh",
        padding: "40px 24px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1
        style={{
          color: "#fff",
          fontSize: 28,
          marginBottom: 8,
        }}
      >
        Amenities Grid — Photo Contact Sheet
      </h1>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 40 }}>
        6 categories, all photos assigned. Review groupings below — every photo
        in a category will rotate in that grid card with slow crossfade.
      </p>

      {CATEGORIES.map((cat) => (
        <div key={cat.name} style={{ marginBottom: 48 }}>
          <h2 style={{ color: "#fff", fontSize: 20, marginBottom: 4 }}>
            {cat.name}
          </h2>
          <p style={{ color: "#7fa83b", fontSize: 13, marginBottom: 16 }}>
            {cat.note}
          </p>

          {cat.photos.map((file, i) => (
            <PhotoCard key={file} src={file} index={i} />
          ))}
        </div>
      ))}

      <div
        style={{
          marginTop: 60,
          padding: 20,
          background: "#1a1a2e",
          borderRadius: 8,
          color: "#ccc",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        <h3 style={{ color: "#fff", marginTop: 0 }}>Proposed Plan</h3>
        <p>
          <strong style={{ color: "#7fa83b" }}>6 cards, 6 categories:</strong> Resort-Style Living (2×2 hero) + 5 small cards. Fills the empty bottom-right corner.
        </p>
        <p>
          <strong style={{ color: "#7fa83b" }}>Every card rotates:</strong> All photos in each category cycle with slow crossfade animation.
        </p>
        <p>
          <strong style={{ color: "#7fa83b" }}>34 photos total</strong> across the grid — no separate gallery section needed.
        </p>
      </div>
    </div>
  );
}
