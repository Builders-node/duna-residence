"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import Link from "next/link";
import { Apartment } from "@/lib/types";
import { formatPrice, planTypeLabel, unitPrice } from "@/lib/data";

/* ─────────────────────────────────────────────
   Hook Model · INVESTMENT
   Users save residences to a personal shortlist.
   The stored effort creates an internal trigger to
   return, and grows the value of coming back.
   ───────────────────────────────────────────── */

const KEY = "duna-shortlist";

type Ctx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (id: string) => void;
  remove: (id: string) => void;
  count: number;
};

const FavCtx = createContext<Ctx | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(s)) setIds(s);
    } catch {}
  }, []);

  const persist = (next: string[]) => {
    setIds(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const value: Ctx = {
    ids,
    has: (id) => ids.includes(id),
    toggle: (id) => persist(ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]),
    remove: (id) => persist(ids.filter((x) => x !== id)),
    count: ids.length,
  };

  return (
    <FavCtx.Provider value={value}>
      {children}
      <ShortlistBar />
    </FavCtx.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavCtx);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7">
      <path d="M12 21s-7.5-4.7-10-9.2C.6 9 1.5 5.5 4.7 4.6 6.9 4 9 4.9 12 8c3-3.1 5.1-4 7.3-3.4C22.5 5.5 23.4 9 22 11.8 19.5 16.3 12 21 12 21z" />
    </svg>
  );
}

/** Save/heart control. variant "icon" = round overlay for cards; "text" = labelled button. */
export function FavoriteButton({
  id,
  variant = "icon",
  light = false,
}: {
  id: string;
  variant?: "icon" | "text";
  light?: boolean;
}) {
  const { has, toggle } = useFavorites();
  const saved = has(id);
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
  };

  if (variant === "text") {
    return (
      <button
        onClick={onClick}
        className={`btn${light ? " btn-light" : ""}`}
        style={{ gap: "10rem", ...(saved ? { background: "var(--accent)", borderColor: "var(--accent)", color: "#fff" } : {}) }}
      >
        <span style={{ display: "inline-flex" }}><Heart filled={saved} /></span>
        {saved ? "Saved to shortlist" : "Save to shortlist"}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      aria-label={saved ? "Remove from shortlist" : "Save to shortlist"}
      style={{
        width: "36rem",
        height: "36rem",
        borderRadius: "999px",
        display: "grid",
        placeItems: "center",
        cursor: "pointer",
        border: "none",
        background: saved ? "var(--accent)" : "rgba(255,255,255,0.9)",
        color: saved ? "#fff" : "#000",
        backdropFilter: "blur(6px)",
        transition: "background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease)",
      }}
    >
      <Heart filled={saved} />
    </button>
  );
}

/* ── Floating shortlist bar + drawer ── */
function ShortlistBar() {
  const { ids, count, remove } = useFavorites();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Apartment[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/apartments", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const map = new Map<string, Apartment>((d.apartments || []).map((a: Apartment) => [a.id, a]));
        setItems(ids.map((id) => map.get(id)).filter(Boolean) as Apartment[]);
      })
      .catch(() => {});
  }, [open, ids]);

  const total = items.reduce((s, a) => s + unitPrice(a), 0);

  if (count === 0) return null;

  return (
    <>
      {/* trigger pill (external trigger to return to saved) */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", right: 24, bottom: 24, zIndex: 70,
          display: "flex", alignItems: "center", gap: 10,
          padding: "13px 20px", borderRadius: 999, border: "none", cursor: "pointer",
          background: "var(--accent)", color: "#fff", fontSize: 14, fontFamily: "var(--font-inter), sans-serif",
          boxShadow: "0 12px 40px rgba(130,50,36,0.35)",
        }}
      >
        <span style={{ display: "inline-flex" }}><Heart filled /></span>
        Shortlist · {count}
      </button>

      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 80 }} />
          <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: 420, maxWidth: "94vw", background: "#fff", color: "#000", zIndex: 90, display: "flex", flexDirection: "column", fontFamily: "var(--font-inter), sans-serif", boxShadow: "-20px 0 60px rgba(0,0,0,0.14)" }}>
            <div style={{ padding: "22px 26px", borderBottom: "1px solid #e2e2e2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>Your shortlist</div>
              <button onClick={() => setOpen(false)} style={{ border: "none", background: "none", fontSize: 24, cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
              {items.length === 0 && (
                <div style={{ padding: 26, color: "#929292", fontSize: 14 }}>Loading…</div>
              )}
              {items.map((a) => (
                <div key={a.id} style={{ padding: "16px 26px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <Link href={`/apartment/${a.id}`} onClick={() => setOpen(false)} style={{ textDecoration: "none", color: "#000", flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{a.name}</div>
                    <div style={{ fontSize: 13, color: "#929292", marginTop: 3 }}>
                      {planTypeLabel(a.planType)} · {a.area} m² · {formatPrice(unitPrice(a))}
                    </div>
                  </Link>
                  <button onClick={() => remove(a.id)} aria-label="Remove" style={{ border: "1px solid #e2e2e2", background: "#fff", borderRadius: 6, width: 30, height: 30, cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>

            <div style={{ padding: "18px 26px", borderTop: "1px solid #e2e2e2" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 14 }}>
                <span style={{ color: "#929292" }}>{items.length} saved · total</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(total)}</span>
              </div>
              <a href="/#contact" onClick={() => setOpen(false)} style={{ display: "block", textAlign: "center", padding: "14px", background: "#000", color: "#fff", borderRadius: 6, textDecoration: "none", fontSize: 15, fontWeight: 500 }}>
                Enquire about these residences
              </a>
            </div>
          </div>
        </>
      )}
    </>
  );
}
