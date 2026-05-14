"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface LayoutConfig {
  /** Horizontal position inside the folder, in % of folder width. */
  leftPct: number;
  /** Painting width, in % of folder width. */
  widthPct: number;
  /** Base rotation in degrees. */
  rotate: number;
  /** Base scale — used to vary painting size across the fan. */
  scale: number;
  /** Extra upward lift in px (center painting gets a higher lift). */
  yLift: number;
  /** Stacking order inside the fan. */
  z: number;
}

export interface ArtworkCanvasItem {
  title: string;
  image: string;
  /** Optional CSS background, used as visible fallback when the image is missing. */
  fallbackBg?: string;
  /** Per-breakpoint composition data (desktop / mobile). */
  layout: {
    desktop: LayoutConfig;
    mobile: LayoutConfig;
  };
}

interface ArtworkCanvasProps extends ArtworkCanvasItem {
  index: number;
}

function useIsMobile(query = "(max-width: 720px)") {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const apply = () => setMatch(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [query]);
  return match;
}

export default function ArtworkCanvas({
  title,
  image,
  fallbackBg,
  layout,
  index,
}: ArtworkCanvasProps) {
  const isMobile = useIsMobile();
  const [imgFailed, setImgFailed] = useState(false);

  const cfg = isMobile ? layout.mobile : layout.desktop;

  // Baseline vertical rest position — paintings sit at the bottom of the
  // folder content area; restY pulls them up so the pocket covers ~40%
  // of each canvas. Per-painting `yLift` raises the center higher than
  // the outer ones so the fan feels naturally crowned.
  const baseRest = isMobile ? -22 : -42;
  const restY = baseRest - cfg.yLift;

  // Hover stays subtle — small upward glide, keeps base rotation,
  // very mild scale-up. No exaggerated reset to 0deg.
  const hoverY = restY + (isMobile ? -36 : -72);
  const hoverScale = cfg.scale * 1.025;

  return (
    <motion.div
      className="artwork-canvas-wrapper"
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={{
        rest:  { y: restY,  rotate: cfg.rotate, scale: cfg.scale },
        hover: { y: hoverY, rotate: cfg.rotate, scale: hoverScale },
      }}
      transition={{ duration: 0.7, ease: [...EASE_OUT_EXPO] }}
      style={{
        left: `${cfg.leftPct}%`,
        width: `${cfg.widthPct}%`,
        zIndex: cfg.z,
      }}
    >
      <div
        className="artwork-canvas"
        style={{ background: fallbackBg ?? "#e8dcc8" }}
      >
        {!imgFailed && (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 720px) 50vw, 28vw"
            style={{ objectFit: "cover" }}
            onError={() => setImgFailed(true)}
            unoptimized
            priority={index === 2}
          />
        )}
      </div>
    </motion.div>
  );
}
