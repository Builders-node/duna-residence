import Link from "next/link";
import type { SiteSettings } from "@/lib/site";

const telHref = (phone: string) => "tel:" + phone.replace(/[^0-9+]/g, "");

export default function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-black text-white">
      <div className="wrap" style={{ paddingTop: "120rem", paddingBottom: "48rem" }}>
        <div className="fn-h3" style={{ maxWidth: "16ch" }}>
          Book a private viewing
        </div>

        <div
          className="grid lg:grid-cols-[1.4fr_1fr_1fr] mt-16"
          style={{ gap: "48rem", marginTop: "96rem" }}
        >
          <div>
            <div className="eyebrow" style={{ color: "#929292" }}>
              {settings.name}
            </div>
            <p style={{ marginTop: "20rem", maxWidth: "34ch", color: "#cfcfcf", fontSize: "16rem" }}>
              {settings.description}
            </p>
          </div>

          <div>
            <div className="eyebrow" style={{ color: "#929292" }}>Navigation</div>
            <ul style={{ marginTop: "20rem", display: "flex", flexDirection: "column", gap: "12rem" }}>
              <li><Link href="/#explorer" className="link">Find a home</Link></li>
              <li><Link href="/apartments" className="link">All residences</Link></li>
              <li><Link href="/#residence" className="link">About the residence</Link></li>
            </ul>
          </div>

          <div>
            <div className="eyebrow" style={{ color: "#929292" }}>Sales</div>
            <ul style={{ marginTop: "20rem", display: "flex", flexDirection: "column", gap: "12rem", fontSize: "16rem" }}>
              {settings.phone && <li><a href={telHref(settings.phone)} className="link">{settings.phone}</a></li>}
              {settings.email && <li><a href={`mailto:${settings.email}`} className="link">{settings.email}</a></li>}
              <li style={{ color: "#929292" }}>{settings.address}</li>
              {settings.hours && <li style={{ color: "#929292" }}>{settings.hours}</li>}
            </ul>
          </div>
        </div>

        <div
          className="flex flex-col sm:flex-row justify-between"
          style={{ marginTop: "96rem", paddingTop: "24rem", borderTop: "1px solid rgba(255,255,255,0.16)", gap: "12rem", fontSize: "13rem", color: "#929292" }}
        >
          <span>© {year} {settings.name}</span>
          <span>Images and floor plans are for illustration only</span>
        </div>
      </div>
    </footer>
  );
}
