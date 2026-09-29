"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Lenis smooth scroll (lerp ~0.1) + smooth anchor jumps + top progress bar. */
export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
    const bar = document.getElementById("progress-bar");

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      if (bar) bar.style.transform = `scaleX(${progress})`;
    });

    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // smooth scroll for same-page anchor links
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const a = (e.target as HTMLElement)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") || "";

      let hash = "";
      if (href.startsWith("#")) hash = href.slice(1);
      else if (href.startsWith("/#") && window.location.pathname === "/") hash = href.slice(2);
      if (!hash) return;

      const el = document.getElementById(hash);
      if (!el) return;

      e.preventDefault();
      e.stopPropagation();
      lenis.scrollTo(el, { offset: -24, duration: 1.3 });
      history.pushState(null, "", "#" + hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onClick, true);
      lenis.destroy();
    };
  }, []);

  return <div id="progress-bar" className="progress" />;
}
