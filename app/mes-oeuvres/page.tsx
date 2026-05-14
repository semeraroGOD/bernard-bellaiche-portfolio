import type { Metadata } from "next";
import GalleryClient from "./GalleryClient";

export const metadata: Metadata = {
  title: "Mes œuvres — Bernard Bellaiche",
  description:
    "Une sélection de toiles inspirées par la Côte d'Azur, la mer et les paysages du Sud, peintes à la main par Bernard Bellaiche.",
};

export default function MesOeuvresPage() {
  return <GalleryClient />;
}
