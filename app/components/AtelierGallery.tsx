"use client";

import { motion } from "framer-motion";
import ArtistPhoto, { type ArtistPhotoProps } from "./ArtistPhoto";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export interface AtelierPhoto
  extends Pick<ArtistPhotoProps, "src" | "alt" | "caption" | "placeholderBg"> {
  /** Optional per-photo aspect override (defaults to 4/5 portrait). */
  aspectRatio?: number;
}

export interface AtelierGalleryProps {
  photos: AtelierPhoto[];
  /**
   * Layout:
   *   • "fan" — asymmetric overlapping stack (5 photos max, like polaroids
   *             on a workbench). The center photo is most visible; outer
   *             ones tuck slightly behind.
   *   • "row" — clean horizontal strip; each photo gets a soft rotation.
   *   • "scatter" — loose grid; photos slightly rotated, generous gaps.
   */
  layout?: "fan" | "row" | "scatter";
  /** Optional descriptive label for screen readers. */
  ariaLabel?: string;
}

// Per-position composition for the "fan" layout. Same vocabulary the
// homepage already uses (mirrors the existing `.polaroid-fan` look), so
// the gallery feels of-a-piece with the rest of the atelier.
const FAN_LAYOUT = [
  // outer-left
  { d: { leftPct: 1,  widthPct: 22, rotate: -7.0, scale: 0.88, yLift: 0,  z: 1 },
    m: { leftPct: -6, widthPct: 50, rotate: -8.0, scale: 0.70, yLift: -6, z: 1 } },
  // inner-left
  { d: { leftPct: 17, widthPct: 23, rotate: -3.2, scale: 0.95, yLift: 6,  z: 3 },
    m: { leftPct: 4,  widthPct: 48, rotate: -3.0, scale: 0.86, yLift: 4,  z: 3 } },
  // center (most visible)
  { d: { leftPct: 36, widthPct: 24, rotate:  0.8, scale: 1.0,  yLift: 18, z: 5 },
    m: { leftPct: 26, widthPct: 48, rotate:  0.5, scale: 1.0,  yLift: 14, z: 5 } },
  // inner-right
  { d: { leftPct: 55, widthPct: 23, rotate:  3.2, scale: 0.95, yLift: 4,  z: 3 },
    m: { leftPct: 48, widthPct: 48, rotate:  3.0, scale: 0.86, yLift: 4,  z: 3 } },
  // outer-right
  { d: { leftPct: 73, widthPct: 22, rotate:  7.0, scale: 0.88, yLift: 2,  z: 1 },
    m: { leftPct: 56, widthPct: 50, rotate:  8.0, scale: 0.70, yLift: -6, z: 1 } },
];

// Slight rotations for "row" / "scatter" — keeps the strip from looking
// like a stock-photo carousel.
const SOFT_TILTS = [-2.4, 1.6, -1.2, 2.0, -1.8];

/**
 * AtelierGallery — multiple atelier photos arranged organically. Used
 * for memory walls, snapshot rows, and scattered workshop sets. Each
 * child is an `ArtistPhoto`, so the same warm frame vocabulary applies.
 *
 * No corporate "team grid" feel — the goal is "photos pinned on the
 * studio wall", not a startup About Us.
 */
export default function AtelierGallery({
  photos,
  layout = "fan",
  ariaLabel,
}: AtelierGalleryProps) {
  if (layout === "fan") {
    return (
      <div
        className="atelier-gallery atelier-gallery--fan"
        role="group"
        aria-label={ariaLabel ?? "Photos de l'atelier"}
      >
        {photos.slice(0, 5).map((p, i) => {
          const v = FAN_LAYOUT[i];
          return (
            <motion.figure
              key={p.src}
              className="atelier-fan-slot"
              style={
                {
                  "--pol-left-d": `${v.d.leftPct}%`,
                  "--pol-width-d": `${v.d.widthPct}%`,
                  "--pol-rotate-d": `${v.d.rotate}deg`,
                  "--pol-scale-d": v.d.scale,
                  "--pol-lift-d": `${v.d.yLift}px`,
                  "--pol-z-d": v.d.z,
                  "--pol-left-m": `${v.m.leftPct}%`,
                  "--pol-width-m": `${v.m.widthPct}%`,
                  "--pol-rotate-m": `${v.m.rotate}deg`,
                  "--pol-scale-m": v.m.scale,
                  "--pol-lift-m": `${v.m.yLift}px`,
                  "--pol-z-m": v.m.z,
                  zIndex: v.d.z,
                } as React.CSSProperties
              }
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{
                duration: 0.9,
                delay: 0.05 * i,
                ease: [...EASE_OUT_EXPO],
              }}
            >
              <ArtistPhoto
                src={p.src}
                alt={p.alt}
                caption={p.caption}
                variant="polaroid"
                aspectRatio={p.aspectRatio ?? 0.8}
                placeholderBg={p.placeholderBg}
              />
            </motion.figure>
          );
        })}
      </div>
    );
  }

  // "row" — calm horizontal strip, each photo slightly tilted
  if (layout === "row") {
    return (
      <div
        className="atelier-gallery atelier-gallery--row"
        role="group"
        aria-label={ariaLabel ?? "Photos de l'atelier"}
      >
        {photos.map((p, i) => (
          <ArtistPhoto
            key={p.src}
            src={p.src}
            alt={p.alt}
            caption={p.caption}
            variant="polaroid"
            rotate={SOFT_TILTS[i % SOFT_TILTS.length]}
            aspectRatio={p.aspectRatio ?? 0.8}
            placeholderBg={p.placeholderBg}
          />
        ))}
      </div>
    );
  }

  // "scatter" — loose flowing grid
  return (
    <div
      className="atelier-gallery atelier-gallery--scatter"
      role="group"
      aria-label={ariaLabel ?? "Photos de l'atelier"}
    >
      {photos.map((p, i) => (
        <ArtistPhoto
          key={p.src}
          src={p.src}
          alt={p.alt}
          caption={p.caption}
          variant="polaroid"
          rotate={SOFT_TILTS[i % SOFT_TILTS.length]}
          aspectRatio={p.aspectRatio ?? 0.8}
          placeholderBg={p.placeholderBg}
        />
      ))}
    </div>
  );
}
