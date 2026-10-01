"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "duna-cookie-consent";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* storage blocked — don't nag */
    }
  }, []);

  const accept = () => {
    try { localStorage.setItem(KEY, "1"); } catch {}
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      style={{
        position: "fixed", zIndex: 9000, left: "16rem", right: "16rem", bottom: "16rem",
        maxWidth: "560rem", margin: "0 auto",
        background: "#000", color: "#f4efe9", borderRadius: "10rem",
        padding: "20rem 22rem", boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14rem",
      }}
    >
      <p style={{ flex: "1 1 240rem", fontSize: "13rem", lineHeight: 1.5, color: "rgba(244,239,233,0.82)", margin: 0 }}>
        We use minimal, privacy-friendly storage to run this site and remember your shortlist. See our{" "}
        <Link href="/privacy" className="link" style={{ color: "#fff" }}>Privacy Policy</Link>.
      </p>
      <button
        onClick={accept}
        className="btn btn--onaccent"
        style={{ whiteSpace: "nowrap" }}
      >
        Got it
      </button>
    </div>
  );
}
