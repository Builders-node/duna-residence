import Image from "next/image";
import Link from "next/link";
import TypeCards from "@/components/TypeCards";
import HeroVideo from "@/components/HeroVideo";
import RevealLines from "@/components/RevealLines";
import Reveal from "@/components/Reveal";
import LocationMap from "@/components/LocationMap";
import ContactForm from "@/components/ContactForm";
import { ROOM_LABEL } from "@/lib/data";
import { getStoredApartments } from "@/lib/store";
import { getSiteContent } from "@/lib/site";
import { getPlansByApartment } from "@/lib/plans";

export const dynamic = "force-dynamic";

const GALLERY = [
  { src: "/images/living.png", cap: "Panoramic living rooms", sub: "Sea view" },
  { src: "/images/terrace.png", cap: "Private terraces", sub: "Up to 48 m²" },
  { src: "/images/lobby.png", cap: "Lobby service", sub: "24 / 7" },
];

export default async function Home() {
  const types = await getStoredApartments();
  const { settings, testimonials, features } = await getSiteContent();
  const plansByApt = await getPlansByApartment();
  const AVAILABLE = types.reduce((s, t) => s + t.available, 0);
  const areas = types.map((t) => t.area);
  const STATS: [string, string][] = [
    [String(types.length), "home types"],
    [`${Math.min(...areas)}–${Math.max(...areas)} m²`, "home sizes"],
    [`${Math.max(...types.map((t) => t.ceiling))} m`, "ceilings"],
    [`${Math.max(...types.map((t) => t.terrace))} m²`, "terraces"],
  ];

  return (
    <main>
      {/* ── HERO · background video, fixed text ── */}
      <HeroVideo
        src="/videos/duna-reveal-scrub.mp4"
        poster="/images/tower-exterior.png"
        eyebrow="Private residence · Próspera, Roatán"
        title="Your home above the Caribbean reef"
        actions={
          <>
            <Link href="#layouts" className="btn-hero btn-hero--ghost">
              Floor plans
            </Link>
            <Link href="#types" className="btn-hero btn-hero--solid">
              Find a home
            </Link>
          </>
        }
      />

      {/* ── STAT BAND ── */}
      <section className="wrap" style={{ paddingTop: "56rem", paddingBottom: "56rem", borderBottom: "1px solid var(--gray-e2)" }}>
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: "32rem" }}>
          {STATS.map(([v, l]) => (
            <div key={l}>
              <div className="fn-h4">{v}</div>
              <div className="eyebrow" style={{ marginTop: "10rem" }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CHOOSE A TYPE ── */}
      <section id="types" className="scroll-mt-28" style={{ paddingTop: "140rem", paddingBottom: "140rem" }}>
        <div className="wrap" style={{ marginBottom: "64rem" }}>
          <div className="eyebrow">Choose your home</div>
          <RevealLines as="h2" className="fn-h2" lines={["Three home types.", "One simple price — per m²."]} />
        </div>
        <TypeCards />
      </section>

      {/* ── LAYOUTS ── */}
      <section id="layouts" className="wrap scroll-mt-28" style={{ paddingTop: "20rem", paddingBottom: "140rem" }}>
        <div className="grid lg:grid-cols-2 items-end" style={{ gap: "40rem", marginBottom: "64rem" }}>
          <div>
            <div className="eyebrow">Layouts</div>
            <RevealLines as="h2" className="fn-h2" lines={["A plan for every", "way of living."]} />
          </div>
          <p style={{ color: "var(--gray-3)", fontSize: "16rem", lineHeight: 1.45, maxWidth: "42ch" }}>
            Real floor plans for every home type — corner and centre layouts.
            Explore them and pick the one that fits how you live.
          </p>
        </div>

        <div className="grid md:grid-cols-2" style={{ gap: "24rem" }}>
          {types.map((t, i) => {
            const plans = plansByApt[t.id] ?? [];
            const cover = plans[0]?.url;
            return (
            <Link key={t.id} href={`/apartment/${t.id}#plan`} className="group block">
              <div
                style={{
                  position: "relative",
                  border: "1px solid var(--gray-e2)", borderRadius: "6rem", padding: "28rem",
                  aspectRatio: "16 / 10", display: "grid", placeItems: "center", overflow: "hidden",
                  background: "#fff", transition: "border-color var(--dur-fast) var(--ease)",
                }}
              >
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cover} alt={`${t.name} floor plan`} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                ) : (
                  <span style={{ color: "var(--gray-3)", fontSize: "14rem" }}>Plan coming soon</span>
                )}
                <span
                  className="group-hover:opacity-100"
                  style={{
                    position: "absolute", bottom: "16rem", right: "16rem", opacity: 0,
                    fontSize: "12rem", color: "#fff", background: "var(--accent)",
                    padding: "7rem 12rem", borderRadius: "5rem",
                    transition: "opacity var(--dur-fast) var(--ease)",
                  }}
                >
                  View {plans.length || ""} {plans.length === 1 ? "layout" : "layouts"}
                </span>
              </div>
              <div className="flex items-baseline justify-between" style={{ marginTop: "16rem" }}>
                <div>
                  <div className="serif" style={{ fontSize: "22rem" }}>{t.name}</div>
                  <div style={{ fontSize: "13rem", color: "var(--gray-3)", marginTop: "4rem" }}>
                    {ROOM_LABEL[t.rooms]} · from {t.area} m²
                  </div>
                </div>
                <span className="eyebrow">0{i + 1}</span>
              </div>
            </Link>
            );
          })}
        </div>
      </section>

      {/* ── EDITORIAL GALLERY (work-grid style) ── */}
      <section id="residence" style={{ paddingTop: "40rem", paddingBottom: "120rem" }}>
        <div className="wrap">
          <div className="grid lg:grid-cols-2 items-end" style={{ gap: "40rem", marginBottom: "72rem" }}>
            <RevealLines as="h2" className="fn-h2" lines={["Architecture", "made for living"]} />
            <Reveal as="p">
              <span style={{ color: "var(--gray-3)", fontSize: "18rem", maxWidth: "40ch", display: "block" }}>
                Duna Residence is designed for those who value privacy, light and views.
                Every detail — from the lobby to the fixtures — is chosen to the
                standards of premium island living.
              </span>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-3" style={{ gap: "24rem" }}>
            {GALLERY.map((g) => (
              <Link key={g.src} href="/apartments" className="work-item group block">
                <div className="media" style={{ aspectRatio: "3/4" }}>
                  <Image
                    src={g.src}
                    alt={g.cap}
                    width={900}
                    height={1200}
                    className="w-full h-full object-cover group-hover:scale-[1.025]"
                    style={{ transition: "transform var(--dur-hover) var(--ease-hover)" }}
                  />
                </div>
                <div className="flex items-baseline justify-between" style={{ marginTop: "16rem" }}>
                  <span className="serif" style={{ fontSize: "26rem" }}>{g.cap}</span>
                  <span className="eyebrow">{g.sub}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="wrap" style={{ paddingBottom: "40rem" }}>
        <div className="rule" style={{ marginBottom: "0" }} />
        {features.map((f, i) => (
          <Reveal
            key={f.id}
            className="grid md:grid-cols-[80rem_1fr_1.4fr] items-start"
            style={{ gap: "24rem", padding: "40rem 0", borderBottom: "1px solid var(--gray-e2)" }}
          >
            <div className="serif" style={{ fontSize: "26rem", color: "var(--gray-3)" }}>
              {String(i + 1).padStart(2, "0")}
            </div>
            <h3 className="serif" style={{ fontSize: "40rem", lineHeight: 0.95 }}>{f.title}</h3>
            <p style={{ color: "var(--gray-3)", fontSize: "17rem", maxWidth: "44ch" }}>{f.text}</p>
          </Reveal>
        ))}
      </section>

      {/* ── TESTIMONIALS · accent ── */}
      <section style={{ background: "var(--accent)", color: "#f4efe9" }}>
        <div className="wrap" style={{ paddingTop: "130rem", paddingBottom: "130rem" }}>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between" style={{ gap: "24rem", marginBottom: "80rem" }}>
            <div>
              <div className="eyebrow" style={{ color: "rgba(244,239,233,0.65)" }}>Testimonials</div>
              <RevealLines as="h2" className="fn-h2" lines={["Loved from the", "very first visit."]} style={{ marginTop: "20rem", color: "#fff" }} />
            </div>
            <p style={{ color: "rgba(244,239,233,0.72)", fontSize: "16rem", lineHeight: 1.5, maxWidth: "34ch" }}>
              A few words from the people who now call {settings.name} home.
            </p>
          </div>

          <div className="grid md:grid-cols-3" style={{ gap: "48rem" }}>
            {testimonials.map((t) => (
              <Reveal key={t.id}>
                <figure style={{ borderTop: "1px solid rgba(255,255,255,0.22)", paddingTop: "28rem" }}>
                  <div className="serif" style={{ fontSize: "22rem", color: "rgba(255,255,255,0.55)", lineHeight: 1 }}>“</div>
                  <blockquote className="serif" style={{ fontSize: "26rem", lineHeight: 1.25, letterSpacing: "-0.01em", marginTop: "8rem", color: "#fff" }}>
                    {t.quote}
                  </blockquote>
                  <figcaption style={{ marginTop: "24rem", fontSize: "14rem", color: "rgba(244,239,233,0.65)" }}>
                    <span style={{ color: "#fff" }}>{t.author}</span>{t.role ? ` · ${t.role}` : ""}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION MAP ── */}
      <section style={{ marginTop: "80rem" }}>
        <div className="wrap" style={{ marginBottom: "48rem" }}>
          <div className="eyebrow">Where you are</div>
          <RevealLines as="h2" className="fn-h2" lines={["On the Caribbean coast", "of Roatán."]} />
        </div>
        <LocationMap settings={settings} />
      </section>

      {/* ── DESIRE + ACTION · accent closing block ── */}
      <section
        style={{ background: "var(--accent)", color: "#f4efe9" }}
      >
        <div className="wrap" style={{ paddingTop: "130rem", paddingBottom: "120rem" }}>
          <div className="eyebrow" style={{ color: "rgba(244,239,233,0.65)" }}>Availability</div>
          <RevealLines
            as="h2"
            className="fn-h2"
            lines={[`Only ${AVAILABLE} residences`, "are still available."]}
            style={{ marginTop: "20rem", color: "#fff", maxWidth: "16ch" }}
          />

          {/* trust points */}
          <div className="grid md:grid-cols-3" style={{ gap: "40rem", marginTop: "88rem" }}>
            {[
              ["01", "Delivered", "16 finished floors, ready to walk and to move into."],
              ["02", "Reassured", "Fixed-price contracts, escrow payments and a 10-year structural warranty."],
              ["03", "Cared for", "A resident app, 24/7 concierge and on-site management from day one."],
            ].map(([n, t, d]) => (
              <Reveal key={n}>
                <div className="serif" style={{ fontSize: "26rem", color: "rgba(244,239,233,0.55)" }}>{n}</div>
                <h3 className="serif" style={{ fontSize: "28rem", marginTop: "12rem", color: "#fff" }}>{t}</h3>
                <p style={{ color: "rgba(244,239,233,0.72)", fontSize: "16rem", lineHeight: 1.5, marginTop: "12rem" }}>{d}</p>
              </Reveal>
            ))}
          </div>

          {/* CTA image cards */}
          <div className="grid md:grid-cols-2" style={{ gap: "20rem", marginTop: "88rem" }}>
            {[
              { href: "#contact", img: "/images/terrace.png", title: "Book a private viewing", label: "Get in touch" },
              { href: "/apartments", img: "/images/tower-exterior.png", title: "Explore the residences", label: "View all homes" },
            ].map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="group block relative overflow-hidden"
                style={{ aspectRatio: "16 / 11", borderRadius: "10rem" }}
              >
                <Image
                  src={c.img}
                  alt={c.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 660px"
                  className="object-cover group-hover:scale-[1.035]"
                  style={{ transition: "transform var(--dur-hover) var(--ease-hover)" }}
                />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(20,8,6,0.15) 0%, rgba(20,8,6,0.65) 100%)" }} />
                <div className="absolute inset-0 flex flex-col justify-between" style={{ padding: "36rem", color: "#fff" }}>
                  <h3 className="serif" style={{ fontSize: "36rem", lineHeight: 1, maxWidth: "12ch" }}>{c.title}</h3>
                  <span className="flex items-center" style={{ gap: "8rem", fontSize: "15rem" }}>
                    {c.label}
                    <span className="inline-block group-hover:translate-x-2" style={{ transition: "transform var(--dur-mid) var(--ease)" }}>→</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <ContactForm settings={settings} />
    </main>
  );
}
