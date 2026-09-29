import "server-only";
import { Apartment } from "./types";
import { TYPES } from "./data";
import { db } from "./supabase";

/** Fields the admin may edit. */
export const EDITABLE_FIELDS = [
  "name",
  "rooms",
  "area",
  "livingArea",
  "terrace",
  "ceiling",
  "orientation",
  "view",
  "pricePerM2",
  "available",
  "blurb",
] as const;

export type ApartmentPatch = Partial<Pick<Apartment, (typeof EDITABLE_FIELDS)[number]>>;

/** Validation rules for the numeric fields. Out-of-range values are clamped;
 *  non-numeric / non-finite values are rejected. */
const NUMERIC_RULES: Record<
  string,
  { min: number; max: number; integer: boolean }
> = {
  pricePerM2: { min: 0, max: 1_000_000, integer: true },
  available: { min: 0, max: 100_000, integer: true },
  rooms: { min: 0, max: 4, integer: true },
  area: { min: 0.1, max: 100_000, integer: false },
  livingArea: { min: 0, max: 100_000, integer: false },
  terrace: { min: 0, max: 100_000, integer: false },
  ceiling: { min: 0.1, max: 100, integer: false },
};

const STRING_MAX: Record<string, number> = {
  name: 60,
  orientation: 60,
  view: 60,
  blurb: 400,
};

export function validatePatch(
  patch: unknown
): { clean: ApartmentPatch } | { error: string } {
  if (typeof patch !== "object" || patch === null) {
    return { error: "Invalid payload" };
  }
  const p = patch as Record<string, unknown>;
  const clean: ApartmentPatch = {};
  const invalid: string[] = [];

  for (const key of EDITABLE_FIELDS) {
    if (!(key in p) || p[key] === undefined) continue;
    const raw = p[key];

    if (key in NUMERIC_RULES) {
      const rule = NUMERIC_RULES[key];
      const n = typeof raw === "number" ? raw : Number(raw);
      if (raw === "" || raw === null || typeof raw === "boolean" || !Number.isFinite(n)) {
        invalid.push(key);
        continue;
      }
      let v = rule.integer ? Math.round(n) : Math.round(n * 10) / 10;
      v = Math.min(rule.max, Math.max(rule.min, v));
      // @ts-expect-error union index assignment is safe across the picked keys
      clean[key] = v;
    } else {
      const max = STRING_MAX[key];
      if (typeof raw !== "string") {
        invalid.push(key);
        continue;
      }
      const s = raw.trim();
      if (s.length === 0 || s.length > max) {
        invalid.push(key);
        continue;
      }
      // @ts-expect-error union index assignment is safe across the picked keys
      clean[key] = s;
    }
  }

  if (invalid.length) {
    return { error: `Invalid value for: ${invalid.join(", ")}` };
  }
  return { clean };
}

// ── row mapping ──────────────────────────────────────────────────────
type Row = {
  id: string; name: string; plan_type: string; rooms: number; area: number;
  living_area: number; terrace: number; ceiling: number; orientation: string;
  view: string; price_per_m2: number; available: number; blurb: string; sort: number;
};

function toApartment(r: Row): Apartment {
  return {
    id: r.id, name: r.name, planType: r.plan_type as Apartment["planType"],
    rooms: r.rooms, area: r.area, livingArea: r.living_area, terrace: r.terrace,
    ceiling: r.ceiling, orientation: r.orientation, view: r.view,
    pricePerM2: r.price_per_m2, available: r.available, blurb: r.blurb,
  };
}

const CAMEL_TO_SNAKE: Record<string, string> = {
  name: "name", rooms: "rooms", area: "area", livingArea: "living_area",
  terrace: "terrace", ceiling: "ceiling", orientation: "orientation",
  view: "view", pricePerM2: "price_per_m2", available: "available", blurb: "blurb",
};

function seedRows() {
  return TYPES.map((t, i) => ({
    id: t.id, name: t.name, plan_type: t.planType, rooms: t.rooms, area: t.area,
    living_area: t.livingArea, terrace: t.terrace, ceiling: t.ceiling,
    orientation: t.orientation, view: t.view, price_per_m2: t.pricePerM2,
    available: t.available, blurb: t.blurb, sort: i,
  }));
}

export async function getStoredApartments(): Promise<Apartment[]> {
  const { data, error } = await db()
    .from("apartments")
    .select("*")
    .order("sort", { ascending: true });
  if (error) throw new Error(error.message);
  if (!data || data.length === 0) {
    // seed on first use
    await db().from("apartments").upsert(seedRows());
    return TYPES.map((t) => ({ ...t }));
  }
  return (data as Row[]).map(toApartment);
}

export async function updateStoredApartment(
  id: string,
  patch: ApartmentPatch
): Promise<Apartment | null> {
  const update: Record<string, unknown> = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in patch && patch[key] !== undefined) {
      update[CAMEL_TO_SNAKE[key]] = patch[key];
    }
  }
  if (Object.keys(update).length === 0) {
    const { data } = await db().from("apartments").select("*").eq("id", id).maybeSingle();
    return data ? toApartment(data as Row) : null;
  }
  const { data, error } = await db()
    .from("apartments")
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toApartment(data as Row) : null;
}

export async function resetStore(): Promise<Apartment[]> {
  const { error } = await db().from("apartments").upsert(seedRows());
  if (error) throw new Error(error.message);
  return TYPES.map((t) => ({ ...t }));
}
