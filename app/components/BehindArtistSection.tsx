"use client";

import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Per-polaroid composition data. Same idea as the portfolio fan: the
 * five children are absolutely positioned inside a relative container,
 * so they can overlap, sit at different depths, and feel hand-stacked.
 */
interface PolaroidItem {
  caption: string;
  /** CSS background used as a visible placeholder until a real photo
   * is uploaded. The component is image-ready (drop a real <img> into
   * the `.polaroid-photo` slot when assets land). */
  placeholderBg: string;
  layout: {
    desktop: { leftPct: number; widthPct: number; rotate: number; scale: number; yLift: number; z: number };
    mobile:  { leftPct: number; widthPct: number; rotate: number; scale: number; yLift: number; z: number };
  };
}

const POLAROIDS: PolaroidItem[] = [
  // — outer left —————————————————————————————————————————————
  {
    caption: "Atelier",
    placeholderBg: [
      "radial-gradient(80% 60% at 30% 28%, rgba(255,236,196,0.85) 0%, rgba(255,236,196,0) 55%)",
      "linear-gradient(165deg, #e8d3a5 0%, #c79f6a 100%)",
    ].join(", "),
    layout: {
      desktop: { leftPct: 2,  widthPct: 22, rotate: -7.0, scale: 0.88, yLift: 0,  z: 1 },
      mobile:  { leftPct: -6, widthPct: 50, rotate: -8.0, scale: 0.70, yLift: -6, z: 1 },
    },
  },

  // — inner left —————————————————————————————————————————————
  {
    caption: "Côte d'Azur",
    placeholderBg: [
      "radial-gradient(90% 60% at 50% 30%, rgba(220,238,248,0.85) 0%, rgba(220,238,248,0) 55%)",
      "linear-gradient(175deg, #8fbedc 0%, #3c79a8 100%)",
    ].join(", "),
    layout: {
      desktop: { leftPct: 18, widthPct: 23, rotate: -3.2, scale: 0.95, yLift: 6,  z: 3 },
      mobile:  { leftPct: 4,  widthPct: 48, rotate: -3.0, scale: 0.86, yLift: 4,  z: 3 },
    },
  },

  // — center (most visible) ——————————————————————————————————
  {
    caption: "En peinture",
    placeholderBg: [
      "radial-gradient(70% 55% at 50% 30%, rgba(255,244,220,0.92) 0%, rgba(255,244,220,0) 55%)",
      "radial-gradient(60% 40% at 50% 80%, rgba(180,140,90,0.45) 0%, rgba(180,140,90,0) 60%)",
      "linear-gradient(170deg, #f0d8aa 0%, #c89368 100%)",
    ].join(", "),
    layout: {
      desktop: { leftPct: 37, widthPct: 24, rotate: 0.8,  scale: 1.0,  yLift: 18, z: 5 },
      mobile:  { leftPct: 26, widthPct: 48, rotate: 0.5,  scale: 1.0,  yLift: 14, z: 5 },
    },
  },

  // — inner right ————————————————————————————————————————————
  {
    caption: "Inspiration",
    placeholderBg: [
      "radial-gradient(80% 55% at 55% 30%, rgba(232,212,170,0.85) 0%, rgba(232,212,170,0) 55%)",
      "linear-gradient(170deg, #c9c089 0%, #7a8552 100%)",
    ].join(", "),
    layout: {
      desktop: { leftPct: 56, widthPct: 23, rotate: 3.2,  scale: 0.95, yLift: 4,  z: 3 },
      mobile:  { leftPct: 48, widthPct: 48, rotate: 3.0,  scale: 0.86, yLift: 4,  z: 3 },
    },
  },

  // — outer right ————————————————————————————————————————————
  {
    caption: "Bernard",
    placeholderBg: [
      "radial-gradient(80% 55% at 40% 30%, rgba(252,228,200,0.85) 0%, rgba(252,228,200,0) 55%)",
      "linear-gradient(165deg, #d8a587 0%, #9a5d3e 100%)",
    ].join(", "),
    layout: {
      desktop: { leftPct: 74, widthPct: 22, rotate: 7.0,  scale: 0.88, yLift: 2,  z: 1 },
      mobile:  { leftPct: 56, widthPct: 50, rotate: 8.0,  scale: 0.70, yLift: -6, z: 1 },
    },
  },
];

/**
 * BehindArtistSection — short biography block followed by a hand-stacked
 * fan of five polaroid-style photo placeholders. Lives between the
 * portfolio folder and the closing sky spacer; preserves the same sky
 * background, no new atmosphere.
 *
 * Placeholders are pure CSS gradients for now — when the artist uploads
 * real photos, drop them into the `.polaroid-photo` slot of each card
 * (the component is already structured for that swap).
 */
export default function BehindArtistSection() {
  return (
    <section className="behind-artist-section" id="about">
      <div className="behind-artist-intro">
        <motion.h2
          className="behind-artist-title type-display-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [...EASE_OUT_EXPO] }}
        >
          Derrière l&rsquo;artiste
        </motion.h2>

        <motion.p
          className="behind-artist-paragraph type-subheading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [...EASE_OUT_EXPO] }}
        >
          Bernard peint à la main des scènes inspirées par le Sud, la mer, les
          villages et la lumière de la Côte d&rsquo;Azur. Chaque toile garde une
          part de souvenir, de matière et de couleur.
        </motion.p>
      </div>

      <motion.div
        className="polaroid-fan"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.4, delay: 0.1, ease: [...EASE_OUT_EXPO] }}
      >
        {POLAROIDS.map((p, i) => (
          <Polaroid key={p.caption} item={p} index={i} />
        ))}
      </motion.div>
    </section>
  );
}

// =====================================================================
//  Single polaroid card — white frame, photo placeholder, handwritten
//  caption. Hover lifts gently and softens the tilt.
// =====================================================================
function Polaroid({ item, index }: { item: PolaroidItem; index: number }) {
  // We pre-compute both desktop and mobile rest states. The actual
  // breakpoint switching happens in CSS (the inline style below provides
  // desktop-friendly defaults; mobile media query overrides them).
  const d = item.layout.desktop;
  const m = item.layout.mobile;

  return (
    <motion.figure
      className="polaroid"
      style={
        {
          "--pol-left-d": `${d.leftPct}%`,
          "--pol-width-d": `${d.widthPct}%`,
          "--pol-rotate-d": `${d.rotate}deg`,
          "--pol-scale-d": d.scale,
          "--pol-lift-d": `${d.yLift}px`,
          "--pol-z-d": d.z,
          "--pol-left-m": `${m.leftPct}%`,
          "--pol-width-m": `${m.widthPct}%`,
          "--pol-rotate-m": `${m.rotate}deg`,
          "--pol-scale-m": m.scale,
          "--pol-lift-m": `${m.yLift}px`,
          "--pol-z-m": m.z,
          zIndex: d.z,
        } as React.CSSProperties
      }
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.9, delay: 0.05 * index, ease: [...EASE_OUT_EXPO] }}
    >
      {/* Photo slot — replace this div's background with an <Image /> when
          a real photo lands. The component is intentionally image-ready. */}
      <div
        className="polaroid-photo"
        style={{ background: item.placeholderBg }}
        aria-hidden="true"
      />
      <figcaption className="polaroid-caption">{item.caption}</figcaption>
    </motion.figure>
  );
}
