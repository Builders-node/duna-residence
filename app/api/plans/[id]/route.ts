import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { updatePlan, deletePlan } from "@/lib/plans";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: { label?: string; area?: number | null; roomsDesc?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const patch: { label?: string; area?: number | null; roomsDesc?: string } = {};
  if (typeof body.label === "string") patch.label = body.label.trim();
  if (typeof body.roomsDesc === "string") patch.roomsDesc = body.roomsDesc.trim();
  if (body.area === null) patch.area = null;
  else if (body.area !== undefined) {
    const n = Number(body.area);
    if (!Number.isFinite(n)) return NextResponse.json({ error: "Invalid area" }, { status: 400 });
    patch.area = n;
  }
  const updated = await updatePlan(id, patch);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ plan: updated });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const ok = await deletePlan(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
