"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export interface ArtworkGalleryItem {
  /** Path to the image in /public (e.g. "/artworks/voiliers-en-mer.jpg") */
  src: string;
  /** Painting title shown under the image */
  title: string;
  /** Optional short subtitle (medium, year, dimensions, etc.) */
  subtitle?: string;
  /** Optional CSS background — used as a visible placeholder when the
   *  image hasn't been added yet or fails to load. */
  placeholderBg?: string;
}

interface ArtworkGalleryCardProps {
  item: ArtworkGalleryItem;
  index: number;
}

/**
 * ArtworkGalleryCard — reusable card for the /mes-oeuvres gallery.
 * Image on top (4/5 portrait crop), title + optional subtitle beneath.
 *
 * Visual identity: same cream-paper-on-warm-edge family as the polaroids
 * and the portfolio paintings. Subtle hover lift, soft shadow, rounded
 * corners. No cart, no price, no ecommerce chrome.
 */
export default function ArtworkGalleryCard({
  item,
  index,
}: ArtworkGalleryCardProps) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <motion.figure
      className="gallery-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.9,
        delay: Math.min(index * 0.05, 0.3),
        ease: [...EASE_OUT_EXPO],
      }}
    >
      <div
        className="gallery-card-image"
        style={{ background: item.placeholderBg ?? "#e8dcc8" }}
      >
        {!imgFailed && item.src && (
          <Image
            src={item.src}
            alt={item.title}
            fill
            sizes="(max-width: 720px) 92vw, (max-width: 1080px) 44vw, 28vw"
            style={{ objectFit: "cover" }}
            onError={() => setImgFailed(true)}
            unoptimized
          />
        )}
      </div>
      <figcaption className="gallery-card-caption">
        <h3 className="gallery-card-title">{item.title}</h3>
        {item.subtitle && (
          <p className="gallery-card-subtitle">{item.subtitle}</p>
        )}
      </figcaption>
    </motion.figure>
  );
}
