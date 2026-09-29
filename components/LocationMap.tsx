import type { SiteSettings } from "@/lib/site";

/** Full-bleed location map, driven by the editable site settings. */
export default function LocationMap({
  settings,
}: {
  settings: Pick<SiteSettings, "address" | "mapLat" | "mapLng" | "mapZoom">;
}) {
  const { address, mapLat: lat, mapLng: lon, mapZoom: zoom } = settings;

  // derive a bounding box around the point from the zoom level
  const span = 0.5 * Math.pow(2, 13 - zoom); // ~0.5° at zoom 13
  const bbox = [lon - span, lat - span * 0.6, lon + span, lat + span * 0.6].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lon}`;
  const directions = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;

  const ns = lat >= 0 ? "N" : "S";
  const ew = lon >= 0 ? "E" : "W";
  const coords = `${Math.abs(lat).toFixed(3)}° ${ns}, ${Math.abs(lon).toFixed(3)}° ${ew}`;

  return (
    <section className="relative" id="location">
      <div className="relative" style={{ width: "100%", height: "82vh", minHeight: "480px", overflow: "hidden" }}>
        <iframe
          title={`Location — ${address}`}
          src={src}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            border: 0,
            filter: "grayscale(1) contrast(1.05) brightness(1.02)",
          }}
        />

        {/* address card */}
        <div
          className="absolute"
          style={{ left: "40rem", bottom: "40rem", maxWidth: "min(420rem, 88vw)" }}
        >
          <div
            style={{
              background: "#000",
              color: "#f4efe9",
              borderRadius: "10rem",
              padding: "36rem",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            <div className="flex items-center" style={{ gap: "10rem" }}>
              <span style={{ height: "9rem", width: "9rem", borderRadius: "999px", background: "var(--accent)" }} />
              <span className="eyebrow" style={{ color: "rgba(244,239,233,0.7)" }}>Our location</span>
            </div>
            <h3 className="serif" style={{ fontSize: "40rem", marginTop: "18rem", lineHeight: 1.05, color: "#fff" }}>
              {address}
            </h3>
            <p style={{ marginTop: "12rem", fontSize: "15rem", color: "rgba(244,239,233,0.72)" }}>
              {coords}
            </p>
            <a
              href={directions}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--onaccent"
              style={{ marginTop: "24rem" }}
            >
              Get directions →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
