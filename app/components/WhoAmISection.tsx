"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import ArtistPhoto from "./ArtistPhoto";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// Framer-motion-wrapped Next.js Link for client-side route navigation
// with hover/whileInView animation support.
const MotionLink = motion.create(Link);

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
        {/* Portrait — uses the reusable `ArtistPhoto` so the same warm
            frame vocabulary is shared across the site. When a real
            photo is dropped at `/photos/bernard/portrait.jpg`, it
            replaces the placeholder gradient automatically. */}
        <ArtistPhoto
          src="/photos/bernard/portrait.jpg"
          alt="Bernard, peintre"
          variant="clean"
          rotate={-1.4}
          aspectRatio={431 / 619}
          placeholderBg={
            "radial-gradient(80% 60% at 35% 30%, rgba(255, 244, 220, 0.92) 0%, rgba(255, 244, 220, 0) 55%), " +
            "radial-gradient(60% 50% at 70% 75%, rgba(180, 140, 90, 0.45) 0%, rgba(180, 140, 90, 0) 60%), " +
            "linear-gradient(170deg, #f0d8aa 0%, #c89368 100%)"
          }
          className="who-portrait"
        />
      </motion.div>

      <div className="who-text">
        <motion.h2
          className="who-title type-display-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [...EASE_OUT_EXPO] }}
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

        <MotionLink
          href="/mes-oeuvres"
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
        </MotionLink>
      </div>
    </section>
  );
}
