import { NextResponse } from "next/server";
import { ADMIN_PASSWORD, issueToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (body.password === ADMIN_PASSWORD) {
    return NextResponse.json({ ok: true, token: await issueToken() });
  }
  return NextResponse.json({ ok: false }, { status: 401 });
}
