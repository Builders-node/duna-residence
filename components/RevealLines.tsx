"use client";

import { useRef, useEffect, useState, ReactNode, ElementType, CSSProperties } from "react";

/**
 * Line-mask reveal: each line sits in an overflow-hidden mask and rises into
 * place with a staggered delay when the block enters the viewport.
 */
export default function RevealLines({
  lines,
  as: Tag = "div",
  className = "",
  stagger = 0.08,
  style,
}: {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  stagger?: number;
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
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} style={style} className={`${className} ${seen ? "is-inview" : ""}`.trim()}>
      {lines.map((line, i) => (
        <span key={i} className="ln-mask">
          <span style={{ transitionDelay: `${(i * stagger).toFixed(3)}s` }}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}
