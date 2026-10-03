export type PlanType = "studio" | "two" | "three";

/** A home TYPE you choose (not a per-floor unit). Price is per m². */
export interface Apartment {
  id: string; // slug
  name: string; // "Studio", "Residence", "Penthouse"
  planType: PlanType;
  rooms: number; // 0 = studio
  area: number; // m²
  livingArea: number; // m²
  terrace: number; // m²
  ceiling: number; // m
  orientation: string;
  view: string;
  pricePerM2: number; // EUR per m²
  available: number; // homes of this type remaining
  blurb: string; // short description
}
