import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ciel",
  description:
    "Une galerie digitale poétique dédiée à la peinture contemporaine.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={bricolage.variable}
      style={{ height: "100%" }}
    >
      <body
        style={{
          minHeight: "100%",
          background: "#0a1628",
          fontFamily: "var(--font-bricolage), system-ui, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
