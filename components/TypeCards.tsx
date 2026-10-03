"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FavoriteButton } from "./Favorites";
import { Apartment } from "@/lib/types";
import { APARTMENTS, formatRate, formatPrice, unitPrice, ROOM_LABEL } from "@/lib/data";

type PlanLite = { url: string; label: string };
type TypeWithPlans = Apartment & { plans?: PlanLite[] };

const IMG: Record<string, string> = {
  "two-bed": "/images/living.png",
  "three-bed": "/images/terrace.png",
};

// warm terracotta panels derived from the accent, varied per row
const PANEL = [
  "linear-gradient(115deg, #1b100e 0%, #381914 58%, #823224 135%)",
  "linear-gradient(115deg, #16110f 0%, #2b1613 52%, #a24534 140%)",
  "linear-gradient(115deg, #1a1013 0%, #33181a 60%, #6e2a28 130%)",
];

export default function TypeCards() {
  const [types, setTypes] = useState<TypeWithPlans[]>(APARTMENTS);

  useEffect(() => {
    fetch("/api/apartments", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.apartments) && d.apartments.length) setTypes(d.apartments);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="explorer" className="wrap" style={{ display: "flex", flexDirection: "column", gap: "14rem" }}>
      {types.map((t, i) => {
        const sold = t.available <= 0;
        const img = IMG[t.id] ?? "/images/living.png";
        return (
          <article
            key={t.id}
            className="group grid lg:grid-cols-2 overflow-hidden"
            style={{ borderRadius: "10rem" }}
          >
            {/* image */}
            <div className="relative overflow-hidden" style={{ minHeight: "270rem" }}>
              <Image
                src={img}
                alt={t.name}
                fill
                sizes="(max-width:1024px) 100vw, 700px"
                className="object-cover group-hover:scale-[1.03]"
                style={{ transition: "transform var(--dur-hover) var(--ease-hover)" }}
              />
              {sold && (
                <span
                  className="absolute"
                  style={{ bottom: "18rem", left: "18rem", background: "#000", color: "#fff", fontSize: "11rem", letterSpacing: "0.12em", textTransform: "uppercase", padding: "7rem 12rem", borderRadius: "5rem" }}
                >
                  Sold out
                </span>
              )}
            </div>

            {/* panel */}
            <div
              className="relative flex flex-col justify-between text-white"
              style={{ background: PANEL[i % PANEL.length], padding: "40rem" }}
            >
              <div className="flex items-start justify-between" style={{ gap: "20rem" }}>
                <div>
                  <h3 className="serif" style={{ fontSize: "40rem", lineHeight: 1 }}>{t.name}</h3>
                  <div style={{ marginTop: "12rem", fontSize: "16rem", color: "rgba(255,255,255,0.8)" }}>
                    {ROOM_LABEL[t.rooms]}
                  </div>
                  <div style={{ marginTop: "6rem", fontSize: "16rem", color: "rgba(255,255,255,0.8)" }}>
                    {t.area} m² · {formatRate(t.pricePerM2)}
                  </div>
                  <div style={{ marginTop: "6rem", fontSize: "13rem", color: "rgba(255,255,255,0.55)" }}>
                    from {formatPrice(unitPrice(t))} · {sold ? "waitlist only" : `${t.available} available`}
                  </div>

                  {/* small actions */}
                  <div className="flex items-center" style={{ gap: "10rem", marginTop: "22rem" }}>
                    <FavoriteButton id={t.id} />
                    <Link
                      href={`/apartment/${t.id}#plan`}
                      aria-label="View floor plans"
                      style={{ width: "36rem", height: "36rem", borderRadius: "999px", display: "grid", placeItems: "center", border: "1px solid rgba(255,255,255,0.4)", color: "#fff" }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                        <rect x="3" y="3" width="18" height="18" rx="1" />
                        <path d="M3 10h18M10 10v11" />
                      </svg>
                    </Link>
                  </div>
                </div>

                {/* avatar = mini floor plan thumbnail */}
                <div
                  className="shrink-0 overflow-hidden"
                  style={{ width: "64rem", height: "64rem", borderRadius: "999px", background: "#f4f0ee", display: "grid", placeItems: "center", padding: "8rem" }}
                >
                  {t.plans && t.plans[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.plans[0].url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  ) : (
                    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="#823224" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 10h18M10 10v11" />
                    </svg>
                  )}
                </div>
              </div>

              {/* pill */}
              <div className="flex justify-end" style={{ marginTop: "28rem" }}>
                <Link
                  href={`/apartment/${t.id}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8rem",
                    padding: "13rem 24rem",
                    borderRadius: "999px",
                    fontSize: "14rem",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.5)",
                    transition: "background var(--dur-fast) var(--ease)",
                  }}
                >
                  {sold ? "Join waitlist" : "View"} →
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
