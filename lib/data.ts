import { Apartment, PlanType } from "./types";

export const BUILDING = {
  name: "Duna Residence",
  tagline: "A private island residence on Roatán",
  address: "Próspera · Roatán, Honduras",
};

/** Home types at Duna Torre 2. Choose a type — the price is simply per m². */
export const TYPES: Apartment[] = [
  {
    id: "studio",
    name: "Studio",
    planType: "studio",
    rooms: 0,
    area: 38.6,
    livingArea: 28.0,
    terrace: 11.0,
    ceiling: 3.0,
    orientation: "Sea-facing",
    view: "Caribbean sunset",
    pricePerM2: 2400,
    available: 10,
    blurb:
      "A compact, light-filled studio with an open living space and a private sea-view balcony.",
  },
  {
    id: "two-bed",
    name: "2-Bedroom",
    planType: "two",
    rooms: 2,
    area: 57.6,
    livingArea: 40.0,
    terrace: 17.0,
    ceiling: 3.0,
    orientation: "Sea-facing",
    view: "Sea & reef",
    pricePerM2: 2600,
    available: 12,
    blurb:
      "Two bedrooms, two baths and an open living–dining–kitchen opening to a sea-view balcony. Corner and centre layouts available.",
  },
  {
    id: "three-bed",
    name: "3-Bedroom",
    planType: "three",
    rooms: 3,
    area: 76.6,
    livingArea: 52.0,
    terrace: 20.0,
    ceiling: 3.0,
    orientation: "Corner · sea",
    view: "Panoramic Caribbean",
    pricePerM2: 3100,
    available: 6,
    blurb:
      "Three bedrooms including a master with walk-in closet, an open great room and a wide balcony over the Caribbean. Corner and centre layouts.",
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
    case "three":
      return "3-bedroom";
  }
}

export const formatPrice = (v: number) => "€ " + v.toLocaleString("en-US");
export const formatRate = (v: number) =>
  "€ " + v.toLocaleString("en-US") + " / m²";
