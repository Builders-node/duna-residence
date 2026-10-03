"use client";

import { useRef, useEffect, ReactNode } from "react";

/**
 * Hero with a lightweight autoplaying, looping, muted background video.
 * Loads fast (small normal-GOP file + instant poster), plays smoothly, and
 * the page scrolls over it normally. Respects reduced-motion.
 */
export default function HeroVideo({
  src,
  poster,
  eyebrow,
  title,
  actions,
}: {
  src: string;
  poster?: string;
  eyebrow?: string;
  title: string;
  actions?: ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      video.removeAttribute("autoplay");
      return; // keep the poster frame, no motion
    }

    video.muted = true;
    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };
    if (video.readyState >= 2) tryPlay();
    else video.addEventListener("loadeddata", tryPlay, { once: true });

    return () => video.removeEventListener("loadeddata", tryPlay);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ height: "100svh" }}>
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/30" />

      {/* text */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end text-white">
        <div className="wrap" style={{ paddingBottom: "72rem" }}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between" style={{ gap: "36rem" }}>
            <div style={{ maxWidth: "22ch" }}>
              {eyebrow && (
                <div className="eyebrow" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {eyebrow}
                </div>
              )}
              <h1 className="hero-title" style={{ marginTop: "22rem" }}>{title}</h1>
            </div>
            {actions && (
              <div className="flex shrink-0" style={{ gap: "10rem" }}>{actions}</div>
            )}
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-white"
        style={{ bottom: "32rem", gap: "10rem", fontSize: "12rem", letterSpacing: "0.24em" }}
      >
        <span>SCROLL</span>
        <span className="relative overflow-hidden" style={{ height: "48rem", width: "1px", background: "rgba(255,255,255,0.3)" }}>
          <span className="absolute inset-x-0 top-0 bg-white animate-[cueSlide_1.8s_ease-in-out_infinite]" style={{ height: "50%" }} />
        </span>
      </div>
    </section>
  );
}
