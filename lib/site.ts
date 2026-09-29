import "server-only";
import { db } from "./supabase";

export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapLat: number;
  mapLng: number;
  mapZoom: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
}

export interface Feature {
  id: string;
  title: string;
  text: string;
}

export interface SiteContent {
  settings: SiteSettings;
  testimonials: Testimonial[];
  features: Feature[];
}

/** Defaults — used to seed/reset. */
const DEFAULTS: SiteContent = {
  settings: {
    name: "Duna Residence",
    tagline: "A private riverside residence",
    description:
      "A private riverside residence of premium homes. Panoramic terraces, ceilings 3.1–3.8 m, 24/7 lobby service.",
    address: "Próspera · Roatán, Honduras",
    phone: "+504 9000-0000",
    email: "sales@dunaresidence.com",
    hours: "Daily 09:00 — 20:00",
    mapLat: 16.3789,
    mapLng: -86.4423,
    mapZoom: 13,
  },
  testimonials: [
    { id: "t1", quote: "The calmest home we have ever walked into.", author: "Residents", role: "Penthouse" },
    { id: "t2", quote: "Buying off-plan felt effortless — every detail delivered exactly as promised.", author: "Homeowner", role: "Residence" },
    { id: "t3", quote: "The lobby alone sold us. It feels like arriving at a private hotel every day.", author: "Residents", role: "Studio" },
  ],
  features: [
    { id: "f1", title: "Panoramic terraces", text: "Private terraces up to 48 m² overlooking the river and park." },
    { id: "f2", title: "Ceilings 3.1–3.8 m", text: "Floor-to-ceiling glazing and generous ceiling heights on every floor." },
    { id: "f3", title: "Lobby service", text: "24/7 concierge, private entrance, lounge area and in-residence delivery." },
    { id: "f4", title: "Smart home", text: "Lighting, climate and access — all controlled from your smartphone." },
  ],
};

// ── row mapping ──
type SettingsRow = {
  name: string; tagline: string; description: string; address: string;
  phone: string; email: string; hours: string;
  map_lat: number; map_lng: number; map_zoom: number;
};
function toSettings(r: SettingsRow): SiteSettings {
  return {
    name: r.name, tagline: r.tagline, description: r.description, address: r.address,
    phone: r.phone, email: r.email, hours: r.hours,
    mapLat: r.map_lat, mapLng: r.map_lng, mapZoom: r.map_zoom,
  };
}
function settingsToRow(s: SiteSettings): SettingsRow & { id: number } {
  return {
    id: 1, name: s.name, tagline: s.tagline, description: s.description, address: s.address,
    phone: s.phone, email: s.email, hours: s.hours,
    map_lat: s.mapLat, map_lng: s.mapLng, map_zoom: s.mapZoom,
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  const [sRes, tRes, fRes] = await Promise.all([
    db().from("site_settings").select("*").eq("id", 1).maybeSingle(),
    db().from("testimonials").select("id,quote,author,role").order("sort", { ascending: true }),
    db().from("features").select("id,title,text").order("sort", { ascending: true }),
  ]);

  let settings: SiteSettings;
  if (sRes.data) {
    settings = toSettings(sRes.data as SettingsRow);
  } else {
    await db().from("site_settings").upsert(settingsToRow(DEFAULTS.settings));
    settings = DEFAULTS.settings;
  }

  const testimonials = (tRes.data as Testimonial[] | null) ?? [];
  const features = (fRes.data as Feature[] | null) ?? [];

  return {
    settings,
    testimonials: testimonials.length ? testimonials : DEFAULTS.testimonials,
    features: features.length ? features : DEFAULTS.features,
  };
}

// ── validation ──
const str = (v: unknown, max: number): string | null => {
  if (typeof v !== "string") return null;
  const s = v.trim();
  return s.length > max ? s.slice(0, max) : s;
};
const num = (v: unknown, min: number, max: number, integer = false): number | null => {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n)) return null;
  let x = integer ? Math.round(n) : n;
  x = Math.min(max, Math.max(min, x));
  return x;
};

const SETTINGS_LIMITS: Record<keyof SiteSettings, number> = {
  name: 60, tagline: 100, description: 400, address: 120,
  phone: 40, email: 120, hours: 60, mapLat: 0, mapLng: 0, mapZoom: 0,
};

function cleanSettings(patch: unknown, current: SiteSettings): { settings: SiteSettings } | { error: string } {
  if (typeof patch !== "object" || patch === null) return { error: "Invalid settings" };
  const p = patch as Record<string, unknown>;
  const next = { ...current };
  const invalid: string[] = [];
  for (const key of Object.keys(SETTINGS_LIMITS) as (keyof SiteSettings)[]) {
    if (!(key in p) || p[key] === undefined) continue;
    if (key === "mapLat") { const v = num(p[key], -90, 90); v === null ? invalid.push(key) : (next.mapLat = v); }
    else if (key === "mapLng") { const v = num(p[key], -180, 180); v === null ? invalid.push(key) : (next.mapLng = v); }
    else if (key === "mapZoom") { const v = num(p[key], 1, 20, true); v === null ? invalid.push(key) : (next.mapZoom = v); }
    else {
      const v = str(p[key], SETTINGS_LIMITS[key]);
      if (v === null || ((key === "name" || key === "address") && v.length === 0)) invalid.push(key);
      else (next[key] as string) = v;
    }
  }
  if (invalid.length) return { error: `Invalid value for: ${invalid.join(", ")}` };
  return { settings: next };
}

function cleanTestimonials(list: unknown): { testimonials: Testimonial[] } | { error: string } {
  if (!Array.isArray(list)) return { error: "Invalid testimonials" };
  if (list.length > 12) return { error: "Too many testimonials (max 12)" };
  const out: Testimonial[] = [];
  for (const raw of list) {
    if (typeof raw !== "object" || raw === null) return { error: "Invalid testimonial entry" };
    const r = raw as Record<string, unknown>;
    const quote = str(r.quote, 300);
    if (!quote) return { error: "Testimonial quote is required" };
    out.push({ id: typeof r.id === "string" && r.id ? r.id : "", quote, author: str(r.author, 60) || "", role: str(r.role, 60) || "" });
  }
  return { testimonials: out };
}

function cleanFeatures(list: unknown): { features: Feature[] } | { error: string } {
  if (!Array.isArray(list)) return { error: "Invalid features" };
  if (list.length > 12) return { error: "Too many features (max 12)" };
  const out: Feature[] = [];
  for (const raw of list) {
    if (typeof raw !== "object" || raw === null) return { error: "Invalid feature entry" };
    const r = raw as Record<string, unknown>;
    const title = str(r.title, 60);
    if (!title) return { error: "Feature title is required" };
    out.push({ id: typeof r.id === "string" && r.id ? r.id : "", title, text: str(r.text, 300) || "" });
  }
  return { features: out };
}

async function replaceTestimonials(list: Testimonial[]) {
  await db().from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (list.length) {
    await db().from("testimonials").insert(
      list.map((t, i) => ({ quote: t.quote, author: t.author, role: t.role, sort: i }))
    );
  }
}
async function replaceFeatures(list: Feature[]) {
  await db().from("features").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (list.length) {
    await db().from("features").insert(
      list.map((f, i) => ({ title: f.title, text: f.text, sort: i }))
    );
  }
}

export async function updateSiteContent(body: {
  settings?: unknown;
  testimonials?: unknown;
  features?: unknown;
}): Promise<{ content: SiteContent } | { error: string }> {
  const current = await getSiteContent();

  if (body.settings !== undefined) {
    const r = cleanSettings(body.settings, current.settings);
    if ("error" in r) return { error: r.error };
    const { error } = await db().from("site_settings").upsert(settingsToRow(r.settings));
    if (error) return { error: error.message };
  }
  if (body.testimonials !== undefined) {
    const r = cleanTestimonials(body.testimonials);
    if ("error" in r) return { error: r.error };
    await replaceTestimonials(r.testimonials);
  }
  if (body.features !== undefined) {
    const r = cleanFeatures(body.features);
    if ("error" in r) return { error: r.error };
    await replaceFeatures(r.features);
  }

  return { content: await getSiteContent() };
}

export async function resetSiteContent(): Promise<SiteContent> {
  await db().from("site_settings").upsert(settingsToRow(DEFAULTS.settings));
  await replaceTestimonials(DEFAULTS.testimonials);
  await replaceFeatures(DEFAULTS.features);
  return getSiteContent();
}
