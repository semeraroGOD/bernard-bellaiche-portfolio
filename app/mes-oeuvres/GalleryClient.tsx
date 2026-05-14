"use client";

import dynamic from "next/dynamic";

/**
 * Dynamically-imported gallery client. We disable SSR so Three.js / R3F
 * never tries to render on the server — same pattern as the homepage's
 * `ClientWrapper`.
 *
 * The loading state matches the entry curtain on the homepage, so the
 * route transition stays calm.
 */
const GalleryExperience = dynamic(
  () => import("../components/GalleryExperience"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background:
            "linear-gradient(180deg, #0a1a40 0%, #0d47a1 20%, #1565c0 40%, #42a5f5 70%, #b3e5fc 100%)",
        }}
      />
    ),
  }
);

export default function GalleryClient() {
  return <GalleryExperience />;
}
