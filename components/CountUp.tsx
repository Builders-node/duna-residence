"use client";

import { useRef, useEffect, useState, CSSProperties } from "react";

/**
 * Big decorative number that counts up to `value` when it enters view.
 * Mirrors the oversized stat number on architecture case-study pages.
 */
export default function CountUp({
  value,
  decimals = 0,
  suffix = "",
  className = "",
  style,
  duration = 1400,
}: {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
  style?: CSSProperties;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let started = false;

    const run = (startTs: number) => {
      const step = (ts: number) => {
        const t = Math.min(1, (ts - startTs) / duration);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(value * eased);
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            started = true;
            requestAnimationFrame((ts) => run(ts));
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className} style={style}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
