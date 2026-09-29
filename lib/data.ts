import { Apartment, PlanType } from "./types";

export const BUILDING = {
  name: "Duna Residence",
  tagline: "A private riverside residence",
  address: "Próspera · Roatán, Honduras",
};

/** Three home types. Choose a type — the price is simply per m². */
export const TYPES: Apartment[] = [
  {
    id: "studio",
    name: "Studio",
    planType: "studio",
    rooms: 0,
    area: 38.6,
    livingArea: 26.0,
    terrace: 4.8,
    ceiling: 3.1,
    orientation: "West",
    view: "Sunset side",
    pricePerM2: 2350,
    available: 8,
    blurb:
      "A compact, light-filled home with an open living space and a private terrace.",
  },
  {
    id: "residence",
    name: "Residence",
    planType: "two",
    rooms: 2,
    area: 78.4,
    livingArea: 44.2,
    terrace: 9.6,
    ceiling: 3.1,
    orientation: "South · East",
    view: "River & park",
    pricePerM2: 2600,
    available: 14,
    blurb:
      "Two bedrooms, an open great room and a generous terrace framing the water.",
  },
  {
    id: "penthouse",
    name: "Penthouse",
    planType: "penthouse",
    rooms: 4,
    area: 186.3,
    livingArea: 112.0,
    terrace: 48.0,
    ceiling: 3.8,
    orientation: "South · East · West",
    view: "Panoramic view",
    pricePerM2: 3400,
    available: 2,
    blurb:
      "The crowning residence — a great room, master suite and a wraparound terrace.",
  },
];

/** Back-compat alias used across the app. */
export const APARTMENTS = TYPES;

export function getApartment(id: string): Apartment | undefined {
  return TYPES.find((t) => t.id === id);
}

/** Total price = area × price-per-m². */
export const unitPrice = (a: Apartment) => Math.round(a.area * a.pricePerM2);

export const ROOM_LABEL: Record<number, string> = {
  0: "Studio",
  1: "1 bedroom",
  2: "2 bedrooms",
  3: "3 bedrooms",
  4: "4 bedrooms",
};

export function planTypeLabel(t: PlanType): string {
  switch (t) {
    case "studio":
      return "Studio";
    case "two":
      return "2-bedroom";
    case "penthouse":
      return "Penthouse";
  }
}

export const formatPrice = (v: number) => "€ " + v.toLocaleString("en-US");
export const formatRate = (v: number) =>
  "€ " + v.toLocaleString("en-US") + " / m²";
