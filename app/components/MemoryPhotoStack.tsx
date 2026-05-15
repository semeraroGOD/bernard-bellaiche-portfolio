"use client";

import ArtistPhoto, { type ArtistPhotoProps } from "./ArtistPhoto";

interface StackPhoto
  extends Pick<ArtistPhotoProps, "src" | "alt" | "placeholderBg"> {
  /** Optional per-photo aspect override. */
  aspectRatio?: number;
}

export interface MemoryPhotoStackProps {
  /** 2 or 3 photos — the component shows at most 3, more are ignored. */
  photos: StackPhoto[];
  /** Tiny scale (1.0 = base). Defaults to 0.85 — this is a decorative
   *  detail, not a hero element. */
  scale?: number;
  /** Optional extra class for parent-level positioning. */
  className?: string;
}

/**
 * MemoryPhotoStack — a small pile of polaroids overlapping at hand-tossed
 * angles, like the stack you'd find on a corner of the studio table. Use
 * it as a *decorative* inline detail (next to a portrait, near a CTA),
 * not as a primary content block.
 *
 * The composition is intentionally tiny and unfussy: 2–3 photos, alternating
 * rotations, slight Y offsets, no captions.
 */
const STACK_LAYOUT = [
  // Bottom of the pile — rotated most, sits flat-ish
  { rotate: -8, offsetX: -12, offsetY: 8,  z: 1 },
  // Middle — slight counter-rotation, slightly higher
  { rotate:  5, offsetX:   8, offsetY: 0,  z: 2 },
  // Top of pile — closest to flat, sits on top of the others
  { rotate: -2, offsetX:  -2, offsetY: -6, z: 3 },
];

export default function MemoryPhotoStack({
  photos,
  scale = 0.85,
  className,
}: MemoryPhotoStackProps) {
  const items = photos.slice(0, 3);
  return (
    <div
      className={`memory-stack${className ? " " + className : ""}`}
      style={{ "--stack-scale": scale } as React.CSSProperties}
      role="group"
      aria-label="Souvenirs d'atelier"
    >
      {items.map((p, i) => {
        const v = STACK_LAYOUT[i];
        return (
          <div
            key={p.src}
            className="memory-stack-slot"
            style={
              {
                "--ms-rotate": `${v.rotate}deg`,
                "--ms-offset-x": `${v.offsetX}px`,
                "--ms-offset-y": `${v.offsetY}px`,
                zIndex: v.z,
              } as React.CSSProperties
            }
          >
            <ArtistPhoto
              src={p.src}
              alt={p.alt}
              variant="snapshot"
              aspectRatio={p.aspectRatio ?? 0.85}
              placeholderBg={p.placeholderBg}
            />
          </div>
        );
      })}
    </div>
  );
}
