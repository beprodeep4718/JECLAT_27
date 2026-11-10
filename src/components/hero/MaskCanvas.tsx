"use client";

import { useEffect, useRef, type RefObject } from "react";
import { createPortal } from "react-dom";
import { createMaskScene } from "@/lib/mask-scene";
import { cssToken, gsap, prefersReducedMotion } from "@/lib/gsap";
import { useBeat } from "@/components/providers/BeatProvider";
import styles from "./Hero.module.css";

type Props = {
  slotRef: RefObject<HTMLDivElement | null>;
  heroRef: RefObject<HTMLElement | null>;
  src: string;
  onReady: () => void;
};

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function hexToRgb(hex: string): [number, number, number] {
  const m = hex.replace("#", "").match(/.{2}/g) ?? ["f5", "c7", "44"];
  return [parseInt(m[0], 16) / 255, parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255];
}

/**
 * Full-viewport WebGL layer (portalled to <body> so falling shards can drift over the
 * next sections). The mask tracks the hero's slot element; scrolling the hero
 * away drives the shatter from 0 → 1.
 */
export default function MaskCanvas({ slotRef, heroRef, src, onReady }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isOn, level } = useBeat();
  const beatOn = useRef(isOn);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    beatOn.current = isOn;
    onReadyRef.current = onReady;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;

    let disposed = false;
    let scene: ReturnType<typeof createMaskScene> | null = null;
    const pointer = { x: 0, y: 0 };
    const intro = { v: 0.5 };
    let readySent = false;

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const tick = (_time: number, deltaMs: number) => {
      const slot = slotRef.current;
      const hero = heroRef.current;
      if (!scene || !slot || !hero) return;
      const scrollP = Math.min(1, Math.max(0, (window.scrollY - 24) / (hero.offsetHeight * 0.72)));
      const progress = Math.max(scrollP, intro.v);
      if (progress >= 0.999) {
        canvas.style.visibility = "hidden";
        return;
      }
      canvas.style.visibility = "visible";
      const beat = level.current;
      const crackGlow = smooth(0, 0.06, progress) * (1 - smooth(0.2, 0.45, progress)) + (beatOn.current ? beat * 0.9 : 0);
      scene.render({
        rect: slot.getBoundingClientRect(),
        progress,
        beat,
        pointer,
        crackGlow,
        dt: Math.min(0.05, deltaMs / 1000),
      });
      if (!readySent) {
        readySent = true;
        onReadyRef.current();
      }
    };

    const img = new Image();
    img.decoding = "async";
    img.src = src;
    img
      .decode()
      .then(() => {
        if (disposed) return;
        try {
          scene = createMaskScene({ canvas, image: img, glow: blendToWhite(hexToRgb(cssToken("--haldi")), 0.45) });
        } catch {
          return; // no WebGL: the static logo stays visible
        }
        gsap.to(intro, { v: 0, duration: 2.2, ease: "power3.out", delay: 0.15 });
        window.addEventListener("pointermove", onPointer, { passive: true });
        gsap.ticker.add(tick);
      })
      .catch(() => {});

    return () => {
      disposed = true;
      gsap.ticker.remove(tick);
      gsap.killTweensOf(intro);
      window.removeEventListener("pointermove", onPointer);
      scene?.dispose();
    };
  }, [slotRef, heroRef, src, level]);

  // Only ever rendered in the browser (loaded with ssr: false), so <body> is available.
  return createPortal(<canvas ref={canvasRef} className={styles.gl} aria-hidden="true" />, document.body);
}

function blendToWhite([r, g, b]: [number, number, number], t: number): [number, number, number] {
  return [r + (1 - r) * t, g + (1 - g) * t, b + (1 - b) * t];
}
