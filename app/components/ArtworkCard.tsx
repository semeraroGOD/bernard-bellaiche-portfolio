"use client";

import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export interface Artwork {
  id: string;
  title: string;
  description: string;
  /** CSS background — layered gradients act as a painterly placeholder */
  background: string;
  /** Base tilt (deg) — gives each canvas its own personality */
  tilt: number;
  /** Vertical offset (px) for desktop staggered layout — ignored on small viewports */
  offsetY?: number;
}

interface ArtworkCardProps {
  artwork: Artwork;
  index: number;
}

export default function ArtworkCard({ artwork, index }: ArtworkCardProps) {
  const { title, description, background, tilt, offsetY = 0 } = artwork;

  return (
    <motion.article
      className="artwork-card-host"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -10% 0px" }}
      transition={{
        duration: 1.2,
        delay: index * 0.12,
        ease: [...EASE_OUT_EXPO],
      }}
      style={{ "--card-stagger-y": `${offsetY}px` } as React.CSSProperties}
    >
      <motion.div
        className="artwork-card"
        whileHover="hover"
        initial="rest"
        animate="rest"
      >
        {/* Canvas — leans out of the card */}
        <motion.div
          className="artwork-canvas-wrap"
          variants={{
            rest: { y: 0, rotate: tilt, scale: 1 },
            hover: { y: -12, rotate: tilt * 1.4, scale: 1.025 },
          }}
          transition={{ duration: 0.8, ease: [...EASE_OUT_EXPO] }}
        >
          <div
            className="artwork-canvas"
            style={{ background }}
            aria-label={`Toile : ${title}`}
            role="img"
          />
        </motion.div>

        {/* Card body */}
        <motion.div
          className="artwork-body"
          variants={{
            rest: { y: 0 },
            hover: { y: -4 },
          }}
          transition={{ duration: 0.6, ease: [...EASE_OUT_EXPO] }}
        >
          <h3 className="artwork-title type-heading">{title}</h3>
          <p className="artwork-description type-body">{description}</p>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
