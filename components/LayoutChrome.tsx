"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import CookieConsent from "@/components/CookieConsent";
import { FavoritesProvider } from "@/components/Favorites";
import type { SiteSettings } from "@/lib/site";

/** Renders the public site chrome, but skips it on admin routes. */
export default function LayoutChrome({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: SiteSettings;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <FavoritesProvider>
      <SmoothScroll />
      <Header settings={settings} />
      {children}
      <Footer settings={settings} />
      <CookieConsent />
    </FavoritesProvider>
  );
}
