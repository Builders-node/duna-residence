import { NextResponse } from "next/server";
import { getStoredApartments } from "@/lib/store";
import { getPlansByApartment } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function GET() {
  const [apartments, plansByApt] = await Promise.all([
    getStoredApartments(),
    getPlansByApartment(),
  ]);
  const withPlans = apartments.map((a) => ({ ...a, plans: plansByApt[a.id] ?? [] }));
  return NextResponse.json({ apartments: withPlans });
}
