"use client";

import { useRef, useEffect, useState, CSSProperties } from "react";
import Image from "next/image";

/**
 * Premium image reveal: the image sits in an overflow-hidden frame and eases
 * from a slight zoom + fade into place when it enters the viewport
 * (signature easing, 1.109s).
 */
export default function RevealImage({
  src,
  alt = "",
  className = "",
  style,
  priority = false,
}: {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`media relative ${className}`} style={style}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="100vw"
        className="object-cover"
        style={{
          transform: seen ? "scale(1)" : "scale(1.06)",
          opacity: seen ? 1 : 0,
          transition:
            "transform var(--dur-photo) var(--ease-smooth), opacity 1s var(--ease-smooth)",
        }}
      />
    </div>
  );
}
