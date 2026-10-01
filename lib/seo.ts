/** Canonical site URL. Override via NEXT_PUBLIC_SITE_URL when a custom domain is set. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://duna-residence.vercel.app";
