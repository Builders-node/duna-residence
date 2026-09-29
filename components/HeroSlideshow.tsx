"use client";

import { useState, useEffect, ReactNode } from "react";
import Image from "next/image";

/** Hero with a crossfading photo slideshow — the text stays fixed. */
export default function HeroSlideshow({
  images,
  eyebrow,
  title,
  actions,
  interval = 5000,
}: {
  images: string[];
  eyebrow?: string;
  title: string;
  actions?: ReactNode;
  interval?: number;
}) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images.length, interval]);

  return (
    <section className="relative overflow-hidden" style={{ height: "100svh" }}>
      {/* crossfading photos */}
      {images.map((src, idx) => (
        <div
          key={src}
          className="absolute inset-0"
          style={{
            opacity: idx === i ? 1 : 0,
            transition: "opacity 1.6s var(--ease-hover)",
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}

      {/* scrim */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" />

      {/* fixed text */}
      <div className="absolute inset-0 z-10 flex flex-col justify-end text-white">
        <div className="wrap" style={{ paddingBottom: "56rem" }}>
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

      {/* slide dots */}
      <div
        className="absolute z-10 flex"
        style={{ bottom: "40rem", left: "50%", transform: "translateX(-50%)", gap: "8rem" }}
      >
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Slide ${idx + 1}`}
            style={{
              width: idx === i ? "22rem" : "8rem",
              height: "8rem",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              background: idx === i ? "#fff" : "rgba(255,255,255,0.5)",
              transition: "all var(--dur-mid) var(--ease)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
