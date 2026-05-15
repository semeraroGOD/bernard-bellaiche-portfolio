"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
} from "framer-motion";
import dynamic from "next/dynamic";

import FloatingNav from "./FloatingNav";
import EaselArtworkCard, {
  type EaselArtworkItem,
} from "./EaselArtworkCard";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

const MOUSE_SPRING = { stiffness: 22, damping: 20, mass: 1.1 } as const;
const SCROLL_SPRING = { stiffness: 38, damping: 28, mass: 1 } as const;
const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Gallery contents.
 *
 * `src` is the path the gallery card will try to render. When a real
 * file exists in /public/artworks/, the card shows it; otherwise it
 * falls back to the warm `placeholderBg` gradient so the layout stays
 * clean while you upload remaining photos.
 *
 * Add / rename entries here as new paintings arrive — no other code
 * needs to change.
 */
// Aspect ratios are the *true* width/height of each painting file, read
// from disk. The easel widens (landscape) or narrows (portrait) to
// preserve the original canvas proportions — no forced 4:5 crop.
const ARTWORKS: EaselArtworkItem[] = [
  {
    src: "/artworks/voiliers-en-mer.jpg",
    title: "Voiliers en mer",
    subtitle: "Huile sur toile",
    aspectRatio: 2178 / 1778, // ≈ 1.225 — landscape
    placeholderBg:
      "linear-gradient(170deg, #4a8bc5 0%, #6daed8 45%, #c7e4f2 100%)",
  },
  {
    src: "/artworks/village-au-bord-de-mer.jpg",
    title: "Village au bord de mer",
    subtitle: "Huile sur toile",
    aspectRatio: 3024 / 3024, // 1.000 — square
    placeholderBg:
      "linear-gradient(175deg, #cfe2ea 0%, #6fa6c3 50%, #356a8c 100%)",
  },
  {
    src: "/artworks/palmier-au-bord-de-mer.jpg",
    title: "Palmier au bord de mer",
    subtitle: "Huile sur toile",
    aspectRatio: 3057 / 2527, // ≈ 1.210 — landscape
    placeholderBg:
      "linear-gradient(180deg, #7ec0c8 0%, #b2d4d2 38%, #e8d2a4 78%, #d6b890 100%)",
  },
  {
    src: "/artworks/pont-sur-la-riviere.jpg",
    title: "Pont sur la rivière",
    subtitle: "Huile sur toile",
    aspectRatio: 3214 / 2539, // ≈ 1.266 — landscape
    placeholderBg:
      "linear-gradient(170deg, #a8c3d0 0%, #8aa980 38%, #62a09a 72%, #4a808c 100%)",
  },
  {
    src: "/artworks/au-bord-de-mer.jpg",
    title: "Au bord de mer",
    subtitle: "Huile sur toile",
    aspectRatio: 2310 / 2970, // ≈ 0.778 — portrait
    placeholderBg:
      "linear-gradient(165deg, #d8cf9c 0%, #a8b07a 50%, #6e7e54 100%)",
  },
  {
    src: "/artworks/IMG_2393.JPG",
    title: "Portrait à la robe dorée",
    subtitle: "Huile sur toile",
    aspectRatio: 1492 / 1985, // ≈ 0.752 — portrait
    placeholderBg: "linear-gradient(165deg, #efe2c2 0%, #c8a36a 100%)",
  },
  {
    src: "/artworks/IMG_2394.JPG",
    title: "Sous la pluie",
    subtitle: "Huile sur toile",
    aspectRatio: 2487 / 3091, // ≈ 0.805 — portrait
    placeholderBg: "linear-gradient(170deg, #6d7f8f 0%, #4a5a6e 100%)",
  },
  {
    src: "/artworks/IMG_2396.JPG",
    title: "L'après-midi à la piscine",
    subtitle: "Huile sur toile",
    aspectRatio: 4032 / 3024, // ≈ 1.333 — landscape
    placeholderBg: "linear-gradient(170deg, #cfe5ee 0%, #6fa6c3 100%)",
  },
  {
    src: "/artworks/IMG_2400.JPG",
    title: "Sans titre I",
    aspectRatio: 2654 / 2642, // ≈ 1.005 — near square
    placeholderBg: "linear-gradient(165deg, #f0d8aa 0%, #c89368 100%)",
  },
  {
    src: "/artworks/IMG_2401.JPG",
    title: "Sans titre II",
    aspectRatio: 2920 / 2237, // ≈ 1.305 — landscape
    placeholderBg: "linear-gradient(165deg, #d8a587 0%, #9a5d3e 100%)",
  },
  {
    src: "/artworks/IMG_2402.JPG",
    title: "Sans titre III",
    aspectRatio: 3302 / 2636, // ≈ 1.253 — landscape
    placeholderBg: "linear-gradient(170deg, #c9c089 0%, #7a8552 100%)",
  },
];

/**
 * GalleryExperience — the /mes-oeuvres page client.
 *
 * Re-uses the same atmosphere as the homepage (Scene3D sky + FloatingNav
 * + entry curtain) so the gallery feels like a continuation of the
 * Mediterranean atelier, not a separate sub-site. The page content is
 * a centered title + intro + a responsive grid of `ArtworkGalleryCard`s.
 */
export default function GalleryExperience() {
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, MOUSE_SPRING);
  const mouseY = useSpring(rawMouseY, MOUSE_SPRING);

  const { scrollYProgress } = useScroll();
  const scrollSpring = useSpring(scrollYProgress, SCROLL_SPRING);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      rawMouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawMouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawMouseX, rawMouseY]);

  return (
    <>
      <Scene3D mouseX={mouseX} mouseY={mouseY} scroll={scrollSpring} />

      <FloatingNav />

      {/* Premium entry curtain — fades from deep night to reveal the sky */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2.0, delay: 0.2, ease: [...PREMIUM_EASE] }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background:
            "radial-gradient(ellipse at center, #070e2a 0%, #02040d 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Top spacer — gives the floating nav room before the title */}
        <div style={{ height: "clamp(110px, 14vh, 180px)" }} />

        <section className="gallery-section">
          <div className="gallery-intro">
            <motion.h1
              className="gallery-title type-display-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.2,
                delay: 0.6,
                ease: [...PREMIUM_EASE],
              }}
            >
              Mes œuvres
            </motion.h1>

            <motion.p
              className="gallery-lede type-subheading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 1.1,
                delay: 0.85,
                ease: [...PREMIUM_EASE],
              }}
            >
              Voici une sélection de toiles inspirées par la Côte d&rsquo;Azur,
              la mer et les paysages du Sud.
            </motion.p>
          </div>

          <div className="gallery-grid-easel">
            {ARTWORKS.map((a, i) => (
              <EaselArtworkCard key={a.src} item={a} index={i} />
            ))}
          </div>
        </section>

        {/* Closing spacer — preserves the long sky-world feel */}
        <div style={{ height: "30vh" }} />
      </div>
    </>
  );
}
