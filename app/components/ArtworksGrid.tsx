"use client";

import ArtworkCanvas, { type ArtworkCanvasItem } from "./ArtworkCanvas";

// =====================================================================
//  Five Mediterranean / Côte d'Azur paintings — natural "fan" stack
//  inside the shared portfolio folder.
//
//  Composition rules (encoded per-painting in `layout`):
//   - paintings overlap horizontally
//   - the center painting peeks the highest (most visible)
//   - outer paintings sit lower, rotated more, and behind (lower z)
//   - desktop: all 5 visible across the folder
//   - mobile : outer 2 are mostly tucked behind the inner 3 to keep
//              the illusion of a stacked artist portfolio
// =====================================================================
const ARTWORKS: ArtworkCanvasItem[] = [
  // — outer left —————————————————————————————————————————————
  {
    title: "Voiliers en mer",
    image: "/artworks/voiliers-en-mer.jpg",
    fallbackBg: [
      "radial-gradient(110% 60% at 35% 22%, rgba(255,252,240,0.85) 0%, rgba(255,252,240,0) 50%)",
      "radial-gradient(120% 90% at 80% 80%, rgba(40,90,160,0.6) 0%, rgba(40,90,160,0) 55%)",
      "linear-gradient(170deg, #4a8bc5 0%, #6daed8 45%, #c7e4f2 100%)",
    ].join(", "),
    layout: {
      desktop: { leftPct: 1,  widthPct: 25, rotate: -5.2, scale: 0.88, yLift: 0,  z: 1 },
      mobile:  { leftPct: -6, widthPct: 50, rotate: -7.0, scale: 0.70, yLift: -8, z: 1 },
    },
  },

  // — inner left —————————————————————————————————————————————
  {
    title: "Calanque au matin",
    image: "/artworks/calanque-au-matin.jpg",
    fallbackBg: [
      "radial-gradient(100% 70% at 30% 25%, rgba(255,240,210,0.85) 0%, rgba(255,240,210,0) 55%)",
      "radial-gradient(120% 80% at 75% 78%, rgba(30,80,120,0.55) 0%, rgba(30,80,120,0) 60%)",
      "radial-gradient(60% 40% at 50% 95%, rgba(220,180,120,0.55) 0%, rgba(220,180,120,0) 60%)",
      "linear-gradient(175deg, #cfe2ea 0%, #6fa6c3 50%, #356a8c 100%)",
    ].join(", "),
    layout: {
      desktop: { leftPct: 17, widthPct: 28, rotate: -2.4, scale: 0.95, yLift: 6,  z: 3 },
      mobile:  { leftPct: 4,  widthPct: 48, rotate: -2.6, scale: 0.86, yLift: 4,  z: 3 },
    },
  },

  // — center (most visible) ——————————————————————————————————
  {
    title: "Palmier au bord de mer",
    image: "/artworks/palmier-au-bord-de-mer.jpg",
    fallbackBg: [
      "radial-gradient(80% 60% at 78% 28%, rgba(60,120,70,0.65) 0%, rgba(60,120,70,0) 55%)",
      "radial-gradient(60% 40% at 22% 70%, rgba(238,212,120,0.7) 0%, rgba(238,212,120,0) 60%)",
      "radial-gradient(120% 35% at 50% 8%, rgba(255,250,235,0.8) 0%, rgba(255,250,235,0) 60%)",
      "linear-gradient(180deg, #7ec0c8 0%, #b2d4d2 38%, #e8d2a4 78%, #d6b890 100%)",
    ].join(", "),
    layout: {
      desktop: { leftPct: 36, widthPct: 28, rotate: 0.6,  scale: 1.0,  yLift: 16, z: 5 },
      mobile:  { leftPct: 26, widthPct: 48, rotate: 0.4,  scale: 1.0,  yLift: 12, z: 5 },
    },
  },

  // — inner right ————————————————————————————————————————————
  {
    title: "Pont sur la rivière",
    image: "/artworks/pont-sur-la-riviere.jpg",
    fallbackBg: [
      "radial-gradient(45% 32% at 18% 12%, rgba(170,70,40,0.6) 0%, rgba(170,70,40,0) 55%)",
      "radial-gradient(55% 35% at 65% 40%, rgba(220,140,80,0.55) 0%, rgba(220,140,80,0) 60%)",
      "radial-gradient(80% 50% at 50% 85%, rgba(70,140,150,0.55) 0%, rgba(70,140,150,0) 60%)",
      "linear-gradient(170deg, #a8c3d0 0%, #8aa980 38%, #62a09a 72%, #4a808c 100%)",
    ].join(", "),
    layout: {
      desktop: { leftPct: 55, widthPct: 28, rotate: 2.8,  scale: 0.95, yLift: 4,  z: 3 },
      mobile:  { leftPct: 48, widthPct: 48, rotate: 2.6,  scale: 0.86, yLift: 4,  z: 3 },
    },
  },

  // — outer right ————————————————————————————————————————————
  {
    title: "Oliviers en Provence",
    image: "/artworks/oliviers-en-provence.jpg",
    fallbackBg: [
      "radial-gradient(80% 55% at 60% 18%, rgba(245,230,180,0.8) 0%, rgba(245,230,180,0) 55%)",
      "radial-gradient(120% 90% at 25% 80%, rgba(110,130,80,0.65) 0%, rgba(110,130,80,0) 55%)",
      "radial-gradient(70% 40% at 80% 75%, rgba(180,140,90,0.55) 0%, rgba(180,140,90,0) 60%)",
      "linear-gradient(165deg, #d8cf9c 0%, #a8b07a 50%, #6e7e54 100%)",
    ].join(", "),
    layout: {
      desktop: { leftPct: 74, widthPct: 25, rotate: 5.4,  scale: 0.88, yLift: 2,  z: 1 },
      mobile:  { leftPct: 56, widthPct: 50, rotate: 7.0,  scale: 0.70, yLift: -8, z: 1 },
    },
  },
];

export default function ArtworksGrid() {
  // One shared <PortfolioFolder> wraps these; no per-artwork pocket. The
  // paintings are absolutely positioned inside `.artworks-grid` so they
  // can overlap and form a natural fan.
  return (
    <div className="artworks-grid">
      {ARTWORKS.map((a, i) => (
        <ArtworkCanvas key={a.title} {...a} index={i} />
      ))}
    </div>
  );
}
