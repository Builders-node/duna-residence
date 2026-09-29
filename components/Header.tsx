"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SiteSettings } from "@/lib/site";

const NAV = [
  { href: "/#explorer", label: "Find a home" },
  { href: "/apartments", label: "All residences" },
  { href: "/#residence", label: "The residence" },
  { href: "/#contact", label: "Contact" },
];

const telHref = (phone: string) => "tel:" + phone.replace(/[^0-9+]/g, "");

export default function Header({ settings }: { settings: SiteSettings }) {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastY.current && y > 200) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-[9999] text-white"
        style={{
          mixBlendMode: open ? "normal" : "difference",
          transform: hidden && !open ? "translateY(-100%)" : "translateY(0)",
          transition:
            "transform var(--dur-slow) var(--ease), mix-blend-mode var(--dur-slow) var(--ease)",
          pointerEvents: "none",
          padding: "26rem 0",
        }}
      >
        <div className="wrap flex items-center justify-between" style={{ pointerEvents: "none" }}>
          {/* logo */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex items-center"
            style={{ gap: "10rem", pointerEvents: "all" }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
              <path d="M2 20V6L11 2l9 4v14" stroke="currentColor" strokeWidth="1.6" />
              <path d="M2 20l9-6 9 6" stroke="currentColor" strokeWidth="1.6" />
            </svg>
            <span
              style={{ fontSize: "17rem", fontWeight: 600, letterSpacing: "-0.01em" }}
            >
              Duna Residence
            </span>
          </Link>

          {/* hamburger */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex flex-col items-end justify-center"
            style={{ pointerEvents: "all", gap: "6rem", width: "34rem", height: "22rem" }}
          >
            <span
              style={{
                display: "block",
                height: "1.5px",
                width: "28rem",
                background: "currentColor",
                transition: "transform var(--dur-fast) var(--ease)",
                transform: open ? "translateY(4px) rotate(45deg)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                height: "1.5px",
                width: "28rem",
                background: "currentColor",
                transition: "transform var(--dur-fast) var(--ease)",
                transform: open ? "translateY(-4px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {/* full-screen overlay menu */}
      <div
        className="fixed inset-0 z-[9998] bg-black text-white flex flex-col justify-center"
        style={{
          pointerEvents: open ? "all" : "none",
          opacity: open ? 1 : 0,
          transition: "opacity var(--dur-slow) var(--ease)",
        }}
      >
        <nav className="wrap flex flex-col" style={{ gap: "8rem" }}>
          {NAV.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className="hero-title"
              style={{
                width: "fit-content",
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(20px)",
                transition: `opacity var(--dur-slow) var(--ease) ${i * 0.05 + 0.1}s, transform var(--dur-sig) var(--ease) ${i * 0.05 + 0.1}s`,
              }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div
          className="wrap flex flex-wrap items-center justify-between"
          style={{ marginTop: "80rem", gap: "16rem", fontSize: "15rem", color: "#929292" }}
        >
          {settings.phone && (
            <a href={telHref(settings.phone)} className="link" style={{ color: "#fff" }}>
              {settings.phone}
            </a>
          )}
          {settings.email && (
            <a href={`mailto:${settings.email}`} className="link" style={{ color: "#fff" }}>
              {settings.email}
            </a>
          )}
          <span>{settings.address}</span>
        </div>
      </div>
    </>
  );
}
