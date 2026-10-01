import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import LayoutChrome from "@/components/LayoutChrome";
import { getSiteContent } from "@/lib/site";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const cormorant = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const TITLE = "Duna Residence — A private island residence on Roatán";
const DESC =
  "Beachfront homes at Duna Residence, Próspera · Roatán, Honduras — on the Mesoamerican Reef in the Caribbean. Studios, residences and penthouses with panoramic sea-view terraces.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESC,
  keywords: ["Duna Residence", "Roatán", "Próspera", "Honduras", "Caribbean real estate", "Mesoamerican Reef", "beachfront condo", "island homes"],
  openGraph: {
    title: TITLE,
    description: DESC,
    url: SITE_URL,
    siteName: "Duna Residence",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESC,
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings } = await getSiteContent();
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        <LayoutChrome settings={settings}>{children}</LayoutChrome>
        <Analytics />
      </body>
    </html>
  );
}
