import { NextResponse } from "next/server";
import { addEnquiry, listEnquiries } from "@/lib/enquiries";
import { isAuthorized } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    interest?: string;
    message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Name and a valid email are required." }, { status: 422 });
  }

  const entry = await addEnquiry({
    name,
    email,
    phone: (body.phone || "").trim() || undefined,
    interest: (body.interest || "Undecided").trim(),
    message: (body.message || "").trim() || undefined,
  });

  return NextResponse.json({ ok: true, id: entry.id });
}

export async function GET(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ enquiries: await listEnquiries() });
}
