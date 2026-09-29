"use client";

import { useRef, useEffect, ReactNode } from "react";
import Image from "next/image";

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** normalized progress of x across [a,b] */
const seg = (x: number, a: number, b: number) => clamp01((x - a) / (b - a));

/**
 * Scroll-driven cinematic reveal:
 * 1. Exterior view of the building (camera pushes in, dissolves)
 * 2. Camera "flies" inside — interior comes into focus
 * 3. Caption + actions settle, then the page scrolls on.
 *
 * Uses a direct scroll listener + rAF (deterministic, no cached-offset quirks).
 */
export default function CinematicReveal({
  exterior,
  interior,
  eyebrow,
  title,
  titleAccent,
  subtitle,
  actions,
  height = "320vh",
}: {
  exterior: string;
  interior: string;
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  actions?: ReactNode;
  height?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const extRef = useRef<HTMLDivElement>(null);
  const intRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const capRef = useRef<HTMLDivElement>(null);
  const cueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const p = total > 0 ? clamp01(-rect.top / total) : 0;

      const ext = extRef.current;
      if (ext) {
        const s = 1 + 0.85 * seg(p, 0, 0.55);
        ext.style.transform = `scale(${s.toFixed(4)})`;
        ext.style.opacity = String(1 - seg(p, 0.28, 0.5));
        ext.style.filter = `blur(${(14 * seg(p, 0.28, 0.5)).toFixed(2)}px)`;
      }
      const int = intRef.current;
      if (int) {
        const s = 1.45 - 0.45 * seg(p, 0.3, 0.85);
        int.style.transform = `scale(${s.toFixed(4)})`;
        int.style.opacity = String(seg(p, 0.34, 0.58));
        int.style.filter = `blur(${(16 * (1 - seg(p, 0.34, 0.62))).toFixed(2)}px)`;
      }
      const t = titleRef.current;
      if (t) {
        t.style.opacity = String(1 - seg(p, 0.14, 0.3));
        t.style.transform = `translateY(${(-70 * seg(p, 0, 0.3)).toFixed(1)}px)`;
      }
      const c = capRef.current;
      if (c) {
        c.style.opacity = String(seg(p, 0.62, 0.82));
        c.style.transform = `translateY(${(40 * (1 - seg(p, 0.62, 0.85))).toFixed(1)}px)`;
      }
      const cue = cueRef.current;
      if (cue) cue.style.opacity = String(1 - seg(p, 0, 0.08));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* EXTERIOR */}
        <div
          ref={extRef}
          className="absolute inset-0 will-change-transform"
          style={{ opacity: 1, transform: "scale(1)" }}
        >
          <Image src={exterior} alt="" fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" />
        </div>

        {/* INTERIOR */}
        <div
          ref={intRef}
          className="absolute inset-0 will-change-transform"
          style={{ opacity: 0, transform: "scale(1.45)", filter: "blur(16px)" }}
        >
          <Image src={interior} alt="" fill sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/15" />
        </div>

        {/* EXTERIOR TITLE — BLOOM layout: heading bottom-left, actions bottom-right */}
        <div ref={titleRef} className="absolute inset-0 z-10 flex flex-col justify-end text-white" style={{ opacity: 1 }}>
          <div className="wrap" style={{ paddingBottom: "56rem" }}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between" style={{ gap: "36rem" }}>
              <div style={{ maxWidth: "22ch" }}>
                {eyebrow && (
                  <div className="eyebrow" style={{ color: "rgba(255,255,255,0.75)" }}>
                    {eyebrow}
                  </div>
                )}
                <h1 className="hero-title" style={{ marginTop: "22rem" }}>
                  {title}
                  {titleAccent && <> {titleAccent}</>}
                </h1>
              </div>
              {actions && (
                <div className="flex shrink-0" style={{ gap: "10rem" }}>
                  {actions}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* INTERIOR CAPTION */}
        <div
          ref={capRef}
          className="absolute inset-0 z-10 flex flex-col justify-end pointer-events-none text-white"
          style={{ opacity: 0, transform: "translateY(40px)" }}
        >
          <div className="wrap pointer-events-auto" style={{ paddingBottom: "72rem" }}>
            {subtitle && (
              <p className="hero-title" style={{ maxWidth: "22ch" }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* SCROLL CUE */}
        <div
          ref={cueRef}
          className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white"
          style={{ opacity: 1, bottom: "40rem", gap: "10rem", fontSize: "12rem", letterSpacing: "0.24em" }}
        >
          <span>STEP INSIDE</span>
          <span className="relative overflow-hidden" style={{ height: "48rem", width: "1px", background: "rgba(255,255,255,0.3)" }}>
            <span className="absolute inset-x-0 top-0 bg-white animate-[cueSlide_1.8s_ease-in-out_infinite]" style={{ height: "50%" }} />
          </span>
        </div>
      </div>
    </section>
  );
}
