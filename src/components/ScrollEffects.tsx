"use client";

import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

/**
 * Page-wide scroll touches that server components opt into with data attributes,
 * plus a final ScrollTrigger refresh once fonts and images have settled.
 * Mount it last so the pinned Events section already exists when positions are measured.
 */
export function ScrollEffects() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // section titles lean in as they arrive: transform only, they are never hidden
      gsap.utils.toArray<HTMLElement>("[data-lean]").forEach((el) => {
        gsap.from(el, { yPercent: 18, skewY: 3, ease: "none", scrollTrigger: { trigger: el, start: "top 98%", end: "top 60%", scrub: true } });
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    ScrollTrigger.sort();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  });

  return null;
}
