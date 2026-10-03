"use client";

import { useRef, useState } from "react";

export interface PlanItem {
  id: string;
  label: string;
  area: number | null;
  roomsDesc: string;
  url: string;
}

/** Real floor-plan images as a horizontal slider; click a plan for a detail modal. */
export default function PlanViewer({ plans }: { plans: PlanItem[] }) {
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, left: 0, moved: false });
  const [open, setOpen] = useState<number | null>(null);

  if (!plans || plans.length === 0) {
    return (
      <div style={{ border: "1px solid var(--gray-e2)", borderRadius: "6rem", padding: "48rem", textAlign: "center", color: "var(--gray-3)", fontSize: "15rem" }}>
        Floor plans coming soon.
      </div>
    );
  }

  const scrollByCards = (dir: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: "smooth" });
  };

  const Arrow = ({ dir }: { dir: -1 | 1 }) => (
    <button
      onClick={() => scrollByCards(dir)}
      aria-label={dir < 0 ? "Previous plans" : "Next plans"}
      style={{
        width: "48rem", height: "48rem", borderRadius: "999px", display: "grid", placeItems: "center",
        border: "1px solid var(--gray-e2)", background: "#fff", cursor: "pointer",
        transition: "border-color var(--dur-fast) var(--ease)",
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="1.7">
        {dir < 0 ? <path d="M15 5l-7 7 7 7" /> : <path d="M9 5l7 7-7 7" />}
      </svg>
    </button>
  );

  const detail = open !== null ? plans[open] : null;

  return (
    <div>
      <div
        ref={track}
        className="plan-track"
        style={{ gap: "24rem", paddingBottom: "6rem", cursor: "grab" }}
        onPointerDown={(e) => {
          const el = track.current;
          if (!el) return;
          drag.current = { down: true, startX: e.clientX, left: el.scrollLeft, moved: false };
          el.style.cursor = "grabbing";
          el.style.scrollSnapType = "none";
        }}
        onPointerMove={(e) => {
          const el = track.current;
          if (!el || !drag.current.down) return;
          const dx = e.clientX - drag.current.startX;
          if (Math.abs(dx) > 4) drag.current.moved = true;
          el.scrollLeft = drag.current.left - dx;
        }}
        onPointerUp={() => {
          const el = track.current;
          drag.current.down = false;
          if (el) { el.style.cursor = "grab"; el.style.scrollSnapType = "x mandatory"; }
        }}
        onPointerLeave={() => {
          const el = track.current;
          drag.current.down = false;
          if (el) { el.style.cursor = "grab"; el.style.scrollSnapType = "x mandatory"; }
        }}
      >
        {plans.map((p, i) => (
          <figure
            key={p.id}
            onClick={() => { if (!drag.current.moved) setOpen(i); }}
            style={{ flex: "0 0 auto", width: "520rem", maxWidth: "88vw", scrollSnapAlign: "start", cursor: "pointer" }}
          >
            <div
              className="group"
              style={{
                position: "relative",
                border: "1px solid var(--gray-e2)", borderRadius: "6rem", padding: "20rem",
                aspectRatio: "16 / 10", display: "grid", placeItems: "center", overflow: "hidden",
                background: "#fff", transition: "border-color var(--dur-fast) var(--ease)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt={`${p.label} floor plan`}
                draggable={false}
                style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", userSelect: "none" }}
              />
              <span
                className="group-hover:opacity-100"
                style={{
                  position: "absolute", bottom: "14rem", right: "14rem", opacity: 0,
                  fontSize: "12rem", color: "#fff", background: "var(--accent)",
                  padding: "7rem 12rem", borderRadius: "5rem",
                  transition: "opacity var(--dur-fast) var(--ease)",
                }}
              >
                View details
              </span>
            </div>
            <div className="flex items-baseline justify-between" style={{ marginTop: "16rem" }}>
              <div>
                <div className="serif" style={{ fontSize: "20rem" }}>{p.label}</div>
                {(p.area || p.roomsDesc) && (
                  <div style={{ fontSize: "13rem", color: "var(--gray-3)", marginTop: "4rem" }}>
                    {p.area ? `${p.area} m²` : ""}{p.area && p.roomsDesc ? " · " : ""}{p.roomsDesc}
                  </div>
                )}
              </div>
              <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
            </div>
          </figure>
        ))}
      </div>

      <div className="flex justify-end" style={{ gap: "10rem", marginTop: "24rem" }}>
        <Arrow dir={-1} />
        <Arrow dir={1} />
      </div>

      {/* detail modal */}
      {open !== null && detail && (
        <>
          <div
            onClick={() => setOpen(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 90 }}
          />
          <div
            role="dialog"
            aria-modal="true"
            style={{
              position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
              width: "min(1040rem, 95vw)", maxHeight: "92vh", overflowY: "auto",
              background: "#fff", borderRadius: "10rem", zIndex: 91,
              boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "32rem 36rem 0" }}>
              <div>
                <div className="eyebrow">{detail.label} · Floor plan</div>
                {(detail.area || detail.roomsDesc) && (
                  <h3 className="serif" style={{ fontSize: "34rem", marginTop: "10rem", lineHeight: 1.05 }}>
                    {detail.area ? `${detail.area} m²` : detail.label}
                  </h3>
                )}
                {detail.roomsDesc && (
                  <p style={{ fontSize: "15rem", color: "var(--gray-3)", marginTop: "8rem" }}>{detail.roomsDesc}</p>
                )}
              </div>
              <button
                onClick={() => setOpen(null)}
                aria-label="Close"
                style={{ border: "none", background: "none", fontSize: "30rem", cursor: "pointer", lineHeight: 1, color: "#000" }}
              >
                ×
              </button>
            </div>

            <div style={{ padding: "24rem 36rem 16rem" }}>
              <div style={{ border: "1px solid var(--gray-e2)", borderRadius: "6rem", padding: "24rem", background: "#fff" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={detail.url} alt={`${detail.label} floor plan`} style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
            </div>

            <div style={{ padding: "0 36rem 36rem" }}>
              <a href="#contact" onClick={() => setOpen(null)} className="btn btn--filled">
                Enquire about this layout
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
