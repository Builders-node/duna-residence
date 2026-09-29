import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import LayoutChrome from "@/components/LayoutChrome";
import { getSiteContent } from "@/lib/site";

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

export const metadata: Metadata = {
  title: "Duna Residence — A private island residence on Roatán",
  description:
    "Beachfront homes at Duna Residence, Próspera · Roatán, Honduras — on the Mesoamerican Reef in the Caribbean. Studios, residences and penthouses with panoramic sea-view terraces.",
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
      </body>
    </html>
  );
}
