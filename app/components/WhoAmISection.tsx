"use client";

import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * WhoAmISection — short "Qui suis-je ?" biography card with a portrait
 * placeholder. Self-contained section, image-ready: when the artist
 * uploads a portrait, drop it into the `.who-portrait` slot.
 *
 *  Desktop : [ portrait ]   [ title · paragraph · CTA ]
 *  Mobile  : portrait stacked above text block
 *
 * Uses the same cream-pill / warm-halo / dashed-border vocabulary as the
 * navbar, hero CTA, and "Derrière l'artiste" — so the page keeps reading
 * as one Mediterranean atelier, not a stack of standalone blocks.
 */
export default function WhoAmISection() {
  return (
    <section className="who-section" id="qui-suis-je">
      <motion.div
        className="who-portrait-wrap"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.2, ease: [...EASE_OUT_EXPO] }}
      >
        {/* Portrait slot — replace this div's background with an <Image /> when
            the real photo lands. The frame, shadow, and rounded corners stay. */}
        <div
          className="who-portrait"
          role="img"
          aria-label="Portrait de Bernard (à venir)"
        />
      </motion.div>

      <div className="who-text">
        <motion.h2
          className="who-title type-display-2"
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.3, ease: [...EASE_OUT_EXPO] }}
        >
          Qui suis-je&nbsp;?
        </motion.h2>

        <motion.p
          className="who-paragraph type-subheading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [...EASE_OUT_EXPO] }}
        >
          Je m&rsquo;appelle Bernard. Je peins à la main des scènes inspirées
          par le Sud, la mer, les villages et les souvenirs de la Côte
          d&rsquo;Azur. Chaque toile est réalisée avec ses couleurs, ses
          matières et ses petites imperfections, pour garder le charme du
          fait main.
        </motion.p>

        <motion.a
          href="#oeuvres"
          className="who-cta"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.0, delay: 0.35, ease: [...EASE_OUT_EXPO] }}
        >
          <span>Découvrir mon univers</span>
          <svg
            className="who-cta-arrow"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2.5 7h9m0 0L7.5 3M11.5 7L7.5 11"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.a>
      </div>
    </section>
  );
}
