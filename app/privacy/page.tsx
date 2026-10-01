import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Privacy Policy — Duna Residence" };

export default async function PrivacyPage() {
  const { settings } = await getSiteContent();
  const updated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <main className="wrap" style={{ paddingTop: "160rem", paddingBottom: "120rem", maxWidth: "820rem" }}>
      <div className="eyebrow">Legal</div>
      <h1 className="fn-h2" style={{ marginTop: "16rem" }}>Privacy Policy</h1>
      <p style={{ color: "var(--gray-3)", fontSize: "14rem", marginTop: "12rem" }}>Last updated: {updated}</p>

      <div style={{ marginTop: "48rem", display: "flex", flexDirection: "column", gap: "28rem", fontSize: "16rem", lineHeight: 1.6, color: "var(--gray-3)" }}>
        <section>
          <p>
            This Privacy Policy explains how {settings.name} (“we”, “us”) collects and uses your
            personal information when you use our website and contact us. We are located at{" "}
            {settings.address}.
          </p>
        </section>

        <Block title="Information we collect">
          When you submit the enquiry form we collect the details you provide: your name, email
          address, and optionally your phone number, the home type you are interested in, and your
          message. We also collect basic, non-identifying technical data (such as pages viewed)
          through privacy-friendly, cookieless analytics.
        </Block>

        <Block title="How we use it">
          We use your information solely to respond to your enquiry, to share availability, floor
          plans and terms, and to contact you about {settings.name}. We do not sell your personal
          data or share it with third parties for their own marketing.
        </Block>

        <Block title="Where it is stored">
          Enquiries are stored securely with our hosting and database providers (Vercel and
          Supabase). Access is restricted to our authorised team.
        </Block>

        <Block title="Cookies & local storage">
          The site uses minimal first-party browser storage to remember your shortlist and
          preferences. Our analytics are cookieless. An embedded map (OpenStreetMap) may load from a
          third party when you view the location section.
        </Block>

        <Block title="Your rights">
          You may request access to, correction of, or deletion of your personal data at any time.
          To make a request, email{" "}
          {settings.email ? <a className="link" href={`mailto:${settings.email}`} style={{ color: "var(--black)" }}>{settings.email}</a> : "our sales team"}.
        </Block>

        <Block title="Contact">
          Questions about this policy? Reach us at{" "}
          {settings.email ? <a className="link" href={`mailto:${settings.email}`} style={{ color: "var(--black)" }}>{settings.email}</a> : "the contact details on our site"}
          {settings.phone ? ` or ${settings.phone}` : ""}.
        </Block>
      </div>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="serif" style={{ fontSize: "26rem", color: "var(--black)", marginBottom: "12rem" }}>{title}</h2>
      <p>{children}</p>
    </section>
  );
}
