"use client";

import { motion } from "framer-motion";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface Track {
  label: string;
  steps: string[];
}

const TRACKS: Track[] = [
  {
    label: "Acheter une toile",
    steps: [
      "Vous choisissez une toile",
      "Vous me contactez",
      "Je vous accompagne jusqu’à l’envoi",
    ],
  },
  {
    label: "Commande personnalisée",
    steps: [
      "Vous envoyez une photo",
      "Je vous réponds avec une proposition",
      "La toile est réalisée à la main",
    ],
  },
];

/**
 * HowItWorksSection — two short, reassuring tracks of 3 steps each:
 *  one for buying an existing painting, one for a custom commission.
 *
 *  Desktop : two cream cards side by side
 *  Mobile  : cards stacked
 *
 * Reuses the cream-paper / dashed-border / warm-halo vocabulary so the
 * block belongs to the same Mediterranean atelier as the rest of the
 * page — no new patterns introduced.
 */
export default function HowItWorksSection() {
  return (
    <section className="how-section" id="comment-ca-marche">
      <motion.h2
        className="how-title type-display-2"
        initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.3, ease: [...EASE_OUT_EXPO] }}
      >
        Comment ça marche
      </motion.h2>

      <div className="how-tracks">
        {TRACKS.map((track, ti) => (
          <motion.article
            key={track.label}
            className="how-track"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 1.1,
              delay: 0.1 + ti * 0.1,
              ease: [...EASE_OUT_EXPO],
            }}
          >
            <header className="how-track-header">
              <span className="how-track-label">{track.label}</span>
            </header>

            <ol className="how-steps">
              {track.steps.map((step, si) => (
                <motion.li
                  key={step}
                  className="how-step"
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.25 + ti * 0.1 + si * 0.08,
                    ease: [...EASE_OUT_EXPO],
                  }}
                >
                  <span className="how-step-number" aria-hidden="true">
                    {si + 1}
                  </span>
                  <span className="how-step-text">{step}</span>
                </motion.li>
              ))}
            </ol>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
