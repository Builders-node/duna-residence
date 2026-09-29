import { PlanType } from "@/lib/types";

type Kind = "living" | "bed" | "wet" | "hall" | "terrace";

interface Room {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  kind: Kind;
  /** simple furniture hints: "bed" | "sofa" | "kitchen" | "bath" */
  furn?: "bed" | "bedS" | "sofa" | "kitchen" | "bath";
}

interface PlanDef {
  name: string;
  vb: [number, number];
  rooms: Room[];
}

/** Each type has three interchangeable floor-plan layouts. */
const PLANS: Record<PlanType, PlanDef[]> = {
  studio: [
    {
      name: "Layout A",
      vb: [220, 260],
      rooms: [
        { x: 20, y: 20, w: 130, h: 150, label: "Studio", sub: "31.2 m²", kind: "living", furn: "sofa" },
        { x: 150, y: 20, w: 50, h: 90, label: "WC", sub: "4.4 m²", kind: "wet", furn: "bath" },
        { x: 150, y: 110, w: 50, h: 60, label: "Kitchen", kind: "living", furn: "kitchen" },
        { x: 20, y: 170, w: 180, h: 70, label: "Terrace", sub: "4.8 m²", kind: "terrace" },
      ],
    },
    {
      name: "Layout B",
      vb: [220, 260],
      rooms: [
        { x: 20, y: 20, w: 180, h: 42, label: "Kitchen", kind: "living", furn: "kitchen" },
        { x: 20, y: 62, w: 125, h: 118, label: "Studio", sub: "31.2 m²", kind: "living", furn: "sofa" },
        { x: 145, y: 62, w: 55, h: 118, label: "Bath", sub: "4.4 m²", kind: "wet", furn: "bath" },
        { x: 20, y: 180, w: 180, h: 60, label: "Terrace", sub: "4.8 m²", kind: "terrace" },
      ],
    },
    {
      name: "Layout C",
      vb: [220, 260],
      rooms: [
        { x: 20, y: 20, w: 120, h: 170, label: "Studio", sub: "31.2 m²", kind: "living", furn: "sofa" },
        { x: 140, y: 20, w: 60, h: 60, label: "Kitchen", kind: "living", furn: "kitchen" },
        { x: 140, y: 80, w: 60, h: 110, label: "Bath", sub: "4.4 m²", kind: "wet", furn: "bath" },
        { x: 20, y: 190, w: 180, h: 50, label: "Terrace", sub: "4.8 m²", kind: "terrace" },
      ],
    },
  ],
  two: [
    {
      name: "Layout A",
      vb: [320, 280],
      rooms: [
        { x: 20, y: 20, w: 170, h: 130, label: "Living · kitchen", sub: "44.2 m²", kind: "living", furn: "sofa" },
        { x: 20, y: 20, w: 60, h: 45, label: "Kitchen", kind: "living", furn: "kitchen" },
        { x: 190, y: 20, w: 110, h: 100, label: "Bedroom 1", sub: "16.2 m²", kind: "bed", furn: "bed" },
        { x: 190, y: 120, w: 110, h: 90, label: "Bedroom 2", sub: "13.8 m²", kind: "bed", furn: "bedS" },
        { x: 20, y: 150, w: 70, h: 60, label: "Hall", kind: "hall" },
        { x: 90, y: 150, w: 100, h: 60, label: "WC", kind: "wet", furn: "bath" },
        { x: 20, y: 210, w: 280, h: 50, label: "Terrace", sub: "9.6 m²", kind: "terrace" },
      ],
    },
    {
      name: "Layout B",
      vb: [320, 280],
      rooms: [
        { x: 20, y: 20, w: 150, h: 120, label: "Master bedroom", sub: "18.0 m²", kind: "bed", furn: "bed" },
        { x: 170, y: 20, w: 130, h: 120, label: "Living · kitchen", sub: "42.0 m²", kind: "living", furn: "sofa" },
        { x: 170, y: 20, w: 60, h: 42, label: "Kitchen", kind: "living", furn: "kitchen" },
        { x: 20, y: 140, w: 110, h: 70, label: "Bedroom 2", sub: "13.0 m²", kind: "bed", furn: "bedS" },
        { x: 130, y: 140, w: 60, h: 70, label: "WC", kind: "wet", furn: "bath" },
        { x: 190, y: 140, w: 110, h: 70, label: "Hall", kind: "hall" },
        { x: 20, y: 210, w: 280, h: 50, label: "Terrace", sub: "9.6 m²", kind: "terrace" },
      ],
    },
    {
      name: "Layout C",
      vb: [320, 280],
      rooms: [
        { x: 20, y: 20, w: 125, h: 90, label: "Bedroom 1", sub: "15.0 m²", kind: "bed", furn: "bed" },
        { x: 175, y: 20, w: 125, h: 90, label: "Bedroom 2", sub: "13.0 m²", kind: "bed", furn: "bedS" },
        { x: 145, y: 20, w: 30, h: 90, label: "WC", kind: "wet", furn: "bath" },
        { x: 20, y: 110, w: 280, h: 100, label: "Living · kitchen", sub: "46.0 m²", kind: "living", furn: "sofa" },
        { x: 20, y: 110, w: 70, h: 45, label: "Kitchen", kind: "living", furn: "kitchen" },
        { x: 20, y: 210, w: 280, h: 50, label: "Terrace", sub: "9.6 m²", kind: "terrace" },
      ],
    },
  ],
  penthouse: [
    {
      name: "Layout A",
      vb: [420, 320],
      rooms: [
        { x: 20, y: 20, w: 210, h: 150, label: "Great room", sub: "112 m²", kind: "living", furn: "sofa" },
        { x: 20, y: 20, w: 80, h: 55, label: "Island kitchen", kind: "living", furn: "kitchen" },
        { x: 230, y: 20, w: 170, h: 95, label: "Master suite", sub: "28.6 m²", kind: "bed", furn: "bed" },
        { x: 230, y: 115, w: 85, h: 105, label: "Bedroom 2", kind: "bed", furn: "bedS" },
        { x: 315, y: 115, w: 85, h: 105, label: "Bedroom 3", kind: "bed", furn: "bedS" },
        { x: 20, y: 170, w: 90, h: 50, label: "Wardrobe", kind: "hall" },
        { x: 110, y: 170, w: 70, h: 50, label: "Bathroom", kind: "wet", furn: "bath" },
        { x: 180, y: 170, w: 50, h: 50, label: "WC", kind: "wet", furn: "bath" },
        { x: 20, y: 220, w: 380, h: 80, label: "Panoramic terrace", sub: "48 m²", kind: "terrace" },
      ],
    },
    {
      name: "Layout B",
      vb: [420, 320],
      rooms: [
        { x: 20, y: 20, w: 240, h: 150, label: "Great room", sub: "118 m²", kind: "living", furn: "sofa" },
        { x: 20, y: 20, w: 90, h: 55, label: "Island kitchen", kind: "living", furn: "kitchen" },
        { x: 260, y: 20, w: 140, h: 150, label: "Master suite", sub: "32 m²", kind: "bed", furn: "bed" },
        { x: 20, y: 170, w: 120, h: 60, label: "Bedroom 2", kind: "bed", furn: "bedS" },
        { x: 140, y: 170, w: 120, h: 60, label: "Bedroom 3", kind: "bed", furn: "bedS" },
        { x: 260, y: 170, w: 70, h: 60, label: "Bathroom", kind: "wet", furn: "bath" },
        { x: 330, y: 170, w: 70, h: 60, label: "WC", kind: "wet", furn: "bath" },
        { x: 20, y: 230, w: 380, h: 70, label: "Panoramic terrace", sub: "48 m²", kind: "terrace" },
      ],
    },
    {
      name: "Layout C",
      vb: [420, 320],
      rooms: [
        { x: 20, y: 20, w: 150, h: 150, label: "Master suite", sub: "34 m²", kind: "bed", furn: "bed" },
        { x: 170, y: 20, w: 230, h: 150, label: "Great room", sub: "108 m²", kind: "living", furn: "sofa" },
        { x: 170, y: 20, w: 90, h: 55, label: "Island kitchen", kind: "living", furn: "kitchen" },
        { x: 20, y: 170, w: 110, h: 60, label: "Bedroom 2", kind: "bed", furn: "bedS" },
        { x: 130, y: 170, w: 110, h: 60, label: "Bedroom 3", kind: "bed", furn: "bedS" },
        { x: 240, y: 170, w: 70, h: 60, label: "Bathroom", kind: "wet", furn: "bath" },
        { x: 310, y: 170, w: 90, h: 60, label: "Wardrobe", kind: "hall" },
        { x: 20, y: 230, w: 380, h: 70, label: "Panoramic terrace", sub: "48 m²", kind: "terrace" },
      ],
    },
  ],
};

const PLAN_DESC: Record<PlanType, string[]> = {
  studio: ["Open-plan living", "Galley kitchen", "Side bathroom"],
  two: ["Twin bedrooms", "Master + guest", "Bedrooms to front"],
  penthouse: ["Central master suite", "Corner master suite", "West-wing suite"],
};

export function planNames(type: PlanType): string[] {
  return PLANS[type].map((p) => p.name);
}

export function planMeta(type: PlanType): { name: string; desc: string }[] {
  return PLANS[type].map((p, i) => ({ name: p.name, desc: PLAN_DESC[type][i] }));
}

export interface PlanDetail {
  name: string;
  desc: string;
  rooms: { label: string; sub?: string }[];
}

export function planDetail(type: PlanType, variant: number): PlanDetail {
  const defs = PLANS[type];
  const i = Math.min(Math.max(variant, 0), defs.length - 1);
  const plan = defs[i] ?? defs[0];
  return {
    name: plan.name,
    desc: PLAN_DESC[type][i] ?? "",
    rooms: plan.rooms.map((r) => ({ label: r.label, sub: r.sub })),
  };
}

const FILL: Record<Kind, string> = {
  living: "rgba(0,0,0,0.05)",
  bed: "rgba(0,0,0,0.03)",
  wet: "rgba(0,0,0,0.08)",
  hall: "rgba(0,0,0,0.015)",
  terrace: "rgba(0,0,0,0.02)",
};

function Furniture({ r }: { r: Room }) {
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const stroke = "rgba(0,0,0,0.4)";
  switch (r.furn) {
    case "bed":
      return (
        <g stroke={stroke} fill="none" strokeWidth={1}>
          <rect x={cx - 26} y={cy - 18} width={52} height={40} rx={3} />
          <rect x={cx - 26} y={cy - 18} width={52} height={12} rx={2} />
        </g>
      );
    case "bedS":
      return (
        <g stroke={stroke} fill="none" strokeWidth={1}>
          <rect x={cx - 16} y={cy - 20} width={32} height={44} rx={3} />
          <rect x={cx - 16} y={cy - 20} width={32} height={10} rx={2} />
        </g>
      );
    case "sofa":
      return (
        <g stroke={stroke} fill="none" strokeWidth={1}>
          <rect x={r.x + 12} y={r.y + r.h - 34} width={70} height={22} rx={4} />
          <line x1={r.x + 30} y1={r.y + r.h - 12} x2={r.x + 64} y2={r.y + r.h - 12} />
        </g>
      );
    case "kitchen":
      return (
        <g stroke={stroke} fill="none" strokeWidth={1}>
          <rect x={r.x + 6} y={r.y + 6} width={r.w - 12} height={12} rx={2} />
          <line x1={r.x + r.w / 2} y1={r.y + 6} x2={r.x + r.w / 2} y2={r.y + 18} />
        </g>
      );
    case "bath":
      return (
        <g stroke={stroke} fill="none" strokeWidth={1}>
          <rect x={cx - 10} y={cy - 12} width={20} height={24} rx={6} />
          <circle cx={cx + 14} cy={cy + 8} r={4} />
        </g>
      );
    default:
      return null;
  }
}

export default function FloorPlan({
  type,
  variant = 0,
  className,
}: {
  type: PlanType;
  variant?: number;
  className?: string;
}) {
  const defs = PLANS[type];
  const plan = defs[Math.min(Math.max(variant, 0), defs.length - 1)] ?? defs[0];
  const [w, h] = plan.vb;
  const pad = 8;
  return (
    <svg
      viewBox={`0 0 ${w + pad * 2} ${h + pad * 2}`}
      className={className}
      role="img"
      aria-label="Apartment floor plan"
    >
      <g transform={`translate(${pad}, ${pad})`}>
        {/* outer wall */}
        <rect
          x={0}
          y={0}
          width={w}
          height={h}
          rx={4}
          fill="none"
          stroke="rgba(0,0,0,0.7)"
          strokeWidth={2.5}
        />
        {plan.rooms.map((r, i) => (
          <g key={i}>
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              fill={FILL[r.kind]}
              stroke="rgba(0,0,0,0.28)"
              strokeWidth={1}
              strokeDasharray={r.kind === "terrace" ? "4 4" : undefined}
            />
            <Furniture r={r} />
            <text
              x={r.x + r.w / 2}
              y={r.y + r.h / 2 + (r.sub ? -3 : 3)}
              textAnchor="middle"
              className="fill-black"
              style={{
                fontSize: 9,
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                letterSpacing: 0.2,
              }}
            >
              {r.label}
            </text>
            {r.sub && (
              <text
                x={r.x + r.w / 2}
                y={r.y + r.h / 2 + 11}
                textAnchor="middle"
                className="fill-[#929292]"
                style={{ fontSize: 8, letterSpacing: 0.5 }}
              >
                {r.sub}
              </text>
            )}
          </g>
        ))}
        {/* compass */}
        <g transform={`translate(${w - 26}, 26)`} opacity={0.7}>
          <circle r={12} fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth={1} />
          <path d="M0,-9 L3,0 L0,3 L-3,0 Z" fill="#000" />
          <text y={-14} textAnchor="middle" className="fill-black" style={{ fontSize: 7 }}>
            N
          </text>
        </g>
      </g>
    </svg>
  );
}
