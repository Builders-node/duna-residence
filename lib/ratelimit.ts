import "server-only";
import { createHash } from "crypto";
import { db } from "./supabase";

/** Best-effort client IP from proxy headers. */
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

/**
 * Fixed-window rate limit backed by Postgres (serverless-safe).
 * Returns true if the request is allowed. Fails open on DB errors so a
 * limiter hiccup never blocks a genuine lead.
 */
export async function rateLimit(
  scope: string,
  ip: string,
  max: number,
  windowSeconds: number
): Promise<boolean> {
  const key = scope + ":" + createHash("sha256").update(ip).digest("hex").slice(0, 32);
  try {
    const { data, error } = await db().rpc("check_rate_limit", {
      p_key: key,
      p_max: max,
      p_window_seconds: windowSeconds,
    });
    if (error) return true; // fail open
    return data !== false;
  } catch {
    return true;
  }
}
