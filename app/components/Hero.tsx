"use client";

import {
  motion,
  useTransform,
  type MotionValue,
} from "framer-motion";

interface HeroProps {
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  scroll: MotionValue<number>;
}

// Cinematic easings
const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.45, 0, 0.55, 1] as const;

export default function Hero({ mouseX, mouseY, scroll }: HeroProps) {
  // Subtle mouse parallax — content drifts opposite to the cursor
  const parallaxX = useTransform(mouseX, (v) => v * -6);
  const parallaxY = useTransform(mouseY, (v) => v * -8);

  // Scroll-driven fade & lift: hero clears the way as user descends
  const scrollOpacity = useTransform(scroll, [0, 0.18, 0.3], [1, 0.6, 0]);
  const scrollLift = useTransform(scroll, [0, 0.3], [0, -80]);

  return (
    <section
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <motion.div
        style={{
          x: parallaxX,
          y: parallaxY,
          opacity: scrollOpacity,
          width: "100%",
          maxWidth: "1080px",
          padding: "0 24px",
          textAlign: "center",
          color: "#1A1A1A",
        }}
      >
        {/* Display 1 — dramatic, airy, luxury-tight tracking */}
        <motion.h1
          className="type-display-1"
          initial={{ opacity: 0, y: 28, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 1.7,
            delay: 1.4,
            ease: [...EASE_OUT_EXPO],
          }}
          style={{
            margin: 0,
            y: scrollLift,
            color: "#111111",
            /* Soft warm-white halo lifts the near-black off the sky
               without making it glow — purely a contrast aid. */
            textShadow:
              "0 1px 28px rgba(255, 248, 230, 0.55), 0 0 6px rgba(255, 248, 230, 0.35)",
            textWrap: "balance",
          }}
        >
          Les couleurs du Sud,{" "}
          <span
            style={{
              fontWeight: 400,
              color: "#2B2B2B",
            }}
          >
            peintes à la main
          </span>
        </motion.h1>

        {/* Subheading — clearly subordinate: ~5–6× smaller than display */}
        <motion.p
          className="type-subheading"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.4,
            delay: 1.95,
            ease: [...EASE_OUT_EXPO],
          }}
          style={{
            margin: "var(--rhythm-mid) auto 0",
            maxWidth: "44ch",
            color: "#2B2B2B",
            textShadow: "0 1px 18px rgba(255, 248, 230, 0.5)",
            textWrap: "balance",
          }}
        >
          Des toiles inspirées par la Côte d’Azur, la mer et les paysages
          méditerranéens.
        </motion.p>

        {/* CTA — medium weight, balanced, generous rhythm above */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 1.2,
            delay: 2.3,
            ease: [...EASE_OUT_EXPO],
          }}
          style={{
            marginTop: "var(--rhythm-loose)",
            display: "flex",
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          <motion.button
            type="button"
            whileHover={{
              scale: 1.035,
              backgroundColor: "rgba(255, 252, 244, 0.92)",
              borderColor: "rgba(255, 255, 255, 0.7)",
              boxShadow: "0 14px 44px rgba(8, 18, 44, 0.28)",
            }}
            whileTap={{ scale: 0.985 }}
            transition={{ duration: 0.45, ease: [...EASE_OUT_EXPO] }}
            style={{
              border: "1px solid rgba(255, 255, 255, 0.6)",
              background: "rgba(255, 252, 244, 0.82)",
              color: "#111111",
              fontFamily: "var(--font-bricolage), system-ui, sans-serif",
              fontWeight: 500,
              fontSize: "0.95rem",
              letterSpacing: "-0.005em",
              padding: "15px 30px",
              borderRadius: "999px",
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(8, 18, 44, 0.18)",
            }}
          >
            Voir les œuvres
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator — eyebrow rhythm */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4, delay: 2.8, ease: [...EASE_OUT_EXPO] }}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "44px",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          color: "#1A1A1A",
          fontFamily: "var(--font-bricolage), system-ui, sans-serif",
          fontWeight: 500,
          fontSize: "0.68rem",
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          opacity: scrollOpacity,
        }}
      >
        <motion.span
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{
            duration: 2.6,
            ease: [...EASE_IN_OUT],
            repeat: Infinity,
          }}
        >
          Défiler
        </motion.span>
        <motion.div
          animate={{
            scaleY: [0.4, 1, 0.4],
            opacity: [0.4, 0.85, 0.4],
          }}
          transition={{
            duration: 2.6,
            ease: [...EASE_IN_OUT],
            repeat: Infinity,
          }}
          style={{
            width: "1px",
            height: "44px",
            background:
              "linear-gradient(to bottom, rgba(244,248,255,0.85), rgba(244,248,255,0))",
            transformOrigin: "top",
          }}
        />
      </motion.div>
    </section>
  );
}
