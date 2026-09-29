import { NextResponse } from "next/server";
import { getStoredApartments } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const apartments = await getStoredApartments();
  return NextResponse.json({ apartments });
}
