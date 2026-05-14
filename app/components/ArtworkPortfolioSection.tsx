"use client";

import { motion } from "framer-motion";
import ArtworkCard, { type Artwork } from "./ArtworkCard";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

// =====================================================================
//  Three artworks — painterly gradient placeholders (no real assets yet)
// =====================================================================
const ARTWORKS: Artwork[] = [
  {
    id: "eclat-bleu",
    title: "Éclat Bleu",
    description:
      "Une toile lumineuse, entre silence, profondeur et mouvement.",
    background: [
      // Cool luminous painting — cobalt → sky → cream highlight
      "radial-gradient(120% 80% at 70% 28%, rgba(255,250,235,0.92) 0%, rgba(255,250,235,0) 38%)",
      "radial-gradient(140% 100% at 25% 80%, rgba(33,79,168,0.85) 0%, rgba(33,79,168,0) 55%)",
      "radial-gradient(120% 90% at 80% 75%, rgba(98,158,222,0.55) 0%, rgba(98,158,222,0) 60%)",
      "linear-gradient(165deg, #1d3673 0%, #2d6abf 45%, #8cc3ee 100%)",
    ].join(", "),
    tilt: -2.6,
    offsetY: 0,
  },
  {
    id: "matiere-celeste",
    title: "Matière Céleste",
    description:
      "Des textures suspendues, comme une mémoire peinte dans l’air.",
    background: [
      // Peach + lavender + cream texture
      "radial-gradient(120% 90% at 30% 25%, rgba(255,233,210,0.95) 0%, rgba(255,233,210,0) 50%)",
      "radial-gradient(100% 90% at 80% 80%, rgba(170,140,200,0.7) 0%, rgba(170,140,200,0) 55%)",
      "radial-gradient(80% 70% at 55% 55%, rgba(232,182,168,0.65) 0%, rgba(232,182,168,0) 55%)",
      "linear-gradient(135deg, #f0d8c4 0%, #d9b5c6 45%, #b89cba 100%)",
    ].join(", "),
    tilt: 1.8,
    offsetY: 36,
  },
  {
    id: "horizon-interieur",
    title: "Horizon Intérieur",
    description:
      "Une composition douce, pensée comme un paysage émotionnel.",
    background: [
      // Sage + ochre + warm beige landscape
      "radial-gradient(130% 85% at 65% 22%, rgba(248,232,200,0.95) 0%, rgba(248,232,200,0) 45%)",
      "radial-gradient(110% 100% at 25% 85%, rgba(120,138,98,0.78) 0%, rgba(120,138,98,0) 55%)",
      "radial-gradient(100% 75% at 70% 80%, rgba(184,145,98,0.55) 0%, rgba(184,145,98,0) 60%)",
      "linear-gradient(160deg, #d6c79d 0%, #a8b58d 50%, #7d8c5c 100%)",
    ].join(", "),
    tilt: -1.2,
    offsetY: -18,
  },
];

export default function ArtworkPortfolioSection() {
  return (
    <section className="portfolio-section">
      <div className="portfolio-intro">
        <motion.span
          className="portfolio-eyebrow type-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 1.0, ease: [...EASE_OUT_EXPO] }}
        >
          Sélection
        </motion.span>

        <motion.h2
          className="portfolio-title type-display-2"
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{
            duration: 1.4,
            delay: 0.1,
            ease: [...EASE_OUT_EXPO],
          }}
        >
          Œuvres sélectionnées
        </motion.h2>

        <motion.p
          className="portfolio-subtitle type-subheading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{
            duration: 1.2,
            delay: 0.25,
            ease: [...EASE_OUT_EXPO],
          }}
        >
          Une première sélection de toiles contemporaines, pensées comme des
          fragments d’émotion suspendus dans l’espace.
        </motion.p>
      </div>

      <div className="artwork-grid">
        {ARTWORKS.map((art, i) => (
          <ArtworkCard key={art.id} artwork={art} index={i} />
        ))}
      </div>
    </section>
  );
}
