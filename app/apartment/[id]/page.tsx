import { notFound } from "next/navigation";
import Link from "next/link";
import { formatPrice, formatRate, unitPrice, ROOM_LABEL, planTypeLabel } from "@/lib/data";
import { getStoredApartments } from "@/lib/store";
import { getSiteContent } from "@/lib/site";
import PlanViewer from "@/components/PlanViewer";
import RevealImage from "@/components/RevealImage";
import RevealLines from "@/components/RevealLines";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { FavoriteButton } from "@/components/Favorites";
import ContactForm from "@/components/ContactForm";

export const dynamic = "force-dynamic";

export default async function TypePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const all = await getStoredApartments();
  const { settings } = await getSiteContent();
  const apt = all.find((a) => a.id === id);
  if (!apt) notFound();

  const isPent = apt.planType === "penthouse";
  const idx = all.findIndex((a) => a.id === apt.id);
  const next = all[(idx + 1) % all.length];

  const cover = "/images/plan-interior.png";
  const gallery = [
    {
      src: "/images/living.png",
      title: "The great room",
      text: "Floor-to-ceiling glazing opens the living space onto the terrace and the water.",
      ar: "4 / 4.6",
    },
    {
      src: "/images/terrace.png",
      title: "Private terrace",
      text: `Outdoor living framed by the horizon — up to ${apt.terrace} m² of your own sky.`,
      ar: "4 / 5.8",
    },
    {
      src: "/images/lobby.png",
      title: "Arrival & lobby",
      text: "A five-star arrival: 24/7 concierge, private entrance and a curated lounge.",
      ar: "4 / 4.6",
    },
    {
      src: "/images/tower-exterior.png",
      title: "On the water",
      text: "A slender tower where architecture meets the calm of the coast.",
      ar: "4 / 5.8",
    },
  ];

  const meta: [string, string][] = [
    ["Location", "Próspera · Roatán, Honduras"],
    ["Type", planTypeLabel(apt.planType)],
    ["Total area", `${apt.area} m²`],
    ["Living area", `${apt.livingArea} m²`],
    ["Terrace", `${apt.terrace} m²`],
    ["Ceilings", `${apt.ceiling} m`],
    ["Rooms", ROOM_LABEL[apt.rooms]],
    ["Orientation", apt.orientation],
    ["View", apt.view],
    ["Price", formatRate(apt.pricePerM2)],
  ];

  const intro = `A ${planTypeLabel(apt.planType).toLowerCase()} home of ${apt.area} m², oriented ${apt.orientation.toLowerCase()} toward a ${apt.view.toLowerCase()}. Floor-to-ceiling glazing, ${apt.ceiling} m ceilings and a private ${apt.terrace} m² terrace frame the water and the coast beyond.`;

  return (
    <main>
      {/* ── TITLE BLOCK ── */}
      <section className="wrap" style={{ paddingTop: "180rem", paddingBottom: "48rem" }}>
        <div
          className="flex items-center mb-8"
          style={{ gap: "8rem", fontSize: "13rem", color: "var(--gray-3)" }}
        >
          <Link href="/" className="link">Residence</Link>
          <span style={{ color: "var(--gray-e2)" }}>/</span>
          <Link href="/apartments" className="link">Home types</Link>
          <span style={{ color: "var(--gray-e2)" }}>/</span>
          <span style={{ color: "var(--black)" }}>{apt.name}</span>
        </div>

        <div className="flex items-center" style={{ gap: "12rem", marginBottom: "28rem" }}>
          <span style={{ height: "9rem", width: "9rem", borderRadius: "999px", background: "#000" }} />
          <span className="eyebrow">{planTypeLabel(apt.planType)} · {apt.available} available</span>
        </div>

        <RevealLines as="h1" className="fn-h1" lines={[apt.name]} />

        <div
          className="flex flex-col md:flex-row md:items-end md:justify-between"
          style={{ marginTop: "40rem", gap: "24rem" }}
        >
          <p style={{ fontSize: "20rem", color: "var(--gray-3)", maxWidth: "40ch" }}>
            {apt.blurb}
          </p>
          <div className="flex items-end" style={{ gap: "10rem", lineHeight: 0.9 }}>
            <CountUp
              value={apt.area}
              decimals={1}
              className="fn-h1"
              style={{ color: "var(--gray-e2)", lineHeight: 0.8 }}
            />
            <span className="eyebrow" style={{ paddingBottom: "18rem" }}>m² total</span>
          </div>
        </div>
      </section>

      {/* ── COVER ── */}
      <RevealImage
        src={cover}
        alt={apt.name}
        priority
        style={{ height: "82vh", width: "100%" }}
      />

      {/* ── INFO + INTRO ── */}
      <section className="wrap" style={{ paddingTop: "120rem", paddingBottom: "40rem" }}>
        <div className="grid lg:grid-cols-2" style={{ gap: "64rem" }}>
          <div className="grid grid-cols-2" style={{ columnGap: "40rem", rowGap: "36rem", height: "fit-content" }}>
            {meta.map(([label, value]) => (
              <Reveal key={label}>
                <div className="eyebrow">{label}</div>
                <div style={{ fontSize: "20rem", marginTop: "8rem", borderTop: "1px solid var(--gray-e2)", paddingTop: "8rem" }}>
                  {value}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <p style={{ fontSize: "36rem", lineHeight: 1.18, letterSpacing: "-0.02em", maxWidth: "26ch" }}>
              {intro}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FLOOR PLAN ── */}
      <section id="plan" className="wrap scroll-mt-28" style={{ paddingTop: "80rem", paddingBottom: "80rem" }}>
        <div className="flex items-baseline justify-between" style={{ marginBottom: "12rem" }}>
          <h2 className="fn-h3">Layouts</h2>
          <span className="eyebrow">3 options · {apt.area} m²</span>
        </div>
        <p style={{ color: "var(--gray-3)", fontSize: "16rem", lineHeight: 1.45, maxWidth: "54ch", marginBottom: "32rem" }}>
          Possible layout configurations for this home type — pick the arrangement that best suits how you live.
        </p>
        <PlanViewer type={apt.planType} />
      </section>

      {/* ── EDITORIAL GALLERY ── */}
      <section className="wrap" style={{ paddingTop: "40rem", paddingBottom: "100rem" }}>
        <div className="grid lg:grid-cols-2 items-end" style={{ gap: "40rem", marginBottom: "64rem" }}>
          <RevealLines as="h2" className="fn-h3" lines={["A closer look", "at your home."]} />
          <p style={{ color: "var(--gray-3)", fontSize: "16rem", lineHeight: 1.45, maxWidth: "30ch" }}>
            Every detail — from the light to the materials — considered.
          </p>
        </div>

        <div className="egallery">
          {gallery.map((g) => (
            <figure key={g.src}>
              <RevealImage src={g.src} alt={g.title} style={{ aspectRatio: g.ar, width: "100%" }} />
              <figcaption style={{ marginTop: "18rem" }}>
                <div className="serif" style={{ fontSize: "19rem", letterSpacing: "-0.01em" }}>
                  {g.title}
                </div>
                <p style={{ color: "var(--gray-3)", fontSize: "14rem", lineHeight: 1.45, marginTop: "8rem", maxWidth: "34ch" }}>
                  {g.text}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ── STATEMENT ── */}
      <section className="wrap" style={{ paddingTop: "60rem", paddingBottom: "100rem" }}>
        <RevealLines
          as="h2"
          className="fn-h2"
          lines={["Made for", "waterfront living"]}
          style={{ marginBottom: "56rem" }}
        />
        <div className="grid lg:grid-cols-2" style={{ gap: "48rem", maxWidth: "1100rem" }}>
          <Reveal>
            <p style={{ fontSize: "18rem", lineHeight: 1.5, color: "var(--gray-3)" }}>
              Every plan in Duna Residence is drawn around light, air and the view.
              Living spaces open fully onto the terrace, dissolving the line between
              the interior and the horizon.
            </p>
          </Reveal>
          <Reveal>
            <p style={{ fontSize: "18rem", lineHeight: 1.5, color: "var(--gray-3)" }}>
              Materials are quiet and tactile — warm stone, oak and bronze — chosen to
              age gracefully. The result is a home that feels calm, private and
              unmistakably crafted.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── PRICE + CTA · accent block (Desire → Action) ── */}
      <section style={{ background: "var(--accent)", color: "#f4efe9" }}>
        <div className="wrap" style={{ paddingTop: "100rem", paddingBottom: "110rem" }}>
          {/* scarcity — Desire */}
          <div
            className="flex items-center"
            style={{ gap: "10rem", marginBottom: "48rem", fontSize: "14rem", color: "#fff" }}
          >
            <span style={{ height: "8rem", width: "8rem", borderRadius: "999px", background: "#fff" }} />
            Only {apt.available} {apt.name.toLowerCase()} homes remain at this price.
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between" style={{ gap: "40rem" }}>
            <div>
              <div className="eyebrow" style={{ color: "rgba(244,239,233,0.65)" }}>Price · per m²</div>
              <div className="fn-h2" style={{ marginTop: "12rem", lineHeight: 0.9, color: "#fff" }}>
                {formatRate(apt.pricePerM2)}
              </div>
              <div style={{ fontSize: "14rem", color: "rgba(244,239,233,0.72)", marginTop: "16rem" }}>
                from {formatPrice(unitPrice(apt))} · {apt.area} m² total
              </div>
            </div>
            <div className="flex flex-wrap" style={{ gap: "12rem" }}>
              <a href="#contact" className="btn btn--onaccent">Book a viewing</a>
              <FavoriteButton id={apt.id} variant="text" light />
              <Link href="/apartments" className="btn btn-light">← All types</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM ── */}
      <ContactForm defaultInterest={apt.name} settings={settings} />

      {/* ── NEXT TYPE ── */}
      <Link
        href={`/apartment/${next.id}`}
        className="group block bg-black text-white"
        style={{ paddingTop: "100rem", paddingBottom: "100rem" }}
      >
        <div className="wrap">
          <div className="eyebrow" style={{ color: "#929292" }}>Next home type</div>
          <div className="fn-h1 flex items-center" style={{ marginTop: "20rem", gap: "40rem" }}>
            <span className="group-hover:opacity-70" style={{ transition: "opacity var(--dur-fast) var(--ease)" }}>
              {next.name}
            </span>
            <span
              className="inline-block group-hover:translate-x-4"
              style={{ transition: "transform var(--dur-mid) var(--ease)" }}
            >
              →
            </span>
          </div>
          <div style={{ marginTop: "20rem", fontSize: "18rem", color: "#929292" }}>
            {planTypeLabel(next.planType)} · {next.area} m² · {formatRate(next.pricePerM2)}
          </div>
        </div>
      </Link>
    </main>
  );
}
