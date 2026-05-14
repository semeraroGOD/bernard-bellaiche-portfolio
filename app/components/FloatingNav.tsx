"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import EmailCopyPill from "./EmailCopyPill";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

const NAV_LINKS = [
  { href: "#accueil",   label: "Accueil" },
  { href: "#oeuvres",   label: "Mes œuvres" },
  { href: "#about",     label: "Qui suis-je ?" },
  { href: "#contact",   label: "Me contacter" },
];

/**
 * Floating top navigation — three cream pills sitting lightly above the
 * sky. Inspired by the "atelier" feel of a Mediterranean artist studio,
 * not a SaaS navbar.
 *
 *   • left  → "Atelier ouvert" status pill (green dot, gentle float)
 *   • center → main nav capsule (Accueil / Œuvres / Qui suis-je / Contact)
 *   • right → CTA capsule ("Me demander une toile")
 *
 * On mobile the layout collapses to: small logo pill | menu icon | CTA.
 * Tapping the menu icon reveals the four links in a stacked cream panel.
 */
export default function FloatingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

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

      {/* ────────── Mobile-only: compact logo pill ────────── */}
      <div className="nav-pill nav-pill--logo" aria-hidden="true">
        <span className="nav-logo-mark">C</span>
        <span className="nav-logo-word">Ciel</span>
      </div>

      {/* ────────── Center: main nav capsule (desktop) ────────── */}
      <motion.div
        className="nav-pill nav-pill--links"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        {NAV_LINKS.map((l) => (
          <a key={l.href} href={l.href} className="nav-link">
            {l.label}
          </a>
        ))}
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
              <a
                key={l.href}
                href={l.href}
                className="nav-link nav-link--mobile"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
