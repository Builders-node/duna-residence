import "server-only";
import { randomUUID } from "crypto";
import { db } from "./supabase";

/** Shared secret used only to sign in (never sent back to the client). */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "duna-admin";

/** Session lifetime. */
const TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

/** Issue a fresh opaque session token, persisted in the DB. */
export async function issueToken(): Promise<string> {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + TTL_MS).toISOString();
  await db().from("admin_sessions").insert({ token, expires_at: expiresAt });
  // opportunistic cleanup of expired sessions
  await db().from("admin_sessions").delete().lt("expires_at", new Date().toISOString());
  return token;
}

/** Authorise a request by its opaque session token. */
export async function isAuthorized(req: Request): Promise<boolean> {
  const token = req.headers.get("x-admin-token") || "";
  if (!token) return false;
  const { data, error } = await db()
    .from("admin_sessions")
    .select("expires_at")
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return false;
  if (new Date(data.expires_at).getTime() < Date.now()) {
    await db().from("admin_sessions").delete().eq("token", token);
    return false;
  }
  return true;
}
