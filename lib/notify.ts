import "server-only";
import { Resend } from "resend";
import type { Enquiry } from "./enquiries";

/**
 * Email a new-lead notification to the sales inbox.
 * Fire-and-forget and fully optional: if RESEND_API_KEY / NOTIFY_EMAIL are
 * not configured it silently does nothing (the lead is still stored).
 */
export async function notifyNewEnquiry(e: Enquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  // Without a verified custom domain, Resend's shared sender works for
  // notifications TO your own inbox.
  const from = process.env.NOTIFY_FROM || "Duna Residence <onboarding@resend.dev>";

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from,
      to,
      replyTo: e.email,
      subject: `New enquiry — ${e.name} (${e.interest})`,
      text: [
        `New enquiry from the Duna Residence website`,
        ``,
        `Name:     ${e.name}`,
        `Email:    ${e.email}`,
        `Phone:    ${e.phone || "—"}`,
        `Interest: ${e.interest}`,
        `Message:  ${e.message || "—"}`,
        ``,
        `Received: ${new Date(e.createdAt).toLocaleString()}`,
      ].join("\n"),
    });
  } catch {
    // never let a notification failure affect the submission
  }
}
