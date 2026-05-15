"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export interface EaselArtworkItem {
  /** Path to the image in /public (e.g. "/artworks/voiliers-en-mer.jpg") */
  src: string;
  /** Painting title shown under the easel */
  title: string;
  /** Optional short subtitle (medium, year, dimensions, etc.) */
  subtitle?: string;
  /**
   * Natural aspect ratio of the painting (width / height).
   *   • portrait  → < 1   (e.g. 0.78)
   *   • square    → 1
   *   • landscape → > 1   (e.g. 1.33)
   *
   * The easel adapts: canvas keeps a constant on-screen *height*, the
   * stand's width is derived from `height × aspectRatio`. Landscape
   * paintings get visibly wider easels, portrait paintings narrower
   * ones — no cropping, no forced 4/5 box.
   */
  aspectRatio: number;
  /** Optional CSS background — used as a placeholder when the image
   *  hasn't been added yet or fails to load. */
  placeholderBg?: string;
}

interface EaselArtworkCardProps {
  item: EaselArtworkItem;
  index: number;
}

/**
 * Five subtle "easel" variations — used to add hand-crafted asymmetry to
 * the gallery. Each variant nudges:
 *   • the canvas's resting tilt (a few tenths of a degree)
 *   • how far the legs splay outward
 *   • a small vertical offset, so the row never reads as a rigid grid
 *
 * All variants stay deliberately mild — the easel should remain
 * secondary to the painting.
 */
const EASEL_VARIANTS = [
  { canvasTilt: -0.6, legSpread: 4.0, legHeight: 86 },
  { canvasTilt:  0.5, legSpread: 4.6, legHeight: 92 },
  { canvasTilt: -0.2, legSpread: 3.8, legHeight: 84 },
  { canvasTilt:  0.8, legSpread: 5.0, legHeight: 90 },
  { canvasTilt: -0.4, legSpread: 4.2, legHeight: 88 },
];

/**
 * EaselArtworkCard — reusable card for /mes-oeuvres.
 *
 * A painting rests on a minimal CSS-only easel:
 *   • two slim wood-tone legs angled behind the canvas
 *   • a thin horizontal tray under the canvas
 *   • a small back-kick leg for visual realism
 *
 * The easel is purely decorative; the painting stays the main focus.
 * Hover gives a very gentle lift + a slightly deeper shadow — nothing
 * dramatic.
 */
export default function EaselArtworkCard({
  item,
  index,
}: EaselArtworkCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const v = EASEL_VARIANTS[index % EASEL_VARIANTS.length];

  return (
    <motion.figure
      className="easel"
      style={
        {
          "--easel-canvas-tilt": `${v.canvasTilt}deg`,
          "--easel-leg-spread": `${v.legSpread}deg`,
          "--easel-leg-height": `${v.legHeight}px`,
          "--easel-aspect": item.aspectRatio,
        } as React.CSSProperties
      }
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.95,
        delay: Math.min(index * 0.05, 0.3),
        ease: [...EASE_OUT_EXPO],
      }}
    >
      <div className="easel-stand">
        {/* Two angled wood legs sitting behind the canvas */}
        <span className="easel-leg easel-leg-left" aria-hidden="true" />
        <span className="easel-leg easel-leg-right" aria-hidden="true" />

        {/* Small back-kick leg — gives the easel its standing balance */}
        <span className="easel-leg easel-leg-back" aria-hidden="true" />

        {/* The painting itself */}
        <div
          className="easel-canvas"
          style={{ background: item.placeholderBg ?? "#e8dcc8" }}
        >
          {!imgFailed && item.src && (
            <Image
              src={item.src}
              alt={item.title}
              fill
              sizes="(max-width: 720px) 86vw, (max-width: 1080px) 38vw, 26vw"
              style={{ objectFit: "cover" }}
              onError={() => setImgFailed(true)}
              unoptimized
            />
          )}
        </div>

        {/* Thin horizontal tray (the lip that holds the canvas) */}
        <span className="easel-tray" aria-hidden="true" />

        {/* Soft floor shadow — grounds the easel without a hard line */}
        <span className="easel-floor-shadow" aria-hidden="true" />
      </div>

      <figcaption className="easel-caption">
        <h3 className="easel-title">{item.title}</h3>
        {item.subtitle && <p className="easel-subtitle">{item.subtitle}</p>}
      </figcaption>
    </motion.figure>
  );
}
