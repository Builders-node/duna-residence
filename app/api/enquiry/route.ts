import { NextResponse } from "next/server";
import { addEnquiry, listEnquiries } from "@/lib/enquiries";
import { isAuthorized } from "@/lib/admin-auth";
import { rateLimit, clientIp } from "@/lib/ratelimit";
import { notifyNewEnquiry } from "@/lib/notify";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    phone?: string;
    interest?: string;
    message?: string;
    company?: string; // honeypot — real users never fill this
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (body.company && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Rate limit: max 5 submissions per IP per 10 minutes.
  const allowed = await rateLimit("enquiry", clientIp(req), 5, 600);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
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

  // Fire-and-forget notification (no-op unless RESEND_API_KEY + NOTIFY_EMAIL set)
  await notifyNewEnquiry(entry);

  return NextResponse.json({ ok: true, id: entry.id });
}

export async function GET(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ enquiries: await listEnquiries() });
}
