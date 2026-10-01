import { ImageResponse } from "next/og";

export const alt = "Duna Residence — a private island residence on Roatán";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1b100e 0%, #381914 55%, #823224 120%)",
          color: "#f4efe9",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="40" height="40" viewBox="0 0 22 22" fill="none" stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round">
            <path d="M2 20V6L11 2l9 4v14" />
            <path d="M2 20l9-6 9 6" />
          </svg>
          <div style={{ fontSize: 30, letterSpacing: 1, fontWeight: 600 }}>Duna Residence</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05, maxWidth: 900 }}>
            A private island residence on Roatán
          </div>
          <div style={{ fontSize: 30, color: "rgba(244,239,233,0.8)" }}>
            Próspera · Roatán, Honduras — on the Mesoamerican Reef
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
