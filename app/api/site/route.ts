import { NextResponse } from "next/server";
import { getSiteContent, updateSiteContent } from "@/lib/site";
import { isAuthorized } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ content: await getSiteContent() });
}

export async function PATCH(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { settings?: unknown; testimonials?: unknown; features?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const result = await updateSiteContent(body);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ content: result.content });
}
