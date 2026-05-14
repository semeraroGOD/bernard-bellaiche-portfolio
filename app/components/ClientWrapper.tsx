"use client";

import dynamic from "next/dynamic";

const Experience = dynamic(() => import("./Experience"), {
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
});

export default function ClientWrapper() {
  return <Experience />;
}
