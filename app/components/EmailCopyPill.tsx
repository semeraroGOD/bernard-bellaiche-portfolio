"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const EMAIL = "bernardbellaiche@yahoo.fr";

/**
 * EmailCopyPill — top-right floating pill that copies the artist's email
 * address to the clipboard on click. No mail app is opened.
 *
 *   Desktop : [envelope icon]  bernardbellaiche@yahoo.fr
 *   Mobile  : [envelope icon]   ← icon only, round button
 *   On copy : pill briefly shows "Email copié" with a check icon
 *
 * Uses `navigator.clipboard.writeText` when available, with a
 * `document.execCommand('copy')` fallback for older / non-secure contexts.
 */
export default function EmailCopyPill({ email = EMAIL }: { email?: string }) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<number | null>(null);

  // Clear pending timers if the component unmounts mid-feedback
  useEffect(() => {
    return () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    };
  }, []);

  const copyToClipboard = useCallback(async (text: string) => {
    // Preferred path — Clipboard API in secure contexts
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      window.isSecureContext
    ) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        /* fall through to legacy path */
      }
    }
    // Fallback — hidden textarea + execCommand
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }, []);

  const handleClick = useCallback(async () => {
    const ok = await copyToClipboard(email);
    if (!ok) return;
    setCopied(true);
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    // Hold the expanded "Email copié" state long enough on mobile for the
    // address to be readable + the feedback to register before collapse.
    resetTimer.current = window.setTimeout(() => setCopied(false), 2200);
  }, [copyToClipboard, email]);

  return (
    <button
      type="button"
      className={`nav-pill nav-email-pill${copied ? " is-copied" : ""}`}
      onClick={handleClick}
      aria-label="Copier l'adresse email"
      title={copied ? "Email copié" : email}
    >
      {/* Envelope icon (default state) */}
      <svg
        className="nav-email-icon nav-email-icon--envelope"
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <rect
          x="1.5"
          y="3.5"
          width="13"
          height="9"
          rx="1.6"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M2 4.5l6 4.2 6-4.2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Check icon (copied state) */}
      <svg
        className="nav-email-icon nav-email-icon--check"
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 8.4l3.2 3.2L13 4.8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Label — swaps from email to "Email copié" when feedback is active.
          The .nav-email-text wrapper is hidden on mobile via CSS. */}
      <span className="nav-email-text">
        <span className="nav-email-text-default">{email}</span>
        <span className="nav-email-text-copied">Email copié</span>
      </span>

      {/* Screen-reader only live region so the state change is announced */}
      <span className="sr-only" aria-live="polite">
        {copied ? "Adresse email copiée dans le presse-papier" : ""}
      </span>
    </button>
  );
}
