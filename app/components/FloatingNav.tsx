"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import EmailCopyPill from "./EmailCopyPill";

/**
 * "L'Atelier de Bernard" — the brand stamp. The image is a cream-paper
 * circular stamp with navy ink, so it blends with the navbar's cream
 * pill palette while staying readable. We render it with a circular
 * clip so it reads as a standalone badge whether placed on cream (inside
 * a nav pill) or directly over the sky (mobile, standalone).
 */
const BRAND_LOGO = {
  src: "/logo/atelier-de-bernard.png",
  alt: "L'Atelier de Bernard",
};

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * NAV_LINKS — each entry knows whether it's a section anchor (scrolls on
 * the homepage, navigates with a hash from any other page) or a real
 * page route (always navigates).
 *
 *   • Accueil       → top of /
 *   • Mes œuvres    → /mes-oeuvres (separate page)
 *   • Qui suis-je ? → /#qui-suis-je section
 *   • Me contacter  → /#contact section (custom-request section)
 */
type NavLink =
  | { kind: "top";    label: string }                // back to homepage top
  | { kind: "page";   label: string; href: string }  // full-page route
  | { kind: "anchor"; label: string; anchor: string }; // section on /

const NAV_LINKS: NavLink[] = [
  { kind: "top",    label: "Accueil" },
  { kind: "page",   label: "Mes œuvres",    href: "/mes-oeuvres" },
  { kind: "anchor", label: "Qui suis-je ?", anchor: "qui-suis-je" },
  { kind: "anchor", label: "Me contacter",  anchor: "contact" },
];

/**
 * Floating top navigation — three cream pills sitting lightly above the
 * sky. Inspired by the "atelier" feel of a Mediterranean artist studio,
 * not a SaaS navbar.
 *
 *   • left  → "Atelier ouvert" status pill (green dot, gentle float)
 *   • center → main nav capsule (Accueil / Œuvres / Qui suis-je / Contact)
 *   • right → EmailCopyPill (envelope icon → copy email on click)
 *
 * On mobile the layout collapses to: small logo pill | menu icon | email.
 * Tapping the menu icon reveals the four links in a stacked cream panel.
 */
export default function FloatingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // Build the right href for a given link, depending on where we currently are.
  const buildHref = (l: NavLink): string => {
    if (l.kind === "top") return "/";
    if (l.kind === "page") return l.href;
    return `/#${l.anchor}`;
  };

  // Click handler: when we're on the homepage AND the link is an in-page
  // anchor or "Accueil", smooth-scroll locally (no full navigation).
  const handleClick = (l: NavLink) => (e: React.MouseEvent) => {
    if (!isHome) return; // let Next.js handle the cross-page navigation
    if (l.kind === "top") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      history.replaceState(null, "", "/");
    } else if (l.kind === "anchor") {
      const target = document.getElementById(l.anchor);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        history.replaceState(null, "", `/#${l.anchor}`);
      }
    }
    // "page" links always do a real navigation.
  };

  return (
    <motion.nav
      className="floating-nav"
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.4, delay: 1.4, ease: [...EASE_OUT_EXPO] }}
      aria-label="Navigation principale"
    >
      {/* ────────── Left: status pill ────────── */}
      <motion.div
        className="nav-pill nav-pill--status"
        animate={{ y: [0, -3, 0, 3, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="nav-status-dot" aria-hidden="true">
          <span className="nav-status-dot-pulse" />
        </span>
        <span className="nav-status-label">Atelier ouvert</span>
      </motion.div>

      {/* ────────── Mobile-only: brand-stamp logo (also a "back home" link) ────────── */}
      <Link
        href="/"
        onClick={handleClick({ kind: "top", label: "Accueil" })}
        className="nav-pill nav-pill--logo"
        aria-label="L'Atelier de Bernard — retour à l'accueil"
      >
        <Image
          src={BRAND_LOGO.src}
          alt={BRAND_LOGO.alt}
          width={48}
          height={48}
          className="nav-brand-mark nav-brand-mark--mobile"
          priority
        />
      </Link>

      {/* ────────── Center: main nav capsule (desktop) ────────── */}
      <motion.div
        className="nav-pill nav-pill--links"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        {NAV_LINKS.map((l) => (
          <Link
            key={l.label}
            href={buildHref(l)}
            onClick={handleClick(l)}
            className="nav-link"
          >
            {l.label}
          </Link>
        ))}
        {/* Brand-stamp signature on the far right of the pill (desktop).
         * Subtle — acts as the artist's mark, not as a primary action.
         * Also a "back home" link, mirroring the mobile logo behaviour. */}
        <Link
          href="/"
          onClick={handleClick({ kind: "top", label: "Accueil" })}
          className="nav-brand-link"
          aria-label="L'Atelier de Bernard — retour à l'accueil"
        >
          <Image
            src={BRAND_LOGO.src}
            alt={BRAND_LOGO.alt}
            width={36}
            height={36}
            className="nav-brand-mark nav-brand-mark--desktop"
            priority
          />
        </Link>
      </motion.div>

      {/* ────────── Mobile-only: menu toggle ────────── */}
      <button
        type="button"
        className="nav-pill nav-pill--menu"
        aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        <span
          className={`nav-menu-icon${menuOpen ? " is-open" : ""}`}
          aria-hidden="true"
        >
          <span /><span /><span />
        </span>
      </button>

      {/* ────────── Right: email-copy CTA capsule ────────── */}
      <EmailCopyPill />

      {/* ────────── Mobile: dropdown menu panel ────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-mobile-panel"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [...EASE_OUT_EXPO] }}
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={buildHref(l)}
                className="nav-link nav-link--mobile"
                onClick={(e) => {
                  handleClick(l)(e);
                  setMenuOpen(false);
                }}
              >
                {l.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
