"use client";

import Image from "next/image";
import { useState } from "react";

export interface ArtistPhotoProps {
  /** Path to the image in /public (e.g. "/photos/bernard/portrait.jpg") */
  src: string;
  /** Accessible description of what the photo shows */
  alt: string;
  /** Optional handwritten-feel caption under the photo */
  caption?: string;
  /**
   * Visual variant:
   *   • "polaroid" — cream paper border + caption strip beneath the image
   *   • "clean"    — thin rounded frame, no paper border
   *   • "snapshot" — soft white border (smaller than polaroid), no caption strip
   */
  variant?: "polaroid" | "clean" | "snapshot";
  /** Slight rotation in degrees — adds "pinned-by-hand" feel */
  rotate?: number;
  /** Image aspect ratio (width/height). Defaults to 4/5 (portrait). */
  aspectRatio?: number;
  /** Optional CSS background — used as a placeholder when the image
   *  hasn't been added yet or fails to load. Match the warm Mediterranean
   *  palette so the placeholder stays in atmosphere. */
  placeholderBg?: string;
  /** Optional extra class for parent-level positioning. */
  className?: string;
}

/**
 * ArtistPhoto — a single image of Bernard, the atelier, the work in
 * progress, or a Côte d'Azur inspiration shot. Image-ready: drop the
 * file at the `src` path and it shows up; until then a warm gradient
 * placeholder sits in the slot so the page never reads as broken.
 *
 * Designed to feel like a real photograph, not a stock-photo card:
 *   • subtle rotation
 *   • soft warm frame (polaroid) or thin clean frame
 *   • paper-grain shadow vocabulary that matches the rest of the
 *     atelier (same dashed-border / warm-edge family)
 *
 * Use the variants for different storytelling roles:
 *   • polaroid → memory / atelier snapshots (caption beneath)
 *   • clean    → main portraits, polished presentation
 *   • snapshot → small inline details (no caption strip)
 */
export default function ArtistPhoto({
  src,
  alt,
  caption,
  variant = "polaroid",
  rotate = 0,
  aspectRatio = 0.8,
  placeholderBg,
  className,
}: ArtistPhotoProps) {
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className={`artist-photo artist-photo--${variant}${
        className ? " " + className : ""
      }`}
      style={
        {
          "--ap-rotate": `${rotate}deg`,
          "--ap-aspect": aspectRatio,
        } as React.CSSProperties
      }
    >
      <div
        className="artist-photo-image"
        style={{ background: placeholderBg ?? "#e8dcc8" }}
      >
        {!failed && src && (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 720px) 78vw, 32vw"
            style={{ objectFit: "cover" }}
            onError={() => setFailed(true)}
            unoptimized
          />
        )}
      </div>
      {caption && variant !== "clean" && (
        <figcaption className="artist-photo-caption">{caption}</figcaption>
      )}
    </figure>
  );
}
