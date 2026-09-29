"use client";

import { useRef, useState } from "react";
import FloorPlan, { planMeta, planDetail } from "./FloorPlan";
import { PlanType } from "@/lib/types";

/** Floor plans as a horizontal slider; click a plan for a detail modal. */
export default function PlanViewer({ type }: { type: PlanType }) {
  const meta = planMeta(type);
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef({ down: false, startX: 0, left: 0, moved: false });
  const [open, setOpen] = useState<number | null>(null);

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

  const detail = open !== null ? planDetail(type, open) : null;

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
        {meta.map((m, i) => (
          <figure
            key={m.name}
            onClick={() => { if (!drag.current.moved) setOpen(i); }}
            style={{ flex: "0 0 auto", width: "420rem", maxWidth: "82vw", scrollSnapAlign: "start", cursor: "pointer" }}
          >
            <div
              className="group"
              style={{
                position: "relative",
                border: "1px solid var(--gray-e2)", borderRadius: "6rem", padding: "36rem",
                aspectRatio: "1 / 1", display: "grid", placeItems: "center",
                transition: "border-color var(--dur-fast) var(--ease)",
              }}
            >
              <FloorPlan type={type} variant={i} className="w-full h-auto" />
              <span
                className="group-hover:opacity-100"
                style={{
                  position: "absolute", bottom: "16rem", right: "16rem", opacity: 0,
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
                <div className="serif" style={{ fontSize: "20rem" }}>{m.name}</div>
                <div style={{ fontSize: "13rem", color: "var(--gray-3)", marginTop: "4rem" }}>{m.desc}</div>
              </div>
              <span className="eyebrow">0{i + 1}</span>
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
              width: "min(960rem, 94vw)", maxHeight: "90vh", overflowY: "auto",
              background: "#fff", borderRadius: "10rem", zIndex: 91,
              boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "36rem 40rem 0" }}>
              <div>
                <div className="eyebrow">{detail.name} · Layout</div>
                <h3 className="serif" style={{ fontSize: "40rem", marginTop: "10rem", lineHeight: 1 }}>{detail.desc}</h3>
              </div>
              <button
                onClick={() => setOpen(null)}
                aria-label="Close"
                style={{ border: "none", background: "none", fontSize: "30rem", cursor: "pointer", lineHeight: 1, color: "#000" }}
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2" style={{ gap: "40rem", padding: "32rem 40rem 40rem", alignItems: "center" }}>
              <div style={{ border: "1px solid var(--gray-e2)", borderRadius: "6rem", padding: "32rem" }}>
                <FloorPlan type={type} variant={open} className="w-full h-auto" />
              </div>

              <div>
                <div className="eyebrow">Rooms</div>
                <div style={{ marginTop: "16rem" }}>
                  {detail.rooms.map((r, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                      style={{ padding: "12rem 0", borderTop: idx === 0 ? "none" : "1px solid var(--gray-e2)" }}
                    >
                      <span style={{ fontSize: "16rem" }}>{r.label}</span>
                      <span style={{ fontSize: "14rem", color: "var(--gray-3)" }}>{r.sub || "—"}</span>
                    </div>
                  ))}
                </div>
                <a href="#contact" onClick={() => setOpen(null)} className="btn btn--filled" style={{ marginTop: "28rem" }}>
                  Enquire about this layout
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
