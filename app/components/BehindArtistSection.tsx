"use client";

import { motion } from "framer-motion";
import AtelierGallery, { type AtelierPhoto } from "./AtelierGallery";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * Atelier snapshots — five photos arranged as a hand-pinned fan.
 *
 * Paths are reserved for future real photos. Drop the files at the
 * listed paths in `/public/photos/atelier/` and they'll appear in
 * place of the warm gradient placeholders.
 *
 * Each `aspectRatio` is calibrated to suit typical phone-camera
 * landscape (4:3 ≈ 1.33) or portrait (3:4 ≈ 0.75) framing — change
 * the value once the real photo is in.
 */
const ATELIER_PHOTOS: AtelierPhoto[] = [
  {
    src: "/photos/atelier/peinture-en-cours.jpg",
    alt: "Bernard peignant à son chevalet",
    caption: "Atelier",
    aspectRatio: 0.78,
    placeholderBg: [
      "radial-gradient(80% 60% at 30% 28%, rgba(255,236,196,0.85) 0%, rgba(255,236,196,0) 55%)",
      "linear-gradient(165deg, #e8d3a5 0%, #c79f6a 100%)",
    ].join(", "),
  },
  {
    src: "/photos/cote-azur/lumiere-mer.jpg",
    alt: "Lumière sur la mer, Côte d'Azur",
    caption: "Côte d'Azur",
    aspectRatio: 0.80,
    placeholderBg: [
      "radial-gradient(90% 60% at 50% 30%, rgba(220,238,248,0.85) 0%, rgba(220,238,248,0) 55%)",
      "linear-gradient(175deg, #8fbedc 0%, #3c79a8 100%)",
    ].join(", "),
  },
  {
    src: "/photos/atelier/mains-pinceaux.jpg",
    alt: "Gros plan sur les mains et les pinceaux de Bernard",
    caption: "En peinture",
    aspectRatio: 0.82,
    placeholderBg: [
      "radial-gradient(70% 55% at 50% 30%, rgba(255,244,220,0.92) 0%, rgba(255,244,220,0) 55%)",
      "radial-gradient(60% 40% at 50% 80%, rgba(180,140,90,0.45) 0%, rgba(180,140,90,0) 60%)",
      "linear-gradient(170deg, #f0d8aa 0%, #c89368 100%)",
    ].join(", "),
  },
  {
    src: "/photos/atelier/texture-toile.jpg",
    alt: "Détail de la texture d'une toile fraîchement peinte",
    caption: "Inspiration",
    aspectRatio: 0.80,
    placeholderBg: [
      "radial-gradient(80% 55% at 55% 30%, rgba(232,212,170,0.85) 0%, rgba(232,212,170,0) 55%)",
      "linear-gradient(170deg, #c9c089 0%, #7a8552 100%)",
    ].join(", "),
  },
  {
    src: "/photos/bernard/portrait-atelier.jpg",
    alt: "Bernard dans son atelier",
    caption: "Bernard",
    aspectRatio: 0.78,
    placeholderBg: [
      "radial-gradient(80% 55% at 40% 30%, rgba(252,228,200,0.85) 0%, rgba(252,228,200,0) 55%)",
      "linear-gradient(165deg, #d8a587 0%, #9a5d3e 100%)",
    ].join(", "),
  },
];

/**
 * BehindArtistSection — short biography + atelier-photo fan.
 *
 * Visual layout is unchanged. Internally, the polaroid fan is now an
 * `<AtelierGallery layout="fan">` so the same component can be reused
 * elsewhere (Côte d'Azur details, brush close-ups, etc.) without
 * duplicating the composition logic.
 */
export default function BehindArtistSection() {
  return (
    <section className="behind-artist-section" id="about">
      <div className="behind-artist-intro">
        <motion.h2
          className="behind-artist-title type-display-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.9, ease: [...EASE_OUT_EXPO] }}
        >
          Derrière l&rsquo;artiste
        </motion.h2>

        <motion.p
          className="behind-artist-paragraph type-subheading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.2, delay: 0.2, ease: [...EASE_OUT_EXPO] }}
        >
          Bernard peint à la main des scènes inspirées par le Sud, la mer, les
          villages et la lumière de la Côte d&rsquo;Azur. Chaque toile garde une
          part de souvenir, de matière et de couleur.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 1.4, delay: 0.1, ease: [...EASE_OUT_EXPO] }}
        style={{ width: "100%" }}
      >
        <AtelierGallery
          photos={ATELIER_PHOTOS}
          layout="fan"
          ariaLabel="Photos de l'atelier de Bernard"
        />
      </motion.div>
    </section>
  );
}
