"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
} from "framer-motion";
import dynamic from "next/dynamic";

import Hero from "./Hero";
import PortfolioFolder from "./PortfolioFolder";
import ArtworksGrid from "./ArtworksGrid";
import FloatingNav from "./FloatingNav";
import BehindArtistSection from "./BehindArtistSection";
import WhoAmISection from "./WhoAmISection";
import CustomRequestSection from "./CustomRequestSection";
import HowItWorksSection from "./HowItWorksSection";

const Scene3D = dynamic(() => import("./Scene3D"), { ssr: false });

// Cinematic soft springs — low stiffness, generous damping = premium feel
const MOUSE_SPRING = { stiffness: 22, damping: 20, mass: 1.1 } as const;
const SCROLL_SPRING = { stiffness: 38, damping: 28, mass: 1 } as const;

// Apple-style easeOutExpo for entry transitions
const PREMIUM_EASE = [0.16, 1, 0.3, 1] as const;

export default function Experience() {
  // Raw mouse motion values
  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);

  // Springed mouse — what Three.js actually reads (silky parallax)
  const mouseX = useSpring(rawMouseX, MOUSE_SPRING);
  const mouseY = useSpring(rawMouseY, MOUSE_SPRING);

  // Scroll progress 0→1, springed for smooth camera rise
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

      {/* Floating top navigation — three cream pills above the sky */}
      <FloatingNav />

      {/* Hero — first section, fades and lifts with scroll */}
      <Hero mouseX={mouseX} mouseY={mouseY} scroll={scrollSpring} />

      {/* Premium entry curtain — fades from deep night to reveal the sky */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 2.6, delay: 0.3, ease: [...PREMIUM_EASE] }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 100,
          background:
            "radial-gradient(ellipse at center, #070e2a 0%, #02040d 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Scrollable content stack — drives camera lift + holds DOM sections */}
      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Hero spacer (Hero itself is position: fixed) */}
        <div style={{ height: "100vh" }} />

        {/* Portfolio folder — containing the artwork canvases */}
        <PortfolioFolder>
          <ArtworksGrid />
        </PortfolioFolder>

        {/* Short biography + polaroid fan */}
        <BehindArtistSection />

        {/* "Qui suis-je ?" — portrait + introduction + CTA */}
        <WhoAmISection />

        {/* Custom painting request — visual-only invitation card */}
        <CustomRequestSection />

        {/* "Comment ça marche" — two reassuring tracks of 3 steps each */}
        <HowItWorksSection />

        {/* Closing spacer — preserves the long sky-world feel after the section */}
        <div style={{ height: "60vh" }} />
      </div>
    </>
  );
}
