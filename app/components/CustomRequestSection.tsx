"use client";

import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * CustomRequestSection — invitation card asking visitors to send a
 * custom painting request. Visual-only at this stage:
 *
 *   • title + reassuring paragraph
 *   • upload placeholder (dashed cream drop zone with photo icon)
 *   • CTA pill "Envoyer ma demande"
 *
 * No backend, no real file input, no submission handler. The upload
 * zone is a clickable visual marker — when wiring the form later,
 * replace the inner `<div className="custom-upload">` with a real
 * `<label htmlFor="…"> + <input type="file" />` (or a drag/drop hook).
 *
 * Reuses the cream-pill / warm-halo / dashed-border vocabulary used
 * across the navbar, hero CTA, and "Qui suis-je ?" — so the page keeps
 * reading as one Mediterranean atelier.
 */
export default function CustomRequestSection() {
  return (
    <section className="custom-section" id="contact">
      <motion.div
        className="custom-card"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.3, ease: [...EASE_OUT_EXPO] }}
      >
        <motion.h2
          className="custom-title type-display-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [...EASE_OUT_EXPO] }}
        >
          Me demander une toile personnalisée
        </motion.h2>

        <motion.p
          className="custom-paragraph type-subheading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.1, delay: 0.15, ease: [...EASE_OUT_EXPO] }}
        >
          Vous avez une photo, un lieu ou un souvenir que vous aimeriez voir
          peint&nbsp;? Envoyez-moi votre idée, je vous répondrai directement
          pour voir ce qu&rsquo;il est possible de créer.
        </motion.p>

        {/* Visual upload placeholder — no real file input wired yet. */}
        <motion.div
          className="custom-upload"
          role="button"
          tabIndex={0}
          aria-label="Choisir une photo (à venir)"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.1, delay: 0.3, ease: [...EASE_OUT_EXPO] }}
        >
          <div className="custom-upload-icon" aria-hidden="true">
            <svg
              width="34"
              height="34"
              viewBox="0 0 32 32"
              fill="none"
            >
              <rect
                x="3"
                y="7"
                width="26"
                height="20"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M10.5 7l1.7-2.6h7.6L21.5 7"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="16"
                cy="17.5"
                r="5.2"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M16 14v7M12.6 17.5h6.8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="custom-upload-copy">
            <span className="custom-upload-headline">
              Glissez votre photo ici
            </span>
            <span className="custom-upload-hint">
              ou cliquez pour parcourir vos fichiers
            </span>
          </div>
        </motion.div>

        <motion.a
          href="#contact"
          className="custom-cta"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.0, delay: 0.45, ease: [...EASE_OUT_EXPO] }}
        >
          <span>Envoyer ma demande</span>
          <svg
            className="custom-cta-arrow"
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
      </motion.div>
    </section>
  );
}
