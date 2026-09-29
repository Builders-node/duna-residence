import { NextResponse } from "next/server";
import { resetStore } from "@/lib/store";
import { resetSiteContent } from "@/lib/site";
import { isAuthorized } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const apartments = await resetStore();
  const content = await resetSiteContent();
  return NextResponse.json({ apartments, content });
}
