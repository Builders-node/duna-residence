import Link from "next/link";
import { Apartment } from "@/lib/types";
import { ROOM_LABEL, formatRate, formatPrice, planTypeLabel, unitPrice } from "@/lib/data";
import { FavoriteButton } from "./Favorites";

export default function ApartmentCard({ a, planUrl }: { a: Apartment; planUrl?: string }) {
  return (
    <Link
      href={`/apartment/${a.id}`}
      className="group flex flex-col overflow-hidden bg-white border border-[#e2e2e2] hover:border-black"
      style={{ borderRadius: "4rem", transition: "border-color var(--dur-mid) var(--ease)" }}
    >
      {/* plan thumb */}
      <div
        className="media relative aspect-[4/3] flex items-center justify-center"
        style={{ padding: "24rem", background: "var(--white)" }}
      >
        <div
          className="w-full h-full flex items-center justify-center group-hover:scale-[1.025]"
          style={{ transition: "transform var(--dur-hover) var(--ease-hover)" }}
        >
          {planUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={planUrl} alt={`${a.name} floor plan`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
          ) : (
            <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none" stroke="var(--gray-3)" strokeWidth="1.3">
              <rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 10h18M10 10v11" />
            </svg>
          )}
        </div>
        <div className="absolute eyebrow" style={{ top: "16rem", left: "16rem", color: "var(--gray-3)" }}>
          {a.available} available
        </div>
        <div className="absolute" style={{ top: "14rem", right: "14rem" }}>
          <FavoriteButton id={a.id} />
        </div>
      </div>

      <div style={{ padding: "24rem", borderTop: "1px solid var(--gray-e2)" }}>
        <div className="flex items-center justify-between">
          <h3 className="serif" style={{ fontSize: "26rem" }}>{a.name}</h3>
          <span style={{ fontSize: "12rem", color: "var(--gray-3)" }}>
            {planTypeLabel(a.planType)}
          </span>
        </div>
        <div
          className="flex items-center gap-4"
          style={{ marginTop: "12rem", fontSize: "14rem", color: "var(--gray-3)" }}
        >
          <span>{ROOM_LABEL[a.rooms]}</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>{a.area} m²</span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>terrace {a.terrace} m²</span>
        </div>
        <div className="flex items-end justify-between" style={{ marginTop: "20rem" }}>
          <div>
            <div className="serif" style={{ fontSize: "24rem", color: "var(--black)" }}>
              {formatRate(a.pricePerM2)}
            </div>
            <div style={{ fontSize: "12rem", color: "var(--gray-3)", marginTop: "4rem" }}>
              from {formatPrice(unitPrice(a))}
            </div>
          </div>
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ fontSize: "12rem", color: "var(--black)" }}
          >
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
