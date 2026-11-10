"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

type ScrollApi = {
  /** Smoothed scroll velocity (px per frame), 0 when Lenis is off */
  velocity: () => number;
  scrollTo: (target: string | HTMLElement | number) => void;
  lock: (locked: boolean) => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const velocityRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, autoRaf: false, anchors: { offset: -8, duration: 1.4 } });
    lenisRef.current = lenis;
    const off = lenis.on("scroll", (l) => {
      velocityRef.current = l.velocity;
      ScrollTrigger.update();
    });
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      off();
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Without Lenis (reduced motion), still track velocity for the ticker.
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      if (lenisRef.current) return;
      velocityRef.current = (window.scrollY - lastY) * 0.5;
      lastY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const api = useMemo<ScrollApi>(
    () => ({
      velocity: () => velocityRef.current,
      scrollTo: (target) => {
        const lenis = lenisRef.current;
        if (lenis) {
          lenis.scrollTo(target, { offset: target === "#top" ? 0 : -8, duration: 1.4 });
          return;
        }
        const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
        if (typeof el === "number") window.scrollTo({ top: el });
        else el?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
      },
      lock: (locked) => {
        const lenis = lenisRef.current;
        if (lenis) {
          if (locked) lenis.stop();
          else lenis.start();
        } else {
          document.documentElement.style.overflow = locked ? "hidden" : "";
        }
      },
    }),
    [],
  );

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}

export function useSmoothScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useSmoothScroll must be used inside <SmoothScrollProvider>");
  return ctx;
}
