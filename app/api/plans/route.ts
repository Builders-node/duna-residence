import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin-auth";
import { createPlan, uploadPlanImage } from "@/lib/plans";

export const dynamic = "force-dynamic";

// Create a plan: multipart form-data with { apartmentId, label, area, roomsDesc, file }
export async function POST(req: Request) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const apartmentId = String(form.get("apartmentId") || "").trim();
  const label = String(form.get("label") || "").trim();
  const roomsDesc = String(form.get("roomsDesc") || "").trim();
  const areaRaw = form.get("area");
  const area = areaRaw === null || areaRaw === "" ? null : Number(areaRaw);
  const file = form.get("file");

  if (!apartmentId || !label) {
    return NextResponse.json({ error: "apartmentId and label are required" }, { status: 400 });
  }
  if (area !== null && !Number.isFinite(area)) {
    return NextResponse.json({ error: "Invalid area" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A plan image file is required" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be 8 MB or smaller" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const imagePath = await uploadPlanImage(apartmentId, bytes, file.type);
  const plan = await createPlan({ apartmentId, label, area, roomsDesc, imagePath });
  return NextResponse.json({ plan });
}
