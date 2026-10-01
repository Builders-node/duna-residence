import type { Metadata } from "next";
import { getSiteContent } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Terms of Use — Duna Residence" };

export default async function TermsPage() {
  const { settings } = await getSiteContent();
  const updated = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <main className="wrap" style={{ paddingTop: "160rem", paddingBottom: "120rem", maxWidth: "820rem" }}>
      <div className="eyebrow">Legal</div>
      <h1 className="fn-h2" style={{ marginTop: "16rem" }}>Terms of Use</h1>
      <p style={{ color: "var(--gray-3)", fontSize: "14rem", marginTop: "12rem" }}>Last updated: {updated}</p>

      <div style={{ marginTop: "48rem", display: "flex", flexDirection: "column", gap: "28rem", fontSize: "16rem", lineHeight: 1.6, color: "var(--gray-3)" }}>
        <Block title="Acceptance">
          By accessing the {settings.name} website you agree to these Terms of Use. If you do not
          agree, please do not use the site.
        </Block>

        <Block title="Illustrative content">
          Images, renderings, floor plans, areas, prices and availability shown on this site are for
          illustration and general information only. They do not constitute an offer, contract, or a
          guarantee of any specific feature, dimension or price. Final details are confirmed in
          writing as part of a purchase agreement.
        </Block>

        <Block title="Enquiries">
          Submitting the enquiry form does not reserve a home or create any obligation. Our team will
          contact you to discuss availability and terms.
        </Block>

        <Block title="Intellectual property">
          All content on this site — text, images, renderings and branding — belongs to {settings.name}
          or its licensors and may not be reproduced without permission.
        </Block>

        <Block title="Limitation of liability">
          The site is provided “as is”. To the fullest extent permitted by law, we are not liable for
          any loss arising from reliance on information presented here.
        </Block>

        <Block title="Contact">
          Questions about these terms? Reach us at{" "}
          {settings.email ? <a className="link" href={`mailto:${settings.email}`} style={{ color: "var(--black)" }}>{settings.email}</a> : "the contact details on our site"}.
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
