import "server-only";
import { randomUUID } from "crypto";
import { db } from "./supabase";

export interface Plan {
  id: string;
  apartmentId: string;
  label: string;
  area: number | null;
  roomsDesc: string;
  imagePath: string;
  url: string;
  sort: number;
}

type Row = {
  id: string;
  apartment_id: string;
  label: string;
  area: number | null;
  rooms_desc: string;
  image_path: string;
  sort: number;
};

const BUCKET = "plans";

export function planPublicUrl(imagePath: string): string {
  const base = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${BUCKET}/${imagePath}`;
}

function toPlan(r: Row): Plan {
  return {
    id: r.id,
    apartmentId: r.apartment_id,
    label: r.label,
    area: r.area,
    roomsDesc: r.rooms_desc,
    imagePath: r.image_path,
    url: planPublicUrl(r.image_path),
    sort: r.sort,
  };
}

/** All plans, grouped by apartment id, ordered by sort. */
export async function getPlansByApartment(): Promise<Record<string, Plan[]>> {
  const { data, error } = await db()
    .from("plans")
    .select("*")
    .order("apartment_id", { ascending: true })
    .order("sort", { ascending: true });
  if (error) throw new Error(error.message);
  const out: Record<string, Plan[]> = {};
  for (const r of (data as Row[]) ?? []) {
    (out[r.apartment_id] ??= []).push(toPlan(r));
  }
  return out;
}

export async function getPlansForApartment(apartmentId: string): Promise<Plan[]> {
  const { data, error } = await db()
    .from("plans")
    .select("*")
    .eq("apartment_id", apartmentId)
    .order("sort", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data as Row[]) ?? []).map(toPlan);
}

/** Upload an image to the plans bucket; returns the storage path. */
export async function uploadPlanImage(
  apartmentId: string,
  file: ArrayBuffer,
  contentType: string
): Promise<string> {
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const path = `${apartmentId}/${randomUUID()}.${ext}`;
  const { error } = await db().storage.from(BUCKET).upload(path, file, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(error.message);
  return path;
}

export async function createPlan(input: {
  apartmentId: string;
  label: string;
  area: number | null;
  roomsDesc: string;
  imagePath: string;
}): Promise<Plan> {
  const { data: maxRow } = await db()
    .from("plans")
    .select("sort")
    .eq("apartment_id", input.apartmentId)
    .order("sort", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sort = (maxRow?.sort ?? -1) + 1;
  const { data, error } = await db()
    .from("plans")
    .insert({
      apartment_id: input.apartmentId,
      label: input.label,
      area: input.area,
      rooms_desc: input.roomsDesc,
      image_path: input.imagePath,
      sort,
    })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return toPlan(data as Row);
}

export async function updatePlan(
  id: string,
  patch: { label?: string; area?: number | null; roomsDesc?: string }
): Promise<Plan | null> {
  const update: Record<string, unknown> = {};
  if (patch.label !== undefined) update.label = patch.label;
  if (patch.area !== undefined) update.area = patch.area;
  if (patch.roomsDesc !== undefined) update.rooms_desc = patch.roomsDesc;
  const { data, error } = await db()
    .from("plans")
    .update(update)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? toPlan(data as Row) : null;
}

export async function deletePlan(id: string): Promise<boolean> {
  // remove the row; also best-effort remove the stored file
  const { data: row } = await db().from("plans").select("image_path").eq("id", id).maybeSingle();
  const { data, error } = await db().from("plans").delete().eq("id", id).select("id");
  if (error) throw new Error(error.message);
  if (row?.image_path) {
    await db().storage.from(BUCKET).remove([row.image_path]).catch(() => {});
  }
  return Array.isArray(data) && data.length > 0;
}
