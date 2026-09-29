"use client";

import { useRef, useEffect, useState, ReactNode, ElementType, CSSProperties } from "react";

/** Adds `is-inview` once the element enters the viewport (drives .reveal / .ln-mask). */
export default function Reveal({
  as: Tag = "div",
  className = "",
  children,
  threshold = 0.15,
  style,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  threshold?: number;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLElement>(null);
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
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <Tag ref={ref} style={style} className={`${className} ${seen ? "is-inview" : ""}`.trim()}>
      {children}
    </Tag>
  );
}
