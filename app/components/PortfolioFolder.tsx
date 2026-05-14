"use client";

import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface PortfolioFolderProps {
  /** Small label that sits on the tab protruding above the folder. */
  tabLabel?: string;
  /**
   * Future artworks will be placed here. They are expected to overflow
   * outside the folder boundaries — the parent uses `overflow: visible`.
   */
  children?: React.ReactNode;
}

/**
 * PortfolioFolder — empty cream folder container.
 *
 * Visual goal: an artist's physical portfolio laid open on a desk —
 * cream paper, soft grid lines inside, dashed stitched border, a small
 * tab on the upper edge. Designed to receive artwork canvases later
 * (children slot), which will be allowed to physically overflow.
 */
export default function PortfolioFolder({
  tabLabel = "Portfolio",
  children,
}: PortfolioFolderProps) {
  return (
    <section className="portfolio-folder-section">
      <motion.div
        className="portfolio-folder"
        initial={{ opacity: 0, y: 48 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 1.4, ease: [...EASE_OUT_EXPO] }}
      >
        {tabLabel && (
          <div className="portfolio-folder-tab">
            <span>{tabLabel}</span>
          </div>
        )}

        {/* Inner stitched border (decorative, non-interactive) */}
        <span className="portfolio-folder-stitch" aria-hidden="true" />

        {/* Artworks layer (z-index 2 inside the folder) */}
        <div className="portfolio-folder-content">{children}</div>

        {/* Single shared front pocket — covers the lower portion of every
            painting at once so the whole row reads as "tucked into ONE
            portfolio". Lives above the artworks layer. */}
        <div className="portfolio-folder-pocket" aria-hidden="true">
          <span className="portfolio-folder-pocket-seam" aria-hidden="true" />
        </div>
      </motion.div>
    </section>
  );
}
