"use client";

import { useRef, useEffect, ReactNode } from "react";

/**
 * Hero whose background video is scrubbed by scroll position:
 * the section is tall, the video is sticky, and video.currentTime is driven
 * by how far you've scrolled through the section. The poster shows instantly
 * while the (all-keyframe) file buffers so seeking stays smooth.
 * Honours prefers-reduced-motion (static poster, no scrub).
 */
export default function HeroVideo({
  src,
  poster,
  eyebrow,
  title,
  actions,
  height = "300vh",
}: {
  src: string;
  poster?: string;
  eyebrow?: string;
  title: string;
  actions?: ReactNode;
  height?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return; // keep the poster, no scroll-driven motion

    let raf = 0;
    let target = 0;
    let current = 0;
    let dur = 0;

    const readDur = () => {
      if (video.duration && Number.isFinite(video.duration)) dur = video.duration;
    };
    video.addEventListener("loadedmetadata", readDur);
    readDur();

    // prime decoding so seeking paints frames (muted play then pause)
    video.muted = true;
    const prime = () => {
      const p = video.play();
      if (p && typeof p.then === "function") p.then(() => video.pause()).catch(() => {});
      else video.pause();
    };
    prime();

    const compute = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      target = p * (dur || 0);
    };

    const tick = () => {
      current += (target - current) * 0.12; // smooth toward target
      if (Math.abs(target - current) < 0.008) current = target;
      if (dur > 0 && Number.isFinite(current)) {
        try {
          video.currentTime = current;
        } catch {}
      }
      raf = requestAnimationFrame(tick);
    };

    const onScroll = () => compute();

    compute();
    raf = requestAnimationFrame(tick);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      video.removeEventListener("loadedmetadata", readDur);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height }}>
      <div className="sticky top-0 overflow-hidden" style={{ height: "100svh" }}>
        {/* scroll-scrubbed video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
          poster={poster}
        >
          <source src={src} type="video/mp4" />
        </video>

        {/* scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-black/30" />

        {/* fixed text */}
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
      </div>
    </section>
  );
}
